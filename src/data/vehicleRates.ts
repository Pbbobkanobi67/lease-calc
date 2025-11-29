// Money Factor and Residual Value Database
// Last updated: November 2025
// Sources: Community reported rates, manufacturer programs

export interface VehicleRate {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  msrpRange: { min: number; max: number };
  terms: TermRate[];
  region: string;
  lastUpdated: string;
  source: 'manufacturer' | 'community' | 'dealer';
  verified: boolean;
}

export interface TermRate {
  months: number;
  moneyFactor: number;
  residualPercent: number;
  mileage: number; // annual mileage allowance
}

export const vehicleRates: VehicleRate[] = [
  // BMW
  {
    id: 'bmw-3-series-2025',
    make: 'BMW',
    model: '3 Series',
    year: 2025,
    trim: '330i',
    msrpRange: { min: 44900, max: 48000 },
    terms: [
      { months: 36, moneyFactor: 0.00195, residualPercent: 57, mileage: 10000 },
      { months: 36, moneyFactor: 0.00195, residualPercent: 55, mileage: 12000 },
      { months: 36, moneyFactor: 0.00195, residualPercent: 53, mileage: 15000 },
      { months: 24, moneyFactor: 0.00195, residualPercent: 65, mileage: 10000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'bmw-x3-2025',
    make: 'BMW',
    model: 'X3',
    year: 2025,
    trim: 'xDrive30i',
    msrpRange: { min: 49900, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 58, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 56, mileage: 12000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 54, mileage: 15000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'bmw-x5-2025',
    make: 'BMW',
    model: 'X5',
    year: 2025,
    trim: 'xDrive40i',
    msrpRange: { min: 66800, max: 75000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  
  // Mercedes-Benz
  {
    id: 'mercedes-c-class-2025',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2025,
    trim: 'C 300',
    msrpRange: { min: 47550, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00188, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00188, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'mercedes-gle-2025',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2025,
    trim: 'GLE 350',
    msrpRange: { min: 61150, max: 70000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Audi
  {
    id: 'audi-a4-2025',
    make: 'Audi',
    model: 'A4',
    year: 2025,
    trim: '40 TFSI',
    msrpRange: { min: 42200, max: 48000 },
    terms: [
      { months: 36, moneyFactor: 0.00155, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00155, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'audi-q5-2025',
    make: 'Audi',
    model: 'Q5',
    year: 2025,
    trim: '40 TFSI Premium',
    msrpRange: { min: 46900, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00145, residualPercent: 56, mileage: 10000 },
      { months: 36, moneyFactor: 0.00145, residualPercent: 54, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },

  // Lexus
  {
    id: 'lexus-es-2025',
    make: 'Lexus',
    model: 'ES',
    year: 2025,
    trim: 'ES 350',
    msrpRange: { min: 43190, max: 50000 },
    terms: [
      { months: 36, moneyFactor: 0.00125, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00125, residualPercent: 53, mileage: 12000 },
      { months: 36, moneyFactor: 0.00125, residualPercent: 51, mileage: 15000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'lexus-rx-2025',
    make: 'Lexus',
    model: 'RX',
    year: 2025,
    trim: 'RX 350',
    msrpRange: { min: 50700, max: 58000 },
    terms: [
      { months: 36, moneyFactor: 0.00115, residualPercent: 58, mileage: 10000 },
      { months: 36, moneyFactor: 0.00115, residualPercent: 56, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },

  // Toyota
  {
    id: 'toyota-camry-2025',
    make: 'Toyota',
    model: 'Camry',
    year: 2025,
    trim: 'LE',
    msrpRange: { min: 28400, max: 35000 },
    terms: [
      { months: 36, moneyFactor: 0.00110, residualPercent: 57, mileage: 10000 },
      { months: 36, moneyFactor: 0.00110, residualPercent: 55, mileage: 12000 },
      { months: 36, moneyFactor: 0.00110, residualPercent: 53, mileage: 15000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'toyota-rav4-2025',
    make: 'Toyota',
    model: 'RAV4',
    year: 2025,
    trim: 'XLE',
    msrpRange: { min: 32525, max: 40000 },
    terms: [
      { months: 36, moneyFactor: 0.00095, residualPercent: 62, mileage: 10000 },
      { months: 36, moneyFactor: 0.00095, residualPercent: 60, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'toyota-highlander-2025',
    make: 'Toyota',
    model: 'Highlander',
    year: 2025,
    trim: 'XLE',
    msrpRange: { min: 43070, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00105, residualPercent: 56, mileage: 10000 },
      { months: 36, moneyFactor: 0.00105, residualPercent: 54, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },

  // Honda
  {
    id: 'honda-accord-2025',
    make: 'Honda',
    model: 'Accord',
    year: 2025,
    trim: 'EX',
    msrpRange: { min: 31505, max: 38000 },
    terms: [
      { months: 36, moneyFactor: 0.00125, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00125, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'honda-crv-2025',
    make: 'Honda',
    model: 'CR-V',
    year: 2025,
    trim: 'EX-L',
    msrpRange: { min: 36400, max: 42000 },
    terms: [
      { months: 36, moneyFactor: 0.00115, residualPercent: 60, mileage: 10000 },
      { months: 36, moneyFactor: 0.00115, residualPercent: 58, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'honda-pilot-2025',
    make: 'Honda',
    model: 'Pilot',
    year: 2025,
    trim: 'EX-L',
    msrpRange: { min: 43750, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00135, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00135, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },

  // Hyundai
  {
    id: 'hyundai-tucson-2025',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2025,
    trim: 'SEL',
    msrpRange: { min: 32250, max: 38000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'hyundai-palisade-2025',
    make: 'Hyundai',
    model: 'Palisade',
    year: 2025,
    trim: 'SEL',
    msrpRange: { min: 40550, max: 50000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Kia
  {
    id: 'kia-telluride-2025',
    make: 'Kia',
    model: 'Telluride',
    year: 2025,
    trim: 'LX',
    msrpRange: { min: 37665, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00195, residualPercent: 56, mileage: 10000 },
      { months: 36, moneyFactor: 0.00195, residualPercent: 54, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'kia-sportage-2025',
    make: 'Kia',
    model: 'Sportage',
    year: 2025,
    trim: 'LX',
    msrpRange: { min: 32090, max: 40000 },
    terms: [
      { months: 36, moneyFactor: 0.00205, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00205, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Ford
  {
    id: 'ford-f150-2025',
    make: 'Ford',
    model: 'F-150',
    year: 2025,
    trim: 'XLT',
    msrpRange: { min: 45000, max: 65000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 58, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 56, mileage: 12000 },
      { months: 24, moneyFactor: 0.00165, residualPercent: 68, mileage: 10000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'ford-explorer-2025',
    make: 'Ford',
    model: 'Explorer',
    year: 2025,
    trim: 'XLT',
    msrpRange: { min: 40000, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Chevrolet
  {
    id: 'chevy-equinox-2025',
    make: 'Chevrolet',
    model: 'Equinox',
    year: 2025,
    trim: 'LT',
    msrpRange: { min: 32800, max: 38000 },
    terms: [
      { months: 36, moneyFactor: 0.00145, residualPercent: 50, mileage: 10000 },
      { months: 36, moneyFactor: 0.00145, residualPercent: 48, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'chevy-tahoe-2025',
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2025,
    trim: 'LT',
    msrpRange: { min: 59800, max: 75000 },
    terms: [
      { months: 36, moneyFactor: 0.00165, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00165, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Tesla
  {
    id: 'tesla-model3-2025',
    make: 'Tesla',
    model: 'Model 3',
    year: 2025,
    trim: 'Long Range',
    msrpRange: { min: 42490, max: 50000 },
    terms: [
      { months: 36, moneyFactor: 0.00275, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00275, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'tesla-modely-2025',
    make: 'Tesla',
    model: 'Model Y',
    year: 2025,
    trim: 'Long Range',
    msrpRange: { min: 47490, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00275, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00275, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Subaru
  {
    id: 'subaru-outback-2025',
    make: 'Subaru',
    model: 'Outback',
    year: 2025,
    trim: 'Premium',
    msrpRange: { min: 34495, max: 42000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'subaru-forester-2025',
    make: 'Subaru',
    model: 'Forester',
    year: 2025,
    trim: 'Premium',
    msrpRange: { min: 34595, max: 40000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 57, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 55, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Mazda
  {
    id: 'mazda-cx5-2025',
    make: 'Mazda',
    model: 'CX-5',
    year: 2025,
    trim: 'Select',
    msrpRange: { min: 30300, max: 40000 },
    terms: [
      { months: 36, moneyFactor: 0.00125, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00125, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'mazda-cx90-2025',
    make: 'Mazda',
    model: 'CX-90',
    year: 2025,
    trim: 'Select',
    msrpRange: { min: 40970, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00145, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00145, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Acura
  {
    id: 'acura-mdx-2025',
    make: 'Acura',
    model: 'MDX',
    year: 2025,
    trim: 'Base',
    msrpRange: { min: 51550, max: 62000 },
    terms: [
      { months: 36, moneyFactor: 0.00145, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00145, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },
  {
    id: 'acura-rdx-2025',
    make: 'Acura',
    model: 'RDX',
    year: 2025,
    trim: 'Base',
    msrpRange: { min: 43950, max: 52000 },
    terms: [
      { months: 36, moneyFactor: 0.00135, residualPercent: 56, mileage: 10000 },
      { months: 36, moneyFactor: 0.00135, residualPercent: 54, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: true,
  },

  // Infiniti
  {
    id: 'infiniti-qx60-2025',
    make: 'Infiniti',
    model: 'QX60',
    year: 2025,
    trim: 'Pure',
    msrpRange: { min: 51500, max: 62000 },
    terms: [
      { months: 36, moneyFactor: 0.00215, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00215, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Volvo
  {
    id: 'volvo-xc60-2025',
    make: 'Volvo',
    model: 'XC60',
    year: 2025,
    trim: 'Core',
    msrpRange: { min: 47500, max: 58000 },
    terms: [
      { months: 36, moneyFactor: 0.00195, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00195, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'volvo-xc90-2025',
    make: 'Volvo',
    model: 'XC90',
    year: 2025,
    trim: 'Core',
    msrpRange: { min: 58900, max: 72000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 50, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 48, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Genesis
  {
    id: 'genesis-gv70-2025',
    make: 'Genesis',
    model: 'GV70',
    year: 2025,
    trim: '2.5T Standard',
    msrpRange: { min: 44550, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00165, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00165, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'genesis-gv80-2025',
    make: 'Genesis',
    model: 'GV80',
    year: 2025,
    trim: '2.5T Standard',
    msrpRange: { min: 57550, max: 72000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Jeep
  {
    id: 'jeep-grandcherokee-2025',
    make: 'Jeep',
    model: 'Grand Cherokee',
    year: 2025,
    trim: 'Laredo',
    msrpRange: { min: 42955, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00225, residualPercent: 51, mileage: 10000 },
      { months: 36, moneyFactor: 0.00225, residualPercent: 49, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'jeep-wrangler-2025',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2025,
    trim: 'Sport',
    msrpRange: { min: 33690, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00235, residualPercent: 62, mileage: 10000 },
      { months: 36, moneyFactor: 0.00235, residualPercent: 60, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Ram
  {
    id: 'ram-1500-2025',
    make: 'Ram',
    model: '1500',
    year: 2025,
    trim: 'Big Horn',
    msrpRange: { min: 45000, max: 65000 },
    terms: [
      { months: 36, moneyFactor: 0.00195, residualPercent: 55, mileage: 10000 },
      { months: 36, moneyFactor: 0.00195, residualPercent: 53, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Nissan
  {
    id: 'nissan-rogue-2025',
    make: 'Nissan',
    model: 'Rogue',
    year: 2025,
    trim: 'SV',
    msrpRange: { min: 32760, max: 40000 },
    terms: [
      { months: 36, moneyFactor: 0.00185, residualPercent: 54, mileage: 10000 },
      { months: 36, moneyFactor: 0.00185, residualPercent: 52, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'nissan-murano-2025',
    make: 'Nissan',
    model: 'Murano',
    year: 2025,
    trim: 'SV',
    msrpRange: { min: 40930, max: 50000 },
    terms: [
      { months: 36, moneyFactor: 0.00175, residualPercent: 50, mileage: 10000 },
      { months: 36, moneyFactor: 0.00175, residualPercent: 48, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },

  // Volkswagen
  {
    id: 'vw-tiguan-2025',
    make: 'Volkswagen',
    model: 'Tiguan',
    year: 2025,
    trim: 'S',
    msrpRange: { min: 31990, max: 42000 },
    terms: [
      { months: 36, moneyFactor: 0.00155, residualPercent: 52, mileage: 10000 },
      { months: 36, moneyFactor: 0.00155, residualPercent: 50, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
  {
    id: 'vw-atlas-2025',
    make: 'Volkswagen',
    model: 'Atlas',
    year: 2025,
    trim: 'SE',
    msrpRange: { min: 42250, max: 55000 },
    terms: [
      { months: 36, moneyFactor: 0.00165, residualPercent: 50, mileage: 10000 },
      { months: 36, moneyFactor: 0.00165, residualPercent: 48, mileage: 12000 },
    ],
    region: 'National',
    lastUpdated: '2025-11-01',
    source: 'community',
    verified: false,
  },
];

// Helper functions
export function getMakes(): string[] {
  const makes = [...new Set(vehicleRates.map(v => v.make))];
  return makes.sort();
}

export function getModelsByMake(make: string): string[] {
  const models = [...new Set(vehicleRates.filter(v => v.make === make).map(v => v.model))];
  return models.sort();
}

export function getVehicleRate(make: string, model: string): VehicleRate | undefined {
  return vehicleRates.find(v => v.make === make && v.model === model);
}

export function searchVehicles(query: string): VehicleRate[] {
  const lowerQuery = query.toLowerCase();
  return vehicleRates.filter(v => 
    v.make.toLowerCase().includes(lowerQuery) ||
    v.model.toLowerCase().includes(lowerQuery) ||
    `${v.make} ${v.model}`.toLowerCase().includes(lowerQuery)
  );
}
