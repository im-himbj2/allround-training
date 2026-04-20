export interface Activity {
  id: string
  title: string
  summary: string
  content: string
  image_url: string | null
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface UserProfile {
  id: string
  email: string
}
