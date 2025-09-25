import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatEther } from 'ethers'
import toast from 'react-hot-toast'

interface GrabModalProps {
  envelopeId: number
  onClose: () => void
}

export default function GrabModal({ envelopeId, onClose }: GrabModalProps) {
  const { contract, account } = useWallet()
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [envelopeInfo, setEnvelopeInfo] = useState<any>(null)
  const [claimedAmount, setClaimedAmount] = useState<string | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    fetchEnvelopeInfo()
  }, [envelopeId])

  const fetchEnvelopeInfo = async () => {
    if (!contract) return

    try {
      const info = await contract.getEnvelopeInfo(envelopeId)
      setEnvelopeInfo({
        creator: info[0],
        totalAmount: info[1],
        remainingAmount: info[2],
        totalCount: info[3],
        remainingCount: info[4],
        isRandom: info[5],
        message: info[7],
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('获取红包信息失败')
      onClose()
    }
  }

  const handleGrab = async () => {
    if (!contract || !account) return

    setIsGrabbing(true)
    setShowAnimation(true)

    try {
      const tx = await contract.claimEnvelope(envelopeId)
      const receipt = await tx.wait()
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'EnvelopeClaimed'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = contract.interface.parseLog(event)
        const amount = parsed?.args[2]
        const ethAmount = formatEther(amount)
        setClaimedAmount(ethAmount)
        
        setTimeout(() => {
          toast.success(`恭喜！抢到 ${ethAmount} ETH！`, { 
            duration: 5000,
            icon: '🎉'
          })
        }, 1000)
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.reason || '抢红包失败')
      onClose()
    } finally {
      setIsGrabbing(false)
    }
  }

  if (!envelopeInfo) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 红包封面 */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white text-center">
          <div className={`text-6xl mb-4 ${showAnimation ? 'animate-bounce' : ''}`}>
            🧧
          </div>
          <h2 className="text-2xl font-bold mb-2">恭喜发财</h2>
          <p className="text-red-100">大吉大利</p>
        </div>

        {/* 红包内容 */}
        <div className="p-6">
          {!claimedAmount ? (
            <>
              {/* 红包信息 */}
              <div className="space-y-3 mb-6">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">来自</p>
                  <p className="font-mono text-sm">
                    {envelopeInfo.creator.slice(0, 6)}...{envelopeInfo.creator.slice(-4)}
                  </p>
                </div>
                
                <p className="text-center text-gray-700 italic">
                  "{envelopeInfo.message}"
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">类型：</span>
                    <span className="font-medium">
                      {envelopeInfo.isRandom ? '拼手气' : '普通'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">剩余：</span>
                    <span className="font-medium">
                      {Number(envelopeInfo.remainingCount)}/{Number(envelopeInfo.totalCount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 抢红包按钮 */}
              <button
                onClick={handleGrab}
                disabled={isGrabbing}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-red-900 rounded-xl font-bold text-xl hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-50 transform hover:scale-105"
              >
                {isGrabbing ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 border-2 border-red-900 border-t-transparent rounded-full mr-2"></span>
                    抢红包中...
                  </span>
                ) : (
                  '開'
                )}
              </button>
            </>
          ) : (
            /* 显示结果 */
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                抢到了！
              </h3>
              <div className="text-5xl font-bold text-red-500 mb-6">
                {claimedAmount} ETH
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          )}
        </div>

        {/* 关闭按钮 */}
        {!claimedAmount && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}