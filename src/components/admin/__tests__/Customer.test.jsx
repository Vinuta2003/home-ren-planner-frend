import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Customer from '../Customer';
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

describe('Customer component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', async () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); 
    render(<Customer />);
    expect(screen.getByText(/customer list/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders customer list', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Alice', email: 'alice@example.com', contact: '1234567890', pic: '' },
          { exposedId: '2', name: 'Bob', email: 'bob@example.com', contact: '0987654321', pic: '' },
        ],
        totalPages: 1,
      },
    });
    render(<Customer />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Customer />);
    expect(await screen.findByText(/failed to fetch customers/i)).toBeInTheDocument();
  });

  test('shows delete modal and deletes customer', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Alice', email: 'alice@example.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Customer />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/users/1');
      expect(toast.success).toHaveBeenCalledWith('Customer Deleted Successfully');
    });
  });

  test('shows error toast on failed delete', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Alice', email: 'alice@example.com', contact: '1234567890', pic: '' },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockRejectedValueOnce(new Error('Delete failed'));
    render(<Customer />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/users/1');
      expect(toast.error).toHaveBeenCalledWith('Failed to delete customer');
    });
  });
}); 