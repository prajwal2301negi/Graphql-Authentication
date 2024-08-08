import JWT from 'jsonwebtoken'
import {prismaClient} from '../lib/db'
import { createHmac, randomBytes } from 'crypto'


// make dotenv file for it
const SECRET_KEY = 'secret'

export interface CreateUserPayload{
    firstName: string,
    lastName:string,
    email:string,
    password: string
}

export interface getUserTokenPayload{
    email:string;
    password:string;
}

class UserService{

    private static generateHash(salt: string, password: string){
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
        return hashedPassword;    
    }

    public static async createUser(payload: CreateUserPayload){
        const {firstName, lastName, email, password} = payload
        // creating Hash Algorithm
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt,password);
        return await prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                profileImageURL: '',
                salt:salt,
            }
        })
    }

    private static async getUserByEmail(email: string){
        return await prismaClient.user.findUnique({where:{email}})
    }

    public static async getUserToken(payload: getUserTokenPayload){
        const{email,password} = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user){
            throw new Error('user not found')
        }

        const userSalt = user.salt
        const userHashPassword = UserService.generateHash(userSalt, password)

        if(userHashPassword!==user.password) throw new Error('Incorrect Password')

        // Generate Token
        const token = JWT.sign({email}, SECRET_KEY, {expiresIn:'1h'});
        return token;

    }
}

export default UserService;