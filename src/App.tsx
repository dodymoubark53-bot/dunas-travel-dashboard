import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import BookingsManager from './pages/BookingsManager';
import DestinationsManager from './pages/DestinationsManager';
import TripsManager from './pages/TripsManager';
import PackagesManager from './pages/PackagesManager';
import MediaManager from './pages/MediaManager';
import HotelsManager from './pages/HotelsManager';
import HotelEditPage from './pages/HotelEditPage';
import ContentManager from './pages/ContentManager';
import CommunicationsManager from './pages/CommunicationsManager';
import NotificationsManager from './pages/NotificationsManager';
import TransportationManager from './pages/TransportationManager';
import ReviewsManager from './pages/ReviewsManager';
import ProfileManager from './pages/ProfileManager';
import CompaniesManager from './pages/CompaniesManager';
import AgentsManager from './pages/AgentsManager';
import CommissionsManager from './pages/CommissionsManager';
import WalletsManager from './pages/WalletsManager';

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="destinations" element={<DestinationsManager />} />
          <Route path="trips" element={<TripsManager />} />
          <Route path="packages" element={<PackagesManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="hotels" element={<HotelsManager />} />
          <Route path="hotels/edit/:id" element={<HotelEditPage />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="admin/content" element={<ContentManager />} />
          <Route path="communications" element={<CommunicationsManager />} />
          <Route path="admin/communications" element={<CommunicationsManager />} />
          <Route path="notifications" element={<NotificationsManager />} />
          <Route path="admin/notifications" element={<NotificationsManager />} />
          <Route path="transportation" element={<TransportationManager />} />
          <Route path="reviews" element={<ReviewsManager />} />
          <Route path="profile" element={<ProfileManager />} />
          
          {/* B2B & Finance Routes matching reference URLs */}
          <Route path="companies" element={<CompaniesManager />} />
          <Route path="agents" element={<AgentsManager />} />
          <Route path="finance/commissions" element={<CommissionsManager />} />
          <Route path="finance/wallet" element={<WalletsManager />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
