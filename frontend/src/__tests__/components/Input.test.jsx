import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/common/Input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

describe('Input Component', () => {
    it('renders input with label', () => {
        render(<Input label="Email" name="email" />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders input without label', () => {
        render(<Input name="email" placeholder="Enter email" />);
        expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    it('shows required asterisk when required', () => {
        render(<Input label="Email" name="email" required />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        const handleChange = vi.fn();
        render(
            <Input 
                label="Email" 
                name="email" 
                value="" 
                onChange={handleChange} 
            />
        );
        
        fireEvent.change(screen.getByLabelText(/email/i), { 
            target: { value: 'test@example.com' } 
        });
        
        expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message', () => {
        render(
            <Input 
                label="Email" 
                name="email" 
                error="Email is required" 
            />
        );
        
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows helper text', () => {
        render(
            <Input 
                label="Email" 
                name="email" 
                helperText="We'll never share your email" 
            />
        );
        
        expect(screen.getByText(/we'll never share your email/i)).toBeInTheDocument();
    });

    it('disables input when disabled prop is true', () => {
        render(<Input label="Email" name="email" disabled />);
        expect(screen.getByLabelText(/email/i)).toBeDisabled();
    });

    it('renders with icon on left', () => {
        render(
            <Input 
                label="Search" 
                name="search" 
                icon={MagnifyingGlassIcon} 
                iconPosition="left" 
            />
        );
        expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    });

    it('renders different input types', () => {
        const { rerender } = render(
            <Input label="Password" name="password" type="password" />
        );
        expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');

        rerender(<Input label="Number" name="number" type="number" />);
        expect(screen.getByLabelText(/number/i)).toHaveAttribute('type', 'number');
    });

    it('calls onBlur when input loses focus', () => {
        const handleBlur = vi.fn();
        render(<Input label="Email" name="email" onBlur={handleBlur} />);
        
        const input = screen.getByLabelText(/email/i);
        fireEvent.blur(input);
        
        expect(handleBlur).toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Input label="Email" name="email" className="custom-wrapper" />
        );
        expect(container.firstChild).toHaveClass('custom-wrapper');
    });
});
