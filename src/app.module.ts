import { MiddlewareConsumer, Module, NestMiddleware } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
// import { CategoriesModule } from './product/categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductsCategoryModule } from './products_category/products_category.module';
import { AttributeModule } from './attribute/attribute.module';
import { CertificatesModule } from './certificates/certificates.module';
import { BlogModule } from './blog/blog.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule for environment variable management
import { MailerModule } from './mailer/mailer.module';
import { ProjectsModule } from './projects/projects.module';
import { BannersModule } from './banners/banners.module';

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
    UsersModule,
    AuthModule,
    // CategoriesModule,
    ProductsModule,
    ProductsCategoryModule,
    AttributeModule,
    CertificatesModule,
    BlogModule,
    HttpModule, MailerModule, ProjectsModule, BannersModule
    // other modules
  ],
  
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    if (!process.env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET environment variable is missing');
    }

    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 3600000, // 1 hour
            httpOnly: true,
            secure: false, // should be true in production with HTTPS
          },
        }),
        passport.initialize(),
        passport.session(),
        this.attachTokenMiddleware, // Custom middleware to add token
      )
      .forRoutes('*');
  }

  // Custom middleware to attach access token from session to headers
  attachTokenMiddleware(req, res, next) {
    if (req.session && req.session.accessToken) {
      // Automatically set the Authorization header with the token
      req.headers['authorization'] = `Bearer ${req.session.accessToken}`;
    }
    next();
  }
}
