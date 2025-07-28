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
  const mockOnAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAction.mockClear();
  });

  test('renders loading state', async () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); 
    render(<Material onAction={mockOnAction} />);
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
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    expect(screen.getByText('PVC Pipe')).toBeInTheDocument();
    expect(screen.getAllByText('Electrical').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
  });

  test('renders error state', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText(/error occurred while fetching materials/i)).toBeInTheDocument();
  });

  test('can open and submit add material form', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material onAction={mockOnAction} />);
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
      expect(mockOnAction).toHaveBeenCalled();
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
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Material Deleted Successfully');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('can edit material', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.put.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/edit/i));
    expect(screen.getByDisplayValue('Copper Wire')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    const nameInput = screen.getByDisplayValue('Copper Wire');
    fireEvent.change(nameInput, { target: { value: 'Updated Wire' } });
    fireEvent.click(screen.getByRole('button', { name: /update material/i }));
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/admin/materials/1', {
        name: 'Updated Wire',
        unit: 'KG',
        phaseType: 'ELECTRICAL',
        pricePerQuantity: 100,
      });
      expect(toast.success).toHaveBeenCalledWith('Material Updated Successfully');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('can restore deleted material', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Deleted Material', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: true },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.patch.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Deleted Material')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/restore/i));
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith('/admin/materials/re-add/1');
      expect(toast.success).toHaveBeenCalledWith('Material Restored Successfully');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('can permanently remove material', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Deleted Material', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: true },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockResolvedValueOnce({ data: { message: 'SUCCESS' } });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Deleted Material')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/remove/i));
    expect(screen.getByText(/are you sure you want to remove this material permanently/i)).toBeInTheDocument();
    const removeButtons = screen.getAllByRole('button', { name: /^remove$/i });
    fireEvent.click(removeButtons[removeButtons.length - 1]);
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/materials/hard/1');
      expect(toast.success).toHaveBeenCalledWith('Material removed permanently.');
      expect(mockOnAction).toHaveBeenCalled();
    });
  });

  test('handles form submission error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    axiosInstance.post.mockRejectedValueOnce(new Error('Server error'));
    render(<Material onAction={mockOnAction} />);
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
      expect(toast.error).toHaveBeenCalledWith('Error Occured in Server');
    });
  });

  test('handles server error response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    axiosInstance.post.mockResolvedValueOnce({ data: { message: 'FAILED' } });
    render(<Material onAction={mockOnAction} />);
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
      expect(toast.error).toHaveBeenCalledWith('Operation Failed');
    });
  });

  test('can change page size', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    const pageSizeSelect = screen.getByDisplayValue('10');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('size=20'));
    });
  });

  test('can filter by phase type', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    const electricalButtons = screen.getAllByText('Electrical');
    const filterButton = electricalButtons.find(button => button.tagName === 'BUTTON');
    fireEvent.click(filterButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('phaseType=ELECTRICAL'));
    });
  });

  test('can navigate pagination', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 2,
      },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    const nextButton = screen.getByText('Next >>');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
  });

  test('can cancel form', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    render(<Material onAction={mockOnAction} />);
    fireEvent.click(screen.getByText(/add material/i));
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
  });

  test('can cancel delete modal', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/are you sure you want to delete/i)).not.toBeInTheDocument();
  });

  test('can cancel remove modal', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Deleted Material', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: true },
        ],
        totalPages: 1,
      },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Deleted Material')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/remove/i));
    expect(screen.getByText(/are you sure you want to remove this material permanently/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(screen.queryByText(/are you sure you want to remove this material permanently/i)).not.toBeInTheDocument();
  });

  test('shows no materials message when empty', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { content: [], totalPages: 1 },
    });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText(/no materials found/i)).toBeInTheDocument();
  });

  test('handles permanent remove error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Deleted Material', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: true },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockRejectedValueOnce(new Error('Server error'));
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Deleted Material')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/remove/i));
    const removeButtons = screen.getAllByRole('button', { name: /^remove$/i });
    fireEvent.click(removeButtons[removeButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error occurred while removing permanently.');
    });
  });

  test('handles permanent remove server error response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Deleted Material', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: true },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.delete.mockResolvedValueOnce({ data: { message: 'FAILED' } });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Deleted Material')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/remove/i));
    const removeButtons = screen.getAllByRole('button', { name: /^remove$/i });
    fireEvent.click(removeButtons[removeButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to remove material permanently.');
    });
  });

  test('handles delete/restore server error response', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.patch.mockResolvedValueOnce({ data: { message: 'FAILED' } });
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Operation Failed');
    });
  });

  test('handles delete/restore server error', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        content: [
          { exposedId: '1', name: 'Copper Wire', unit: 'KG', phaseType: 'ELECTRICAL', pricePerQuantity: 100, deleted: false },
        ],
        totalPages: 1,
      },
    });
    axiosInstance.patch.mockRejectedValueOnce(new Error('Server error'));
    render(<Material onAction={mockOnAction} />);
    expect(await screen.findByText('Copper Wire')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/delete/i));
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error Occurred in Server');
    });
  });
}); 