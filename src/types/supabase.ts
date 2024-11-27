export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: InsertProfile
        Update: UpdateProfile
      }
      summaries: {
        Row: Summary
        Insert: InsertSummary
        Update: UpdateSummary
      }
      user_credits: {
        Row: UserCredits
        Insert: InsertUserCredits
        Update: UpdateUserCredits
      }
      podcast_feeds: {
        Row: PodcastFeed
        Insert: InsertPodcastFeed
        Update: UpdatePodcastFeed
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  subscription_tier: 'free' | 'premium'
  created_at: string
  updated_at: string
}

export type InsertProfile = Omit<Profile, 'created_at' | 'updated_at'>
export type UpdateProfile = Partial<InsertProfile>

export interface Summary {
  id: string
  user_id: string
  podcast_id: string
  episode_id: string
  summary_text: string
  key_points: Json | null
  created_at: string
}

export type InsertSummary = Omit<Summary, 'id' | 'created_at'>
export type UpdateSummary = Partial<InsertSummary>

export interface UserCredits {
  id: string
  user_id: string
  month: string
  summaries_used: number
  created_at: string
  updated_at: string
}

export type InsertUserCredits = Omit<UserCredits, 'id' | 'created_at' | 'updated_at'>
export type UpdateUserCredits = Partial<InsertUserCredits>

export interface PodcastFeed {
  id: string
  podcast_id: string
  feed_data: Json
  last_fetched: string
  created_at: string
}

export type InsertPodcastFeed = Omit<PodcastFeed, 'id' | 'created_at'>
export type UpdatePodcastFeed = Partial<InsertPodcastFeed>