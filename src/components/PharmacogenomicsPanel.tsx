import React, { useState } from 'react'
import EvidenceModal from './EvidenceModal'

export type PGXGene = 'CYP2D6' | 'CYP2C19' | 'OPRM1' | 'SLCO1B1' | 'RYR1' | 'CYP3A4' | 'CYP2B6' | 'COMT' | 'ABCB1'

export interface PGXResult {
  gene: PGXGene
  genotype: string
  interpretation?: string
}

const geneOptions: Record<PGXGene, { name: string; variants: string[] }> = {
  CYP2D6: { name: 'CYP2D6', variants: ['UM (ultrarapid)', 'NM (normal)', 'IM (intermediate)', 'PM (poor metabolizer)'] },
  CYP2C19: { name: 'CYP2C19', variants: ['UM', 'NM', 'IM', 'PM'] },
  OPRM1: { name: 'OPRM1', variants: ['A/A', 'A/G', 'G/G'] },
  SLCO1B1: { name: 'SLCO1B1', variants: ['*1/*1 (normal)', '*1/*5 (intermediate)', '*5/*5 (reduced function)'] },
  RYR1: { name: 'RYR1', variants: ['WT', 'Variant (possible MH risk)'] },
  CYP3A4: { name: 'CYP3A4', variants: ['*1/*1 (normal)', '*22 (reduced activity)'] },
  CYP2B6: { name: 'CYP2B6', variants: ['*1/*1 (normal)', '*6 (reduced activity)'] },
  COMT: { name: 'COMT', variants: ['Val/Val', 'Val/Met', 'Met/Met'] },
  ABCB1: { name: 'ABCB1', variants: ['C3435C', 'C3435T', 'T3435T'] },
}

const clinicalInterpretation = (g: PGXGene, genotype: string) => {
  switch (g) {
    case 'CYP2D6':
      if (genotype.includes('UM')) return 'Ultrarapid metabolizer → riesgo de mayor conversión de algunos pro-fármacos (p. ej. codeína / tramadol): evitar o ajustar dosis.'
      if (genotype.includes('PM')) return 'Poor metabolizer → menor conversión, puede generar falta de eficacia para algunos pro-fármacos; usar alternativas.'
      return 'Genotipo con metabolismo estándar o intermedio; seguimiento según clínica.'

    case 'CYP2C19':
      if (genotype.includes('PM')) return 'Poor metabolizer → menor activación de clopidogrel; considerar alternativa (ticagrelor) si uso antiagregante.'
      return 'Genotipo con metabolismo estándar o intermedio; ajustar según caso clínico.'

    case 'OPRM1':
      if (genotype.includes('G/G')) return 'OPRM1 asociado a variación en la respuesta opiácea; puede necesitar dosis mayores para analgesia.'
      return 'Genotipo sin variantes mayormente influyentes para los analgésicos comunes.'

    case 'SLCO1B1':
      if (genotype.includes('*5')) return 'Reducción de función → mayor riesgo de miopatía con estatinas, revisar terapia hipolipemiante.'
      return 'Genotipo sin impacto clínico relevante en la mayoría de fármacos.'

    case 'RYR1':
          case 'CYP3A4':
            if (genotype.includes('*22')) return 'CYP3A4 reduced activity → puede alterar niveles de fármacos metabolizados por CYP3A4 (ej. midazolam, fentanyl). Ajustar dosis si es clínicamente relevante.'
            return 'Actividad CYP3A4 estándar; seguimiento según clínica.'

          case 'CYP2B6':
            if (genotype.includes('*6')) return 'CYP2B6 reduced → puede alterar metabolismo de algunos anestésicos/opioides (ej. propofol metabolism/efectos de bupropión). Revisar dosis si procede.'
            return 'Actividad CYP2B6 estándar; seguimiento según clínica.'

          case 'COMT':
            if (genotype.includes('Met/Met')) return 'COMT Met/Met → posible variación en percepción del dolor y respuesta a opioides; monitorizar analgesia postoperatoria.'
            return 'COMT genotipo sin impacto mayor señalado.'

          case 'ABCB1':
            if (genotype.includes('C3435T')) return 'ABCB1 C3435T variante asociada a diferencias en transporte de fármacos y respuesta a opioides; monitorizar clínica.'
            return 'ABCB1 sin variante mayor.'
      if (genotype.includes('Variant')) return 'Posible susceptibilidad a hipertermia maligna; evitar succinilcolina y agentes halogenados; alertar a anestesiología.'
      return 'WT: No se identifican variantes conocidas de susceptibilidad a hipertermia maligna.'
  }
}

