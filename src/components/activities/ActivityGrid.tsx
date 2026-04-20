import { createClient } from '@/lib/supabase/server'
import ActivityCard from './ActivityCard'
import AddActivityButton from './AddActivityButton'

export default async function ActivityGrid() {
  const supabase = createClient()

  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch activities:', error)
  }

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
              Activities
            </h2>
            <p className="text-white/50">동아리의 모든 활동들</p>
          </div>
          <AddActivityButton />
        </div>

        {activities && activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/40 text-lg">활동이 아직 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  )
}
