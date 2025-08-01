// src/pages/__tests__/RoomForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoomForm from '../RoomForm';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


// 🔧 Mocks
jest.mock('../../axios/axiosInstance');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockOnRoomCreated = jest.fn();
const mockOnCancel = jest.fn();
const mockProjectId = 'project-123'; // ✅ Add mock project ID

const renderRoomForm = () =>
  render(
    <BrowserRouter>
      <RoomForm
        onRoomCreated={mockOnRoomCreated}
        onCancel={mockOnCancel}
        projectId={mockProjectId} // ✅ Include required prop
      />
    </BrowserRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
});





test('renders RoomForm with inputs and submit button', () => {
  renderRoomForm();
  expect(screen.getByLabelText(/room name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/renovation type/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create room/i })).toBeInTheDocument();
});

test('shows error when room name is empty', async () => {
  renderRoomForm();
  fireEvent.change(screen.getByLabelText(/renovation type/i), {
    target: { value: 'KITCHEN_RENOVATION' },
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  await waitFor(() => {
    expect(axiosInstance.post).not.toHaveBeenCalled(); // ✅ API should not be called
  });

  
});

test('creates room successfully', async () => {
  axiosInstance.post.mockResolvedValue({
    data: { id: 1, name: 'Living Room' },
  });

  renderRoomForm();
  fireEvent.change(screen.getByLabelText(/room name/i), {
    target: { value: 'Living Room' },
  });
  fireEvent.change(screen.getByLabelText(/renovation type/i), {
    target: { value: 'KITCHEN_RENOVATION' }, // ✅ valid
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  await waitFor(() => {
    expect(axiosInstance.post).toHaveBeenCalled();
    expect(mockOnRoomCreated).toHaveBeenCalled();

  });
});

test('handles 401 error correctly', async () => {
  axiosInstance.post.mockRejectedValue({ response: { status: 401 } });

 toast.error = jest.fn();




  renderRoomForm();
  fireEvent.change(screen.getByLabelText(/room name/i), {
    target: { value: 'Bedroom' },
  });
  fireEvent.change(screen.getByLabelText(/renovation type/i), {
    target: { value: 'BEDROOM_RENOVATION' }, // ✅ valid
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

await waitFor(() => {
  expect(toast.error).toHaveBeenCalledWith('Session expired. Please login again.');
  
});


});

test('handles general API error with message', async () => {
  axiosInstance.post.mockRejectedValue({
    response: { status: 500, data: { message: 'Something went wrong' } },
  });

  renderRoomForm();
  fireEvent.change(screen.getByLabelText(/room name/i), {
    target: { value: 'Kitchen' },
  });
  fireEvent.change(screen.getByLabelText(/renovation type/i), {
    target: { value: 'KITCHEN_RENOVATION' }, // ✅ valid
  });
  fireEvent.click(screen.getByRole('button', { name: /create room/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});

test('calls onCancel when cancel button is clicked', () => {
  renderRoomForm();
  fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(mockOnCancel).toHaveBeenCalled();
});