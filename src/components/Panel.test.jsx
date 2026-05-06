import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Panel from './Panel'

describe('Panel', () => {
  it('renders children when expanded', () => {
    render(<Panel><div>Content</div></Panel>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('still renders children in DOM when collapsed (hidden via width)', () => {
    render(<Panel><div>Content</div></Panel>)
    fireEvent.click(screen.getByLabelText('Collapse panel'))
    // Children stay in DOM, panel collapses via width transition
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('toggle button changes label when collapsed', () => {
    render(<Panel><div>Content</div></Panel>)
    fireEvent.click(screen.getByLabelText('Collapse panel'))
    expect(screen.getByLabelText('Expand panel')).toBeInTheDocument()
  })

  it('toggle button label returns to Collapse when re-expanded', () => {
    render(<Panel><div>Content</div></Panel>)
    fireEvent.click(screen.getByLabelText('Collapse panel'))
    fireEvent.click(screen.getByLabelText('Expand panel'))
    expect(screen.getByLabelText('Collapse panel')).toBeInTheDocument()
  })

  it('toggle button is focusable and has correct role', () => {
    render(<Panel><div>Content</div></Panel>)
    const btn = screen.getByLabelText('Collapse panel')
    expect(btn.tagName).toBe('BUTTON')
    btn.focus()
    expect(document.activeElement).toBe(btn)
  })

  it('re-expands when toggle is clicked twice', () => {
    render(<Panel><div>Content</div></Panel>)
    const collapseBtn = screen.getByLabelText('Collapse panel')
    fireEvent.click(collapseBtn)
    const expandBtn = screen.getByLabelText('Expand panel')
    fireEvent.click(expandBtn)
    expect(screen.getByLabelText('Collapse panel')).toBeInTheDocument()
  })
})
