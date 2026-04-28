import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface CryptoResponse {
  successful: boolean;
  error_code: string;
  data: {
    data1?: string;
    data2?: string;
    payload?: string;
  };
  message?: string | string[];
}

describe('CryptoController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Must include to test validation
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Full Workflow: Encrypt then Decrypt', async () => {
    const payload = 'Hello Primo e2e test';

    // 1. Encrypt
    const encryptResponse = await request(app.getHttpServer())
      .post('/get-encrypt-data')
      .send({ payload })
      .expect(201);

    const encryptBody = encryptResponse.body as CryptoResponse;
    expect(encryptBody.successful).toBe(true);
    const { data1, data2 } = encryptBody.data;
    expect(data1).toBeDefined();
    expect(data2).toBeDefined();

    // 2. Decrypt
    const decryptResponse = await request(app.getHttpServer())
      .post('/get-decrypt-data')
      .send({ data1, data2 })
      .expect(201);

    const decryptBody = decryptResponse.body as CryptoResponse;
    expect(decryptBody.successful).toBe(true);
    expect(decryptBody.data.payload).toBe(payload);
  });

  it('Validation: Should fail if payload is too long', async () => {
    const longPayload = 'a'.repeat(2001);

    const response = await request(app.getHttpServer())
      .post('/get-encrypt-data')
      .send({ payload: longPayload })
      .expect(400);

    const body = response.body as CryptoResponse;
    expect(body.message).toBeDefined();
  });
});
