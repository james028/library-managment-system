import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  getSettings() {
    return this.settingsRepository.getAllSettings();
  }

  findByKeys(keys: string[]) {
    return this.settingsRepository.findByKeys(keys);
  }

  async update(changes: Record<string, unknown>, userId: string) {
    const client = await this.databaseService.getClient();

    try {
      client.query('BEGIN');

      const updated = [];
      for (const [key, value] of Object.entries(changes)) {
        updated.push(
          await this.settingsRepository.updateValue(client, key, value, userId),
        );
      }

      client.query('COMMIT');

      return { updated };
    } catch (error) {
      client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getFineRatePerDay(): Promise<number> {
    const key = 'fines.per_day_amount';
    const setting = await this.settingsRepository.findByKey(key);

    if (!setting) {
      return 1.0;
    }

    const value = Number(setting?.value);

    if (Number.isNaN(value) || value < 0) {
      throw new Error(
        `Invalid setting value for fine_rate_per_day: ${setting.value}`,
      );
    }

    return value;
  }
}
