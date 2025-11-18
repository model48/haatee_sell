import {
  Bath,
  Bed,
  Book,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  FileText,
  Home,
  Loader,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Share2,
  Star,
  Upload,
  User,
  X,
  XCircle
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './Profile.css';

const PROPERTY_TYPES = {
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

const Profile = () => {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'verified', 'rejected'
  const [errors, setErrors] = useState({});
  const [originalProfile, setOriginalProfile] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // โหลดข้อมูลจาก localStorage หรือใช้ค่า default
  const loadProfileFromStorage = () => {
    const saved = localStorage.getItem('agentProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
    return {
      name: 'Anthony',
      email: 'anthony@example.com',
      phone: '081-234-5678',
      bio: 'นายหน้าอสังหาริมทรัพย์มืออาชีพ มีประสบการณ์มากว่า 10 ปี',
      profileImage: null,
      userType: 'agent',
      rating: 0.0,
      reviewCount: 0
    };
  };

  const [profile, setProfile] = useState(() => {
    const loaded = loadProfileFromStorage();
    return {
      ...loaded,
      coverPhoto: loaded.coverPhoto || null,
      rating: loaded.rating || 0.0,
      reviewCount: loaded.reviewCount || 0,
      userType: loaded.userType || 'agent' // Ensure userType is always set
    };
  });

  const getStatistics = () => {
    const savedListings = localStorage.getItem('listings');
    let listings = [];
    if (savedListings) {
      try {
        listings = JSON.parse(savedListings);
      } catch (e) {
        console.error('Error loading listings:', e);
      }
    }

    // นับประกาศทั้งหมด (active + closed)
    const allListings = listings.filter(l => l.status === 'active' || l.status === 'closed');
    
    const propertiesForSale = allListings.filter(l => {
      const type = l.type || l.listingType || 'sale';
      return type === 'sell' || type === 'sale' || type === 'ขาย';
    }).length;
    
    const propertiesForRent = allListings.filter(l => {
      const type = l.type || l.listingType || 'rent';
      return type === 'rent' || type === 'เช่า' || type === 'ให้เช่า';
    }).length;
    
    const closedDeals = listings.filter(l => l.status === 'closed').length;

    return {
      propertiesForSale,
      propertiesForRent,
      closedDeals
    };
  };

  const [statistics, setStatistics] = useState(getStatistics());

  // ตรวจสอบและอัปเดต listings ที่หมดอายุ
  const checkExpiredListings = (listings) => {
    const now = new Date();
    return listings.map(listing => {
      // ถ้าเป็น active และหมดอายุแล้ว ให้เปลี่ยนเป็น expired
      if (listing.status === 'active' && listing.expiresAt) {
        const expiresAt = new Date(listing.expiresAt);
        if (expiresAt < now) {
          return { ...listing, status: 'expired' };
        }
      }
      return listing;
    });
  };

  // โหลด listings จาก localStorage
  const loadListings = useCallback(() => {
    const savedListings = localStorage.getItem('listings');
    let listings = [];
    if (savedListings) {
      try {
        listings = JSON.parse(savedListings);
      } catch (e) {
        console.error('Error loading listings:', e);
      }
    }
    // ตรวจสอบและอัปเดต listings ที่หมดอายุ
    const updatedListings = checkExpiredListings(listings);
    // บันทึกกลับถ้ามีการเปลี่ยนแปลง
    const hasChanges = updatedListings.some((listing, index) => 
      listing.status !== listings[index]?.status
    );
    if (hasChanges) {
      localStorage.setItem('listings', JSON.stringify(updatedListings));
    }
    // แสดงทั้ง active และ draft
    return updatedListings.filter(l => l.status === 'active' || l.status === 'draft');
  }, []);

  const [profileListings, setProfileListings] = useState(loadListings());
  const [propertyTab, setPropertyTab] = useState('sell'); // 'sell' or 'rent'

  // อัพเดทสถิติและ listings เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    // ตรวจสอบทุกครั้งที่ component mount
    const currentListings = loadListings();
    setStatistics(getStatistics());
    setProfileListings(currentListings);
    
    // ตั้ง interval เพื่อตรวจสอบการเปลี่ยนแปลงทุก 2 วินาที
    const interval = setInterval(() => {
      setStatistics(getStatistics());
      setProfileListings(loadListings());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [loadListings]);

  // Reload listings when navigating to this page
  useEffect(() => {
    setProfileListings(loadListings());
  }, [location.pathname, loadListings]);

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('agentDocuments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // ตรวจสอบว่ามี preview เป็น base64 string หรือไม่
        return {
          idCard: parsed.idCard?.preview ? parsed.idCard : null,
          license: parsed.license?.preview ? parsed.license : null,
          bankAccount: parsed.bankAccount?.preview ? parsed.bankAccount : null,
        };
      } catch (e) {
        console.error('Error loading documents:', e);
      }
    }
    return {
      idCard: null,
      license: null,
      bankAccount: null,
    };
  });

  // โหลดสถานะการยืนยันตัวตน
  useEffect(() => {
    const savedStatus = localStorage.getItem('verificationStatus');
    if (savedStatus) {
      setVerificationStatus(savedStatus);
    }
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value || value.trim() === '') {
          newErrors.email = 'กรุณากรอกอีเมล';
        } else {
          // รูปแบบอีเมลที่ถูกต้อง: local@domain.tld
          // - local part: อนุญาตตัวอักษร ตัวเลข และอักขระพิเศษบางตัว (. _ - +)
          // - domain part: ต้องมีอย่างน้อย 1 ตัวอักษร
          // - TLD: ต้องมีอย่างน้อย 2 ตัวอักษร
          const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          
          // ตรวจสอบความยาว
          if (value.length > 254) {
            newErrors.email = 'อีเมลยาวเกินไป (ไม่เกิน 254 ตัวอักษร)';
          } else if (!emailRegex.test(value)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: example@email.com)';
          } else {
            // ตรวจสอบเพิ่มเติม: ไม่ให้มีจุดซ้อนกัน หรือขึ้นต้น/ลงท้ายด้วยจุด
            const localPart = value.split('@')[0];
            if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
              newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
            } else {
              delete newErrors.email;
            }
          }
        }
        break;
      case 'phone': {
        const phoneRegex = /^[0-9-]+$/;
        if (!value || !phoneRegex.test(value) || value.replace(/[^0-9]/g, '').length < 9) {
          newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง';
        } else {
          delete newErrors.phone;
        }
        break;
      }
      case 'name':
        if (!value || value.trim().length < 2) {
          newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
        } else {
          delete newErrors.name;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change
    if (isEditing) {
      validateField(name, value);
    }
  };

  // แปลงไฟล์เป็น base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ไม่ควรเกิน 5MB');
      return;
    }

    try {
      // แปลงไฟล์เป็น base64 เพื่อเก็บใน localStorage
      const base64String = await convertFileToBase64(file);
      
      if (type === 'profile') {
        setProfile(prev => ({
          ...prev,
          profileImage: base64String
        }));
      } else if (type === 'cover') {
        setProfile(prev => ({
          ...prev,
          coverPhoto: base64String
        }));
      } else {
        setDocuments(prev => {
          const updated = {
            ...prev,
            [type]: {
              preview: base64String,
              name: file.name,
              size: file.size
            }
          };
          
          // บันทึกข้อมูลเอกสารลง localStorage
          localStorage.setItem('agentDocuments', JSON.stringify(updated));
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    }
  };

  const handleSave = async () => {
    // Validate all fields
    const fieldsToValidate = ['name', 'email', 'phone'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      if (!validateField(field, profile[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert('กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้อง');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // บันทึกลง localStorage (profileImage และ coverPhoto เป็น base64 string แล้ว)
      localStorage.setItem('agentProfile', JSON.stringify(profile));
      
      setOriginalProfile({ ...profile });
      setIsEditing(false);
      setErrors({});
      setShowEditModal(false);
      
      // แสดงข้อความสำเร็จ
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'บันทึกข้อมูลสำเร็จ!';
      successMessage.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
    setErrors({});
    setShowEditModal(false);
  };

  const handleSubmitVerification = async () => {
    if (!documents.idCard || !documents.license) {
      alert('กรุณาอัปโหลดเอกสารให้ครบถ้วน (บัตรประชาชนและใบอนุญาต)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // บันทึกสถานะ
      setVerificationStatus('pending');
      localStorage.setItem('verificationStatus', 'pending');
      
      // แสดงข้อความสำเร็จ
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'ส่งเอกสารยืนยันตัวตนแล้ว กำลังตรวจสอบ...';
      successMessage.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0288d1;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('เกิดข้อผิดพลาดในการส่งเอกสาร');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `โปรไฟล์ ${profile.name}`,
        text: `ดูโปรไฟล์ ${profile.name} บนแพลตฟอร์มอสังหาริมทรัพย์`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: คัดลอก URL
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์โปรไฟล์แล้ว');
    }
  };

  const handleContact = () => {
    window.location.href = `mailto:${profile.email}`;
  };

  return (
    <Layout>
      <div className="profile-page container">
        {/* Cover Photo Section */}
        <div className="profile-cover-section">
          <div className="profile-cover-photo">
            {profile.coverPhoto ? (
              <img src={profile.coverPhoto} alt="Cover" />
            ) : (
              <div className="cover-placeholder">
                <Camera size={32} />
              </div>
            )}
            {isEditing && (
              <label className="cover-upload-overlay">
                <Camera size={20} />
                <span>เปลี่ยนรูปปก</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="profile-header-section">
          <div className="profile-header-content-wrapper">
            <div className="profile-header-content">
              {/* Profile Picture - Overlapping Cover Photo */}
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" />
                  ) : (
                    <User size={48} />
                  )}
                  {isEditing && (
                    <label className="image-upload-overlay">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {verificationStatus === 'verified' && (
                  <div className="verification-badge-profile">
                    <CheckCircle size={14} />
                    <span>ยืนยันตัวตน</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="profile-info-main">
                <h1 className="profile-name">{profile.name}</h1>
                <div className="profile-user-type">
                  <span 
                    className={`user-type-badge ${profile.userType === 'agent' ? 'badge-agent' : 'badge-owner'}`}
                  >
                    {profile.userType === 'agent' ? 'นายหน้า' : 'เจ้าของทรัพย์'}
                  </span>
                </div>
                {/* Rating Section */}
                <button className="rating-display" onClick={() => setShowReviews(true)}>
                  <Star size={18} className="rating-star-icon" />
                  <span className="rating-text">
                    {profile.rating.toFixed(1)} ({profile.reviewCount} รีวิว)
                  </span>
                  <ChevronRight size={16} className="rating-chevron-icon" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="profile-header-actions">
                <div className="profile-header-actions-row">
                  <button className="share-button" onClick={handleShare}>
                    <Share2 size={18} />
                  </button>
                  <button className="contact-button" onClick={handleContact}>
                    ติดต่อ
                  </button>
                </div>
                {!isEditing && (
                  <button 
                    className="btn-edit-header" 
                    onClick={() => {
                      setOriginalProfile({ ...profile });
                      setIsEditing(true);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit size={14} />
                    แก้ไข
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="profile-statistics-section">
          <div className="stat-item stat-item-sell">
            <div className="stat-category">ขาย</div>
            <div className="stat-number">{statistics.propertiesForSale.toLocaleString('th-TH')}</div>
            <div className="stat-label">ประกาศ</div>
          </div>
          <div className="stat-item stat-item-rent">
            <div className="stat-category">เช่า</div>
            <div className="stat-number">{statistics.propertiesForRent.toLocaleString('th-TH')}</div>
            <div className="stat-label">ประกาศ</div>
          </div>
          <div className="stat-item stat-item-deals">
            <div className="stat-category">ปิดดีลได้</div>
            <div className="stat-number">{statistics.closedDeals.toLocaleString('th-TH')}</div>
            <div className="stat-label">ประกาศ</div>
          </div>
        </div>

        {/* Properties Section */}
        {profileListings.length > 0 && (
          <div className="profile-properties-section">
            <div className="profile-properties-header">
              <div className="profile-properties-header-top">
                <h2>ประกาศที่อยู่อาศัย</h2>
                <a href="/agent/listings" className="view-all-link">
                  ดูทั้งหมด ({profileListings.length}) &gt;
                </a>
              </div>
              <div className="profile-properties-tabs">
                <button 
                  className={`property-tab ${propertyTab === 'sell' ? 'active' : ''}`}
                  onClick={() => setPropertyTab('sell')}
                >
                  ขาย
                </button>
                <button 
                  className={`property-tab ${propertyTab === 'rent' ? 'active' : ''}`}
                  onClick={() => setPropertyTab('rent')}
                >
                  เช่า
                </button>
              </div>
            </div>
            <div className="profile-properties-grid">
              {profileListings
                .filter(listing => 
                  propertyTab === 'sell' 
                    ? (listing.type === 'sell' || !listing.type)
                    : listing.type === 'rent'
                )
                .map(listing => {
                  const getImageSrc = () => {
                    if (listing.image) return listing.image;
                    if (listing.images?.[0]) {
                      return typeof listing.images[0] === 'string' 
                        ? listing.images[0] 
                        : listing.images[0]?.preview || listing.images[0];
                    }
                    return '/placeholder-property.jpg';
                  };

                  const formatPrice = (price) => {
                    const num = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
                    return isNaN(num) ? price : `฿${num.toLocaleString('th-TH')}`;
                  };
                  
                  return (
                    <Link 
                      key={listing.id} 
                      to={`/agent/listings/${listing.id}`}
                      className="profile-property-card"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {listing.image || listing.images?.length > 0 ? (
                        <div className="profile-property-image">
                          <img src={getImageSrc()} alt={listing.title || listing.address || 'Property'} />
                        </div>
                      ) : (
                        <div className="profile-property-image placeholder">
                          <Home size={40} />
                        </div>
                      )}
                      <div className="profile-property-info">
                        {listing.price && (
                          <div className="profile-property-price">
                            {formatPrice(listing.price)}
                          </div>
                        )}
                        <div className="profile-property-features">
                          {listing.bedrooms && (
                            <div className="property-feature">
                              <Bed size={16} />
                              <span>{listing.bedrooms}</span>
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div className="property-feature">
                              <Bath size={16} />
                              <span>{listing.bathrooms}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="profile-property-title">
                          {listing.title || listing.address || 'ที่อยู่อาศัย'}
                        </h3>
                        {listing.address && (
                          <div className="profile-property-location">
                            <MapPin size={14} />
                            <span>{listing.address}</span>
                          </div>
                        )}
                        {listing.propertyType && (
                          <div className="profile-property-tag">
                            {PROPERTY_TYPES[listing.propertyType] || listing.propertyType}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* Reviews Modal */}
        {showReviews && (
          <div className="modal-overlay" onClick={() => setShowReviews(false)}>
            <div className="modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>รีวิวจากลูกค้า</h2>
                <div className="modal-header-actions">
                  {/* Hide write review button for agent and owner */}
                  <button 
                    className={`write-review-btn ${(profile.userType === 'agent' || profile.userType === 'owner') ? 'hidden' : ''}`}
                    onClick={() => {/* TODO: Open write review modal */}}
                    style={{ display: (profile.userType === 'agent' || profile.userType === 'owner') ? 'none' : 'flex' }}
                  >
                    <Pencil size={16} />
                    <span>เขียนรีวิว</span>
                  </button>
                  <button 
                    className="modal-close"
                    onClick={() => setShowReviews(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="reviews-empty-state">
                  <div className="reviews-illustration">
                    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Large smartphone in center */}
                      <rect x="100" y="20" width="100" height="160" rx="8" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
                      <rect x="110" y="30" width="80" height="140" rx="4" fill="#F9FAFB"/>
                      
                      {/* Stars on phone screen (4 filled, 1 empty) */}
                      <path d="M120 50 L122 55 L127 55.5 L123 59 L124 64 L120 61 L116 64 L117 59 L113 55.5 L118 55 Z" fill="#FBBF24"/>
                      <path d="M130 50 L132 55 L137 55.5 L133 59 L134 64 L130 61 L126 64 L127 59 L123 55.5 L128 55 Z" fill="#FBBF24"/>
                      <path d="M140 50 L142 55 L147 55.5 L143 59 L144 64 L140 61 L136 64 L137 59 L133 55.5 L138 55 Z" fill="#FBBF24"/>
                      <path d="M150 50 L152 55 L157 55.5 L153 59 L154 64 L150 61 L146 64 L147 59 L143 55.5 L148 55 Z" fill="#FBBF24"/>
                      <path d="M160 50 L162 55 L167 55.5 L163 59 L164 64 L160 61 L156 64 L157 59 L153 55.5 L158 55 Z" fill="#D1D5DB"/>
                      
                      {/* Profile icons with stars on phone */}
                      <circle cx="120" cy="70" r="8" fill="#D1D5DB"/>
                      <path d="M115 80 L116.5 82.5 L119 82 L118 79.5 L120 77.5 L117.5 77.5 L116.5 75 L115.5 77.5 L113 77.5 L115 79.5 Z" fill="#FBBF24" transform="scale(0.6)" transform-origin="120 80"/>
                      
                      <circle cx="120" cy="100" r="8" fill="#D1D5DB"/>
                      <path d="M115 110 L116.5 112.5 L119 112 L118 109.5 L120 107.5 L117.5 107.5 L116.5 105 L115.5 107.5 L113 107.5 L115 109.5 Z" fill="#FBBF24" transform="scale(0.6)" transform-origin="120 110"/>
                      
                      {/* Person on left with small phone */}
                      <circle cx="60" cy="140" r="12" fill="#BFDBFE"/>
                      <rect x="48" y="152" width="24" height="30" rx="4" fill="#93C5FD"/>
                      <rect x="50" y="182" width="20" height="15" rx="2" fill="#60A5FA"/>
                      <rect x="70" y="145" width="12" height="20" rx="2" fill="#FEE2E2"/>
                      <path d="M76 155 L78 157 L80 155" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      
                      {/* Person on right sitting with laptop */}
                      <circle cx="240" cy="150" r="12" fill="#BFDBFE"/>
                      <rect x="228" y="162" width="24" height="25" rx="4" fill="#93C5FD"/>
                      <rect x="232" y="187" width="16" height="12" rx="2" fill="#60A5FA"/>
                      <rect x="220" y="170" width="30" height="20" rx="2" fill="#E5E7EB"/>
                      <rect x="222" y="172" width="26" height="16" rx="1" fill="#F3F4F6"/>
                      
                      {/* Person peeking from behind phone */}
                      <circle cx="150" cy="10" r="10" fill="#BFDBFE"/>
                    </svg>
                  </div>
                  <p className="reviews-empty-message">เขียนรีวิวให้เป็นคนแรกเลย!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>แก้ไขข้อมูลส่วนตัว</h2>
                <button 
                  className="modal-close"
                  onClick={handleCancel}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="modal-name">ชื่อ-นามสกุล</label>
                    <div className="input-with-icon">
                      <User size={15} />
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'error' : ''}
                      />
                    </div>
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-email">อีเมล</label>
                    <div className="input-with-icon">
                      <Mail size={15} />
                      <input
                        type="email"
                        id="modal-email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-phone">เบอร์โทรศัพท์</label>
                    <div className="input-with-icon">
                      <Phone size={15} />
                      <input
                        type="tel"
                        id="modal-phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-userType">สถานะ</label>
                    <select
                      id="modal-userType"
                      name="userType"
                      value={profile.userType || 'agent'}
                      onChange={handleInputChange}
                    >
                      <option value="agent">นายหน้า</option>
                      <option value="owner">เจ้าของทรัพย์</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="modal-bio">ประวัติโดยย่อ</label>
                    <textarea
                      id="modal-bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="เขียนประวัติของคุณ..."
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>รูปปก (Cover Photo)</label>
                    {profile.coverPhoto ? (
                      <div className="cover-preview">
                        <img src={profile.coverPhoto} alt="Cover Preview" />
                        <button
                          type="button"
                          className="btn-remove-cover"
                          onClick={() => setProfile(prev => ({ ...prev, coverPhoto: null }))}
                        >
                          ลบรูปปก
                        </button>
                      </div>
                    ) : (
                      <label className="cover-upload-btn">
                        <Upload size={16} />
                        <span>อัปโหลดรูปปก</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'cover')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  ยกเลิก
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader size={12} className="spinner" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save size={12} />
                      บันทึก
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>ยืนยันตัวตน</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowVerificationModal(false)}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="modal-body">
                <div className="documents-grid">
                  <div className="document-item">
                    <label>บัตรประชาชน *</label>
                    {documents.idCard ? (
                      <div className="document-preview">
                        <img src={documents.idCard.preview} alt="ID Card" />
                        <div className="document-info">
                          <p>{documents.idCard.name}</p>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => setDocuments(prev => ({ ...prev, idCard: null }))}
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="document-upload">
                        <Upload size={14} />
                        <span>อัปโหลดบัตรประชาชน</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'idCard')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="document-item">
                    <label>ใบอนุญาตนายหน้า *</label>
                    {documents.license ? (
                      <div className="document-preview">
                        <img src={documents.license.preview} alt="License" />
                        <div className="document-info">
                          <p>{documents.license.name}</p>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => setDocuments(prev => ({ ...prev, license: null }))}
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="document-upload">
                        <Upload size={14} />
                        <span>อัปโหลดใบอนุญาต</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'license')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="document-item">
                    <label>บัญชีธนาคาร (ไม่บังคับ)</label>
                    {documents.bankAccount ? (
                      <div className="document-preview">
                        <img src={documents.bankAccount.preview} alt="Bank Account" />
                        <div className="document-info">
                          <p>{documents.bankAccount.name}</p>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => setDocuments(prev => ({ ...prev, bankAccount: null }))}
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="document-upload">
                        <Upload size={14} />
                        <span>อัปโหลดบัญชีธนาคาร</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'bankAccount')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {verificationStatus === 'rejected' && (
                  <div className="verification-message error">
                    <XCircle size={12} />
                    <p>การยืนยันตัวตนไม่สำเร็จ กรุณาตรวจสอบเอกสารและส่งใหม่</p>
                  </div>
                )}

                {verificationStatus === 'pending' && (
                  <div className="verification-message info">
                    <Clock size={12} />
                    <p>กำลังตรวจสอบเอกสาร กรุณารอสักครู่</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowVerificationModal(false)}
                >
                  ยกเลิก
                </button>
                <button 
                  className="btn-primary" 
                  onClick={async () => {
                    await handleSubmitVerification();
                    // ปิด modal หลังจากส่งสำเร็จ
                    setTimeout(() => {
                      setShowVerificationModal(false);
                    }, 500);
                  }}
                  disabled={isSubmitting || !documents.idCard || !documents.license}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={12} className="spinner" />
                      กำลังส่ง...
                    </>
                  ) : (
                    'ส่งเอกสารยืนยันตัวตน'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Repository Modal */}
        {showDocuments && (
          <div className="modal-overlay" onClick={() => setShowDocuments(false)}>
            <div className="modal-content documents-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>คลังเอกสาร</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDocuments(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="documents-grid">
                  <div className="document-category">
                    <div className="category-icon">
                      <FileText size={28} />
                    </div>
                    <h3>เอกสารประเมิน</h3>
                    <p className="document-count">5 ไฟล์</p>
                    <a href="#" className="view-documents-link">ดูเพิ่มเติม →</a>
                  </div>

                  <div className="document-category">
                    <div className="category-icon">
                      <FileText size={28} />
                    </div>
                    <h3>สัญญาและเอกสารอื่นๆ</h3>
                    <p className="document-count">12 ไฟล์</p>
                    <a href="#" className="view-documents-link">ดูเพิ่มเติม →</a>
                  </div>

                  <div className="document-category">
                    <div className="category-icon">
                      <FileText size={28} />
                    </div>
                    <h3>เอกสารยืนยันตัวตน</h3>
                    <p className="document-count">2 ไฟล์</p>
                    <a href="#" className="view-documents-link">ดูเพิ่มเติม →</a>
                  </div>

                  <div className="document-category">
                    <div className="category-icon">
                      <Upload size={28} />
                    </div>
                    <h3>อัปโหลดเอกสาร</h3>
                    <p className="document-count">เพิ่มไฟล์ใหม่</p>
                    <label className="upload-documents-btn">
                      <Upload size={16} />
                      เลือกไฟล์
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          alert(`เพิ่มไฟล์: ${e.target.files?.length || 0} ไฟล์`);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="documents-list">
                  <h3>เอกสารล่าสุด</h3>
                  <div className="recent-documents">
                    <div className="document-item-row">
                      <FileText size={16} />
                      <div className="document-item-info">
                        <p className="document-name">ใบประกาศตัวตนนายหน้า.pdf</p>
                        <p className="document-date">15 พฤศจิกายน 2025</p>
                      </div>
                    </div>
                    <div className="document-item-row">
                      <FileText size={16} />
                      <div className="document-item-info">
                        <p className="document-name">บัตรประชาชน.jpg</p>
                        <p className="document-date">14 พฤศจิกายน 2025</p>
                      </div>
                    </div>
                    <div className="document-item-row">
                      <FileText size={16} />
                      <div className="document-item-info">
                        <p className="document-name">สัญญาข้อตกลง.docx</p>
                        <p className="document-date">12 พฤศจิกายน 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guide Modal */}
        {showGuide && (
          <div className="modal-overlay" onClick={() => setShowGuide(false)}>
            <div className="modal-content guide-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>คู่มือการใช้งาน</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowGuide(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="guide-content">
                  <div className="guide-section">
                    <h3>ยินดีต้อนรับสู่ HAATEE</h3>
                    <p>แพลตฟอร์มอสังหาริมทรัพย์ที่สมบูรณ์สำหรับนายหน้าและเจ้าของทรัพย์</p>
                  </div>

                  <div className="guide-section">
                    <h4>📌 การสร้างประกาศ</h4>
                    <ol className="guide-list">
                      <li>คลิกปุ่ม "เพิ่มประกาศใหม่" ในเมนูหลัก</li>
                      <li>กรอกข้อมูลรายละเอียดทรัพย์สิน</li>
                      <li>อัปโหลดรูปภาพของทรัพย์สิน (ขั้นต่ำ 3 รูป)</li>
                      <li>ตั้งราคาและระยะเวลาในการแสดง</li>
                      <li>ตรวจสอบข้อมูลและคลิก "ยืนยันการสร้างประกาศ"</li>
                    </ol>
                  </div>

                  <div className="guide-section">
                    <h4>📊 การดูสถิติ</h4>
                    <ol className="guide-list">
                      <li>ไปที่เมนู "สถิติ" ในเมนูแนวนอน</li>
                      <li>ดูประสิทธิภาพของประกาศของคุณ</li>
                      <li>วิเคราะห์อัตราการแปลงและผู้สนใจ</li>
                    </ol>
                  </div>

                  <div className="guide-section">
                    <h4>💬 การสื่อสาร</h4>
                    <ol className="guide-list">
                      <li>ใช้แชทเพื่อสื่อสารกับลูกค้า</li>
                      <li>บันทึกรูปภาพและไฟล์เอกสาร</li>
                      <li>ตอบสนองต่อคำถามได้อย่างรวดเร็ว</li>
                    </ol>
                  </div>

                  <div className="guide-section">
                    <h4>✅ การจัดการประกาศ</h4>
                    <ol className="guide-list">
                      <li>คลิก "Repost" เพื่อต่ออายุประกาศ</li>
                      <li>แก้ไขข้อมูลผ่านปุ่ม "Edit"</li>
                      <li>ลบประกาศที่ไม่ต้องการอีกต่อไป</li>
                    </ol>
                  </div>

                  <div className="guide-section">
                    <h4>📞 ติดต่อสนับสนุน</h4>
                    <p>หากมีคำถามหรือปัญหา โปรดติดต่อทีมสนับสนุนของเรา</p>
                    <p>อีเมล: support@haatee.com | โทร: 02-XXXX-XXXX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

