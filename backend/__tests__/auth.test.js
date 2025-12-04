import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRoutes from '../routes/AuthRoutes.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    return app;
};

describe('Auth API Tests', () => {
    let app;

    beforeAll(async () => {
        app = createTestApp();
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@company.com',
                    password: 'admin123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data.user).toHaveProperty('email', 'admin@company.com');
        });

        it('should fail with invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrongemail@test.com',
                    password: 'admin123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@company.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with missing credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
