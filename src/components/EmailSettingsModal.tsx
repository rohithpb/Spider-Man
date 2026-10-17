import React, { useState } from 'react'
import { X, Mail, ShieldCheck, Save, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  getRecipientEmail,
  setRecipientEmail,
  DEFAULT_RECIPIENT,
} from '../services/emailService'
import { getGeminiApiKey, setGeminiApiKey } from '../services/geminiService'

interface EmailSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EmailSettingsModal: React.FC<EmailSettingsModalProps> = ({ isOpen, onClose }) => {
  const [recipient, setRecipient] = useState(getRecipientEmail())
  const [geminiKey, setGeminiKey] = useState(getGeminiApiKey())
  const [savedSuccess, setSavedSuccess] = useState(false)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setRecipientEmail(recipient.trim() || DEFAULT_RECIPIENT)
    setGeminiApiKey(geminiKey.trim())
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-web-shoot">
      <div className="relative w-full max-w-lg rounded-3xl border border-red-500/30 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-950 via-slate-900 to-sky-950 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-900/80 border border-red-600 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Automatic Email Dispatch Settings
              </h3>
              <p className="text-xs text-slate-300">
                Configure the candidate personal email for help alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-liquid-glass btn-liquid-dark p-2 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Target Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Candidate Recipient Email Address
            </label>
            <p className="text-xs text-slate-400">
              Where all automatic "🦸 Someone Needs Your Help!" notifications will be dispatched.
            </p>
            <Input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. your-email@domain.com"
              required
              className="bg-slate-900 border-slate-700"
            />
          </div>

          {/* Gemini AI Key Integration */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Gemini AI NLP Entity Extraction
              </span>
              <span className="text-[10px] text-sky-400 font-bold bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/40">
                .env Supported
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              When visitors enter conversational replies like <span className="text-slate-200">"i am rohith"</span>, Gemini automatically extracts and saves the clean name as <strong className="text-white">"Rohith"</strong>. Paste your key in <code className="text-sky-300">.env</code> as <code className="text-sky-300">VITE_GEMINI_API_KEY</code> or enter below:
            </p>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Google Gemini API Key</label>
              <Input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="h-9 text-xs bg-slate-950 font-mono border-slate-700"
              />
            </div>
          </div>


          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Email settings updated successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="spidey" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
