import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    description: 'The title of the article',
    example: 'Hello, World!',
  })
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({
    description: 'The description of the article',
    example: 'This is a description',
    required: false,
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The body of the article',
    example: 'This is the body of the article',
  })
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'The publish state of the article',
    example: true,
    required: false,
    default: false,
  })
  published?: boolean;
}
