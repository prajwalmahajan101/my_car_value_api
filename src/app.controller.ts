import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ description: 'Gives the Status of the Api' })
  @ApiOkResponse({ description: 'Api is Working fine' })
  getHello() {
    return this.appService.getHello();
  }
}
