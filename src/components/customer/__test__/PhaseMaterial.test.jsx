import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { PhaseMaterial } from "../PhaseMaterial";
import * as phaseApis from "../../../axios/phaseApis";
import * as phaseSlice from "../../../redux/phase/phaseSlice";
import "@testing-library/jest-dom";

jest.mock("../../../axios/phaseApis", () => ({
  deletePhaseMaterial: jest.fn(),
  updatePhaseMaterialQuantity: jest.fn(),
}));

const mockStore = configureStore([]);

const samplePhaseMaterial = {
  exposedId: "7534045f-45c5-4dd6-81cb-2cf06e19b2f8",
  phaseId: "e5d09e73-7f2d-4ab6-aff7-6d6f29f03c49",
  materialId : "4233e8e6-d2fd-486f-aafe-ec5e633398db",
  name: "Cement",
  unit: "KG",
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
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    expect(screen.getByText(samplePhaseMaterial.name)).toBeInTheDocument();
    expect(screen.getByText("Quantity:")).toBeInTheDocument();
    expect(screen.getByText(`${samplePhaseMaterial.quantity} ${samplePhaseMaterial.unit}`)).toBeInTheDocument();
    expect(screen.getByText("Price per")).toBeInTheDocument();
    expect(screen.getByText(`₹${samplePhaseMaterial.pricePerQuantity}`)).toBeInTheDocument();
    expect(screen.getByText("Total Price:")).toBeInTheDocument();
    expect(screen.getByText(`₹${samplePhaseMaterial.totalPrice}`)).toBeInTheDocument();
  });

  test("clicking Edit switches to edit mode", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("clicking increment button increases quantity and updates total price", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByTestId("increment-btn"));

    expect(screen.getByDisplayValue("11")).toBeInTheDocument();
    expect(screen.getByText("₹550")).toBeInTheDocument();
  });

  test("clicking decrement button decreases quantity if > 1", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByTestId("decrement-btn"));

    expect(screen.getByDisplayValue("9")).toBeInTheDocument();
    expect(screen.getByText("₹450")).toBeInTheDocument();
  });

  test("typing in quantity input updates total price correctly", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "12" } });

    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByText("₹600")).toBeInTheDocument();
  });

  test("clicking Cancel restores original quantity and exits edit mode", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.getByText("10 KG")).toBeInTheDocument();
  });

  test("clicking Save triggers updatePhaseMaterialQuantity and fetches updated phase", async () => {
  phaseApis.updatePhaseMaterialQuantity.mockResolvedValue({});
  
  const getPhaseSpy = jest
    .spyOn(phaseSlice, "getPhaseById")
    .mockReturnValue(() => Promise.resolve({}));

  store.dispatch = jest.fn((fn) => typeof fn === "function" ? fn() : fn);

  renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "15" } });
  fireEvent.click(screen.getByText("Save"));

  await waitFor(() =>
    expect(phaseApis.updatePhaseMaterialQuantity).toHaveBeenCalledWith("7534045f-45c5-4dd6-81cb-2cf06e19b2f8", 15)
  );
  expect(getPhaseSpy).toHaveBeenCalledWith("e5d09e73-7f2d-4ab6-aff7-6d6f29f03c49");
});


  test("clicking Delete opens confirmation modal", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn-modal")).toBeInTheDocument();
  });

  test("clicking Cancel in modal closes it", () => {
    renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getAllByText("Cancel")[0]);

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  test("clicking Delete in modal calls deletePhaseMaterial and fetches phase", async () => {
  phaseApis.deletePhaseMaterial.mockResolvedValue({});
  
  const getPhaseSpy = jest
    .spyOn(phaseSlice, "getPhaseById")
    .mockReturnValue(() => Promise.resolve({}));

  store.dispatch = jest.fn((fn) => typeof fn === "function" ? fn() : fn);

  renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

  fireEvent.click(screen.getByText("Delete"));
  fireEvent.click(screen.getAllByText("Delete")[1]);

  await waitFor(() => {
    expect(phaseApis.deletePhaseMaterial).toHaveBeenCalledWith("7534045f-45c5-4dd6-81cb-2cf06e19b2f8");
    expect(getPhaseSpy).toHaveBeenCalledWith("e5d09e73-7f2d-4ab6-aff7-6d6f29f03c49");
  });
});



test("clicking increment when quantity is empty sets quantity to 1 and totalPrice to pricePerQuantity", () => {
  const blankQuantityMaterial = {
    ...samplePhaseMaterial,
    quantity: "",
  };

  renderWithStore(<PhaseMaterial phaseMaterial={blankQuantityMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");

  fireEvent.change(input, { target: { value: "" } });
  fireEvent.click(screen.getByTestId("increment-btn"));

  expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  const priceList = screen.getAllByText("₹50")
  expect(Array.isArray(priceList)).toBe(true);
  expect(priceList).toHaveLength(2);
});

test("typing empty string into quantity input sets total price to '---'", () => {
  renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");

  fireEvent.change(input, { target: { value: "" } });

  expect(screen.getByDisplayValue("")).toBeInTheDocument();
  expect(screen.getByText("₹---")).toBeInTheDocument();
});

test("typing 0 into quantity input resets it to 1 and updates total price", () => {
  renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");

  fireEvent.change(input, { target: { value: "0" } });

  expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  const priceList = screen.getAllByText("₹50")
  expect(Array.isArray(priceList)).toBe(true);
  expect(priceList).toHaveLength(2);
});

test("cancel resets quantity and exits edit mode", () => {
  renderWithStore(<PhaseMaterial phaseMaterial={samplePhaseMaterial} />, store);

  fireEvent.click(screen.getByText("Edit"));
  const input = screen.getByRole("spinbutton");

  fireEvent.change(input, { target: { value: "7" } });
  fireEvent.click(screen.getByText("Cancel"));

  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  expect(screen.getByText("10 KG")).toBeInTheDocument();
});

});
