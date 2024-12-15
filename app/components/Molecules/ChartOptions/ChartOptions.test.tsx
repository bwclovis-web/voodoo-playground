import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ChartOptions from './ChartOptions'

describe('ChartOptions', () => {
  it('renders a chartOptions', () => {
    render(<ChartOptions />)
    expect(screen.getByText('ChartOptions')).toBeInTheDocument()
  })
})
