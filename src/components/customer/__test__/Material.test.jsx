import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Material } from "../Material";
import "@testing-library/jest-dom"; 

jest.mock("../../../redux/phase/phaseSlice", () => ({
  addMaterial: jest.fn(({ materialExposedId, quantity }) => ({
    type: "ADD_MATERIAL",
    payload: { materialExposedId, quantity },
  })),
  deleteMaterial: jest.fn((materialExposedId) => ({
    type: "DELETE_MATERIAL",
    payload: materialExposedId,
  })),
  updateMaterialQuantity: jest.fn(({ materialExposedId, quantity }) => ({
    type: "UPDATE_MATERIAL_QUANTITY",
    payload: { materialExposedId, quantity },
  })),
}));

const {
  addMaterial,
  deleteMaterial,
  updateMaterialQuantity,
} = require("../../../redux/phase/phaseSlice");

const mockStore = configureStore([]);

const mockMaterial = {
  name: "Cement",
  exposedId: "mat-001",
  pricePerQuantity: 50,
  unit: "kg",
};

const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <Material material={mockMaterial} />
    </Provider>
  );
};

describe("Material component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      phase: {
        chosenMaterialsList: [{ materialExposedId: "mat-001", quantity: 1 }],
      },
    });
    store.dispatch = jest.fn();
  });

  test("renders material name, price and unit", () => {
    renderWithStore(store);
    expect(screen.getByText("Cement")).toBeInTheDocument();
    expect(screen.getByText("₹50")).toBeInTheDocument();
    expect(screen.getByText("/ kg")).toBeInTheDocument();
  });

  test("shows Add button initially", () => {
    renderWithStore(store);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  test("clicking Add shows quantity UI and dispatches addMaterial", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ADD_MATERIAL",
        payload: { materialExposedId: "mat-001", quantity: 1 },
      })
    );
    expect(screen.getByText("Quantity:")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  test("increment increases quantity and dispatches update", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    const incrementBtn = screen.getByTestId("increment-btn")
    fireEvent.click(incrementBtn);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_MATERIAL_QUANTITY",
        payload: { materialExposedId: "mat-001", quantity: 2 },
      })
    );
  });

  test("decrement does not go below 1", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    const decrementBtn = screen.getByTestId("decrement-btn")
    fireEvent.click(decrementBtn);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  test("quantity input change to 5 dispatches updateMaterialQuantity", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "5" } });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_MATERIAL_QUANTITY",
        payload: { materialExposedId: "mat-001", quantity: 5 },
      })
    );
  });

  test("quantity input change to 0 sets it to 1", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "0" } });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ADD_MATERIAL",
        payload: { materialExposedId: "mat-001", quantity: 1 },
      })
    );
  });

  test("empty input triggers deleteMaterial", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "" } });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "DELETE_MATERIAL",
        payload: "mat-001",
      })
    );
  });

  test("clicking Remove triggers deleteMaterial", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Remove"));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "DELETE_MATERIAL",
        payload: "mat-001",
      })
    );
  });
});
