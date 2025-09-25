/// <reference types="cypress" />

describe('RedEnvelope DApp', () => {
  const mockEnvelope = {
    id: 0,
    creator: '0x1111111111111111111111111111111111111111',
    totalAmount: 1000000000000000000n,
    remainingAmount: 500000000000000000n,
    totalCount: 5n,
    remainingCount: 3n,
    isRandom: false,
    isActive: true,
    message: '新年快乐',
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 10),
    expiresAt: BigInt(Math.floor(Date.now() / 1000) + 3600),
    hasClaimed: false,
    canClaim: true,
  }

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__MOCK_CONTRACT__ = {
          __account__: '0x1234567890abcdef1234567890abcdef12345678',
          __balance__: '10.5',
          __chainId__: 31337,
          getTotalEnvelopes: () => Promise.resolve(1n),
          getEnvelopeInfo: () => Promise.resolve([
            mockEnvelope.creator,
            mockEnvelope.totalAmount,
            mockEnvelope.remainingAmount,
            mockEnvelope.totalCount,
            mockEnvelope.remainingCount,
            mockEnvelope.isRandom,
            mockEnvelope.isActive,
            mockEnvelope.message,
            mockEnvelope.createdAt,
            mockEnvelope.expiresAt,
          ]),
          hasClaimed: () => Promise.resolve(mockEnvelope.hasClaimed),
          canClaim: () => Promise.resolve([mockEnvelope.canClaim]),
          claimEnvelope: () =>
            Promise.resolve({
              wait: () =>
                Promise.resolve({
                  logs: [{}],
                }),
            }),
          interface: {
            parseLog: () => ({
              name: 'EnvelopeClaimed',
              args: [mockEnvelope.id, mockEnvelope.creator, 100000000000000000n],
            }),
          },
        }
      },
    })
  })

  it('displays envelopes and opens grab modal', () => {
    cy.contains('红包列表').should('be.visible')
    cy.contains('新年快乐').should('be.visible')
    cy.contains('抢红包').click()

    cy.contains('恭喜发财').should('be.visible')
    cy.contains('開').should('be.visible')
  })

  it('allows switching to create tab', () => {
    cy.contains('发红包').click()
    cy.contains('塞钱进红包').should('be.visible')
  })
})
