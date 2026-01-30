import { IsString, IsEmail, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  businessUnit?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  shareCount?: number;
}
