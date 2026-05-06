import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CarouselCard from './CarouselCard'

const colorOptions = [
  { id: 'white', label: 'Pure White', color: '#F4F4F0' },
  { id: 'black', label: 'Jet Black', color: '#111416' },
]

const carouselOptions = [
  { id: 'gloss', label: 'Gloss' },
  { id: 'matte', label: 'Matte' },
]

describe('CarouselCard', () => {
  it('renders the category label', () => {
    render(
      <CarouselCard
        label="FINISH"
        options={carouselOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    expect(screen.getByText('FINISH')).toBeInTheDocument()
  })

  it('renders the current option label', () => {
    render(
      <CarouselCard
        label="FINISH"
        options={carouselOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    expect(screen.getByText('Gloss')).toBeInTheDocument()
  })

  it('calls onNext when right chevron is clicked', () => {
    const onNext = vi.fn()
    render(
      <CarouselCard
        label="FINISH"
        options={carouselOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={onNext}
        onPrev={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Next FINISH'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrev when left chevron is clicked', () => {
    const onPrev = vi.fn()
    render(
      <CarouselCard
        label="FINISH"
        options={carouselOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={onPrev}
      />
    )
    fireEvent.click(screen.getByLabelText('Previous FINISH'))
    expect(onPrev).toHaveBeenCalledOnce()
  })
})

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

describe('color section accordion', () => {
  it('swatch grid is hidden on initial render', () => {
    render(
      <CarouselCard
        label="PAINT"
        options={colorOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    // Grid is in the DOM but hidden via overflow-hidden + maxHeight:0px
    const collapsible = document.querySelector('.overflow-hidden')
    expect(collapsible).toHaveStyle({ maxHeight: '0px' })
  })

  it('swatch grid appears after clicking the header', () => {
    render(
      <CarouselCard
        label="PAINT"
        options={colorOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'PAINT' }))
    const collapsible = document.querySelector('.overflow-hidden')
    expect(collapsible).toHaveStyle({ maxHeight: '320px' })
  })

  it('shows selected color name in header when collapsed', () => {
    render(
      <CarouselCard
        label="PAINT"
        options={colorOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    // Selected label is shown in the header span (always visible)
    const headerSpan = document.querySelector('button[aria-label="PAINT"] span.text-\\[10px\\]')
    expect(headerSpan).toBeInTheDocument()
    expect(headerSpan).toHaveTextContent('Pure White')
  })

  it('collapses again on second header click', () => {
    render(
      <CarouselCard
        label="PAINT"
        options={colorOptions}
        currentIndex={0}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    )
    const header = screen.getByRole('button', { name: 'PAINT' })
    fireEvent.click(header) // open
    fireEvent.click(header) // close
    const collapsible = document.querySelector('.overflow-hidden')
    expect(collapsible).toHaveStyle({ maxHeight: '0px' })
  })
})
