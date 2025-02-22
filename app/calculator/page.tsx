"use client";

import React from "react";
import CalculatorPanel from "../components/CalculatorPanel";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Calculator</h1>
        <CalculatorPanel />
      </div>
    </div>
  );
};

export default Calculator;
