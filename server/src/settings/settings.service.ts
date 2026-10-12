import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository.js';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  getSettings() {
    return this.settingsRepository.getAllSettings();
  }

  findByKeys(keys: string[]) {
    return this.settingsRepository.findByKeys(keys);
  }
}
