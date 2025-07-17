import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Material from '../Material';
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
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
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

describe('Material component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', async () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); 
    render(<Material />);
    expect(screen.getByText(/materials list/i)).toBeInTheDocument();
    expect(screen.getByText(/add material/i)).toBeInTheDocument();
    expect(screen.getByText(/rows per page/i)).toBeInTheDocument();
  });

  test('renders material list', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
          { exposedId: '2', name: 'PVC Pipe', unit: 'UNITS', phaseType: 'PLUMBING', pricePerQuantity: 50, deleted: false },
        ],
        totalPages: 1,
      },
    });
    render(<Material />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    expect(screen.getByText('PVC Pipe')).toBeInTheDocument();
    expect(screen.getAllByText('Electrical').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
  });

  test('renders error state', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Material />);
    expect(await screen.findByText(/error occurred while fetching materials/i)).toBeInTheDocument();
  });

  test('can open and submit add material form', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material />);
    fireEvent.click(screen.getByText(/add material/i));
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'New Material', name: 'name' } }); 
    const priceInput = screen.getByRole('spinbutton');
    fireEvent.change(priceInput, { target: { value: 200, name: 'pricePerQuantity' } }); 
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'KG', name: 'unit' } });
    fireEvent.change(selects[1], { target: { value: 'ELECTRICAL', name: 'phaseType' } });
    fireEvent.click(screen.getByRole('button', { name: /add material/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/materials', {
        name: 'New Material',
        unit: 'KG',
        phaseType: 'ELECTRICAL',
        pricePerQuantity: "200",
      });
      expect(toast.success).toHaveBeenCalledWith('Material Added Successfully');
    });
  });

  test('shows delete modal and deletes material', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.patch.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Material Deleted Successfully');
    });
  });
}); 