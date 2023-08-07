import jwt  from "jsonwebtoken";
import config from '../config/variables.config';

export default class TokenService {
    
    static async generateToken(data) {
        console.log(data);
        const accessToken =jwt.sign(data,config.AUTH.JWT_ACCESS_SECRET,{expiresIn:config.AUTH.ACCESS_TOKEN_ACTIVE_TIME});
        const refreshToken = jwt.sign(data,config.AUTH.JWT_REFRESH_SECRET,{expiresIn:config.AUTH.REFRESH_TOKEN_ACTIVE_TIME});
        return {
            accessToken
            }
    }

    static async vaildToken(req,res,next){
        if(!req.cookies.accessToken){
            res.send('Please authorize befora join')
        }else{
            const accessToken = req.cookies.accessToken.split(' ')[1]
            jwt.verify(accessToken,config.AUTH.JWT_ACCESS_SECRET,(error,user) => {
                if(error) {
                    res.send('Please Login befora join');
                }else{
                    const {id,username} = user
                    res.json({id,username});
                }
            })    
        }
    }

    static async middleware(req,res,next) {
        if(!req.cookies.accessToken){
            res.send('Please authorize befora join')
        }else{
            const accessToken = req.cookies.accessToken.split(' ')[1]
            jwt.verify(accessToken,config.AUTH.JWT_ACCESS_SECRET,(error,user) => {
                if(error) {
                    res.send('Please Login befora join');
                }else{
                    next()
                }
            })    
        }
    }

    static async getUserDataFromRequest(req) {
        if(!req.cookies.accessToken){
            res.send('Please authorize befora join')
        }else{

            const accessToken = req.cookies.accessToken.split(' ')[1]
          const user = jwt.verify(accessToken,config.AUTH.JWT_ACCESS_SECRET,(error,user) => {
                if(error) {
                    res.send('Please Login befora join');
                }else{
                    console.log(2);
                    const {id,username} = user
                    return user;
                }
            })    
            return user;
        }
    }
}