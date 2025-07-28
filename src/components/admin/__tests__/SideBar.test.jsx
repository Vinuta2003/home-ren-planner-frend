import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SideBar', () => {
  const mockSetActiveTab = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tabs and highlights active tab', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="vendor" />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('Vendor').closest('button')).toHaveClass('bg-blue-600');
  });

  test('calls setActiveTab when a tab is clicked', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    fireEvent.click(screen.getByText('Material'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('material');
  });

  test('renders logout button', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders logo and brand name', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    expect(screen.getByText('RenoBase')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders admin dashboard title', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  test('highlights dashboard tab when active', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    expect(screen.getByText('Dashboard').closest('button')).toHaveClass('bg-blue-600');
  });

  test('highlights customer tab when active', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    expect(screen.getByText('Customer').closest('button')).toHaveClass('bg-blue-600');
  });

  test('highlights material tab when active', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="material" />);
    expect(screen.getByText('Material').closest('button')).toHaveClass('bg-blue-600');
  });

  test('calls setActiveTab for dashboard tab', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('dashboard');
  });

  test('calls setActiveTab for customer tab', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="material" />);
    fireEvent.click(screen.getByText('Customer'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('customer');
  });

  test('calls setActiveTab for vendor tab', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="material" />);
    fireEvent.click(screen.getByText('Vendor'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('vendor');
  });

  test('calls setActiveTab for material tab', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="customer" />);
    fireEvent.click(screen.getByText('Material'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('material');
  });

  test('renders all navigation tabs', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('Material')).toBeInTheDocument();
  });

  test('renders logout button with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const logoutButton = screen.getByText('Logout').closest('button');
    expect(logoutButton).toHaveClass('bg-red-600');
    expect(logoutButton).toHaveClass('hover:bg-red-700');
  });

  test('renders logo with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toHaveClass('h-14', 'w-14', 'rounded-full');
  });

  test('renders brand name with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const brandName = screen.getByText('RenoBase');
    expect(brandName).toHaveClass('text-2xl', 'font-bold');
  });

  test('renders admin dashboard title with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const title = screen.getByText('Admin Dashboard');
    expect(title).toHaveClass('font-bold', 'text-xl');
  });

  test('renders sidebar with correct layout classes', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const sidebar = screen.getByText('Admin Dashboard').closest('div').parentElement;
    expect(sidebar).toHaveClass('h-screen', 'w-64', 'bg-blue-100');
  });

  test('renders navigation with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const nav = screen.getByText('Dashboard').closest('nav');
    expect(nav).toHaveClass('flex-1', 'p-4', 'space-y-2');
  });

  test('renders footer with logout button', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const footer = screen.getByText('Logout').closest('div');
    expect(footer).toHaveClass('p-4', 'border-t', 'border-blue-200');
  });

  test('renders header with logo and brand', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const header = screen.getByText('RenoBase').closest('a');
    expect(header).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-6', 'gap-2', 'cursor-pointer', 'select-none', 'border-b', 'border-blue-200');
  });

  test('renders title section with correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const titleSection = screen.getByText('Admin Dashboard').closest('div');
    expect(titleSection).toHaveClass('font-bold', 'text-xl', 'text-center', 'py-4');
  });

  test('all tabs are clickable', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const tabs = ['Dashboard', 'Customer', 'Vendor', 'Material'];
    tabs.forEach(tab => {
      const tabElement = screen.getByText(tab);
      expect(tabElement.closest('button')).toHaveClass('cursor-pointer');
    });
  });

  test('non-active tabs have hover styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const customerTab = screen.getByText('Customer').closest('button');
    expect(customerTab).toHaveClass('hover:bg-blue-200');
  });

  test('active tab has correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const dashboardTab = screen.getByText('Dashboard').closest('button');
    expect(dashboardTab).toHaveClass('bg-blue-600', 'text-white');
  });

  test('logo link has correct styling', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const logoLink = screen.getByText('RenoBase').closest('a');
    expect(logoLink).toHaveClass('cursor-pointer', 'select-none');
  });

  test('renders all tab icons', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    // Check that all tabs have icons by looking for the gap class that indicates icon presence
    const tabButtons = screen.getAllByRole('button');
    tabButtons.forEach(button => {
      if (button.textContent !== 'Logout') {
        expect(button).toHaveClass('flex', 'items-center', 'gap-3');
      }
    });
  });

  test('logout button has icon', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const logoutButton = screen.getByText('Logout').closest('button');
    expect(logoutButton).toHaveClass('flex', 'items-center', 'gap-3');
  });

  test('sidebar has correct z-index', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const sidebar = screen.getByText('Admin Dashboard').closest('div').parentElement;
    expect(sidebar).toHaveClass('z-20');
  });

  test('sidebar is fixed positioned', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const sidebar = screen.getByText('Admin Dashboard').closest('div').parentElement;
    expect(sidebar).toHaveClass('fixed', 'top-0', 'left-0');
  });

  test('sidebar has shadow', () => {
    renderWithRouter(<SideBar setActiveTab={mockSetActiveTab} activeTab="dashboard" />);
    const sidebar = screen.getByText('Admin Dashboard').closest('div').parentElement;
    expect(sidebar).toHaveClass('shadow-md');
  });
}); 