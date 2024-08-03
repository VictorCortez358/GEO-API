import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class SignInDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario o admin',
        example: 'user1@gmail.com o superadmin@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario o admin',
        example: 'password123 o superadmin'
    })
    @IsNotEmpty()
    password: string;
}