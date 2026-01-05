
import React from 'react';
import { StrategyConfig } from '../types';
import { ICONS } from '../constants';

interface StrategyPanelProps {
  config: StrategyConfig;
  setConfig: (config: StrategyConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  return (
    <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <ICONS.Gold />
        </div>
        <h2 className="text-xl font-bold text-yellow-500">Gold Scalper Config</h2>
      </div>

      <div className="space-y-6">
        {/* Timeframe Select */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Target Timeframe</label>
          <div className="grid grid-cols-3 gap-2">
            {(['M1', 'M5', 'M15'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setConfig({ ...config, timeframe: tf })}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all border ${
                  config.timeframe === tf 
                    ? 'bg-yellow-500 border-yellow-500 text-black' 
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Ratio Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
            <span>Risk/Reward Ratio</span>
            <span className="text-yellow-500 font-bold">1:{config.riskRatio}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={config.riskRatio}
            onChange={(e) => setConfig({ ...config, riskRatio: parseFloat(e.target.value) })}
            className="w-full accent-yellow-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Feature Toggles */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">Strategy Modules</label>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-black/40">
            <span className="text-sm font-medium">Smart Money Concepts (SMC)</span>
            <input 
              type="checkbox" 
              checked={config.useSMC} 
              onChange={(e) => setConfig({...config, useSMC: e.target.checked})}
              className="w-5 h-5 accent-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-black/40">
            <span className="text-sm font-medium">Momentum RSI (Divergence)</span>
            <input 
              type="checkbox" 
              checked={config.useRSI} 
              onChange={(e) => setConfig({...config, useRSI: e.target.checked})}
              className="w-5 h-5 accent-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-black/40">
            <span className="text-sm font-medium">ATR Volatility Filter</span>
            <input 
              type="checkbox" 
              checked={config.volatilityFilter} 
              onChange={(e) => setConfig({...config, volatilityFilter: e.target.checked})}
              className="w-5 h-5 accent-yellow-500"
            />
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full mt-6 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ICONS.Brain />
              <span>Generate AI Indicator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StrategyPanel;
