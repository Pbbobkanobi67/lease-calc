'use client';

import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { NumberInput } from '@/components/ui/NumberInput';
import { formatCurrency, formatCurrencyDetailed } from '@/lib/utils';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function LoanCalculator() {
  const { inputs, updateInput, calculation, reset } = useLoanCalculator();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const termOptions = [36, 48, 60, 72, 84];

  return (
    <div className="space-y-6">
      {/* Monthly Payment Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
        <p className="text-emerald-100 text-sm font-medium">Monthly Payment</p>
        <p className="text-5xl font-bold tracking-tight">
          {formatCurrencyDetailed(calculation.monthlyPayment)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-emerald-200">Total Interest</p>
            <p className="font-semibold">{formatCurrency(calculation.totalInterest)}</p>
          </div>
          <div>
            <p className="text-emerald-200">Total Cost</p>
            <p className="font-semibold">{formatCurrency(calculation.totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Core Inputs */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Vehicle Price</h3>
        <NumberInput
          label="Purchase Price"
          value={inputs.vehiclePrice}
          onChange={(v) => updateInput('vehiclePrice', v)}
          prefix="$"
          tooltip="Negotiated out-the-door price before taxes/fees"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Loan Terms</h3>
        
        {/* Term Selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Loan Term</label>
          <div className="grid grid-cols-5 gap-2">
            {termOptions.map((term) => (
              <button
                key={term}
                onClick={() => updateInput('term', term)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  inputs.term === term
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {term}mo
              </button>
            ))}
          </div>
        </div>

        <NumberInput
          label="Interest Rate (APR)"
          value={inputs.interestRate}
          onChange={(v) => updateInput('interestRate', v)}
          suffix="%"
          step={0.25}
          decimals={2}
          min={0}
          max={30}
        />
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
            ⚠️ Negative equity of {formatCurrency(inputs.tradeInPayoff - inputs.tradeInValue)} will be added to loan
          </p>
        )}
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
              label="Doc Fee"
              value={inputs.docFee}
              onChange={(v) => updateInput('docFee', v)}
              prefix="$"
            />
            <NumberInput
              label="Title/Reg Fee"
              value={inputs.titleFee}
              onChange={(v) => updateInput('titleFee', v)}
              prefix="$"
            />
          </div>
          <NumberInput
            label="Tax Rate"
            value={inputs.taxRate}
            onChange={(v) => updateInput('taxRate', v)}
            suffix="%"
            step={0.25}
            decimals={2}
          />
        </div>
      )}

      {/* Loan Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Loan Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle Price</span>
            <span className="font-medium">{formatCurrency(inputs.vehiclePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sales Tax</span>
            <span className="font-medium">{formatCurrency(calculation.salesTax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fees</span>
            <span className="font-medium">{formatCurrency(calculation.totalFees)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Down Payment</span>
            <span className="font-medium text-green-600">-{formatCurrency(inputs.downPayment)}</span>
          </div>
          {inputs.tradeInValue > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Trade Equity</span>
              <span className={`font-medium ${inputs.tradeInValue - inputs.tradeInPayoff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {inputs.tradeInValue - inputs.tradeInPayoff >= 0 ? '-' : '+'}
                {formatCurrency(Math.abs(inputs.tradeInValue - inputs.tradeInPayoff))}
              </span>
            </div>
          )}
          {inputs.rebates > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Rebates</span>
              <span className="font-medium text-green-600">-{formatCurrency(inputs.rebates)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700 font-medium">Amount Financed</span>
            <span className="font-bold">{formatCurrency(calculation.amountFinanced)}</span>
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
    </div>
  );
}
