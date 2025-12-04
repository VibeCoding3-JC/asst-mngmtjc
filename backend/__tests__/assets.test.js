import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Op } from 'sequelize';
import AssetRoutes from '../routes/AssetRoutes.js';
import AuthRoutes from '../routes/AuthRoutes.js';
import { Assets, Categories, Locations } from '../models/index.js';

// Create test app with auth
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    app.use('/api/assets', AssetRoutes);
    return app;
};

describe('Asset API Tests', () => {
    let app;
    let authToken;
    let testAssetUuid;
    let existingCategory;
    let existingLocation;

    beforeAll(async () => {
        app = createTestApp();

        // Get existing category and location from seeded data
        existingCategory = await Categories.findOne();
        existingLocation = await Locations.findOne();

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
        // Cleanup test assets
        await Assets.destroy({ where: { serial_number: { [Op.like]: 'TEST-%' } } });
    });

    describe('GET /api/assets', () => {
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/assets');

            expect(res.statusCode).toBe(401);
        });

        it('should get all assets with valid token', async () => {
            const res = await request(app)
                .get('/api/assets')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('POST /api/assets', () => {
        it('should create a new asset', async () => {
            const uniqueSerial = `TEST-${Date.now()}`;
            const newAsset = {
                name: 'Test Laptop Jest',
                serial_number: uniqueSerial,
                category_uuid: existingCategory.uuid,
                location_uuid: existingLocation.uuid,
                purchase_date: '2024-01-15',
                purchase_price: 15000000
            };

            const res = await request(app)
                .post('/api/assets')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newAsset);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', 'Test Laptop Jest');
            expect(res.body.data).toHaveProperty('asset_code');
            
            testAssetUuid = res.body.data.uuid;
        });

        it('should fail with missing required fields', async () => {
            const res = await request(app)
                .post('/api/assets')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Incomplete Asset' });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/assets/:id', () => {
        it('should get asset by UUID', async () => {
            if (!testAssetUuid) return;
            
            const res = await request(app)
                .get(`/api/assets/${testAssetUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('uuid', testAssetUuid);
        });

        it('should return 404 for non-existent asset', async () => {
            const res = await request(app)
                .get('/api/assets/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/assets/:id', () => {
        it('should update asset', async () => {
            if (!testAssetUuid) return;

            const res = await request(app)
                .put(`/api/assets/${testAssetUuid}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Test Laptop Jest' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', 'Updated Test Laptop Jest');
        });
    });

    describe('DELETE /api/assets/:id', () => {
        it('should delete asset', async () => {
            if (!testAssetUuid) return;

            const res = await request(app)
                .delete(`/api/assets/${testAssetUuid}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
