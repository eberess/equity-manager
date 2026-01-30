import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Decathlon' })
  @IsString()
  @IsNotEmpty()
  businessUnit: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(1)
  shareCount: number;
}
