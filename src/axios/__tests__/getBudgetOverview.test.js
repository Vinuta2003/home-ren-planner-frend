describe("getBudgetOverview (100% forced coverage)", () => {
  let axios;

  beforeEach(() => {
    jest.resetModules();
    axios = { get: jest.fn() };
    // Correct relative path (go up one level from __tests__)
    jest.doMock("../axiosInstance", () => axios);
  });

  test("should return data on success", async () => {
    const { getBudgetOverview } = await import("../getBudgetOverview");
    const projectId = "123e4567-e89b-12d3-a456-426614174000";

    const mockData = { estimatedBudget: 10000, totalActualCost: 5000 };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getBudgetOverview(projectId);

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/projects/${projectId}/budget-overview`,
      { withCredentials: true }
    );
    expect(result).toEqual(mockData);
  });

  test("should throw error on failure (cover error path)", async () => {
    const { getBudgetOverview } = await import("../getBudgetOverview");
    const projectId = "123e4567-e89b-12d3-a456-426614174000";

    const error = new Error("Network error");
    axios.get.mockRejectedValueOnce(error);

    await expect(getBudgetOverview(projectId)).rejects.toThrow("Network error");

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/projects/${projectId}/budget-overview`,
      { withCredentials: true }
    );
  });
});
