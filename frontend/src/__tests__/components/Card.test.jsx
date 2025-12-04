import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card, { StatCard } from '../../components/common/Card';
import { CubeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

describe('Card Component', () => {
    it('renders card with children', () => {
        render(<Card><p>Card content</p></Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders card with title', () => {
        render(<Card title="Card Title"><p>Content</p></Card>);
        expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders card with subtitle', () => {
        render(
            <Card title="Card Title" subtitle="Card subtitle">
                <p>Content</p>
            </Card>
        );
        expect(screen.getByText('Card subtitle')).toBeInTheDocument();
    });

    it('renders card with icon', () => {
        render(
            <Card title="Card Title" icon={CubeIcon}>
                <p>Content</p>
            </Card>
        );
        expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders card with action', () => {
        render(
            <Card title="Card Title" action={<button>Action</button>}>
                <p>Content</p>
            </Card>
        );
        expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('renders without padding when padding is false', () => {
        const { container } = render(
            <Card padding={false}><p>Content</p></Card>
        );
        // Check the content wrapper doesn't have p-6 class
        const contentDiv = container.querySelector('.bg-white > div:last-child');
        expect(contentDiv).not.toHaveClass('p-6');
    });

    it('applies custom className', () => {
        const { container } = render(
            <Card className="custom-class"><p>Content</p></Card>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });
});

describe('StatCard Component', () => {
    it('renders stat card with title and value', () => {
        render(<StatCard title="Total Assets" value="150" />);
        expect(screen.getByText('Total Assets')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('renders stat card with subtitle', () => {
        render(
            <StatCard 
                title="Total Assets" 
                value="150" 
                subtitle="Last updated today" 
            />
        );
        expect(screen.getByText('Last updated today')).toBeInTheDocument();
    });

    it('renders stat card with icon', () => {
        render(
            <StatCard 
                title="Total Assets" 
                value="150" 
                icon={ChartBarIcon}
            />
        );
        expect(screen.getByText('Total Assets')).toBeInTheDocument();
    });

    it('renders stat card with upward trend', () => {
        render(
            <StatCard 
                title="Total Assets" 
                value="150" 
                trend="up"
                trendValue="+12%"
            />
        );
        expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('renders stat card with downward trend', () => {
        render(
            <StatCard 
                title="Total Assets" 
                value="150" 
                trend="down"
                trendValue="-5%"
            />
        );
        expect(screen.getByText('-5%')).toBeInTheDocument();
    });

    it('applies different color variants', () => {
        const { rerender, container } = render(
            <StatCard 
                title="Total" 
                value="100" 
                icon={ChartBarIcon}
                color="success"
            />
        );
        expect(container.querySelector('.bg-success-100')).toBeInTheDocument();

        rerender(
            <StatCard 
                title="Total" 
                value="100" 
                icon={ChartBarIcon}
                color="danger"
            />
        );
        expect(container.querySelector('.bg-danger-100')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <StatCard 
                title="Total" 
                value="100" 
                className="custom-stat"
            />
        );
        expect(container.firstChild).toHaveClass('custom-stat');
    });
});
