import { IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @IsNotEmpty()
  refresh_token: string;
}
