import { AuthValidateDto as AuthValidateDtoInterface } from '@requestobot/util-dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthValidateDto implements AuthValidateDtoInterface {
  @ApiProperty({ description: 'Status of authentication - always returns OK' })
  status: string;
  @ApiProperty({ description: 'Username of the authenticated user' })
  username: string;
}
