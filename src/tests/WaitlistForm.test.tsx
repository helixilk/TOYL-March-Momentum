import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import WaitlistForm from '../components/WaitlistForm';

function makeFetchResponse(ok: boolean, body: unknown): Response {
  return {
    ok,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('WaitlistForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders first name, last name, email inputs and a submit button in idle state', () => {
    vi.stubGlobal('fetch', vi.fn());
    render(<WaitlistForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join the waitlist/i })).toBeInTheDocument();
  });

  it('shows "Joining..." and disables the button while fetch is in flight', async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: Response) => void;
    const pendingFetch = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingFetch));

    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByRole('button', { name: /joining\.\.\./i })).toBeDisabled();

    // Resolve inside act so React can process the state update cleanly
    await act(async () => {
      resolveFetch(makeFetchResponse(true, { success: true }));
    });
  });

  it('shows success confirmation after fetch resolves with ok: true', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(makeFetchResponse(true, { success: true }))
    );

    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() =>
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument()
    );
  });

  it('shows error message after fetch resolves with ok: false', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(makeFetchResponse(false, { error: 'CRM error' }))
    );

    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('CRM error')
    );
  });

  it('shows fallback error message when fetch rejects (network error)', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network failure'))
    );

    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Network failure')
    );
  });
});
