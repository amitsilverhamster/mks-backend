import { PartialType } from '@nestjs/swagger';
import { CreateCerificateDto } from './create-certificate.dto';

export class UpdateCertificateDto extends PartialType(CreateCerificateDto) {}
