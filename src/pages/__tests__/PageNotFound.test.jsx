import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PageNotFound from '../PageNotFound';

jest.mock('lucide-react', () => ({
  Search: (props) => <svg data-testid="search-icon" {...props} />
}));

describe('PageNotFound', () => {
  it('renders 404 heading', () => {
    render(<PageNotFound />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
  it('renders explanation text', () => {
    render(<PageNotFound />);
    expect(screen.getByText(/Sorry, the page you are looking for does not exist/i)).toBeInTheDocument();
    expect(screen.getByText(/It might have been moved or deleted/i)).toBeInTheDocument();
  });
  it('renders Go to Home link', () => {
    render(<PageNotFound />);
    const link = screen.getByRole('link', { name: /Go to Home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
  it('renders Search icon', () => {
    render(<PageNotFound />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
}); 