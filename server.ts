import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/mecha-metrics", (req, res) => {
    // Generate mock data for 50 machines
    const machines = Array.from({ length: 50 }, (_, i) => {
      const id = `M${(i + 1).toString().padStart(2, "0")}`;
      const plant = i < 25 ? "France" : "Espagne";
      const isAlert = Math.random() > 0.9; // ~10% alert rate
      const status = isAlert ? "ALERTE" : "RAS";
      const defectRate = isAlert ? 5 + Math.random() * 5 : 0.5 + Math.random() * 2;
      const temperature = isAlert ? 85 + Math.random() * 15 : 60 + Math.random() * 20;
      const maintenanceScore = isAlert ? Math.floor(Math.random() * 40) : 60 + Math.floor(Math.random() * 40);
      const productionSpeed = 80 + Math.random() * 40;
      const powerConsumption = 20 + Math.random() * 10;
      const co2Emissions = powerConsumption * 0.4;
      const operators = ["Jean D.", "Marie L.", "Carlos S.", "Ana B.", "Luc P.", "Sophie T."];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      
      // Grid layout for floor plan (5 rows, 10 cols)
      const row = Math.floor(i / 10);
      const col = i % 10;
      const x = 5 + col * 10;
      const y = 10 + row * 20;

      return {
        id,
        plant,
        status,
        defectRate: Number(defectRate.toFixed(2)),
        temperature: Number(temperature.toFixed(1)),
        maintenanceScore,
        productionSpeed: Number(productionSpeed.toFixed(0)),
        powerConsumption: Number(powerConsumption.toFixed(1)),
        co2Emissions: Number(co2Emissions.toFixed(1)),
        operator,
        x,
        y,
      };
    });

    // Calculate Global KPIs
    const totalProduction = machines.reduce((sum, m) => sum + m.productionSpeed, 0);
    const avgProduction = totalProduction / machines.length;
    const avgScrapRate = machines.reduce((sum, m) => sum + m.defectRate, 0) / machines.length;
    const machinesAtRisk = machines.filter(m => m.status === "ALERTE").length;
    const avgPower = machines.reduce((sum, m) => sum + m.powerConsumption, 0) / machines.length;
    const totalCO2 = machines.reduce((sum, m) => sum + m.co2Emissions, 0);
    const estimatedCost = totalCO2 * 0.15 * 24; // mock cost calculation

    // Calculate Charts Data
    const productionByPlant = [
      { plant: "France", value: machines.filter(m => m.plant === "France").reduce((sum, m) => sum + m.productionSpeed, 0) },
      { plant: "Espagne", value: machines.filter(m => m.plant === "Espagne").reduce((sum, m) => sum + m.productionSpeed, 0) }
    ];

    const machineStatusCounts = {
      RAS: machines.filter(m => m.status === "RAS").length,
      ALERTE: machinesAtRisk
    };

    const errorTempByMachine = machines.map(m => ({
      machineId: m.id,
      errorRate: m.defectRate,
      temperature: m.temperature
    }));

    // Maintenance Heatmap (mocking 7 days for a subset of machines to keep it readable, e.g., first 10)
    const maintenanceHeatmap = machines.slice(0, 10).map(m => {
      return {
        machineId: m.id,
        day1: m.maintenanceScore,
        day2: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 10 - 5)),
        day3: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 15 - 5)),
        day4: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 20 - 10)),
        day5: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 25 - 10)),
        day6: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 30 - 15)),
        day7: Math.min(100, m.maintenanceScore + Math.floor(Math.random() * 35 - 15)),
      };
    });

    // Defect Rate Prediction (mocking 24 hours of data: 12h history, 12h prediction)
    const defectRatePrediction = Array.from({ length: 24 }, (_, i) => {
      const time = `${i.toString().padStart(2, "0")}:00`;
      const baseRate = 2.0;
      const noise = Math.random() * 0.5 - 0.25;
      const trend = i * 0.05; // slightly increasing trend
      
      if (i < 12) {
        // History
        return { time, actual: Number((baseRate + noise + trend).toFixed(2)), predicted: Number((baseRate + trend).toFixed(2)) };
      } else {
        // Future
        return { time, actual: null, predicted: Number((baseRate + noise + trend).toFixed(2)) };
      }
    });

    // TRS Prediction (mocking 24 hours of data: 12h history, 12h prediction)
    const trsPrediction = Array.from({ length: 24 }, (_, i) => {
      const time = `${i.toString().padStart(2, "0")}:00`;
      const baseTrs = 85.0;
      const noise = Math.random() * 4 - 2;
      const trend = i * -0.2; // slightly decreasing trend
      
      if (i < 12) {
        // History
        return { time, actual: Number((baseTrs + noise + trend).toFixed(1)), predicted: Number((baseTrs + trend).toFixed(1)) };
      } else {
        // Future
        return { time, actual: null, predicted: Number((baseTrs + noise + trend).toFixed(1)) };
      }
    });

    // Energy Trend (mocking 24 hours of data)
    const energyTrend = Array.from({ length: 24 }, (_, i) => {
      const time = `${i.toString().padStart(2, "0")}:00`;
      const basePower = 1200;
      const noise = Math.random() * 200 - 100;
      const power = Number((basePower + noise).toFixed(0));
      const co2 = Number((power * 0.4).toFixed(1));
      return { time, power, co2 };
    });

    // HR Data
    const hrData = machines.slice(0, 15).map(m => {
      const shifts = ["Matin", "Après-midi", "Nuit"];
      return {
        operatorName: m.operator,
        machineId: m.id,
        shift: shifts[Math.floor(Math.random() * shifts.length)],
        efficiency: Number((80 + Math.random() * 20).toFixed(1)),
        trainingLevel: Math.floor(Math.random() * 5) + 1,
      };
    });

    res.json({
      kpis: {
        avgProduction: Number(avgProduction.toFixed(0)),
        avgScrapRate: Number(avgScrapRate.toFixed(2)),
        machinesAtRisk,
        avgPower: Number(avgPower.toFixed(1)),
        totalCO2: Number(totalCO2.toFixed(1)),
        estimatedCost: Number(estimatedCost.toFixed(2))
      },
      charts: {
        productionByPlant,
        machineStatusCounts,
        errorTempByMachine,
        maintenanceHeatmap,
        defectRatePrediction,
        trsPrediction,
        energyTrend
      },
      machines,
      hrData
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
