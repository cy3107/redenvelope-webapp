import { useWallet } from '../contexts/WalletContext'

export default function Hero() {
  const { account, connectWallet } = useWallet()

  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-300">Live on Ethereum</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">
              Send Digital
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400">
              Red Envelopes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the tradition of gift-giving on the blockchain. 
            Create and claim red envelopes with random or fixed distributions, 
            secured by smart contracts.
          </p>

          {/* CTAs */}
          {!account ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={connectWallet}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-200"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              <a
                href="#learn-more"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-3">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-400 font-medium">Wallet Connected</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1,234</div>
              <div className="text-sm text-gray-400">Red Envelopes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                <span className="text-2xl">Ξ</span> 567.89
              </div>
              <div className="text-sm text-gray-400">Total Value Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">8,901</div>
              <div className="text-sm text-gray-400">Happy Recipients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10"></div>
      </div>
      <div className="absolute top-1/3 right-10 animate-float animation-delay-2000">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-white/10"></div>
      </div>
      <div className="absolute bottom-10 left-1/4 animate-float animation-delay-4000">
        <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl backdrop-blur-sm border border-white/10"></div>
      </div>
    </section>
  )
}