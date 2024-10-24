import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as moment from 'moment';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


// Custom helper registration
hbs.registerHelper('json', (context) => {
  return JSON.stringify(context, null, 2); // Pretty-print JSON
});
// Register the 'eq' helper
hbs.registerHelper('eq', (a: any, b: any) => {
  return a === b;
});
// Register the 'map' helper
hbs.registerHelper('map', (array: any[], key: string) => {
  return array.map(item => item[key]);
});

// Register the 'any' helper
hbs.registerHelper('any', (array: any[]) => {
  return array.length > 0;
});
// Register the 'isEmptyValue' helper
hbs.registerHelper('isEmptyValue', (value: any) => {
  return value === 'empty';
});
// Register the 'filterAndLimit' helper

hbs.registerHelper('filterAndLimit', (array: any[], categoryId: any, limit: number) => {
  if (!Array.isArray(array)) { return []; }
  const filtered = array.filter(item => item.primary_category_id === categoryId);
  return filtered.slice(0, limit);
});
hbs.registerHelper('even', function(index: number) {
  return index % 2 === 0;
});
hbs.registerHelper('formatDate', (date) => {
  return moment(date).format('MMM DD YYYY');
});

// Helper to calculate time ago
hbs.registerHelper('timeAgo', (date) => {
  return moment(date).fromNow();
});
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up static assets and views directory
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views/'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Register Handlebars partials
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views/components/'));

  hbs.localsAsTemplateData(app); // Use local variables as template data

  const config = new DocumentBuilder()
    .setTitle('UPC')
    .setDescription('The UPC API description')
    .setVersion('1.0')
    .addBearerAuth()
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
