import { IsString } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  name: string;
}
