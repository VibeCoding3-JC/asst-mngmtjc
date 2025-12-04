import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Custom render with providers
const AllProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </BrowserRouter>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
