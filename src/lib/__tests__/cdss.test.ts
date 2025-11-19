import { describe, it, expect } from 'vitest'
import { evaluateRecord } from '../cdss'

describe('CDSS Engine', () => {
  it('should detect renal impairment alert', () => {
    const record = {
      meds: [{ id: 'warfarin', name: 'warfarin', renalCleared: true }],
      age: 70,
      weightKg: 70,
      eGFR: 25, // low eGFR triggers rule (<30)
    }
    const alerts = evaluateRecord(record)
    expect(alerts.some(a => a.ruleId === 'renal-adjustment')).toBe(true)
  })

  it('should detect drug interaction', () => {
    const record = {
      meds: [
        { id: 'warfarin', name: 'warfarin' },
        { id: 'amiodarone', name: 'amiodarone' }
      ],
      age: 60,
      weightKg: 70,
      eGFR: 60,
    }
    const alerts = evaluateRecord(record)
    expect(alerts.some(a => a.ruleId === 'drug-drug-interaction')).toBe(true)
  })

  it('should detect duplicate therapy', () => {
    const record = {
      meds: [
        { id: 'aspirin-a', name: 'Aspirin' },
        { id: 'aspirin-b', name: 'Aspirin' }
      ],
      age: 60,
      weightKg: 70,
      eGFR: 60,
    }
    const alerts = evaluateRecord(record)
    expect(alerts.some(a => a.ruleId === 'duplicate-therapy')).toBe(true)
  })

  it('should detect LASA alert', () => {
    const record = {
      meds: [{ id: 'hydralazine', name: 'hydralazine', isLASA: true }],
      age: 60,
      weightKg: 70,
      eGFR: 60,
    }
    const alerts = evaluateRecord(record)
    expect(alerts.some(a => a.ruleId === 'lasa-alert')).toBe(true)
  })
})