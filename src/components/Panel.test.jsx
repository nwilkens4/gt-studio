import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Panel from './Panel'

describe('Panel', () => {
  it('renders children when expanded', () => {
    render(<Panel><div>Content</div></Panel>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('hides children when collapsed', () => {
    render(<Panel><div>Content</div></Panel>)
    fireEvent.click(screen.getByLabelText('Collapse panel'))
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows children again when re-expanded', () => {
    render(<Panel><div>Content</div></Panel>)
    fireEvent.click(screen.getByLabelText('Collapse panel'))
    fireEvent.click(screen.getByLabelText('Expand panel'))
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
