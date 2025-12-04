import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Op } from 'sequelize';
import CategoryRoutes from '../routes/CategoryRoutes.js';
import LocationRoutes from '../routes/LocationRoutes.js';
import AuthRoutes from '../routes/AuthRoutes.js';
import { Categories, Locations } from '../models/index.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    app.use('/api/categories', CategoryRoutes);
    app.use('/api/locations', LocationRoutes);
    return app;
};

describe('Category API Tests', () => {
    let app;
    let authToken;

    beforeAll(async () => {
        app = createTestApp();

        // Login with existing admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@company.com',
                password: 'admin123'
            });
        
        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        await Categories.destroy({ where: { name: { [Op.like]: 'Jest Test%' } } });
    });

    describe('GET /api/categories', () => {
        it('should get all categories', async () => {
            const res = await request(app)
                .get('/api/categories')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('Category CRUD Operations', () => {
        let createdCategoryUuid;
        const uniqueName = `Jest Test Category ${Date.now()}`;

        it('should create a new category', async () => {
            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: uniqueName,
                    description: 'A test category'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', uniqueName);
            
            createdCategoryUuid = res.body.data.uuid;
        });

        it('should update category', async () => {
            expect(createdCategoryUuid).toBeDefined();

            const res = await request(app)
                .put(`/api/categories/${createdCategoryUuid}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ description: 'Updated description' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('description', 'Updated description');
        });

        it('should delete category', async () => {
            expect(createdCategoryUuid).toBeDefined();

            const res = await request(app)
                .delete(`/api/categories/${createdCategoryUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});

describe('Location API Tests', () => {
    let app;
    let authToken;

    beforeAll(async () => {
        app = createTestApp();

        // Login with existing admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@company.com',
                password: 'admin123'
            });
        
        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        await Locations.destroy({ where: { name: { [Op.like]: 'Jest Test%' } } });
    });

    describe('GET /api/locations', () => {
        it('should get all locations', async () => {
            const res = await request(app)
                .get('/api/locations')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('Location CRUD Operations', () => {
        let createdLocationUuid;
        const uniqueName = `Jest Test Location ${Date.now()}`;

        it('should create a new location', async () => {
            const res = await request(app)
                .post('/api/locations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: uniqueName,
                    address: 'Test Address 123',
                    description: 'A test location'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', uniqueName);
            
            createdLocationUuid = res.body.data.uuid;
        });

        it('should delete location', async () => {
            expect(createdLocationUuid).toBeDefined();

            const res = await request(app)
                .delete(`/api/locations/${createdLocationUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});
