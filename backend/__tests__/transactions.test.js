import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Op } from 'sequelize';
import TransactionRoutes from '../routes/TransactionRoutes.js';
import AssetRoutes from '../routes/AssetRoutes.js';
import AuthRoutes from '../routes/AuthRoutes.js';
import { Assets, Transactions, Categories, Locations, Users } from '../models/index.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    app.use('/api/assets', AssetRoutes);
    app.use('/api/transactions', TransactionRoutes);
    return app;
};

describe('Transaction API Tests', () => {
    let app;
    let authToken;
    let existingCategory;
    let existingLocation;
    let existingUser;

    beforeAll(async () => {
        app = createTestApp();

        // Get existing data from seeded database
        existingCategory = await Categories.findOne();
        existingLocation = await Locations.findOne();
        existingUser = await Users.findOne({ where: { role: 'employee' } });

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
        // Cleanup test assets and transactions
        const testAssets = await Assets.findAll({ 
            where: { serial_number: { [Op.like]: 'TXN-TEST-%' } } 
        });
        
        for (const asset of testAssets) {
            await Transactions.destroy({ where: { asset_id: asset.id } });
        }
        await Assets.destroy({ where: { serial_number: { [Op.like]: 'TXN-TEST-%' } } });
    });

    describe('GET /api/transactions', () => {
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/transactions');

            expect(res.statusCode).toBe(401);
        });

        it('should get all transactions with valid token', async () => {
            const res = await request(app)
                .get('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('Checkout and Checkin Flow', () => {
        let flowAsset;

        beforeAll(async () => {
            // Create asset for this flow
            const uniqueSerial = `TXN-TEST-FLOW1-${Date.now()}`;
            const assetRes = await request(app)
                .post('/api/assets')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Checkout Flow Test Asset',
                    serial_number: uniqueSerial,
                    category_uuid: existingCategory.uuid,
                    location_uuid: existingLocation.uuid,
                    purchase_date: '2024-01-15',
                    purchase_price: 5000000
                });
            
            flowAsset = assetRes.body.data;
        });

        it('should checkout asset to a user', async () => {
            if (!flowAsset || !existingUser) return;

            const res = await request(app)
                .post('/api/transactions/checkout')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: flowAsset.uuid,
                    user_uuid: existingUser.uuid,
                    notes: 'Test checkout'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('action_type', 'checkout');
        });

        it('should fail checkout for already assigned asset', async () => {
            if (!flowAsset || !existingUser) return;

            const res = await request(app)
                .post('/api/transactions/checkout')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: flowAsset.uuid,
                    user_uuid: existingUser.uuid,
                    notes: 'Duplicate checkout'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should checkin asset from user', async () => {
            if (!flowAsset) return;

            const res = await request(app)
                .post('/api/transactions/checkin')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: flowAsset.uuid,
                    location_uuid: existingLocation.uuid,
                    condition_notes: 'good',
                    notes: 'Test checkin'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('action_type', 'checkin');
        });

        it('should fail checkin for available asset', async () => {
            if (!flowAsset) return;

            const res = await request(app)
                .post('/api/transactions/checkin')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: flowAsset.uuid,
                    location_uuid: existingLocation.uuid,
                    condition_notes: 'good',
                    notes: 'Invalid checkin'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('Repair Flow', () => {
        let repairAsset;

        beforeAll(async () => {
            // Create asset for repair flow
            const uniqueSerial = `TXN-TEST-REPAIR-${Date.now()}`;
            const assetRes = await request(app)
                .post('/api/assets')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Repair Flow Test Asset',
                    serial_number: uniqueSerial,
                    category_uuid: existingCategory.uuid,
                    location_uuid: existingLocation.uuid,
                    purchase_date: '2024-01-15',
                    purchase_price: 5000000
                });
            
            repairAsset = assetRes.body.data;
        });

        it('should send asset for repair', async () => {
            if (!repairAsset) return;

            const res = await request(app)
                .post('/api/transactions/repair')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: repairAsset.uuid,
                    notes: 'Screen replacement needed'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('action_type', 'repair');
        });

        it('should complete repair', async () => {
            if (!repairAsset) return;

            const res = await request(app)
                .post('/api/transactions/repair/complete')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: repairAsset.uuid,
                    location_uuid: existingLocation.uuid,
                    repair_cost: 500000,
                    notes: 'Repair completed successfully'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('action_type', 'repair_complete');
        });
    });

    describe('Transfer Flow', () => {
        let transferAsset;
        let newLocation;

        beforeAll(async () => {
            // Create asset for transfer flow
            const uniqueSerial = `TXN-TEST-TRANSFER-${Date.now()}`;
            const assetRes = await request(app)
                .post('/api/assets')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Transfer Flow Test Asset',
                    serial_number: uniqueSerial,
                    category_uuid: existingCategory.uuid,
                    location_uuid: existingLocation.uuid,
                    purchase_date: '2024-01-15',
                    purchase_price: 5000000
                });
            
            transferAsset = assetRes.body.data;

            // Get a different location
            newLocation = await Locations.findOne({
                where: { id: { [Op.ne]: existingLocation.id } }
            });
        });

        it('should transfer asset to new location', async () => {
            if (!transferAsset || !newLocation) return;

            const res = await request(app)
                .post('/api/transactions/transfer')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    asset_uuid: transferAsset.uuid,
                    to_location_uuid: newLocation.uuid,
                    notes: 'Transfer to new location'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('action_type', 'transfer');
        });
    });
});
