/**
 * Supabase Integration Service for Spider-Man Portal
 * Manages connection, video file uploads to Supabase Storage,
 * and video metadata synchronization.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  bucketName: string
}

export interface VideoRecord {
  id: string
  name: string
  publicUrl: string
  sizeBytes?: number
  createdAt: string
  isActive?: boolean
}

const STORAGE_URL_KEY = 'spidey_supabase_url'
const STORAGE_KEY_KEY = 'spidey_supabase_anon_key'
const STORAGE_BUCKET_KEY = 'spidey_supabase_bucket'
const ACTIVE_VIDEO_KEY = 'spidey_active_video_url'
const ACTIVE_VIDEO_TITLE_KEY = 'spidey_active_video_title'

const DEFAULT_BUCKET = 'videos'

class SupabaseService {
  private client: SupabaseClient | null = null
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    bucketName: DEFAULT_BUCKET,
  }
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.init()
  }

  private init() {
    // 1. Check Vite env variables
    const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || ''
    const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || ''

    // 2. Check localStorage fallback
    let localUrl = ''
    let localKey = ''
    let localBucket = DEFAULT_BUCKET
    try {
      localUrl = localStorage.getItem(STORAGE_URL_KEY) || ''
      localKey = localStorage.getItem(STORAGE_KEY_KEY) || ''
      localBucket = localStorage.getItem(STORAGE_BUCKET_KEY) || DEFAULT_BUCKET
    } catch {
      // ignore
    }

    const finalUrl = (localUrl || envUrl).trim()
    const finalKey = (localKey || envKey).trim()

    this.config = {
      url: finalUrl,
      anonKey: finalKey,
      bucketName: localBucket || DEFAULT_BUCKET,
    }

    if (finalUrl && finalKey) {
      try {
        this.client = createClient(finalUrl, finalKey)
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err)
        this.client = null
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config }
  }

  public isConfigured(): boolean {
    return Boolean(this.config.url && this.config.anonKey && this.client)
  }

  public saveConfig(url: string, anonKey: string, bucketName: string = DEFAULT_BUCKET): boolean {
    const cleanUrl = url.trim()
    const cleanKey = anonKey.trim()
    const cleanBucket = bucketName.trim() || DEFAULT_BUCKET

    try {
      if (cleanUrl) localStorage.setItem(STORAGE_URL_KEY, cleanUrl)
      else localStorage.removeItem(STORAGE_URL_KEY)

      if (cleanKey) localStorage.setItem(STORAGE_KEY_KEY, cleanKey)
      else localStorage.removeItem(STORAGE_KEY_KEY)

      localStorage.setItem(STORAGE_BUCKET_KEY, cleanBucket)
    } catch {
      // ignore
    }

    this.config = {
      url: cleanUrl,
      anonKey: cleanKey,
      bucketName: cleanBucket,
    }

    if (cleanUrl && cleanKey) {
      try {
        this.client = createClient(cleanUrl, cleanKey)
      } catch (err) {
        console.error('Error creating Supabase client:', err)
        this.client = null
        this.notify()
        return false
      }
    } else {
      this.client = null
    }

    this.notify()
    return true
  }

  public getClient(): SupabaseClient | null {
    return this.client
  }

  /**
   * Upload video file directly to Supabase Storage bucket
   */
  public async uploadVideo(
    file: File,
    onProgress?: (progressPct: number) => void
  ): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    if (!this.client || !this.isConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please enter your Project URL and Anon Key in Admin Settings.',
      }
    }

    const bucket = this.config.bucketName || DEFAULT_BUCKET
    const ext = file.name.split('.').pop() || 'mp4'
    const cleanFileName = `spidey_hero_${Date.now()}.${ext}`
    const filePath = `hero-rescues/${cleanFileName}`

    try {
      if (onProgress) onProgress(20)

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await this.client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        return {
          success: false,
          error: `${uploadError.message}. Make sure your bucket '${bucket}' exists and has Public access enabled!`,
        }
      }

      if (onProgress) onProgress(75)

      // Get public URL
      const { data: publicData } = this.client.storage.from(bucket).getPublicUrl(data.path)
      const publicUrl = publicData.publicUrl

      // Set this as the active showcase video
      this.setActiveVideo(publicUrl, file.name)

      // Optionally record in database table if table exists
      try {
        await this.client.from('spidey_videos').insert([
          {
            title: file.name,
            file_path: data.path,
            public_url: publicUrl,
            size_bytes: file.size,
            is_active: true,
            uploaded_at: new Date().toISOString(),
          },
        ])
      } catch {
        // Table is optional
      }

      if (onProgress) onProgress(100)

      return {
        success: true,
        publicUrl,
      }
    } catch (err: any) {
      console.error('Unexpected error during video upload:', err)
      return {
        success: false,
        error: err?.message || 'Failed to upload video to Supabase',
      }
    }
  }

  /**
   * List videos currently stored in the bucket
   */
  public async listVideos(): Promise<VideoRecord[]> {
    if (!this.client || !this.isConfigured()) return []

    const bucket = this.config.bucketName || DEFAULT_BUCKET
    const activeUrl = this.getActiveVideo()

    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .list('hero-rescues', {
          limit: 30,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error || !data) {
        return []
      }

      return data
        .filter((item) => item.name && !item.name.startsWith('.'))
        .map((item) => {
          const { data: urlData } = this.client!.storage
            .from(bucket)
            .getPublicUrl(`hero-rescues/${item.name}`)
          const publicUrl = urlData.publicUrl
          return {
            id: item.id || item.name,
            name: item.name,
            publicUrl,
            sizeBytes: item.metadata?.size,
            createdAt: item.created_at || new Date().toISOString(),
            isActive: activeUrl === publicUrl,
          }
        })
    } catch {
      return []
    }
  }

  /**
   * Set active video URL that the main website video player will display
   */
  public setActiveVideo(url: string, title: string = 'Spider-Man Rescue Video') {
    try {
      localStorage.setItem(ACTIVE_VIDEO_KEY, url)
      localStorage.setItem(ACTIVE_VIDEO_TITLE_KEY, title)
    } catch {
      // ignore
    }
    this.notify()
  }

  /**
   * Get active video URL
   */
  public getActiveVideo(): string | null {
    try {
      return localStorage.getItem(ACTIVE_VIDEO_KEY)
    } catch {
      return null
    }
  }

  public getActiveVideoTitle(): string {
    try {
      return localStorage.getItem(ACTIVE_VIDEO_TITLE_KEY) || 'Spider-Man Official Rescue Video'
    } catch {
      return 'Spider-Man Official Rescue Video'
    }
  }

  public clearActiveVideo() {
    try {
      localStorage.removeItem(ACTIVE_VIDEO_KEY)
      localStorage.removeItem(ACTIVE_VIDEO_TITLE_KEY)
    } catch {
      // ignore
    }
    this.notify()
  }

  /**
   * Delete video from bucket
   */
  public async deleteVideo(name: string): Promise<boolean> {
    if (!this.client || !this.isConfigured()) return false
    const bucket = this.config.bucketName || DEFAULT_BUCKET
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([`hero-rescues/${name}`])
      if (!error) {
        // If active video was this one, clear it
        const currentActive = this.getActiveVideo()
        if (currentActive && currentActive.includes(name)) {
          this.clearActiveVideo()
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

export const supabaseService = new SupabaseService()
