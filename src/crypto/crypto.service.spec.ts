import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

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
    const key = '12345678901234567890123456789012'; // 32 bytes for AES-256
    const iv = '1234567890123456'; // 16 bytes for IV
    const text = 'Hello World';

    it('should encrypt text using AES', () => {
      const encrypted = service.encryptAES(text, key, iv);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(text);
    });

    it('should decrypt text using AES', () => {
      const encrypted = service.encryptAES(text, key, iv);
      const decrypted = service.decryptAES(encrypted, key, iv);
      expect(decrypted).toBe(text);
    });
  });

  describe('RSA Encryption/Decryption', () => {
    // We'll need keys for this, we can mock them or generate them in the test
    const text = 'Secret RSA Message';
    let publicKey: string;
    let privateKey: string;

    beforeAll(() => {
      const { generateKeyPairSync } = require('crypto');
      const { publicKey: pub, privateKey: priv } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
      });
      publicKey = pub;
      privateKey = priv;
    });

    it('should encrypt text using RSA Public Key', () => {
      const encrypted = service.encryptRSA(text, publicKey);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(text);
    });

    it('should decrypt text using RSA Private Key', () => {
      const encrypted = service.encryptRSA(text, publicKey);
      const decrypted = service.decryptRSA(encrypted, privateKey);
      expect(decrypted).toBe(text);
    });
  });
});
