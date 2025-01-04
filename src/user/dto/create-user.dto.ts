import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber('ID')
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserType)
  type: UserType;
}
