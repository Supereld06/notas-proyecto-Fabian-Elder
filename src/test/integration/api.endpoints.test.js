import request from 'supertest';
import app from "../../../src/app.js";
import mongoose from 'mongoose';
import JwtService from '../../infrastructure/security/jwt.service.js';

describe('Integracion - API Completa', () => {

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('1. Healthcheck Endpoint', () => {
        test('GET /api/health deberia devolver 200 OK y estado', async () => {
            const response = await request(app).get('/api/health');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
        });
    });

    describe('2. Endpoints de Notas (Protegidos con JWT)', () => {
        let validToken;

        beforeAll(() => {
            validToken = JwtService.generateToken({
                id: 'usuario_falso_123',
                email: 'test@test.com',
                role: 'user'
            });
        });

        test('GET /api/v1/notes deberia fallar si no se envia Token (401)', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error', 'Authorization header missing or invalid');
        });

        test('POST /api/v1/notes deberia fallar si falta el titulo (400 o 500)', async () => {
            const response = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ content: 'Contenido sin titulo' });

            expect(response.statusCode).toBeGreaterThanOrEqual(400);
        });

        test('GET /api/v1/notes deberia ser exitoso si se envia Token valido (200)', async () => {
            const response = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
});
