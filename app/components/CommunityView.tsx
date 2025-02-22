'use client';

import React, { useState } from 'react';
import { Battery, Power, Share2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface House {
  id: string;
  currentProduction: number;
  currentConsumption: number;
  batteryLevel: number;
  donateEnabled: boolean;
  owner: string;
}

const CommunityView = () => {
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);
  const [houses] = useState<House[]>([
    { id: "House1", currentProduction: 500, currentConsumption: 300, batteryLevel: 80, donateEnabled: true, owner: "user123" },
    { id: "House2", currentProduction: 400, currentConsumption: 450, batteryLevel: 60, donateEnabled: false, owner: "user456" },
    { id: "House3", currentProduction: 600, currentConsumption: 200, batteryLevel: 90, donateEnabled: true, owner: "user789" },
    { id: "House4", currentProduction: 300, currentConsumption: 350, batteryLevel: 40, donateEnabled: false, owner: "user101" },
  ]);

  const HouseIcon = ({ house }: { house: House }) => {
    const netEnergy = house.currentProduction - house.currentConsumption;
    const isHovered = hoveredHouse === house.id;

    return (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredHouse(house.id)}
        onMouseLeave={() => setHoveredHouse(null)}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-32 h-32 transition-transform duration-200 ease-in-out transform hover:scale-105"
        >
          {/* House base */}
          <path
            d="M 20 50 L 50 20 L 80 50 L 80 90 L 20 90 Z"
            fill={netEnergy > 0 ? '#d1fae5' : '#fee2e2'}
            stroke={house.donateEnabled ? '#059669' : '#6b7280'}
            strokeWidth="2"
          />
          {/* Roof */}
          <path
            d="M 50 20 L 80 50 L 20 50 Z"
            fill={house.donateEnabled ? '#059669' : '#6b7280'}
            strokeWidth="2"
          />
          {/* Battery indicator */}
          <rect
            x="35"
            y="60"
            width="30"
            height="8"
            fill="#e5e7eb"
          />
          <rect
            x="35"
            y="60"
            width={house.batteryLevel * 0.3}
            height="8"
            fill={house.batteryLevel > 70 ? '#10b981' : house.batteryLevel > 40 ? '#f59e0b' : '#ef4444'}
          />
          
          {/* Energy flow indicators */}
          {netEnergy > 0 && (
            <g className="animate-pulse">
              <ArrowUpRight 
                className="text-green-500" 
                size={16}
                x="70"
                y="30"
              />
            </g>
          )}
          {netEnergy < 0 && (
            <g className="animate-pulse">
              <ArrowDownRight 
                className="text-red-500"
                size={16}
                x="70"
                y="30"
              />
            </g>
          )}
        </svg>

        {/* Hover details */}
        {isHovered && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full w-48 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="text-sm">
              <div className="font-semibold mb-2">House {house.id.slice(-1)}</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Production:</span>
                  <span>{house.currentProduction}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consumption:</span>
                  <span>{house.currentConsumption}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery:</span>
                  <span>{house.batteryLevel}%</span>
                </div>
                <div className={`flex justify-between ${house.donateEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                  <span>Status:</span>
                  <span>{house.donateEnabled ? 'Contributing' : 'Not Contributing'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Community Energy Network</h2>
          <div className="flex items-center gap-2">
            <Share2 className="text-purple-500" />
            <span className="text-lg font-semibold">
              {houses.filter(h => h.donateEnabled).length} Contributing Homes
            </span>
          </div>
        </div>

        {/* Houses grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
          {houses.map(house => (
            <HouseIcon key={house.id} house={house} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-600"></div>
            <span>Net Producer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-gray-400"></div>
            <span>Net Consumer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-600"></div>
            <span>Contributing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400"></div>
            <span>Not Contributing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;