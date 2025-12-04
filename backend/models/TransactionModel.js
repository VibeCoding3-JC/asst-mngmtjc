import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Transactions = db.define("transactions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "assets",
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for dispose/repair without specific user
        references: {
            model: "users",
            key: "id"
        }
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    action_type: {
        type: DataTypes.ENUM("checkout", "checkin", "transfer", "repair", "repair_complete", "dispose"),
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    condition_before: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    condition_after: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ["asset_id"]
        },
        {
            fields: ["user_id"]
        },
        {
            fields: ["admin_id"]
        },
        {
            fields: ["action_type"]
        },
        {
            fields: ["transaction_date"]
        }
    ]
});

export default Transactions;
