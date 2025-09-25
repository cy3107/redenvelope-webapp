interface EthereumProvider {
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
    __MOCK_CONTRACT__?: any
  }
}

export {}
