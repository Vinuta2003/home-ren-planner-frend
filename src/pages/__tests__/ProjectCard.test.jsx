import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import axiosInstance from '../../axios/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../../axios/axiosInstance');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn()),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));
jest.mock('../RoomForm', () => ({ onRoomCreated, onCancel }) => (
  <div data-testid="room-form">
    Room Form
    <button data-testid="create-room" onClick={() => onRoomCreated({ exposedId: 'new-room', name: 'New Room' })}>
      Create Room
    </button>
    <button data-testid="cancel-room" onClick={onCancel}>
      Cancel
    </button>
  </div>
));
jest.mock('../RoomSlider', () => ({ rooms, onEdit, onDelete }) => (
  <div data-testid="room-slider">
    {rooms.map((room) => (
      <div key={room.exposedId} data-testid={`room-${room.exposedId}`}>
        {room.name}
        <button data-testid={`delete-room-${room.exposedId}`} onClick={() => onDelete(room.exposedId)}>
          Delete
        </button>
        <button data-testid={`edit-room-${room.exposedId}`} onClick={() => onEdit({ ...room, name: 'Edited Room' })}>
          Edit
        </button>
      </div>
    ))}
  </div>
));

const mockProject = {
  id: 1,
  exposedId: 'proj-1',
  name: 'Sample Project',
  description: 'Test description',
  serviceType: 'Construction',
  estimatedBudget: 5000,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  renovationType: 'LIVING_ROOM_REMODEL',
  rooms: [
    { exposedId: 'room-1', name: 'Living Room', renovationType: 'LIVING_ROOM_REMODEL' },
    { exposedId: 'room-2', name: 'Room Two', renovationType: 'BEDROOM_REMODEL' },
  ],
};

const renderCard = (project = mockProject, onEdit = jest.fn(), onDelete = jest.fn(), onRoomsUpdate = jest.fn()) => {
  return render(
    <BrowserRouter>
      <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} onRoomsUpdate={onRoomsUpdate} />
    </BrowserRouter>
  );
};

describe('ProjectCard - Full Coverage', () => {
  let onEditMock, onDeleteMock, onRoomsUpdateMock;

  beforeEach(() => {
    onEditMock = jest.fn();
    onDeleteMock = jest.fn();
    onRoomsUpdateMock = jest.fn();
    jest.clearAllMocks();
  });

  it('renders all project details including dates and budget', () => {
    renderCard(mockProject, onEditMock, onDeleteMock);
    expect(screen.getByText('Sample Project')).toBeInTheDocument();
    expect(screen.getByText('Construction')).toBeInTheDocument();
    expect(screen.getByText(/Budget: 5000/)).toBeInTheDocument();
    expect(screen.getByText(/Jan/)).toBeInTheDocument(); // Start date formatted
    expect(screen.getByTestId('room-slider')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderCard(mockProject, onEditMock, onDeleteMock);
    fireEvent.click(screen.getByTitle('Edit Project'));
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it('toggles RoomForm and handles room creation', () => {
    renderCard(mockProject, onEditMock, onDeleteMock, onRoomsUpdateMock);
    const addRoomBtn = screen.getByRole('button', { name: /add room/i });
    fireEvent.click(addRoomBtn);
    expect(screen.getByTestId('room-form')).toBeInTheDocument();

    // Simulate room creation
    fireEvent.click(screen.getByTestId('create-room'));
    expect(onRoomsUpdateMock).toHaveBeenCalledWith('proj-1', expect.any(Array));
    expect(screen.queryByTestId('room-form')).not.toBeInTheDocument(); // closes after create

    // Reopen and cancel
    fireEvent.click(addRoomBtn);
    fireEvent.click(screen.getByTestId('cancel-room'));
    expect(screen.queryByTestId('room-form')).not.toBeInTheDocument();
  });

  it('edits a room via RoomSlider', () => {
    renderCard(mockProject, onEditMock, onDeleteMock, onRoomsUpdateMock);
    fireEvent.click(screen.getByTestId('edit-room-room-1'));
    expect(onRoomsUpdateMock).toHaveBeenCalledWith('proj-1', expect.any(Array)); // state updated
  });

  it('deletes a room successfully', async () => {
    axiosInstance.delete.mockResolvedValue({ status: 200 });
    renderCard(mockProject, onEditMock, onDeleteMock, onRoomsUpdateMock);
    fireEvent.click(screen.getByTestId('delete-room-room-1'));
    await waitFor(() => expect(axiosInstance.delete).toHaveBeenCalled());
    expect(onRoomsUpdateMock).toHaveBeenCalled();
  });

  it('handles delete failure with toast error', async () => {
    axiosInstance.delete.mockRejectedValueOnce(new Error('Delete failed'));
    renderCard(mockProject, onEditMock, onDeleteMock);
    fireEvent.click(screen.getByTestId('delete-room-room-1'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to delete room'));
  });

  it('navigates to budget overview', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    renderCard(mockProject, onEditMock, onDeleteMock);
    fireEvent.click(screen.getByText(/Budget Overview/i));
    expect(navigate).toHaveBeenCalledWith('/proj-1/budget-overview');
  });

  it('renders empty state for no rooms (rooms: [])', () => {
    const emptyProject = { ...mockProject, rooms: [] };
    renderCard(emptyProject, onEditMock, onDeleteMock);
    expect(screen.getByText(/No rooms added/i)).toBeInTheDocument();
  });

  it('renders empty state for no rooms (rooms undefined)', () => {
    const undefinedRooms = { ...mockProject, rooms: undefined };
    renderCard(undefinedRooms, onEditMock, onDeleteMock);
    expect(screen.getByText(/No rooms added/i)).toBeInTheDocument();
  });

  it('handles undefined renovationType gracefully', () => {
    const brokenProject = { ...mockProject, renovationType: undefined };
    renderCard(brokenProject, onEditMock, onDeleteMock);
    expect(screen.getByText(/Sample Project/i)).toBeInTheDocument();
  });

  it('handles double clicking edit icon without errors', () => {
    renderCard(mockProject, onEditMock, onDeleteMock);
    const editBtn = screen.getByTitle('Edit Project');
    fireEvent.click(editBtn);
    fireEvent.click(editBtn);
    expect(onEditMock).toHaveBeenCalledTimes(2);
  });
});