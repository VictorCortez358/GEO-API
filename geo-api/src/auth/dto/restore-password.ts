import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'user1@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Código de restauración',
        example: '123456'
    })
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'Nueva contraseña del usuario',
        example: 'password123'
    })
    @IsNotEmpty()
    password: string;
}