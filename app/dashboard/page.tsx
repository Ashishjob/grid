'use client'

import React, { useState } from 'react';
import ZipCodeSearch  from '../components/ZipCodeSearch';
import FileUpload  from '../components/FileUpload';
import CalculatorPanel  from '../components/CalculatorPanel';
import PowerShareDashboard from '../page';
import { ZipCodeData, EnergyData } from '../types';

const DashboardPage = () => {
  const [zipData, setZipData] = useState<ZipCodeData | null>(null);
  const [customEnergyData, setCustomEnergyData] = useState<EnergyData[] | null>(null);

  const handleZipSearch = (data: ZipCodeData) => {
    setZipData(data);
  };

  const handleFileUpload = (data: EnergyData[]) => {
    setCustomEnergyData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ZipCodeSearch onSearch={handleZipSearch} />
          <FileUpload onUpload={handleFileUpload} />
        </div>

        {zipData && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Area Analysis: {zipData.zipCode}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Solar Potential</p>
                <p className="text-xl font-bold text-green-600">
                  {zipData.solarPotential.toFixed(1)} kWh/m²/day
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Community Participation</p>
                <p className="text-xl font-bold text-purple-600">
                  {zipData.communityParticipation.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <CalculatorPanel />
        
        <PowerShareDashboard 
          customData={customEnergyData}
          zipData={zipData}
        />
      </div>
    </div>
  );
};

export default DashboardPage;