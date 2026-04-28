import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptRequestDto, DecryptRequestDto } from './dto/crypto-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Crypto')
@Controller()
export class CryptoController {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {}

  @Post('get-encrypt-data')
  @ApiOperation({ summary: 'Encrypt payload using AES and RSA' })
  @ApiResponse({
    status: 200,
    description: 'Encryption successful',
  })
  encrypt(@Body() dto: EncryptRequestDto) {
    try {
      // 2. Create AES key by Generate random string (32 chars)
      const aesKey = this.cryptoService.generateRandomString(32);
      const iv = '0000000000000000';

      // 3. For data2, encrypt payload with AES key
      const data2 = this.cryptoService.encryptAES(dto.payload, aesKey, iv);

      // 4. For data1, encrypt key from step 2 with private key
      const privateKey =
        this.configService.getOrThrow<string>('RSA_PRIVATE_KEY');
      const data1 = this.cryptoService.encryptRSAWithPrivate(
        aesKey,
        privateKey,
      );

      return {
        successful: true,
        error_code: '',
        data: {
          data1,
          data2,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        successful: false,
        error_code: 'ENCRYPTION_ERROR',
        data: null,
        message: errorMessage,
      };
    }
  }

  @Post('get-decrypt-data')
  @ApiOperation({ summary: 'Decrypt data using RSA and AES' })
  @ApiResponse({
    status: 200,
    description: 'Decryption successful',
  })
  decrypt(@Body() dto: DecryptRequestDto) {
    try {
      const publicKey = this.configService.getOrThrow<string>('RSA_PUBLIC_KEY');
      const iv = '0000000000000000';

      // 2. Get AES Key, Decrypt data1 with public key
      const aesKey = this.cryptoService.decryptRSAWithPublic(
        dto.data1,
        publicKey,
      );

      // 3. Get Payload, Decrypt data2 with AES key
      const payload = this.cryptoService.decryptAES(dto.data2, aesKey, iv);

      return {
        successful: true,
        error_code: '',
        data: {
          payload,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        successful: false,
        error_code: 'DECRYPTION_ERROR',
        data: null,
        message: errorMessage,
      };
    }
  }
}
