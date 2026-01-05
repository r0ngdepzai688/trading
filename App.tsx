
import React, { useState, useEffect } from 'react';
import StrategyPanel from './components/StrategyPanel';
import CodeOutput from './components/CodeOutput';
import { StrategyConfig, PineScriptOutput } from './types';
import { generateXAUIndicator } from './services/geminiService';
import { ICONS } from './constants';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

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
  const [isKeyConfigured, setIsKeyConfigured] = useState<boolean>(true);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeyConfigured(hasKey);
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Force state update to reflect that a key was presumably selected
        setIsKeyConfigured(true);
        setError(null);
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateXAUIndicator(config);
      setOutput(result);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING" || err.message === "API_KEY_INVALID") {
        setIsKeyConfigured(false);
        setError("Vui lòng nhấn nút 'Kết nối API Key' để chọn mã API từ Google AI Studio.");
      } else if (err.message?.includes("API Key must be set")) {
        setIsKeyConfigured(false);
        setError("API Key chưa được thiết lập. Hãy nhấn nút 'Kết nối' phía trên.");
      } else {
        setError(`Lỗi: ${err.message || "Không thể tạo chỉ báo. Vui lòng kiểm tra lại."}`);
      }
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
            {!isKeyConfigured ? (
              <button 
                onClick={handleOpenKeySelector}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Kết nối API Key
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                API Ready
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Professional Gold Scalping</h2>
          <p className="text-gray-400 leading-relaxed">
            Ứng dụng hỗ trợ xây dựng chỉ báo Scalping Vàng chuyên sâu dựa trên trí tuệ nhân tạo Gemini.
          </p>
        </div>

        {!isKeyConfigured && (
          <div className="mb-8 p-8 bg-gradient-to-r from-red-500/20 to-transparent border border-red-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4"/><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m2 22 7-7"/><path d="M11 20.3 12.1 17a1 1 0 0 1 1.7-.3l2.8 2.8a1 1 0 0 0 1.7-.3l3.2-10.4a.5.5 0 0 0-.6-.6L10.5 11.5a1 1 0 0 0-.3 1.7l2.8 2.8a1 1 0 0 1-.3 1.7L9.4 19"/><path d="M15 5 9 11"/><path d="m13 7-6 6"/></svg>
               </div>
               <div>
                 <p className="font-bold text-white text-lg">Yêu cầu xác thực API</p>
                 <p className="text-gray-400 text-sm max-w-md">Vui lòng nhấn nút bên cạnh để chọn API Key từ tài khoản Google của bạn. Bước này là bắt buộc để sử dụng AI.</p>
               </div>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all shadow-xl whitespace-nowrap"
            >
              KẾT NỐI NGAY
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 sticky top-28">
            <StrategyPanel 
              config={config} 
              setConfig={setConfig} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800">
              <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em]">Yêu cầu kỹ thuật</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Nên sử dụng API Key từ dự án có <b>Billing</b> được kích hoạt để tránh bị giới hạn tốc độ.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Mô hình <b>Gemini 3 Pro</b> cung cấp mã nguồn Pine Script có độ chính xác cao nhất cho SMC.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <CodeOutput output={output} />
            
            {!output && !isLoading && (
              <div className="mt-10 p-12 bg-[#0d0d0d] rounded-2xl border border-gray-800/50 text-center border-dashed">
                <div className="w-20 h-20 bg-gray-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-800">
                  <ICONS.Chart />
                </div>
                <h3 className="text-xl font-bold mb-4">Sẵn sàng tạo chiến lược?</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                  Thiết lập các thông số ở bảng bên trái và nhấn nút "Generate AI Indicator" để bắt đầu.
                </p>
                <div className="flex justify-center gap-6 grayscale opacity-30">
                  <img src="https://tradingview.com/static/images/logo-with-text.svg" alt="TradingView" className="h-6" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/50 py-12 mt-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-600 text-xs gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-800">G</div>
            <p>&copy; 2024 Gold Scalper Assistant. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-10 font-medium">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors uppercase tracking-widest">Billing Support</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
