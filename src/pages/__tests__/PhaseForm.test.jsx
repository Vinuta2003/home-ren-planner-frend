// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import PhaseForm from '../PhaseForm';
// import '@testing-library/jest-dom';
// import axios from 'axios';

// jest.mock('axios');
// jest.mock('../../axios/phaseListAPIs', () => ({
//   createPhaseApi: jest.fn(),
// }));
// const { createPhaseApi } = require('../../axios/phaseListAPIs');

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => {
//   const original = jest.requireActual('react-router-dom');
//   return {
//     ...original,
//     useNavigate: () => mockNavigate,
//     useLocation: () => ({
//       search: '?vendorId=123&vendorName=Vendor%20Name',
//       state: {
//         formData: {
//           phaseName: "Test Phase",
//           description: "Test Description",
//           phaseType: "TILING",
//           phaseStatus: "NOTSTARTED",
//           startDate: "2025-08-01",
//           endDate: "2025-08-05",
//           vendorId: "123",
//           vendorName: "Vendor Name",
//           room: "45942c44-903f-440e-81ba-990640e05a8f"
//         }
//       },
//     }),
    
//     useParams: () => ({
//       exposedId: '45942c44-903f-440e-81ba-990640e05a8f',
//     }),
//   };
// });

// describe('PhaseForm', () => {
//   const renderComponent = () =>
//     render(
//       <MemoryRouter initialEntries={['/phase-form/45942c44-903f-440e-81ba-990640e05a8f']}>
//         <Routes>
//           <Route path="/phase-form/:exposedId" element={<PhaseForm />} />
//         </Routes>
//       </MemoryRouter>
//     );

//   beforeEach(() => {
//     axios.get.mockReset();
//     createPhaseApi.mockReset();
//     mockNavigate.mockReset();

//     axios.get.mockImplementation((url) => {
//       if (url.includes('/rooms/')) {
//         return Promise.resolve({
//           data: { renovationType: 'KITCHEN_RENOVATION' },
//         });
//       }
//       if (url.includes('/api/enums/phase-statuses')) {
//         return Promise.resolve({
//           data: ['NOTSTARTED', 'INPROGRESS', 'COMPLETED'],
//         });
//       }
//       if (url.includes('/by-renovation-type')) {
//         return Promise.resolve({
//           data: ['TILING'],
//         });
//       }
//       if (url.includes('/phase/phase/exists')) {
//         return Promise.resolve({ data: false });
//       }
//       return Promise.resolve({ data: [] });
//     });
//   });

//   test('renders form and populates fields from URL and APIs', async () => {
//     renderComponent();

//     expect(await screen.findByPlaceholderText(/Phase Name/i)).toBeInTheDocument();
//     expect(screen.getByDisplayValue('Vendor Name')).toBeInTheDocument();
//     expect(screen.getByText(/Choose Vendor From List/i)).toBeInTheDocument();
//   });

//   test('shows validation errors when submitting empty form', async () => {
//     renderComponent();

//     fireEvent.click(screen.getByRole('button', { name: /Create Phase/i }));

//     expect(await screen.findByText(/Please enter phase name/i)).toBeInTheDocument();
//     expect(screen.getByText(/Please select phase type/i)).toBeInTheDocument();
//     expect(screen.getByText(/Please enter start date/i)).toBeInTheDocument();
//   });

//   test('redirects to vendor list when "Choose Vendor From List" is clicked after selecting phaseType', async () => {
//     renderComponent();

//     const [phaseTypeSelect] = screen.getAllByRole('combobox');
//     fireEvent.change(phaseTypeSelect, { target: { value: 'TILING' } });

//     fireEvent.click(screen.getByText(/Choose Vendor From List/i));

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith(
//         '/vendor-list?phaseType=TILING',
//         expect.objectContaining({
//           state: expect.any(Object),
//         })
//       );
//     });
//   });

//   test('submits form when populated properly', async () => {
//     renderComponent();

//     fireEvent.change(screen.getByPlaceholderText(/Phase Name/i), {
//       target: { value: 'Planning' },
//     });
//     fireEvent.change(screen.getByPlaceholderText(/Description/i), {
//       target: { value: 'Phase description' },
//     });
//     const dateInputs = screen.getAllByRole('textbox'); 
//     fireEvent.change(dateInputs[0], { target: { value: '2025-08-01' } }); 
//     fireEvent.change(dateInputs[1], { target: { value: '2025-08-05' } }); 
    
   

//     const phaseTypeSelect = screen.getAllByRole('combobox')[0];
// fireEvent.change(phaseTypeSelect, { target: { value: 'TILING' } });


// const selects = screen.getAllByRole('combobox');
// const phaseStatusSelect = selects[1]; 
// fireEvent.change(phaseStatusSelect, { target: { value: 'NOTSTARTED' } });


//     fireEvent.click(screen.getByRole('button', { name: /Create Phase/i }));

//     await waitFor(() => {
//       expect(createPhaseApi).toHaveBeenCalledWith(
//         expect.objectContaining({
//           phaseName: 'Planning',
//           phaseType: 'TILING',
//           phaseStatus: 'NOTSTARTED',
//         })
//       );
//     });

//     expect(mockNavigate).toHaveBeenCalledWith('/phase/room/45942c44-903f-440e-81ba-990640e05a8f');
//   });
// });


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PhaseForm from '../PhaseForm';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock API modules
jest.mock('axios');
jest.mock('../../axios/phaseListAPIs', () => ({
  createPhaseApi: jest.fn(),
}));
const { createPhaseApi } = require('../../axios/phaseListAPIs');

// Stable formData mock
const stableFormData = {
  phaseName: 'Test Phase',
  description: 'Test Description',
  phaseType: 'TILING',
  phaseStatus: 'NOTSTARTED',
  startDate: '2025-08-01',
  endDate: '2025-08-05',
  vendorId: '123',
  vendorName: 'Vendor Name',
  room: '45942c44-903f-440e-81ba-990640e05a8f',
};

// Mock router behavior
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      search: '?vendorId=123&vendorName=Vendor%20Name',
      state: { formData: stableFormData },
    }),
    useParams: () => ({
      exposedId: '45942c44-903f-440e-81ba-990640e05a8f',
    }),
  };
});

