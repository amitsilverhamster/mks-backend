import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import * as session from 'express-session';
import { jwtConstants } from './constants';
import passport from 'passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' ,session: true}), // Enable session
    JwtModule.register({
      secret: jwtConstants.secret, // Use environment variable in production
      signOptions: { expiresIn: '60m' },
    }),
    
    PassportModule.register({ session: true }), // Enable session
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService ,JwtStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
