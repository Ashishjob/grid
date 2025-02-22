'use client';

import React, { useState } from 'react';
import UserView from './components/UserView';
import CommunityView from './components/CommunityView';
import GridOperatorView from './components/GridOperatorView';

const PowerShareViews = () => {
  const [viewMode, setViewMode] = useState<'user' | 'community' | 'grid'>('user');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-600">PowerShare</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Home
            </button>
            <button
              onClick={() => setViewMode('community')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'community'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Community View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grid Operator
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'user' ? <UserView /> : 
       viewMode === 'community' ? <CommunityView /> : 
       <GridOperatorView />}
    </div>
  );
};

export default PowerShareViews;