import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

export default function ClaimEnvelopeCard() {
  const { contract, account } = useWallet()
  const [envelopeId, setEnvelopeId] = useState('')
  const [isClaiming, setIsClaiming] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [canClaimStatus, setCanClaimStatus] = useState<{ canClaim: boolean; reason: string } | null>(null)
  const [envelopeInfo, setEnvelopeInfo] = useState<any>(null)

  const checkCanClaim = async () => {
    if (!contract || !account || !envelopeId) {
      toast.error('Please enter an envelope ID')
      return
    }

    setIsChecking(true)
    try {
      // Check if can claim
      const [canClaim, reason] = await contract.canClaim(envelopeId, account)
      setCanClaimStatus({ canClaim, reason })
      
      // Get envelope info
      const info = await contract.getEnvelopeInfo(envelopeId)
      setEnvelopeInfo({
        creator: info[0],
        totalAmount: info[1],
        remainingAmount: info[2],
        totalCount: info[3],
        remainingCount: info[4],
        isRandom: info[5],
        isActive: info[6],
        message: info[7],
      })
      
      if (!canClaim) {
        toast.error(`Cannot claim: ${reason}`)
      }
    } catch (error: any) {
      console.error('Error checking claim status:', error)
      toast.error('Failed to check envelope')
      setCanClaimStatus(null)
      setEnvelopeInfo(null)
    } finally {
      setIsChecking(false)
    }
  }

  const handleClaim = async () => {
    if (!contract || !account) {
      toast.error('Please connect wallet')
      return
    }

    if (!envelopeId) {
      toast.error('Please enter envelope ID')
      return
    }

    setIsClaiming(true)
    const toastId = toast.loading('Claiming envelope...')

    try {
      const tx = await contract.claimEnvelope(envelopeId)
      toast.loading('Waiting for confirmation...', { id: toastId })
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
        const ethAmount = (Number(amount) / 1e18).toFixed(4)
        toast.success(`Claimed ${ethAmount} ETH successfully!`, { id: toastId, duration: 5000 })
      } else {
        toast.success('Envelope claimed!', { id: toastId })
      }
      
      setEnvelopeId('')
      setCanClaimStatus(null)
      setEnvelopeInfo(null)
    } catch (error: any) {
      console.error('Error claiming:', error)
      toast.error(error.reason || 'Failed to claim', { id: toastId })
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b border-white/5">
        <h3 className="text-xl font-semibold text-white mb-2">Claim Red Envelope</h3>
        <p className="text-sm text-gray-400">Enter an envelope ID to claim your reward</p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Envelope ID
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={envelopeId}
              onChange={(e) => {
                setEnvelopeId(e.target.value)
                setCanClaimStatus(null)
                setEnvelopeInfo(null)
              }}
              min="0"
              placeholder="Enter envelope ID"
              className="flex-1 px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              disabled={isClaiming || isChecking}
            />
            <button
              onClick={checkCanClaim}
              disabled={!account || isChecking || isClaiming || !envelopeId}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>

        {/* Status Display */}
        {canClaimStatus && (
          <div className={`p-4 rounded-xl border ${
            canClaimStatus.canClaim 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start space-x-3">
              {canClaimStatus.canClaim ? (
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  canClaimStatus.canClaim ? 'text-green-400' : 'text-red-400'
                }`}>
                  {canClaimStatus.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Envelope Info */}
        {envelopeInfo && (
          <div className="bg-gray-900/50 rounded-xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Message</span>
              <span className="text-sm text-white">{envelopeInfo.message}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Type</span>
              <span className="text-sm text-white">
                {envelopeInfo.isRandom ? '🎲 Random' : '⚖️ Fixed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Remaining</span>
              <span className="text-sm text-white">
                {Number(envelopeInfo.remainingCount)}/{Number(envelopeInfo.totalCount)} envelopes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Pool</span>
              <span className="text-sm text-white">
                {(Number(envelopeInfo.remainingAmount) / 1e18).toFixed(4)} ETH
              </span>
            </div>
            {envelopeInfo.isRandom && (
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-gray-500">
                  Expected amount: ~{(Number(envelopeInfo.remainingAmount) / Number(envelopeInfo.remainingCount) / 1e18).toFixed(4)} ETH
                </p>
              </div>
            )}
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!account || isClaiming || !envelopeId || !canClaimStatus?.canClaim}
          className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200 group-disabled:opacity-30"></div>
          <div className="relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold">
            {isClaiming ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Claiming...</span>
              </span>
            ) : (
              'Claim Envelope'
            )}
          </div>
        </button>
      </div>
    </div>
  )
}