import { useWallet } from '../contexts/WalletContext'
import { getNetworkName } from '../config/contract'

export default function Navbar() {
  const { account, balance, chainId, isConnecting, connectWallet, disconnectWallet } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <span className="text-white text-xl">🧧</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">RedEnvelope</h1>
                <p className="text-gray-400 text-xs">Decentralized Gifting</p>
              </div>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </a>
            <a href="#create" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Create
            </a>
            <a href="#claim" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Claim
            </a>
            <a href="#history" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              History
            </a>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-6 py-2.5 bg-gray-900 rounded-lg text-white font-medium text-sm hover:bg-gray-800 transition-all">
                  {isConnecting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Connecting...</span>
                    </span>
                  ) : (
                    'Connect Wallet'
                  )}
                </div>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Network Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 ${
                  chainId === 1 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : chainId === 11155111 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    chainId === 1 ? 'bg-green-400' : chainId === 11155111 ? 'bg-blue-400' : 'bg-yellow-400'
                  } animate-pulse`}></div>
                  <span>{getNetworkName(chainId)}</span>
                </div>

                {/* Account Info */}
                <div className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/5">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Balance</p>
                    <p className="text-sm font-semibold text-white">{parseFloat(balance).toFixed(4)} ETH</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    <div>
                      <p className="text-xs text-gray-400">Account</p>
                      <p className="text-sm font-mono text-white">{formatAddress(account)}</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="ml-2 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Disconnect"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}