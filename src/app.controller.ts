import { Get, Res, Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/')
  @ApiExcludeEndpoint()
  async root(@Res() res: Response) {
    const baseURL = this.configService.get('BASE_URL');
    return res.redirect('http://localhost:3001/api');
  }
}