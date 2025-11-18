import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Rent from './pages/Rent';
import Dashboard from './pages/agent/Dashboard';
import CreateListing from './pages/agent/CreateListing';
import Listings from './pages/agent/Listings';
import ListingDetail from './pages/agent/ListingDetail';
import Chat from './pages/agent/Chat';
import Contracts from './pages/agent/Contracts';
import Profile from './pages/agent/Profile';

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
      </Routes>
    </Router>
  );
}

export default App;
