import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionHeading from '../components/SectionHeading';

describe('SectionHeading', () => {
  it('renders the title', () => {
    render(<SectionHeading title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Title" subtitle="Some subtitle text" />);
    expect(screen.getByText('Some subtitle text')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<SectionHeading title="Title" />);
    expect(screen.queryByText('Some subtitle text')).not.toBeInTheDocument();
  });

  it('applies centered alignment by default', () => {
    const { container } = render(<SectionHeading title="Title" />);
    expect(container.firstChild).toHaveClass('text-center');
  });

  it('applies left alignment when centered={false}', () => {
    const { container } = render(<SectionHeading title="Title" centered={false} />);
    expect(container.firstChild).toHaveClass('text-left');
  });
});
