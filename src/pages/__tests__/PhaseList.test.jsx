import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import PhaseList from '../PhaseList';
import axios from 'axios';
import '@testing-library/jest-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';


jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ exposedId: 'room123' }),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

jest.mock('../../redux/phase/phaseListSlice', () => ({
  getPhasesByRoom: (roomId) => ({
    type: 'GET_PHASES',
    payload: roomId,
  }),
}));

const mockStore = configureMockStore([thunk]);



const renderWithProviders = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/phase-list/room123']}>
        <Routes>
          <Route path="/phase-list/:exposedId" element={<PhaseList />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('PhaseList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state when loading is true', () => {
    const store = mockStore({
      phaselist: {
        loading: true,
        roomPhases: [],
      },
    });

    renderWithProviders(store);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('displays message when no phases exist', () => {
    const store = mockStore({
      phaselist: {
        loading: false,
        roomPhases: [],
      },
    });

    renderWithProviders(store);

    expect(screen.getByText(/no phases found/i)).toBeInTheDocument();
  });

  test('displays a list of phases with correct details', () => {
    const store = mockStore({
      phaselist: {
        loading: false,
        roomPhases: [
          {
            id: 'phase-1',
            phaseName: 'Tiling',
            startDate: '2025-01-01',
            endDate: '2025-01-05',
            phaseStatus: 'INPROGRESS',
          },
        ],
      },
    });

    renderWithProviders(store);

    expect(screen.getByText(/Tiling/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date:/i)).toHaveTextContent('2025-01-01');
    expect(screen.getByText(/End Date:/i)).toHaveTextContent('2025-01-05');
    expect(screen.getByText('INPROGRESS')).toBeInTheDocument();
  });

  test('opens and cancels delete confirmation popup', () => {
    const store = mockStore({
      phaselist: {
        loading: false,
        roomPhases: [
          {
            id: 'phase-1',
            phaseName: 'Plumbing',
            startDate: '2025-01-02',
            endDate: '2025-01-10',
            phaseStatus: 'NOTSTARTED',
          },
        ],
      },
    });

    renderWithProviders(store);

    fireEvent.click(screen.getByTitle('Delete Phase'));
    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
  });

  test('confirms delete and calls API then dispatches refresh', async () => {
    const store = mockStore({
      phaselist: {
        loading: false,
        roomPhases: [
          {
            id: 'phase-2',
            phaseName: 'Painting',
            startDate: '2025-02-01',
            endDate: '2025-02-10',
            phaseStatus: 'INSPECTION',
          },
        ],
      },
    });

    axios.delete.mockResolvedValue({});

    renderWithProviders(store);

    fireEvent.click(screen.getByTitle('Delete Phase'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/phase/delete/phase-2');
    });
  });

  test('navigates to create phase form on button click', () => {
    const store = mockStore({
      phaselist: {
        loading: false,
        roomPhases: [],
      },
    });

    renderWithProviders(store);

    fireEvent.click(screen.getByRole('button', { name: /create phase/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/phase-form/room123');
  });
});
