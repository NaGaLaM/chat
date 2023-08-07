// Standard modules
import http from 'http';
import 'dotenv/config';
import 'regenerator-runtime';
import WebSocket from 'ws';
// Modules from this project
import { LoggerUtil } from '../utils';
import App from '../app';
import jwt from 'jsonwebtoken';
import { MessagesModel } from '../models';
// Constants
import config from '../config/variables.config';
import { name } from '../../package.json';
import { setTimeout } from 'timers/promises';

const { PORT } = config;

const init = async () => {
  const server = http.createServer(App.app);
  App.init(server);
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (connection, req) => {

    connection.isAlive = true

    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        connection.terminate();
        console.log('dead');
      },1000)
    },5000)

    connection.on('pong',()=> {
      clearTimeout(connection.deathTimer);
    })

    const accessToken = req.headers.cookie.split('accessToken=Bearer%20')[1]
    jwt.verify(accessToken, config.AUTH.JWT_ACCESS_SECRET, (error, user) => {
      if (error) {
        throw error;
      } else {
        const { id, username } = user
        connection.userId = id;
        connection.username = username;
      }
    })

    connection.on('message', async (message, isBinary) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;
      if (recipient && text) {
        try {
         const result =  await MessagesModel.saveMessages({sender:connection.userId,recipient,text});
         [...wss.clients]
            .filter(c => c.userId == recipient)
            .forEach(c => c.send(JSON.stringify({text:text,sender:connection.userId,recipient,id:result.id})));
          } catch (error) {
           console.log(error); 
          }  
        } 
    })

    const a = [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
      }))
    })
  })

  wss.on('close', (data) => {
    console.log('disconnected',data);
  })

  


  const _onError = (error) => {
    LoggerUtil.error(error.message);

  };

  const _onListening = () => {
    const address = server.address();
    const bind = typeof address === 'string'
      ? `pipe ${address}`
      : `${address.port}`;

    LoggerUtil.info(`${name} started:`);
    LoggerUtil.info(`\tPort: ${bind}`);
    LoggerUtil.info(`\tStart date: ${(new Date()).toUTCString()} \n`);
  };

  server.listen(PORT);
  server.on('error', _onError);
  server.on('listening', _onListening);
};

export default init().catch(LoggerUtil.error);
