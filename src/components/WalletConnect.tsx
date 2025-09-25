import { useWallet } from '../contexts/WalletContext'

export default function WalletConnect() {
  const { account, balance, isConnecting, connectWallet, disconnectWallet } = useWallet()

  if (!account) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
      >
        {isConnecting ? '连接中...' : '连接钱包'}
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm text-gray-500">余额</p>
        <p className="font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">账户</p>
        <p className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</p>
      </div>
      <button
        onClick={disconnectWallet}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        断开
      </button>
    </div>
  )
}