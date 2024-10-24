import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { use } from 'passport';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
// @UseGuards(AuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK) 
  async login(@Body() authDto: AuthDto, @Req() req: any) {
    // Pass the request object to the AuthService for session handling
    return this.authService.login(authDto, req);
  }
  @Post('logout')
  @ApiResponse({ status: 200, description: 'User logout in successfully.' })
  async logout(@Req() req: any) {
    return this.authService.logout(req);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('profile')
  // @ApiOperation({ summary: 'Get user profile' })
  // @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // getProfile(@Request() req) {
  //   // Return the user information from the request object
  //   return req.user;
  // }
}
