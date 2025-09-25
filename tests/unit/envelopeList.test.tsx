import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import EnvelopeList from '@components/EnvelopeList'

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}))

const mockUseWallet = jest.fn()
jest.mock('@contexts/WalletContext', () => ({
  useWallet: () => mockUseWallet(),
}))

describe('EnvelopeList', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('renders empty state when there is no contract', () => {
    mockUseWallet.mockReturnValue({ contract: null, account: null })
    render(<EnvelopeList onSelectEnvelope={jest.fn()} />)
    expect(screen.getByText('暂无红包')).toBeInTheDocument()
  })

  it('renders envelope information from contract', async () => {
    jest.useFakeTimers()

    const mockContract = {
      getTotalEnvelopes: jest.fn().mockResolvedValue(1n),
      getEnvelopeInfo: jest.fn().mockResolvedValue([
        '0x1111111111111111111111111111111111111111',
        1000000000000000000n,
        500000000000000000n,
        5n,
        3n,
        false,
        true,
        '新年快乐',
        BigInt(Math.floor(Date.now() / 1000) - 10),
        BigInt(Math.floor(Date.now() / 1000) + 1000),
      ]),
      hasClaimed: jest.fn().mockResolvedValue(false),
      canClaim: jest.fn().mockResolvedValue([true]),
    }

    mockUseWallet.mockReturnValue({ contract: mockContract, account: '0xabc' })

    render(<EnvelopeList onSelectEnvelope={jest.fn()} />)

    await waitFor(() => {
      expect(mockContract.getEnvelopeInfo).toHaveBeenCalledWith(0)
    })

    expect(await screen.findByText(/新年快乐/)).toBeInTheDocument()
    expect(await screen.findByText(/0\.5 ETH/)).toBeInTheDocument()
    expect(screen.getByText('可领取')).toBeInTheDocument()
  })
})
