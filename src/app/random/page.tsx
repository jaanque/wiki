import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function RandomModelPage() {
  // Fetch a random model's slug
  // we first get the total count
  const { count, error: countError } = await supabase
    .from('models')
    .select('*', { count: 'exact', head: true })

  if (countError || !count) {
    redirect('/')
  }

  // Get a random offset
  const randomOffset = Math.floor(Math.random() * count)

  // Fetch only the slug from that offset
  const { data, error: modelError } = await supabase
    .from('models')
    .select('slug')
    .range(randomOffset, randomOffset)
    .single()

  if (modelError || !data) {
    redirect('/')
  }

  // Redirect to the model detail page
  redirect(`/ai/${data.slug}`)
}
