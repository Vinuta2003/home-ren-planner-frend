

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VendorListDisplay from '../VendorListDisplay';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axiosInstance from '../../axios/axiosInstance';
import { act } from 'react-dom/test-utils';

jest.mock('react-hot-toast', () => {
  const mockToast = {
    error: jest.fn(),
    success: jest.fn(),
    promise: jest.fn(),
  };

  const toastMockFn = Object.assign(() => {}, mockToast);

  return {
    __esModule: true,
    default: toastMockFn,
    Toaster: () => <></>,
  };
});


// ✅ Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

// ✅ Stable formData
const stableFormData = {
  phaseName: 'Sample',
  description: '',
  phaseType: 'ELECTRICAL',
  phaseStatus: '',
  startDate: '',
  endDate: '',
  vendorId: '',
  vendorName: '',
  room: 'room-123',
};

// ✅ Vendors for mocking
const mockVendors = [
  {
    id: 'uuid-123',
    name: 'Vendor One',
    rating: 4.5,
    verified: true,
    experience: 5,
    basePrice: 1200,
    companyName: 'ABC Pvt Ltd',
    reviews: [
      {
        reviewerName: 'Alice',
        rating: 4,
        comment: 'Great service!',
        createdAt: '2024-07-20T00:00:00Z',
      },
    ],
  },
  {
    id: 'uuid-456',
    name: 'Vendor Two',
    rating: 4.2,
    verified: false,
    experience: 3,
    basePrice: 950,
    companyName: 'XYZ Solutions',
    reviews: [],
  },
];

// ✅ Navigation mock
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

// ✅ Mock axios
jest.mock('../../axios/axiosInstance', () => ({
  get: jest.fn(),
}));

// ✅ Helper to render with custom location state
function renderComponent({ query = '?phaseType=ELECTRICAL', formData = stableFormData } = {}) {
  mockUseLocation.mockReturnValue({
    pathname: '/vendor-list',
    search: query,
    state: formData ? { formData } : undefined,
  });

  render(<VendorListDisplay />, { wrapper: MemoryRouter });
}

// ✅ TEST CASES
test('renders vendor list correctly', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
    expect(screen.getByText('Vendor Two')).toBeInTheDocument();
    expect(screen.getByText('ABC Pvt Ltd')).toBeInTheDocument();
    expect(screen.getByText('XYZ Solutions')).toBeInTheDocument();
  });
});

test('shows loading message while fetching', async () => {
  axiosInstance.get.mockImplementation(() =>
    new Promise((resolve) => setTimeout(() => resolve({ data: mockVendors }), 100))
  );

  renderComponent();
  expect(screen.getByText('Loading vendors...')).toBeInTheDocument();

  await waitFor(() =>
    expect(screen.queryByText('Loading vendors...')).not.toBeInTheDocument()
  );
});

test('handles API error gracefully', async () => {
  axiosInstance.get.mockRejectedValueOnce(new Error('API error'));
  renderComponent();

  await waitFor(() =>
    expect(screen.queryByText('Loading vendors...')).not.toBeInTheDocument()
  );
});

test('shows message when no vendors are available', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: [] });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('No vendors available.')).toBeInTheDocument();
  });
});

test('displays vendor profile and returns back to list', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByRole('button', { name: /view profile/i })[0]);

  await waitFor(() => {
    expect(screen.getByText('Select this Vendor')).toBeInTheDocument();
    expect(screen.getByText(/Experience:/i)).toBeInTheDocument();
    expect(screen.getByText(/Company:/i)).toBeInTheDocument();
    expect(screen.getByText(/Price:/i)).toBeInTheDocument();
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /← Back to list/i }));
  expect(screen.getByText('Vendor One')).toBeInTheDocument();
});

test('shows "No reviews yet." if vendor has no reviews', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('Vendor Two')).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByRole('button', { name: /view profile/i })[1]);

  await waitFor(() => {
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });
});

test('calls navigate when "Select Vendor" button is clicked', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByRole('button', { name: /select vendor/i })[0]);

  expect(mockNavigate).toHaveBeenCalledWith(
    `/phase-form/room-123?vendorId=uuid-123&vendorName=Vendor%20One`,
    expect.objectContaining({ state: { formData: stableFormData } })
  );
});

test('calls navigate from profile view "Select this Vendor"', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByRole('button', { name: /view profile/i })[0]);

  await waitFor(() => {
    expect(screen.getByText('Select this Vendor')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /select this vendor/i }));

  expect(mockNavigate).toHaveBeenCalledWith(
    `/phase-form/room-123?vendorId=uuid-123&vendorName=Vendor%20One`,
    expect.objectContaining({ state: { formData: stableFormData } })
  );
});
test('shows toast error and navigates back if phaseType missing', async () => {
  // Get the mocked toast instance
  const { default: toast } = require('react-hot-toast');

  // Clear mocks
  toast.error.mockClear();
  mockNavigate.mockClear();

  // Render the component with no query parameters
  renderComponent({ query: '' });

  // Expect toast error and navigation
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('No phaseType provided');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
test('does not call toast or navigate if phaseType is present', async () => {
  const { default: toast } = require('react-hot-toast');
  toast.error.mockClear();
  mockNavigate.mockClear();

  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });

  renderComponent({ query: '?phaseType=ELECTRICAL' });

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
  });

  expect(toast.error).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();
});
test('shows toast error and navigates back if formData is missing', async () => {
  const { default: toast } = require('react-hot-toast');
  toast.error.mockClear();
  mockNavigate.mockClear();

  renderComponent({ formData: null }); // intentionally missing

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Missing form data');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

test('renders default fallback values when vendor fields are missing', async () => {
  mockUseLocation.mockReturnValue({
    search: '?phaseType=PLUMBING',
    state: { formData: {} },
  });

  axiosInstance.get.mockResolvedValueOnce({
    data: [
      {
        id: 'vendor123',
        name: 'Vendor Missing Fields',
        // Missing: experience, companyName, basePrice, rating
      },
    ],
  });

  render(<VendorListDisplay />);

  // Wait for vendor to load
  await waitFor(() => screen.getByText('Vendor Missing Fields'));

  // Click view profile
  fireEvent.click(screen.getByText('View Profile'));

  // Assert fallback values are shown
  expect(screen.getByText(/Experience: 2 years/)).toBeInTheDocument();
  expect(screen.getByText(/Company: Independent/)).toBeInTheDocument();
  expect(screen.getByText(/Price: ₹500/)).toBeInTheDocument();


});
