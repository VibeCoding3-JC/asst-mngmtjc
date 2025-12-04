import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Op } from 'sequelize';
import UserRoutes from '../routes/UserRoutes.js';
import AuthRoutes from '../routes/AuthRoutes.js';
import { Users } from '../models/index.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    app.use('/api/users', UserRoutes);
    return app;
};

describe('User API Tests', () => {
    let app;
    let authToken;
    let createdUserUuid;
    const uniqueEmail = `jestuser-${Date.now()}@test.com`;

    beforeAll(async () => {
        app = createTestApp();

        // Login with admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@company.com',
                password: 'admin123'
            });
        
        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        // Cleanup test users
        await Users.destroy({ where: { email: { [Op.like]: 'jestuser-%@test.com' } } });
    });

    describe('GET /api/users', () => {
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.statusCode).toBe(401);
        });

        it('should get all users with valid token', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('User CRUD Operations', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Jest Test User',
                    email: uniqueEmail,
                    password: 'TestPassword123',
                    role: 'employee',
                    department: 'IT',
                    phone: '081234567890'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', 'Jest Test User');
            expect(res.body.data).toHaveProperty('email', uniqueEmail);
            
            createdUserUuid = res.body.data.uuid;
        });

        it('should fail to create user with duplicate email', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Duplicate User',
                    email: uniqueEmail,
                    password: 'TestPassword123',
                    role: 'employee',
                    department: 'IT'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should get user by UUID', async () => {
            expect(createdUserUuid).toBeDefined();

            const res = await request(app)
                .get(`/api/users/${createdUserUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('uuid', createdUserUuid);
        });

        it('should update user', async () => {
            expect(createdUserUuid).toBeDefined();

            const res = await request(app)
                .put(`/api/users/${createdUserUuid}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Updated Jest User',
                    department: 'HR'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', 'Updated Jest User');
            expect(res.body.data).toHaveProperty('department', 'HR');
        });

        it('should get user assets (empty for new user)', async () => {
            expect(createdUserUuid).toBeDefined();

            const res = await request(app)
                .get(`/api/users/${createdUserUuid}/assets`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should delete/deactivate user', async () => {
            expect(createdUserUuid).toBeDefined();

            const res = await request(app)
                .delete(`/api/users/${createdUserUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('User Validation', () => {
        it('should fail with invalid email format', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Invalid Email User',
                    email: 'invalid-email',
                    password: 'TestPassword123',
                    role: 'employee'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail with missing required fields', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Incomplete User'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
