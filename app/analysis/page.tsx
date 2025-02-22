'use client'

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnalysisPage = () => {
  // This would be populated with actual analysis data from the Gemini API
  const analysisData = {
    roi: {
      years: 7.5,
      percentage: 13.2,
      monthlyData: [
        { month: 'Jan', savings: 150 },
        { month: 'Feb', savings: 165 },
        { month: 'Mar', savings: 180 },
        // ... more data
      ]
    },
    environmental: {
      carbonReduction: 45.2,
      treesEquivalent: 212,
      monthlyImpact: [
        { month: 'Jan', reduction: 3.2 },
        { month: 'Feb', reduction: 3.5 },
        { month: 'Mar', reduction: 3.8 },
        // ... more data
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ROI Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Return on Investment</h2>
            <div className="mb-4">
              <p className="text-3xl font-bold text-green-600">{analysisData.roi.percentage}%</p>
              <p className="text-gray-600">Expected Annual Return</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData.roi.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="savings" stroke="#059669" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Environmental Impact</h2>
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600">
                {analysisData.environmental.carbonReduction} tons
              </p>
              <p className="text-gray-600">Annual Carbon Reduction</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData.environmental.monthlyImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reduction" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;