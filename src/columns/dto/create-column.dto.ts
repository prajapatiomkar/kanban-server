import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  position: number;
}
