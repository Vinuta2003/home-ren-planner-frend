import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';
import axiosInstance from '../../axios/axiosInstance';

jest.mock('../../axios/axiosInstance');
// Enhanced sidebar mock to allow switching back to dashboard
jest.mock('../../components/admin/SideBar', () => ({ setActiveTab, activeTab }) => (
  <div data-testid="sidebar-mock">
    Sidebar - {activeTab}
    <button onClick={() => setActiveTab && setActiveTab('dashboard')}>Go Dashboard</button>
    <button onClick={() => setActiveTab && setActiveTab('customer')}>Go Customer</button>
  </div>
));
jest.mock('../../components/admin/Customer', () => ({ onAction }) => (
  <div data-testid="customer-mock" onClick={onAction}>Customer</div>
));
jest.mock('../../components/admin/Vendor', () => ({ onAction }) => (
  <div data-testid="vendor-mock" onClick={onAction}>Vendor</div>
));
jest.mock('../../components/admin/Material', () => ({ onAction }) => (
  <div data-testid="material-mock" onClick={onAction}>Material</div>
));

describe('AdminDashboard', () => {
  const statsApiResponse = {
    customers: { data: { totalElements: 5 } },
    vendors: { data: { totalElements: 3 } },
    materials: { data: { content: [ { deleted: false }, { deleted: true }, { deleted: false } ] } },
    pendingVendors: { data: { totalElements: 2 } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance.get.mockImplementation((url) => {
      if (url.startsWith('/admin/users')) return Promise.resolve(statsApiResponse.customers);
      if (url.startsWith('/admin/vendors/approved')) return Promise.resolve(statsApiResponse.vendors);
      if (url.startsWith('/admin/materials')) return Promise.resolve(statsApiResponse.materials);
      if (url.startsWith('/admin/vendors/pending')) return Promise.resolve(statsApiResponse.pendingVendors);
      return Promise.resolve({ data: {} });
    });
  });

  it('renders dashboard overview and stats', async () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    // Loading state
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
    // Wait for stats
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // customers
      expect(screen.getByText('3')).toBeInTheDocument(); // vendors
      // Check both '2's are present (pending vendors and materials)
      const allTwos = screen.getAllByText('2');
      expect(allTwos.length).toBeGreaterThanOrEqual(2);
      // Optionally, check by parent label for more specificity
      expect(screen.getByText('Pending Approvals').parentElement.querySelector('p.text-3xl.font-bold.text-orange-600')).toHaveTextContent('2');
      expect(screen.getByText('Total Materials').parentElement.querySelector('p.text-3xl.font-bold.text-blue-900')).toHaveTextContent('2');
    });
    // Sidebar present
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
  });

  it('switches to customer tab via sidebar', async () => {
    render(<AdminDashboard />);
    // Simulate sidebar tab switch
    fireEvent.click(screen.getByText('Go Customer'));
    await waitFor(() => {
      expect(screen.getByTestId('customer-mock')).toBeInTheDocument();
    });
  });

  it('switches to vendor tab via quick action', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText('Manage Vendors'));
    await waitFor(() => {
      expect(screen.getByTestId('vendor-mock')).toBeInTheDocument();
    });
  });

  it('switches to material tab via quick action', async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText('Manage Materials'));
    await waitFor(() => {
      expect(screen.getByTestId('material-mock')).toBeInTheDocument();
    });
  });

  it('refreshes stats when onAction is called from child', async () => {
    render(<AdminDashboard />);
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Manage Customers'));
    const customer = await screen.findByTestId('customer-mock');
    fireEvent.click(customer); // triggers onAction (refreshStats)
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(8)); // 4 initial + 4 refresh
  });

  it('handles API error gracefully', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('API error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching stats'),
        expect.any(Error)
      );
    });
    errorSpy.mockRestore();
  });

  it('switches tabs using setActiveTab directly (extra coverage)', async () => {
    render(<AdminDashboard />);
    // Sidebar mock triggers setActiveTab('customer') on click
    fireEvent.click(screen.getByText('Go Customer'));
    await waitFor(() => {
      expect(screen.getByTestId('customer-mock')).toBeInTheDocument();
    });
    // Switch back to dashboard
    fireEvent.click(screen.getByText('Go Dashboard'));
    await waitFor(() => {
      expect(screen.getByText('Manage Vendors')).toBeInTheDocument();
    });
    // Switch to vendor
    fireEvent.click(screen.getByText('Manage Vendors'));
    await waitFor(() => {
      expect(screen.getByTestId('vendor-mock')).toBeInTheDocument();
    });
    // Switch back to dashboard
    fireEvent.click(screen.getByText('Go Dashboard'));
    await waitFor(() => {
      expect(screen.getByText('Manage Materials')).toBeInTheDocument();
    });
    // Switch to material
    fireEvent.click(screen.getByText('Manage Materials'));
    await waitFor(() => {
      expect(screen.getByTestId('material-mock')).toBeInTheDocument();
    });
  });
}); 