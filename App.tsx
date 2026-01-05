
import React, { useState, useEffect } from 'react';
import StrategyPanel from './components/StrategyPanel';
import CodeOutput from './components/CodeOutput';
import { StrategyConfig, PineScriptOutput } from './types';
import { generateXAUIndicator } from './services/geminiService';
import { ICONS } from './constants';

declare global {
  // Define AIStudio interface to match and merge with existing environment definitions.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // aistudio must be optional and use the AIStudio type to avoid declaration conflicts.
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
      await window.aistudio.openSelectKey();
      // Assume success after triggering the dialog to handle potential race conditions.
      setIsKeyConfigured(true);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateXAUIndicator(config);
      setOutput(result);
    } catch (err: any) {
      // If the request fails with "Requested entity was not found.", reset the key selection state.
      if (err.message === "API_KEY_NOT_FOUND") {
        setIsKeyConfigured(false);
        setError("API Key không hợp lệ hoặc đã bị gỡ bỏ. Vui lòng chọn lại Key.");
      } else {
        setError(`Lỗi: ${err.message || "Không thể tạo chỉ báo. Vui lòng kiểm tra lại kết nối mạng hoặc API Key."}`);
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
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all animate-pulse"
              >
                Kết nối API Key
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                API Connected
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Professional Gold Scalping</h2>
          <p className="text-gray-400">
            Ứng dụng hỗ trợ xây dựng chỉ báo Scalping Vàng chuyên sâu. 
            Vui lòng cấu hình các phương pháp bạn muốn tích hợp vào chỉ báo AI.
          </p>
        </div>

        {!isKeyConfigured && (
          <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-yellow-500">
               <ICONS.Gold />
               <div>
                 <p className="font-bold">Chưa cấu hình API Key</p>
                 <p className="text-sm opacity-80">Bạn cần kết nối API Key từ Google AI Studio để sử dụng trí tuệ nhân tạo.</p>
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs underline mt-2 block">Thông tin về Billing</a>
               </div>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
            >
              Cấu hình ngay
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             {error}
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
              <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Lưu ý quan trọng</h4>
              <ul className="space-y-3 text-xs text-gray-500 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  Chỉ báo được tối ưu cho phiên Mỹ (NY Session) nơi thanh khoản XAUUSD cao nhất.
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  Luôn sử dụng Stop Loss do AI tính toán để quản lý rủi ro khi Vàng biến động mạnh.
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <CodeOutput output={output} />
            
            <div className="mt-10 p-10 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ICONS.Chart />
                </div>
                <h3 className="text-xl font-bold mb-3">Hướng dẫn cài đặt</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Sau khi AI tạo xong Code, hãy sao chép vào <span className="text-white font-semibold">Pine Editor</span> trên TradingView. 
                  Sử dụng tài khoản <span className="text-yellow-500">Paid API</span> để đảm bảo tốc độ phản hồi nhanh nhất.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 uppercase">No Repaint</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full border border-blue-500/20 uppercase">Alert Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm gap-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-bold">XAU PRO</span>
            <span>&copy; 2024 Advanced Trading Tools</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors">Billing Info</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
