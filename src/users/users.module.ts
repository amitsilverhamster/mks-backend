import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma.module';
import { UserTypeModule } from './user_types/user_types.module';

@Module({
  imports: [PrismaModule, UserTypeModule], 
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
