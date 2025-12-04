import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import DashboardRoutes from '../routes/DashboardRoutes.js';
import AuthRoutes from '../routes/AuthRoutes.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', AuthRoutes);
    app.use('/api/dashboard', DashboardRoutes);
    return app;
};

describe('Dashboard API Tests', () => {
    let app;
    let authToken;

    beforeAll(async () => {
        app = createTestApp();

        // Login with existing admin user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@company.com',
                password: 'admin123'
            });
        
        authToken = loginRes.body.data.accessToken;
    });

    describe('GET /api/dashboard', () => {
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/dashboard');

            expect(res.statusCode).toBe(401);
        });

        it('should get dashboard stats with valid token', async () => {
            const res = await request(app)
                .get('/api/dashboard')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('summary');
            expect(res.body.data.summary).toHaveProperty('total_assets');
            expect(res.body.data.summary).toHaveProperty('total_users');
            expect(res.body.data.summary).toHaveProperty('total_categories');
            expect(res.body.data.summary).toHaveProperty('total_locations');
        });

        it('should return assets by status', async () => {
            const res = await request(app)
                .get('/api/dashboard')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.body.data).toHaveProperty('assets_by_status');
            expect(res.body.data.assets_by_status).toHaveProperty('available');
        });

        it('should return recent transactions', async () => {
            const res = await request(app)
                .get('/api/dashboard')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.body.data).toHaveProperty('recent_transactions');
            expect(Array.isArray(res.body.data.recent_transactions)).toBe(true);
        });
    });

    describe('GET /api/dashboard/quick', () => {
        it('should get quick stats', async () => {
            const res = await request(app)
                .get('/api/dashboard/quick')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('total_assets');
            expect(res.body.data).toHaveProperty('available_assets');
        });
    });
});
