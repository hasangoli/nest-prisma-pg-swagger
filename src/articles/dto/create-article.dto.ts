import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Hello, World!',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the article',
    example: 'This is a description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The body of the article',
    example: 'This is the body of the article',
  })
  body: string;

  @ApiProperty({
    description: 'The publish state of the article',
    example: true,
    required: false,
  })
  published?: boolean;
}
