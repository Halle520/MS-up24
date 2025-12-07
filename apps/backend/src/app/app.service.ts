import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getGreeting(): { message: string } {
    return { message: 'Hello from Monospace Backend! 👋' };
  }
}
