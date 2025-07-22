import { render, screen, waitFor } from '@testing-library/react';
import VendorListDisplay from '../VendorListDisplay';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// ✅ Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
  Toaster: () => <></>,
}));

// ✅ matchMedia mock for JSDOM compatibility
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
});

// ✅ Stable formData outside mock
const stableFormData = { renovationType: 'ELECTRICAL' };

// ✅ Mock useLocation and useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/vendors',
      search: '',
      state: {
        formData: stableFormData, // 🔒 Prevent re-creation
      },
    }),
    useNavigate: () => jest.fn(),
  };
});

// ✅ Mock axios
jest.mock('axios');

const mockVendors = [
  {
    id: 'uuid-123',
    name: 'Vendor One',
    rating: 4.5,
    verified: true,
  },
  {
    id: 'uuid-456',
    name: 'Vendor Two',
    rating: 4.2,
    verified: false,
  },
];

test('renders vendor list correctly', async () => {
  axios.get.mockResolvedValueOnce({ data: mockVendors });

  render(
    <MemoryRouter>
      <VendorListDisplay />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
    expect(screen.getByText('Vendor Two')).toBeInTheDocument();
  });
});
