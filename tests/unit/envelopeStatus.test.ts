import { getEnvelopeStatus } from '@utils/envelope'

describe('getEnvelopeStatus', () => {
  const baseEnvelope = {
    remainingCount: 1n,
    totalCount: 5n,
    expiresAt: BigInt(Math.floor(Date.now() / 1000) + 60),
    isActive: true,
  }

  it('returns expired when envelope inactive', () => {
    expect(
      getEnvelopeStatus({
        ...baseEnvelope,
        isActive: false,
      }),
    ).toEqual({ text: '已过期', color: 'text-gray-500', canGrab: false })
  })

  it('returns expired when expiresAt is past', () => {
    expect(
      getEnvelopeStatus({
        ...baseEnvelope,
        expiresAt: BigInt(Math.floor(Date.now() / 1000) - 10),
      }),
    ).toEqual({ text: '已过期', color: 'text-gray-500', canGrab: false })
  })

  it('returns claimed state', () => {
    expect(
      getEnvelopeStatus({
        ...baseEnvelope,
        hasClaimed: true,
      }),
    ).toEqual({ text: '已领取', color: 'text-blue-500', canGrab: false })
  })

  it('returns soldout when remainingCount is zero', () => {
    expect(
      getEnvelopeStatus({
        ...baseEnvelope,
        remainingCount: 0n,
      }),
    ).toEqual({ text: '已抢完', color: 'text-orange-500', canGrab: false })
  })

  it('returns claimable when canClaim is true', () => {
    expect(
      getEnvelopeStatus({
        ...baseEnvelope,
        canClaim: true,
      }),
    ).toEqual({ text: '可领取', color: 'text-green-500', canGrab: true })
  })

  it('returns default not claimable state', () => {
    expect(getEnvelopeStatus(baseEnvelope)).toEqual({
      text: '不可领',
      color: 'text-red-500',
      canGrab: false,
    })
  })
})
