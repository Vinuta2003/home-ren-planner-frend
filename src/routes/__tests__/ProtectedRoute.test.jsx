import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axios/axiosInstance';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));
jest.mock('jwt-decode');
jest.mock('../../axios/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(({ to }) => <div>Navigate to {to}</div>),
}));
jest.mock('../../pages/Unauthorized', () => () => <div>Unauthorized Page</div>);

describe('ProtectedRoute', () => {
  let dispatch;
  const DummyChild = () => <div>Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  it('redirects to /login if no accessToken', async () => {
    useSelector.mockReturnValue({ accessToken: null });
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    expect(await screen.findByText('Navigate to /login')).toBeInTheDocument();
  });

  it('renders children if authenticated and authorized', async () => {
    useSelector.mockReturnValue({ accessToken: 'token', role: 'ADMIN' });
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 1000 });
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('renders Unauthorized if authenticated but not authorized', async () => {
    useSelector.mockReturnValue({ accessToken: 'token', role: 'USER' });
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 1000 });
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    });
  });

  it('refreshes token if expired and renders children on success', async () => {
    useSelector.mockReturnValue({ accessToken: 'expiredtoken', role: 'ADMIN' });
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 100 });
    axiosInstance.post.mockResolvedValueOnce({ data: { accessToken: 'newtoken' } });
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'auth/updateAccessToken', payload: { newAccessToken: 'newtoken' } });
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('refreshes token if expired and redirects to /login on failure', async () => {
    useSelector.mockReturnValue({ accessToken: 'expiredtoken', role: 'ADMIN' });
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 100 });
    axiosInstance.post.mockRejectedValueOnce(new Error('refresh failed'));
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
      expect(screen.getByText('Navigate to /login')).toBeInTheDocument();
    });
  });

  it('redirects to /login if token is invalid', async () => {
    useSelector.mockReturnValue({ accessToken: 'badtoken', role: 'ADMIN' });
    jwtDecode.mockImplementation(() => { throw new Error('invalid'); });
    render(
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DummyChild />
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
      expect(screen.getByText('Navigate to /login')).toBeInTheDocument();
    });
  });
}); 