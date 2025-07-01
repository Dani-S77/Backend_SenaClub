import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('report')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getFullReport() {
    return this.reportsService.getReport();
  }
}