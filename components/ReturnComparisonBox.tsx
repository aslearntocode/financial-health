function ReturnComparisonBox() {
  const initialInvestment = 1000000; // 10 Lakhs
  const years = 20;
  const returns = [0.08, 0.12]; // 8% and 12%

  const calculateFutureValue = (principal: number, rate: number, time: number) => {
    return principal * Math.pow(1 + rate, time);
  };

  const value8 = calculateFutureValue(initialInvestment, returns[0], years);
  const value12 = calculateFutureValue(initialInvestment, returns[1], years);
  const difference = value12 - value8;

  return (
    <div className="hidden md:block absolute right-4 top-[80px] p-3 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-2xl border border-green-100 w-80 animate-pulse-slow hover:animate-none transition-all duration-300 hover:scale-105 z-50">
      <h3 className="text-base font-semibold mb-2 text-green-800 text-center">How much a Wrong Fund Distribution Can Cost You?</h3>
      <div className="space-y-2">
        <div className="bg-white py-1.5 px-2 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">Initial Investment</p>
          <p className="font-medium text-green-900">₹{initialInvestment.toLocaleString()}</p>
        </div>
        <div className="bg-white py-1.5 px-2 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">After {years} years @ 8%</p>
          <p className="font-medium text-green-900">₹{Math.round(value8).toLocaleString()}</p>
        </div>
        <div className="bg-white py-1.5 px-2 rounded-lg shadow-sm">
          <p className="text-xs text-gray-600">After {years} years @ 12%</p>
          <p className="font-medium text-green-900">₹{Math.round(value12).toLocaleString()}</p>
        </div>
        <div className="bg-green-100 py-1.5 px-2 rounded-lg border border-green-200 shadow-sm">
          <p className="text-xs text-gray-600">Additional returns with 12%</p>
          <p className="font-medium text-green-600">
            ₹{Math.round(difference).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReturnComparisonBox;
