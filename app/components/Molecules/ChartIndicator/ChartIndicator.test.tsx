import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ChartIndicator from './ChartIndicator'

describe('ChartIndicator', () => {
  it('renders a chartindicator', () => {
    render(<ChartIndicator />)
    expect(screen.getByText('ChartIndicator')).toBeInTheDocument()
  })
})
