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

import FAQ from '../components/FAQ';

describe('FAQ', () => {
  it('renders all 6 questions', () => {
    render(<FAQ />);
    // Partial regex matches to avoid special-character encoding issues (smart quotes, em dash)
    const patterns = [
      /times for the livestream classes/i,
      /reach out if.*questions/i,
      /not flexible at all/i,
      /special equipment/i,
      /falling behind/i,
      /keep myself motivated/i,
    ];
    patterns.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
  });

  it('answers are hidden by default', () => {
    render(<FAQ />);
    expect(screen.queryByText(/two \(2\) livestream sessions/i)).not.toBeInTheDocument();
  });

  it('clicking a question reveals the answer', async () => {
    render(<FAQ />);
    await userEvent.click(screen.getByText(/times for the livestream classes/i));
    expect(screen.getByText(/two \(2\) livestream sessions/i)).toBeInTheDocument();
  });

  it('clicking an open question hides the answer', async () => {
    render(<FAQ />);
    const question = screen.getByText(/times for the livestream classes/i);
    await userEvent.click(question);
    expect(screen.getByText(/two \(2\) livestream sessions/i)).toBeInTheDocument();
    await userEvent.click(question);
    expect(screen.queryByText(/two \(2\) livestream sessions/i)).not.toBeInTheDocument();
  });

  it('opening one item does not open another', async () => {
    render(<FAQ />);
    await userEvent.click(screen.getByText(/times for the livestream classes/i));
    expect(screen.queryByText(/charles@toyl\.ca/i)).not.toBeInTheDocument();
  });
});
