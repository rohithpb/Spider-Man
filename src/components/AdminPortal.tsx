import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Upload,
  Database,
  Film,
  Play,
  Check,
  Copy,
  ExternalLink,
  Info,
  RotateCcw,
  Trash2,
  Sparkles,
  Radio,
  FileVideo,
  Key,
  Globe,
  HardDrive,
  Eye,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import {
  supabaseService,
  SupabaseConfig,
  VideoRecord,
} from '../services/supabaseService'

interface AdminPortalProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_ADMIN_PASSCODE = 'spidey2026'

const SQL_SCRIPT = `-- 1. Enable public access to 'videos' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if already created
DROP POLICY IF EXISTS "Allow public uploads to videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from videos bucket" ON storage.objects;

-- 3. Allow public uploads (INSERT)
CREATE POLICY "Allow public uploads to videos bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');

-- 4. Allow public streaming / viewing (SELECT)
CREATE POLICY "Allow public select from videos bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- 5. Allow updating videos (UPDATE)
CREATE POLICY "Allow public update to videos bucket"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'videos');

-- 6. Allow deleting videos (DELETE)
CREATE POLICY "Allow public delete from videos bucket"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'videos');`

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('spidey_admin_auth') === 'true'
    } catch {
      return false
    }
  })
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState(false)

  // Active Tab
  const [activeTab, setActiveTab] = useState<'upload' | 'active' | 'supabase' | 'bucket'>('upload')

  // Supabase Configuration State
  const [config, setConfig] = useState<SupabaseConfig>(supabaseService.getConfig())
  const [configSaved, setConfigSaved] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(supabaseService.isConfigured())

  // Video Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Stored Videos in Supabase
  const [storedVideos, setStoredVideos] = useState<VideoRecord[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)

  // Active Video
  const [currentActiveVideo, setCurrentActiveVideo] = useState<string | null>(
    supabaseService.getActiveVideo()
  )

  // Direct / Manual Video URL
  const [manualVideoUrl, setManualVideoUrl] = useState('')
  const [manualVideoTitle, setManualVideoTitle] = useState('')
  const [manualVideoSaved, setManualVideoSaved] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync state
  useEffect(() => {
    const sync = () => {
      setConfig(supabaseService.getConfig())
      setIsConfigured(supabaseService.isConfigured())
      setCurrentActiveVideo(supabaseService.getActiveVideo())
    }

    sync()
    const unsubscribe = supabaseService.subscribe(sync)
    return () => unsubscribe()
  }, [isOpen])

  // Fetch bucket videos when tab is switched
  useEffect(() => {
    if (activeTab === 'bucket' && isConfigured) {
      loadBucketVideos()
    }
  }, [activeTab, isConfigured])

  const loadBucketVideos = async () => {
    setIsLoadingVideos(true)
    try {
      const videos = await supabaseService.listVideos()
      setStoredVideos(videos)
    } catch {
      setStoredVideos([])
    } finally {
      setIsLoadingVideos(false)
    }
  }

  if (!isOpen) return null

  // Passcode verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.trim() === DEFAULT_ADMIN_PASSCODE) {
      setIsAuthenticated(true)
      setPasscodeError(false)
      try {
        sessionStorage.setItem('spidey_admin_auth', 'true')
      } catch {
        // ignore
      }
    } else {
      setPasscodeError(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasscode('')
    try {
      sessionStorage.removeItem('spidey_admin_auth')
    } catch {
      // ignore
    }
  }

  // Save Supabase Configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    setConfigError(null)

    if (!config.url.trim() || !config.anonKey.trim()) {
      setConfigError('Both Project URL and Anon Key are required.')
      return
    }

    const ok = supabaseService.saveConfig(
      config.url.trim(),
      config.anonKey.trim(),
      config.bucketName.trim() || 'videos'
    )

    if (ok) {
      setConfigSaved(true)
      setTimeout(() => setConfigSaved(false), 2000)
    } else {
      setConfigError('Failed to initialize Supabase client with provided credentials.')
    }
  }

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  // Upload video file to Supabase
  const handleUpload = async () => {
    if (!selectedFile) return
    if (!isConfigured) {
      setActiveTab('supabase')
      setConfigError('Please connect your Supabase credentials first before uploading!')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)
    setUploadError(null)
    setUploadSuccessUrl(null)

    const result = await supabaseService.uploadVideo(selectedFile, (pct) => {
      setUploadProgress(pct)
    })

    setIsUploading(false)

    if (result.success && result.publicUrl) {
      setUploadSuccessUrl(result.publicUrl)
      setCurrentActiveVideo(result.publicUrl)
      setSelectedFile(null)
      loadBucketVideos()
    } else {
      setUploadError(result.error || 'Upload failed. Check your Supabase configuration.')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleMakeActive = (url: string, title?: string) => {
    supabaseService.setActiveVideo(url, title || 'Spider-Man Rescue Video')
    setCurrentActiveVideo(url)
  }

  const handleDeleteVideo = async (fileName: string) => {
    if (window.confirm(`Delete ${fileName} from Supabase storage?`)) {
      await supabaseService.deleteVideo(fileName)
      loadBucketVideos()
    }
  }

  const handleSaveManualUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualVideoUrl.trim()) return
    supabaseService.setActiveVideo(
      manualVideoUrl.trim(),
      manualVideoTitle.trim() || 'Spider-Man Rescue Video'
    )
    setCurrentActiveVideo(manualVideoUrl.trim())
    setManualVideoSaved(true)
    setTimeout(() => setManualVideoSaved(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-web-shoot">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-red-500/40 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-sky-950 border-b border-red-900/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-400 flex items-center justify-center shadow-spider-glow flex-shrink-0 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Spider-Man Admin Portal
                </h3>
                <Badge
                  variant={isConfigured ? 'spidey' : 'outline'}
                  className="text-[10px] py-0 px-1.5"
                >
                  {isConfigured ? 'SUPABASE CONNECTED' : 'SUPABASE DISCONNECTED'}
                </Badge>
              </div>
              <p className="text-xs text-sky-400">
                Cloud Video Storage & Superhero Website Command Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="btn-liquid-glass btn-liquid-dark px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                title="Lock admin session"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-liquid-glass btn-liquid-dark p-2 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center text-red-400 shadow-spider-glow">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-lg font-black text-white">Spider-Man Dispatch Admin Access</h4>
              <p className="text-xs text-slate-400">
                Enter your administrative passcode to manage Supabase database and upload showcase
                videos.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <Input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (default: spidey2026)"
                  className={`bg-slate-900 border-slate-700 h-11 text-center text-sm ${
                    passcodeError ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                  autoFocus
                />
              </div>

              {passcodeError && (
                <p className="text-xs text-red-400 font-semibold animate-shake">
                  Incorrect passcode. Hint: <span className="font-mono">spidey2026</span>
                </p>
              )}

              <Button type="submit" variant="spidey" size="sm" className="w-full h-11 text-sm font-bold shadow-spider-glow">
                <span>Unlock Admin Portal</span>
                <Unlock className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Tab Navigation */}
            <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-red-600 text-white shadow-spider-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Video</span>
                </button>

                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'active'
                      ? 'bg-red-600 text-white shadow-spider-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Active Video</span>
                </button>

                <button
                  onClick={() => setActiveTab('bucket')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'bucket'
                      ? 'bg-red-600 text-white shadow-spider-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Stored Videos</span>
                </button>

                <button
                  onClick={() => setActiveTab('supabase')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'supabase'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Supabase Credentials</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-400 font-mono text-[11px]">
                  Bucket: <span className="text-white font-bold">{config.bucketName || 'videos'}</span>
                </span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-200">
              {/* TAB 1: UPLOAD VIDEO */}
              {activeTab === 'upload' && (
                <div className="space-y-5">
                  {!isConfigured && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>
                          Supabase is not connected yet. You can paste your credentials in the{' '}
                          <button
                            onClick={() => setActiveTab('supabase')}
                            className="font-bold underline text-white hover:text-amber-300"
                          >
                            Supabase Credentials
                          </button>{' '}
                          tab to start uploading!
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab('supabase')}
                        className="text-xs h-7 border-amber-600 text-amber-200"
                      >
                        Connect Now
                      </Button>
                    </div>
                  )}

                  {/* Dropzone File Picker */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 sm:p-10 rounded-2xl border-2 border-dashed border-red-500/40 hover:border-red-400 bg-red-950/20 hover:bg-red-950/30 transition-all text-center cursor-pointer space-y-3 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/mkv"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-spider-glow">
                      <FileVideo className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                        {selectedFile
                          ? `Selected: ${selectedFile.name}`
                          : 'Click to select your Spider-Man video to upload to Supabase'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                          : 'Supports MP4, WebM, MOV, and MKV files'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        Uploads directly to your Supabase Storage Bucket
                      </span>
                    </div>
                  </div>

                  {/* Upload Options & Action */}
                  {selectedFile && (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                          Video Title
                        </label>
                        <Input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="e.g. Spider-Man Saving Citizens In Queens"
                          className="bg-slate-950 border-slate-700 text-xs h-10"
                        />
                      </div>

                      {isUploading && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Uploading to Supabase Storage...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-600 to-sky-400 h-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div className="p-4 rounded-xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs space-y-2.5">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-bold text-red-100">Upload Blocked by Supabase Storage Policy</p>
                              <p className="text-red-300 leading-relaxed">{uploadError}</p>
                            </div>
                          </div>

                          {(uploadError.toLowerCase().includes('row-level security') ||
                            uploadError.toLowerCase().includes('policy') ||
                            uploadError.toLowerCase().includes('bucket')) && (
                            <div className="p-3 rounded-lg bg-slate-950/90 border border-red-900/60 space-y-2 mt-2">
                              <p className="font-semibold text-white text-[11px]">
                                ⚡ Quick 5-Second Fix in Supabase:
                              </p>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                Supabase Storage requires an <strong>RLS INSERT policy</strong> to allow uploads. Copy this SQL snippet and run it in your Supabase SQL Editor:
                              </p>
                              <div className="flex items-center gap-2 pt-1 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(SQL_SCRIPT)
                                    alert('SQL snippet copied! Open Supabase -> SQL Editor -> New Query -> Paste & Run.')
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy 1-Click SQL Fix</span>
                                </button>
                                <a
                                  href={`https://supabase.com/dashboard/project/${config.url ? config.url.replace('https://', '').replace('.supabase.co', '') : 'filxwumtdbjmucvcezze'}/sql/new`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white font-semibold text-[11px] flex items-center gap-1.5"
                                >
                                  <span>Open Supabase SQL Editor</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          disabled={isUploading}
                          className="text-xs border-slate-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="spidey"
                          size="sm"
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="text-xs shadow-spider-glow"
                        >
                          {isUploading ? 'Uploading...' : 'Upload & Set as Active Video'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Upload Success Feedback Card */}
                  {uploadSuccessUrl && (
                    <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Check className="w-5 h-5" />
                        <span>Video Uploaded & Published to Supabase!</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        This video is now active on the public website! Anyone clicking "Watch Spidey
                        Helping Others" will watch this video.
                      </p>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-sky-300">
                        <span className="truncate">{uploadSuccessUrl}</span>
                        <button
                          onClick={() => handleCopyUrl(uploadSuccessUrl)}
                          className="p-1 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                          title="Copy public URL"
                        >
                          {copiedUrl ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ALTERNATIVE: Direct Video URL or Supabase URL */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 mt-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Alternative: Paste Direct Supabase Video URL
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Upload directly in your Supabase dashboard (zero permissions or RLS restrictions) & paste its URL here
                          </p>
                        </div>
                      </div>

                      <a
                        href="https://supabase.com/dashboard/project/filxwumtdbjmucvcezze/storage/buckets/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <span>Open Supabase Storage</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <form onSubmit={handleSaveManualUrl} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                          Direct Video URL (Supabase, CDN, or MP4 Link)
                        </label>
                        <Input
                          type="url"
                          value={manualVideoUrl}
                          onChange={(e) => setManualVideoUrl(e.target.value)}
                          placeholder="https://filxwumtdbjmucvcezze.supabase.co/storage/v1/object/public/videos/your-video.mp4"
                          className="bg-slate-950 border-slate-700 text-xs h-10 font-mono text-sky-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                            Video Title (Optional)
                          </label>
                          <Input
                            type="text"
                            value={manualVideoTitle}
                            onChange={(e) => setManualVideoTitle(e.target.value)}
                            placeholder="Spider-Man Helping Citizens"
                            className="bg-slate-950 border-slate-700 text-xs h-10"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="submit"
                            variant="spidey"
                            size="sm"
                            disabled={!manualVideoUrl.trim()}
                            className="w-full h-10 text-xs font-bold shadow-spider-glow"
                          >
                            <span>Save & Set as Active Video</span>
                            <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>

                      {manualVideoSaved && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Video URL set as active! Visitors can now watch it.</span>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE VIDEO PREVIEW */}
              {activeTab === 'active' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">Currently Active Video</h4>
                      <p className="text-xs text-slate-400">
                        This is the video that visitors watch when they click "Watch Spidey Helping
                        Others"
                      </p>
                    </div>

                    {currentActiveVideo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          supabaseService.clearActiveVideo()
                          setCurrentActiveVideo(null)
                        }}
                        className="text-xs border-red-500/50 text-red-300 hover:bg-red-950/50"
                      >
                        Reset to Official Trailer
                      </Button>
                    )}
                  </div>

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-red-500/40 bg-black shadow-2xl">
                    {currentActiveVideo ? (
                      <video
                        src={currentActiveVideo}
                        controls
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain"
                        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                      />
                    ) : (
                      <iframe
                        src="https://www.youtube.com/embed/shW9i6k8cB0?rel=0"
                        title="Spider-Man Default Trailer"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Video Source:</span>
                      <span className="font-semibold text-white">
                        {currentActiveVideo ? 'Supabase Cloud Video' : 'Default Official Reel'}
                      </span>
                    </div>
                    {currentActiveVideo && (
                      <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Public Stream URL:</span>
                        <span className="font-mono text-sky-400 truncate max-w-md">
                          {currentActiveVideo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SUPABASE CREDENTIALS & HOW TO CONNECT */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  {/* Credentials Form */}
                  <form
                    onSubmit={handleSaveConfig}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-sky-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Supabase Project API Credentials
                        </h4>
                      </div>
                      <Badge variant={isConfigured ? 'spidey' : 'outline'} className="text-[10px]">
                        {isConfigured ? 'CONNECTED' : 'NOT CONNECTED'}
                      </Badge>
                    </div>

                    {/* URL */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Project URL (VITE_SUPABASE_URL)</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          https://xyz.supabase.co
                        </span>
                      </label>
                      <Input
                        type="url"
                        value={config.url}
                        onChange={(e) => setConfig((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://your-project-id.supabase.co"
                        className="bg-slate-950 border-slate-700 text-xs h-10 font-mono"
                      />
                    </div>

                    {/* Anon Key */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Project API Anon Key (VITE_SUPABASE_ANON_KEY)</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Public anon key (JWT)
                        </span>
                      </label>
                      <Input
                        type="password"
                        value={config.anonKey}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, anonKey: e.target.value }))
                        }
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="bg-slate-950 border-slate-700 text-xs h-10 font-mono"
                      />
                    </div>

                    {/* Storage Bucket */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Storage Bucket Name</span>
                        <span className="text-[11px] text-slate-500 font-mono">Default: videos</span>
                      </label>
                      <Input
                        type="text"
                        value={config.bucketName}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, bucketName: e.target.value }))
                        }
                        placeholder="videos"
                        className="bg-slate-950 border-slate-700 text-xs h-10 font-mono"
                      />
                    </div>

                    {configError && (
                      <p className="text-xs text-red-400 font-semibold">{configError}</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-400">
                        Saved in browser localStorage and .env
                      </span>
                      <Button
                        type="submit"
                        variant="spidey"
                        size="sm"
                        className="text-xs shadow-spider-glow"
                      >
                        {configSaved ? 'Connected & Saved!' : 'Save & Connect Supabase'}
                      </Button>
                    </div>
                  </form>

                  {/* Step-by-Step Instructions: What to Paste from Supabase */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-sky-950/40 border border-sky-500/30 space-y-4">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
                      <h4 className="text-sm font-bold text-white">
                        What to Copy & Paste from Supabase (Step-by-Step)
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <p className="font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                            1
                          </span>
                          Get your Project URL & Anon Key:
                        </p>
                        <p className="text-slate-400 pl-7">
                          Go to your{' '}
                          <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 underline font-semibold"
                          >
                            Supabase Dashboard
                          </a>{' '}
                          → Select your project → Click{' '}
                          <span className="text-white font-semibold">Project Settings (gear icon ⚙️)</span>{' '}
                          → Click <span className="text-white font-semibold">API</span>.
                        </p>
                        <p className="text-slate-400 pl-7">
                          • Copy the <span className="text-red-400 font-semibold">Project URL</span> and
                          paste it into the field above.
                          <br />• Copy the{' '}
                          <span className="text-red-400 font-semibold">
                            Project API Keys: anon (public)
                          </span>{' '}
                          and paste it into the field above.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <p className="font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                            2
                          </span>
                          Create the Public Storage Bucket:
                        </p>
                        <p className="text-slate-400 pl-7">
                          In Supabase, click <span className="text-white font-semibold">Storage</span> on
                          the left menu → Click{' '}
                          <span className="text-white font-semibold">New Bucket</span>.
                        </p>
                        <p className="text-slate-400 pl-7">
                          • Bucket Name: <span className="text-white font-mono font-bold">videos</span>
                          <br />• Enable switch:{' '}
                          <span className="text-emerald-400 font-bold">Public Bucket (ON)</span> (This
                          allows the video to be streamed directly on your website!).
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                              3
                            </span>
                            1-Click SQL Script (Optional Quick Setup):
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(SQL_SCRIPT)
                              alert('SQL Script copied to clipboard! Paste it into Supabase SQL Editor.')
                            }}
                            className="text-[11px] text-sky-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </button>
                        </div>
                        <p className="text-slate-400 pl-7">
                          You can also open the <strong>SQL Editor</strong> in Supabase and paste this
                          snippet to configure storage policies automatically:
                        </p>
                        <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                          {SQL_SCRIPT}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BUCKET VIDEOS LIST */}
              {activeTab === 'bucket' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">Videos in Supabase Bucket</h4>
                      <p className="text-xs text-slate-400">
                        Files stored in bucket '{config.bucketName || 'videos'}'
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadBucketVideos}
                      disabled={isLoadingVideos}
                      className="text-xs border-slate-700"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingVideos ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </Button>
                  </div>

                  {isLoadingVideos ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Connecting to Supabase Storage and loading files...
                    </div>
                  ) : storedVideos.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                      <FileVideo className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm font-semibold text-slate-300">No videos in bucket yet</p>
                      <p className="text-xs text-slate-500">
                        Upload your first video in the "Upload Video" tab above.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {storedVideos.map((vid) => (
                        <div
                          key={vid.id}
                          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 flex-wrap"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                              <Film className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                                {vid.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {vid.sizeBytes
                                  ? `${(vid.sizeBytes / (1024 * 1024)).toFixed(2)} MB • `
                                  : ''}
                                {new Date(vid.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {vid.isActive ? (
                              <span className="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                ACTIVE
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMakeActive(vid.publicUrl, vid.name)}
                                className="text-[11px] h-7 border-slate-700 text-sky-300 hover:text-white"
                              >
                                Set Active
                              </Button>
                            )}

                            <button
                              onClick={() => handleCopyUrl(vid.publicUrl)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Copy Public URL"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteVideo(vid.name)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/40 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete from bucket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Spider-Man Cloud Admin • Passcode Protected</span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-700 text-slate-200"
          >
            Close Admin
          </Button>
        </div>
      </div>
    </div>
  )
}
