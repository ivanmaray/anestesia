import { describe, it, expect } from 'vitest'
import { evaluateRecord, type PatientRecord } from './cdss'

function makeRecord(overrides: Partial<PatientRecord>): PatientRecord {
  return {
    id: 'test',
    meds: [],
    ...overrides
  }
}

describe('CDSS renal adjustment', () => {
  it('creates critical alert for renal-cleared drug with low eGFR', () => {
    const rec = makeRecord({ eGFR: 25, meds: [{ id: 'm1', name: 'Vancomycin', renalCleared: true }] })
    const alerts = evaluateRecord(rec)
    const renal = alerts.find(a => a.ruleId === 'renal-adjustment')
    expect(renal).toBeTruthy()
    expect(renal?.severity).toBe('critical')
  })
})

describe('CDSS PGx CYP2D6 rule', () => {
  it('alerts when patient is PM and has codeína', () => {
    const rec = makeRecord({
      meds: [{ id: 'm1', name: 'Codeína' }],
      pgxVariants: [{ gene: 'CYP2D6', genotype: 'PM' }]
    })
    const alerts = evaluateRecord(rec)
    const pgx = alerts.find(a => a.ruleId === 'pgx-cyp2d6-codeine')
    expect(pgx).toBeTruthy()
    expect(pgx?.severity).toBe('critical')
  })

  it('does not alert if genotype is NM', () => {
    const rec = makeRecord({
      meds: [{ id: 'm1', name: 'Codeína' }],
      pgxVariants: [{ gene: 'CYP2D6', genotype: 'NM' }]
    })
    const alerts = evaluateRecord(rec)
    const pgx = alerts.find(a => a.ruleId === 'pgx-cyp2d6-codeine')
    expect(pgx).toBeFalsy()
  })
})
