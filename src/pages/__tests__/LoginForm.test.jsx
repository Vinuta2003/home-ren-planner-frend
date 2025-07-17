import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../redux/store';
import LoginForm from '../LoginForm';
import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});


// Mock axiosInstance and toast
jest.mock('../../axios/axiosInstance', () => ({
  post: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    message: jest.fn(),
  },
}));

const axiosInstance = require('../../axios/axiosInstance');
const { toast } = require('react-toastify');

describe('LoginForm', () => {
  function renderWithProviders(ui) {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login form', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  test('submits customer login form successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        email: 'customer@example.com',
        role: 'CUSTOMER',
        accessToken: 'token',
        url: 'url',
        message: 'SUCCESS',
      },
    });
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'customer@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'customer@example.com', password: '12345678' });
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful! Welcome back!',
        expect.objectContaining({ onClose: expect.any(Function), autoClose: 2500 })
      );
    });
  });

  test('submits admin login form successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        email: 'admin@example.com',
        role: 'ADMIN',
        accessToken: 'token',
        url: 'url',
        message: 'SUCCESS',
      },
    });
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'admin@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'admin@example.com', password: '12345678' });
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful! Welcome back!',
        expect.objectContaining({ onClose: expect.any(Function), autoClose: 2500 })
      );
    });
  });

  test('submits vendor login form successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        email: 'vendor@example.com',
        role: 'VENDOR',
        accessToken: 'token',
        url: 'url',
        message: 'SUCCESS',
      },
    });
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'vendor@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'vendor@example.com', password: '12345678' });
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful! Welcome back!',
        expect.objectContaining({ onClose: expect.any(Function), autoClose: 2500 })
      );
    });
  });

  test('shows error toast on failed login', async () => {
    axiosInstance.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'fail@example.com', password: '12345678' });
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });


}); 