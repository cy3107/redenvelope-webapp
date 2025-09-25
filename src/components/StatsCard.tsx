interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
}

export default function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
          trend === 'up' 
            ? 'bg-green-500/10 text-green-400' 
            : trend === 'down'
            ? 'bg-red-500/10 text-red-400'
            : 'bg-gray-500/10 text-gray-400'
        }`}>
          {trend === 'up' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {trend === 'down' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  )
}