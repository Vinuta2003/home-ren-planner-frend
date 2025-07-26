import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BudgetOverview from "../../BudgetOverview";
import * as api from "../../../axios/getBudgetOverview";
import React from "react";


jest.mock("../../../axios/getBudgetOverview", () => ({
  getBudgetOverview: jest.fn(),
}));


beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  jest.spyOn(console, "error").mockImplementation(() => {}); 
});

const mockData = {
  projectName: "Test Project",
  estimatedBudget: 100000,
  totalActualCost: 120000,
  rooms: [
    { id: 1, name: "Living Room", totalCost: 50000 },
    { id: 2, name: "Bedroom", totalCost: 70000 },
  ],
  phases: [
    { id: 1, name: "Plumbing", totalCost: 60000, vendorCost: 40000, materialCost: 20000 },
    { id: 2, name: "Wiring", totalCost: 60000, vendorCost: 30000, materialCost: 30000 },
  ],
};

describe("BudgetOverview Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    api.getBudgetOverview.mockResolvedValueOnce(mockData);
    render(<BudgetOverview projectId="123" />);

    expect(screen.getByText(/Loading Budget Overview/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Budget Overview/i)).toBeInTheDocument()
    );
  });

  test("renders budget summary and detects over budget", async () => {
    api.getBudgetOverview.mockResolvedValueOnce(mockData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Budget Overview/i)).toBeInTheDocument()
    );

    
    expect(screen.getByText(/Estimated:/i)).toHaveTextContent(/1,00,000|100000/);
    expect(screen.getByText(/Actual:/i)).toHaveTextContent(/1,20,000|120000/);
    expect(screen.getByText(/Budget Exceeded!/i)).toBeInTheDocument();
  });

  test("does not show exceeded badge if exactly on budget", async () => {
    const exactData = { ...mockData, totalActualCost: 100000 };
    api.getBudgetOverview.mockResolvedValueOnce(exactData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Budget Overview/i)).toBeInTheDocument()
    );

    expect(screen.queryByText(/Budget Exceeded!/i)).toBeNull();
  });

  test("renders room filter and filters correctly", async () => {
    api.getBudgetOverview.mockResolvedValueOnce(mockData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Room-wise Total Cost/i)).toBeInTheDocument()
    );

    
    const roomSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(roomSelect, { target: { value: "Living Room" } });

    expect(screen.getByText(/Room-wise Total Cost/i)).toBeInTheDocument();
  });

  test("renders phase filter and filters correctly", async () => {
    api.getBudgetOverview.mockResolvedValueOnce(mockData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Phase-wise Total Cost/i)).toBeInTheDocument()
    );

    const phaseSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(phaseSelect, { target: { value: "Plumbing" } });

    expect(screen.getByText(/Phase-wise Total Cost/i)).toBeInTheDocument();
  });

  test("renders charts (pie, bar, stacked bar)", async () => {
    api.getBudgetOverview.mockResolvedValueOnce(mockData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Room-wise Total Cost/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Room-wise Total Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase-wise Total Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Vendor vs Material Cost/i)).toBeInTheDocument();
  });

  test("handles empty rooms/phases gracefully", async () => {
    const emptyData = { ...mockData, rooms: [], phases: [] };
    api.getBudgetOverview.mockResolvedValueOnce(emptyData);
    render(<BudgetOverview projectId="123" />);

    await waitFor(() =>
      expect(screen.getByText(/Budget Overview/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Room-wise Total Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase-wise Total Cost/i)).toBeInTheDocument();
  });
});
