import { format } from 'date-fns';
import {
  CheckSquare,
  Edit,
  Home,
  Plus,
  RefreshCw,
  Square,
  Trash2
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './Listings.css';

const Listings = () => {
  const location = useLocation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListings, setSelectedListings] = useState([]);
  const [listings, setListings] = useState([]);

  const checkExpiredListings = (listings) => {
    const now = new Date();
    return listings.map(listing => {
      if (listing.status === 'active' && listing.expiresAt && new Date(listing.expiresAt) < now) {
        return { ...listing, status: 'expired' };
      }
      return listing;
    });
  };

  const loadListings = useCallback(() => {
    const savedListings = JSON.parse(localStorage.getItem('listings') || '[]');
    const updatedListings = checkExpiredListings(savedListings);
    const hasChanges = updatedListings.some((listing, index) => 
      listing.status !== savedListings[index]?.status
    );
    if (hasChanges) {
      localStorage.setItem('listings', JSON.stringify(updatedListings));
    }
    setListings(updatedListings);
  }, []);

  useEffect(() => {
    loadListings();
    
    const handleStorageChange = (e) => {
      if (e.key === 'listings') loadListings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadListings);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadListings);
    };
  }, [location.pathname, loadListings]);

  const sortedListings = listings
    .filter(listing => filterStatus === 'all' || listing.status === filterStatus)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

  const updateListing = (updatedListings) => {
    setListings(updatedListings);
    localStorage.setItem('listings', JSON.stringify(updatedListings));
  };

  const getNewExpiryDate = () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const handleRepost = (id) => {
    const updatedListings = listings.map(listing => 
      listing.id === id 
        ? { ...listing, status: 'active', expiresAt: getNewExpiryDate() }
        : listing
    );
    updateListing(updatedListings);
  };

  const handleBulkRepost = () => {
    if (selectedListings.length === 0) {
      alert('กรุณาเลือกประกาศที่ต้องการ repost');
      return;
    }

    const count = selectedListings.length;
    if (window.confirm(`คุณต้องการ repost ${count} ประกาศหรือไม่?`)) {
      const updatedListings = listings.map(listing => 
        selectedListings.includes(listing.id)
          ? { ...listing, status: 'active', expiresAt: getNewExpiryDate() }
          : listing
      );
      updateListing(updatedListings);
      setSelectedListings([]);
      alert(`Repost สำเร็จ ${count} ประกาศ`);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedListings(prev => 
      prev.includes(id) ? prev.filter(listingId => listingId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) {
      updateListing(listings.filter(listing => listing.id !== id));
    }
  };

  const getStatusInfo = (listing) => {
    if (listing.status === 'closed') {
      return {
        label: 'Closed',
        color: 'closed',
        date: `Closed ${listing.closedAt ? format(new Date(listing.closedAt), 'MMM d, yyyy') : ''}`
      };
    }
    
    if (listing.status === 'draft') {
      return {
        label: 'Draft',
        color: 'draft',
        date: `Created ${listing.createdAt ? format(new Date(listing.createdAt), 'MMM d, yyyy') : ''}`
      };
    }
    
    const isExpired = listing.expiresAt && new Date(listing.expiresAt) < new Date();
    
    if (listing.status === 'expired' || isExpired) {
      return {
        label: 'Expired',
        color: 'expired',
        date: `Expired ${listing.expiresAt ? format(new Date(listing.expiresAt), 'MMM d, yyyy') : ''}`,
        isExpired: true
      };
    }
    
    if (!listing.expiresAt) {
      return { label: 'Active', color: 'active', date: 'Active' };
    }
    
    const daysUntilExpiry = Math.ceil((new Date(listing.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return {
        label: 'Expiring Soon',
        color: 'expiring',
        date: `Expires ${format(new Date(listing.expiresAt), 'MMM d, yyyy')}`
      };
    }
    
    return {
      label: 'Active',
      color: 'active',
      date: `Expires ${format(new Date(listing.expiresAt), 'MMM d, yyyy')}`
    };
  };

  const isExpiredListing = (listing) => {
    const statusInfo = getStatusInfo(listing);
    return statusInfo.color === 'expired' || statusInfo.isExpired;
  };

  const expiredListings = sortedListings.filter(isExpiredListing);
  const expiredCount = expiredListings.length;

  const handleSelectAll = () => {
    setSelectedListings(
      selectedListings.length === expiredCount 
        ? [] 
        : expiredListings.map(l => l.id)
    );
  };

  return (
    <Layout>
      <div className="listings-page">
        {/* Header Banner */}
        <div className="listings-header-banner">
          <div 
            className="banner-image"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
          </div>
        </div>

        {/* Filter and Action Bar */}
        <div className="listings-filter-bar">
          <div className="filter-bar-left">
            <div className="status-buttons">
              <button 
                className={`status-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`status-btn ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </button>
              <button 
                className={`status-btn ${filterStatus === 'closed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('closed')}
              >
                Closed
              </button>
              <button 
                className={`status-btn ${filterStatus === 'expired' ? 'active' : ''}`}
                onClick={() => setFilterStatus('expired')}
              >
                Expired 
              </button>
              <button 
                className={`status-btn ${filterStatus === 'draft' ? 'active' : ''}`}
                onClick={() => setFilterStatus('draft')}
              >
                Draft
              </button>
            </div>
            {expiredCount > 0 && (
              <div className="bulk-actions">
                <button className="bulk-select-btn" onClick={handleSelectAll}>
                  {selectedListings.length === expiredCount ? (
                    <>
                      <CheckSquare size={18} />
                      ยกเลิกเลือกทั้งหมด
                    </>
                  ) : (
                    <>
                      <Square size={18} />
                      เลือกหมดอายุทั้งหมด ({expiredCount})
                    </>
                  )}
                </button>
                {selectedListings.length > 0 && (
                  <button className="bulk-repost-btn" onClick={handleBulkRepost}>
                    <RefreshCw size={18} />
                    Repost ที่เลือก ({selectedListings.length})
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="filter-bar-right">
            <Link to="/agent/create-listing" className="add-listing-btn">
              <Plus size={18} />
            เพิ่มประกาศใหม่
            </Link>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="listings-content">
          <div className="listings-section-header">
            <h2 className="listings-title">My Listings</h2>
            <p className="listings-subtitle">
              Manage your properties. Expired listings must be reposted to regain visibility.
            </p>
          </div>

          {/* Listings Grid */}
          {sortedListings.length === 0 ? (
            <div className="listings-empty-state">
              <div className="empty-state-icon">
                <Home size={64} />
              </div>
              <h3 className="empty-state-title">ยังไม่มีรายการประกาศ</h3>
              <p className="empty-state-description">
                เริ่มต้นด้วยการสร้างประกาศอสังหาริมทรัพย์ของคุณ
              </p>
            </div>
          ) : (
            <div className="listings-grid">
              {sortedListings.map(listing => {
                const statusInfo = getStatusInfo(listing);
                const isSelected = selectedListings.includes(listing.id);
                const canSelect = isExpiredListing(listing);
                const price = listing.price 
                  ? (() => {
                      const num = parseFloat(listing.price.toString().replace(/[^0-9.]/g, ''));
                      return isNaN(num) ? listing.price : `฿${num.toLocaleString('th-TH')}`;
                    })()
                  : '-';

                return (
                  <div key={listing.id} className={`listing-card ${isSelected ? 'selected' : ''}`}>
                    {canSelect && (
                      <div className="listing-checkbox">
                        <button
                          type="button"
                          className="checkbox-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(listing.id);
                          }}
                        >
                          {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                      </div>
                    )}
                    <Link 
                      to={`/agent/listings/${listing.id}`}
                      className="listing-card-link"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="listing-image">
                        {listing.image ? (
                          <img src={listing.image} alt={listing.title} />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            background: '#f5f7fa', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '0.9rem'
                          }}>
                            ไม่มีรูปภาพ
                          </div>
                        )}
                      </div>
                      <div className="listing-body">
                        <h3 className="listing-title">{listing.title}</h3>
                        <div className="listing-price">{price}</div>
                        <div className={`listing-status status-${statusInfo.color}`}>
                          {statusInfo.label}
                          <span className="status-date">{statusInfo.date}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="listing-actions">
                      <Link 
                        to={`/agent/create-listing?edit=${listing.id}`}
                        className="action-btn edit-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(listing.id);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                      {canSelect && (
                        <button 
                          className="action-btn repost-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRepost(listing.id);
                          }}
                        >
                          <RefreshCw size={16} />
                          Repost
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Listings;
