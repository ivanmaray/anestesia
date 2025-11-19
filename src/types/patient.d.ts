export type Medication = {
  id: string;
  name: string;
  doseMg?: number;
  unit?: string;
  route?: string;
  renalCleared?: boolean;
  hepaticCleared?: boolean;
  isLASA?: boolean;
  synonyms?: string[];
};

export type PatientRecord = {
  id?: string;
  age?: number;
  weightKg?: number;
  sex?: 'M' | 'F' | 'O' | string;
  eGFR?: number; // ml/min/1.73m2
  ast?: number;
  alt?: number;
  hemoglobina_g_dL?: number;
  plaquetas?: number;
  n_prev_procedures?: number;
  multiresistant?: boolean;
  meds: Medication[];
  pgxVariants?: { gene: string; genotype: string; impact?: string }[];
};