'use client';

import { useState, useMemo } from 'react';
import { Search, Check, ChevronDown, AlertCircle, Clock, X } from 'lucide-react';
import { vehicleRates, getMakes, getModelsByMake, getVehicleRate, VehicleRate, TermRate } from '@/data/vehicleRates';

interface VehicleSelectorProps {
  onSelect: (rate: { moneyFactor: number; residualPercent: number; msrp: number }) => void;
  onClose: () => void;
}

export function VehicleSelector({ onSelect, onClose }: VehicleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedMileage, setSelectedMileage] = useState<number>(10000);

  const makes = useMemo(() => getMakes(), []);
  const models = useMemo(() => selectedMake ? getModelsByMake(selectedMake) : [], [selectedMake]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return vehicleRates.filter(v =>
      v.make.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      `${v.make} ${v.model}`.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  const selectedVehicle = useMemo(() => {
    if (selectedMake && selectedModel) {
      return getVehicleRate(selectedMake, selectedModel);
    }
    return null;
  }, [selectedMake, selectedModel]);

  const availableMileages = useMemo(() => {
    if (!selectedVehicle) return [];
    const mileages = [...new Set(selectedVehicle.terms.map(t => t.mileage))];
    return mileages.sort((a, b) => a - b);
  }, [selectedVehicle]);

  const selectedTerm = useMemo(() => {
    if (!selectedVehicle) return null;
    return selectedVehicle.terms.find(t => t.months === 36 && t.mileage === selectedMileage) ||
           selectedVehicle.terms.find(t => t.mileage === selectedMileage) ||
           selectedVehicle.terms[0];
  }, [selectedVehicle, selectedMileage]);

  const handleQuickSelect = (vehicle: VehicleRate) => {
    setSelectedMake(vehicle.make);
    setSelectedModel(vehicle.model);
    setSearchQuery('');
  };

  const handleApply = () => {
    if (selectedVehicle && selectedTerm) {
      onSelect({
        moneyFactor: selectedTerm.moneyFactor,
        residualPercent: selectedTerm.residualPercent,
        msrp: selectedVehicle.msrpRange.min,
      });
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-h-[90vh] md:max-w-lg md:rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Vehicle</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Results */}
          {filteredVehicles.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg divide-y">
              {filteredVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleQuickSelect(v)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="font-medium">{v.year} {v.make} {v.model}</span>
                  {v.verified && <Check size={16} className="text-green-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manual Selection */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Make Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
            <div className="relative">
              <select
                value={selectedMake || ''}
                onChange={(e) => {
                  setSelectedMake(e.target.value || null);
                  setSelectedModel(null);
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select make...</option>
                {makes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Model Selector */}
          {selectedMake && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <div className="relative">
                <select
                  value={selectedModel || ''}
                  onChange={(e) => setSelectedModel(e.target.value || null)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select model...</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          )}

          {/* Mileage Selector */}
          {selectedVehicle && availableMileages.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Mileage</label>
              <div className="flex gap-2">
                {availableMileages.map((miles) => (
                  <button
                    key={miles}
                    onClick={() => setSelectedMileage(miles)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedMileage === miles
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {(miles / 1000)}k
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Vehicle Details */}
          {selectedVehicle && selectedTerm && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </h3>
                  {selectedVehicle.trim && (
                    <p className="text-sm text-gray-500">{selectedVehicle.trim}</p>
                  )}
                </div>
                {selectedVehicle.verified ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Check size={12} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <AlertCircle size={12} /> Unverified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-gray-500">Money Factor</p>
                  <p className="text-lg font-bold text-blue-600">{selectedTerm.moneyFactor.toFixed(5)}</p>
                  <p className="text-xs text-gray-400">{(selectedTerm.moneyFactor * 2400).toFixed(2)}% APR</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-gray-500">Residual</p>
                  <p className="text-lg font-bold text-blue-600">{selectedTerm.residualPercent}%</p>
                  <p className="text-xs text-gray-400">{selectedTerm.months}mo / {selectedTerm.mileage / 1000}k mi</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>
                  Updated {formatDate(selectedVehicle.lastUpdated)}
                  {getDaysAgo(selectedVehicle.lastUpdated) > 30 && (
                    <span className="text-amber-500 ml-1">(may be outdated)</span>
                  )}
                </span>
              </div>

              <p className="text-xs text-gray-400">
                Source: {selectedVehicle.source === 'community' ? 'Community reported' : 
                         selectedVehicle.source === 'dealer' ? 'Dealer submitted' : 'Manufacturer'}
                {' • '}{selectedVehicle.region}
              </p>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleApply}
            disabled={!selectedVehicle || !selectedTerm}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply Rates
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Always verify rates with your dealer
          </p>
        </div>
      </div>
    </div>
  );
}
