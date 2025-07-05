// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Shared/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResidenceDetailPage from './pages/ResidenceDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import RegisterRenterPage from './pages/RegisterRenterPage';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import CreateResidencePage from './pages/CreateResidencePage';
import BecomeHostPage from './pages/BecomeHostPage';
import EditResidencePage from './pages/EditResidencePage';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/residence/:id" element={<ResidenceDetailPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* This is the 404 route */}
            <Route path="/register-owner" element={<RegisterOwnerPage />} />
            <Route path="/register-renter" element={<RegisterRenterPage />} />
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute roles={['owner']}>
                  <OwnerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/residences/create"
              element={
                <ProtectedRoute roles={['owner']}>
                  <CreateResidencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/residences/edit/:id"
              element={
                <ProtectedRoute roles={['owner']}>
                  <EditResidencePage />
                </ProtectedRoute>
              }
            />
            <Route path="/become-host" element={<BecomeHostPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;