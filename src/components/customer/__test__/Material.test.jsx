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

const sampleMaterial = {
  name: "Cement",
  exposedId: "d5cd7930-a960-4078-b08a-5eaff632e749",
  pricePerQuantity: 50,
  unit: "KG",
};

const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <Material material={sampleMaterial} />
    </Provider>
  );
};

describe("Material component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      phase: {
        chosenMaterialsList: [
          {
            materialExposedId: sampleMaterial.exposedId,
            quantity: 1,
          },
        ],
      },
    });
    store.dispatch = jest.fn();
  });

  test("renders material name, price and unit", () => {
    renderWithStore(store);
    expect(screen.getByText(sampleMaterial.name)).toBeInTheDocument();
    expect(screen.getByText(`₹${sampleMaterial.pricePerQuantity}`)).toBeInTheDocument();
    expect(screen.getByText(`/ ${sampleMaterial.unit}`)).toBeInTheDocument();
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
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 1,
        },
      })
    );
    expect(screen.getByText("Quantity:")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  test("increment increases quantity and dispatches update", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    const incrementBtn = screen.getByTestId("increment-btn");
    fireEvent.click(incrementBtn);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_MATERIAL_QUANTITY",
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 2,
        },
      })
    );
  });

  test("decrement does not go below 1", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));
    const decrementBtn = screen.getByTestId("decrement-btn");
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
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 5,
        },
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
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 1,
        },
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
        payload: sampleMaterial.exposedId,
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
        payload: sampleMaterial.exposedId,
      })
    );
  });

  test("increment sets quantity to 1 and dispatches addMaterial when quantity is empty", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "" } });

    const incrementBtn = screen.getByTestId("increment-btn");
    fireEvent.click(incrementBtn);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ADD_MATERIAL",
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 1,
        },
      })
    );
  });

  test("decrement decreases quantity and dispatches updateMaterialQuantity when quantity > 1", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "3" } });

    const decrementBtn = screen.getByTestId("decrement-btn");
    fireEvent.click(decrementBtn);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_MATERIAL_QUANTITY",
        payload: {
          materialExposedId: sampleMaterial.exposedId,
          quantity: 2,
        },
      })
    );
  });

  test("input remains controlled when value is empty string", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "" } });

    expect(input.value).toBe("");
  });

  test("typing 0 for a material not in chosenMaterialsList dispatches addMaterial with quantity 1", () => {
    store = mockStore({
        phase: {
        chosenMaterialsList: [],
        },
    });
    store.dispatch = jest.fn();

    renderWithStore(store);
    fireEvent.click(screen.getByText("Add"));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "0" } });

    expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
        type: "ADD_MATERIAL",
        payload: {
            materialExposedId: sampleMaterial.exposedId,
            quantity: 1,
        },
        })
    );
  });

 test("typing non-zero quantity for a material not in chosenMaterialsList dispatches addMaterial with given quantity", () => {
  store = mockStore({
    phase: {
      chosenMaterialsList: [],
    },
  });
  store.dispatch = jest.fn();

  renderWithStore(store);
  fireEvent.click(screen.getByText("Add"));

  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "4" } });

  expect(store.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "ADD_MATERIAL",
      payload: {
        materialExposedId: sampleMaterial.exposedId,
        quantity: 4,
      },
    })
  );
});

});
