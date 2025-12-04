import argon2 from "argon2";
import { Users, Categories, Locations, Assets, syncDatabase } from "../models/index.js";

/**
 * Seed default data to database
 */
const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...\n");

        // Sync database first
        await syncDatabase({ alter: true });

        // ========================================
        // 1. SEED ADMIN USER
        // ========================================
        console.log("👤 Seeding admin user...");
        
        const adminExists = await Users.findOne({ where: { email: "admin@company.com" } });
        
        if (!adminExists) {
            const hashedPassword = await argon2.hash("admin123");
            await Users.create({
                name: "Administrator",
                email: "admin@company.com",
                password: hashedPassword,
                role: "admin",
                department: "IT Department",
                phone: "021-1234567",
                is_active: true
            });
            console.log("   ✅ Admin user created: admin@company.com / admin123");
        } else {
            console.log("   ⏭️  Admin user already exists, skipping...");
        }

        // Create staff user
        const staffExists = await Users.findOne({ where: { email: "staff@company.com" } });
        
        if (!staffExists) {
            const hashedPassword = await argon2.hash("staff123");
            await Users.create({
                name: "IT Staff",
                email: "staff@company.com",
                password: hashedPassword,
                role: "staff",
                department: "IT Department",
                phone: "021-1234568",
                is_active: true
            });
            console.log("   ✅ Staff user created: staff@company.com / staff123");
        } else {
            console.log("   ⏭️  Staff user already exists, skipping...");
        }

        // ========================================
        // 2. SEED CATEGORIES
        // ========================================
        console.log("\n📁 Seeding categories...");
        
        const defaultCategories = [
            { name: "Laptop", description: "Laptop dan notebook untuk kebutuhan kerja mobile" },
            { name: "Desktop/PC", description: "Komputer desktop untuk kebutuhan kerja statis" },
            { name: "Monitor", description: "Layar monitor untuk display" },
            { name: "Server", description: "Server fisik dan virtual" },
            { name: "Network Device", description: "Router, switch, access point, dan perangkat jaringan lainnya" },
            { name: "Printer", description: "Printer, scanner, dan perangkat cetak lainnya" },
            { name: "Software License", description: "Lisensi perangkat lunak" },
            { name: "Accessories", description: "Keyboard, mouse, webcam, headset, dll" },
            { name: "Mobile Device", description: "Smartphone dan tablet" },
            { name: "Other", description: "Perangkat IT lainnya" }
        ];

        for (const cat of defaultCategories) {
            const exists = await Categories.findOne({ where: { name: cat.name } });
            if (!exists) {
                await Categories.create(cat);
                console.log(`   ✅ Category created: ${cat.name}`);
            }
        }

        // ========================================
        // 3. SEED LOCATIONS
        // ========================================
        console.log("\n📍 Seeding locations...");
        
        const defaultLocations = [
            { name: "Head Office - Lantai 1", address: "Jl. Sudirman No. 1, Jakarta", description: "Kantor pusat lantai 1" },
            { name: "Head Office - Lantai 2", address: "Jl. Sudirman No. 1, Jakarta", description: "Kantor pusat lantai 2" },
            { name: "Head Office - Server Room", address: "Jl. Sudirman No. 1, Jakarta", description: "Ruang server utama" },
            { name: "IT Warehouse", address: "Jl. Gudang No. 5, Jakarta", description: "Gudang penyimpanan aset IT" },
            { name: "Branch Office - Surabaya", address: "Jl. Tunjungan No. 10, Surabaya", description: "Kantor cabang Surabaya" },
            { name: "Branch Office - Bandung", address: "Jl. Braga No. 15, Bandung", description: "Kantor cabang Bandung" }
        ];

        for (const loc of defaultLocations) {
            const exists = await Locations.findOne({ where: { name: loc.name } });
            if (!exists) {
                await Locations.create(loc);
                console.log(`   ✅ Location created: ${loc.name}`);
            }
        }

        // ========================================
        // 4. SEED SAMPLE EMPLOYEES
        // ========================================
        console.log("\n👥 Seeding sample employees...");
        
        const sampleEmployees = [
            { name: "Budi Santoso", email: "budi.santoso@company.com", department: "Finance", phone: "081234567890" },
            { name: "Siti Rahayu", email: "siti.rahayu@company.com", department: "Marketing", phone: "081234567891" },
            { name: "Agus Wijaya", email: "agus.wijaya@company.com", department: "Engineering", phone: "081234567892" },
            { name: "Dewi Lestari", email: "dewi.lestari@company.com", department: "HR", phone: "081234567893" },
            { name: "Rudi Hermawan", email: "rudi.hermawan@company.com", department: "Operations", phone: "081234567894" }
        ];

        for (const emp of sampleEmployees) {
            const exists = await Users.findOne({ where: { email: emp.email } });
            if (!exists) {
                await Users.create({
                    ...emp,
                    role: "employee",
                    is_active: true
                });
                console.log(`   ✅ Employee created: ${emp.name}`);
            }
        }

        // ========================================
        // 5. SEED SAMPLE ASSETS (Optional)
        // ========================================
        console.log("\n💻 Seeding sample assets...");
        
        const laptopCategory = await Categories.findOne({ where: { name: "Laptop" } });
        const warehouseLocation = await Locations.findOne({ where: { name: "IT Warehouse" } });

        if (laptopCategory && warehouseLocation) {
            const sampleAssets = [
                {
                    name: "MacBook Pro 14\" M3",
                    asset_code: "AST-LAP-001",
                    serial_number: "C02Y123456789",
                    category_id: laptopCategory.id,
                    location_id: warehouseLocation.id,
                    status: "available",
                    condition: "new",
                    purchase_date: "2024-01-15",
                    purchase_price: 35000000,
                    warranty_expiry: "2027-01-15",
                    specifications: {
                        processor: "Apple M3 Pro",
                        ram: "18GB",
                        storage: "512GB SSD",
                        display: "14.2 inch Liquid Retina XDR"
                    }
                },
                {
                    name: "Dell Latitude 5540",
                    asset_code: "AST-LAP-002",
                    serial_number: "DELL12345678",
                    category_id: laptopCategory.id,
                    location_id: warehouseLocation.id,
                    status: "available",
                    condition: "new",
                    purchase_date: "2024-02-01",
                    purchase_price: 18000000,
                    warranty_expiry: "2027-02-01",
                    specifications: {
                        processor: "Intel Core i7-1365U",
                        ram: "16GB DDR5",
                        storage: "512GB SSD",
                        display: "15.6 inch FHD"
                    }
                },
                {
                    name: "Lenovo ThinkPad X1 Carbon",
                    asset_code: "AST-LAP-003",
                    serial_number: "LNV987654321",
                    category_id: laptopCategory.id,
                    location_id: warehouseLocation.id,
                    status: "available",
                    condition: "good",
                    purchase_date: "2023-06-15",
                    purchase_price: 25000000,
                    warranty_expiry: "2026-06-15",
                    specifications: {
                        processor: "Intel Core i7-1260P",
                        ram: "16GB LPDDR5",
                        storage: "512GB SSD",
                        display: "14 inch 2.8K OLED"
                    }
                }
            ];

            for (const asset of sampleAssets) {
                const exists = await Assets.findOne({ where: { serial_number: asset.serial_number } });
                if (!exists) {
                    await Assets.create(asset);
                    console.log(`   ✅ Asset created: ${asset.name} (${asset.asset_code})`);
                }
            }
        }

        console.log("\n========================================");
        console.log("🎉 Database seeding completed successfully!");
        console.log("========================================\n");
        console.log("📝 Default Login Credentials:");
        console.log("   Admin: admin@company.com / admin123");
        console.log("   Staff: staff@company.com / staff123");
        console.log("\n");

    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        throw error;
    }
};

// Run seeder if executed directly
seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

export default seedDatabase;
