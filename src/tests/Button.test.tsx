import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../components/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a <button> by default', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders as an <a> when href is provided', () => {
    render(<Button href="https://example.com">Go</Button>);
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it.each(['primary', 'outline', 'ghost', 'gradient'] as const)(
    'renders %s variant without error',
    (variant) => {
      render(<Button variant={variant}>Label</Button>);
      expect(screen.getByText('Label')).toBeInTheDocument();
    }
  );

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole('button', { name: 'Click' }).click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
