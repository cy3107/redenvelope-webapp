import { useState, useEffect, useMemo } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatEther } from 'ethers'
import toast from 'react-hot-toast'
import { getEnvelopeStatus } from '../utils/envelope'

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
  canClaim?: boolean
}

interface EnvelopeListProps {
  onSelectEnvelope: (id: number) => void
}

export default function EnvelopeList({ onSelectEnvelope }: EnvelopeListProps) {
  const { contract, account } = useWallet()
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchEnvelopes = async () => {
    if (!contract) return

    setIsLoading(true)
    try {
      const totalEnvelopes = await contract.getTotalEnvelopes()
      const count = Number(totalEnvelopes)

      const envelopeList: Envelope[] = []
      const startIndex = Math.max(0, count - 20)

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
            const [canClaim] = await contract.canClaim(i, account)
            envelope.canClaim = canClaim
          }

          envelopeList.push(envelope)
        } catch (error) {
          console.error(`Error fetching envelope ${i}:`, error)
        }
      }

      envelopeList.sort((a, b) => b.id - a.id)
      setEnvelopes(envelopeList)
    } catch (error) {
      console.error('Error:', error)
      toast.error('获取红包列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (contract) {
      fetchEnvelopes()
      const interval = setInterval(fetchEnvelopes, 10000)
      return () => clearInterval(interval)
    }
  }, [contract, account])

  const computedEnvelopes = useMemo(() =>
    envelopes.map((envelope) => ({
      ...envelope,
      status: getEnvelopeStatus({
        remainingCount: envelope.remainingCount,
        totalCount: envelope.totalCount,
        expiresAt: envelope.expiresAt,
        isActive: envelope.isActive,
        hasClaimed: envelope.hasClaimed,
        canClaim: envelope.canClaim,
      }),
    })),
  [envelopes])

  if (isLoading && envelopes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">加载红包列表...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="text-3xl mr-2">🧧</span>
          红包列表
        </h2>
        <button
          onClick={fetchEnvelopes}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {computedEnvelopes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <span className="text-6xl">📭</span>
          <p className="text-gray-500 mt-4">暂无红包</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {computedEnvelopes.map((envelope) => (
            <div
              key={envelope.id}
              className={`bg-white rounded-xl shadow-lg p-5 transition-all ${
                envelope.status.canGrab ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg">#{envelope.id}</p>
                  <p className="text-sm text-gray-500">
                    {envelope.creator.slice(0, 6)}...{envelope.creator.slice(-4)}
                  </p>
                </div>
                <span className={`text-sm font-medium ${envelope.status.color}`}>
                  {envelope.status.text}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-700 italic">"{envelope.message}"</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{envelope.isRandom ? '🎲 拼手气' : '⚖️ 普通'}</span>
                  <span>{Number(envelope.remainingCount)}/{Number(envelope.totalCount)} 个</span>
                </div>
                <p className="text-lg font-semibold text-red-500">
                  {formatEther(envelope.remainingAmount)} ETH
                </p>
              </div>

              {envelope.status.canGrab && (
                <button
                  onClick={() => onSelectEnvelope(envelope.id)}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  抢红包
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
