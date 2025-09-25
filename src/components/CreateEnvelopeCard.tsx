import { useState } from 'react'
import { parseEther } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

export default function CreateEnvelope() {
  const { contract, account } = useWallet()
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    amount: '0.1',
    count: '5',
    isRandom: true,
    duration: '3600',
    message: '恭喜发财，大吉大利！'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contract || !account) {
      toast.error('请先连接钱包')
      return
    }

    setIsCreating(true)
    try {
      const tx = await contract.createEnvelope(
        formData.count,
        formData.isRandom,
        formData.message,
        formData.duration,
        { value: parseEther(formData.amount) }
      )
      
      toast.loading('交易确认中...')
      const receipt = await tx.wait()
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'EnvelopeCreated'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = contract.interface.parseLog(event)
        const envelopeId = parsed?.args[0].toString()
        toast.success(`红包创建成功！ID: ${envelopeId}`)
        
        // 重置表单
        setFormData({
          amount: '0.1',
          count: '5',
          isRandom: true,
          duration: '3600',
          message: '恭喜发财，大吉大利！'
        })
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.reason || '创建失败')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-3xl mr-2">🎁</span>
        发红包
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              总金额 (ETH)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              红包个数
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={formData.count}
              onChange={(e) => setFormData({...formData, count: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            红包类型
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.isRandom}
                onChange={() => setFormData({...formData, isRandom: true})}
                className="mr-2"
              />
              <span>🎲 拼手气红包</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!formData.isRandom}
                onChange={() => setFormData({...formData, isRandom: false})}
                className="mr-2"
              />
              <span>⚖️ 普通红包</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            有效期
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="3600">1小时</option>
            <option value="21600">6小时</option>
            <option value="86400">1天</option>
            <option value="604800">7天</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            祝福语
          </label>
          <input
            type="text"
            maxLength={200}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="恭喜发财，大吉大利！"
          />
        </div>

        <button
          type="submit"
          disabled={!account || isCreating}
          className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? '创建中...' : '塞钱进红包'}
        </button>
      </form>
    </div>
  )
}