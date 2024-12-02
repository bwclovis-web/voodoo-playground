import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import DashboardNav from './DashboardNav'

describe('DashboardNav', () => {
  it('renders a dashboardnav', () => {
    render(<DashboardNav />)
    expect(screen.getByText('DashboardNav')).toBeInTheDocument()
  })
})
