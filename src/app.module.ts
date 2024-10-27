import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma.service';
// import { CategoriesModule } from './product/categories/categories.module';
import { ProductsModule } from './products/products.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule for environment variable management
import { MailerModule } from './mailer/mailer.module';
import { ProjectsModule } from './projects/projects.module';
import { BannersModule } from './banners/banners.module';
import { MenusModule } from './menus/menus.module';
import { IndustriesModule } from './industries/industries.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
      serveRoot: '/public',
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Load environment variables from the .env file
    }),
    ProductsModule,
    HttpModule, MailerModule, ProjectsModule, BannersModule, MenusModule, IndustriesModule
  ],
  
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
 
}
