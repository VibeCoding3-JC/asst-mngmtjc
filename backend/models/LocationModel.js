import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Locations = db.define("locations", {
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
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150]
        }
    },
    building: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    floor: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    room_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    underscored: true
});

export default Locations;
