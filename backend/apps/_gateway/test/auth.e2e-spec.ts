import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaClient } from '@prisma/client';

describe('Auth', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'testPassword123',
  };

  it(`/POST auth/login - success`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.statusCode).toEqual(201);
        expect(body.data.access_token).toBeDefined();
        expect(body.data.refresh_token).toBeDefined();
      });
  });

  it(`/POST auth/login - invalid credentials`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
