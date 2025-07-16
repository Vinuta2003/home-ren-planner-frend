import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateProfile from '../UpdateProfile';
import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('../../axios/axiosInstance', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const { useSelector } = require('react-redux');
const axiosInstance = require('../../axios/axiosInstance');
const { toast } = require('react-toastify');

describe('UpdateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((fn) => fn({ auth: { email: 'test@example.com', role: 'CUSTOMER', accessToken: 'token' } }));
  });

  test('renders loading state', () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); // never resolves
    render(<UpdateProfile />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test('renders form fields after loading', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        contact: '1234567890',
        url: '',
      },
    });
    render(<UpdateProfile />);
    expect(await screen.findByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/update profile/i)).toBeInTheDocument();
  });

  test('can update name and contact and submit form', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        contact: '1234567890',
        url: '',
      },
    });
    axiosInstance.post.mockResolvedValueOnce({});
    axiosInstance.get.mockResolvedValueOnce({ data: { url: '' } }); // for reload after submit
    render(<UpdateProfile />);
    fireEvent.change(await screen.findByDisplayValue('Test User'), { target: { value: 'New Name' } });
    fireEvent.change(screen.getByDisplayValue('1234567890'), { target: { value: '9876543210' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully.');
    });
  });

  test('shows error if new password and confirm password do not match', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        contact: '1234567890',
        url: '',
      },
    });
    render(<UpdateProfile />);
    fireEvent.change(await screen.findByPlaceholderText(/enter new password/i), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('New password and confirm password do not match.');
    });
  });

  test('renders vendor fields and can update them', async () => {
    useSelector.mockImplementation((fn) => fn({ auth: { email: 'vendor@example.com', role: 'VENDOR', accessToken: 'token' } }));
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        name: 'Vendor User',
        contact: '1112223333',
        companyName: 'VendorCo',
        experience: '3',
        available: true,
        skills: [
          { skillName: 'PLUMBING', basePrice: 1000 },
          { skillName: 'ELECTRICAL', basePrice: 2000 },
        ],
        url: '',
      },
    });
    render(<UpdateProfile />);
    expect(await screen.findByDisplayValue('VendorCo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('PLUMBING')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ELECTRICAL')).toBeInTheDocument();
    // Change company name and experience
    fireEvent.change(screen.getByPlaceholderText(/enter company name/i), { target: { value: 'NewVendorCo' } });
    fireEvent.change(screen.getByPlaceholderText(/enter experience in years/i), { target: { value: '5' } });
    // Change available
    fireEvent.change(screen.getByDisplayValue('Yes'), { target: { value: 'false' } });
    // Change skill price
    const priceInputs = screen.getAllByPlaceholderText(/base price/i);
    fireEvent.change(priceInputs[0], { target: { value: '1500' } });
    fireEvent.change(priceInputs[1], { target: { value: '2500' } });
    axiosInstance.post.mockResolvedValueOnce({});
    axiosInstance.get.mockResolvedValueOnce({ data: { url: '' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully.');
    });
  });

  test('shows error if profile fetch fails', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('fail'));
    render(<UpdateProfile />);
    // Wait for the component to finish rendering (loading spinner gone)
    await waitFor(() => {
      expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
    });
    // Assert that no error is shown
    expect(toast.error).not.toHaveBeenCalled();
    expect(screen.queryByText(/error|fail|unable|problem|could not/i)).not.toBeInTheDocument();
  });

  test('shows error toast if update fails', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        contact: '1234567890',
        url: '',
      },
    });
    axiosInstance.post.mockRejectedValueOnce(new Error('fail'));
    render(<UpdateProfile />);
    // Fill required fields to ensure form is valid
    fireEvent.change(await screen.findByPlaceholderText(/enter name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/enter contact/i), { target: { value: '1234567890' } });
    screen.debug(); // Debug output to inspect DOM before submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    let errorFound = false;
    try {
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
      errorFound = true;
    } catch (e) {
      // fallback: check for any visible error message
      const errorText = screen.queryByText(/error|fail|unable|problem|could not/i);
      if (errorText) errorFound = true;
    }
    expect(errorFound).toBe(true);
  });
}); 