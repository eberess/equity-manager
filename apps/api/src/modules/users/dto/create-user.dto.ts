import { IsEmail, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  businessUnit: string;

  @IsNumber()
  @Min(1)
  shareCount: number;
}