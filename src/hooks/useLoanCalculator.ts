import { useState, useMemo } from 'react';
import { LoanInputs, LoanCalculation } from '@/types';

const defaultInputs: LoanInputs = {
  vehiclePrice: 43000,
  downPayment: 5000,
  tradeInValue: 0,
  tradeInPayoff: 0,
  rebates: 0,
  interestRate: 6.5,
  term: 60,
  taxRate: 7.75,
  docFee: 499,
  titleFee: 150,
};

export function useLoanCalculator(initialInputs?: Partial<LoanInputs>) {
  const [inputs, setInputs] = useState<LoanInputs>({
    ...defaultInputs,
    ...initialInputs,
  });

  const calculation = useMemo<LoanCalculation>(() => {
    const netTradeIn = inputs.tradeInValue - inputs.tradeInPayoff;
    
    // Calculate taxable amount (vehicle price minus trade-in in most states)
    const taxableAmount = Math.max(0, inputs.vehiclePrice - inputs.tradeInValue);
    const salesTax = taxableAmount * (inputs.taxRate / 100);
    
    const totalFees = inputs.docFee + inputs.titleFee;
    
    // Amount financed = price + tax + fees - down payment - trade equity - rebates
    const totalPrice = inputs.vehiclePrice + salesTax + totalFees;
    const totalCredits = inputs.downPayment + Math.max(0, netTradeIn) + inputs.rebates;
    let amountFinanced = totalPrice - totalCredits;
    
    // Add negative equity if underwater
    if (netTradeIn < 0) {
      amountFinanced += Math.abs(netTradeIn);
    }

    // Monthly payment calculation using amortization formula
    const monthlyRate = inputs.interestRate / 100 / 12;
    let monthlyPayment: number;
    
    if (monthlyRate === 0) {
      monthlyPayment = amountFinanced / inputs.term;
    } else {
      monthlyPayment = amountFinanced * 
        (monthlyRate * Math.pow(1 + monthlyRate, inputs.term)) / 
        (Math.pow(1 + monthlyRate, inputs.term) - 1);
    }

    const totalPaid = monthlyPayment * inputs.term;
    const totalInterest = totalPaid - amountFinanced;
    const totalCost = totalPaid + inputs.downPayment;

    return {
      ...inputs,
      taxableAmount,
      salesTax,
      totalFees,
      amountFinanced,
      monthlyPayment,
      totalInterest,
      totalCost,
    };
  }, [inputs]);

  const updateInput = <K extends keyof LoanInputs>(key: K, value: LoanInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setInputs(defaultInputs);

  return { inputs, setInputs, updateInput, calculation, reset };
}
