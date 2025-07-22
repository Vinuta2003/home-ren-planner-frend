import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../redux/store';
import VendorDashboard from '../VendorDashboard';
import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

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
  });

  test('shows approval pending message by default', async () => {
    // Mock the API calls to return the expected data
    axiosInstance.get
      .mockResolvedValueOnce({ data: { approval: null } }) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    // Should show the approval pending message
    await waitFor(() => {
      expect(screen.getByText(/your request is not approved yet/i)).toBeInTheDocument();
    });
  });



  test('handles API errors gracefully', async () => {
    axiosInstance.get
      .mockRejectedValueOnce(new Error('API Error')) // getVendorDetails
      .mockResolvedValueOnce({ data: [] }); // phases

    renderWithProviders(<VendorDashboard />);

    await waitFor(() => {
      // Should still show the approval pending message even if API fails
      expect(screen.getByText(/your request is not approved yet/i)).toBeInTheDocument();
    });
  });
}); 