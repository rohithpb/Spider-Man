/**
 * Gemini AI Service for Brand New Day Superhero Portal
 * Extracts entities (Name, Age, Location, Email) from conversational user inputs
 * using Google Gemini API with smart local fallback algorithms.
 */

// Supported Gemini models in order of priority
const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash']

/**
 * Retrieve Gemini API Key from environment variables or localStorage
 */
export function getGeminiApiKey(): string {
  // 1. Vite environment variables (both VITE_ and GEMINI_ prefixes supported)
  const envKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
    (import.meta.env.GEMINI_API_KEY as string | undefined) ||
    ''

  if (envKey && envKey.trim()) {
    return envKey.trim()
  }

  // 2. Browser localStorage fallback
  try {
    const localKey = localStorage.getItem('gemini_api_key')
    if (localKey && localKey.trim()) {
      return localKey.trim()
    }
  } catch {
    // localStorage may be unavailable
  }

  return ''
}

/**
 * Save Gemini API Key to localStorage
 */
export function setGeminiApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim())
    } else {
      localStorage.removeItem('gemini_api_key')
    }
  } catch {
    // ignore
  }
}

/**
 * Check if a Gemini API key is configured
 */
export function hasGeminiApiKey(): boolean {
  return getGeminiApiKey().length > 0
}

/**
 * Core Gemini API Caller using direct REST endpoint
 */
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  let lastError: Error | null = null

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 60,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Gemini API (${model}) failed with HTTP ${response.status}: ${
            errorData?.error?.message || response.statusText
          }`
        )
      }

      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && typeof text === 'string') {
        return text.trim()
      }
    } catch (err) {
      lastError = err as Error
      // Try next model
      continue
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content')
}

// ==========================================
// FALLBACK RULE-BASED EXTRACTORS
// ==========================================

/**
 * Local rule-based fallback for name extraction
 * Turns "i am rohith", "my name is peter", "call me miles" -> "Rohith", "Peter", "Miles"
 */
export function fallbackExtractName(input: string): string {
  let text = input.trim()

  // Remove common greeting and intro patterns
  text = text.replace(
    /^(hello|hi|hey|yo|sup|greetings)?[\s,.]*(i am|i'm|im|my name is|name is|this is|call me|they call me|you can call me|it's|its)\s+/i,
    ''
  )

  // Remove trailing punctuation
  text = text.replace(/[.!?,;]+$/, '').trim()

  if (text.length > 0) {
    // Capitalize words properly
    return text
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return input.trim()
}

/**
 * Local rule-based fallback for age extraction
 * Turns "i am 24 years old" -> "24"
 */
export function fallbackExtractAge(input: string): string {
  const match = input.match(/\b(\d{1,3})\b/)
  if (match) {
    return match[1]
  }
  return input.trim()
}

/**
 * Local rule-based fallback for location extraction
 * Turns "I am in Queens, NY" -> "Queens, NY"
 */
export function fallbackExtractLocation(input: string): string {
  let text = input.trim()
  text = text.replace(
    /^(i am in|i live in|i am at|im at|im in|currently in|located at|located in|from)\s+/i,
    ''
  )
  text = text.replace(/[.!?,;]+$/, '').trim()
  return text || input.trim()
}

/**
 * Local rule-based fallback for email extraction
 */
export function fallbackExtractEmail(input: string): string {
  const match = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (match) {
    return match[0]
  }
  return input.trim()
}

// ==========================================
// GEMINI INTELLIGENT ENTITY EXTRACTORS
// ==========================================

/**
 * Intelligently extract the person's name using Gemini AI with seamless local fallback
 * Example: "i am rohith" -> "Rohith"
 */
export async function extractNameWithGemini(userInput: string): Promise<string> {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    // Immediate fallback when no key is set yet
    return fallbackExtractName(userInput)
  }

  const prompt = `You are an entity extraction engine for Spider-Man's superhero help portal.
The user was asked: "What's your name, neighbor?"
User response: "${userInput}"

TASK:
Extract ONLY the user's actual personal name or alias.
RULES:
1. Strip all introductory words such as "I am", "I'm", "my name is", "call me", "it's", "hey", "hello", etc.
2. Capitalize the name correctly (e.g., "Rohith", "Peter Parker").
3. Output ONLY the extracted name as plain text. Do NOT add quotes, markdown, explanations, or punctuation.
Examples:
- "i am rohith" -> "Rohith"
- "my name is miles morales" -> "Miles Morales"
- "just call me gwen" -> "Gwen"
- "rohith" -> "Rohith"`

  try {
    const geminiResult = await callGemini(prompt, apiKey)
    const cleanName = geminiResult.replace(/["'`]/g, '').trim()
    if (cleanName && cleanName.length > 0 && cleanName.length < 50) {
      return cleanName
    }
    return fallbackExtractName(userInput)
  } catch (err) {
    console.warn('Gemini name extraction failed, falling back to local extractor:', err)
    return fallbackExtractName(userInput)
  }
}

/**
 * Intelligently extract age using Gemini AI with fallback
 * Example: "I'm 24 years old" -> "24"
 */
export async function extractAgeWithGemini(userInput: string): Promise<string> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return fallbackExtractAge(userInput)
  }

  const prompt = `Extract only the numerical age as digits from this user response: "${userInput}".
Output only the digits (e.g. 24). If no age is found, output the original text.`

  try {
    const result = await callGemini(prompt, apiKey)
    const digits = result.match(/\d+/)
    if (digits) {
      return digits[0]
    }
    return fallbackExtractAge(userInput)
  } catch {
    return fallbackExtractAge(userInput)
  }
}

/**
 * Intelligently extract location using Gemini AI with fallback
 * Example: "I live over in Astoria, Queens" -> "Astoria, Queens"
 */
export async function extractLocationWithGemini(userInput: string): Promise<string> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return fallbackExtractLocation(userInput)
  }

  const prompt = `The user was asked for their location.
User response: "${userInput}"
Extract ONLY the clean location / address / neighborhood / city / borough. Remove phrases like "I live in", "I am currently at", "we are at", etc.
Output only the clean location name as plain text.`

  try {
    const result = await callGemini(prompt, apiKey)
    const cleanLoc = result.replace(/["'`]/g, '').trim()
    if (cleanLoc && cleanLoc.length > 0) {
      return cleanLoc
    }
    return fallbackExtractLocation(userInput)
  } catch {
    return fallbackExtractLocation(userInput)
  }
}

/**
 * Intelligently extract email using Gemini AI with fallback
 */
export async function extractEmailWithGemini(userInput: string): Promise<string> {
  return fallbackExtractEmail(userInput)
}
