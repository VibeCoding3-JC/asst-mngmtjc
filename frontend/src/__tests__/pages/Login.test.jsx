import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/auth/Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Mock the auth context
const mockLogin = vi.fn();
vi.mock('../../context/AuthContext', async () => {
    const actual = await vi.importActual('../../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            login: mockLogin,
            user: null,
            isAuthenticated: false
        })
    };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: null })
    };
});

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        renderLogin();
        
        expect(screen.getByText('IT Asset Management')).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
    });

    it('allows entering email and password', async () => {
        const user = userEvent.setup();
        renderLogin();
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        await user.type(emailInput, 'admin@company.com');
        await user.type(passwordInput, 'admin123');
        
        expect(emailInput).toHaveValue('admin@company.com');
        expect(passwordInput).toHaveValue('admin123');
    });

    it('submits form with credentials', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({ success: true });
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/email/i), 'admin@company.com');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /masuk/i }));
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin@company.com', 'admin123');
        });
    });

    it('shows loading state during submission', async () => {
        const user = userEvent.setup();
        // Make login take some time
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/email/i), 'admin@company.com');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /masuk/i }));
        
        expect(screen.getByText(/memproses/i)).toBeInTheDocument();
    });

    it('shows error message on login failure', async () => {
        const user = userEvent.setup();
        mockLogin.mockRejectedValue({
            response: { data: { message: 'Email atau password salah' } }
        });
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/email/i), 'wrong@email.com');
        await user.type(screen.getByLabelText(/password/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /masuk/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
        });
    });

    it('disables submit button while loading', async () => {
        const user = userEvent.setup();
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/email/i), 'admin@company.com');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        
        const submitButton = screen.getByRole('button', { name: /masuk/i });
        await user.click(submitButton);
        
        expect(submitButton).toBeDisabled();
    });

    it('requires email and password fields', () => {
        renderLogin();
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('has correct input types', () => {
        renderLogin();
        
        expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
        expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });
});
