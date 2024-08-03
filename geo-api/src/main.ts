import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';


async function bootstrap() {
  // Load environment variables
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('S&B API')
    .setDescription('API para la aplicación de compra y venta de productos S&B')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use((req, res, next) => {
    if (req.path === '/') {
      return res.redirect('/api');
    }
    next();
  });


  // Enable CORS for the API
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
