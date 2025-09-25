export interface EnvelopeStatusInput {
  remainingCount: bigint
  totalCount: bigint
  expiresAt: bigint
  isActive: boolean
  hasClaimed?: boolean
  canClaim?: boolean
}

const isExpired = (expiresAt: bigint) => {
  const now = Math.floor(Date.now() / 1000)
  return Number(expiresAt) < now
}

export interface EnvelopeStatusResult {
  text: string
  color: string
  canGrab: boolean
}

export const getEnvelopeStatus = (
  envelope: EnvelopeStatusInput,
): EnvelopeStatusResult => {
  if (!envelope.isActive || isExpired(envelope.expiresAt)) {
    return { text: '已过期', color: 'text-gray-500', canGrab: false }
  }

  if (envelope.hasClaimed) {
    return { text: '已领取', color: 'text-blue-500', canGrab: false }
  }

  if (envelope.remainingCount === 0n) {
    return { text: '已抢完', color: 'text-orange-500', canGrab: false }
  }

  if (envelope.canClaim) {
    return { text: '可领取', color: 'text-green-500', canGrab: true }
  }

  return { text: '不可领', color: 'text-red-500', canGrab: false }
}