const getEvidence = (g: PGXGene, _genotype: string) => {
  switch (g) {
    case 'CYP2D6':
      return 'Evidencia: guidelines indican que CYP2D6 UM/PM impactan en pro-fármacos como codeína, tramadol; ajuste clínico o alternativas recomendadas según evidencia (CPIC).'
    case 'CYP2C19':
      return 'Evidencia: CPIC indica que los poor metabolizers de CYP2C19 podrían no responder a clopidogrel; considerar alternativas.'
    case 'RYR1':
      return 'Evidencia: RYR1 variantes están asociadas a susceptibilidad a hipertermia maligna; evitar agentes desencadenantes y plan de acción perioperatorio.'
    case 'CYP3A4':
      return 'Evidencia: CYP3A4 puede influir en la farmacocinética de varios anestésicos y sedantes; revisar interacción y dosis.'
    case 'CYP2B6':
      return 'Evidencia: CYP2B6 afecta el metabolismo de varios fármacos; variantes como *6 tienen efecto en metabolismo reducido.'
    case 'COMT':
      return 'Evidencia: COMT Val158Met modula la percepción del dolor; puede correlacionarse con respuesta analgesia.'
    case 'ABCB1':
      return 'Evidencia: ABCB1 C3435T impacta transporte transmembrana y puede variar la respuesta a algunos analgésicos.'
    case 'SLCO1B1':
      return 'Evidencia: SLCO1B1 *5 está asociado a mayor riesgo de miopatía con estatinas; considerar dosis menores o alternativas.'
    case 'OPRM1':
      return 'Evidencia: OPRM1 puede modular la sensibilidad a los opioides; algunos genotipos pueden necesitar ajuste de dosis.'
  }
}

const geneLinks: Record<PGXGene, { cpic: string; pharmgkb: string }> = {
  CYP2D6: { cpic: 'https://cpicpgx.org/gene/cyp2d6/', pharmgkb: 'https://www.clinpgx.org/search?query=CYP2D6' },
  CYP2C19: { cpic: 'https://cpicpgx.org/gene/cyp2c19/', pharmgkb: 'https://www.clinpgx.org/search?query=CYP2C19' },
  OPRM1: { cpic: 'https://cpicpgx.org/gene/oprm1/', pharmgkb: 'https://www.clinpgx.org/search?query=OPRM1' },
  SLCO1B1: { cpic: 'https://cpicpgx.org/gene/slco1b1/', pharmgkb: 'https://www.clinpgx.org/search?query=SLCO1B1' },
  RYR1: { cpic: 'https://cpicpgx.org/gene/ryr1/', pharmgkb: 'https://www.clinpgx.org/search?query=RYR1' },
  CYP3A4: { cpic: 'https://cpicpgx.org/gene/cyp3a4/', pharmgkb: 'https://www.clinpgx.org/search?query=CYP3A4' },
  CYP2B6: { cpic: 'https://cpicpgx.org/gene/cyp2b6/', pharmgkb: 'https://www.clinpgx.org/search?query=CYP2B6' },
  COMT: { cpic: 'https://cpicpgx.org/gene/comt/', pharmgkb: 'https://www.clinpgx.org/search?query=COMT' },
  ABCB1: { cpic: 'https://cpicpgx.org/gene/abcb1/', pharmgkb: 'https://www.clinpgx.org/search?query=ABCB1' },
}

const getLinksForGene = (g: PGXGene) => [
  { label: `CPIC — ${g}`, url: geneLinks[g].cpic },
  { label: `PharmGKB — ${g}`, url: geneLinks[g].pharmgkb },
]

interface Props {
  values?: PGXResult[]
  onChange?: (res: PGXResult[]) => void
  onApplyRecommendation?: (text: string) => void
}

