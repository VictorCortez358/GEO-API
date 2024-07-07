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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS for the API
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
