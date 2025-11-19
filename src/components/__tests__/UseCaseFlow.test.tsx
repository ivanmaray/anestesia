import { render, screen, fireEvent, within } from '@testing-library/react'
import UseCaseFlow from '../UseCaseFlow'

describe('UseCaseFlow', () => {
  it('renders IA risk percentage with dark text for contrast', async () => {
    render(<UseCaseFlow />)

    // trigger IA run by clicking the button
    const runButton = screen.getByText('Correr algoritmo IA')
    fireEvent.click(runButton)

    // the container around the IA risk should have the high-contrast text class
    const header = screen.getByText('Riesgo peroperatorio (IA)')
    const container = header.parentElement
    expect(container).toHaveClass('text-gray-900')

    // find the percentage inside the risk container
    const percent = within(container as HTMLElement).getByText(/\d+%/)
    expect(percent).toBeInTheDocument()
  })
})
