import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProject from '../CreateProject';
import axiosInstance from '../../axios/axiosInstance';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

jest.mock('../../axios/axiosInstance');
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockProject = {
  id: 123,
  exposedId: '123',  // add this!
  name: 'Demo Project',
  serviceType: 'WHOLE_HOUSE',
  estimatedBudget: 5000,
  startDate: '2025-08-01',
  endDate: '2025-08-15',
};


describe('CreateProject Component', () => {
  const renderComponent = (props = {}) => render(<CreateProject {...props} />);

  const fillDateFields = () => {
    const dateLabels = screen.getAllByText(/Date \*/i);
    fireEvent.change(dateLabels[0].nextSibling, {
      target: { value: '2025-08-01' },
    });
    fireEvent.change(dateLabels[1].nextSibling, {
      target: { value: '2025-08-10' },
    });
  };

  it('renders form fields correctly', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/whole home renovation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter estimated budget/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/whole home renovation/i), {
      target: { value: 'New Project' },
    });
    expect(screen.getByPlaceholderText(/whole home renovation/i)).toHaveValue('New Project');
  });

  it('shows warning if start or end date is in the past', async () => {
    renderComponent();
    const pastDate = '2020-01-01';
    const dateLabels = screen.getAllByText(/Date \*/i);
    fireEvent.change(dateLabels[0].nextSibling, {
      target: { value: pastDate },
    });
    fireEvent.change(dateLabels[1].nextSibling, {
      target: { value: pastDate },
    });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalled();
    });
  });

  it('shows warning if end date is before start date', async () => {
    renderComponent();
    const dateLabels = screen.getAllByText(/Date \*/i);
    fireEvent.change(dateLabels[0].nextSibling, {
      target: { value: '2025-08-15' },
    });
    fireEvent.change(dateLabels[1].nextSibling, {
      target: { value: '2025-08-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalled();
    });
  });

  it('submits form and creates project', async () => {
    const onProjectSaved = jest.fn();
    const onCancel = jest.fn();
 axiosInstance.post.mockResolvedValueOnce({ data: mockProject });


    renderComponent({ onProjectSaved, onCancel });

    fireEvent.change(screen.getByPlaceholderText(/whole home renovation/i), {
      target: { value: 'New Project' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter estimated budget/i), {
      target: { value: '5000' },
    });
    fillDateFields();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'WHOLE_HOUSE' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/projects', expect.any(Object));
      expect(toast.success).toHaveBeenCalled();
      expect(onProjectSaved).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('submits form and updates project in edit mode', async () => {
    const onProjectSaved = jest.fn();
    const onCancel = jest.fn();
axiosInstance.put.mockResolvedValueOnce({ data: mockProject });


    renderComponent({ onProjectSaved, onCancel, existingProject: mockProject });

    fireEvent.change(screen.getByPlaceholderText(/whole home renovation/i), {
      target: { value: 'Updated Project' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter estimated budget/i), {
      target: { value: '6000' },
    });
    fillDateFields();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'WHOLE_HOUSE' },
    });
    // <-- THIS LINE WAS MODIFIED BELOW
    fireEvent.click(screen.getByRole('button', { name: /update project/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/projects/123', expect.any(Object));
      expect(toast.success).toHaveBeenCalledWith('Project updated successfully');
      expect(onProjectSaved).toHaveBeenCalledWith(expect.any(Object));
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    renderComponent({ onCancel });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('navigates to home when X icon is clicked', () => {
    renderComponent();
    // Avoid querying by name, just pick first button with icon
    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/userdashboard');
  });

  it('handles submission error and still navigates to dashboard', async () => {
    const onCancel = jest.fn();
    axiosInstance.post.mockRejectedValueOnce(new Error('Submission failed'));

    renderComponent({ onCancel });

    fireEvent.change(screen.getByPlaceholderText(/whole home renovation/i), {
      target: { value: 'Erroneous Project' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter estimated budget/i), {
      target: { value: '1000' },
    });
    fillDateFields();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'ROOM_WISE' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    // Expect navigation, not onCancel (per your current component behavior)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/userdashboard');
    });
  });
});
