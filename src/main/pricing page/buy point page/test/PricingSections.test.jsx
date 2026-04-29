import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PricingSections from '../PricingSections'

vi.mock('../../../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key) => {
      const map = {
        'pricing.currencyUsd': 'USD',
        'pricing.flashSale': 'Flash Sale',
        'pricing.hotDealsTitle': 'Hot Deals',
        'pricing.points': 'Points',
        'pricing.claim': 'Claim',
        'pricing.buyCustomPoints': 'Buy Custom Points',
        'pricing.within': 'within',
        'pricing.viewSubscriptions': 'View Subscriptions',
      }
      return map[key] ?? key
    },
  }),
}))

describe('PricingSections', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })
  
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('renders hot deals section', () => {
    render(<PricingSections onPurchase={vi.fn()} />)
    expect(screen.getByText('Hot Deals')).toBeInTheDocument()
  })

  it('calls onPurchase when clicking Claim', async () => {
    const user = userEvent.setup()
    const onPurchase = vi.fn()

    render(<PricingSections onPurchase={onPurchase} />)

    const claimButtons = screen.getAllByRole('button', { name: 'Claim' })
    await user.click(claimButtons[0])

    expect(onPurchase).toHaveBeenCalledTimes(1)
    expect(onPurchase.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        points: expect.any(Number),
        price: expect.anything(),
      })
    )
  })

  it('filters non-digit input in custom points', async () => {
    const user = userEvent.setup()
    render(<PricingSections onPurchase={vi.fn()} />)

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '12ab34')

    expect(input).toHaveValue('1234')
  })

  it('shows View Subscriptions button and calls handler', async () => {
    const user = userEvent.setup()
    const onViewSubscriptions = vi.fn()

    render(
      <PricingSections
        onPurchase={vi.fn()}
        onViewSubscriptions={onViewSubscriptions}
      />
    )

    const btn = screen.getByRole('button', { name: 'View Subscriptions' })
    await user.click(btn)
    expect(onViewSubscriptions).toHaveBeenCalledTimes(1)
  })
  it('does not render View Subscriptions button when onViewSubscriptions is not provided', () => {
    render(<PricingSections onPurchase={vi.fn()} />)
  
    expect(
      screen.queryByRole('button', { name: 'View Subscriptions' })
    ).not.toBeInTheDocument()
  })
  
  it('does not throw when onPurchase is not provided and Claim is clicked', async () => {
    const user = userEvent.setup()
    render(<PricingSections />)
  
    const claimButtons = screen.getAllByRole('button', { name: 'Claim' })
    await expect(user.click(claimButtons[0])).resolves.not.toThrow()
  })
  it('renders fallback hot deal packages when apiPackages is empty', () => {
    render(<PricingSections onPurchase={vi.fn()} apiPackages={[]} />)
  
    expect(screen.getByText('200,000')).toBeInTheDocument()
    expect(screen.getByText('80,000')).toBeInTheDocument()
    expect(screen.getByText('30,000')).toBeInTheDocument()
  })
  
  it('renders and purchases from provided apiPackages data', async () => {
    const user = userEvent.setup()
    const onPurchase = vi.fn()
  
    render(
      <PricingSections
        onPurchase={onPurchase}
        apiPackages={[
          { level: 2, points: 55555, price: 12.34, originalPrice: 15.99, coin_voicebot: 7 },
        ]}
      />
    )
  
    expect(screen.getByText('55,555')).toBeInTheDocument()
  
    const claimButtons = screen.getAllByRole('button', { name: 'Claim' })
    await user.click(claimButtons[0])
  
    expect(onPurchase).toHaveBeenCalledTimes(1)
    expect(onPurchase.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        level: 2,
        points: 55555,
      })
    )
  })
  
})