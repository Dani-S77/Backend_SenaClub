import { Body, Post, Get, Controller } from '@nestjs/common';
import { sign } from 'crypto';
import { NewsController } from './new.controller';
import { NewsService } from './new.service';

export class NewsModule {
  constructor() {
    // Simulación de la estructura de un módulo sin @Module
    this.controllers = [NewsController];
    this.providers = [NewsService];
  }

  private controllers: any[] = [];
  private providers: any[] = [];

  getControllers(): any[] {
    return this.controllers;
  }

  getProviders(): any[] {
    return this.providers;
  }
}