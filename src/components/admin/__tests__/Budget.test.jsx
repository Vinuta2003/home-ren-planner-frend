import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BudgetOverview from "../components/customer/BudgetOverview";
import { getBudgetOverview } from "../axios/getBudgetOverview";

// Mock the API call
jest.mock("../axios/getBudgetOverview");

// Mock recharts ResponsiveContainer (avoids SVG size issues in tests)
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>
  };
});

const mockData = {
  projectName: "Test Project",
  estimatedBudget: 100000,
  totalActualCost: 120000,
  rooms: [
    { roomId: 1, roomName: "Living Room", totalRoomCost: 50000 },
    { roomId: 2, roomName: "Bedroom", totalRoomCost: 70000 }
  ],
  phases: [
    { phaseId: 1, phaseName: "Plumbing", totalPhaseCost: 40000, vendorCost: 20000, materialCost: 20000 },
    { phaseId: 2, phaseName: "Wiring", totalPhaseCost: 80000, vendorCost: 50000, materialCost: 30000 }
  ]
};

describe("BudgetOverview Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    getBudgetOverview.mockResolvedValueOnce(mockData);

    render(<BudgetOverview projectId="123" />);
    expect(screen.getByText(/Loading Budget Overview/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getBudgetOverview).toHaveBeenCalledWith("123");
    });
  });

  test("renders budget summary correctly", async () => {
    getBudgetOverview.mockResolvedValueOnce(mockData);

    render(<BudgetOverview projectId="123" />);
    await waitFor(() => {
      expect(screen.getByText("🏗️ Test Project – Budget Overview")).toBeInTheDocument();
    });

    expect(screen.getByText(/Estimated: ₹100,000/)).toBeInTheDocument();
    expect(screen.getByText(/Actual: ₹120,000/)).toBeInTheDocument();
    expect(screen.getByText(/Budget Exceeded!/)).toBeInTheDocument();
  });

  test("renders room filter and filters correctly", async () => {
    getBudgetOverview.mockResolvedValueOnce(mockData);

    render(<BudgetOverview projectId="123" />);
    await waitFor(() => screen.getByText(/Room-wise Total Cost/));

    const roomSelect = screen.getByLabelText(/Filter by Room/i);
    fireEvent.change(roomSelect, { target: { value: "Living Room" } });

    expect(screen.getByText(/Room-wise Total Cost/)).toBeInTheDocument();
  });

  test("renders phase filter and filters correctly", async () => {
    getBudgetOverview.mockResolvedValueOnce(mockData);

    render(<BudgetOverview projectId="123" />);
    await waitFor(() => screen.getByText(/Phase-wise Total Cost/));

    const phaseSelect = screen.getByLabelText(/Filter by Phase/i);
    fireEvent.change(phaseSelect, { target: { value: "Plumbing" } });

    expect(screen.getByText(/Phase-wise Total Cost/)).toBeInTheDocument();
  });

  test("renders pie chart and bar charts", async () => {
    getBudgetOverview.mockResolvedValueOnce(mockData);

    render(<BudgetOverview projectId="123" />);
    await waitFor(() => screen.getByText(/Room-wise Total Cost/));

    // Check pie chart, bar chart headings
    expect(screen.getByText(/Room-wise Total Cost/)).toBeInTheDocument();
    expect(screen.getByText(/Phase-wise Total Cost/)).toBeInTheDocument();
    expect(screen.getByText(/Vendor vs Material Cost/)).toBeInTheDocument();
  });
});