// Main test block
describe('PhaseForm', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/phase-form/45942c44-903f-440e-81ba-990640e05a8f']}>
        <Routes>
          <Route path="/phase-form/:exposedId" element={<PhaseForm />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    axios.get.mockReset();
    createPhaseApi.mockReset();
    mockNavigate.mockReset();

    axios.get.mockImplementation((url) => {
      if (url.includes('/rooms/')) {
        return Promise.resolve({
          data: { renovationType: 'KITCHEN_RENOVATION' },
        });
      }
      if (url.includes('/api/enums/phase-statuses')) {
        return Promise.resolve({
          data: ['NOTSTARTED', 'INPROGRESS', 'COMPLETED'],
        });
      }
      if (url.includes('/by-renovation-type')) {
        return Promise.resolve({
          data: ['TILING'],
        });
      }
      if (url.includes('/phase/phase/exists')) {
        return Promise.resolve({ data: false });
      }
      return Promise.resolve({ data: [] });
    });
  });

  test('renders form and populates fields from URL and APIs', async () => {
    renderComponent();

    expect(await screen.findByPlaceholderText(/Phase Name/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Vendor Name')).toBeInTheDocument();
    expect(screen.getByText(/Choose Vendor From List/i)).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
        renderComponent();
    
        fireEvent.click(screen.getByRole('button', { name: /Create Phase/i }));
    
        expect(await screen.findByText(/Please enter phase name/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select phase type/i)).toBeInTheDocument();
        expect(screen.getByText(/Please enter start date/i)).toBeInTheDocument();
      });

  test('redirects to vendor list when "Choose Vendor From List" is clicked after selecting phaseType', async () => {
    renderComponent();

    const [phaseTypeSelect] = screen.getAllByRole('combobox');
    fireEvent.change(phaseTypeSelect, { target: { value: 'TILING' } });

    fireEvent.click(screen.getByText(/Choose Vendor From List/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/vendor-list?phaseType=TILING',
        expect.objectContaining({
          state: expect.objectContaining({
            formData: expect.any(Object),
          }),
        })
      );
    });
  });

  test('submits form when populated properly', async () => {
    renderComponent();

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText(/Phase Name/i), {
      target: { value: 'Planning' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: 'Phase description' },
    });

    const dateInputs = screen.getAllByRole('textbox');
    fireEvent.change(dateInputs[0], { target: { value: '2025-08-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2025-08-05' } });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'TILING' } }); // phaseType
    fireEvent.change(selects[1], { target: { value: 'NOTSTARTED' } }); // phaseStatus

    fireEvent.click(screen.getByRole('button', { name: /Create Phase/i }));

    await waitFor(() => {
      expect(createPhaseApi).toHaveBeenCalledWith(
        expect.objectContaining({
          phaseName: 'Planning',
          phaseType: 'TILING',
          phaseStatus: 'NOTSTARTED',
        })
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/phase/room/45942c44-903f-440e-81ba-990640e05a8f');
  });
});
