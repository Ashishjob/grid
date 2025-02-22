export const calculateFinancials = (consumption: number, generation: number, rate = 0.12) => {
  const savings = (generation - consumption) * rate;
  const roi = (savings * 12) / (20000); // Assuming $20k installation cost
  return {
    monthlySavings: savings,
    annualSavings: savings * 12,
    roi: roi * 100,
    paybackPeriod: 20000 / (savings * 12)
  };
};

export const calculateCarbonFootprint = (consumption: number, greenPercentage: number) => {
  const carbonPerKwh = 0.92; // lbs CO2 per kWh
  const totalCarbon = consumption * carbonPerKwh;
  const savedCarbon = (consumption * (greenPercentage / 100)) * carbonPerKwh;
  return {
    totalCarbon,
    savedCarbon,
    carbonReduction: (savedCarbon / totalCarbon) * 100
  };
};