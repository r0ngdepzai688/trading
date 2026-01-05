
import React, { useState } from 'react';
import StrategyPanel from './components/StrategyPanel';
import CodeOutput from './components/CodeOutput';
import { StrategyConfig, PineScriptOutput } from './types';
import { generateXAUIndicator } from './services/geminiService';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<StrategyConfig>({
    timeframe: 'M5',
    riskRatio: 2,
    useSMC: true,
    useRSI: true,
    volatilityFilter: true
  });
  const [output, setOutput] = useState<PineScriptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateXAUIndicator(config);
      setOutput(result);
    } catch (err) {
      setError("Failed to generate the indicator. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              X
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">XAUUSD <span className="text-yellow-500">Scalper Pro</span></h1>
              <p className="text-xs text-gray-500 font-medium">Quantitative Trading Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Strategy Analysis
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Professional Gold Scalping</h2>
          <p className="text-gray-400">
            Welcome, Trader. XAUUSD requires high precision and volatility management. 
            Customize your professional scalp indicator below using top-tier quantitative methods.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Config */}
          <div className="lg:col-span-4 sticky top-28">
            <StrategyPanel 
              config={config} 
              setConfig={setConfig} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800">
              <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Trading Advisory</h4>
              <ul className="space-y-3 text-xs text-gray-500 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  Avoid high-impact news events (CPI, NFP) when using scalp indicators on XAUUSD.
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  Always test on Demo accounts for at least 50 trades to calculate win rate and drawdown.
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  Scalping on M1 requires ultra-low spreads/ECN accounts for profitability.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Output */}
          <div className="lg:col-span-8">
            <CodeOutput output={output} />
            
            {/* Visual Guide Mockup */}
            <div className="mt-10 p-10 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ICONS.Chart />
                </div>
                <h3 className="text-xl font-bold mb-3">How to Use Your New Script</h3>
                <p className="text-gray-400 text-sm mb-6">
                  1. Open <span className="text-white font-semibold">TradingView</span> Chart.<br/>
                  2. Open the <span className="text-white font-semibold">Pine Editor</span> tab at the bottom.<br/>
                  3. Paste the generated code and click <span className="text-white font-semibold">"Save"</span> then <span className="text-white font-semibold">"Add to Chart"</span>.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 uppercase">No Repaint</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full border border-blue-500/20 uppercase">Alert Ready</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold rounded-full border border-purple-500/20 uppercase">Multi-TF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm gap-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-bold">XAU PRO</span>
            <span>&copy; 2024 Advanced Trading Tools</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-yellow-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Indicator Marketplace</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
