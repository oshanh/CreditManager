import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import AddDebtorPage from './pages/Debtors/AddDebtorPage'
import DebtorsPage from './pages/Debtors/DebtorsPage'
import Welcome from './pages/Welcome'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Documents from './pages/Documents'
import Notifications from './pages/Notifications'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/debtors" element={<DebtorsPage />} />
        <Route path="/debtors/add" element={<AddDebtorPage />} />
        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
        <Route path={ROUTES.REPORTS} element={<Reports />} />
        <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
      </Route>
    </Routes>
  )
}

export default App
