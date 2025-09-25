import { useWallet } from '../contexts/WalletContext'
import { getNetworkName } from '../config/contract'

export default function Header() {
  const { account, balance, chainId, isConnecting, connectWallet, disconnectWallet } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="text-center text-white mb-8">
      <h1 className="text-5xl font-bold mb-4 animate-float">
        🧧 RedEnvelope DApp
      </h1>
      <p className="text-xl mb-6 opacity-90">去中心化红包系统</p>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
        {!account ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                连接中...
              </span>
            ) : (
              '连接钱包'
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">账户</span>
              <span className="font-mono">{formatAddress(account)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">余额</span>
              <span className="font-semibold">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">网络</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                chainId === 1 ? 'bg-green-500/20 text-green-300' :
                chainId === 11155111 ? 'bg-blue-500/20 text-blue-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {getNetworkName(chainId)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="w-full bg-red-500/20 text-red-300 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200"
            >
              断开连接
            </button>
          </div>
        )}
      </div>
    </div>
  )
}