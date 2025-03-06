
// We need to make sure the routing is set up correctly for the Calendar page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar';
import { ClientsView } from './components/clients/ClientsView';
import { OrdersView } from './components/orders/OrdersView';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

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
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
