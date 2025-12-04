import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

        rerender(<Button variant="danger">Danger</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-danger-600');

        rerender(<Button variant="success">Success</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-success-600');
    });

    it('renders different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('px-3');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('px-5');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when disabled prop is true', () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Disabled</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows loading state', () => {
        render(<Button loading>Loading</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    it('renders with icon on left', () => {
        render(<Button icon={PlusIcon} iconPosition="left">Add</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders full width button', () => {
        render(<Button fullWidth>Full Width</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('sets correct button type', () => {
        const { rerender } = render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

        rerender(<Button type="reset">Reset</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
});
