export type EmergencyCategory =
  | "emergency"
  | "crime"
  | "grievance"
  | "neighborhood"
  | "lost_pet"
  | "support"

export interface GrievanceRequest {
  id: string
  name: string
  age: number | string
  location: string
  email: string
  category: EmergencyCategory
  grievance: string
  timestamp: string
  status: "dispatched" | "in_review" | "spidey_en_route"
  spiderTracerActive: boolean
}

export interface ChatMessage {
  id: string
  sender: "spidey" | "user"
  text: string
  timestamp: string
  options?: { label: string; value: string }[]
  inputType?: "text" | "number" | "email" | "options" | "none"
  meta?: {
    isTyping?: boolean
    action?: string
    audioCue?: "web" | "alert" | "success"
  }
}

export interface EmailDispatchResult {
  success: boolean
  provider: "emailjs" | "local_dispatcher"
  messageId?: string
  recipient: string
  timestamp: string
  payload: {
    subject: string
    to_name: string
    visitor_name: string
    visitor_age: string
    visitor_location: string
    visitor_email: string
    category: string
    grievance: string
    date_time: string
  }
}

export interface HeroTrack {
  id: string
  title: string
  artist: string
  colorA: string
  colorB: string
}
