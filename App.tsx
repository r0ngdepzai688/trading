
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

  const checkInitialKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeyConfigured(hasKey);
    }
  };

  useEffect(() => {
    checkInitialKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Giả định thành công ngay sau khi kích hoạt dialog theo quy định
        setIsKeyConfigured(true);
        setError(null);
      } catch (e) {
        console.error("Hộp thoại chọn Key không thể mở:", e);
      }
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateXAUIndicator(config);
      setOutput(result);
      setIsKeyConfigured(true);
    } catch (err: any) {
      console.error("Lỗi trong quá trình tạo:", err.message);
      
      if (err.message === "API_KEY_RESET_REQUIRED") {
        setIsKeyConfigured(false);
        setError("Lỗi xác thực: Vui lòng chọn lại một API Key hợp lệ từ dự án đã kích hoạt thanh toán (Paid Project).");
        // Tự động mở lại bảng chọn để hỗ trợ người dùng
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setError(`Lỗi: ${err.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại."}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-yellow-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              X
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">XAUUSD <span className="text-yellow-500">Scalper Pro</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Elite Quant System</p>
            </div>
          </div>
          
          <button 
            onClick={handleOpenKeySelector}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border-2 ${
              isKeyConfigured 
              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
              : 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse scale-105'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isKeyConfigured ? 'bg-green-500' : 'bg-white'}`}></div>
            {isKeyConfigured ? 'API READY' : 'CLICK KẾT NỐI LẠI'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Professional Gold Scalping
          </h2>
          <p className="text-gray-400 max-w-2xl leading-relaxed text-lg">
            Hệ thống hỗ trợ xây dựng chỉ báo Pine Script chuyên sâu cho Vàng. 
            Tích hợp mô hình ngôn ngữ lớn để tối ưu hóa điểm vào lệnh.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 shadow-2xl">
            <div className="shrink-0 w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-black text-lg">Lỗi cấu hình API</p>
              <p className="text-sm opacity-90 leading-relaxed max-w-xl">{error}</p>
              <p className="text-[10px] mt-2 opacity-60 italic">*Lưu ý: Bạn phải chọn API Key từ một dự án Google Cloud có kích hoạt thanh toán.</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="sm:ml-auto px-8 py-3 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-xl whitespace-nowrap active:scale-95"
            >
              KẾT NỐI LẠI NGAY
            </button>
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
            
            <div className="p-8 bg-[#0f0f0f] border border-gray-800 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ICONS.Gold />
              </div>
              <h3 className="text-xs font-black text-yellow-500 uppercase tracking-[0.2em] mb-6">Yêu cầu từ Google</h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-yellow-500/20">
                  <p className="text-sm font-bold text-gray-200">Billing Project Required</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Người dùng phải chọn API Key từ một "Paid Project" trong Google AI Studio để sử dụng mô hình Gemini 3 Pro.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-blue-500/20">
                  <p className="text-sm font-bold text-gray-200">Billing Docs</p>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">Xem hướng dẫn thanh toán</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <CodeOutput output={output} />
            
            {!output && !isLoading && (
              <div className="h-full min-h-[550px] flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-[2.5rem] bg-[#080808]/50 p-12 text-center">
                <div className="w-28 h-28 bg-gray-900 rounded-[2rem] flex items-center justify-center mb-10 border border-gray-800 shadow-2xl">
                  <ICONS.Chart />
                </div>
                <h3 className="text-3xl font-black mb-6">Ready for Alpha?</h3>
                <p className="text-gray-500 max-w-sm mb-12 text-lg leading-relaxed">
                  Chọn các module chiến lược và nhấn nút "Generate" để AI thiết kế bộ chỉ báo tối ưu.
                </p>
                <div className="flex flex-wrap justify-center gap-4 opacity-50">
                  {['PINE V5', 'NON-REPAINT', 'SMC LOGIC', 'ATR MANAGEMENT'].map(tag => (
                    <span key={tag} className="px-5 py-2 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-900 mt-20 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center font-black text-black text-sm shadow-xl">X</div>
            <div>
              <p className="text-white font-bold text-sm">XAU PRO ASSISTANT</p>
              <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Powered by Gemini 3 Pro AI</p>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors">Google Billing</a>
            <a href="#" className="hover:text-white transition-colors">Pine Docs</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
