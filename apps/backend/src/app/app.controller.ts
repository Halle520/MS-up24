import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('greeting')
  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a greeting message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  getGreeting(): { message: string } {
    return this.appService.getGreeting();
  }

  @Get('test-db')
  @ApiOperation({
    summary: 'Test backend health',
  })
  @ApiResponse({
    status: 200,
    description: 'Backend health check',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async testDatabase(): Promise<{
    status: string;
    message: string;
  }> {
    return {
      status: 'ok',
      message:
        '✅ Backend is running. Database operations are now handled by frontend via Supabase.',
    };
  }
}
