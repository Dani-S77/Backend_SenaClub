import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para permitir conexiones desde el frontend
  app.useGlobalPipes(new ValidationPipe()); // Agrega validaciones globales
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

