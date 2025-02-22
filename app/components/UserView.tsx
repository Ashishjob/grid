'use client';

import React, { useState, useEffect } from 'react';
import { Battery, User, Zap, ZapOff, AlertCircle, RefreshCw } from 'lucide-react';

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

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const connectWebSocket = () => {
    setWsStatus({ status: 'connecting' });
    
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      setWsStatus({ 
        status: 'connected',
        message: 'Connected to Arduino' 
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEnergyData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to parse Arduino data:', error);
        setWsStatus({ 
          status: 'error', 
          message: 'Invalid data received from Arduino' 
        });
      }
    };

    ws.onerror = () => {
      setWsStatus({ 
        status: 'error', 
        message: 'Connection failed. Is the Arduino bridge running?' 
      });
    };

    ws.onclose = () => {
      setWsStatus({ 
        status: 'error', 
        message: 'Connection lost. Is the Arduino connected?' 
      });
    };

    return ws;
  };

  useEffect(() => {
    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout;

    const connect = () => {
      ws = connectWebSocket();
    };

    connect();

    // Attempt to reconnect every 5 seconds if connection fails
    reconnectInterval = setInterval(() => {
      if (wsStatus.status === 'error') {
        console.log('Attempting to reconnect...');
        if (ws) {
          ws.close();
        }
        connect();
      }
    }, 5000);

    return () => {
      if (ws) {
        ws.close();
      }
      clearInterval(reconnectInterval);
    };
  }, []);

  const handleManualReconnect = () => {
    setWsStatus({ status: 'connecting' });
    const ws = connectWebSocket();
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return 'text-green-500';
    if (level >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Connection Status with Manual Reconnect */}
      <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
        wsStatus.status === 'connecting' 
          ? 'bg-yellow-50 text-yellow-700' 
          : wsStatus.status === 'connected'
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      }`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{wsStatus.message || 'Connecting to Arduino...'}</span>
        </div>
        {wsStatus.status === 'error' && (
          <button
            onClick={handleManualReconnect}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/50 hover:bg-white/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect
          </button>
        )}
      </div>

      {/* Last Update Timestamp */}
      {lastUpdate && wsStatus.status === 'connected' && (
        <div className="mb-4 text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
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