import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
