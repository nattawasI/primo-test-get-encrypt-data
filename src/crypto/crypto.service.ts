import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly aesAlgorithm = 'aes-256-cbc';

  /**
   * Encrypt text using AES-256-CBC
   */
  encryptAES(text: string, key: string, iv: string): string {
    const cipher = crypto.createCipheriv(
      this.aesAlgorithm,
      Buffer.from(key),
      Buffer.from(iv),
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypt text using AES-256-CBC
   */
  decryptAES(encryptedText: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.aesAlgorithm,
      Buffer.from(key),
      Buffer.from(iv),
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Encrypt text using RSA Public Key
   */
  encryptRSA(text: string, publicKey: string): string {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer,
    );
    return encrypted.toString('base64');
  }

  /**
   * Decrypt text using RSA Private Key
   */
  decryptRSA(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer,
    );
    return decrypted.toString('utf8');
  }
}
