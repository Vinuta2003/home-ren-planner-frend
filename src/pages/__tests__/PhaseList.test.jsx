import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import PhaseList from '../PhaseList';
import axios from 'axios';
import '@testing-library/jest-dom';
import thunk from 'redux-thunk';

jest.mock('axios');
const mockedAxios = axios;

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ exposedId: 'room123' }),
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  };
});

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: jest.fn(),
  };
});

const mockStore = configureStore([thunk]);



// Mock useSelector to return different states for different tests
const { useSelector } = require('react-redux');

const renderPhaseList = () => {
  return render(
    <MemoryRouter initialEntries={['/phase-list/room123']}>
      <Routes>
        <Route path="/phase-list/:exposedId" element={<PhaseList />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PhaseList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockedAxios.delete.mockClear();
  });

  test('renders component with title', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [],
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('Phases')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create phase/i })).toBeInTheDocument();
  });

  test('dispatches getPhasesByRoom action on component mount', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [],
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test('displays loading state when loading is true', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [],
          loading: true,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays message when no phases exist', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [],
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('No phases found. Create one now!')).toBeInTheDocument();
  });

  test('displays single phase with correct details', () => {
    const mockPhase = {
      id: 'phase-1',
      phaseName: 'Tiling Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'INPROGRESS',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('Tiling Phase')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('2025-01-05')).toBeInTheDocument();
    expect(screen.getByText('INPROGRESS')).toBeInTheDocument();
    expect(screen.getByTitle('Delete Phase')).toBeInTheDocument();
  });

  test('displays multiple phases correctly', () => {
    const mockPhases = [
      {
        id: 'phase-1',
        phaseName: 'Tiling',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
        phaseStatus: 'INPROGRESS',
      },
      {
        id: 'phase-2',
        phaseName: 'Painting',
        startDate: '2025-01-06',
        endDate: '2025-01-10',
        phaseStatus: 'NOTSTARTED',
      },
    ];

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: mockPhases,
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('Tiling')).toBeInTheDocument();
    expect(screen.getByText('Painting')).toBeInTheDocument();
    expect(screen.getByText('INPROGRESS')).toBeInTheDocument();
    expect(screen.getByText('NOTSTARTED')).toBeInTheDocument();
    expect(screen.getAllByTitle('Delete Phase')).toHaveLength(2);
  });

  test('displays correct status styling for different phase statuses', () => {
    const mockPhases = [
      {
        id: 'phase-1',
        phaseName: 'Phase 1',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
        phaseStatus: 'NOTSTARTED',
      },
      {
        id: 'phase-2',
        phaseName: 'Phase 2',
        startDate: '2025-01-06',
        endDate: '2025-01-10',
        phaseStatus: 'INPROGRESS',
      },
      {
        id: 'phase-3',
        phaseName: 'Phase 3',
        startDate: '2025-01-11',
        endDate: '2025-01-15',
        phaseStatus: 'INSPECTION',
      },
    ];

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: mockPhases,
          loading: false,
        },
      });
    });

    renderPhaseList();

    const notStartedStatus = screen.getByText('NOTSTARTED');
    const inProgressStatus = screen.getByText('INPROGRESS');
    const inspectionStatus = screen.getByText('INSPECTION');

    expect(notStartedStatus).toHaveClass('bg-red-100', 'text-red-700');
    expect(inProgressStatus).toHaveClass('bg-green-100', 'text-green-700');
    expect(inspectionStatus).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  test('phase links navigate to correct phase detail page', () => {
    const mockPhase = {
      id: 'phase-123',
      phaseName: 'Test Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'INPROGRESS',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    renderPhaseList();

    const phaseLink = screen.getByText('Test Phase').closest('a');
    expect(phaseLink).toHaveAttribute('href', '/phase/phase-123');
  });

  test('opens delete confirmation modal when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockPhase = {
      id: 'phase-1',
      phaseName: 'Test Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'NOTSTARTED',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    renderPhaseList();

    await user.click(screen.getByTitle('Delete Phase'));

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this phase? This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('closes delete confirmation modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const mockPhase = {
      id: 'phase-1',
      phaseName: 'Test Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'NOTSTARTED',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    renderPhaseList();

    await user.click(screen.getByTitle('Delete Phase'));
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  test('successfully deletes phase when confirmed', async () => {
    const user = userEvent.setup();
    const mockPhase = {
      id: 'phase-123',
      phaseName: 'Test Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'NOTSTARTED',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    mockedAxios.delete.mockResolvedValue({ data: { success: true } });

    renderPhaseList();

    await user.click(screen.getByTitle('Delete Phase'));
    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/phase/delete/phase-123');
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2); // Once on mount, once after delete
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));

    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  test('handles delete API error gracefully', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockPhase = {
      id: 'phase-123',
      phaseName: 'Test Phase',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      phaseStatus: 'NOTSTARTED',
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [mockPhase],
          loading: false,
        },
      });
    });

    mockedAxios.delete.mockRejectedValue(new Error('API Error'));

    renderPhaseList();

    await user.click(screen.getByTitle('Delete Phase'));
    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/phase/delete/phase-123');
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to delete phase', expect.any(Error));
      expect(alertSpy).toHaveBeenCalledWith('Error deleting phase');
    });

    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('navigates to phase form when create phase button is clicked', async () => {
    const user = userEvent.setup();

    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: [],
          loading: false,
        },
      });
    });

    renderPhaseList();

    await user.click(screen.getByRole('button', { name: /create phase/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/phase-form/room123');
  });

  test('handles undefined roomPhases gracefully', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: undefined,
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('No phases found. Create one now!')).toBeInTheDocument();
  });

  test('handles null roomPhases gracefully', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: {
          roomPhases: null,
          loading: false,
        },
      });
    });

    renderPhaseList();

    expect(screen.getByText('No phases found. Create one now!')).toBeInTheDocument();
  });

  test('handles missing phaselist state gracefully', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        phaselist: undefined,
      });
    });

    renderPhaseList();

    expect(screen.getByText('No phases found. Create one now!')).toBeInTheDocument();
  });
});
