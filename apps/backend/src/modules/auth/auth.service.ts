import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(payload: any): Promise<User> {
    // Payload from Supabase JWT: sub is the uuid
    const { sub, email, user_metadata } = payload;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { id: sub },
    });

    if (!user) {
      // Create user if not exists
      // We use the Supabase UUID as our primary key
      console.log('User not found in DB. Creating user...', sub);
      try {
        user = await this.prisma.user.create({
          data: {
            id: sub,
            email: email,
            name: user_metadata?.full_name || email,
            avatarUrl: user_metadata?.avatar_url,
          },
        });
        console.log('User created:', user.id);
      } catch (e) {
        console.error('Failed to create user in DB:', e);
        // If race condition where user was created between check and create
        if (e.code === 'P2002') {
          // Unique constraint violation, likely on email
          // Fallback: locate by email and return existing user
          const byEmail = await this.prisma.user.findUnique({
            where: { email },
          });
          if (byEmail) {
            user = byEmail;
            console.log('Using existing user by email:', user.id);
          } else {
            // Last attempt: re-check by id
            user = await this.prisma.user.findUnique({ where: { id: sub } });
            if (!user) {
              throw e;
            }
          }
        } else {
          throw e;
        }
      }
    }

    return user;
  }
}
