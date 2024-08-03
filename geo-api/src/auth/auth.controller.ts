import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in-dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password';
import { RestorePasswordDto } from 'src/users/dto/restore-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    signIn(@Body() body: SignInDto) {
        return this.authService.SignIn(body);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    @ApiOperation({ summary: 'Registrarse' })
    @ApiResponse({ status: 201, description: 'Registro exitoso.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    signUp(@Body() body: CreateUserDto) {
        return this.authService.SignUp(body);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgotPassword')
    @ApiOperation({ summary: 'Recuperar contraseña' })
    @ApiResponse({ status: 200, description: 'Correo de recuperación enviado.' })
    @ApiResponse({ status: 404, description: 'Correo no encontrado.' })
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'user1@gmail.com'
    })
    forgotPassword(@Body() body: ForgotPasswordDto) {
        return this.authService.ForgotPassword(body.email);
    }

    @HttpCode(HttpStatus.OK)
    @Post('restorePassword')
    @ApiOperation({ summary: 'Restaurar contraseña' })
    @ApiResponse({ status: 200, description: 'Contraseña restaurada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Código de restauración inválido.' })
    restorePassword(@Body() body: RestorePasswordDto) {
        return this.authService.restorePassword(body.email, body.code, body.newPassword);
    }
}
