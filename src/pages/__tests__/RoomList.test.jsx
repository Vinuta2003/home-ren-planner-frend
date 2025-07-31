
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoomList from '../RoomList';
import axiosInstance from '../../axios/axiosInstance';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';

import '@testing-library/jest-dom';
import * as reactRouterDom from 'react-router-dom';
const mockNavigate = jest.fn();


// ✅ Properly mocking useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 🔧 Mock dependencies
jest.mock('../../axios/axiosInstance');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// 🔧 Helper
const renderComponent = (props) =>
  render(
    <BrowserRouter>
      <RoomList {...props} />
    </BrowserRouter>
  );

const mockRooms = [
  {
    exposedId: 'room-1',
    name: 'Bedroom',
    renovationType: 'BEDROOM_RENOVATION'
  },
  {
    exposedId: 'room-2',
    name: 'Kitchen',
    renovationType: 'KITCHEN_RENOVATION'
  }
];

describe('RoomList', () => {
  const onRoomsUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state and fetches rooms if not provided', async () => {
   axiosInstance.get.mockImplementationOnce(() =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: mockRooms }), 50)
  )
);


 await act(async () => {
    renderComponent({ projectId: '123', rooms: [], onRoomsUpdate, isLoading: true });

  });


    expect(await screen.findByText('Loading rooms...')).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/rooms/project/123');
      expect(onRoomsUpdate).toHaveBeenCalledWith(mockRooms);
      expect(screen.getByText('Bedroom')).toBeInTheDocument();
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
    });
  });

  it('renders provided rooms without calling API', () => {
    renderComponent({ projectId: '123', rooms: mockRooms, onRoomsUpdate });

    expect(screen.getByText('Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  it('handles API failure during room fetch', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('API Error'));

    renderComponent({ projectId: '123', rooms: [], onRoomsUpdate });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load rooms');
    });
  });

  it('can add a new room via RoomForm', async () => {
  renderComponent({ projectId: '123', rooms: [], onRoomsUpdate });

  await waitFor(() => {
    expect(screen.getByText('+ Add Room')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('+ Add Room'));

  expect(screen.getByText('Add New Room')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Room Name/i), {
    target: { value: 'Test Room' },
  });

  axiosInstance.post.mockResolvedValueOnce({
    data: {
      exposedId: 'new-id',
      name: 'Test Room',
      renovationType: 'FULL_RENOVATION',
    },
  });

  fireEvent.submit(screen.getByRole('button', { name: /create room/i }));

  await waitFor(() => {
    expect(onRoomsUpdate).toHaveBeenCalledWith([
      {
        exposedId: 'new-id',
        name: 'Test Room',
        renovationType: 'FULL_RENOVATION',
      },
    ]);
    expect(toast.success).toHaveBeenCalledWith('Room created successfully!');
  });
});


it('handles add room cancel', async () => {
  renderComponent({
    projectId: '123',
    rooms: [],
    onRoomsUpdate: jest.fn(),
  });

  await waitFor(() => {
    expect(screen.getByText('+ Add Room')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('+ Add Room'));
  fireEvent.click(screen.getByText('Cancel'));

  expect(screen.queryByLabelText(/room name/i)).not.toBeInTheDocument();
});




  it('deletes a room', async () => {
    axiosInstance.delete.mockResolvedValueOnce({});
    renderComponent({ projectId: '123', rooms: mockRooms, onRoomsUpdate });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/rooms/room-1');
      expect(onRoomsUpdate).toHaveBeenCalledWith([
        expect.objectContaining({ exposedId: 'room-2' })
      ]);
      expect(toast.success).toHaveBeenCalledWith('Room deleted successfully');
    });
  });

  it('handles delete failure', async () => {
    axiosInstance.delete.mockRejectedValueOnce(new Error('Delete fail'));
    renderComponent({ projectId: '123', rooms: mockRooms, onRoomsUpdate });

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete room');
    });
  });

  it('edits a room', async () => {
    const updatedRoom = {
      exposedId: 'room-1',
      name: 'Updated Name',
      renovationType: 'LIVING_ROOM_REMODEL'
    };

    axiosInstance.put.mockResolvedValueOnce({ data: updatedRoom });

    renderComponent({ projectId: '123', rooms: mockRooms, onRoomsUpdate });

    fireEvent.click(screen.getAllByText('Edit')[0]);

    const nameInput = screen.getByDisplayValue('Bedroom');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/rooms/room-1', {
        name: 'Updated Name',
        renovationType: 'BEDROOM_RENOVATION'
      });
      expect(toast.success).toHaveBeenCalledWith('Room updated successfully');
    });
  });

  it('handles edit failure', async () => {
    axiosInstance.put.mockRejectedValueOnce(new Error('Edit fail'));

    renderComponent({ projectId: '123', rooms: mockRooms, onRoomsUpdate });

    fireEvent.click(screen.getAllByText('Edit')[0]);
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update room');
    });
  });
it('shows message when there are no rooms', async () => {
  axiosInstance.get.mockResolvedValueOnce({ data: [] });

  renderComponent({
    projectId: '123',
    rooms: [], // ✅ Fix: Pass empty array so useState([]) works
    onRoomsUpdate
  });

  await waitFor(() => {
    expect(
      screen.getByText(/no rooms yet\. add your first room!/i)
    ).toBeInTheDocument();
  });
});



it('navigates to budget overview when HomeButton is clicked', () => {
  renderComponent({
    projectId: '123',
    rooms: [
      {
        id: 1,
        exposedId: 'abc',
        name: 'Test Room',
        renovationType: 'Bathroom',
        cost: 1000,
      },
    ],
    onRoomsUpdate,
  });

  const navBtn = screen.getByRole('button', { name: /go budget overview/i });
  expect(navBtn).toBeInTheDocument();

  fireEvent.click(navBtn);
  expect(mockNavigate).toHaveBeenCalledWith('/123/budget-overview');
});

});