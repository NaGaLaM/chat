import {UserModel} from "../models";
import {uuid, v4} from 'uuid';
import UserDto from "../dto/userDto";
import TokenService from "./token.service";
import bcrypt from 'bcrypt'

export default class UserService {
    static async register(data){ 
        const activationLink = v4();
        data.activationLink=activationLink
        const password = await bcrypt.hash(data.password,3);
        data.password = password
        const user = await UserModel.register(data);
        if(typeof user === 'string') {
            return user
        }else{
            const userdto = new UserDto(user.id,user.username,false) 
            const tokens = await TokenService.generateToken({...userdto});        
            return {
                ...tokens,
                user
            }
        }
    }

    static async login (data) {
        const user = await UserModel.login(data);
        if(!user[0]){
            return 'username is incorrect';
        }else{
            const password = await bcrypt.compare(data.password,user[0].password);
            if(password) {
                const userDto = new UserDto(user[0].id,user[0].username,user[0].isActivated);
                const tokens = await TokenService.generateToken({...userDto});
                return {
                    ...tokens,
                    user
                }
            }return 'password is incorrect'
        }
    }

    static async activate(data) {
        return UserModel.activate(data);
    }

    static async getUser() {
        return UserModel.getUser();
    }
}
