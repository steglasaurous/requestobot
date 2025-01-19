import { Command, CommandRunner } from 'nest-commander';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../data-store/services/user.service';
import { AuthSource } from '../../data-store/entities/user-auth-source.entity';
import { User } from '../../data-store/entities/user.entity';

@Command({
  name: 'generate-jwt',
  arguments: '<userId> <username>',
})
export class GenerateJwt extends CommandRunner {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    let user: User;
    try {
      user = await this.userService.loginUser(
        AuthSource.CLI,
        passedParams[0],
        passedParams[1],
        {}
      );
    } catch (err) {
      console.error(`UserService.loginUser failed`, err);
    }

    if (!user) {
      console.error('User not found, unable to login');
      return;
    }

    console.log(this.authService.getJwt(user));
  }
}
