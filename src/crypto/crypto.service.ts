import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CRYPTO_CONSTANTS } from './crypto.constants';

@Injectable()
export class CryptoService {
  /**
   * Encrypt text using AES-256-CBC
   */
  encryptAES(text: string, key: string, iv: string): string {
    try {
      const cipher = crypto.createCipheriv(
        CRYPTO_CONSTANTS.AES_ALGORITHM,
        Buffer.from(this.padKey(key)),
        Buffer.from(iv),
      );
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(
        `AES Encryption failed: ${errorMessage}`,
      );
    }
  }

  /**
   * Decrypt text using AES-256-CBC
   */
  decryptAES(encryptedText: string, key: string, iv: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        CRYPTO_CONSTANTS.AES_ALGORITHM,
        Buffer.from(this.padKey(key)),
        Buffer.from(iv),
      );
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      throw new BadRequestException(`AES Decryption failed: ${errorMessage}`);
    }
  }

  /**
   * Encrypt text using RSA Private Key (Unconventional, matching requirement)
   */
  encryptRSAWithPrivate(text: string, privateKey: string): string {
    try {
      const buffer = Buffer.from(text, 'utf8');
      const encrypted = crypto.privateEncrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer,
      );
      return encrypted.toString('base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(
        `RSA Private Encryption failed: ${errorMessage}`,
      );
    }
  }

  /**
   * Decrypt text using RSA Public Key (Unconventional, matching requirement)
   */
  decryptRSAWithPublic(encryptedData: string, publicKey: string): string {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const decrypted = crypto.publicDecrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer,
      );
      return decrypted.toString('utf8');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      throw new BadRequestException(
        `RSA Public Decryption failed: ${errorMessage}`,
      );
    }
  }

  /**
   * Generate a random string for AES Key
   */
  generateRandomString(length: number): string {
    return crypto
      .randomBytes(length / 2)
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Ensure key is 32 bytes for AES-256
   */
  private padKey(key: string): string {
    return key.padEnd(32, '0').slice(0, 32);
  }
}
