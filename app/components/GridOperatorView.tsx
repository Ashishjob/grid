'use client';

import React, { useState } from 'react';
import { Battery, Calculator, Globe, Share2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TimeSeriesData {
  name: string;
  consumption: number;
  generation: number;
  returned: number;
}

interface CalculatorData {
  carbonSaved: number;
  financialSavings: number;
  energyReturned: number;
  communityParticipation: number;
}

const GridOperatorView = () => {
  const [energyData] = useState<TimeSeriesData[]>([
    { name: '00:00', consumption: 240, generation: 0, returned: 40 },
    { name: '04:00', consumption: 139, generation: 50, returned: 30 },
    { name: '08:00', consumption: 380, generation: 400, returned: 120 },
    { name: '12:00', consumption: 430, generation: 500, returned: 170 },
    { name: '16:00', consumption: 500, generation: 450, returned: 150 },
    { name: '20:00', consumption: 380, generation: 100, returned: 20 }
  ]);

  const [calculatorData] = useState<CalculatorData>({
    carbonSaved: 45.2,
    financialSavings: 320,
    energyReturned: 150,
    communityParticipation: 85
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Grid Performance Metrics</h2>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2">
              <Globe className="text-green-600" />
              <span className="text-xl font-semibold">{calculatorData.carbonSaved}mt</span>
            </div>
            <p className="text-sm text-gray-600">Carbon Saved</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2">
              <Calculator className="text-blue-600" />
              <span className="text-xl font-semibold">${calculatorData.financialSavings}</span>
            </div>
            <p className="text-sm text-gray-600">Financial Savings</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2">
              <Battery className="text-purple-600" />
              <span className="text-xl font-semibold">{calculatorData.energyReturned} MWh</span>
            </div>
            <p className="text-sm text-gray-600">Energy Returned</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2">
              <Share2 className="text-orange-600" />
              <span className="text-xl font-semibold">{calculatorData.communityParticipation}%</span>
            </div>
            <p className="text-sm text-gray-600">Community Participation</p>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Energy Flow Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="consumption" stroke="#059669" name="Consumption" />
                  <Line type="monotone" dataKey="generation" stroke="#0284c7" name="Generation" />
                  <Line type="monotone" dataKey="returned" stroke="#7c3aed" name="Returned to Grid" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Grid Return Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="returned" fill="#7c3aed" name="Energy Returned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridOperatorView;