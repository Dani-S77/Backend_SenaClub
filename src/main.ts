import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Esto te ayudará a ver en la consola todas las variables de entorno cargadas
  console.log('Variables de entorno:', process.env);

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para permitir conexiones desde el frontend
  app.useGlobalPipes(new ValidationPipe()); // Aplica validaciones globales
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();