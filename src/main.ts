import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── 1️⃣ JSON parser + captura de rawBody ───────────────────────
  app.use(
    bodyParser.json({
      /**
       * El método `verify` recibe el buffer original antes de parsearlo.
       * Aquí lo guardamos en `req.rawBody` para poder inspeccionarlo luego.
       */
      verify: (req: any, _res, buf: Buffer, _encoding) => {
        req.rawBody = buf.toString();
      },
    }),
  );

  // ─── 2️⃣ Middleware para loguear el rawBody capturado ────────────
  app.use((req: any, _res, next) => {
    console.log('🧩 [RAW BODY]:', req.rawBody);
    next();
  });

  // ─── 3️⃣ CORS ────────────────────────────────────────────────────
  app.enableCors({
  origin: ['http://localhost:5173', 'https://desarrollodeaplicacion.vercel.app'],
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // ─── 4️⃣ Validación global (DTOs) ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // forbidNonWhitelisted: false, // opcional, según necesites
    }),
  );

  await app.listen(3000);
  console.log(`NestJS corriendo en http://localhost:3000`);
}
bootstrap();


//npm run start:dev