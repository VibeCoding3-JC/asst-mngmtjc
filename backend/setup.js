import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// First, connect without specifying database to create it
const createDatabase = async () => {
    const tempDb = new Sequelize("", process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false
    });

    try {
        await tempDb.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`✅ Database '${process.env.DB_NAME}' created or already exists.`);
        await tempDb.close();
        return true;
    } catch (error) {
        console.error("❌ Error creating database:", error.message);
        await tempDb.close();
        return false;
    }
};

// Then run the seeder
const runSeeder = async () => {
    // Import after database is created
    const db = (await import("./config/Database.js")).default;
    
    // Import models
    await import("./models/index.js");

    try {
        await db.authenticate();
        console.log("✅ Database connection established.");

        // Sync all models
        await db.sync({ force: true });
        console.log("✅ All tables created.");

        // Import and run seeder
        const seedDatabase = (await import("./seeders/seed.js")).default;
        await seedDatabase();

        console.log("\n🎉 Setup complete! You can now start the server.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Setup failed:", error.message);
        process.exit(1);
    }
};

// Main execution
const main = async () => {
    console.log("🚀 Starting database setup...\n");
    
    const dbCreated = await createDatabase();
    if (dbCreated) {
        await runSeeder();
    }
};

main();
