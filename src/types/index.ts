export interface LeaseInputs {
  msrp: number;
  sellingPrice: number;
  downPayment: number;
  tradeInValue: number;
  tradeInPayoff: number;
  rebates: number;
  residualPercent: number;
  moneyFactor: number;
  term: number;
  acquisitionFee: number;
  docFee: number;
  taxRate: number;
}

export interface LeaseCalculation extends LeaseInputs {
  residualValue: number;
  grossCapCost: number;
  capCostReduction: number;
  adjustedCapCost: number;
  depreciation: number;
  rentCharge: number;
  basepayment: number;
  monthlyTax: number;
  monthlyPayment: number;
  driveOff: number;
  totalCost: number;
  effectiveAPR: number;
}

export interface LoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  tradeInPayoff: number;
  rebates: number;
  interestRate: number;
  term: number;
  taxRate: number;
  docFee: number;
  titleFee: number;
}

export interface LoanCalculation extends LoanInputs {
  taxableAmount: number;
  salesTax: number;
  totalFees: number;
  amountFinanced: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export interface MoneyFactorData {
  make: string;
  model: string;
  year: number;
  term: number;
  moneyFactor: number;
  residualPercent: number;
  mileageAllowance: number;
  lastUpdated: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
