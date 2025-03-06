
// We need to make sure the routing is set up correctly for the Calendar page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar';
import { ClientsView } from './components/clients/ClientsView';
import { OrdersView } from './components/orders/OrdersView';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Add Home page as an explicit route */}
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/orders" element={<OrdersView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
