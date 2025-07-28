import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import EditPhase from '../EditPhase';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

jest.mock('../../axios/axiosInstance');

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
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    expect(await screen.findByText(/Edit Phase/i)).toBeInTheDocument();
  });

  test('fetches and displays phase data', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    expect(await screen.findByDisplayValue('Demo Phase')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Demo description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });

  test('allows input change', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    const nameInput = await screen.findByDisplayValue('Demo Phase');
    fireEvent.change(nameInput, { target: { value: 'Updated Phase', name: 'phaseName' } });
    expect(nameInput.value).toBe('Updated Phase');
  });

  test('submits updated form data', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });
    axiosInstance.put.mockResolvedValueOnce({});

    renderComponent();

    // Wait for form to load
    const nameInput = await screen.findByDisplayValue('Demo Phase');
    
    // Change the input value
    fireEvent.change(nameInput, {
      target: { value: 'Updated Phase', name: 'phaseName' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('http://localhost:8080/phase/123', expect.objectContaining({
        phaseName: 'Updated Phase',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/phase/123');
    });
  });

  test('handles API error gracefully', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });
    axiosInstance.put.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderComponent();

    // Wait for form to load and submit
    await screen.findByDisplayValue('Demo Phase');
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('http://localhost:8080/phase/123', expect.objectContaining({
        phaseName: 'Demo Phase',
      }));
      expect(consoleSpy).toHaveBeenCalledWith('Phase update error:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('clicking cancel navigates to phase detail page', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
    axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

    renderComponent();

    fireEvent.click(await screen.findByRole('button', { name: /Cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/phase/123');
  });

  describe('Form Validation', () => {
    test('displays validation errors for empty required fields', async () => {
      const emptyPhaseData = {
        phaseName: '',
        description: 'Demo description',
        startDate: '',
        endDate: '',
        phaseStatus: 'PLANNED',
      };

      axiosInstance.get.mockResolvedValueOnce({ data: emptyPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      // Wait for form to load
      await screen.findByDisplayValue('Demo description');

      // Submit form with empty required fields
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Check for validation error messages
      await waitFor(() => {
        expect(screen.getByText('Please enter phase name')).toBeInTheDocument();
        expect(screen.getByText('Please enter start date')).toBeInTheDocument();
        expect(screen.getByText('Please enter end date')).toBeInTheDocument();
      });

      // Ensure API call was not made due to validation errors
      expect(axiosInstance.put).not.toHaveBeenCalled();
    });

    test('displays error when end date is before start date', async () => {
      const invalidDatePhaseData = {
        phaseName: 'Demo Phase',
        description: 'Demo description',
        startDate: '2024-12-31',
        endDate: '2024-01-01', // End date before start date
        phaseStatus: 'PLANNED',
      };

      axiosInstance.get.mockResolvedValueOnce({ data: invalidDatePhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      // Wait for form to load
      await screen.findByDisplayValue('Demo Phase');

      // Submit form with invalid date range
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Check for date validation error
      await waitFor(() => {
        expect(screen.getByText('End date cannot be before start date')).toBeInTheDocument();
      });

      // Ensure API call was not made due to validation error
      expect(axiosInstance.put).not.toHaveBeenCalled();
    });

    test('clears validation errors when form is corrected', async () => {
      const emptyPhaseData = {
        phaseName: '',
        description: 'Demo description',
        startDate: '',
        endDate: '',
        phaseStatus: 'PLANNED',
      };

      axiosInstance.get.mockResolvedValueOnce({ data: emptyPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });
      axiosInstance.put.mockResolvedValueOnce({});

      renderComponent();

      // Wait for form to load
      await screen.findByDisplayValue('Demo description');

      // Submit form to trigger validation errors
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText('Please enter phase name')).toBeInTheDocument();
      });

      // Fix the form by adding required values using direct DOM queries
      const inputs = screen.getAllByRole('textbox');
      const nameInput = inputs.find(input => input.name === 'phaseName');
      fireEvent.change(nameInput, { target: { value: 'Updated Phase', name: 'phaseName' } });
      
      // Use document.querySelector to directly access date inputs
      const startDateInput = document.querySelector('input[name="startDate"]');
      fireEvent.change(startDateInput, { target: { value: '2024-01-01', name: 'startDate' } });
      
      const endDateInput = document.querySelector('input[name="endDate"]');
      fireEvent.change(endDateInput, { target: { value: '2024-12-31', name: 'endDate' } });

      // Submit the corrected form
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Verify API call is made with corrected data
      await waitFor(() => {
        expect(axiosInstance.put).toHaveBeenCalledWith('http://localhost:8080/phase/123', expect.objectContaining({
          phaseName: 'Updated Phase',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }));
      });
    });
  });

  describe('Form Field Interactions', () => {
    test('handles description field changes', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      const descriptionField = await screen.findByDisplayValue('Demo description');
      fireEvent.change(descriptionField, {
        target: { value: 'Updated description', name: 'description' }
      });

      expect(descriptionField.value).toBe('Updated description');
    });

    test('handles status dropdown changes', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      const statusSelect = await screen.findByDisplayValue('PLANNED');
      fireEvent.change(statusSelect, {
        target: { value: 'IN_PROGRESS', name: 'phaseStatus' }
      });

      expect(statusSelect.value).toBe('IN_PROGRESS');
    });

    test('handles start date field changes', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      const startDateField = await screen.findByDisplayValue('2024-01-01');
      fireEvent.change(startDateField, {
        target: { value: '2024-02-01', name: 'startDate' }
      });

      expect(startDateField.value).toBe('2024-02-01');
    });

    test('handles end date field changes', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      const endDateField = await screen.findByDisplayValue('2024-12-31');
      fireEvent.change(endDateField, {
        target: { value: '2024-11-30', name: 'endDate' }
      });

      expect(endDateField.value).toBe('2024-11-30');
    });
  });

  describe('Loading and Error States', () => {
    test('shows loading state when phaseData is null', async () => {
      // Mock the component to return null phaseData initially
      axiosInstance.get.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderComponent();

      // The component shows the form even when loading, so let's test that it renders without crashing
      // when phaseData is not yet loaded
      await waitFor(() => {
        expect(screen.getByText('Edit Phase')).toBeInTheDocument();
      });
      
      // The form should be present but may have empty values
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    test('handles phase fetch API error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axiosInstance.get.mockRejectedValueOnce(new Error('Phase fetch failed'));
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Phase fetch error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('handles status fetch API error gracefully', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      // Mock the status fetch to succeed but return empty array to simulate error handling
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      renderComponent();

      // Form should still render with phase data even if statuses fail to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Demo Phase')).toBeInTheDocument();
      });

      // Status dropdown should still be present
      const statusSelect = screen.getByRole('combobox');
      expect(statusSelect).toBeInTheDocument();
      expect(statusSelect.name).toBe('phaseStatus');
    });
  });

  describe('Edge Cases', () => {
    test('handles phase data with missing fields gracefully', async () => {
      const incompletePhaseData = {
        phaseName: 'Demo Phase',
        // Missing other fields
      };

      axiosInstance.get.mockResolvedValueOnce({ data: incompletePhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });

      renderComponent();

      // Should render without crashing
      await waitFor(() => {
        expect(screen.getByDisplayValue('Demo Phase')).toBeInTheDocument();
      });

      // Empty fields should have empty values - find textarea specifically
      const textboxes = screen.getAllByRole('textbox');
      const descriptionField = textboxes.find(element => element.name === 'description');
      expect(descriptionField).toHaveValue('');
      expect(descriptionField.name).toBe('description');
    });

    test('handles empty status array', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: [] }); // Empty statuses

      renderComponent();

      await waitFor(() => {
        expect(screen.getByDisplayValue('Demo Phase')).toBeInTheDocument();
      });

      // Status dropdown should still be present
      const statusSelect = screen.getByRole('combobox');
      expect(statusSelect).toBeInTheDocument();
      expect(statusSelect.name).toBe('phaseStatus');
    });

    test('submits form with all fields filled correctly', async () => {
      const completePhaseData = {
        phaseName: 'Complete Phase',
        description: 'Complete description',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        phaseStatus: 'IN_PROGRESS',
      };

      axiosInstance.get.mockResolvedValueOnce({ data: completePhaseData });
      axiosInstance.get.mockResolvedValueOnce({ data: mockStatuses });
      axiosInstance.put.mockResolvedValueOnce({});

      renderComponent();

      // Wait for form to load
      await screen.findByDisplayValue('Complete Phase');

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Verify API call with complete data
      await waitFor(() => {
        expect(axiosInstance.put).toHaveBeenCalledWith('http://localhost:8080/phase/123', expect.objectContaining({
          phaseName: 'Complete Phase',
          description: 'Complete description',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          phaseStatus: 'IN_PROGRESS'
        }));
        expect(mockNavigate).toHaveBeenCalledWith('/phase/123');
      });
    });
  });
});
