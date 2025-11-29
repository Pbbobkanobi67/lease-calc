import { useState, useMemo } from 'react';
import { LeaseInputs, LeaseCalculation } from '@/types';

const defaultInputs: LeaseInputs = {
  msrp: 45000,
  sellingPrice: 43000,
  downPayment: 2000,
  tradeInValue: 0,
  tradeInPayoff: 0,
  rebates: 0,
  residualPercent: 55,
  moneyFactor: 0.00125,
  term: 36,
  acquisitionFee: 895,
  docFee: 499,
  taxRate: 7.75,
};

export function useLeaseCalculator(initialInputs?: Partial<LeaseInputs>) {
  const [inputs, setInputs] = useState<LeaseInputs>({
    ...defaultInputs,
    ...initialInputs,
  });

  const calculation = useMemo<LeaseCalculation>(() => {
    const residualValue = inputs.msrp * (inputs.residualPercent / 100);
    const netTradeIn = inputs.tradeInValue - inputs.tradeInPayoff;
    const grossCapCost = inputs.sellingPrice + inputs.acquisitionFee + inputs.docFee;
    const capCostReduction = inputs.downPayment + Math.max(0, netTradeIn) + inputs.rebates;
    const adjustedCapCost = grossCapCost - capCostReduction;

    // Add negative equity to cap cost if trade-in is underwater
    const adjustedCapCostWithNegEquity = netTradeIn < 0 
      ? adjustedCapCost + Math.abs(netTradeIn) 
      : adjustedCapCost;

    const depreciation = (adjustedCapCostWithNegEquity - residualValue) / inputs.term;
    const rentCharge = (adjustedCapCostWithNegEquity + residualValue) * inputs.moneyFactor;
    const basePayment = depreciation + rentCharge;
    const monthlyTax = basePayment * (inputs.taxRate / 100);
    const monthlyPayment = basePayment + monthlyTax;

    // Drive-off typically includes first month, acquisition fee, doc fee, registration
    const driveOff = inputs.downPayment + monthlyPayment + inputs.acquisitionFee + inputs.docFee;
    const totalCost = (monthlyPayment * inputs.term) + inputs.downPayment;
    const effectiveAPR = inputs.moneyFactor * 2400;

    return {
      ...inputs,
      residualValue,
      grossCapCost,
      capCostReduction,
      adjustedCapCost: adjustedCapCostWithNegEquity,
      depreciation,
      rentCharge,
      basepayment: basePayment,
      monthlyTax,
      monthlyPayment,
      driveOff,
      totalCost,
      effectiveAPR,
    };
  }, [inputs]);

  const updateInput = <K extends keyof LeaseInputs>(key: K, value: LeaseInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setInputs(defaultInputs);

  return { inputs, setInputs, updateInput, calculation, reset };
}
