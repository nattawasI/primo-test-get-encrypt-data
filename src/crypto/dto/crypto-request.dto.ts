import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptRequestDto {
  @ApiProperty({
    description: 'Payload to encrypt',
    example: 'Hello Primo!',
    minLength: 1,
    maxLength: 2000,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  payload: string;
}

export class DecryptRequestDto {
  @ApiProperty({
    description: 'Encrypted AES key (encrypted with RSA Private Key)',
    example: 'BASE64_ENCRYPTED_DATA1',
  })
  @IsNotEmpty()
  @IsString()
  data1: string;

  @ApiProperty({
    description: 'Encrypted payload (encrypted with AES Key)',
    example: 'BASE64_ENCRYPTED_DATA2',
  })
  @IsNotEmpty()
  @IsString()
  data2: string;
}
