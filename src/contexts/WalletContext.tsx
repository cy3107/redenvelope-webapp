import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BrowserProvider, Contract, formatEther } from 'ethers'
import type { Eip1193Provider } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@config/contract'
import toast from 'react-hot-toast'

interface WalletContextType {
  provider: BrowserProvider | null
  signer: any | null
  contract: Contract | any | null
  account: string | null
  balance: string
  chainId: number | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

type EthereumWithListeners = Eip1193Provider & {
  on?: (eventName: string, listener: (...args: any[]) => void) => void
  removeListener?: (eventName: string, listener: (...args: any[]) => void) => void
}

const applyMockContract = (mockContract: any) => {
  if (!mockContract) return null
  const account = mockContract.__account__ || '0x0000000000000000000000000000000000000000'
  const balance = mockContract.__balance__ || '0'
  const chainId = mockContract.__chainId__ || 31337
  return { mockContract, account, balance, chainId }
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<any | null>(null)
  const [contract, setContract] = useState<Contract | any | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const setupMockContract = (mockContract: any) => {
    const mockInfo = applyMockContract(mockContract)
    if (!mockInfo) return false
    setContract(mockInfo.mockContract)
    setAccount(mockInfo.account)
    setBalance(mockInfo.balance)
    setChainId(mockInfo.chainId)
    toast.success('已启用模拟钱包环境')
    return true
  }

  useEffect(() => {
    if (window.__MOCK_CONTRACT__) {
      setupMockContract(window.__MOCK_CONTRACT__)
    }
  }, [])

  const updateBalance = async (address: string, provider: BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address)
      setBalance(formatEther(balance))
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const connectWallet = async () => {
    if (window.__MOCK_CONTRACT__) {
      setupMockContract(window.__MOCK_CONTRACT__)
      return
    }

    const ethereum = window.ethereum as unknown as EthereumWithListeners | undefined
    if (!ethereum) {
      toast.error('请安装 MetaMask 钱包!')
      return
    }

    setIsConnecting(true)
    try {
      const providerInstance = new BrowserProvider(ethereum)
      const accounts = await providerInstance.send('eth_requestAccounts', [])

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const signerInstance = await providerInstance.getSigner()
      const network = await providerInstance.getNetwork()

      setProvider(providerInstance)
      setSigner(signerInstance)
      setAccount(accounts[0])
      setChainId(Number(network.chainId))

      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance)
      setContract(contractInstance)

      await updateBalance(accounts[0], providerInstance)

      toast.success('钱包连接成功!')
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      toast.error(error.message || '连接钱包失败')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAccount(null)
    setBalance('0')
    setChainId(null)
    toast.success('钱包已断开连接')
  }

  useEffect(() => {
    const ethereum = window.ethereum as unknown as EthereumWithListeners | undefined
    if (!ethereum) {
      return
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account && accounts[0]) {
        setAccount(accounts[0])
        if (provider) {
          updateBalance(accounts[0], provider)
        }
      }
    }

    const handleChainChanged = (changedChainId: string) => {
      setChainId(parseInt(changedChainId, 16))
      window.location.reload()
    }

    ethereum.on?.('accountsChanged', handleAccountsChanged)
    ethereum.on?.('chainChanged', handleChainChanged)

    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
      ethereum.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [account, provider])

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        balance,
        chainId,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
