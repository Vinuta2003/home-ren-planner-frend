import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
const mockedAxios = axios;
jest.mock('axios');

// Mock createPhaseApi
const mockCreatePhaseApi = jest.fn();
jest.mock('../../axios/phaseListAPIs', () => ({
  createPhaseApi: mockCreatePhaseApi,
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
  useParams: () => mockUseParams(),
}));

// Import component after mocks
import PhaseForm from '../PhaseForm';

describe('PhaseForm Component', () => {
  const mockRoomId = '45942c44-903f-440e-81ba-990640e05a8f';
  
  const defaultMockData = {
    roomData: { renovationType: 'KITCHEN_RENOVATION' },
    phaseStatuses: ['NOTSTARTED', 'INPROGRESS'],
    phaseTypes: ['TILING', 'PAINTING'],
    phaseExists: false,
  };

  const setupMocks = ({
    locationState = null,
    searchParams = '',
    roomData = defaultMockData.roomData,
    phaseStatuses = defaultMockData.phaseStatuses,
    phaseTypes = defaultMockData.phaseTypes,
    phaseExists = defaultMockData.phaseExists,
  } = {}) => {
    // Mock useParams
    mockUseParams.mockReturnValue({ exposedId: mockRoomId });
    
    // Mock useLocation
    mockUseLocation.mockReturnValue({
      search: searchParams,
      state: locationState,
    });

    // Mock axios calls
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes(`/rooms/${mockRoomId}`)) {
        return Promise.resolve({ data: roomData });
      }
      if (url.includes('/api/enums/phase-statuses')) {
        return Promise.resolve({ data: phaseStatuses });
      }
      if (url.includes('/by-renovation-type/')) {
        return Promise.resolve({ data: phaseTypes });
      }
      if (url.includes('/phase/phase/exists')) {
        return Promise.resolve({ data: phaseExists });
      }
      return Promise.reject(new Error('Unexpected API call'));
    });

    // Mock createPhaseApi
    mockCreatePhaseApi.mockResolvedValue({ data: { success: true } });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  test('renders form with initial empty state', async () => {
    render(<PhaseForm />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Phase Name')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('-- Select Phase Type --')).toBeInTheDocument();
    expect(screen.getByText('-- Select Phase Status --')).toBeInTheDocument();
    expect(screen.getByText('Choose Vendor From List')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Phase' })).toBeInTheDocument();
  });

  test('populates form from location state', async () => {
    const formData = {
      phaseName: 'Test Phase',
      description: 'Test Description',
      phaseType: 'TILING',
      phaseStatus: 'NOTSTARTED',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      vendorName: 'Test Vendor',
    };

    setupMocks({ locationState: { formData } });
    render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Phase')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Vendor')).toBeInTheDocument();
  });

  test('populates vendor info from URL search params', async () => {
    setupMocks({ searchParams: '?vendorId=123&vendorName=URL%20Vendor' });
    render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('URL Vendor')).toBeInTheDocument();
    });
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<PhaseForm />);

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create Phase' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Phase' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter phase name')).toBeInTheDocument();
    });

    expect(screen.getByText('Please select phase type')).toBeInTheDocument();
    expect(screen.getByText('Please select phase status')).toBeInTheDocument();
    expect(screen.getByText('Please enter start date')).toBeInTheDocument();
    expect(screen.getByText('Please enter end date')).toBeInTheDocument();
  });

  test('shows error when end date is before start date', async () => {
    const user = userEvent.setup();
    const { container } = render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create Phase' })).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Phase Name'), 'Test Phase');
    
    const startDateInput = container.querySelector('input[name="startDate"]');
    const endDateInput = container.querySelector('input[name="endDate"]');
    
    await user.type(startDateInput, '2025-08-05');
    await user.type(endDateInput, '2025-08-01');

    const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
    const phaseStatusSelect = container.querySelector('select[name="phaseStatus"]');
    
    await user.selectOptions(phaseTypeSelect, 'TILING');
    await user.selectOptions(phaseStatusSelect, 'NOTSTARTED');

    await user.click(screen.getByRole('button', { name: 'Create Phase' }));

    await waitFor(() => {
      expect(screen.getByText('End date cannot be before start date')).toBeInTheDocument();
    });
  });

  test('alerts when trying to select vendor without phase type', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByText('Choose Vendor From List')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Choose Vendor From List'));

    expect(alertSpy).toHaveBeenCalledWith('Please select a phase type first');
    
    alertSpy.mockRestore();
  });

  test('navigates to vendor list when phase type is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<PhaseForm />);

    // Wait for phase types to be loaded from API
    await waitFor(() => {
      const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
      expect(phaseTypeSelect).toBeInTheDocument();
      expect(phaseTypeSelect.querySelector('option[value="TILING"]')).toBeInTheDocument();
    });

    // Select phase type
    const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
    await user.selectOptions(phaseTypeSelect, 'TILING');

    await user.click(screen.getByText('Choose Vendor From List'));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/vendor-list?phaseType=TILING',
      expect.objectContaining({
        state: expect.objectContaining({
          formData: expect.any(Object),
        }),
      })
    );
  });

  test('successfully submits form with valid data', async () => {
    const user = userEvent.setup();
    
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes(`/rooms/${mockRoomId}`)) {
        return Promise.resolve({ data: { renovationType: 'KITCHEN_RENOVATION' } });
      }
      if (url.includes('/api/enums/phase-statuses')) {
        return Promise.resolve({ data: ['NOTSTARTED', 'INPROGRESS'] });
      }
      if (url.includes('/by-renovation-type/')) {
        return Promise.resolve({ data: ['TILING', 'PAINTING'] });
      }
      if (url.includes('/phase/phase/exists')) {
        return Promise.resolve({ data: false }); 
      }
      return Promise.reject(new Error('Unexpected API call'));
    });
    
    mockCreatePhaseApi.mockResolvedValue({ data: { success: true } });
    
    const { container } = render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Phase Name')).toBeInTheDocument();
      const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
      const phaseStatusSelect = container.querySelector('select[name="phaseStatus"]');
      expect(phaseTypeSelect).toBeInTheDocument();
      expect(phaseStatusSelect).toBeInTheDocument();
      expect(phaseTypeSelect.querySelector('option[value="TILING"]')).toBeInTheDocument();
      expect(phaseStatusSelect.querySelector('option[value="NOTSTARTED"]')).toBeInTheDocument();
    });

    // Fill out the form step by step
    await user.type(screen.getByPlaceholderText('Phase Name'), 'Test Phase');
    await user.type(screen.getByPlaceholderText('Description'), 'Test Description');
    
    const startDateInput = container.querySelector('input[name="startDate"]');
    const endDateInput = container.querySelector('input[name="endDate"]');
    const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
    const phaseStatusSelect = container.querySelector('select[name="phaseStatus"]');
    
    await user.type(startDateInput, '2025-08-01');
    await user.type(endDateInput, '2025-08-05');
    await user.selectOptions(phaseTypeSelect, 'TILING');
    await user.selectOptions(phaseStatusSelect, 'NOTSTARTED');

    await user.click(screen.getByRole('button', { name: 'Create Phase' }));

    await waitFor(() => {
      expect(screen.queryByText('Please enter phase name')).not.toBeInTheDocument();
      expect(screen.queryByText('Please select phase type')).not.toBeInTheDocument();
      expect(screen.queryByText('Please select phase status')).not.toBeInTheDocument();
      expect(screen.queryByText('Please enter start date')).not.toBeInTheDocument();
      expect(screen.queryByText('Please enter end date')).not.toBeInTheDocument();
    });
  });

  test('shows alert when phase already exists', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    setupMocks({ phaseExists: true });
    
    const { container } = render(<PhaseForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Phase Name')).toBeInTheDocument();
      const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
      const phaseStatusSelect = container.querySelector('select[name="phaseStatus"]');
      expect(phaseTypeSelect).toBeInTheDocument();
      expect(phaseStatusSelect).toBeInTheDocument();
      expect(phaseTypeSelect.querySelector('option[value="TILING"]')).toBeInTheDocument();
      expect(phaseStatusSelect.querySelector('option[value="NOTSTARTED"]')).toBeInTheDocument();
    });

    // Fill out ALL required fields to pass validation
    await user.type(screen.getByPlaceholderText('Phase Name'), 'Test Phase');
    await user.type(screen.getByPlaceholderText('Description'), 'Test Description');
    
    const startDateInput = container.querySelector('input[name="startDate"]');
    const endDateInput = container.querySelector('input[name="endDate"]');
    const phaseTypeSelect = container.querySelector('select[name="phaseType"]');
    const phaseStatusSelect = container.querySelector('select[name="phaseStatus"]');
    
    await user.type(startDateInput, '2025-08-01');
    await user.type(endDateInput, '2025-08-05');
    await user.selectOptions(phaseTypeSelect, 'TILING');
    await user.selectOptions(phaseStatusSelect, 'NOTSTARTED');

    await user.click(screen.getByRole('button', { name: 'Create Phase' }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Phase of this type already exists for the room.');
    });

    expect(mockCreatePhaseApi).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
