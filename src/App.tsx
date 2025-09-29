import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Works from './pages/Works'
import Projects from './pages/Projects'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import AppShell from './components/AppShell'
import IconRail from './components/IconRail'
import ProjectSidebar from './components/ProjectSidebar'
import ProjectDetails from './pages/project/ProjectDetails'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell iconRail={<IconRail />} sidebar={<ProjectSidebar />}>
            <Outlet />
          </AppShell>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="works" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="works" element={<Works />} />
        <Route path="projects" element={<Projects />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="project/:id" element={<ProjectDetails />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="works" replace />} />
      </Route>
    </Routes>
  )
}

export default App
