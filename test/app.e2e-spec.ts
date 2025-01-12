import { Test } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';

// See: https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
// & https://fastify.dev/docs/latest/Guides/Testing/
describe('App', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('should return 401 when not logged in', () => {
    it('/ (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      });
      expect(response.statusMessage).toBe('Unauthorized');
      expect(response.statusCode).toBe(401);
    });

    it('/users (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user',
      });
      expect(response.statusCode).toBe(401);
    });

    it('/products (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/product',
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('should not return 401 when logged in', () => {
    let token;

    beforeAll(async () => {
      token = (
        await app.inject({
          method: 'POST',
          url: '/auth/login',
          payload: {
            email: 'Franco_Paucek93@example.com',
            password: '12345aA@',
          },
        })
      ).json().access_token;
    });

    it('/ (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.statusCode).toBe(200);
    });

    it('/users (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/user',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.statusCode).toBe(200);
    });

    it('/products (GET)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/product',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.statusCode).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
