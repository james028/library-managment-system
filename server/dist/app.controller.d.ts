import { AppService } from './app.service.js';
import { DatabaseService } from './database/database.service.js';
export declare class AppController {
    private readonly appService;
    private readonly databaseService;
    constructor(appService: AppService, databaseService: DatabaseService);
    getHello(): string;
    testDatabase(): Promise<{
        current_database: string;
        current_user: string;
    }>;
}
