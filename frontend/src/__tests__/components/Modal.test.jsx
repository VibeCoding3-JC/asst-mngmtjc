import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Modal from '../../components/common/Modal';

describe('Modal Component', () => {
    it('renders modal when open', () => {
        render(
            <Modal isOpen={true} onClose={() => {}} title="Test Modal">
                <p>Modal content</p>
            </Modal>
        );
        
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render modal when closed', () => {
        render(
            <Modal isOpen={false} onClose={() => {}} title="Test Modal">
                <p>Modal content</p>
            </Modal>
        );
        
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Modal content</p>
            </Modal>
        );
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        
        await waitFor(() => {
            expect(handleClose).toHaveBeenCalled();
        });
    });

    it('renders without close button when showClose is false', () => {
        render(
            <Modal isOpen={true} onClose={() => {}} title="Test Modal" showClose={false}>
                <p>Modal content</p>
            </Modal>
        );
        
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders footer when provided', () => {
        render(
            <Modal 
                isOpen={true} 
                onClose={() => {}} 
                title="Test Modal"
                footer={<button>Save</button>}
            >
                <p>Modal content</p>
            </Modal>
        );
        
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(
            <Modal isOpen={true} onClose={() => {}} title="Test Modal">
                <form>
                    <input type="text" placeholder="Enter name" />
                    <button type="submit">Submit</button>
                </form>
            </Modal>
        );
        
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
});
