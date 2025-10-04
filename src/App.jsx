import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Team from './pages/Team.jsx'
import DemoOne from './pages/demo.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/demo" element={<DemoOne />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}