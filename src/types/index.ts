export interface Machine {
  id: string;
  plant: string;
  status: "RAS" | "ALERTE";
  defectRate: number;
  temperature: number;
  maintenanceScore: number;
  productionSpeed: number;
  cycleTime: number;
  powerConsumption: number;
  dailyEnergy: number;
  co2Emissions: number;
  operator: string;
  x: number;
  y: number;
}

export interface KPIs {
  avgProduction: number;
  avgCycleTime: number;
  avgScrapRate: number;
  machinesAtRisk: number;
  avgPower: number;
  totalCO2: number;
  estimatedCost: number;
}

export interface ProductionByPlant {
  plant: string;
  value: number;
}

export interface MachineStatusCounts {
  RAS: number;
  ALERTE: number;
}

export interface ErrorTempByMachine {
  machineId: string;
  errorRate: number;
  temperature: number;
  dailyEnergy: number;
}

export interface MaintenanceHeatmap {
  machineId: string;
  [day: string]: string | number;
}

export interface DefectRatePrediction {
  time: string;
  actual: number | null;
  predicted: number;
}

export interface TRSPrediction {
  time: string;
  actual: number | null;
  predicted: number;
}

export interface MachinePrediction {
  machineId: string;
  failureProbability: number;
  anomalyScore: number;
  topFeatures: { name: string; contribution: number }[];
}

export interface AnomalyData {
  time: string;
  power: number;
  temperature: number;
  isAnomaly: boolean;
}

export interface QualityDrift {
  time: string;
  defectRate: number | null;
  predictedDrift: number;
  upperLimit: number;
  lowerLimit: number;
}

export interface EnergyTrend {
  time: string;
  power: number;
  co2: number;
}

export interface HRData {
  operatorName: string;
  machineId: string;
  shift: string;
  efficiency: number;
  trainingLevel: number;
}

export interface ChartsData {
  productionByPlant: ProductionByPlant[];
  machineStatusCounts: MachineStatusCounts;
  errorTempByMachine: ErrorTempByMachine[];
  maintenanceHeatmap: MaintenanceHeatmap[];
  defectRatePrediction: DefectRatePrediction[];
  trsPrediction: TRSPrediction[];
  machinePredictions: MachinePrediction[];
  anomalyData: AnomalyData[];
  qualityDrift: QualityDrift[];
  energyTrend: EnergyTrend[];
}

export interface DashboardData {
  kpis: KPIs;
  charts: ChartsData;
  machines: Machine[];
  hrData: HRData[];
}
