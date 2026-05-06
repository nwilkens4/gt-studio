import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CarouselCard from './CarouselCard'

describe('CarouselCard', () => {
  const defaultProps = {
    label: 'PAINT',
    value: 'Shark Blue',
    onNext: vi.fn(),
    onPrev: vi.fn(),
  }

  it('renders the category label', () => {
    render(<CarouselCard {...defaultProps} />)
    expect(screen.getByText('PAINT')).toBeInTheDocument()
  })

  it('renders the current option value', () => {
    render(<CarouselCard {...defaultProps} />)
    expect(screen.getByText('Shark Blue')).toBeInTheDocument()
  })

  it('calls onNext when right chevron is clicked', () => {
    render(<CarouselCard {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Next PAINT'))
    expect(defaultProps.onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrev when left chevron is clicked', () => {
    render(<CarouselCard {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Previous PAINT'))
    expect(defaultProps.onPrev).toHaveBeenCalledOnce()
  })
})

const colorOptions = [
  { id: 'white', label: 'Pure White', color: '#F4F4F0' },
  { id: 'black', label: 'Jet Black', color: '#111416' },
]

const carouselOptions = [
  { id: 'gloss', label: 'Gloss' },
  { id: 'matte', label: 'Matte' },
]

describe('no divider lines', () => {
  it('color section has no bottom border', () => {
    const { container } = render(
      <CarouselCard
        label="PAINT"
        options={colorOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    const wrapper = container.firstChild
    expect(wrapper).not.toHaveStyle('border-bottom: 1px solid rgba(255,255,255,0.06)')
  })

  it('carousel section has no bottom border', () => {
    const { container } = render(
      <CarouselCard
        label="FINISH"
        options={carouselOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    const wrapper = container.firstChild
    expect(wrapper).not.toHaveStyle('border-bottom: 1px solid rgba(255,255,255,0.06)')
  })
})
