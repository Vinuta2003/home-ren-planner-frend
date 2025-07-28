// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import ReviewModal from '../../components/ReviewModal';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import '@testing-library/jest-dom';

// // ✅ Mocks
// jest.mock('axios');
// jest.mock('jwt-decode', () => ({
//   jwtDecode: jest.fn(),
// }));
// jest.mock('react-toastify', () => ({
//   toast: {
//     success: jest.fn(),
//     error: jest.fn(),
//   },
// }));

// const mockStore = configureStore([]);

// describe('ReviewModal Component', () => {
//   const vendor = {
//     exposedId: 'vendor-123',
//     name: 'Test Vendor',
//   };

//   const mockOnReviewSubmit = jest.fn();

//   const initialState = {
//     auth: {
//       accessToken: 'fake.jwt.token',
//     },
//   };

//   beforeEach(() => {
//     jwtDecode.mockReturnValue({ id: 'user-456' });
//     axios.post.mockClear();
//     mockOnReviewSubmit.mockClear();
//   });

//   const renderComponent = () =>
//     render(
//       <Provider store={mockStore(initialState)}>
//         <ReviewModal vendor={vendor} onReviewSubmit={mockOnReviewSubmit} />
//       </Provider>
//     );

//   test('renders review modal with vendor name', () => {
//     renderComponent();
//     expect(screen.getByText('Leave a Review for Test Vendor')).toBeInTheDocument();
//   });

//   test('shows error when submitting without comment and rating', async () => {
//     const { getByText } = renderComponent();
//     fireEvent.click(getByText('Submit Review'));

//     await waitFor(() => {
//       expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
//         'Please add comment and rating'
//       );
//     });
//   });

//   test('submits review successfully', async () => {
//     axios.post.mockResolvedValueOnce({});

//     renderComponent();

//     // Enter comment
//     fireEvent.change(screen.getByPlaceholderText('Write your comment'), {
//       target: { value: 'Nice vendor!' },
//     });

//     // Click on 4th star (index 3)
//     fireEvent.click(screen.getAllByText('★')[3]);

//     // Submit
//     fireEvent.click(screen.getByText('Submit Review'));

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         'http://localhost:8080/api/vendor-reviews/reviews',
//         {
//           vendorId: 'vendor-123',
//           userId: 'user-456',
//           comment: 'Nice vendor!',
//           rating: 4,
//         }
//       );

//       expect(require('react-toastify').toast.success).toHaveBeenCalledWith(
//         'Review submitted successfully!'
//       );
//       expect(mockOnReviewSubmit).toHaveBeenCalled();
//     });
//   });

// });
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

// ✅ Shared constants
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

// ✅ Reusable render function
const renderComponent = (storeOverride = initialState) =>
  render(
    <Provider store={mockStore(storeOverride)}>
      <ReviewModal vendor={vendor} onReviewSubmit={mockOnReviewSubmit} />
    </Provider>
  );

describe('ReviewModal Component', () => {
  beforeEach(() => {
    jwtDecode.mockReset();
    axios.post.mockReset();
    mockOnReviewSubmit.mockReset();
    localStorage.clear();
  });

  test('renders review modal with vendor name', () => {
    renderComponent();
    expect(screen.getByText('Leave a Review for Test Vendor')).toBeInTheDocument();
  });

  test('shows error when submitting without comment and rating', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
        'Please add comment and rating'
      );
    });
  });

  test('submits review successfully', async () => {
    axios.post.mockResolvedValueOnce({});
    jwtDecode.mockReturnValue({ id: 'user-456' });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Write your comment'), {
      target: { value: 'Nice vendor!' },
    });
    fireEvent.click(screen.getAllByText('★')[3]); // 4th star

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

  test('falls back to localStorage when Redux token is missing', () => {
    localStorage.setItem('accessToken', 'fake.jwt.token');
    jwtDecode.mockReturnValue({ id: 'user-456' });

    renderComponent({ auth: { accessToken: null } });

    expect(jwtDecode).toHaveBeenCalledWith('fake.jwt.token');
  });

  test('shows alert when token is invalid', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    renderComponent({ auth: { accessToken: 'invalid.token' } });

    expect(window.alert).toHaveBeenCalledWith('Failed to decode user token');
  });

  test('shows alert when token has no user ID', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jwtDecode.mockReturnValue({});

    renderComponent();

    expect(window.alert).toHaveBeenCalledWith('User ID missing in token!');
  });

  test('handles review submission failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    jwtDecode.mockReturnValue({ id: 'user-456' });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Write your comment'), {
      target: { value: 'Bad experience' },
    });
    fireEvent.click(screen.getAllByText('★')[2]); // 3rd star

    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Failed to submit review');
    });
  });

  test('updates star rating correctly when clicked', () => {
    renderComponent();

    const stars = screen.getAllByText('★');
    fireEvent.click(stars[4]); // 5th star

    expect(screen.getByText('5 Stars')).toBeInTheDocument();
  });
});
test('shows alert when user is not logged in (no token anywhere)', () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  localStorage.removeItem('accessToken');

  renderComponent({ auth: { accessToken: null } });

  expect(window.alert).toHaveBeenCalledWith('User not logged in!');
});
