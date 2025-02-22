'use client';

import React, { useState, useEffect } from 'react';
import { Battery, User, Zap, ZapOff, AlertCircle } from 'lucide-react';

interface EnergyData {
  id: string;
  currentProduction: number;
  currentConsumption: number;
  batteryLevel: number;
  donateEnabled: boolean;
}

interface WebSocketStatus {
  status: 'connecting' | 'connected' | 'error';
  message?: string;
}

const UserView = () => {
  const [energyData, setEnergyData] = useState<EnergyData>({
    id: '',
    currentProduction: 0,
    currentConsumption: 0,
    batteryLevel: 0,
    donateEnabled: false
  });

  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({
    status: 'connecting'
  });

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      setWsStatus({ status: 'connecting' });
      
      try {
        ws = new WebSocket('ws://localhost:8765');

        ws.onopen = () => {
          setWsStatus({ status: 'connected' });
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setEnergyData(data);
          } catch (error) {
            console.error('Failed to parse message:', error);
            setWsStatus({ 
              status: 'error', 
              message: 'Failed to parse sensor data' 
            });
          }
        };

        ws.onerror = () => {
          setWsStatus({ 
            status: 'error', 
            message: 'Connection to sensor failed' 
          });
        };

        ws.onclose = () => {
          setWsStatus({ 
            status: 'error', 
            message: 'Connection lost. Reconnecting...' 
          });
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };

      } catch (error) {
        setWsStatus({ 
          status: 'error', 
          message: 'Failed to connect to sensor' 
        });
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const getBatteryColor = (level: number) => {
    if (level >= 70) return 'text-green-500';
    if (level >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {wsStatus.status !== 'connected' && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          wsStatus.status === 'connecting' 
            ? 'bg-yellow-50 text-yellow-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span>{wsStatus.message || 'Connecting to sensor...'}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User className="text-gray-600" />
            <h2 className="text-xl font-bold">Home Energy Monitor: {energyData.id}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Production Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-semibold">Production</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{energyData.currentProduction}W</div>
            </div>
          </div>

          {/* Consumption Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <ZapOff className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Consumption</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{energyData.currentConsumption}W</div>
            </div>
          </div>

          {/* Battery Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <Battery className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Battery</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{energyData.batteryLevel}%</div>
            </div>
          </div>
        </div>

        {/* Battery Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Battery Status</h3>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getBatteryColor(energyData.batteryLevel).replace('text-', 'bg-')}`}
              style={{ width: `${energyData.batteryLevel}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-900">
                {energyData.batteryLevel}%
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-600">0%</span>
            <span className="text-sm text-gray-600">100%</span>
          </div>
        </div>

        {/* Contribution Status */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Community Contribution Status</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${
                energyData.donateEnabled ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium">
                {energyData.donateEnabled ? 'Contributing to Community' : 'Not Contributing'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;