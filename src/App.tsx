// We need to make sure the routing is set up correctly for the Calendar page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar';
import { ClientsView } from './components/clients/ClientsView';
import { OrdersView } from './components/orders/OrdersView';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Invoices } from './pages/Invoices';
import { Teams } from './pages/Teams';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ClientDetails } from './pages/ClientDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Make sure we have a proper route for the Calendar page */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/orders" element={<OrdersView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/client/:id" element={<ClientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
