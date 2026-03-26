import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await supabase.from('models').select('name, slug').limit(5)

if (error) {
  console.error('Error fetching models:', error)
} else {
  console.log('Models found:', JSON.stringify(data, null, 2))
}
