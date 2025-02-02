function ReturnComparisonBox() {
  const initialInvestment = 500000; // 5 Lakhs
  const years = 20;
  const returns = [0.10, 0.12]; // 10% and 12%

  const calculateFutureValue = (principal, rate, time) => {
    return principal * Math.pow(1 + rate, time);
  };

  const value10 = calculateFutureValue(initialInvestment, returns[0], years);
  const value12 = calculateFutureValue(initialInvestment, returns[1], years);
  const difference = value12 - value10;

  return (
    <div className="fixed right-4 top-20 p-6 bg-white rounded-lg shadow-lg border w-80">
      <h3 className="text-lg font-semibold mb-4">Investment Comparison</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Initial Investment</p>
          <p className="font-medium">₹{initialInvestment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">After {years} years @ 10%</p>
          <p className="font-medium">₹{Math.round(value10).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">After {years} years @ 12%</p>
          <p className="font-medium">₹{Math.round(value12).toLocaleString()}</p>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600">Additional returns with 12%</p>
          <p className="font-medium text-green-600">
            ₹{Math.round(difference).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReturnComparisonBox; 