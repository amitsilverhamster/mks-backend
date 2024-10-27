import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as moment from 'moment';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up static assets and views directory
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views/'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  hbs.localsAsTemplateData(app); // Use local variables as template data

  const config = new DocumentBuilder()
    .setTitle('UPC')
    .setDescription('The UPC API description')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend origin
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

bootstrap();
