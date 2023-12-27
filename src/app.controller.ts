import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/* 

 * Twaapp
 *
 * Copyright 2023 Gabriel Couto
*/
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
