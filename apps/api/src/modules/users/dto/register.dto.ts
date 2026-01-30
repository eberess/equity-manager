import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, Min } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Leroy Merlin' })
  @IsString()
  businessUnit: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  shareCount: number;
}
