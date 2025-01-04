import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateBuyerDto extends CreateUserDto {
  @IsString()
  nim: string;
}
