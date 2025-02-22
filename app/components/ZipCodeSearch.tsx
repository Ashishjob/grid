import React, { useState } from 'react';
import { ZipCodeData } from '../types';

const ZipCodeSearch = ({ onSearch }: { onSearch: (data: ZipCodeData) => void }) => {
  const [zipCode, setZipCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch location data from Zippopotam.us API
  const fetchZipCodeData = async (zipCode: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) {
        throw new Error('Invalid ZIP code or no data found');
      }
      const data = await response.json();
      console.log('Zippopotam.us API Response:', data); // Log the response
      return data;
    } catch (error) {
      setError('Failed to fetch ZIP code data. Please try again.');
      throw error;
    }
  };

  // Convert state name to abbreviation
  const stateToAbbreviation = (stateName: string): string => {
    const states: { [key: string]: string } = {
      Alabama: 'AL',
      Alaska: 'AK',
      Arizona: 'AZ',
      Arkansas: 'AR',
      California: 'CA',
      Colorado: 'CO',
      Connecticut: 'CT',
      Delaware: 'DE',
      Florida: 'FL',
      Georgia: 'GA',
      Hawaii: 'HI',
      Idaho: 'ID',
      Illinois: 'IL',
      Indiana: 'IN',
      Iowa: 'IA',
      Kansas: 'KS',
      Kentucky: 'KY',
      Louisiana: 'LA',
      Maine: 'ME',
      Maryland: 'MD',
      Massachusetts: 'MA',
      Michigan: 'MI',
      Minnesota: 'MN',
      Mississippi: 'MS',
      Missouri: 'MO',
      Montana: 'MT',
      Nebraska: 'NE',
      Nevada: 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      Ohio: 'OH',
      Oklahoma: 'OK',
      Oregon: 'OR',
      Pennsylvania: 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      Tennessee: 'TN',
      Texas: 'TX',
      Utah: 'UT',
      Vermont: 'VT',
      Virginia: 'VA',
      Washington: 'WA',
      'West Virginia': 'WV',
      Wisconsin: 'WI',
      Wyoming: 'WY',
    };
    return states[stateName] || '';
  };

  // Fetch solar potential data from NREL API
  const fetchSolarPotential = async (lat: number, lon: number) => {
    const apiKey = process.env.NEXT_PUBLIC_NREL_API_KEY; // Add your NREL API key to .env
    if (!apiKey) {
      throw new Error('NREL API key is missing');
    }

    try {
      const response = await fetch(
        `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=${apiKey}&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch solar data');
      }
      const data = await response.json();
      return data.outputs.avg_ghi.annual; // Global Horizontal Irradiance (GHI) in kWh/m²/day
    } catch (error) {
      setError('Failed to fetch solar potential data. Please try again.');
      throw error;
    }
  };

  // Fetch average energy usage from EIA API
  const fetchAverageUsage = async (stateAbbreviation: string) => {
    const apiKey = process.env.NEXT_PUBLIC_EIA_API_KEY;
    if (!apiKey) {
      throw new Error('EIA API key is missing');
    }

    try {
      const response = await fetch(
        `https://api.eia.gov/v2/electricity/retail-sales/data?api_key=${apiKey}&frequency=monthly&data[0]=sales&facets[stateid][]=${stateAbbreviation}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch energy usage data');
      }
      const data = await response.json();
      console.log('EIA API Response:', data); // Log the response
      const salesData = data.response.data;
      if (salesData.length > 0) {
        // Calculate average monthly sales (in kWh)
        const totalSales = salesData.reduce((sum: number, entry: { sales: number }) => sum + entry.sales, 0);
        return totalSales / salesData.length;
      }
      // Fallback: Use national average (e.g., 877 kWh/month)
      return 877;
    } catch (error) {
      setError('Failed to fetch average energy usage data. Please try again.');
      throw error;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(''); // Reset error before starting a new search

    try {
      // Step 1: Fetch location data from Zippopotam.us
      const zipData = await fetchZipCodeData(zipCode);
      const { postcode, places } = zipData;
      const { latitude, longitude, state } = places[0];

      // Step 2: Convert state name to abbreviation
      const stateAbbreviation = stateToAbbreviation(state);

      // Step 3: Fetch solar potential from NREL API
      const solarPotential = await fetchSolarPotential(parseFloat(latitude), parseFloat(longitude));

      // Step 4: Fetch average energy usage from EIA API
      const averageUsage = await fetchAverageUsage(stateAbbreviation);

      // Step 5: Construct the final data object
      const mockData: ZipCodeData = {
        zipCode: postcode,
        solarPotential: solarPotential || 0, // Use 0 as fallback if no data
        averageUsage: averageUsage || 0, // Use 0 as fallback if no data
        communityParticipation: Math.random() * 50 + 30, // Mock data for community participation
        location: {
          city: places[0]['place name'],
          state,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      };

      // Pass the data to the parent component
      onSearch(mockData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center mb-6">
      <input
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="Enter ZIP code"
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ZipCodeSearch;