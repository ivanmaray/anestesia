// Motor simple de reglas clínicas (CDSS) — implementación simulada
// Exporta tipos, reglas declarativas y función de evaluación.

export type Severity = 'info' | 'warning' | 'critical'

export type Medication = {
  id: string
  name: string
  doseMg?: number
  unit?: string
  route?: string
  renalCleared?: boolean
  hepaticCleared?: boolean
  isLASA?: boolean
  synonyms?: string[]
}

export type PatientRecord = {
  id?: string
  age?: number
  weightKg?: number
  eGFR?: number // ml/min/1.73m2
  ast?: number
  alt?: number
  meds: Medication[]
  pgxVariants?: { gene: string; genotype: string; impact?: string }[]
}

export type CdssAlert = {
  id: string
  ruleId: string
  severity: Severity
  message: string
  medsAffected: string[] // medication ids
  recommendation?: string
}

export type Rule = {
  id: string
  title: string
  description?: string
  severity: Severity
  enabled?: boolean
  evaluate: (record: PatientRecord) => CdssAlert[]
}

// Reglas de ejemplo
export const rules: Rule[] = [
  // existing rules...
  {
    id: 'renal-adjustment',
    title: 'Ajuste por función renal',
    severity: 'critical',
    enabled: true,
    evaluate(record) {
      const alerts: CdssAlert[] = []
      const eGFR = record.eGFR ?? 999
      if (eGFR < 30) {
        for (const m of record.meds) {
          if (m.renalCleared) {
            alerts.push({
              id: `alert-${this.id}-${m.id}`,
              ruleId: this.id,
              severity: 'critical',
              message: `Fármaco ${m.name} eliminado por vía renal y paciente con eGFR ${eGFR} ml/min. Revisar dosis o alternativa.`,
              medsAffected: [m.id],
              recommendation: 'Considerar reducción de dosis o alternativa no renal.'
            })
          }
        }
      }
      return alerts
    }
  },

  {
    id: 'drug-drug-interaction',
    title: 'Interacciones medicamentosas simples',
    severity: 'warning',
    enabled: true,
    evaluate(record) {
      const alerts: CdssAlert[] = []
      const names = record.meds.map((m) => m.name.toLowerCase())

      // ejemplo simple: clopidogrel + omeprazole (reducción efecto clopidogrel)
      if (names.includes('clopidogrel') && names.includes('omeprazole')) {
        const clop = record.meds.find((m) => m.name.toLowerCase().includes('clopidogrel'))
        const ome = record.meds.find((m) => m.name.toLowerCase().includes('omeprazole'))
        alerts.push({
          id: `alert-${this.id}-clop-ome`,
          ruleId: this.id,
          severity: 'warning',
          message: 'Posible interacción: Omeprazol puede reducir la eficacia de Clopidogrel.',
          medsAffected: [clop?.id || '', ome?.id || ''],
          recommendation: 'Valorar alternativa (p. ej. pantoprazol) o seguimiento de eficacia.'
        })
      }

      // Warfarina + amiodarona => mayor INR
      if (names.includes('warfarin') && names.includes('amiodarone')) {
        const w = record.meds.find((m) => m.name.toLowerCase().includes('warfarin'))
        const a = record.meds.find((m) => m.name.toLowerCase().includes('amiodarone'))
        alerts.push({
          id: `alert-${this.id}-war-amio`,
          ruleId: this.id,
          severity: 'warning',
          message: 'Interacción: Amiodarona puede potenciar efecto de Warfarina (riesgo de sangrado).',
          medsAffected: [w?.id || '', a?.id || ''],
          recommendation: 'Control de INR y ajustar dosis si procede.'
        })
      }

      return alerts
    }
  },

  {
    id: 'duplicate-therapy',
    title: 'Duplicidad de terapia',
    severity: 'warning',
    enabled: true,
    evaluate(record) {
      const alerts: CdssAlert[] = []
      const map = new Map<string, Medication[]>()
      for (const m of record.meds) {
        const key = m.name.toLowerCase()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(m)
      }
      for (const [name, meds] of map.entries()) {
        if (meds.length > 1) {
          alerts.push({
            id: `alert-${this.id}-${name}`,
            ruleId: this.id,
            severity: 'warning',
            message: `Duplicidad detectada: ${meds.length} órdenes para ${meds[0].name}.`,
            medsAffected: meds.map((m) => m.id),
            recommendation: 'Revisar duplicados y consolidar administración.'
          })
        }
      }
      return alerts
    }
  },

  {
    id: 'lasa-alert',
    title: 'LASA — riesgo de confusión',
    severity: 'info',
    enabled: true,
    evaluate(record) {
      const alerts: CdssAlert[] = []
      for (const m of record.meds) {
        if (m.isLASA) {
          alerts.push({
            id: `alert-${this.id}-${m.id}`,
            ruleId: this.id,
            severity: 'info',
            message: `Fármaco con potencial LASA detectado: ${m.name}. Asegurar etiquetado y doble chequeo.`,
            medsAffected: [m.id],
            recommendation: 'Etiquetado claro y doble verificación antes de administración.'
          })
        }
      }
      return alerts
    }
  },

  {
    id: 'pgx-cyp2d6-codeine',
    title: 'PGx CYP2D6 y Codeína / Opioides',
    severity: 'critical',
    enabled: true,
    description: 'Ajusta o evita codeína/opioides si paciente es metabolizador pobre (PM) de CYP2D6.',
    evaluate(record) {
      const alerts: CdssAlert[] = []
      if (!record.pgxVariants || !record.pgxVariants.length) return alerts
      const cyp2d6 = record.pgxVariants.find(v => v.gene.toUpperCase() === 'CYP2D6')
      if (!cyp2d6) return alerts
      const isPM = /PM/i.test(cyp2d6.genotype)
      if (!isPM) return alerts
      // buscar codeína u otros opioides dependientes de CYP2D6 (simplificado)
      const opioidNames = ['codeina','codeína','tramadol','hidrocodona','oxicodona']
      const affected: Medication[] = []
      for (const m of record.meds) {
        const lname = m.name.toLowerCase()
        if (opioidNames.some(o => lname.includes(o))) affected.push(m)
      }
      if (affected.length) {
        alerts.push({
          id: `alert-${this.id}-${record.id || 'record'}`,
          ruleId: this.id,
          severity: 'critical',
          message: 'Paciente PM CYP2D6: riesgo de analgesia inadecuada / acumulación en opioides dependientes CYP2D6.',
          medsAffected: affected.map(m => m.id),
          recommendation: 'Evitar codeína/tramadol; considerar morfina no dependiente CYP2D6 o ajuste de dosis.'
        })
      }
      return alerts
    }
  }
,
  {
    id: 'pgx-cyp2d6-um',
    title: 'PGx CYP2D6 - UM (ultrarapid) y riesgo de toxicidad',
    severity: 'critical',
    enabled: true,
    description: 'CYP2D6 UM aumenta la conversión de codeína y de tramadol en metabolitos activos -> riesgo de sedación/respiratory depression.',
    evaluate(record) {
      const alerts: CdssAlert[] = []
      if (!record.pgxVariants || !record.pgxVariants.length) return alerts
      const cyp2d6 = record.pgxVariants.find(v => v.gene.toUpperCase() === 'CYP2D6')
      if (!cyp2d6) return alerts
      const isUM = /UM/i.test(cyp2d6.genotype)
      if (!isUM) return alerts
      const opioidNames = ['codeina','codeína','tramadol']
      const affected: Medication[] = []
      for (const m of record.meds) {
        const lname = m.name.toLowerCase()
        if (opioidNames.some(o => lname.includes(o))) affected.push(m)
      }
      if (affected.length) {
        alerts.push({
          id: `alert-${this.id}-${record.id || 'record'}`,
          ruleId: this.id,
          severity: 'critical',
          message: 'Paciente UM CYP2D6: riesgo de toxicidad aumentado con codeína/tramadol (más rápida conversión).',
          medsAffected: affected.map(m => m.id),
          recommendation: 'Evitar codeína/tramadol; elegir alternativas no dependientes de CYP2D6 y monitorizar sedación/respiración.'
        })
      }
      return alerts
    }
  },

  {
    id: 'pgx-ryr1-mh',
    title: 'PGx RYR1 - susceptibilidad a hipertermia maligna',
    severity: 'critical',
    enabled: true,
    description: 'Identifica variantes RYR1 que se asocian a una mayor susceptibilidad a hipertermia maligna durante la anestesia.',
    evaluate(record) {
      const alerts: CdssAlert[] = []
      if (!record.pgxVariants) return alerts
      const ry = record.pgxVariants.find(v => v.gene.toUpperCase() === 'RYR1')
      if (!ry) return alerts
      if (/variant/i.test(ry.genotype)) {
        alerts.push({
          id: `alert-${this.id}-${record.id || 'record'}`,
          ruleId: this.id,
          severity: 'critical',
          message: 'Variante RYR1 detectada: posible susceptibilidad a hipertermia maligna.',
          medsAffected: [],
          recommendation: 'Evitar succinilcolina y anestésicos inhalatorios; preparar plan de contingencia.'
        })
      }
      return alerts
    }
  },

  {
    id: 'pgx-cyp2c19-clopidogrel',
    title: 'PGx CYP2C19 y clopidogrel',
    severity: 'warning',
    enabled: true,
    description: 'CYP2C19 PM reduce la activación de clopidogrel; valorar alternativa antitrombótica.',
    evaluate(record) {
      const alerts: CdssAlert[] = []
      if (!record.pgxVariants) return alerts
      const cyp2c19 = record.pgxVariants.find(v => v.gene.toUpperCase() === 'CYP2C19')
      if (!cyp2c19) return alerts
      if (/PM/i.test(cyp2c19.genotype)) {
        const clop = record.meds.find(m => m.name.toLowerCase().includes('clopidogrel'))
        if (clop) {
          alerts.push({
            id: `alert-${this.id}-${record.id || 'record'}`,
            ruleId: this.id,
            severity: 'warning',
            message: 'CYP2C19 PM detectado: menor activación de clopidogrel.',
            medsAffected: [clop.id],
            recommendation: 'Considerar alternativa (ej. ticagrelor) o consulta con cardiología.'
          })
        }
      }
      return alerts
    }
  },

  {
    id: 'pgx-slco1b1-statin',
    title: 'PGx SLCO1B1 y riesgo de miopatía con estatinas',
    severity: 'warning',
    enabled: true,
    description: 'SLCO1B1 *5 está asociado a mayor riesgo de miopatía con simvastatina y otras estatinas.',
    evaluate(record) {
      const alerts: CdssAlert[] = []
      if (!record.pgxVariants) return alerts
      const slco = record.pgxVariants.find(v => v.gene.toUpperCase() === 'SLCO1B1')
      if (!slco) return alerts
      if (/\*5/i.test(slco.genotype)) {
        const statin = record.meds.find(m => ['simvastatin','atorvastatin','pravastatin','rosuvastatin'].some(s => m.name.toLowerCase().includes(s)))
        if (statin) {
          alerts.push({
            id: `alert-${this.id}-${record.id || 'record'}`,
            ruleId: this.id,
            severity: 'warning',
            message: 'SLCO1B1 *5 detectado: mayor riesgo de miopatía con estatinas.',
            medsAffected: [statin.id],
            recommendation: 'Revisar la necesidad de estatinas, ajustar intensidad o monitorizar CK.'
          })
        }
      }
      return alerts
    }
  }
]

export function evaluateRecord(record: PatientRecord, opts?: { enabledRuleIds?: string[] }) {
  const alerts: CdssAlert[] = []
  const enabled = new Set(opts?.enabledRuleIds ?? rules.filter((r) => r.enabled !== false).map((r) => r.id))
  for (const r of rules) {
    if (!enabled.has(r.id)) continue
    try {
      const res = r.evaluate(record)
      if (Array.isArray(res) && res.length) alerts.push(...res)
    } catch (e) {
      // ignore rule failures in this simple engine
      console.error('CDSS rule error', r.id, e)
    }
  }
  return alerts.sort((a, b) => (severityRank(b.severity) - severityRank(a.severity)))
}

function severityRank(s: Severity) {
  if (s === 'critical') return 3
  if (s === 'warning') return 2
  return 1
}
