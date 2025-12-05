import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import Layout from "../components/layout/Layout";

// Auth Pages
import Login from "../pages/auth/Login";

// Main Pages
import Dashboard from "../pages/dashboard/Dashboard";
import { AssetList, AssetDetail, AssetForm } from "../pages/assets";
import { UserList, UserForm } from "../pages/users";
import { TransactionList, Checkout, Checkin } from "../pages/transactions";
import CategoryList from "../pages/categories/CategoryList";
import LocationList from "../pages/locations/LocationList";
import Reports from "../pages/reports/Reports";
import ChatPage from "../pages/chat/ChatPage";
import { ProfileSettings } from "../pages/profile";
import { NotificationPage } from "../pages/notifications";

// Error Pages
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                {/* Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Assets */}
                <Route path="assets" element={<AssetList />} />
                <Route path="assets/add" element={<AssetForm />} />
                <Route path="assets/:id" element={<AssetDetail />} />
                <Route path="assets/edit/:id" element={<AssetForm />} />

                {/* Users - Admin Only */}
                <Route
                    path="users"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}>
                            <UserList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users/add"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <UserForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <UserForm />
                        </ProtectedRoute>
                    }
                />

                {/* Transactions */}
                <Route path="transactions" element={<TransactionList />} />
                <Route path="transactions/checkout" element={<Checkout />} />
                <Route path="transactions/checkin" element={<Checkin />} />

                {/* Master Data - Admin Only */}
                <Route
                    path="categories"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <CategoryList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="locations"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <LocationList />
                        </ProtectedRoute>
                    }
                />

                {/* Reports */}
                <Route path="reports" element={<Reports />} />

                {/* Profile */}
                <Route path="profile" element={<ProfileSettings />} />

                {/* Notifications */}
                <Route path="notifications" element={<NotificationPage />} />

                {/* AI Chat Query - Admin & Staff Only */}
                <Route
                    path="chat"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "staff"]}>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
