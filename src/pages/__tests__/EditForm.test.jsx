import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import EditPhase from '../EditPhase' // Update path as needed
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: () => ({ id: '123' }),
  };
});


jest.mock('axios');

const mockNavigate = require('react-router-dom').useNavigate;

describe('EditPhaseForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPhaseData = {
    phaseName: 'Demo Phase',
    description: 'Demo description',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    phaseStatus: 'PLANNED',
  };

  const mockStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED'];

  function renderComponent() {
    return render(
      <MemoryRouter initialEntries={['/phase/edit/123']}>
        <Routes>
          <Route path="/phase/edit/:id" element={<EditPhase />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renders loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    expect(await screen.findByText(/Edit Phase/i)).toBeInTheDocument();
  });

  test('fetches and displays phase data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    expect(await screen.findByDisplayValue('Demo Phase')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Demo description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });

  test('allows input change', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    const nameInput = await screen.findByDisplayValue('Demo Phase');
    fireEvent.change(nameInput, { target: { value: 'Updated Phase', name: 'phaseName' } });
    expect(nameInput.value).toBe('Updated Phase');
  });

  test('submits updated form data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });
    axios.put.mockResolvedValueOnce({});

    const navigateMock = jest.fn();
    mockNavigate.mockReturnValue(navigateMock);

    renderComponent();

    fireEvent.change(await screen.findByDisplayValue('Demo Phase'), {
      target: { value: 'Updated Phase', name: 'phaseName' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/phase/123', expect.objectContaining({
        phaseName: 'Updated Phase',
      }));
      expect(navigateMock).toHaveBeenCalledWith('/phase/123');
    });
  });

  test('handles API error gracefully', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });
    axios.put.mockRejectedValueOnce(new Error('Network error'));

    window.alert = jest.fn();
    renderComponent();

    fireEvent.click(await screen.findByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to update phase.');
    });
  });

  test('clicking cancel navigates to phase detail page', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPhaseData });
    axios.get.mockResolvedValueOnce({ data: mockStatuses });

    const navigateMock = jest.fn();
    mockNavigate.mockReturnValue(navigateMock);

    renderComponent();

    fireEvent.click(await screen.findByRole('button', { name: /Cancel/i }));

    expect(navigateMock).toHaveBeenCalledWith('/phase/123');
  });
});
