'use client'

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Battery, Calculator, Globe } from 'lucide-react';

import { ZipCodeData, EnergyData } from './types';

interface PowerShareDashboardProps {
  customData: EnergyData[] | null;
  zipData: ZipCodeData | null;
}

const PowerShareDashboard: React.FC<PowerShareDashboardProps> = ({  }) => {
  type Scale = 'micro' | 'meso' | 'macro';
  const [systemScale, setSystemScale] = useState<Scale>('micro');
  const [viewType, setViewType] = useState('community');

  const energyData: Record<Scale, { name: string; consumption: number; generation: number; returned: number; }[]> = {
    micro: [
      { name: '00:00', consumption: 240, generation: 0, returned: 40 },
      { name: '04:00', consumption: 139, generation: 50, returned: 30 },
      { name: '08:00', consumption: 380, generation: 400, returned: 120 },
      { name: '12:00', consumption: 430, generation: 500, returned: 170 },
      { name: '16:00', consumption: 500, generation: 450, returned: 150 },
      { name: '20:00', consumption: 380, generation: 100, returned: 20 },
    ],
    meso: [
      { name: 'Mon', consumption: 2400, generation: 2800, returned: 400 },
      { name: 'Tue', consumption: 2100, generation: 2600, returned: 500 },
      { name: 'Wed', consumption: 2800, generation: 3000, returned: 200 },
      { name: 'Thu', consumption: 2300, generation: 2700, returned: 400 },
      { name: 'Fri', consumption: 2600, generation: 2900, returned: 300 },
    ],
    macro: [
      { name: 'Jan', consumption: 75000, generation: 82000, returned: 7000 },
      { name: 'Feb', consumption: 68000, generation: 75000, returned: 7000 },
      { name: 'Mar', consumption: 72000, generation: 80000, returned: 8000 },
      { name: 'Apr', consumption: 70000, generation: 78000, returned: 8000 },
    ]
  };

  const calculatorData = {
    carbonSaved: 45.2, // metric tons
    financialSavings: 320, // dollars
    energyReturned: 150, // MWh
    communityParticipation: 85 // percentage
  };

  const ScaleSelector = () => (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-sm font-medium">System Scale:</span>
      <label htmlFor="system-scale" className="text-sm font-medium">System Scale:</label>
      <select 
        id="system-scale"
        value={systemScale} 
        onChange={(e) => setSystemScale(e.target.value as Scale)}
        className="rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="micro">Micro (Household/Block)</option>
        <option value="meso">Meso (Neighborhood)</option>
        <option value="macro">Macro (City/Region)</option>
      </select>
    </div>
  );

  const ViewToggle = () => (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setViewType('community')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          viewType === 'community'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Community View
      </button>
      <button
        onClick={() => setViewType('grid')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          viewType === 'grid'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Grid Operator View
      </button>
    </div>
  );

  const MetricsCard = ({ icon: Icon, value, label, textColor = "text-green-600" }: { icon: React.ComponentType<{ className?: string }>, value: string, label: string, textColor?: string }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${textColor}`} />
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <p className="text-sm text-gray-600 mt-2">{label}</p>
    </div>
  );

  const EnergyFlow = () => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">PowerShare Energy Flow</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={energyData[systemScale]}>
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
  );

  const GridReturnAnalysis = () => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mt-6">
      <h2 className="text-xl font-bold mb-4">Grid Return Analysis</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={energyData[systemScale]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="returned" fill="#7c3aed" name="Energy Returned" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">PowerShare Dashboard</h1>
          <ViewToggle />
        </div>

        <ScaleSelector />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard 
            icon={Globe}
            value={`${calculatorData.carbonSaved}mt`}
            label="Carbon Saved"
            textColor="text-green-600"
          />
          <MetricsCard 
            icon={Calculator}
            value={`$${calculatorData.financialSavings}`}
            label="Average Monthly Savings"
            textColor="text-blue-600"
          />
          <MetricsCard 
            icon={Battery}
            value={`${calculatorData.energyReturned} MWh`}
            label="Energy Returned to Grid"
            textColor="text-purple-600"
          />
          <MetricsCard 
            icon={Users}
            value={`${calculatorData.communityParticipation}%`}
            label="Community Participation"
            textColor="text-orange-600"
          />
        </div>

        <EnergyFlow />
        
        {viewType === 'grid' && <GridReturnAnalysis />}
      </div>
    </div>
  );
};

export default PowerShareDashboard;