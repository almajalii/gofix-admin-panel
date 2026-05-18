import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/organisms/Layout';
import Auth from './pages/Auth/index';
import Dashboard from './pages/Dashboard/index';
import Applications from './pages/Applications/index';
import Users from './pages/Users/index';
import Bookings from './pages/Bookings/index';
import Reports from './pages/Reports/index';
import Categories from './pages/Categories/index';
import Reviews from './pages/Reviews/index';
import PrivateRoute from './routes/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="users"        element={<Users />} />
          <Route path="bookings"     element={<Bookings />} />
          <Route path="reports"      element={<Reports />} />
          <Route path="categories"   element={<Categories />} />
          <Route path="reviews"      element={<Reviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
