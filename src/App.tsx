/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GeneralView } from "./pages/GeneralView";
import { PlantManagerView } from "./pages/PlantManagerView";
import { PredictionView } from "./pages/PredictionView";
import { NotificationsView } from "./pages/NotificationsView";
import { EnergyView } from "./pages/EnergyView";
import { HRView } from "./pages/HRView";
import { FloorPlanView } from "./pages/FloorPlanView";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppProvider } from "./context/AppContext";
import { MachineModal } from "./components/MachineModal";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<GeneralView />} />
              <Route path="/plant" element={<PlantManagerView />} />
              <Route path="/prediction" element={<PredictionView />} />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route path="/energy" element={<EnergyView />} />
              <Route path="/hr" element={<HRView />} />
              <Route path="/floorplan" element={<FloorPlanView />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
        <MachineModal />
      </Router>
    </AppProvider>
  );
}
