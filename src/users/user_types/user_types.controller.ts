import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Session,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTypeService } from './user_types.service';
import { CreateUserTypeDto } from './dto/create-user_type.dto';
import { UpdateUserTypeDto } from './dto/update-user_type.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('User Types')
@Controller('user-types')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create user type' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }
  
  @Get()
  findAll(@Session() session: any) {
    // console.log('Session controller:', session);
    if (!session || !session.user) {
      throw new UnauthorizedException('No session or user found.');
    }
    return this.userTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(id, updateUserTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTypeService.remove(id);
  }
}
