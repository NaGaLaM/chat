import {TokenService, UserService} from "../services";
import Cookies from 'universal-cookie';
import { MessagesModel } from "../models";

const cookies = new Cookies()

export default class UserController {
    static async register (req,res,next) {
        const data = req.body;
        try {
            const result = await UserService.register(data);
            const {accessToken} = result
            if(typeof result === 'string'){
                res.json(result)
            }else{
                res.clearCookie('accessToken')            
                res.cookie('accessToken',`Bearer ${accessToken}`,{ maxAge: 21600000 })
                const {username,id} = result.user;
                res.json({username,id});
            }
        } catch (error) {
            console.log(error,'error register');
            
        }
    }



    static async login(req,res,next) {
        const {username,password} = req.body;
        try {
            const user = await UserService.login({username,password});
            if(typeof user === 'string'){
                res.json(user);
            }else{
                res.clearCookie('accessToken');            
                res.cookie('accessToken',`Bearer ${user.accessToken}`,{maxAge:216000000});
                delete user.accessToken;
                res.json(user)
            }
        } catch (error) {
            next(error)
        }
    }


    static async logout (req,res,next) {
        try {
            res.clearCookie('accessToken')            
            res.send()
        } catch (error) {
            console.log(error);
        }
    }
    
    static async activate(req,res,next){
        const data = req.params.link;
        try {
            const answer = await UserService.activate(data);
            if(answer){
                res.json(answer);
            }else {
                res.json('invalid activation url');
            }
        } catch (error) {
            console.log(error);
        }
    }


    static async getUser(req,res,next) {
        try {
            const users = await UserService.getUser()
            res.send(users);
        } catch (error) {
            console.log(error);
        }
    }

    static async getMessages(req,res,next){
        try {
            const {id} = req.params;
            const userData = await TokenService.getUserDataFromRequest(req);
            const ourUserId = userData.id
            const messages = await MessagesModel.getMessages(ourUserId,id)
            res.send(messages)
        } catch (error) {
            console.log(error);
        }
    }
}