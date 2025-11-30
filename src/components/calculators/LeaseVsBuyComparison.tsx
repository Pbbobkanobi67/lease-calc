'use client';

import { useState, useMemo } from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { formatCurrency, formatCurrencyDetailed } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Car,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Minus,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ComparisonInputs {
  // Shared inputs
  msrp: number;
  sellingPrice: number;
  downPayment: number;
  tradeInValue: number;
  tradeInPayoff: number;
  rebates: number;
  taxRate: number;
  docFee: number;
  // Lease-specific
  leaseMoneyFactor: number;
  leaseResidualPercent: number;
  leaseTerm: number;
  acquisitionFee: number;
  // Loan-specific
  loanInterestRate: number;
  loanTerm: number;
  titleFee: number;
}

const defaultInputs: ComparisonInputs = {
  msrp: 45000,
  sellingPrice: 43000,
  downPayment: 3000,
  tradeInValue: 0,
  tradeInPayoff: 0,
  rebates: 0,
  taxRate: 7.75,
  docFee: 499,
  leaseMoneyFactor: 0.00125,
  leaseResidualPercent: 55,
  leaseTerm: 36,
  acquisitionFee: 895,
  loanInterestRate: 6.5,
  loanTerm: 60,
  titleFee: 150,
};

export function LeaseVsBuyComparison() {
  const [inputs, setInputs] = useState<ComparisonInputs>(defaultInputs);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  const updateInput = <K extends keyof ComparisonInputs>(key: K, value: ComparisonInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleVehicleSelect = (rate: { moneyFactor: number; residualPercent: number; msrp: number }) => {
    setInputs(prev => ({
      ...prev,
      leaseMoneyFactor: rate.moneyFactor,
      leaseResidualPercent: rate.residualPercent,
      msrp: rate.msrp,
      sellingPrice: rate.msrp,
    }));
  };

  const reset = () => setInputs(defaultInputs);

  // Calculate lease
  const leaseCalc = useMemo(() => {
    const residualValue = inputs.msrp * (inputs.leaseResidualPercent / 100);
    const netTradeIn = inputs.tradeInValue - inputs.tradeInPayoff;
    const grossCapCost = inputs.sellingPrice + inputs.acquisitionFee + inputs.docFee;
    const capCostReduction = inputs.downPayment + Math.max(0, netTradeIn) + inputs.rebates;
    const adjustedCapCost = grossCapCost - capCostReduction + (netTradeIn < 0 ? Math.abs(netTradeIn) : 0);

    const depreciation = (adjustedCapCost - residualValue) / inputs.leaseTerm;
    const rentCharge = (adjustedCapCost + residualValue) * inputs.leaseMoneyFactor;
    const basePayment = depreciation + rentCharge;
    const monthlyTax = basePayment * (inputs.taxRate / 100);
    const monthlyPayment = basePayment + monthlyTax;
    const driveOff = inputs.downPayment + monthlyPayment + inputs.acquisitionFee + inputs.docFee;
    const totalCost = (monthlyPayment * inputs.leaseTerm) + inputs.downPayment;
    const effectiveAPR = inputs.leaseMoneyFactor * 2400;

    return {
      monthlyPayment,
      driveOff,
      totalCost,
      effectiveAPR,
      residualValue,
      term: inputs.leaseTerm,
    };
  }, [inputs]);

  // Calculate loan
  const loanCalc = useMemo(() => {
    const netTradeIn = inputs.tradeInValue - inputs.tradeInPayoff;
    const taxableAmount = Math.max(0, inputs.sellingPrice - inputs.tradeInValue);
    const salesTax = taxableAmount * (inputs.taxRate / 100);
    const totalFees = inputs.docFee + inputs.titleFee;
    const totalPrice = inputs.sellingPrice + salesTax + totalFees;
    const totalCredits = inputs.downPayment + Math.max(0, netTradeIn) + inputs.rebates;
    let amountFinanced = totalPrice - totalCredits;
    if (netTradeIn < 0) amountFinanced += Math.abs(netTradeIn);

    const monthlyRate = inputs.loanInterestRate / 100 / 12;
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = amountFinanced / inputs.loanTerm;
    } else {
      monthlyPayment = amountFinanced *
        (monthlyRate * Math.pow(1 + monthlyRate, inputs.loanTerm)) /
        (Math.pow(1 + monthlyRate, inputs.loanTerm) - 1);
    }

    const totalPaid = monthlyPayment * inputs.loanTerm;
    const totalInterest = totalPaid - amountFinanced;
    const totalCost = totalPaid + inputs.downPayment;
    const driveOff = inputs.downPayment + monthlyPayment + totalFees + salesTax;

    return {
      monthlyPayment,
      driveOff,
      totalCost,
      totalInterest,
      amountFinanced,
      term: inputs.loanTerm,
      vehicleValue: inputs.sellingPrice, // Own the car at end
    };
  }, [inputs]);

  // 3-year cost comparison (for fair comparison, use lease term)
  const threeYearComparison = useMemo(() => {
    const leaseTotal = leaseCalc.totalCost;

    // For loan: calculate how much paid after 3 years + remaining balance
    const monthlyRate = inputs.loanInterestRate / 100 / 12;
    const loanPaymentsIn3Years = Math.min(36, inputs.loanTerm);
    const loanPaidIn3Years = loanCalc.monthlyPayment * loanPaymentsIn3Years + inputs.downPayment;

    // Calculate remaining balance after 3 years
    let remainingBalance = loanCalc.amountFinanced;
    for (let i = 0; i < loanPaymentsIn3Years; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = loanCalc.monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
    }

    // Estimated vehicle value after 3 years (rough depreciation)
    const estimatedValueAfter3Years = inputs.sellingPrice * 0.6; // ~40% depreciation
    const loanEquityAfter3Years = estimatedValueAfter3Years - Math.max(0, remainingBalance);

    return {
      leaseCost: leaseTotal,
      loanPaid: loanPaidIn3Years,
      loanEquity: loanEquityAfter3Years,
      loanNetCost: loanPaidIn3Years - loanEquityAfter3Years,
      vehicleValueAfter3Years: estimatedValueAfter3Years,
    };
  }, [leaseCalc, loanCalc, inputs]);

  // Chart data
  const chartData = [
    {
      name: 'Monthly',
      Lease: leaseCalc.monthlyPayment,
      Finance: loanCalc.monthlyPayment,
    },
  ];

  const costChartData = [
    {
      name: 'Lease',
      'Total Cost': threeYearComparison.leaseCost,
      'Equity': 0,
    },
    {
      name: 'Finance',
      'Total Cost': threeYearComparison.loanPaid,
      'Equity': Math.max(0, threeYearComparison.loanEquity),
    },
  ];

  // Determine recommendation
  const recommendation = useMemo(() => {
    const monthlySavings = loanCalc.monthlyPayment - leaseCalc.monthlyPayment;
    const netCostDiff = threeYearComparison.loanNetCost - threeYearComparison.leaseCost;

    if (monthlySavings > 100 && netCostDiff > 2000) {
      return {
        winner: 'lease' as const,
        reason: `Leasing saves ${formatCurrency(monthlySavings)}/mo and ${formatCurrency(netCostDiff)} over ${inputs.leaseTerm} months`,
      };
    } else if (threeYearComparison.loanEquity > threeYearComparison.leaseCost * 0.3) {
      return {
        winner: 'buy' as const,
        reason: `Buying builds ${formatCurrency(threeYearComparison.loanEquity)} in equity after ${inputs.leaseTerm} months`,
      };
    } else {
      return {
        winner: 'tie' as const,
        reason: 'Both options are comparable - consider your priorities below',
      };
    }
  }, [leaseCalc, loanCalc, threeYearComparison, inputs.leaseTerm]);

  return (
    <div className="space-y-6">
      {/* Side-by-Side Hero Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Lease Card */}
        <div className={`rounded-2xl p-4 text-white ${
          recommendation.winner === 'lease'
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400 ring-offset-2'
            : 'bg-gradient-to-br from-blue-500 to-blue-600'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-100 text-xs font-medium">LEASE</p>
            {recommendation.winner === 'lease' && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Best</span>
            )}
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrencyDetailed(leaseCalc.monthlyPayment)}
          </p>
          <p className="text-blue-200 text-xs">/month</p>
          <div className="mt-3 pt-3 border-t border-blue-400/30 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-200">Drive-Off</span>
              <span className="font-medium">{formatCurrency(leaseCalc.driveOff)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-blue-200">Total ({inputs.leaseTerm}mo)</span>
              <span className="font-medium">{formatCurrency(leaseCalc.totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Finance Card */}
        <div className={`rounded-2xl p-4 text-white ${
          recommendation.winner === 'buy'
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 ring-2 ring-emerald-400 ring-offset-2'
            : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-emerald-100 text-xs font-medium">FINANCE</p>
            {recommendation.winner === 'buy' && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Best</span>
            )}
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrencyDetailed(loanCalc.monthlyPayment)}
          </p>
          <p className="text-emerald-200 text-xs">/month</p>
          <div className="mt-3 pt-3 border-t border-emerald-400/30 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-200">Drive-Off</span>
              <span className="font-medium">{formatCurrency(loanCalc.driveOff)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-emerald-200">Total ({inputs.loanTerm}mo)</span>
              <span className="font-medium">{formatCurrency(loanCalc.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payment Difference */}
      <div className="bg-gray-100 rounded-xl p-4 text-center">
        <p className="text-gray-600 text-sm">Monthly Difference</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(Math.abs(loanCalc.monthlyPayment - leaseCalc.monthlyPayment))}
          <span className="text-sm font-normal text-gray-500 ml-1">
            {loanCalc.monthlyPayment > leaseCalc.monthlyPayment ? 'more to finance' : 'more to lease'}
          </span>
        </p>
      </div>

      {/* Recommendation Banner */}
      <div className={`rounded-xl p-4 ${
        recommendation.winner === 'lease'
          ? 'bg-blue-50 border border-blue-200'
          : recommendation.winner === 'buy'
          ? 'bg-emerald-50 border border-emerald-200'
          : 'bg-purple-50 border border-purple-200'
      }`}>
        <div className="flex items-start gap-3">
          {recommendation.winner === 'lease' ? (
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          ) : recommendation.winner === 'buy' ? (
            <div className="p-2 bg-emerald-100 rounded-full">
              <Car className="w-5 h-5 text-emerald-600" />
            </div>
          ) : (
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          )}
          <div>
            <p className={`font-semibold ${
              recommendation.winner === 'lease' ? 'text-blue-900' :
              recommendation.winner === 'buy' ? 'text-emerald-900' : 'text-purple-900'
            }`}>
              {recommendation.winner === 'lease' ? 'Leasing may be better' :
               recommendation.winner === 'buy' ? 'Financing may be better' : 'Close call'}
            </p>
            <p className={`text-sm ${
              recommendation.winner === 'lease' ? 'text-blue-700' :
              recommendation.winner === 'buy' ? 'text-emerald-700' : 'text-purple-700'
            }`}>
              {recommendation.reason}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Year Cost Chart */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-semibold text-gray-900 mb-4">{inputs.leaseTerm}-Month Cost Comparison</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={60} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="Total Cost" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]}>
                {costChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#3b82f6' : '#10b981'}
                  />
                ))}
              </Bar>
              <Bar dataKey="Equity" stackId="a" fill="#86efac" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Lease Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Finance Paid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-300" />
            <span>Equity Built</span>
          </div>
        </div>
      </div>

      {/* Decision Factors */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-4 border-b">Key Differences</h3>
        <div className="divide-y">
          <FactorRow
            label="Ownership at End"
            leaseValue="Return vehicle"
            loanValue="You own it"
            leaseIcon={<XCircle className="w-4 h-4 text-gray-400" />}
            loanIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
          <FactorRow
            label="Mileage Limit"
            leaseValue="10-15k/year"
            loanValue="Unlimited"
            leaseIcon={<Minus className="w-4 h-4 text-amber-500" />}
            loanIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
          <FactorRow
            label="Wear & Tear"
            leaseValue="Fees possible"
            loanValue="Your choice"
            leaseIcon={<Minus className="w-4 h-4 text-amber-500" />}
            loanIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
          <FactorRow
            label="New Car Frequency"
            leaseValue="Every 2-3 years"
            loanValue="Keep longer"
            leaseIcon={<CheckCircle2 className="w-4 h-4 text-blue-500" />}
            loanIcon={<Minus className="w-4 h-4 text-gray-400" />}
          />
          <FactorRow
            label="Monthly Payment"
            leaseValue={formatCurrencyDetailed(leaseCalc.monthlyPayment)}
            loanValue={formatCurrencyDetailed(loanCalc.monthlyPayment)}
            leaseIcon={leaseCalc.monthlyPayment < loanCalc.monthlyPayment
              ? <CheckCircle2 className="w-4 h-4 text-blue-500" />
              : <Minus className="w-4 h-4 text-gray-400" />}
            loanIcon={loanCalc.monthlyPayment < leaseCalc.monthlyPayment
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              : <Minus className="w-4 h-4 text-gray-400" />}
          />
          <FactorRow
            label="Equity After Term"
            leaseValue={formatCurrency(0)}
            loanValue={formatCurrency(Math.max(0, threeYearComparison.loanEquity))}
            leaseIcon={<XCircle className="w-4 h-4 text-gray-400" />}
            loanIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
        </div>
      </div>

      {/* Vehicle Lookup */}
      <button
        onClick={() => setShowVehicleSelector(true)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
      >
        <Search size={18} />
        Look Up Vehicle Rates
      </button>

      {/* Shared Inputs */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Vehicle Price</h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="MSRP"
            value={inputs.msrp}
            onChange={(v) => updateInput('msrp', v)}
            prefix="$"
            tooltip="Manufacturer's Suggested Retail Price"
          />
          <NumberInput
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => updateInput('sellingPrice', v)}
            prefix="$"
            tooltip="Negotiated price before incentives"
          />
        </div>
        {inputs.sellingPrice < inputs.msrp && (
          <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✓ {formatCurrency(inputs.msrp - inputs.sellingPrice)} below MSRP ({((1 - inputs.sellingPrice / inputs.msrp) * 100).toFixed(1)}% discount)
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Down Payment & Trade</h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Down Payment"
            value={inputs.downPayment}
            onChange={(v) => updateInput('downPayment', v)}
            prefix="$"
          />
          <NumberInput
            label="Rebates"
            value={inputs.rebates}
            onChange={(v) => updateInput('rebates', v)}
            prefix="$"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Trade-In Value"
            value={inputs.tradeInValue}
            onChange={(v) => updateInput('tradeInValue', v)}
            prefix="$"
          />
          <NumberInput
            label="Trade Payoff"
            value={inputs.tradeInPayoff}
            onChange={(v) => updateInput('tradeInPayoff', v)}
            prefix="$"
            tooltip="Amount still owed on trade-in"
          />
        </div>
        {inputs.tradeInPayoff > inputs.tradeInValue && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Negative equity of {formatCurrency(inputs.tradeInPayoff - inputs.tradeInValue)} will be rolled in
          </p>
        )}
      </div>

      {/* Lease Terms */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Lease Terms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Term"
            value={inputs.leaseTerm}
            onChange={(v) => updateInput('leaseTerm', v)}
            suffix="months"
            min={24}
            max={48}
            step={12}
          />
          <NumberInput
            label="Residual %"
            value={inputs.leaseResidualPercent}
            onChange={(v) => updateInput('leaseResidualPercent', v)}
            suffix="%"
            min={30}
            max={80}
            tooltip="Percentage of MSRP at lease end"
          />
        </div>
        <NumberInput
          label="Money Factor"
          value={inputs.leaseMoneyFactor}
          onChange={(v) => updateInput('leaseMoneyFactor', v)}
          step={0.00001}
          decimals={5}
          tooltip={`Equivalent to ${(inputs.leaseMoneyFactor * 2400).toFixed(2)}% APR`}
        />
        <p className="text-sm text-gray-500">
          Effective APR: <span className="font-medium text-gray-700">{leaseCalc.effectiveAPR.toFixed(2)}%</span>
        </p>
      </div>

      {/* Loan Terms */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Finance Terms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Term"
            value={inputs.loanTerm}
            onChange={(v) => updateInput('loanTerm', v)}
            suffix="months"
            min={24}
            max={84}
            step={12}
          />
          <NumberInput
            label="Interest Rate"
            value={inputs.loanInterestRate}
            onChange={(v) => updateInput('loanInterestRate', v)}
            suffix="%"
            step={0.25}
            decimals={2}
            min={0}
            max={25}
            tooltip="Annual Percentage Rate (APR)"
          />
        </div>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-gray-600 text-sm font-medium"
      >
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showAdvanced ? 'Hide' : 'Show'} Fees & Taxes
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Acquisition Fee"
              value={inputs.acquisitionFee}
              onChange={(v) => updateInput('acquisitionFee', v)}
              prefix="$"
              tooltip="Lease bank fee, usually $595-$1,095"
            />
            <NumberInput
              label="Title/Reg Fee"
              value={inputs.titleFee}
              onChange={(v) => updateInput('titleFee', v)}
              prefix="$"
              tooltip="Finance title and registration"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Doc Fee"
              value={inputs.docFee}
              onChange={(v) => updateInput('docFee', v)}
              prefix="$"
            />
            <NumberInput
              label="Tax Rate"
              value={inputs.taxRate}
              onChange={(v) => updateInput('taxRate', v)}
              suffix="%"
              step={0.25}
              decimals={2}
            />
          </div>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-3">Lease Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-700">Residual Value</span>
              <span className="font-medium text-blue-900">{formatCurrency(leaseCalc.residualValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Effective APR</span>
              <span className="font-medium text-blue-900">{leaseCalc.effectiveAPR.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="text-blue-700">Drive-Off</span>
              <span className="font-medium text-blue-900">{formatCurrency(leaseCalc.driveOff)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">{inputs.leaseTerm}mo Total</span>
              <span className="font-medium text-blue-900">{formatCurrency(leaseCalc.totalCost)}</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <h4 className="font-semibold text-emerald-900 text-sm mb-3">Finance Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-700">Amount Financed</span>
              <span className="font-medium text-emerald-900">{formatCurrency(loanCalc.amountFinanced)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Total Interest</span>
              <span className="font-medium text-emerald-900">{formatCurrency(loanCalc.totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-emerald-200">
              <span className="text-emerald-700">Drive-Off</span>
              <span className="font-medium text-emerald-900">{formatCurrency(loanCalc.driveOff)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">{inputs.loanTerm}mo Total</span>
              <span className="font-medium text-emerald-900">{formatCurrency(loanCalc.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="flex items-center justify-center gap-2 w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <RotateCcw size={16} />
        Reset to Defaults
      </button>

      {/* Vehicle Selector Modal */}
      {showVehicleSelector && (
        <VehicleSelector
          onSelect={handleVehicleSelect}
          onClose={() => setShowVehicleSelector(false)}
        />
      )}
    </div>
  );
}

// Helper component for factor comparison rows
function FactorRow({
  label,
  leaseValue,
  loanValue,
  leaseIcon,
  loanIcon
}: {
  label: string;
  leaseValue: string;
  loanValue: string;
  leaseIcon: React.ReactNode;
  loanIcon: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-2 p-3 items-center text-sm">
      <div className="flex items-center gap-2">
        {leaseIcon}
        <span className="text-gray-600">{leaseValue}</span>
      </div>
      <div className="text-center">
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <span className="text-gray-600">{loanValue}</span>
        {loanIcon}
      </div>
    </div>
  );
}
