import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Notifications = db.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    type: {
        type: DataTypes.ENUM("checkout", "checkin", "maintenance", "overdue", "system", "asset_update"),
        allowNull: false,
        defaultValue: "system"
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reference_type: {
        type: DataTypes.ENUM("asset", "transaction", "user", "system"),
        allowNull: true
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reference_uuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Notifications;
