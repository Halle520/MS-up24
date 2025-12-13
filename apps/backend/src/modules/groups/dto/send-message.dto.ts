import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsUUID()
  consumptionId?: string;
}
