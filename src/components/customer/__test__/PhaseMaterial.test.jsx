import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { PhaseMaterial } from "../PhaseMaterial";
import * as phaseApis from "../../../axios/phaseApis";
import * as phaseSlice from "../../../redux/phase/phaseSlice";
import "@testing-library/jest-dom";

// Mock APIs
jest.mock("../../../axios/phaseApis", () => ({
  deletePhaseMaterial: jest.fn(),
  updatePhaseMaterialQuantity: jest.fn(),
}));

const mockStore = configureStore([]);

const sampleMaterial = {
  exposedId: "mat-123",
  phaseId: "phase-abc",
  name: "Cement",
  unit: "kg",
  quantity: 10,
  pricePerQuantity: 50,
  totalPrice: 500,
};

const renderWithStore = (ui, store) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("PhaseMaterial Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  test("renders material name, quantity, unit, price, and total price", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    expect(screen.getByText("Cement")).toBeInTheDocument();
    expect(screen.getByText("Quantity:")).toBeInTheDocument();
    expect(screen.getByText("10 kg")).toBeInTheDocument();
    expect(screen.getByText("Price per")).toBeInTheDocument();
    expect(screen.getByText("₹50")).toBeInTheDocument();
    expect(screen.getByText("Total Price:")).toBeInTheDocument();
    expect(screen.getByText("₹500")).toBeInTheDocument();
  });

  test("clicking Edit switches to edit mode", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument(); // input field
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("clicking increment button increases quantity and updates total price", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByTestId("increment-btn"));

    expect(screen.getByDisplayValue("11")).toBeInTheDocument();
    expect(screen.getByText("₹550")).toBeInTheDocument();
  });

  test("clicking decrement button decreases quantity if > 1", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByTestId("decrement-btn"));

    expect(screen.getByDisplayValue("9")).toBeInTheDocument();
    expect(screen.getByText("₹450")).toBeInTheDocument();
  });

  test("typing in quantity input updates total price correctly", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "12" } });

    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByText("₹600")).toBeInTheDocument();
  });

  test("clicking Cancel restores original quantity and exits edit mode", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.getByText("10 kg")).toBeInTheDocument();
  });

  test("clicking Save triggers updatePhaseMaterialQuantity and fetches updated phase", async () => {
  phaseApis.updatePhaseMaterialQuantity.mockResolvedValue({});
  
  const getPhaseSpy = jest
    .spyOn(phaseSlice, "getPhaseById")
    .mockReturnValue(() => Promise.resolve({}));

  // Mock the store's dispatch to handle thunks
  store.dispatch = jest.fn((fn) => typeof fn === "function" ? fn() : fn);

  renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "15" } });
  fireEvent.click(screen.getByText("Save"));

  await waitFor(() =>
    expect(phaseApis.updatePhaseMaterialQuantity).toHaveBeenCalledWith("mat-123", 15)
  );
  expect(getPhaseSpy).toHaveBeenCalledWith("phase-abc");
});


  test("clicking Delete opens confirmation modal", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn-modal")).toBeInTheDocument();
  });

  test("clicking Cancel in modal closes it", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getAllByText("Cancel")[0]);

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  test("clicking Delete in modal calls deletePhaseMaterial and fetches phase", async () => {
  phaseApis.deletePhaseMaterial.mockResolvedValue({});
  
  const getPhaseSpy = jest
    .spyOn(phaseSlice, "getPhaseById")
    .mockReturnValue(() => Promise.resolve({}));

  // Mock the store's dispatch to support thunks
  store.dispatch = jest.fn((fn) => typeof fn === "function" ? fn() : fn);

  renderWithStore(<PhaseMaterial phaseMaterial={sampleMaterial} />, store);

  fireEvent.click(screen.getByText("Delete"));
  fireEvent.click(screen.getAllByText("Delete")[1]);

  await waitFor(() => {
    expect(phaseApis.deletePhaseMaterial).toHaveBeenCalledWith("mat-123");
    expect(getPhaseSpy).toHaveBeenCalledWith("phase-abc");
  });
});

});
