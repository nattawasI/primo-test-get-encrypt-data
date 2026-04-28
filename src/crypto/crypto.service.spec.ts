import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { generateKeyPairSync } from 'crypto';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AES Encryption/Decryption', () => {
    const key = 'my-random-aes-key';
    const iv = '0000000000000000';
    const text = 'Hello World';

    it('should encrypt and decrypt text correctly using AES', () => {
      const encrypted = service.encryptAES(text, key, iv);
      const decrypted = service.decryptAES(encrypted, key, iv);
      expect(decrypted).toBe(text);
    });
  });

  describe('RSA Private Encryption/Public Decryption', () => {
    const text = 'Secret AES Key';
    let publicKey: string;
    let privateKey: string;

    beforeAll(() => {
      const { publicKey: pub, privateKey: priv } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
      });
      publicKey = pub.toString();
      privateKey = priv.toString();
    });

    it('should encrypt with private key and decrypt with public key', () => {
      const encrypted = service.encryptRSAWithPrivate(text, privateKey);
      const decrypted = service.decryptRSAWithPublic(encrypted, publicKey);
      expect(decrypted).toBe(text);
    });

    it('should throw error for invalid RSA data', () => {
      expect(() =>
        service.decryptRSAWithPublic('invalid-data', publicKey),
      ).toThrow();
    });
  });

  describe('Utility Methods', () => {
    it('should generate a random string of requested length', () => {
      const str = service.generateRandomString(32);
      expect(str).toHaveLength(32);
      expect(typeof str).toBe('string');
    });
  });
});
