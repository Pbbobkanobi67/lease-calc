'use client';

import { useState } from 'react';
import { LeaseCalculator } from '@/components/calculators/LeaseCalculator';
import { LoanCalculator } from '@/components/calculators/LoanCalculator';
import { AIChat } from '@/components/ai/AIChat';
import { Car, Calculator, Scale } from 'lucide-react';

type Tab = 'lease' | 'loan' | 'compare';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('lease');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Car className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-gray-900">AutoCalc Pro</h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-[57px] z-30">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('lease')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'lease'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Calculator size={16} className="inline mr-1.5 -mt-0.5" />
              Lease
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'loan'
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Calculator size={16} className="inline mr-1.5 -mt-0.5" />
              Finance
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'compare'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Scale size={16} className="inline mr-1.5 -mt-0.5" />
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {activeTab === 'lease' && <LeaseCalculator />}
        {activeTab === 'loan' && <LoanCalculator />}
        {activeTab === 'compare' && <ComparePlaceholder />}
      </div>

      {/* AI Chat */}
      <AIChat />
    </main>
  );
}

function ComparePlaceholder() {
  return (
    <div className="text-center py-12">
      <Scale size={48} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Lease vs. Buy Comparison
      </h2>
      <p className="text-gray-500 text-sm">
        Coming soon! This will show a side-by-side comparison of leasing versus financing the same vehicle.
      </p>
    </div>
  );
}