const PharmacogenomicsPanel: React.FC<Props> = ({ values = [], onChange, onApplyRecommendation }) => {
  const [results, setResults] = useState<PGXResult[]>(values.length ? values : [
    { gene: 'CYP2D6', genotype: 'NM' },
    { gene: 'CYP2C19', genotype: 'NM' },
    { gene: 'RYR1', genotype: 'WT' },
  ])
  const [selectedGene, setSelectedGene] = useState<PGXGene>('CYP2D6')
  const [selectedGenotype, setSelectedGenotype] = useState(results[0].genotype || '')
  const [recommendation, setRecommendation] = useState('')
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [evidenceText, setEvidenceText] = useState('')
  const [evidenceTitle, setEvidenceTitle] = useState('')

  const addOrUpdate = () => {
    const updated = [...results]
    const idx = updated.findIndex((r) => r.gene === selectedGene)
    const item = { gene: selectedGene, genotype: selectedGenotype, interpretation: clinicalInterpretation(selectedGene, selectedGenotype) }
    if (idx === -1) updated.push(item)
    else updated[idx] = item
    setResults(updated)
    onChange?.(updated)
  }

  const remove = (g: PGXGene) => {
    const updated = results.filter((r) => r.gene !== g)
    setResults(updated)
    onChange?.(updated)
  }

  const applyRecommendation = () => {
    if (!recommendation.trim()) return
    onApplyRecommendation?.(recommendation)
    setRecommendation('')
  }

  const autoApplySuggestedAction = () => {
    const suggestion = clinicalInterpretation(selectedGene, selectedGenotype)
    setRecommendation(suggestion)
    applyRecommendation()
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-600">
      <h3 className="text-lg font-semibold mb-3 text-white">Panel de Farmacogenómica (PGx)</h3>
      <div className="text-sm text-slate-300 mb-4">Genes incluidos y su relevancia clínica. Modifica genotipos para ver la interpretación clínica y generar recomendaciones.</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-slate-300 mb-1">Gen</label>
          <select value={selectedGene} onChange={(e) => setSelectedGene(e.target.value as PGXGene)} className="bg-slate-700 border border-slate-600 text-white p-2 rounded w-full">
            {Object.keys(geneOptions).map((g) => (
              <option key={g} value={g}>{geneOptions[g as PGXGene].name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-300 mb-1">Genotipo</label>
          <select value={selectedGenotype} onChange={(e) => setSelectedGenotype(e.target.value)} className="bg-slate-700 border border-slate-600 text-white p-2 rounded w-full">
            {(geneOptions[selectedGene].variants).map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={addOrUpdate} className="px-3 py-1 bg-indigo-600 text-white rounded">Agregar / Actualizar</button>
        <button onClick={() => remove(selectedGene)} className="px-3 py-1 bg-slate-600 text-white rounded">Eliminar</button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-white">Resultados actuales</h4>
        <ul className="text-xs text-slate-300 list-disc ml-4">
          {results.map((r) => (
            <li key={r.gene} className="mb-2">
              <strong className="text-white">{r.gene}</strong>: {r.genotype}
              <div className="text-xs text-slate-400 mt-1">Interpretación: {r.interpretation || clinicalInterpretation(r.gene, r.genotype)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-white">Redacción de recomendación clínica (Farmacéutico)</h4>
        <textarea value={recommendation} onChange={(e) => setRecommendation(e.target.value)} rows={3} className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded text-sm" placeholder="Ej: Suspender codeína y tramadol; usar paracetamol y metamizol. Notificar a anestesia."></textarea>
        <div className="flex gap-2 mt-2">
          <button onClick={applyRecommendation} className="px-3 py-1 bg-green-600 text-white rounded">Aplicar Recomendación</button>
        </div>
        <div className="text-xs text-slate-400 mt-2">
          <div className="font-semibold text-white">Relevancia clínica</div>
          <div>{clinicalInterpretation(selectedGene, selectedGenotype)}</div>
          <div className="mt-2 text-xs text-slate-300">{getEvidence(selectedGene, selectedGenotype)}</div>
          <div className="mt-2">
            <button onClick={() => { setEvidenceTitle(`Evidencia — ${selectedGene}`); setEvidenceText(getEvidence(selectedGene, selectedGenotype)); setEvidenceOpen(true) }} className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded text-xs">Ver evidencia</button>
          </div>
          <div className="mt-2">
            <button onClick={autoApplySuggestedAction} className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs">Aplicar recomendación sugerida</button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400">Evidencia: Las recomendaciones son ilustrativas. En entorno clínico se usan guías / fuentes locales y consulta con el equipo clínico.</div>
      <EvidenceModal open={evidenceOpen} title={evidenceTitle} evidence={evidenceText} onClose={() => setEvidenceOpen(false)} links={getLinksForGene(selectedGene)} />
    </div>
  )
}

export default PharmacogenomicsPanel
