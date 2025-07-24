// Import all dependencies first
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PhasePage from "../../pages/PhasePage";
import { MemoryRouter } from "react-router-dom";
import * as reactRedux from "react-redux";
import * as phaseSlice from "../../redux/phase/phaseSlice";
import * as phaseApis from "../../axios/phaseApis";

// Mocks BEFORE usage
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));


beforeEach(() => {
    jest.clearAllMocks();
  
    reactRedux.useSelector.mockImplementation((selector) =>
      selector({
        phase: {
          currentPhase: {
            phaseName: "Framing",
            description: "Structural framing work",
            phaseType: "FRAMING",
            startDate: "2025-07-01",
            endDate: "2025-07-10",
            phaseStatus: "IN_PROGRESS",
            vendor: { name: "Acme Corp" },
            totalPhaseCost: 25000,
            totalPhaseMaterialCost: 15000,
            vendorCost: 10000,
            phaseMaterialList: [{ exposedId: "mat1", name: "Wood" }],
          },
          loaded: true,
          chosenMaterialsList: [],
        },
      })
    );
  
    jest.spyOn(phaseSlice, "getPhaseById").mockImplementation(() => ({ type: "GET_PHASE" }));
    jest.spyOn(phaseSlice, "clearChosenMaterialsList").mockImplementation(() => ({ type: "CLEAR_CHOSEN" }));
    jest.spyOn(phaseSlice, "addPhaseMaterialsToPhase").mockImplementation(() => ({ type: "ADD_MATERIALS" }));
    jest.spyOn(phaseApis, "getMaterialsByPhaseType").mockResolvedValue([{ exposedId: "m1", name: "Metal" }]);
  });
  

jest.mock("../../components/customer/PhaseMaterial", () => ({
  PhaseMaterial: ({ phaseMaterial }) => <div>{phaseMaterial.name}</div>,
}));
jest.mock("../../components/customer/Material", () => ({
  Material: ({ material }) => <div>{material.name}</div>,
}));
jest.mock("../../components/ReviewModal", () => () => <div>ReviewModal</div>);


jest.spyOn(reactRedux, "useSelector").mockImplementation((selector) =>
  selector({
    phase: {
      currentPhase: {
        phaseName: "Framing",
        description: "Structural framing work",
        phaseType: "FRAMING",
        startDate: "2025-07-01",
        endDate: "2025-07-10",
        phaseStatus: "IN_PROGRESS",
        vendor: { name: "Acme Corp" },
        totalPhaseCost: 25000,
        totalPhaseMaterialCost: 15000,
        vendorCost: 10000,
        phaseMaterialList: [{ exposedId: "mat1", name: "Wood" }],
      },
      loaded: true,
      chosenMaterialsList: [],
    },
  })
);

// ✅ Setup function
const setup = () => {
  render(
    <MemoryRouter initialEntries={["/phase/123"]}>
      <PhasePage />
    </MemoryRouter>
  );
};

// ✅ Tests
describe("PhasePage Main Functionalities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(phaseSlice, "getPhaseById").mockImplementation(() => ({ type: "GET_PHASE" }));
    jest.spyOn(phaseSlice, "clearChosenMaterialsList").mockImplementation(() => ({ type: "CLEAR_CHOSEN" }));
    jest.spyOn(phaseSlice, "addPhaseMaterialsToPhase").mockImplementation(() => ({ type: "ADD_MATERIALS" }));
    jest.spyOn(phaseApis, "getMaterialsByPhaseType").mockResolvedValue([{ exposedId: "m1", name: "Metal" }]);
  });

  test("dispatches getPhaseById and clearChosenMaterialsList on mount", async () => {
    setup();
    await waitFor(() => {
      expect(phaseSlice.getPhaseById).toHaveBeenCalledWith("123");
      expect(phaseSlice.clearChosenMaterialsList).toHaveBeenCalled();
    });
  });

  test("renders phase details correctly", () => {
    setup();
    expect(screen.getByText("Framing")).toBeInTheDocument();
    expect(screen.getByText("Structural framing work")).toBeInTheDocument();
    expect(screen.getByText("Wood")).toBeInTheDocument();
  });

  test("clicking Add Materials toggles addMode and fetches available materials", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /add materials/i }));
    await waitFor(() => {
      expect(screen.getByText("Available Materials")).toBeInTheDocument();
      expect(screen.getByText("Metal")).toBeInTheDocument();
    });
  });

  test("shows review modal when phase is completed", () => {
    jest.spyOn(reactRedux, "useSelector").mockImplementation((selector) =>
      selector({
        phase: {
          ...reactRedux.useSelector((s) => s).phase,
          currentPhase: {
            ...reactRedux.useSelector((s) => s).phase.currentPhase,
            phaseStatus: "COMPLETED",
          },
        },
      })
    );
    setup();
    expect(screen.getByText("ReviewModal")).toBeInTheDocument();
  });
});
