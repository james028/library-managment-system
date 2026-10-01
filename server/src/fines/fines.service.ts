import { Injectable } from '@nestjs/common';
import { FinesRepository } from './fines.repository.js';


@Injectable()
export class FinesService {
  constructor(private readonly finesRepository: FinesRepository) {}

  findMyFines(userId: string) {

      return this.finesRepository.findAllForUser(userId);
  }
}
