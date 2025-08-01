// src/__tests__/RoomCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomCard from '../RoomCard'; // adjust import path
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// 🔧 Mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// 🔧 Mock RoomEditForm
jest.mock('../RoomEditForm', () => ({ room, onCancel, onSave }) => (
  <div data-testid="room-edit-form">
    <button onClick={onCancel}>Cancel Edit</button>
    <button onClick={() => onSave({ ...room, name: 'Updated Room' })}>
      Save Edit
    </button>
  </div>
));

describe('RoomCard', () => {
  const mockRoom = {
    exposedId: 'room-1',
    name: 'Living Room',
    renovationType: 'LIVING_ROOM_REMODEL',
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders room name and type correctly', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    expect(screen.getByText('Living Room')).toBeInTheDocument();
    expect(screen.getByText('living room remodel')).toBeInTheDocument();
  });

  it('navigates on card click', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText(/view phase details/i));
    expect(mockNavigate).toHaveBeenCalledWith('/phase/room/room-1');
  });

  it('does not trigger navigation when Edit is clicked', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows RoomEditForm when Edit is clicked', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByTestId('room-edit-form')).toBeInTheDocument();
  });

  it('returns to view mode when Cancel in edit form is clicked', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Cancel Edit'));
    expect(screen.queryByTestId('room-edit-form')).not.toBeInTheDocument();
  });

  it('calls onEdit when Save is clicked in edit form', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Room' }));
  });

  it('calls onDelete when Delete is clicked', () => {
    render(<RoomCard room={mockRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

 test('handles undefined renovationType gracefully', () => {
  const brokenRoom = { ...mockRoom, renovationType: undefined };
  render(<RoomCard room={brokenRoom} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

  const paragraphs = screen.getAllByRole('paragraph', { hidden: true }); // will likely return 0

  // Fallback: Look through all <p> elements manually
  const emptyParagraphs = Array.from(document.querySelectorAll('p')).filter(
    (el) => el.textContent.trim() === ''
  );

  expect(emptyParagraphs.length).toBeGreaterThan(0); // Expect at least one blank <p>
});

});