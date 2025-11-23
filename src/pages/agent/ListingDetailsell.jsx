import { format } from 'date-fns';
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  Edit,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Percent,
  Phone,
  RefreshCw,
  Star,
  Trash2,
  User
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layoutsell';
import './ListingDetailsell.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [agentProfile, setAgentProfile] = useState(null);
  
  // Loan calculator states
  const [loanData, setLoanData] = useState({
    propertyPrice: '',
    loanAmount: '',
    interestRate: 3,
    loanTerm: 30
  });
  
  // Track if user has interacted with inputs
  const [inputTouched, setInputTouched] = useState({
    propertyPrice: false,
    loanAmount: false,
    interestRate: false,
    loanTerm: false
  });
  
  // Loan validation errors
  const [loanErrors, setLoanErrors] = useState({
    propertyPrice: '',
    loanAmount: '',
    interestRate: '',
    loanTerm: ''
  });

  const validateLoanField = useCallback((field, value, allLoanData) => {
    // Don't validate if value is empty
    if (value === '' || value === null || value === undefined) {
      setLoanErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
      return;
    }
    
    const numValue = parseFloat(value) || 0;
    const dataToValidate = allLoanData || loanData;
    
    setLoanErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      
      if (field === 'propertyPrice') {
        if (numValue < 100000) {
          newErrors.propertyPrice = 'ราคาอสังหาฯ ของคุณจะต้องมีราคาอย่างน้อย ฿ 100,000';
        } else {
          newErrors.propertyPrice = '';
          // Re-validate loan amount if property price is valid
          const loanAmount = parseFloat(dataToValidate.loanAmount) || 0;
          if (loanAmount > 0) {
            const maxLoanAmount = numValue * 0.9;
            if (loanAmount > maxLoanAmount) {
              newErrors.loanAmount = 'ยอดสินเชื่อของคุณไม่สามารถสูงกว่า 90% ของมูลค่าอสังหาฯ';
            } else {
              newErrors.loanAmount = '';
            }
          }
        }
      } else if (field === 'loanAmount') {
        const propertyPrice = parseFloat(dataToValidate.propertyPrice) || 0;
        if (propertyPrice > 0) {
          const maxLoanAmount = propertyPrice * 0.9;
          if (numValue > maxLoanAmount) {
            newErrors.loanAmount = 'ยอดสินเชื่อของคุณไม่สามารถสูงกว่า 90% ของมูลค่าอสังหาฯ';
          } else {
            newErrors.loanAmount = '';
          }
        } else {
          newErrors.loanAmount = '';
        }
      } else if (field === 'interestRate') {
        if (numValue < 2) {
          newErrors.interestRate = 'อัตราดอกเบี้ยของคุณต้องจะต้อง อย่างน้อย 2%';
        } else {
          newErrors.interestRate = '';
        }
      } else if (field === 'loanTerm') {
        if (numValue < 3) {
          newErrors.loanTerm = 'ระยะเวลากู้ของคุณไม่สามารถน้อย กว่า 3 ปีได้';
        } else {
          newErrors.loanTerm = '';
        }
      }
      
      return newErrors;
    });
  }, []);

  useEffect(() => {
    const savedListings = JSON.parse(localStorage.getItem('listings') || '[]');
    const foundListing = savedListings.find(l => l.id === id);
    setListing(foundListing);
    
    // Load agent profile
    const savedProfile = localStorage.getItem('agentProfile');
    if (savedProfile) {
      try {
        setAgentProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error loading agent profile:', e);
      }
    }
    
    setLoading(false);
    
    // Initialize loan calculator with property price (only for sell listings)
    if (foundListing && foundListing.type === 'sell' && foundListing.price) {
      const priceNum = parseFloat(foundListing.price.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(priceNum)) {
        const defaultLoanAmount = Math.floor(priceNum * 0.9); // 90% LTV
        const initialData = {
          propertyPrice: priceNum,
          loanAmount: defaultLoanAmount,
          interestRate: 3,
          loanTerm: 30
        };
        setLoanData(initialData);
        
        // Validate initial data after state update
        setTimeout(() => {
          validateLoanField('propertyPrice', priceNum, initialData);
          validateLoanField('loanAmount', defaultLoanAmount, initialData);
        }, 0);
      }
    } else {
      // Reset loan data if not a sell listing
      setLoanData({
        propertyPrice: '',
        loanAmount: '',
        interestRate: 3,
        loanTerm: 30
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Calculate loan payment
  const calculateLoan = () => {
    const principal = parseFloat(loanData.loanAmount) || 0;
    const annualRate = parseFloat(loanData.interestRate) || 0;
    const years = parseFloat(loanData.loanTerm) || 30;
    
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      return {
        monthlyPayment: 0,
        principalPayment: 0,
        interestPayment: 0,
        downPayment: 0,
        totalDownPayment: 0
      };
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    // Calculate monthly payment using amortization formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // First month breakdown (approximation)
    const interestPayment = principal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    // Down payment calculation
    const propertyPrice = parseFloat(loanData.propertyPrice) || 0;
    const downPayment = propertyPrice - principal;
    const totalDownPayment = downPayment;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      downPayment: Math.round(downPayment),
      totalDownPayment: Math.round(totalDownPayment)
    };
  };
  
  const loanResult = calculateLoan();
  
  const handleLoanInputChange = (field, value) => {
    // Mark input as touched when user starts typing
    if (!inputTouched[field]) {
      setInputTouched(prev => ({ ...prev, [field]: true }));
    }
    
    // If value is empty, set to empty string
    if (value === '' || value === null || value === undefined) {
      setLoanData(prev => {
        const updated = { ...prev, [field]: '' };
        
        // Auto-calculate loan amount if property price changes
        if (field === 'propertyPrice') {
          updated.loanAmount = '';
        }
        
        // Validate with updated data
        validateLoanField(field, '', updated);
        if (field === 'propertyPrice') {
          validateLoanField('loanAmount', updated.loanAmount, updated);
        }
        
        return updated;
      });
      return;
    }
    
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.toString().replace(/[^0-9.]/g, '');
    const numValue = parseFloat(cleanValue);
    
    // If parseFloat returns NaN, set to empty string
    if (isNaN(numValue)) {
      setLoanData(prev => {
        const updated = { ...prev, [field]: '' };
        validateLoanField(field, '', updated);
        return updated;
      });
      return;
    }
    
    setLoanData(prev => {
      const updated = { ...prev, [field]: numValue };
      
      // Auto-calculate loan amount if property price changes
      if (field === 'propertyPrice' && numValue > 0) {
        const maxLoanAmount = Math.floor(numValue * 0.9);
        // Only auto-update if current loan amount exceeds max or is empty
        if (!updated.loanAmount || updated.loanAmount > maxLoanAmount) {
          updated.loanAmount = maxLoanAmount;
        }
      }
      
      // Validate all related fields with updated data
      validateLoanField(field, numValue, updated);
      if (field === 'propertyPrice') {
        validateLoanField('loanAmount', updated.loanAmount, updated);
      } else if (field === 'loanAmount') {
        // Re-validate property price to ensure it's still valid
        validateLoanField('propertyPrice', updated.propertyPrice, updated);
      }
      
      return updated;
    });
  };
  
  const formatCurrency = (amount) => {
    return `฿ ${amount.toLocaleString('th-TH')}`;
  };

  const handleDelete = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) {
      const savedListings = JSON.parse(localStorage.getItem('listings') || '[]');
      const updatedListings = savedListings.filter(l => l.id !== id);
      localStorage.setItem('listings', JSON.stringify(updatedListings));
      navigate('/agent/listings');
    }
  };

  const handleRepost = () => {
    const savedListings = JSON.parse(localStorage.getItem('listings') || '[]');
    const updatedListings = savedListings.map(l => 
      l.id === id ? { 
        ...l, 
        status: 'active',
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      } : l
    );
    localStorage.setItem('listings', JSON.stringify(updatedListings));
    setListing(updatedListings.find(l => l.id === id));
  };

  const getStatusInfo = (listing) => {
    if (listing.status === 'closed') {
      return { label: 'Closed', color: 'closed' };
    }
    if (listing.status === 'draft') {
      return { label: 'Draft', color: 'draft' };
    }
    
    const isExpired = listing.expiresAt && new Date(listing.expiresAt) < new Date();
    if (listing.status === 'expired' || isExpired) {
      return { label: 'Expired', color: 'expired', isExpired: true };
    }
    
    const daysUntilExpiry = listing.expiresAt 
      ? Math.ceil((new Date(listing.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)) 
      : 0;
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return { label: 'Expiring Soon', color: 'expiring' };
    }
    
    return { label: 'Active', color: 'active' };
  };

  const propertyTypes = {
    'condo': 'คอนโด',
    'house': 'บ้านเดี่ยว',
    'townhouse': 'ทาวเฮ้าส์',
    'townhome': 'ทาวโฮม',
    'land': 'ที่ดิน',
    'apartment': 'อพาร์ทเมนท์',
    'dormitory': 'หอพัก',
    'shophouse': 'ตึกแถว',
    'commercial': 'อาคารพาณิชย์'
  };

  if (loading) {
    return (
      <Layout>
        <div className="listing-detail-page">
          <div className="listing-detail-loading">
            <p>กำลังโหลด...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="listing-detail-page">
          <div className="listing-detail-not-found">
            <Home size={64} />
            <h2>ไม่พบประกาศ</h2>
            <p>ประกาศที่คุณกำลังมองหาอาจถูกลบหรือไม่มีอยู่</p>
            <Link to="/agent/listings" className="btn-primary">
              <ArrowLeft size={20} />
              กลับไปที่รายการประกาศ
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const statusInfo = getStatusInfo(listing);
  const images = listing.images || (listing.image ? [listing.image] : []);
  const currentImage = images[currentImageIndex] || '';

  return (
    <Layout>
      <div className="listing-detail-page">
        {/* Back Button */}
        <div className="listing-detail-header">
          <button 
            onClick={() => navigate('/agent/listings')} 
            className="back-button"
            type="button"
          >
            <ArrowLeft size={20} />
            กลับไปที่รายการประกาศ
          </button>
          <div className="listing-detail-actions">
            <Link 
              to={`/agent/create-listing?edit=${listing.id}`}
              className="action-btn edit-btn"
            >
              <Edit size={18} />
              แก้ไข
            </Link>
            <button className="action-btn delete-btn" onClick={handleDelete}>
              <Trash2 size={18} />
              ลบ
            </button>
            {(statusInfo.color === 'expired' || statusInfo.isExpired) && (
              <button className="action-btn repost-btn" onClick={handleRepost}>
                <RefreshCw size={18} />
                Repost
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="listing-detail-content">
          {/* Image Gallery */}
          <div className="listing-detail-gallery">
            <div className="main-image">
              {currentImage ? (
                <img 
                  src={typeof currentImage === 'string' ? currentImage : currentImage.preview || currentImage} 
                  alt={listing.title} 
                />
              ) : (
                <div className="no-image-placeholder">
                  <Home size={64} />
                  <p>ไม่มีรูปภาพ</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-grid">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={typeof img === 'string' ? img : img.preview || img} 
                      alt={`Thumbnail ${index + 1}`} 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="listing-detail-info">
            {/* Title and Status */}
            <div className="listing-detail-title-section">
              <div>
                <h1 className="listing-detail-title">{listing.title}</h1>
                <div className="listing-detail-meta">
                  <span className="listing-type-badge">
                    {listing.type === 'sell' ? 'ขาย' : 'เช่า'}
                  </span>
                  <span className="property-type-badge">
                    {propertyTypes[listing.propertyType] || listing.propertyType}
                  </span>
                </div>
              </div>
              <div className={`listing-status-badge status-${statusInfo.color}`}>
                {statusInfo.label}
              </div>
            </div>

            {/* Price */}
            <div className="listing-detail-price">
              {listing.price ? (() => {
                const num = parseFloat(listing.price.toString().replace(/[^0-9.]/g, ''));
                return isNaN(num) ? listing.price : `฿${num.toLocaleString('th-TH')}`;
              })() : 'ไม่ระบุราคา'}
            </div>

            {/* Key Features */}
            <div className="listing-detail-features">
              {listing.bedrooms && (
                <div className="feature-item">
                  <Bed size={20} />
                  <span>{listing.bedrooms} ห้องนอน</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="feature-item">
                  <Bath size={20} />
                  <span>{listing.bathrooms} ห้องน้ำ</span>
                </div>
              )}
              {listing.usableArea && (
                <div className="feature-item">
                  <Home size={20} />
                  <span>{listing.usableArea} ตร.ม.</span>
                </div>
              )}
              {listing.landArea && (
                <div className="feature-item">
                  <Home size={20} />
                  <span>{listing.landArea} ตร.ว.</span>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="listing-detail-section">
                <h2 className="section-title">รายละเอียด</h2>
                <p className="listing-description">{listing.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="listing-detail-section">
              <h2 className="section-title">ข้อมูลทรัพย์สิน</h2>
              <div className="details-grid">
                {listing.propertyType && (
                  <div className="detail-item">
                    <span className="detail-label">ประเภททรัพย์</span>
                    <span className="detail-value">
                      {propertyTypes[listing.propertyType] || listing.propertyType}
                    </span>
                  </div>
                )}
                {listing.yearBuilt && (
                  <div className="detail-item">
                    <span className="detail-label">ปีที่สร้าง</span>
                    <span className="detail-value">{listing.yearBuilt}</span>
                  </div>
                )}
                {listing.usableArea && (
                  <div className="detail-item">
                    <span className="detail-label">พื้นที่ใช้สอย</span>
                    <span className="detail-value">{listing.usableArea} ตร.ม.</span>
                  </div>
                )}
                {listing.landArea && (
                  <div className="detail-item">
                    <span className="detail-label">ที่ดิน</span>
                    <span className="detail-value">{listing.landArea} ตร.ว.</span>
                  </div>
                )}
                {listing.bedrooms && (
                  <div className="detail-item">
                    <span className="detail-label">ห้องนอน</span>
                    <span className="detail-value">{listing.bedrooms} ห้อง</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="detail-item">
                    <span className="detail-label">ห้องน้ำ</span>
                    <span className="detail-value">{listing.bathrooms} ห้อง</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {listing.features?.length > 0 && (
              <div className="listing-detail-section">
                <h2 className="section-title">สิ่งอำนวยความสะดวก</h2>
                <div className="features-list">
                  {listing.features
                    .filter(f => f !== 'อื่นๆ' || listing.otherFeature)
                    .map((feature, index) => (
                      <div key={index} className="feature-tag">
                        {feature === 'อื่นๆ' && listing.otherFeature ? listing.otherFeature : feature}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="listing-detail-section">
              <h2 className="section-title">ที่ตั้ง</h2>
              {listing.address && (
                <div className="location-info">
                  <MapPin size={20} />
                  <span>{listing.address}</span>
                </div>
              )}
              {listing.mapEmbed && (
                <div 
                  className="map-container"
                  dangerouslySetInnerHTML={{ __html: listing.mapEmbed }}
                />
              )}
            </div>

            {/* Contact Information */}
            {(listing.contactLine || listing.contactPhone || listing.contactEmail) && (
              <div className="listing-detail-section">
                <h2 className="section-title">ช่องทางติดต่อ</h2>
                <div className="contact-info">
                  {listing.contactLine && (
                    <a 
                      href={`https://line.me/ti/p/${listing.contactLine.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-item"
                    >
                      <MessageCircle size={20} />
                      <span>{listing.contactLine}</span>
                    </a>
                  )}
                  {listing.contactPhone && (
                    <a 
                      href={`tel:${listing.contactPhone}`}
                      className="contact-item"
                    >
                      <Phone size={20} />
                      <span>{listing.contactPhone}</span>
                    </a>
                  )}
                  {listing.contactEmail && (
                    <a 
                      href={`mailto:${listing.contactEmail}`}
                      className="contact-item"
                    >
                      <Mail size={20} />
                      <span>{listing.contactEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Agent Profile */}
            {agentProfile && (
              <div className="listing-detail-section agent-profile-section">
                <h2 className="section-title">นายหน้า</h2>
                <div className="agent-profile-card">
                  <div className="agent-profile-header">
                    <div className="agent-avatar">
                      {agentProfile.profileImage ? (
                        <img src={agentProfile.profileImage} alt={agentProfile.name} />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div className="agent-info">
                      <h3 className="agent-name">{agentProfile.name || 'นายหน้า'}</h3>
                      {agentProfile.rating !== undefined && agentProfile.rating > 0 && (
                        <div className="agent-rating">
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <span>{agentProfile.rating.toFixed(1)}</span>
                          {agentProfile.reviewCount > 0 && (
                            <span className="review-count">({agentProfile.reviewCount} รีวิว)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {agentProfile.bio && (
                    <p className="agent-bio">{agentProfile.bio}</p>
                  )}
                  {agentProfile.phone && (
                    <div className="agent-contact">
                      <Phone size={16} />
                      <span>{agentProfile.phone}</span>
                    </div>
                  )}
                  {agentProfile.email && (
                    <div className="agent-contact">
                      <Mail size={16} />
                      <span>{agentProfile.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status and Dates */}
            <div className="listing-detail-section">
              <h2 className="section-title">สถานะและวันที่</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">สถานะ</span>
                  <span className={`detail-value status-${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                {listing.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">วันที่สร้าง</span>
                    <span className="detail-value">
                      {format(new Date(listing.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                )}
                {listing.expiresAt && (
                  <div className="detail-item">
                    <span className="detail-label">วันหมดอายุ</span>
                    <span className="detail-value">
                      {format(new Date(listing.expiresAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Calculator Section */}
            {listing.type === 'sell' && (
              <div className="listing-detail-section loan-calculator-section">
                <h2 className="section-title">ยอดสินเชื่อโดยประมาณ</h2>
                <div className="loan-calculator-content">
                  <div className="loan-calculator-left">
                    {/* Loan Details */}
                    <div className="loan-details-card">
                      <h3 className="loan-subtitle">รายละเอียดสินเชื่อ</h3>
                      <div className="loan-monthly-payment">
                        <div className="loan-payment-label">ยอดสินเชื่อที่ต้องชำระต่อเดือนโดยประมาณ</div>
                        <div className="loan-payment-amount">
                          {formatCurrency(loanResult.monthlyPayment)} / เดือน
                        </div>
                        {loanResult.monthlyPayment > 0 && (
                          <>
                            <div className="loan-breakdown-bar">
                              <div 
                                className="loan-bar-segment principal-segment"
                                style={{ 
                                  width: `${(loanResult.principalPayment / loanResult.monthlyPayment) * 100}%` 
                                }}
                              />
                              <div 
                                className="loan-bar-segment interest-segment"
                                style={{ 
                                  width: `${(loanResult.interestPayment / loanResult.monthlyPayment) * 100}%` 
                                }}
                              />
                            </div>
                            <div className="loan-breakdown-items">
                              <div className="loan-breakdown-item">
                                <span className="breakdown-bullet principal-bullet"></span>
                                <span>{formatCurrency(loanResult.principalPayment)} เงินต้น</span>
                              </div>
                              <div className="loan-breakdown-item">
                                <span className="breakdown-bullet interest-bullet"></span>
                                <span>{formatCurrency(loanResult.interestPayment)} ดอกเบี้ย</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Initial Expenses */}
                    <div className="loan-details-card">
                      <h3 className="loan-subtitle">ค่าใช้จ่ายที่อาจต้องมีเบื้องต้น</h3>
                      <div className="loan-down-payment">
                        <div className="loan-payment-label">เงินดาวน์ทั้งหมด</div>
                        <div className="loan-payment-amount">
                          {formatCurrency(loanResult.totalDownPayment)}
                        </div>
                        {loanResult.totalDownPayment > 0 && (
                          <>
                            <div className="loan-breakdown-bar">
                              <div 
                                className="loan-bar-segment down-payment-segment"
                                style={{ 
                                  width: `${(loanResult.downPayment / loanData.propertyPrice) * 100}%` 
                                }}
                              />
                              <div 
                                className="loan-bar-segment loan-amount-segment"
                                style={{ 
                                  width: `${(loanData.loanAmount / loanData.propertyPrice) * 100}%` 
                                }}
                              />
                            </div>
                            <div className="loan-breakdown-items">
                              <div className="loan-breakdown-item">
                                <span className="breakdown-bullet down-payment-bullet"></span>
                                <span>เงินดาวน์</span>
                              </div>
                              <div className="loan-breakdown-item">
                                <span className="breakdown-bullet loan-amount-bullet"></span>
                                <span>
                                  จํานวนสินเชื่อ {formatCurrency(loanData.loanAmount)} ในอัตรา {Math.round((loanData.loanAmount / loanData.propertyPrice) * 100)}% ของสินเชื่อต่อราคาบ้าน (Loan-to-value)
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="loan-calculator-right">
                    <div className="loan-input-group">
                      <label className="loan-input-label">ราคาอสังหาฯ</label>
                      <div className={`loan-input-wrapper ${loanErrors.propertyPrice ? 'has-error' : ''}`}>
                        <div className="loan-input-icon">
                          <span style={{ fontSize: '1.2rem' }}>฿</span>
                        </div>
                        <input
                          type="text"
                          className="loan-input"
                          value={loanData.propertyPrice ? loanData.propertyPrice.toLocaleString('th-TH') : ''}
                          onChange={(e) => handleLoanInputChange('propertyPrice', e.target.value)}
                          onBlur={() => {
                            if (!inputTouched.propertyPrice) {
                              setInputTouched(prev => ({ ...prev, propertyPrice: true }));
                            }
                          }}
                          placeholder="0"
                        />
                      </div>
                      {loanErrors.propertyPrice && (
                        <div className="loan-error-message">
                          {loanErrors.propertyPrice}
                        </div>
                      )}
                    </div>

                    <div className="loan-input-group">
                      <label className="loan-input-label">ยอดสินเชื่อ</label>
                      <div className={`loan-input-wrapper ${loanErrors.loanAmount ? 'has-error' : ''}`}>
                        <div className="loan-input-icon">
                          <span style={{ fontSize: '1.2rem' }}>฿</span>
                        </div>
                        <input
                          type="text"
                          className="loan-input"
                          value={loanData.loanAmount ? loanData.loanAmount.toLocaleString('th-TH') : ''}
                          onChange={(e) => handleLoanInputChange('loanAmount', e.target.value)}
                          onBlur={() => {
                            if (!inputTouched.loanAmount) {
                              setInputTouched(prev => ({ ...prev, loanAmount: true }));
                            }
                          }}
                          placeholder="0"
                        />
                      </div>
                      {loanErrors.loanAmount && (
                        <div className="loan-error-message">
                          {loanErrors.loanAmount}
                        </div>
                      )}
                    </div>

                    <div className="loan-input-group">
                      <label className="loan-input-label">อัตราดอกเบี้ย</label>
                      <div className={`loan-input-wrapper ${loanErrors.interestRate ? 'has-error' : ''}`}>
                        <div className="loan-input-icon">
                          <Percent size={20} />
                        </div>
                        <input
                          type="number"
                          className={`loan-input ${!inputTouched.interestRate ? 'default-value' : ''}`}
                          value={loanData.interestRate}
                          onChange={(e) => handleLoanInputChange('interestRate', e.target.value)}
                          onFocus={() => {
                            if (!inputTouched.interestRate) {
                              setInputTouched(prev => ({ ...prev, interestRate: true }));
                            }
                          }}
                          min="2"
                          max="20"
                          step="0.1"
                        />
                      </div>
                      {loanErrors.interestRate && (
                        <div className="loan-error-message">
                          {loanErrors.interestRate}
                        </div>
                      )}
                    </div>

                    <div className="loan-input-group">
                      <label className="loan-input-label">ระยะเวลากู้</label>
                      <div className={`loan-input-wrapper ${loanErrors.loanTerm ? 'has-error' : ''}`}>
                        <div className="loan-input-icon">
                          <Calendar size={20} />
                        </div>
                        <input
                          type="number"
                          className={`loan-input ${!inputTouched.loanTerm ? 'default-value' : ''}`}
                          value={loanData.loanTerm}
                          onChange={(e) => handleLoanInputChange('loanTerm', e.target.value)}
                          onFocus={() => {
                            if (!inputTouched.loanTerm) {
                              setInputTouched(prev => ({ ...prev, loanTerm: true }));
                            }
                          }}
                          min="3"
                          max="50"
                        />
                        <span className="loan-input-suffix">ปี</span>
                      </div>
                      {loanErrors.loanTerm && (
                        <div className="loan-error-message">
                          {loanErrors.loanTerm}
                        </div>
                      )}
                    </div>

                    <button 
                      className="loan-calculate-btn"
                      onClick={() => {
                        // Recalculate is automatic, but we can add any additional logic here
                        const result = calculateLoan();
                        console.log('Recalculated:', result);
                      }}
                    >
                      คำนวณอีกครั้ง
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;

