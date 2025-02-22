export interface EnergyData {
  name: string;
  consumption: number;
  generation: number;
  returned: number;
}

export type Scale = 'micro' | 'meso' | 'macro';

export interface ZipCodeData {
  zipCode: string;
  solarPotential: number;
  averageUsage: number;
  communityParticipation: number;
  location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
}