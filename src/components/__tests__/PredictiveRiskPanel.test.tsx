import React from 'react'
import { render, screen, within } from '@testing-library/react'
import PredictiveRiskPanel from '../PredictiveRiskPanel'
import { modelMetadata } from '../../lib/iaPredictive'

describe('PredictiveRiskPanel', () => {
  it('renders model metadata and metrics', () => {
    render(<PredictiveRiskPanel records={[]} />)

    // Check model name is displayed
    const name = screen.getByText(new RegExp(modelMetadata.name))
    expect(name).toBeInTheDocument()

    // Check precision metric is displayed (rounded), and within the 'Modelo de IA actual' container
    const precisionPercent = Math.round(modelMetadata.metrics.precision * 100)
    const modelContainer = screen.getByText(/Modelo de IA actual/i).parentElement
    expect(modelContainer).toBeTruthy()
    const precisionText = modelContainer ? within(modelContainer).getByText(new RegExp(`${precisionPercent}%`)) : null
    expect(precisionText).toBeInTheDocument()
  })
})
