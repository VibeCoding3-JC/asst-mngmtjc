import db from '../config/Database.js';

// Setup dan teardown untuk testing
beforeAll(async () => {
    try {
        await db.authenticate();
        console.log('✅ Test database connected');
    } catch (error) {
        console.error('❌ Test database connection failed:', error.message);
    }
});

afterAll(async () => {
    try {
        await db.close();
        console.log('✅ Test database connection closed');
    } catch (error) {
        console.error('❌ Error closing database:', error.message);
    }
});
