import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

import LegalModal from '../components/LegalModal';

const noop = () => {};

describe('LegalModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(<LegalModal isOpen={false} onClose={noop} title="Terms" content={<p>Content</p>} />);
    expect(screen.queryByText('Terms')).not.toBeInTheDocument();
  });

  it('renders title and content when isOpen is true', () => {
    render(
      <LegalModal isOpen={true} onClose={noop} title="Terms of Service" content={<p>My terms</p>} />
    );
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('My terms')).toBeInTheDocument();
  });

  it('calls onClose when the X button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <LegalModal isOpen={true} onClose={handleClose} title="Terms" content={<p>Content</p>} />
    );
    // X button (icon only, find by its role in the header area)
    const closeButtons = screen.getAllByRole('button');
    await userEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the footer Close button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <LegalModal isOpen={true} onClose={handleClose} title="Terms" content={<p>Content</p>} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^close$/i }));
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
