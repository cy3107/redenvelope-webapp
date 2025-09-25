import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'
import WalletConnect from './components/WalletConnect'
import CreateEnvelope from './components/CreateEnvelope'
import EnvelopeList from './components/EnvelopeList'
import GrabModal from './components/GrabModal'

function AppContent() {
  const [activeTab, setActiveTab] = useState<'create' | 'grab'>('grab')
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧧</span>
              <h1 className="text-xl font-bold text-gray-800">红包 DApp</h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标签切换 */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('grab')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'grab'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            抢红包
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            发红包
          </button>
        </div>

        {/* 内容展示 */}
        {activeTab === 'grab' ? (
          <EnvelopeList onSelectEnvelope={setSelectedEnvelopeId} />
        ) : (
          <CreateEnvelope />
        )}
      </div>

      {/* 抢红包弹窗 */}
      {selectedEnvelopeId !== null && (
        <GrabModal
          envelopeId={selectedEnvelopeId}
          onClose={() => setSelectedEnvelopeId(null)}
        />
      )}

      <Toaster position="top-center" />
    </div>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App