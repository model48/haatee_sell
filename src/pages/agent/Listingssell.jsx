import { format } from 'date-fns';
import {
  Bath,
  Bed,
  CheckSquare,
  Edit,
  Eye,
  Filter,
  Heart,
  Home,
  Plus,
  RefreshCw,
  Square,
  Trash2,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layoutsell';
import './Listingssell.css';

const Listings = () => {
  const location = useLocation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListings, setSelectedListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    minArea: '',
    maxArea: '',
    allowPets: '',
    expiringSoon: false
  });

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

  const applyFilters = (listingList) => {
    return listingList.filter(listing => {
      // Filter by price
      if (filters.minPrice || filters.maxPrice) {
        const priceNum = listing.price 
          ? parseFloat(listing.price.toString().replace(/[^0-9.]/g, ''))
          : 0;
        if (filters.minPrice && priceNum < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && priceNum > parseFloat(filters.maxPrice)) return false;
      }

      // Filter by bedrooms
      if (filters.bedrooms && listing.bedrooms) {
        if (parseInt(listing.bedrooms) !== parseInt(filters.bedrooms)) return false;
      }

      // Filter by area (usableArea or landArea)
      if (filters.minArea || filters.maxArea) {
        const usableArea = listing.usableArea ? parseFloat(listing.usableArea) : 0;
        const landArea = listing.landArea ? parseFloat(listing.landArea) : 0;
        const totalArea = usableArea || landArea;
        
        if (filters.minArea && totalArea < parseFloat(filters.minArea)) return false;
        if (filters.maxArea && totalArea > parseFloat(filters.maxArea)) return false;
      }

      // Filter by pet allowance
      if (filters.allowPets !== '') {
        const hasPetFeature = listing.features?.some(f => 
          f.toLowerCase().includes('สัตว์') || f.toLowerCase().includes('pet')
        );
        if (filters.allowPets === 'yes' && !hasPetFeature) return false;
        if (filters.allowPets === 'no' && hasPetFeature) return false;
      }

      // Filter by expiring soon (within 7 days)
      if (filters.expiringSoon && listing.expiresAt) {
        const daysUntilExpiry = Math.ceil((new Date(listing.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry > 7 || daysUntilExpiry <= 0) return false;
      }

      return true;
    });
  };

  const sortedListings = applyFilters(
    listings.filter(listing => filterStatus === 'all' || listing.status === filterStatus)
  ).sort((a, b) => {
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
        label: 'ปิดการขาย',
        color: 'closed',
        date: `ปิดการขายเมื่อ ${listing.closedAt ? format(new Date(listing.closedAt), 'MMM d, yyyy') : ''}`
      };
    }
    
    if (listing.status === 'draft') {
      return {
        label: 'ฉบับร่าง',
        color: 'draft',
        date: `สร้างเมื่อ ${listing.createdAt ? format(new Date(listing.createdAt), 'MMM d, yyyy') : ''}`
      };
    }
    
    const isExpired = listing.expiresAt && new Date(listing.expiresAt) < new Date();
    
    if (listing.status === 'expired' || isExpired) {
      return {
        label: 'หมดอายุ',
        color: 'expired',
        date: `หมดอายุเมื่อ ${listing.expiresAt ? format(new Date(listing.expiresAt), 'MMM d, yyyy') : ''}`,
        isExpired: true
      };
    }
    
    if (!listing.expiresAt) {
      return { label: 'เปิดใช้งาน', color: 'active', date: 'เปิดใช้งาน' };
    }
    
    const daysUntilExpiry = Math.ceil((new Date(listing.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return {
        label: 'ใกล้หมดอายุ',
        color: 'expiring',
        date: `หมดอายุเมื่อ ${format(new Date(listing.expiresAt), 'MMM d, yyyy')}`
      };
    }
    
    return {
      label: 'เปิดใช้งาน',
      color: 'active',
      date: `หมดอายุเมื่อ ${format(new Date(listing.expiresAt), 'MMM d, yyyy')}`
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
                className="filter-toggle-btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={18} />
                กรอง
              </button>
              <button 
                className={`status-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                ทั้งหมด
              </button>
              <button 
                className={`status-btn ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                เปิดใช้งาน
              </button>
              <button 
                className={`status-btn ${filterStatus === 'closed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('closed')}
              >
                ปิดการขาย
              </button>
              <button 
                className={`status-btn ${filterStatus === 'expired' ? 'active' : ''}`}
                onClick={() => setFilterStatus('expired')}
              >
                หมดอายุ
              </button>
              <button 
                className={`status-btn ${filterStatus === 'draft' ? 'active' : ''}`}
                onClick={() => setFilterStatus('draft')}
              >
                ฉบับร่าง
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

        {/* Filter Panel */}
        {showFilter && (
          <div className="filter-panel">
            <div className="filter-panel-header">
              <h3>Filter - ระบบกรอง และค้นหาประกาศของคุณได้ง่ายมากขึ้น</h3>
              <button 
                className="filter-panel-close"
                onClick={() => setShowFilter(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="filter-panel-body">
              <div className="filter-group">
                <label>กรองตามราคา (บาท)</label>
                <div className="filter-range">
                  <input
                    type="number"
                    placeholder="ราคาต่ำสุด"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <span>ถึง</span>
                  <input
                    type="number"
                    placeholder="ราคาสูงสุด"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>กรองตามพื้นที่ (ตร.ม.)</label>
                <div className="filter-range">
                  <input
                    type="number"
                    placeholder="พื้นที่ต่ำสุด"
                    value={filters.minArea}
                    onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                  />
                  <span>ถึง</span>
                  <input
                    type="number"
                    placeholder="พื้นที่สูงสุด"
                    value={filters.maxArea}
                    onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>กรองตามจำนวนห้องนอน</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="1">1 ห้อง</option>
                  <option value="2">2 ห้อง</option>
                  <option value="3">3 ห้อง</option>
                  <option value="4">4 ห้อง</option>
                  <option value="5">5+ ห้อง</option>
                </select>
              </div>

              <div className="filter-group">
                <label>กรองตามการอนุญาตเลี้ยงสัตว์</label>
                <select
                  value={filters.allowPets}
                  onChange={(e) => setFilters({...filters, allowPets: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="yes">อนุญาต</option>
                  <option value="no">ไม่อนุญาต</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.expiringSoon}
                    onChange={(e) => setFilters({...filters, expiringSoon: e.target.checked})}
                  />
                  <span>กรองตามประกาศใกล้หมดอายุ (ภายใน 7 วัน)</span>
                </label>
              </div>
            </div>
            <div className="filter-panel-footer">
              <button 
                className="filter-reset-btn"
                onClick={() => {
                  setFilters({
                    minPrice: '',
                    maxPrice: '',
                    bedrooms: '',
                    minArea: '',
                    maxArea: '',
                    allowPets: '',
                    expiringSoon: false
                  });
                }}
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        )}

        {/* My Listings Section */}
        <div className="listings-content">
          <div className="listings-section-header">
            <h2 className="listings-title">รายการประกาศ</h2>
            <p className="listings-subtitle">
              จัดการทรัพย์สินของคุณ ประกาศที่หมดอายุสามารถโพสต์ใหม่เพื่อให้กลับมาแสดงผลได้อีกครั้ง
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
                        {(listing.bedrooms || listing.bathrooms) && (
                          <div className="listing-features">
                            {listing.bedrooms && (
                              <div className="listing-feature-item">
                                <Bed size={18} />
                                <span>{listing.bedrooms} ห้องนอน</span>
                              </div>
                            )}
                            {listing.bathrooms && (
                              <div className="listing-feature-item">
                                <Bath size={18} />
                                <span>{listing.bathrooms} ห้องน้ำ</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="listing-stats">
                          <div className="listing-stat-item">
                            <Eye size={16} />
                            <span>{listing.views ? listing.views.toLocaleString() : '0'}</span>
                          </div>
                          <div className="listing-stat-item">
                            <Heart size={16} />
                            <span>{listing.favorites || listing.interested || '0'}</span>
                          </div>
                        </div>
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
                        แก้ไข
                      </Link>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(listing.id);
                        }}
                      >
                        <Trash2 size={16} />
                        ลบ
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
                          โพสต์ใหม่
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
