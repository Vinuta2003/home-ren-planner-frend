import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VendorCard from '../VendorCard';
import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('VendorCard', () => {
  const baseVendor = {
    exposedId: '1',
    companyName: 'Vendor Co',
    name: 'Alice',
    email: 'alice@vendor.com',
    contact: '1234567890',
    experience: 5,
    available: true,
    skills: ['PLUMBING - ₹1000', 'ELECTRICAL - ₹2000'],
    pic: '',
  };

  test('renders vendor info and skills', () => {
    render(<VendorCard vendor={baseVendor} />);
    expect(screen.getByText('Vendor Co')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@vendor.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('PLUMBING')).toBeInTheDocument();
    expect(screen.getByText('₹1000')).toBeInTheDocument();
    expect(screen.getByText('ELECTRICAL')).toBeInTheDocument();
    expect(screen.getByText('₹2000')).toBeInTheDocument();
  });

  test('renders unavailable vendor', () => {
    render(<VendorCard vendor={{ ...baseVendor, available: false }} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  test('renders no skills message', () => {
    render(<VendorCard vendor={{ ...baseVendor, skills: [] }} />);
    expect(screen.getByText('No Skills Found')).toBeInTheDocument();
  });

  test('calls onApprove and onReject when buttons are clicked', () => {
    const onApprove = jest.fn();
    const onReject = jest.fn();
    render(<VendorCard vendor={baseVendor} onApprove={onApprove} onReject={onReject} />);
    fireEvent.click(screen.getByText(/approve/i));
    expect(onApprove).toHaveBeenCalledWith('1');
    fireEvent.click(screen.getByText(/reject/i));
    expect(onReject).toHaveBeenCalledWith('1');
  });

  test('calls onRemove when delete button is clicked', () => {
    const onRemove = jest.fn();
    render(<VendorCard vendor={baseVendor} onRemove={onRemove} />);
    fireEvent.click(screen.getByText(/delete/i));
    expect(onRemove).toHaveBeenCalledWith('1');
  });
}); 