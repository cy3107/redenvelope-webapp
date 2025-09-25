import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatEther } from 'ethers'
import toast from 'react-hot-toast'

interface Envelope {
  id: number
  creator: string
  totalAmount: bigint
  remainingAmount: bigint
  totalCount: bigint
  remainingCount: bigint
  isRandom: boolean
  isActive: boolean
  message: string
  createdAt: bigint
  expiresAt: bigint
  hasClaimed?: boolean
}

export default function EnvelopeGrid() {
  const { contract, account } = useWallet()
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')

  const fetchEnvelopes = async () => {
    if (!contract) return

    setIsLoading(true)
    try {
      const totalEnvelopes = await contract.getTotalEnvelopes()
      const count = Number(totalEnvelopes)
      
      const envelopeList: Envelope[] = []
      const startIndex = Math.max(0, count - 30)
      
      for (let i = startIndex; i < count; i++) {
        try {
          const info = await contract.getEnvelopeInfo(i)
          const envelope: Envelope = {
            id: i,
            creator: info[0],
            totalAmount: info[1],
            remainingAmount: info[2],
            totalCount: info[3],
            remainingCount: info[4],
            isRandom: info[5],
            isActive: info[6],
            message: info[7],
            createdAt: info[8],
            expiresAt: info[9],
          }
          
          if (account) {
            envelope.hasClaimed = await contract.hasClaimed(i, account)
          }
          
          envelopeList.push(envelope)
        } catch (error) {
          console.error(`Error fetching envelope ${i}:`, error)
        }
      }
      
      envelopeList.sort((a, b) => b.id - a.id)
      setEnvelopes(envelopeList)
    } catch (error) {
      console.error('Error fetching envelopes:', error)
      toast.error('Failed to fetch envelopes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (contract) {
      fetchEnvelopes()
    }
  }, [contract, account])

  const getStatusBadge = (envelope: Envelope) => {
    const now = Date.now() / 1000
    const isExpired = Number(envelope.expiresAt) < now
    
    if (!envelope.isActive || isExpired) {
      return { label: 'Expired', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
    }
    if (envelope.hasClaimed) {
      return { label: 'Claimed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
    }
    if (envelope.remainingCount === 0n) {
      return { label: 'Empty', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
    }
    return { label: 'Active', color: 'bg-green-500/10 text-green-400 border-green-500/20' }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const filteredEnvelopes = envelopes.filter(envelope => {
    const now = Date.now() / 1000
    const isExpired = Number(envelope.expiresAt) < now
    
    if (filter === 'active') return envelope.isActive && !isExpired
    if (filter === 'expired') return !envelope.isActive || isExpired
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['all', 'active', 'expired'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={fetchEnvelopes}
          disabled={isLoading}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Grid */}
      {isLoading && envelopes.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-pink-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredEnvelopes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-400">No envelopes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEnvelopes.map((envelope) => {
            const status = getStatusBadge(envelope)
            return (
              <div
                key={envelope.id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg font-semibold text-white">#{envelope.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        by {formatAddress(envelope.creator)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {formatEther(envelope.totalAmount)} ETH
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(envelope.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-300 italic">"{envelope.message}"</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">
                          {envelope.isRandom ? '🎲 Random' : '⚖️ Fixed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400">Left:</span>
                        <span className="text-white">
                          {Number(envelope.remainingCount)}/{Number(envelope.totalCount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${100 - (Number(envelope.remainingCount) / Number(envelope.totalCount) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}