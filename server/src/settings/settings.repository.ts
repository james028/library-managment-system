import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

type SettingType = 'int' | 'decimal' | 'bool' | 'string';

export interface SettingRow {
  key: string;
  value: string;
  type: SettingType;
  updated_at: Date;
  updated_by: string | null;
}

type SettingKeyRow = Pick<SettingRow, 'key' | 'type'>;

@Injectable()
export class SettingsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllSettings(): Promise<SettingRow[]> {
    const results = await this.databaseService.query<SettingRow>(
      `
        SELECT key,
               value,
               type,
               updated_at,
               updated_by,
               description
        FROM settings
        ORDER BY key ASC;
    `,
      [],
    );

    return results.rows;
  }

  async findByKeys(keys: string[]): Promise<SettingKeyRow[]> {
    const results = await this.databaseService.query<SettingKeyRow>(
      `SELECT key, type, value
                                                                     FROM settings
                                                                     WHERE key = ANY ($1)`,
      [keys],
    );

    return results.rows;
  }

  async updateValue(
    client: any,
    keys: string,
    value: any,
    userId: string,
  ): Promise<any> {
    const results = await client.query(
      `UPDATE settings
                                             SET value      = $2,
                                                 updated_at = now(),
                                                 updated_by = $3
                                             WHERE key = $1
                                             RETURNING key, value, type, updated_at, updated_by, description`,
      [keys, value, userId],
    );

    return results.rows[0];
  }
}
