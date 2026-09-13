import React, { useState } from 'react'
import {
  X,
  Radio,
  Mail,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { GrievanceRequest } from '../types'
import { getStoredIncidents, getRecipientEmail } from '../services/emailService'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface IncidentLogModalProps {
  isOpen: boolean
  onClose: () => void
  incidents: GrievanceRequest[]
  onClearIncidents: () => void
}

export const IncidentLogModal: React.FC<IncidentLogModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onClearIncidents,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const recipientEmail = getRecipientEmail()

  if (!isOpen) return null

  const copyPayload = (incident: GrievanceRequest) => {
    const payload = {
      subject: `🦸 Someone Needs Your Help! [Emergency Alert - Spider-Man Dispatch #${incident.id.slice(-4)}]`,
      candidate_recipient: recipientEmail,
      visitor_name: incident.name,
      visitor_age: incident.age,
      visitor_location: incident.location,
      visitor_email: incident.email,
      category: incident.category,
      grievance: incident.grievance,
      date_and_time: new Date(incident.timestamp).toLocaleString(),
      status: 'AUTOMATICALLY_DISPATCHED_TO_PERSONAL_EMAIL',
    }

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopiedId(incident.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportAllAsJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(incidents, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `spidey-dispatches-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-web-shoot">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-red-500/30 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-950 via-slate-900 to-sky-950 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-900/80 border border-red-600 flex items-center justify-center text-white">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Spider-Tracer Incident & Email Dispatch Hub
                </h3>
                <Badge variant="spidey" className="text-[10px]">
                  {incidents.length} Dispatches
                </Badge>
              </div>
              <p className="text-xs text-slate-300">
                Automatic Email Notifications Sent to Candidate:{' '}
                <span className="text-sky-400 font-mono font-semibold">{recipientEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-liquid-glass btn-liquid-dark p-2 text-slate-300 hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Incident List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 web-grid">
          {incidents.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-3xl">
                🕷️
              </div>
              <h4 className="text-lg font-bold text-white">No Dispatches Logged Yet</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Open the Spider-Man Help Chatbot to submit a problem or grievance. Once submitted,
                the automatic email notification and Spider-Tracer incident will appear here in real-time!
              </p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-red-500/40 transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-sky-400">
                      ID: #{incident.id}
                    </span>
                    <Badge
                      variant={
                        incident.category === 'emergency'
                          ? 'destructive'
                          : incident.category === 'crime'
                          ? 'gold'
                          : 'spidey'
                      }
                      className="text-[10px]"
                    >
                      {incident.category.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(incident.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={() => copyPayload(incident)}
                      className="btn-liquid-glass btn-liquid-dark inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all"
                      title="Copy automated email payload"
                    >
                      {copiedId === incident.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied JSON!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-sky-400" />
                          <span>Copy Email Payload</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Subject Alert Banner */}
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-semibold text-white">
                      Subject: 🦸 Someone Needs Your Help!
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    AUTOMATICALLY GENERATED
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Visitor Name & Age
                    </span>
                    <span className="text-white font-semibold">
                      {incident.name} ({incident.age} yrs)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Location
                    </span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {incident.location}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Visitor Email
                    </span>
                    <span className="text-sky-300 font-mono font-medium truncate block">
                      {incident.email}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Candidate Email
                    </span>
                    <span className="text-emerald-300 font-mono font-medium truncate block">
                      {recipientEmail}
                    </span>
                  </div>
                </div>

                {/* Grievance Description */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Grievance / Request Submission:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-serif italic">
                    "{incident.grievance}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Storage: Persistent Browser Spider-Tracers ({incidents.length})
          </div>

          <div className="flex items-center gap-3">
            {incidents.length > 0 && (
              <>
                <Button
                  onClick={exportAllAsJSON}
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </Button>
                <Button
                  onClick={onClearIncidents}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Log</span>
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="spidey" size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
