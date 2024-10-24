import { PartialType } from '@nestjs/swagger';
import { CreatePublicapiDto } from './create-publicapi.dto';

export class UpdatePublicapiDto extends PartialType(CreatePublicapiDto) {}
