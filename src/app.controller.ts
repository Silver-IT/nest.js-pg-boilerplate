import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponse } from './common/dtos/response-types.dto';

@ApiTags('Others')
@Controller()
export class AppController {
  @Get('')
  index(): string {
    return 'Welcome to the Magazine Builder API server';
  }

  @Get('api/status')
  @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse {
    return new HealthResponse();
  }
}
