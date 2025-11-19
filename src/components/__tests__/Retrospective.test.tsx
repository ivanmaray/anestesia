import { render, screen } from '@testing-library/react'
import Retrospective from '../Retrospective'

describe('Retrospective', () => {
  beforeEach(() => {
    localStorage.removeItem('retrospective_phase1')
  })
  it('renders simplified Phase 1 sections and example findings', () => {
    render(<Retrospective />)

    expect(screen.getByText(/Fase 1/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Revisión de errores/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Entrevistas estructuradas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Diseño de indicadores iniciales/i })).toBeInTheDocument()

    // bar visual should be present for at least one motive
    const bars = screen.getAllByLabelText(/motive-bar-/i)
    expect(bars.length).toBeGreaterThan(0)

    // clarifying note about mentions
    expect(screen.getByText(/Los números indican cuántas veces se mencionó ese tema/i)).toBeInTheDocument()

    // ensure header label changed from 'alertas' to 'errores'
    expect(screen.getByText(/Lista de errores \(muestra\)/i)).toBeInTheDocument()
  })
})
