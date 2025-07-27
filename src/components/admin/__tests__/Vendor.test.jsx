import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Vendor from '../Vendor';
import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

jest.mock('../../../axios/axiosInstance', () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const axiosInstance = require('../../../axios/axiosInstance');
const { toast } = require('react-toastify');

describe('Vendor component', () => {
  const mockOnAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAction.mockClear();
  });

  test('renders loading state', async () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); 
    render(<Vendor onAction={mockOnAction} />);
    expect(screen.getByText(/vendor list/i)).toBeInTheDocument();
    expect(screen.getByText(/vendors per page/i)).toBeInTheDocument();
  });

  test('renders approved vendor list', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    expect(screen.getByText('Approved Vendors')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText(/failed to fetch approved vendors/i)).toBeInTheDocument();
  });

  test('shows delete modal and deletes vendor', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/vendor/1');
      expect(toast.success).toHaveBeenCalledWith('Vendor Deleted Successfully');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('can switch to approval requests tab', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
  });

  test('can approve vendor', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.put.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const approveButtons = screen.getAllByText(/approve/i);
    const actionButton = approveButtons.find(button => button.closest('button') && button.closest('button').className.includes('bg-green-600'));
    fireEvent.click(actionButton);
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/admin/vendor/2/approve', null, { params: { approved: true } });
      expect(toast.success).toHaveBeenCalledWith('Vendor Approval Request Accepted');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('can reject vendor', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.put.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const rejectButtons = screen.getAllByText(/reject/i);
    const actionButton = rejectButtons.find(button => button.closest('button') && button.closest('button').className.includes('bg-yellow-500'));
    fireEvent.click(actionButton);
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/admin/vendor/2/approve', null, { params: { approved: false } });
      expect(toast.success).toHaveBeenCalledWith('Vendor Approval Request Rejected');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('handles approval error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.put.mockRejectedValueOnce(new Error('Server error'));
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const approveButtons = screen.getAllByText(/approve/i);
    const actionButton = approveButtons.find(button => button.closest('button') && button.closest('button').className.includes('bg-green-600'));
    fireEvent.click(actionButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update vendor approval');
    });
  });

  test('handles delete error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockRejectedValueOnce(new Error('Server error'));
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete vendor');
    });
  });

  test('can change page size', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    const pageSizeSelect = screen.getByDisplayValue('10');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('size=20'));
    });
  });

  test('can navigate pagination for approved vendors', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 2,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    const nextButton = screen.getByText('Next >>');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
  });

  test('can navigate pagination for pending vendors', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 2,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const nextButton = screen.getByText('Next >>');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
  });

  test('can cancel delete modal', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/are you sure you want to delete/i)).not.toBeInTheDocument();
  });

  test('shows no approved vendors message when empty', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText(/no approved vendors found/i)).toBeInTheDocument();
  });

  test('shows no approval requests message when empty', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText(/no approval requests found/i)).toBeInTheDocument();
  });

  test('shows vendor count in tabs', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
          { exposedId: '2', name: 'Vendor B', email: 'b@vendor.com', contact: '0987654321', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '3', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('2')).toBeInTheDocument(); // Approved vendors count
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('1')).toBeInTheDocument(); // Pending vendors count
  });

  test('handles fetch approved vendors error', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText(/failed to fetch approved vendors/i)).toBeInTheDocument();
  });

  test('handles fetch pending vendors error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText(/failed to fetch pending vendors/i)).toBeInTheDocument();
  });

  test('handles delete server error response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockRejectedValueOnce(new Error('Server error'));
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete vendor');
    });
  });

  test('handles approval server error response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.put.mockRejectedValueOnce(new Error('Server error'));
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const approveButtons = screen.getAllByText(/approve/i);
    const actionButton = approveButtons.find(button => button.closest('button') && button.closest('button').className.includes('bg-green-600'));
    fireEvent.click(actionButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update vendor approval');
    });
  });

  test('resets page when changing page size', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 2,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    const nextButton = screen.getByText('Next >>');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
    const pageSizeSelect = screen.getByDisplayValue('10');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=0'));
    });
  });

  test('resets page when switching tabs', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 2,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 2,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    const nextButton = screen.getByText('Next >>');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
    fireEvent.click(screen.getByText('Approval Requests'));
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=0'));
    });
  });

  test('disables pagination buttons when appropriate', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    const prevButton = screen.getByText('<< Prev');
    const nextButton = screen.getByText('Next >>');
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test('renders vendor cards with correct information', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { 
            exposedId: '1', 
            name: 'Vendor A', 
            email: 'a@vendor.com', 
            contact: '1234567890', 
            pic: 'profile.jpg' 
          },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    expect(screen.getByText('a@vendor.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  test('renders pending vendor cards with approval buttons', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '2', name: 'Pending Vendor', email: 'pending@vendor.com', contact: '9876543210', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Approval Requests'));
    expect(await screen.findByText('Pending Vendor')).toBeInTheDocument();
    const approveButtons = screen.getAllByText(/approve/i);
    const rejectButtons = screen.getAllByText(/reject/i);
    expect(approveButtons.length).toBeGreaterThan(0);
    expect(rejectButtons.length).toBeGreaterThan(0);
  });

  test('renders approved vendor cards with delete button', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Vendor A', email: 'a@vendor.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Vendor onAction={mockOnAction} />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });
}); 