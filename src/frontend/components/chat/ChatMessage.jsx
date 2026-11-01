import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  KeyRound,
  ShieldCheck,
  Cpu,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function ChatMessage({ message, onShortcutClick }) {
  const { setActiveModal } = useApp();
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApiKeyNotice = message.isError && (message.content.includes('API Key Belum') || message.content.includes('API_KEY'));

  return (
    <div
      className={`py-4 px-4 sm:px-5 rounded-2xl transition-all duration-150 border ${
        isAssistant
          ? message.isError 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 shadow-xs' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs dark:shadow-md'
          : 'bg-blue-600 text-white border-blue-600 ml-auto max-w-3xl shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md ${
            isAssistant
              ? message.isError
                ? 'bg-rose-600'
                : 'bg-gradient-to-tr from-blue-700 to-cyan-500 ring-1 ring-blue-400/40'
              : 'bg-blue-800'
          }`}
        >
          {isAssistant ? (
            message.isError ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          
          {/* Header Metadata */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${!isAssistant ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {isAssistant ? 'TalentLens AI Consultant' : 'Kandidat'}
              </span>
              {isAssistant && message.provider && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  <Cpu className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  {message.provider === 'gemini' 
                    ? `Gemini ${message.model}`
                    : message.provider === 'openai'
                      ? `OpenAI ${message.model}`
                      : 'RAG Semantic Engine'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {message.timestamp && (
                <span className={`text-[11px] font-medium ${!isAssistant ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {message.timestamp}
                </span>
              )}
              {isAssistant && (
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Salin Pesan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Attached Document Card */}
          {message.attachment && (
            <div className="mb-3 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs shadow-xs">
              <div className="w-6 h-6 rounded-md bg-blue-600/10 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[220px]">
                  {message.attachment.name}
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {formatBytes(message.attachment.size)} • Dokumen CV Terlampir
                </span>
              </div>
            </div>
          )}

          {/* Markdown Content */}
          <div className={`prose-chat select-text text-sm leading-relaxed ${!isAssistant ? 'text-white [&_strong]:text-white [&_p]:text-white [&_li]:text-white [&_a]:text-blue-100' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Action button if API key is missing */}
          {isApiKeyNotice && (
            <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-900/40 flex items-center gap-2">
              <button
                onClick={() => setActiveModal('api-settings')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Konfigurasi API Sekarang
              </button>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Kunci Gemini Gratis</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

