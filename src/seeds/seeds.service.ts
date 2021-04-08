import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedsService {
  async start(): Promise<void> {
    await this.seedUsers();
  }

  async seedUsers(): Promise<void> {
    // TODO: write content soon
  }
}
