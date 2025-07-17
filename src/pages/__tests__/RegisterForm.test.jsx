import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../redux/store';
import RegisterForm from '../RegisterForm';
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

describe('RegisterForm', () => {
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

  test('renders the register form', () => {
    renderWithProviders(<RegisterForm />);
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contact/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('submits customer registration form successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        email: 'customer@example.com',
        role: 'CUSTOMER',
        accessToken: 'token',
        url: 'url',
        message: 'SUCCESS',
      },
    });
    renderWithProviders(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText(/^name$/i), { target: { value: 'Customer', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'customer@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/contact/i), { target: { value: '1234567890', name: 'contact' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Registration Successful',
        expect.objectContaining({ onClose: expect.any(Function), autoClose: 2500 })
      );
    });
  });

  test('submits vendor registration form with skills', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        email: 'vendor@example.com',
        role: 'VENDOR',
        accessToken: 'token',
        url: 'url',
        message: 'SUCCESS',
      },
    });
    renderWithProviders(<RegisterForm />);
    // Switch to vendor
    fireEvent.click(screen.getByRole('button', { name: /register as vendor/i }));
    fireEvent.change(screen.getByPlaceholderText(/^name$/i), { target: { value: 'Vendor', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'vendor@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/contact/i), { target: { value: '1234567890', name: 'contact' } });
    fireEvent.change(screen.getByPlaceholderText(/company name/i), { target: { value: 'VendorCo', name: 'companyName' } });
    fireEvent.change(screen.getByPlaceholderText(/experience in years/i), { target: { value: '5', name: 'experience' } });
    // Add a skill
    fireEvent.click(screen.getByText('+ Add Skill'));
    // Select the first skill dropdown (should be empty by default)
    const skillSelects = screen.getAllByRole('combobox');
    fireEvent.change(skillSelects[0], { target: { value: 'PLUMBING' } });
    fireEvent.change(screen.getByPlaceholderText(/base price/i), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Registration Successful',
        expect.objectContaining({ onClose: expect.any(Function), autoClose: 2500 })
      );
    });
  });

  test('shows error when vendor registration is missing skills', async () => {
    renderWithProviders(<RegisterForm />);
    // Switch to vendor
    fireEvent.click(screen.getByRole('button', { name: /register as vendor/i }));
    fireEvent.change(screen.getByPlaceholderText(/^name$/i), { target: { value: 'Vendor', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'vendor@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/contact/i), { target: { value: '1234567890', name: 'contact' } });
    fireEvent.change(screen.getByPlaceholderText(/company name/i), { target: { value: 'VendorCo', name: 'companyName' } });
    fireEvent.change(screen.getByPlaceholderText(/experience in years/i), { target: { value: '5', name: 'experience' } });
    // Submit without adding skills
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/please add at least one skill/i)).toBeInTheDocument();
  });

  test('shows error toast on failed registration', async () => {
    axiosInstance.post.mockRejectedValueOnce({ response: { data: { message: 'Registration failed' } } });
    renderWithProviders(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText(/^name$/i), { target: { value: 'Fail', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '12345678', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/contact/i), { target: { value: '1234567890', name: 'contact' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });

  test('can switch between customer and vendor registration', () => {
    renderWithProviders(<RegisterForm />);
    
    // Check customer registration fields (default)
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contact/i)).toBeInTheDocument();
    
    // Vendor fields should not be visible initially
    expect(screen.queryByPlaceholderText(/company name/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/experience in years/i)).not.toBeInTheDocument();
    
    // Switch to vendor and check additional fields
    fireEvent.click(screen.getByRole('button', { name: /register as vendor/i }));
    expect(screen.getByPlaceholderText(/company name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/experience in years/i)).toBeInTheDocument();
    expect(screen.getByText(/available/i)).toBeInTheDocument();
    expect(screen.getByText(/skills & base prices/i)).toBeInTheDocument();
    
    // Switch back to customer
    fireEvent.click(screen.getByRole('button', { name: /register as customer/i }));
    expect(screen.queryByPlaceholderText(/company name/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/experience in years/i)).not.toBeInTheDocument();
  });

  test('can add and remove skills for vendor registration', () => {
    renderWithProviders(<RegisterForm />);
    
    // Switch to vendor
    fireEvent.click(screen.getByRole('button', { name: /register as vendor/i }));
    
    // Add a skill
    fireEvent.click(screen.getByText('+ Add Skill'));
    expect(screen.getByText('-- Select Skill --')).toBeInTheDocument();
    
    // Add another skill
    fireEvent.click(screen.getByText('+ Add Skill'));
    const skillSelects = screen.getAllByRole('combobox');
    expect(skillSelects).toHaveLength(2);
  });
}); 