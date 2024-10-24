import { Module } from '@nestjs/common';
import { CerificateService } from './certificates.service';
import { CerificateController } from './certificates.controller';

@Module({
  controllers: [CerificateController],
  providers: [CerificateService],
})
export class CertificatesModule {}
