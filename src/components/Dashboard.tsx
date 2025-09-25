import { useState } from 'react'
import CreateEnvelopeCard from './CreateEnvelopeCard'
import ClaimEnvelopeCard from './ClaimEnvelopeCard'
import EnvelopeGrid from './EnvelopeGrid'
import StatsCard from './StatsCard'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'claim' | 'history'>('create')

  return (
    <section id="dashboard" className="relative px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dashboard
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage your red envelopes, track distributions, and claim rewards all in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Active Envelopes"
            value="12"
            change="+3"
            icon="📮"
            trend="up"
          />
          <StatsCard
            title="Total Sent"
            value="Ξ 4.56"
            change="+0.23"
            icon="💰"
            trend="up"
          />
          <StatsCard
            title="Total Received"
            value="Ξ 2.34"
            change="+0.15"
            icon="🎁"
            trend="up"
          />
          <StatsCard
            title="Participants"
            value="234"
            change="+12"
            icon="👥"
            trend="up"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'claim'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Claim
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'create' && <CreateEnvelopeCard />}
            {activeTab === 'claim' && <ClaimEnvelopeCard />}
            {activeTab === 'history' && <EnvelopeGrid />}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎲</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Random Envelope</p>
                        <p className="text-xs text-gray-400">Create with random distribution</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">⚖️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Fixed Envelope</p>
                        <p className="text-xs text-gray-400">Equal distribution for all</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">You created envelope #1234</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Claimed 0.05 ETH from #1122</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Your envelope #1100 expired</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}