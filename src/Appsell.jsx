import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Buy from './pages/Buysell';
import Home from './pages/Homesell';
import Rent from './pages/Rentsell';
import Chat from './pages/agent/Chatsell';
import Contracts from './pages/agent/Contractssell';
import CreateListing from './pages/agent/CreateListingsell';
import Dashboard from './pages/agent/Dashboardsell';
import Guide from './pages/agent/Guidesell';
import ListingDetail from './pages/agent/ListingDetailsell';
import Listings from './pages/agent/Listingssell';
import Profile from './pages/agent/Profilesell';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/agent/dashboard" element={<Dashboard />} />
        <Route path="/agent/create-listing" element={<CreateListing />} />
        <Route path="/agent/listings" element={<Listings />} />
        <Route path="/agent/listings/:id" element={<ListingDetail />} />
        <Route path="/agent/statistics" element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="/agent/chat" element={<Chat />} />
        <Route path="/agent/contracts" element={<Contracts />} />
        <Route path="/agent/profile" element={<Profile />} />
        <Route path="/agent/guide" element={<Guide />} />
      </Routes>
    </Router>
  );
}

export default App;
