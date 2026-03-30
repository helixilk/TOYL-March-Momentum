import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/geminiService', () => ({
  generateYogaIntention: vi.fn(),
}));

import DailyIntention from '../components/DailyIntention';
import { generateYogaIntention } from '../services/geminiService';

const mockGenerate = generateYogaIntention as ReturnType<typeof vi.fn>;

describe('DailyIntention', () => {
  beforeEach(() => {
    mockGenerate.mockReset();
  });

  it('shows loading state initially', () => {
    mockGenerate.mockReturnValue(new Promise(() => {})); // never resolves
    render(<DailyIntention />);
    expect(screen.getByText('Seeking clarity...')).toBeInTheDocument();
  });

  it('shows intention text after successful fetch', async () => {
    mockGenerate.mockResolvedValue('Move with purpose today.');
    render(<DailyIntention />);
    await waitFor(() =>
      expect(screen.getByText(/"Move with purpose today\."/)).toBeInTheDocument()
    );
  });

  it('shows fallback text when service returns empty string', async () => {
    mockGenerate.mockResolvedValue('');
    render(<DailyIntention />);
    await waitFor(() =>
      // empty string wrapped in quotes → shows as ""
      expect(screen.queryByText('Seeking clarity...')).not.toBeInTheDocument()
    );
  });

  it('refresh button re-fetches intention', async () => {
    mockGenerate
      .mockResolvedValueOnce('First intention.')
      .mockResolvedValueOnce('Second intention.');

    render(<DailyIntention />);
    await waitFor(() =>
      expect(screen.getByText(/"First intention\."/)).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole('button', { name: /refresh intention/i }));
    await waitFor(() =>
      expect(screen.getByText(/"Second intention\."/)).toBeInTheDocument()
    );
    expect(mockGenerate).toHaveBeenCalledTimes(2);
  });

  it('refresh button is disabled while loading', () => {
    mockGenerate.mockReturnValue(new Promise(() => {}));
    render(<DailyIntention />);
    expect(screen.getByRole('button', { name: /refresh intention/i })).toBeDisabled();
  });
});
