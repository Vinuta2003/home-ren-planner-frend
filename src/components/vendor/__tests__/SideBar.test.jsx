import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBar from '../SideBar';
import { BrowserRouter } from 'react-router-dom';

describe('Vendor SideBar', () => {
  const mockSetActiveTab = jest.fn();
  const mockHandleLogout = jest.fn();

  const renderWithRouter = (ui) =>
    render(<BrowserRouter>{ui}</BrowserRouter>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo, brand, and dashboard title', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    expect(screen.getByAltText('Vendor Logo')).toBeInTheDocument();
    expect(screen.getByText('RenoBase')).toBeInTheDocument();
    expect(screen.getByText('Vendor Dashboard')).toBeInTheDocument();
  });

  it('renders Assigned Phases and Update Profile tabs', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    expect(screen.getByText('Assigned Phases')).toBeInTheDocument();
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
  });

  it('calls setActiveTab with assignedPhases when Assigned Phases is clicked', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    fireEvent.click(screen.getByText('Assigned Phases'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('assignedPhases');
  });

  it('calls setActiveTab with updateProfile when Update Profile is clicked', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    fireEvent.click(screen.getByText('Update Profile'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('updateProfile');
  });

  it('calls handleLogout when logout button is clicked', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it('has correct classes for layout and styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} handleLogout={mockHandleLogout} />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('w-64', 'h-screen', 'bg-gradient-to-b', 'border-r', 'shadow-xl', 'rounded-r-2xl', 'flex', 'flex-col', 'justify-between', 'px-4', 'py-8');
  });
}); 