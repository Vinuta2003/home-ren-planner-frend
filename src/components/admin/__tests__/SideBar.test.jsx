import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBar from '../SideBar';
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
  useDispatch: () => jest.fn(),
}));

describe('SideBar', () => {
  test('renders all tabs and highlights active tab', () => {
    const setActiveTab = jest.fn();
    render(<SideBar setActiveTab={setActiveTab} activeTab="vendor" />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('Vendor').closest('button')).toHaveClass('bg-blue-600');
  });

  test('calls setActiveTab when a tab is clicked', () => {
    const setActiveTab = jest.fn();
    render(<SideBar setActiveTab={setActiveTab} activeTab="customer" />);
    fireEvent.click(screen.getByText('Material'));
    expect(setActiveTab).toHaveBeenCalledWith('material');
  });

  test('renders logout button', () => {
    const setActiveTab = jest.fn();
    render(<SideBar setActiveTab={setActiveTab} activeTab="customer" />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
}); 