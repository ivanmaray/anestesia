import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Commented out undefined references
// const [medication, setMedication] = useState<MedicationSimulation>({});
// const [result, setResult] = useState<SimulationResult | null>(null);

// Commented out patientData-related code
// if (patientData.age > 65) {
//   // Logic here
// }