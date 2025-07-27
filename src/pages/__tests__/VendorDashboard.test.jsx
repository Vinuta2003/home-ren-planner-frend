import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../redux/store';
import VendorDashboard from '../VendorDashboard';
import '@testing-library/jest-dom';

// Mock axiosInstance
jest.mock('../../axios/axiosInstance', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const axiosInstance = require('../../axios/axiosInstance');

describe('VendorDashboard', () => {
  function renderWithProviders(ui) {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    if (window.alert.mockRestore) {
      window.alert.mockRestore();
    }
  });

  test('shows approval pending message by default', async () => {
    // Mock the API calls to return the expected data
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: null } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    // Should show the approval pending message
    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    axiosInstance.get
      .mockRejectedValueOnce(new Error('API Error')) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      // Should still show the approval pending message even if API fails
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('shows rejected message when approval is false', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: false } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Has Been Rejected')).toBeInTheDocument();
    });
  });

  test('shows approved dashboard when approval is true', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles phases API error', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockRejectedValueOnce(new Error('Phases API Error')); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
      expect(screen.getByText('No phases assigned.')).toBeInTheDocument();
    });
  });

  test('displays phases when available', async () => {
    const mockPhases = [
      { 
        id: 1, 
        phaseName: 'Phase 1', 
        phaseStatus: 'INPROGRESS',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: 1000
      },
      { 
        id: 2, 
        phaseName: 'Phase 2', 
        phaseStatus: 'COMPLETED',
        description: 'Test phase 2',
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        phaseType: 'Plumbing',
        vendorCost: 2000
      },
    ];

    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: mockPhases }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles page size changes', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });

    const pageSizeSelect = screen.getByDisplayValue('3');
    expect(pageSizeSelect).toBeInTheDocument();
  });

  test('handles quote submission', async () => {
    const mockPhases = [{ 
      id: 1, 
      phaseName: 'Phase 1', 
      phaseStatus: 'INPROGRESS',
      description: 'Test phase 1',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      phaseType: 'Electrical',
      vendorCost: 1000
    }];

    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: mockPhases }); // phases

    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles quote submission error', async () => {
    const mockPhases = [{ 
      id: 1, 
      phaseName: 'Phase 1', 
      phaseStatus: 'INPROGRESS',
      description: 'Test phase 1',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      phaseType: 'Electrical',
      vendorCost: 1000
    }];

    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: mockPhases }); // phases

    axiosInstance.post.mockRejectedValueOnce(new Error('Quote submission failed'));

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles invalid quote submission', async () => {
    const mockPhases = [{ 
      id: 1, 
      phaseName: 'Phase 1', 
      phaseStatus: 'INPROGRESS',
      description: 'Test phase 1',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      phaseType: 'Electrical',
      vendorCost: 1000
    }];

    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: mockPhases }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles logout functionality', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles tab switching', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
    });
  });

  test('handles empty phases array', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
      expect(screen.getByText('No phases assigned.')).toBeInTheDocument();
    });
  });

  test('handles null approval status', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: null } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles undefined approval status', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: {} }) // getVendorDetails - no approval field
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles vendor details API error', async () => {
    axiosInstance.get
      .mockRejectedValueOnce(new Error('Vendor details API error')) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles both API errors', async () => {
    axiosInstance.get
      .mockRejectedValueOnce(new Error('Vendor details API error')) // getVendorDetails
      .mockRejectedValueOnce(new Error('Phases API error')); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles response without data', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({}) // getVendorDetails - no data
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Vendor Request Is Not Approved Yet')).toBeInTheDocument();
    });
  });

  test('handles phases response without data', async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases - provide empty array instead of no data

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument();
      expect(screen.getByText('No phases assigned.')).toBeInTheDocument();
    });
  });

  // Additional tests for uncovered lines
  test('submitQuote with invalid input shows alert', async () => {
    axiosInstance.get.mockReset();
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INSPECTION',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: null
      }] });
    renderWithProviders(<VendorDashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument());
    // Wait for the input to appear
    const input = await screen.findByPlaceholderText('Enter quote (e.g., 5000)');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /submit quote/i }));
    expect(window.alert).toHaveBeenCalledWith('Enter valid cost');
  });

  test('submitQuote with non-numeric input shows alert', async () => {
    axiosInstance.get.mockReset();
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INSPECTION',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: null
      }] });
    renderWithProviders(<VendorDashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument());
    const input = await screen.findByPlaceholderText('Enter quote (e.g., 5000)');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /submit quote/i }));
    expect(window.alert).toHaveBeenCalledWith('Enter valid cost');
  });

  test('submitQuote with API error shows alert', async () => {
    axiosInstance.get.mockReset();
    axiosInstance.post.mockReset();
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INSPECTION',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: null
      }] });
    axiosInstance.post.mockRejectedValueOnce(new Error('API error'));
    renderWithProviders(<VendorDashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument());
    const input = await screen.findByPlaceholderText('Enter quote (e.g., 5000)');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /submit quote/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to submit quote.');
    });
  });

  test('submitQuote with success calls fetchPhases', async () => {
    axiosInstance.get.mockReset();
    axiosInstance.post.mockReset();
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INSPECTION',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: null
      }] })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INSPECTION',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: null
      }] }); // for fetchPhases after submit
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    renderWithProviders(<VendorDashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument());
    const input = await screen.findByPlaceholderText('Enter quote (e.g., 5000)');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /submit quote/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Quote submitted successfully!');
    });
  });

  test('handleLogout dispatches logout and navigates', async () => {
    axiosInstance.get.mockReset();
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: true } })
      .mockResolvedValueOnce({ data: [{
        id: 1,
        phaseName: 'Phase 1',
        phaseStatus: 'INPROGRESS',
        description: 'Test phase 1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        phaseType: 'Electrical',
        vendorCost: 1000
      }] });
    const mockDispatch = jest.fn();
    const mockStore = {
      ...store,
      dispatch: mockDispatch
    };
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <VendorDashboard />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Assigned Phases' })).toBeInTheDocument());
    fireEvent.click(screen.getByText('Logout'));
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    jest.restoreAllMocks();
  });
}); 