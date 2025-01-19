import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAuthSource } from './user-auth-source.entity';
import { UserRefreshToken } from './user-refresh-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  displayName: string;
  @OneToMany(() => UserAuthSource, (userAuthSource) => userAuthSource.user)
  userAuthSources: UserAuthSource[];

  @OneToMany(() => UserRefreshToken, (userRefreshToken) => userRefreshToken.user)
  userRefreshTokens: UserRefreshToken[];
}
