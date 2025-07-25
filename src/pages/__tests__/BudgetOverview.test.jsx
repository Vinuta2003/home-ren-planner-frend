import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BudgetOverviewPage from "../BudgetOverviewPage";
import '@testing-library/jest-dom';

// Mock child component to avoid testing its internals here
jest.mock("../../components/customer/BudgetOverview", () => () => (
  <div data-testid="budget-overview-component">Mock Budget Overview</div>
));

describe("BudgetOverviewPage", () => {
  test("renders BudgetOverview with correct projectId from params", () => {
    render(
      <MemoryRouter initialEntries={["/projects/123/budget-overview"]}>
        <Routes>
          <Route path="/projects/:projectId/budget-overview" element={<BudgetOverviewPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Budget Overview")).toBeInTheDocument();
    expect(screen.getByTestId("budget-overview-component")).toBeInTheDocument();
  });
});
