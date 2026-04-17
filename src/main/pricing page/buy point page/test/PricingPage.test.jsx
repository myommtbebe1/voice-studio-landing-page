import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PricingPage from '../../PricingPage'
import { AuthContext } from '../../../../contexts/AuthContext.jsx'

// ---- Hook mocks ----
vi.mock('../../../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => {
      const dict = {
        'pricing.buyPoints': 'Buy Points',
        'pricing.buy': 'Buy',
        'pricing.premium': 'Premium',
        'pricing.education': 'Education',
        'pricing.inviteFriends': 'Invite Friends',
        'pricing.invite': 'Invite',
        'pricing.recordVoice': 'Record Voice',
        'pricing.record': 'Record',
        'pricing.redeem': 'Redeem',
        'pricing.reportIssue': 'Report Issue',
        'pricing.reportIssueDesc': 'Report issue description',
        'pricing.contactSupport': 'Contact Support',
      }
      return dict[key] ?? key
    },
  }),
}))

vi.mock('../../../../hooks/usePointPackages.js', () => ({
  usePointPackages: () => ({
    packages: [{ level: 1, points: 200000, price: 70.49 }],
    loading: false,
  }),
}))

vi.mock('../../../../hooks/useAddOnPackages.js', () => ({
  useAddOnPackages: () => ({
    packages: [],
    loading: false,
    error: null,
  }),
}))

vi.mock('../../../../hooks/useSubscriptionPackage.js', () => ({
  useSubscriptionPackage: () => ({
    package: null,
    loading: false,
    error: null,
  }),
}))

// ---- Child component mocks to isolate PricingPage behavior ----
vi.mock('../../buy point page/PricingSections', () => ({
  default: ({ onPurchase, onViewSubscriptions }) => (
    <div>
      <p>BUY_POINTS_SECTION</p>
      <button onClick={() => onPurchase?.({ points: 5000, price: 10 })}>
        Trigger Purchase
      </button>
      <button onClick={() => onViewSubscriptions?.()}>Go Premium From Buy Points</button>
    </div>
  ),
}))

vi.mock('../../Premium/Components/Premiummembership', () => ({
  default: () => <div>PREMIUM_MEMBERSHIP_SECTION</div>,
}))

vi.mock('../../Premium/Premiumpage', () => ({
  default: () => <div>PREMIUM_ADDON_SECTION</div>,
}))

vi.mock('../Payment', () => ({
  default: ({ isOpen }) => (
    <div data-testid="payment-modal-state">{isOpen ? 'PAYMENT_OPEN' : 'PAYMENT_CLOSED'}</div>
  ),    
}))

function renderWithAuth(ui, { user = { uid: 'u1' }, authReady = true } = {}) {
  return render(
    <AuthContext.Provider value={{ user, authReady }}>
      {ui}
    </AuthContext.Provider>
  )
}

describe('PricingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Buy Points section by default', () => {
    renderWithAuth(<PricingPage />)

    expect(screen.getByText('BUY_POINTS_SECTION')).toBeInTheDocument()
    expect(screen.queryByText('PREMIUM_MEMBERSHIP_SECTION')).not.toBeInTheDocument()
    expect(screen.getByTestId('payment-modal-state')).toHaveTextContent('PAYMENT_CLOSED')
  })

  it('switches section from Buy Points to Premium via navbar button', async () => {
    const user = userEvent.setup()
    renderWithAuth(<PricingPage />)

    await user.click(screen.getByRole('button', { name: 'Premium' }))

    expect(screen.queryByText('BUY_POINTS_SECTION')).not.toBeInTheDocument()
    expect(screen.getByText('PREMIUM_MEMBERSHIP_SECTION')).toBeInTheDocument()
    expect(screen.getByText('PREMIUM_ADDON_SECTION')).toBeInTheDocument()
  })

  it('opens Payment when onPurchase is triggered from Buy Points section', async () => {
    const user = userEvent.setup()
    renderWithAuth(<PricingPage />)

    await user.click(screen.getByRole('button', { name: 'Trigger Purchase' }))

    expect(screen.getByTestId('payment-modal-state')).toHaveTextContent('PAYMENT_OPEN')
  })

  it('switches to Premium via PricingSections callback (onViewSubscriptions)', async () => {
    const user = userEvent.setup()
    renderWithAuth(<PricingPage />)

    await user.click(screen.getByRole('button', { name: 'Go Premium From Buy Points' }))

    expect(screen.getByText('PREMIUM_MEMBERSHIP_SECTION')).toBeInTheDocument()
  })
})
