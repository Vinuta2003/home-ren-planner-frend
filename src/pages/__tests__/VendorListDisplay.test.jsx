import { render, screen, waitFor } from '@testing-library/react';
import VendorListDisplay from '../VendorListDisplay';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axiosInstance from '../../axios/axiosInstance'; // ✅ Important!

// ✅ Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
  Toaster: () => <></>,
}));

// ✅ Mock matchMedia for JSDOM
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
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

// ✅ Mock formData
const stableFormData = {
  phaseName: 'Sample',
  description: '',
  phaseType: 'ELECTRICAL',
  phaseStatus: '',
  startDate: '',
  endDate: '',
  vendorId: '',
  vendorName: '',
  room: 'room-123', // 🔥 Required for assignToPhaseForm!
};

// ✅ Mock useLocation and useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/vendor-list',
      search: '?phaseType=ELECTRICAL',
      state: {
        formData: stableFormData,
      },
    }),
    useNavigate: () => jest.fn(),
  };
});

// ✅ Mock axiosInstance
jest.mock('../../axios/axiosInstance', () => ({
  get: jest.fn(),
}));

// ✅ Sample vendors
const mockVendors = [
  {
    id: 'uuid-123',
    name: 'Vendor One',
    rating: 4.5,
    verified: true,
    experience: 5,
    basePrice: 1200,
    companyName: 'ABC Pvt Ltd',
  },
  {
    id: 'uuid-456',
    name: 'Vendor Two',
    rating: 4.2,
    verified: false,
    experience: 3,
    basePrice: 950,
    companyName: 'XYZ Solutions',
  },
];

test('renders vendor list correctly when vendors are available', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });

  render(
    <MemoryRouter>
      <VendorListDisplay />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
    expect(screen.getByText('Vendor Two')).toBeInTheDocument();
    expect(screen.getByText('ABC Pvt Ltd')).toBeInTheDocument();
    expect(screen.getByText('XYZ Solutions')).toBeInTheDocument();
  });
});
test('shows message when no vendors are available', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: [] });

  render(
    <MemoryRouter>
      <VendorListDisplay />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('No vendors available.')).toBeInTheDocument();
  });
});
test('shows vendor details when View Profile is clicked', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: mockVendors });

  render(
    <MemoryRouter>
      <VendorListDisplay />
    </MemoryRouter>
  );

  // Wait for vendors to load
  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
  });

  // Click the "View Profile" button
  const viewButtons = screen.getAllByRole('button', { name: /view profile/i });
  expect(viewButtons.length).toBeGreaterThan(0);
  viewButtons[0].click();

  // Wait for selected vendor profile to render
  await waitFor(() => {
    expect(screen.getByText('Select this Vendor')).toBeInTheDocument();
    expect(screen.getByText(/Experience:/i)).toBeInTheDocument();
    expect(screen.getByText(/Company:/i)).toBeInTheDocument();
    expect(screen.getByText(/Price:/i)).toBeInTheDocument();
  });
});
