export type CatalogMed = {
  id: string
  name: string
  renalCleared?: boolean
  hepaticCleared?: boolean
  isLASA?: boolean
}

export const medCatalog: CatalogMed[] = [
  { id: 'm-clopidogrel', name: 'Clopidogrel', hepaticCleared: true },
  { id: 'm-omeprazole', name: 'Omeprazole', hepaticCleared: true },
  { id: 'm-warfarin', name: 'Warfarin', hepaticCleared: true },
  { id: 'm-amiodarone', name: 'Amiodarone', hepaticCleared: true },
  { id: 'm-vancomycin', name: 'Vancomycin', renalCleared: true },
  { id: 'm-gentamicin', name: 'Gentamicin', renalCleared: true },
  { id: 'm-metformin', name: 'Metformin', renalCleared: true },
  { id: 'm-atorvastatin', name: 'Atorvastatin', hepaticCleared: true },
  { id: 'm-codeine', name: 'Codeine', hepaticCleared: true },
  { id: 'm-morphine', name: 'Morphine', isLASA: true }
]
