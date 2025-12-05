import db from "../config/Database.js";
import Users from "./UserModel.js";
import Categories from "./CategoryModel.js";
import Locations from "./LocationModel.js";
import Assets from "./AssetModel.js";
import Transactions from "./TransactionModel.js";
import Notifications from "./NotificationModel.js";

// ========================================
// RELASI ANTAR MODEL
// ========================================

// 1. Category - Asset Relationship
Categories.hasMany(Assets, {
    foreignKey: "category_id",
    as: "assets"
});
Assets.belongsTo(Categories, {
    foreignKey: "category_id",
    as: "category"
});

// 2. Location - Asset Relationship
Locations.hasMany(Assets, {
    foreignKey: "location_id",
    as: "assets"
});
Assets.belongsTo(Locations, {
    foreignKey: "location_id",
    as: "location"
});

// 3. User (Holder) - Asset Relationship
Users.hasMany(Assets, {
    foreignKey: "current_holder_id",
    as: "heldAssets"
});
Assets.belongsTo(Users, {
    foreignKey: "current_holder_id",
    as: "holder"
});

// 4. Asset - Transaction Relationship
Assets.hasMany(Transactions, {
    foreignKey: "asset_id",
    as: "transactions"
});
Transactions.belongsTo(Assets, {
    foreignKey: "asset_id",
    as: "asset"
});

// 5. User (Employee) - Transaction Relationship
Users.hasMany(Transactions, {
    foreignKey: "user_id",
    as: "employeeTransactions"
});
Transactions.belongsTo(Users, {
    foreignKey: "user_id",
    as: "employee"
});

// 6. User (Admin/Processor) - Transaction Relationship
Users.hasMany(Transactions, {
    foreignKey: "admin_id",
    as: "processedTransactions"
});
Transactions.belongsTo(Users, {
    foreignKey: "admin_id",
    as: "admin"
});

// 7. User - Notification Relationship
Users.hasMany(Notifications, {
    foreignKey: "user_id",
    as: "notifications"
});
Notifications.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user"
});

// ========================================
// SYNC DATABASE
// ========================================

/**
 * Sync all models to database
 * @param {boolean} force - If true, drop tables and recreate
 * @param {boolean} alter - If true, alter existing tables
 */
const syncDatabase = async (options = { alter: true }) => {
    try {
        await db.authenticate();
        console.log("✅ Database connection established successfully.");

        // Sync all models
        await db.sync(options);
        console.log("✅ All models synchronized successfully.");

        return true;
    } catch (error) {
        console.error("❌ Unable to sync database:", error.message);
        throw error;
    }
};

// Export models and sync function
export {
    db,
    Users,
    Categories,
    Locations,
    Assets,
    Transactions,
    Notifications,
    syncDatabase
};

export default db;
