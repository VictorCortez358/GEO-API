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
}