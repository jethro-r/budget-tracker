import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BudgetsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-gray-600 mt-1">Set and track your spending limits</p>
        </div>
        <Button>Create Budget</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No budgets found. Click &quot;Create Budget&quot; to set your first budget!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
