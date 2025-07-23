import { useParams } from "react-router-dom";
import BudgetOverview from "../components/BudgetOverview";

const BudgetOverviewPage = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Budget Overview</h1>
      <BudgetOverview projectId={projectId} />      
    </div>
  );
};

export default BudgetOverviewPage;