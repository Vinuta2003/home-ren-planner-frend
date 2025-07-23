import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewModal from '../../components/ReviewModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '@testing-library/jest-dom';

// ✅ Mocks
jest.mock('axios');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockStore = configureStore([]);

describe('ReviewModal Component', () => {
  const vendor = {
    exposedId: 'vendor-123',
    name: 'Test Vendor',
  };

  const mockOnReviewSubmit = jest.fn();

  const initialState = {
    auth: {
      accessToken: 'fake.jwt.token',
    },
  };

  beforeEach(() => {
    jwtDecode.mockReturnValue({ id: 'user-456' });
    axios.post.mockClear();
    mockOnReviewSubmit.mockClear();
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore(initialState)}>
        <ReviewModal vendor={vendor} onReviewSubmit={mockOnReviewSubmit} />
      </Provider>
    );

  test('renders review modal with vendor name', () => {
    renderComponent();
    expect(screen.getByText('Leave a Review for Test Vendor')).toBeInTheDocument();
  });

  test('shows error when submitting without comment and rating', async () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText('Submit Review'));

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
        'Please add comment and rating'
      );
    });
  });

  test('submits review successfully', async () => {
    axios.post.mockResolvedValueOnce({});

    renderComponent();

    // Enter comment
    fireEvent.change(screen.getByPlaceholderText('Write your comment'), {
      target: { value: 'Nice vendor!' },
    });

    // Click on 4th star (index 3)
    fireEvent.click(screen.getAllByText('★')[3]);

    // Submit
    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/vendor-reviews/reviews',
        {
          vendorId: 'vendor-123',
          userId: 'user-456',
          comment: 'Nice vendor!',
          rating: 4,
        }
      );

      expect(require('react-toastify').toast.success).toHaveBeenCalledWith(
        'Review submitted successfully!'
      );
      expect(mockOnReviewSubmit).toHaveBeenCalled();
    });
  });

});
