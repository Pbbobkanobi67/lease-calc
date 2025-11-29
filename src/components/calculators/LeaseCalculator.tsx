'use client';

import { useLeaseCalculator } from '@/hooks/useLeaseCalculator';
import { NumberInput } from '@/components/ui/NumberInput';
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { SubmitRate } from '@/components/ui/SubmitRate';
import { formatCurrency, formatCurrencyDetailed } from '@/lib/utils';
import { ChevronDown, ChevronUp, RotateCcw, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export function LeaseCalculator() {
  const { inputs, updateInput, calculation, reset, setInputs } = useLeaseCalculator();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [showSubmitRate, setShowSubmitRate] = useState(false);

  const handleVehicleSelect = (rate: { moneyFactor: number; residualPercent: number; msrp: number }) => {
    setInputs(prev => ({
      ...prev,
      moneyFactor: rate.moneyFactor,
      residualPercent: rate.residualPercent,
      msrp: rate.msrp,
      sellingPrice: rate.msrp, // Start at MSRP, user can negotiate down
    }));
  };

  return (
    <div className="space-y-6">
      {/* Monthly Payment Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium">Monthly Payment</p>
        <p className="text-5xl font-bold tracking-tight">
          {formatCurrencyDetailed(calculation.monthlyPayment)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-200">Drive-Off</p>
            <p className="font-semibold">{formatCurrency(calculation.driveOff)}</p>
          </div>
          <div>
            <p className="text-blue-200">Total Cost</p>
            <p className="font-semibold">{formatCurrency(calculation.totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Lookup Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowVehicleSelector(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          <Search size={18} />
          Look Up Rates
        </button>
        <button
          onClick={() => setShowSubmitRate(true)}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Core Inputs */}
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
        <h3 className="font-semibold text-gray-900">Lease Terms</h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Term"
            value={inputs.term}
            onChange={(v) => updateInput('term', v)}
            suffix="months"
            min={12}
            max={60}
            step={12}
          />
          <NumberInput
            label="Residual %"
            value={inputs.residualPercent}
            onChange={(v) => updateInput('residualPercent', v)}
            suffix="%"
            min={30}
            max={80}
            tooltip="Percentage of MSRP at lease end"
          />
        </div>
        <NumberInput
          label="Money Factor"
          value={inputs.moneyFactor}
          onChange={(v) => updateInput('moneyFactor', v)}
          step={0.00001}
          decimals={5}
          tooltip={`Equivalent to ${(inputs.moneyFactor * 2400).toFixed(2)}% APR`}
        />
        <p className="text-sm text-gray-500">
          Effective APR: <span className="font-medium text-gray-700">{calculation.effectiveAPR.toFixed(2)}%</span>
        </p>
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
            ⚠️ Negative equity of {formatCurrency(inputs.tradeInPayoff - inputs.tradeInValue)} will be rolled into lease
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
              label="Acquisition Fee"
              value={inputs.acquisitionFee}
              onChange={(v) => updateInput('acquisitionFee', v)}
              prefix="$"
              tooltip="Bank/lender fee, usually $595-$1,095"
            />
            <NumberInput
              label="Doc Fee"
              value={inputs.docFee}
              onChange={(v) => updateInput('docFee', v)}
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

      {/* Payment Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Payment Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Cap Cost</span>
            <span className="font-medium">{formatCurrency(calculation.grossCapCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cap Cost Reduction</span>
            <span className="font-medium text-green-600">-{formatCurrency(calculation.capCostReduction)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Adjusted Cap Cost</span>
            <span className="font-medium">{formatCurrency(calculation.adjustedCapCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Residual Value</span>
            <span className="font-medium">{formatCurrency(calculation.residualValue)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Depreciation</span>
            <span className="font-medium">{formatCurrencyDetailed(calculation.depreciation)}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rent Charge</span>
            <span className="font-medium">{formatCurrencyDetailed(calculation.rentCharge)}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Tax</span>
            <span className="font-medium">{formatCurrencyDetailed(calculation.monthlyTax)}/mo</span>
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

      {/* Modals */}
      {showVehicleSelector && (
        <VehicleSelector
          onSelect={handleVehicleSelect}
          onClose={() => setShowVehicleSelector(false)}
        />
      )}

      {showSubmitRate && (
        <SubmitRate onClose={() => setShowSubmitRate(false)} />
      )}
    </div>
  );
}
