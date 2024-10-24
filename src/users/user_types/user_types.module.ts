import { Module } from '@nestjs/common';
import { UserTypeService } from './user_types.service';
import { UserTypeController } from './user_types.controller';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserTypeController],
  providers: [UserTypeService],
})
export class UserTypeModule {}
