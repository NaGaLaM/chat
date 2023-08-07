import { urlencoded } from 'body-parser';
import express from 'express';
import userApi from './user.api'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());


app.use('/',userApi);

export default app;
