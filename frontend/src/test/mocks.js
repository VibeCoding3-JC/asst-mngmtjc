import { vi } from 'vitest';

// Mock user data
export const mockUser = {
    uuid: 'user-uuid-123',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin'
};

// Mock assets data
export const mockAssets = [
    {
        uuid: 'asset-1',
        name: 'Laptop Dell XPS 15',
        asset_code: 'AST-001',
        serial_number: 'DL-2024-001',
        status: 'available',
        condition: 'good',
        category: { uuid: 'cat-1', name: 'Laptop' },
        location: { uuid: 'loc-1', name: 'Kantor Pusat' },
        purchase_date: '2024-01-15',
        purchase_price: 15000000
    },
    {
        uuid: 'asset-2',
        name: 'Monitor LG 27"',
        asset_code: 'AST-002',
        serial_number: 'LG-2024-001',
        status: 'assigned',
        condition: 'good',
        category: { uuid: 'cat-2', name: 'Monitor' },
        location: { uuid: 'loc-1', name: 'Kantor Pusat' },
        holder: { uuid: 'user-1', name: 'John Doe' },
        purchase_date: '2024-02-20',
        purchase_price: 5000000
    }
];

// Mock categories
export const mockCategories = [
    { uuid: 'cat-1', name: 'Laptop', description: 'Portable computers' },
    { uuid: 'cat-2', name: 'Monitor', description: 'Display devices' },
    { uuid: 'cat-3', name: 'Printer', description: 'Printing devices' }
];

// Mock locations
export const mockLocations = [
    { uuid: 'loc-1', name: 'Kantor Pusat', address: 'Jakarta' },
    { uuid: 'loc-2', name: 'Cabang Surabaya', address: 'Surabaya' }
];

// Mock users/employees
export const mockUsers = [
    { uuid: 'user-1', name: 'John Doe', email: 'john@company.com', role: 'employee', department: 'IT' },
    { uuid: 'user-2', name: 'Jane Smith', email: 'jane@company.com', role: 'employee', department: 'HR' }
];

// Mock dashboard stats
export const mockDashboardStats = {
    totalAssets: 150,
    availableAssets: 80,
    assignedAssets: 50,
    repairAssets: 15,
    retiredAssets: 5,
    totalValue: 1500000000,
    assetsByCategory: [
        { name: 'Laptop', value: 60 },
        { name: 'Monitor', value: 40 },
        { name: 'Printer', value: 30 }
    ],
    assetsByStatus: [
        { name: 'Available', value: 80 },
        { name: 'Assigned', value: 50 },
        { name: 'Repair', value: 15 },
        { name: 'Retired', value: 5 }
    ],
    recentTransactions: [
        { uuid: 'txn-1', action_type: 'checkout', asset: { name: 'Laptop Dell' }, employee: { name: 'John' }, transaction_date: '2024-12-01' }
    ]
};

// Mock transactions
export const mockTransactions = [
    {
        uuid: 'txn-1',
        action_type: 'checkout',
        transaction_date: '2024-12-01',
        asset: { uuid: 'asset-1', name: 'Laptop Dell XPS 15', asset_code: 'AST-001' },
        employee: { uuid: 'user-1', name: 'John Doe', department: 'IT' },
        admin: { uuid: 'admin-1', name: 'Admin User' },
        notes: 'For project work'
    },
    {
        uuid: 'txn-2',
        action_type: 'checkin',
        transaction_date: '2024-12-03',
        asset: { uuid: 'asset-1', name: 'Laptop Dell XPS 15', asset_code: 'AST-001' },
        employee: { uuid: 'user-1', name: 'John Doe', department: 'IT' },
        admin: { uuid: 'admin-1', name: 'Admin User' },
        notes: 'Project completed'
    }
];

// Create mock axios
export const createMockAxios = () => {
    return {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
        create: vi.fn(() => createMockAxios()),
        defaults: {
            baseURL: 'http://localhost:5000/api'
        },
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() }
        }
    };
};
