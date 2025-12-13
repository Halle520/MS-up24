import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    const rawSecret =
      configService.get<string>('SUPABASE_JWT_SECRET') ||
      configService.get<string>('JWT_SECRET');
    const secret = rawSecret?.replace(/^['"]|['"]$/g, '');
    if (!secret) {
      console.error(
        'JwtStrategy error: SUPABASE_JWT_SECRET/JWT_SECRET is not configured. Authorization will fail.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use SUPABASE_JWT_SECRET if available (should be), else JWT_SECRET
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    try {
        const user = await this.authService.validateUser(payload);
        if (!user) {
        throw new UnauthorizedException();
        }
        return user;
    } catch (e) {
        throw e;
    }
  }
}
