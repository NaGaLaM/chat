import express from 'express';
import { UserController } from '../controller';
import {TokenService} from '../services';
const router = express.Router();

router.get('/profile',TokenService.vaildToken,UserController.getUser);
router.get('/activate/:link',UserController.activate);
router.get('/people',TokenService.middleware,UserController.getUser)
router.get('/messages/:id',TokenService.middleware,UserController.getMessages)

router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.post('/logout',UserController.logout)

export default router;