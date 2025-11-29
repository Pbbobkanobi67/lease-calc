'use client';

import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface SubmitRateProps {
  onClose: () => void;
}

export function SubmitRate({ onClose }: SubmitRateProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    trim: '',
    msrp: 0,
    moneyFactor: 0,
    residualPercent: 0,
    term: 36,
    mileage: 10000,
    region: '',
    dealerName: '',
    source: 'dealer_quote' as 'dealer_quote' | 'signed_contract',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // In a real app, this would POST to your API
    // For now, we'll simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log to console for now - you'd send this to your backend
    console.log('Rate submission:', formData);
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const isValid = formData.make && formData.model && formData.msrp > 0 && 
                  formData.moneyFactor > 0 && formData.residualPercent > 0;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thanks!</h2>
          <p className="text-gray-600 mb-6">
            Your rate submission has been received. We'll review and add it to the database.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-h-[90vh] md:max-w-lg md:rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Submit Rate</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium flex items-center gap-1">
              <AlertCircle size={16} />
              Help improve the database
            </p>
            <p className="mt-1 text-blue-600">
              Submit rates you've received from dealers or signed contracts to help other shoppers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g., Toyota"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., RAV4"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Year *"
              value={formData.year}
              onChange={(v) => setFormData({ ...formData, year: v })}
              min={2024}
              max={2026}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
              <input
                type="text"
                value={formData.trim}
                onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                placeholder="e.g., XLE"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <NumberInput
            label="MSRP *"
            value={formData.msrp}
            onChange={(v) => setFormData({ ...formData, msrp: v })}
            prefix="$"
            min={15000}
            max={200000}
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Money Factor *"
              value={formData.moneyFactor}
              onChange={(v) => setFormData({ ...formData, moneyFactor: v })}
              step={0.00001}
              decimals={5}
              min={0}
              max={0.01}
              tooltip={formData.moneyFactor > 0 ? `${(formData.moneyFactor * 2400).toFixed(2)}% APR` : undefined}
            />
            <NumberInput
              label="Residual % *"
              value={formData.residualPercent}
              onChange={(v) => setFormData({ ...formData, residualPercent: v })}
              suffix="%"
              min={30}
              max={80}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={24}>24 months</option>
                <option value={36}>36 months</option>
                <option value={39}>39 months</option>
                <option value={48}>48 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Miles</label>
              <select
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={7500}>7,500</option>
                <option value={10000}>10,000</option>
                <option value={12000}>12,000</option>
                <option value={15000}>15,000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g., California, Northeast"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.source === 'dealer_quote'}
                  onChange={() => setFormData({ ...formData, source: 'dealer_quote' })}
                  className="text-blue-600"
                />
                <span className="text-sm">Dealer quote</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.source === 'signed_contract'}
                  onChange={() => setFormData({ ...formData, source: 'signed_contract' })}
                  className="text-blue-600"
                />
                <span className="text-sm">Signed contract</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional details about the deal..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Rate
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Submissions are reviewed before being added
          </p>
        </div>
      </div>
    </div>
  );
}
