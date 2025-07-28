import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Unauthorized from '../Unauthorized';

jest.mock('lucide-react', () => ({
  Lock: (props) => <svg data-testid="lock-icon" {...props} />
}));

describe('Unauthorized', () => {
  it('renders Unauthorized Access heading', () => {
    render(<Unauthorized />);
    expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
  });
  it('renders explanation text', () => {
    render(<Unauthorized />);
    expect(screen.getByText(/You do not have permission to view this page/i)).toBeInTheDocument();
    expect(screen.getByText(/Please login with an authorized account/i)).toBeInTheDocument();
  });
  it('renders Go to Login link', () => {
    render(<Unauthorized />);
    const link = screen.getByRole('link', { name: /Go to Login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
  it('renders Lock icon', () => {
    render(<Unauthorized />);
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });
}); 