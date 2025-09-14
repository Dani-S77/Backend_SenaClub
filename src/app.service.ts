import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'https://desarrollodeaplicacion.vercel.app';
  }
}
