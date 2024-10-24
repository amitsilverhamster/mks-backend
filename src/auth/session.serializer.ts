import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { users } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  // Serialize user information into the session
  serializeUser(user: users, done: (err: Error | null, user: any) => void): void {
    done(null, user.id);
  }

  // Deserialize user information from the session
  async deserializeUser(userId: string, done: (err: Error | null, user: users | null) => void): Promise<void> {
    try {
      const user = await this.prismaService.users.findUnique({ where: { id: userId } });
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
