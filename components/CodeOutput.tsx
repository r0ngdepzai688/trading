
import React, { useState } from 'react';
import { PineScriptOutput } from '../types';
import { ICONS } from '../constants';

interface CodeOutputProps {
  output: PineScriptOutput | null;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ output }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-gray-700 rounded-xl bg-[#121212]/50 text-gray-500">
        <ICONS.Terminal />
        <p className="mt-4 font-medium">Configure and generate to see the script</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40">
          <div className="flex items-center gap-3">
            <ICONS.Terminal />
            <span className="font-bold text-gray-300">TradingView Pine Script (V5)</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all border border-gray-700"
          >
            {copied ? <ICONS.Check /> : <ICONS.Copy />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-0 bg-[#0d0d0d]">
          <pre className="p-6 text-sm mono text-yellow-500 overflow-x-auto h-[400px] leading-relaxed">
            {output.code}
          </pre>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <ICONS.Brain /> Expert Analysis
        </h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          {output.explanation}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {output.keyFeatures.map((feature, i) => (
            <div key={i} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-sm text-gray-300">
              <span className="text-yellow-500 mr-2">✦</span> {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;
