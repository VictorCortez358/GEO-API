import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';


// Function to generate a random code
const generateCodeVerification = () => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return code.toString();
}

// Create a transporter to send the email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sybmarketplace@gmail.com',
        pass: 'ipphardrbiaxnhtp'
    }
});


// This function will be used to send the email to the user with the code
const sendEmail = (email: string, code: string) => {
    const mailOptions = {
        from: 'sybmarketplace@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Tu código de verificación es: ${code}`
    };

    return transporter.sendMail(mailOptions);
}

// This array will be used to store the code verification
const codeVerification = [];

@Injectable()
export class AuthService {

    constructor (
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    // This method will be used to sign in the user
    async SignIn(signIn: SignInDto): Promise<{ message: string, token: string, role: string, name: string }> {
        const user = await this.usersService.findOneUserByEmail(signIn.email);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the password is correct and decrypt it
        if (user?.password && !(await bcrypt.compare(signIn.password, user.password))) {
            throw new Error('Invalid password');
        }
        
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            token: token,
            role: user.role,
            name: user.name 
        };
    }
    
    // This method will be used to sign up the user
    async SignUp(user: CreateUserDto): Promise<String>{
        const userExist = await this.usersService.findOneUserByEmail(user.email);
        if(userExist){
            throw new Error('User already exists');
        }
        

        // Hash the password 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const newUser = await this.usersService.createUser(user);

        if(newUser){
            return 'User created successfully';
        }{
            throw new Error('Error creating user');
        }
    }
    
    // This method will be used to send the code to the user's email
    async ForgotPassword(email: string): Promise<String>{
        const user = await this.usersService.findOneUserByEmail(email);
        if(!user){
            throw new Error('This email is not registered');
        }
        const code = generateCodeVerification();
        codeVerification.push({ email, code });
        sendEmail(email, code);
        return 'Code sent successfully';
    }

    async restorePassword(email: string, code: string, password: string): Promise<String> {
        const user = await this.usersService.findOneUserByEmail(email);
        if (!user) {
            throw new Error('This email is not registered');
        }
        const codeIndex = codeVerification.findIndex(c => c.email === email && c.code === code);
        if (codeIndex === -1) {
            throw new Error('Invalid code');
        }
        
        // Hash the password and update it
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await this.usersService.updatePassword(user.id, hashedPassword);
        codeVerification.splice(codeIndex, 1);
        return 'Password restored successfully';
    }
}
