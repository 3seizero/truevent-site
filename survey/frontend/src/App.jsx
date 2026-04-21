import { Routes, Route } from 'react-router-dom'
import SurveyPage from './pages/SurveyPage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ResponseList from './pages/admin/ResponseList'
import ResponseDetail from './pages/admin/ResponseDetail'
import AiSuggestions from './pages/admin/AiSuggestions'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:event/:edition/:formType" element={<SurveyPage />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/responses/:slug" element={<ResponseList />} />
      <Route path="/admin/response/:id" element={<ResponseDetail />} />
      <Route path="/admin/ai/:slug" element={<AiSuggestions />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
