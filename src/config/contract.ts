// 合约地址 - 部署后需要更新
export const CONTRACT_ADDRESS = (process.env.CONTRACT_ADDRESS as string | undefined) || '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// 合约 ABI - 只包含需要的函数
export const CONTRACT_ABI = [
  // 创建红包
  'function createEnvelope(uint256 _count, bool _isRandom, string memory _message, uint256 _duration) external payable returns (uint256)',

  // 领取红包
  'function claimEnvelope(uint256 _envelopeId) external',

  // 退款
  'function refundEnvelope(uint256 _envelopeId) external',

  // 批量处理过期红包
  'function processExpiredEnvelopes(uint256[] calldata _envelopeIds) external',

  // 查询函数
  'function getEnvelopeInfo(uint256 _envelopeId) external view returns (address creator, uint256 totalAmount, uint256 remainingAmount, uint256 totalCount, uint256 remainingCount, bool isRandom, bool isActive, string memory message, uint256 createdAt, uint256 expiresAt)',
  'function getTotalEnvelopes() external view returns (uint256)',
  'function hasClaimed(uint256 _envelopeId, address _user) external view returns (bool)',
  'function canClaim(uint256 _envelopeId, address _user) external view returns (bool canClaim, string memory reason)',
  'function getClaimAmount(uint256 _envelopeId, address _user) external view returns (uint256)',
  'function getClaimers(uint256 _envelopeId) external view returns (address[] memory)',

  // 管理函数
  'function pause() external',
  'function unpause() external',
  'function paused() external view returns (bool)',
  'function owner() external view returns (address)',

  // 常量
  'function MAX_COUNT() external view returns (uint256)',
  'function MAX_MESSAGE_LENGTH() external view returns (uint256)',
  'function MIN_EXPIRY() external view returns (uint256)',
  'function MAX_EXPIRY() external view returns (uint256)',

  // 事件
  'event EnvelopeCreated(uint256 indexed envelopeId, address indexed creator, uint256 totalAmount, uint256 totalCount, bool isRandom, string message, uint256 expiresAt)',
  'event EnvelopeClaimed(uint256 indexed envelopeId, address indexed claimer, uint256 amount, uint256 remainingCount, uint256 remainingAmount)',
  'event EnvelopeCompleted(uint256 indexed envelopeId, address indexed creator, uint256 totalAmount, uint256 totalCount)',
  'event EnvelopeRefunded(uint256 indexed envelopeId, address indexed creator, uint256 refundAmount)',
  'event EnvelopeExpired(uint256 indexed envelopeId, uint256 refundAmount)',
] as const

// 网络配置
export const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum Mainnet', currency: 'ETH', explorer: 'https://etherscan.io' },
  11155111: { name: 'Sepolia Testnet', currency: 'SepoliaETH', explorer: 'https://sepolia.etherscan.io' },
  31337: { name: 'Localhost', currency: 'ETH', explorer: '' },
} as const

// 获取网络名称
export const getNetworkName = (chainId: number | null): string => {
  if (!chainId) return 'Unknown'
  return SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${chainId}`
}

// 获取区块浏览器链接
export const getExplorerUrl = (chainId: number | null, hash: string): string => {
  if (!chainId) return ''
  const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]
  if (!chain || !chain.explorer) return ''
  return `${chain.explorer}/tx/${hash}`
}
