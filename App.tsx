
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
    const init = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeyConfigured(hasKey);
      }
    };
    init();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Theo quy tắc: giả định thành công sau khi kích hoạt dialog
      setIsKeyConfigured(true);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    // Kiểm tra Key ngay trước khi gọi
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setIsLoading(false);
        setIsKeyConfigured(false);
        setError("Vui lòng chọn API Key trong cửa sổ vừa hiện ra.");
        await window.aistudio.openSelectKey();
        setIsKeyConfigured(true);
        return;
      }
    }

    try {
      const result = await generateXAUIndicator(config);
      setOutput(result);
      setError(null);
    } catch (err: any) {
      console.error("Generation failed:", err);
      if (err.message === "API_KEY_MISSING" || err.message === "API_KEY_INVALID") {
        setIsKeyConfigured(false);
        setError("Lỗi API Key: Vui lòng nhấn 'KẾT NỐI LẠI' để cập nhật mã xác thực.");
      } else {
        setError(`Lỗi hệ thống: ${err.message || "Vui lòng thử lại sau vài giây."}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              X
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">XAUUSD <span className="text-yellow-500">Scalper Pro</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Elite Quant System</p>
            </div>
          </div>
          
          <button 
            onClick={handleOpenKeySelector}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isKeyConfigured 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isKeyConfigured ? 'bg-green-500' : 'bg-white'}`}></div>
            {isKeyConfigured ? 'API Connected' : 'KẾT NỐI LẠI'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Professional Gold Scalping
          </h2>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Hệ thống tối ưu hóa chiến lược giao dịch Vàng khung thời gian thấp (M1-M15). 
            Sử dụng trí tuệ nhân tạo để xây dựng chỉ báo không repaint, tích hợp SMC và quản lý rủi ro ATR.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <p className="font-bold">Thông báo hệ thống</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
            {!isKeyConfigured && (
              <button 
                onClick={handleOpenKeySelector}
                className="ml-auto px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                KẾT NỐI NGAY
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <StrategyPanel 
              config={config} 
              setConfig={setConfig} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            
            <div className="p-6 bg-[#0f0f0f] border border-gray-800 rounded-2xl">
              <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4">Mẹo giao dịch Vàng</h3>
              <div className="space-y-4">
                <div className="group">
                  <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">Phiên giao dịch</p>
                  <p className="text-xs text-gray-500 mt-1">Vàng biến động mạnh nhất từ 19:00 - 22:00 (giờ VN). Hãy bật bộ lọc Volatility.</p>
                </div>
                <div className="group border-t border-gray-800 pt-4">
                  <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">Quản lý rủi ro</p>
                  <p className="text-xs text-gray-500 mt-1">Chỉ báo sẽ sử dụng ATR để đặt SL. Tuyệt đối không dời SL khi Vàng chạy ngược hướng.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <CodeOutput output={output} />
            
            {!output && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl bg-[#080808]/50 p-10 text-center">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-8 border border-gray-800 shadow-inner">
                  <ICONS.Chart />
                </div>
                <h3 className="text-2xl font-bold mb-4">Chưa có mã nguồn</h3>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
                  Thiết lập tham số chiến lược và nhấn "Generate" để AI bắt đầu viết mã Pine Script chuyên dụng.
                </p>
                <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
                  <span className="px-4 py-1.5 bg-gray-800 rounded-full text-[10px] font-bold">PINE V5</span>
                  <span className="px-4 py-1.5 bg-gray-800 rounded-full text-[10px] font-bold">SMART MONEY</span>
                  <span className="px-4 py-1.5 bg-gray-800 rounded-full text-[10px] font-bold">ALGO-TRADING</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-900 mt-20 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black text-xs">X</div>
            <p className="text-gray-600 text-xs">© 2024 Gold Scalper Assistant. Được tối ưu bởi Gemini AI.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Billing & Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
