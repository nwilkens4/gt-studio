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
