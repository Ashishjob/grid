import React, { useState } from 'react';
import { calculateCarbonFootprint, calculateFinancials } from '../utils/calculations';

const CalculatorPanel = () => {
  const [consumption, setConsumption] = useState(1000);
  const [generation, setGeneration] = useState(1200);
  const [greenPercentage, setGreenPercentage] = useState(60);

  const financials = calculateFinancials(consumption, generation);
  const carbonMetrics = calculateCarbonFootprint(consumption, greenPercentage);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Energy Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Input Values</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Monthly Consumption (kWh)</label>
              <input
                type="number"
                value={consumption}
                onChange={(e) => setConsumption(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter monthly consumption"
              />
            </div>
            <div>
              <input
                type="number"
                value={generation}
                onChange={(e) => setGeneration(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter monthly generation"
              />
            </div>
              <input
                type="number"
                value={greenPercentage}
                onChange={(e) => setGreenPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter green energy percentage"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Results</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Savings</p>
              <p className="text-xl font-bold text-green-600">
                ${financials.monthlySavings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Carbon Reduction</p>
              <p className="text-xl font-bold text-blue-600">
                {carbonMetrics.carbonReduction.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-xl font-bold text-purple-600">
                {financials.roi.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CalculatorPanel;