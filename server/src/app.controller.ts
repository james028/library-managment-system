import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { DatabaseService } from './database/database.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly databaseService: DatabaseService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-test')
  async testDatabase() {
    const result = await this.databaseService.query<{
      current_database: string;
      current_user: string;
    }>(`
      SELECT
        current_database(),
        current_user;
    `);

    return result.rows[0];
  }
}
