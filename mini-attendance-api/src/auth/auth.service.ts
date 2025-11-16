import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
  ) {}
  
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userservice.findOne(username);
    
    if (!user?.get().password) {
      throw new UnauthorizedException();
    }
    console.log("password", user?.get()?.password);
    const validPassword = await this.validatePassword(pass, user.get().password)
    
    if (!validPassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.get().id, username: user.get().username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  signUp(dto: AuthSignupDto): Promise<any> {
    return this.userservice.create(dto);
  }

  private async validatePassword(pass, hash): Promise<boolean> {
    const isMatch = await bcrypt.compare(pass, hash);
    return isMatch
  }
}
