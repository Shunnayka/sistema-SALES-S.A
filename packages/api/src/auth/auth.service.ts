import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async login(username: string, password: string): Promise<{ accessToken: string }> {
    const adminUser = process.env.ADMIN_USER ?? 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234';

    if (username !== adminUser || password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({ sub: username, username });

    return { accessToken };
  }
}
