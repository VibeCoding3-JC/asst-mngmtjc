import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge, { getStatusLabel, getRoleLabel, getTransactionLabel } from '../../components/common/Badge';

describe('Badge Component', () => {
    it('renders badge with text', () => {
        render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders different variants', () => {
        const { rerender } = render(<Badge variant="success">Success</Badge>);
        expect(screen.getByText('Success')).toHaveClass('bg-success-100');

        rerender(<Badge variant="danger">Danger</Badge>);
        expect(screen.getByText('Danger')).toHaveClass('bg-danger-100');

        rerender(<Badge variant="warning">Warning</Badge>);
        expect(screen.getByText('Warning')).toHaveClass('bg-warning-100');
    });

    it('renders status variants', () => {
        const { rerender } = render(<Badge variant="available">Available</Badge>);
        expect(screen.getByText('Available')).toHaveClass('bg-success-100');

        rerender(<Badge variant="in_use">In Use</Badge>);
        expect(screen.getByText('In Use')).toHaveClass('bg-primary-100');
    });

    it('renders different sizes', () => {
        const { rerender } = render(<Badge size="xs">XS</Badge>);
        expect(screen.getByText('XS')).toHaveClass('text-xs');

        rerender(<Badge size="md">MD</Badge>);
        expect(screen.getByText('MD')).toHaveClass('text-sm');
    });

    it('renders with dot indicator', () => {
        const { container } = render(<Badge dot variant="success">With Dot</Badge>);
        // Check if dot element exists
        const dotElement = container.querySelector('.w-1\\.5.h-1\\.5.rounded-full');
        expect(dotElement).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Badge className="custom-class">Custom</Badge>);
        expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });

    it('falls back to default variant for unknown variants', () => {
        render(<Badge variant="unknown">Unknown</Badge>);
        expect(screen.getByText('Unknown')).toHaveClass('bg-gray-100');
    });
});

describe('Badge Helper Functions', () => {
    describe('getStatusLabel', () => {
        it('returns correct Indonesian labels', () => {
            expect(getStatusLabel('available')).toBe('Tersedia');
            expect(getStatusLabel('in_use')).toBe('Digunakan');
            expect(getStatusLabel('under_repair')).toBe('Perbaikan');
            expect(getStatusLabel('disposed')).toBe('Dibuang');
        });

        it('returns original value for unknown status', () => {
            expect(getStatusLabel('unknown')).toBe('unknown');
        });
    });

    describe('getRoleLabel', () => {
        it('returns correct labels', () => {
            expect(getRoleLabel('admin')).toBe('Admin');
            expect(getRoleLabel('staff')).toBe('Staff');
            expect(getRoleLabel('employee')).toBe('Karyawan');
        });

        it('returns original value for unknown role', () => {
            expect(getRoleLabel('unknown')).toBe('unknown');
        });
    });

    describe('getTransactionLabel', () => {
        it('returns correct Indonesian labels', () => {
            expect(getTransactionLabel('checkout')).toBe('Peminjaman');
            expect(getTransactionLabel('checkin')).toBe('Pengembalian');
            expect(getTransactionLabel('transfer')).toBe('Transfer');
            expect(getTransactionLabel('repair')).toBe('Perbaikan');
        });

        it('returns original value for unknown type', () => {
            expect(getTransactionLabel('unknown')).toBe('unknown');
        });
    });
});
