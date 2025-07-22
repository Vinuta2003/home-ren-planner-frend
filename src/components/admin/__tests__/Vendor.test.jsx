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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', async () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); 
    render(<Vendor />);
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
    render(<Vendor />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    expect(screen.getByText('Approved Vendors')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Vendor />);
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
    render(<Vendor />);
    expect(await screen.findByText('Vendor A')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/vendor/1');
      expect(toast.success).toHaveBeenCalledWith('Vendor Deleted Successfully');
    });
  });
}); 