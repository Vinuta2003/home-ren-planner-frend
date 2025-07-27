import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhaseCard from '../PhaseCard';

const basePhase = {
  id: 1,
  phaseName: 'Plumbing',
  phaseStatus: 'INPROGRESS',
  description: 'Install pipes and fixtures',
  startDate: '2024-06-01',
  endDate: '2024-06-10',
  phaseType: 'PLUMBING',
  vendorCost: null,
  materials: [
    {
      exposedId: 'm1',
      name: 'Pipe',
      quantity: 10,
      unit: 'm',
      pricePerQuantity: 100,
      totalPrice: 1000,
    },
  ],
};

describe('PhaseCard', () => {
  it('renders phase details', () => {
    render(
      <PhaseCard
        phase={{ ...basePhase, vendorCost: 5000, phaseStatus: 'COMPLETED' }}
        quote=""
        setQuotes={jest.fn()}
        submitQuote={jest.fn()}
      />
    );
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('Install pipes and fixtures')).toBeInTheDocument();
    expect(screen.getByText('2024-06-01')).toBeInTheDocument();
    expect(screen.getByText('2024-06-10')).toBeInTheDocument();
    expect(screen.getByText('PLUMBING')).toBeInTheDocument();
    expect(screen.getByText('₹5000')).toBeInTheDocument();
  });

  it('shows Not sent if vendorCost is null', () => {
    render(
      <PhaseCard
        phase={{ ...basePhase, vendorCost: null }}
        quote=""
        setQuotes={jest.fn()}
        submitQuote={jest.fn()}
      />
    );
    expect(screen.getByText('Not sent')).toBeInTheDocument();
  });

  it('renders materials list', () => {
    render(
      <PhaseCard
        phase={basePhase}
        quote=""
        setQuotes={jest.fn()}
        submitQuote={jest.fn()}
      />
    );
    expect(screen.getByText('Materials')).toBeInTheDocument();
    expect(screen.getByText('Pipe')).toBeInTheDocument();
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
    expect(screen.getByText('10 m')).toBeInTheDocument();
    expect(screen.getByText('Price/Unit:')).toBeInTheDocument();
    expect(screen.getByText('₹100')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('₹1000')).toBeInTheDocument();
  });

  it('does not render materials section if materials is empty', () => {
    render(
      <PhaseCard
        phase={{ ...basePhase, materials: [] }}
        quote=""
        setQuotes={jest.fn()}
        submitQuote={jest.fn()}
      />
    );
    expect(screen.queryByText('Materials')).not.toBeInTheDocument();
  });

  it('shows quote input and submit button if vendorCost is null and status is INSPECTION', () => {
    render(
      <PhaseCard
        phase={{ ...basePhase, vendorCost: null, phaseStatus: 'INSPECTION' }}
        quote="1234"
        setQuotes={jest.fn()}
        submitQuote={jest.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Enter quote (e.g., 5000)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit quote/i })).toBeInTheDocument();
  });

  it('calls setQuotes on input change', () => {
    const setQuotes = jest.fn();
    render(
      <PhaseCard
        phase={{ ...basePhase, vendorCost: null, phaseStatus: 'INSPECTION' }}
        quote=""
        setQuotes={setQuotes}
        submitQuote={jest.fn()}
      />
    );
    const input = screen.getByPlaceholderText('Enter quote (e.g., 5000)');
    fireEvent.change(input, { target: { value: '9999' } });
    expect(setQuotes).toHaveBeenCalled();
  });

  it('calls submitQuote on button click', () => {
    const submitQuote = jest.fn();
    render(
      <PhaseCard
        phase={{ ...basePhase, vendorCost: null, phaseStatus: 'INSPECTION' }}
        quote="1234"
        setQuotes={jest.fn()}
        submitQuote={submitQuote}
      />
    );
    const button = screen.getByRole('button', { name: /submit quote/i });
    fireEvent.click(button);
    expect(submitQuote).toHaveBeenCalledWith(basePhase.id);
  });

  it('renders correct status badge color', () => {
    const { rerender } = render(
      <PhaseCard phase={{ ...basePhase, phaseStatus: 'NOTSTARTED' }} quote="" setQuotes={jest.fn()} submitQuote={jest.fn()} />
    );
    expect(screen.getByText('NOTSTARTED')).toHaveClass('bg-red-100');
    rerender(<PhaseCard phase={{ ...basePhase, phaseStatus: 'INPROGRESS' }} quote="" setQuotes={jest.fn()} submitQuote={jest.fn()} />);
    expect(screen.getByText('INPROGRESS')).toHaveClass('bg-yellow-100');
    rerender(<PhaseCard phase={{ ...basePhase, phaseStatus: 'COMPLETED' }} quote="" setQuotes={jest.fn()} submitQuote={jest.fn()} />);
    expect(screen.getByText('COMPLETED')).toHaveClass('bg-green-100');
    rerender(<PhaseCard phase={{ ...basePhase, phaseStatus: 'INSPECTION' }} quote="" setQuotes={jest.fn()} submitQuote={jest.fn()} />);
    expect(screen.getByText('INSPECTION')).toHaveClass('bg-blue-100');
    rerender(<PhaseCard phase={{ ...basePhase, phaseStatus: 'OTHER' }} quote="" setQuotes={jest.fn()} submitQuote={jest.fn()} />);
    expect(screen.getByText('OTHER')).toHaveClass('bg-gray-100');
  });
}); 