import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'user1@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Identificador de la ciudad del usuario',
        example: '0c115360-1aeb-4f23-b45b-978951192339'
    })
    @IsString()
    @IsNotEmpty()
    cityId: string;
}
