import {
  Bell,
  Book,
  ChevronDown,
  FileText,
  Home,
  Menu,
  MessageCircle,
  Settings,
  ShoppingBag,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Constants
const LISTING_EXPIRY_DAYS = 90;
const DEFAULT_PROFILE = { name: 'Anthony', email: 'anthony@example.com' };

// Helper Functions
const loadProfile = () => {
  try {
    const saved = localStorage.getItem('agentProfile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  } catch (e) {
    console.error('Error loading profile:', e);
    return DEFAULT_PROFILE;
  }
};

// Modal Components
const EmptyStateModal = ({ title, icon: IconComponent, message, subMessage, onClose }) => {
  const Icon = IconComponent;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon size={64} />
            </div>
            <h3>{message}</h3>
            <p>{subMessage}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [userProfile, setUserProfile] = useState(loadProfile);

  // Navigation items
  const navItems = [
    { path: '/', label: 'หน้าหลัก', icon: Home },
    { path: '/buy', label: 'ซื้อ', icon: ShoppingBag },
    { path: '/rent', label: 'เช่า', icon: ShoppingBag },
    { path: '/agent/dashboard', label: 'สถิติ', icon: Home },
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'ประกาศใกล้หมดอายุ',
      message: `มี 3 ประกาศจะหมดอายุภายใน ${LISTING_EXPIRY_DAYS} วัน`,
      time: '2 ชั่วโมงที่แล้ว',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'มีข้อความใหม่',
      message: 'คุณมี 5 ข้อความที่ยังไม่ได้อ่าน',
      time: '1 ชั่วโมงที่แล้ว',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'สัญญาใหม่',
      message: 'ลูกค้าได้เซ็นสัญญาแล้ว 1 ฉบับ',
      time: '30 นาทีที่แล้ว',
      read: false
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const isActive = (path) => location.pathname === path;

  // Profile sync from localStorage
  useEffect(() => {
    const handleStorageChange = () => setUserProfile(loadProfile());
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isNotification = event.target.closest('.notification-wrapper');
      const isProfile = event.target.closest('.profile-wrapper');
      if (!isNotification) setNotificationOpen(false);
      if (!isProfile) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reusable components
  const ProfileAvatar = ({ size = 20, className = '' }) => (
    <div className={`profile-avatar ${className}`}>
      {userProfile.profileImage ? (
        <img src={userProfile.profileImage} alt="Profile" />
      ) : (
        <User size={size} />
      )}
    </div>
  );

  const NotificationButton = ({ className = '' }) => (
    <button
      className={`notification-button ${className}`}
      onClick={() => setNotificationOpen(!notificationOpen)}
      aria-label="แจ้งเตือน"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );

  const ProfileButton = ({ className = '' }) => (
    <button
      className={`profile-button ${className}`}
      onClick={() => setProfileOpen(!profileOpen)}
      aria-label="โปรไฟล์"
    >
      <ProfileAvatar />
      <ChevronDown size={16} />
    </button>
  );

  // Dropdown Components
  const NotificationDropdown = () => {
    if (!notificationOpen) return null;
    return (
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>แจ้งเตือน</h3>
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount} ใหม่</span>
          )}
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <p>ไม่มีแจ้งเตือน</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-item-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="notification-footer">
            <button className="notification-view-all">ดูทั้งหมด</button>
          </div>
        )}
      </div>
    );
  };

  const ProfileDropdown = () => {
    if (!profileOpen) return null;
    
    const menuItems = [
      { to: '/agent/profile', icon: User, label: 'โปรไฟล์', isLink: true },
      { icon: FileText, label: 'คลังเอกสาร', onClick: () => { setShowDocuments(true); setProfileOpen(false); } },
      { icon: Book, label: 'คู่มือ', onClick: () => { setShowGuide(true); setProfileOpen(false); } },
      { to: '/agent/settings', icon: Settings, label: 'ตั้งค่า', isLink: true },
    ];

    return (
      <div className="profile-dropdown">
        <div className="profile-dropdown-header">
          <div className="profile-avatar-large">
            {userProfile.profileImage ? (
              <img src={userProfile.profileImage} alt="Profile" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <div className="profile-name-large">{userProfile.name || DEFAULT_PROFILE.name}</div>
            <div className="profile-email">{userProfile.email || DEFAULT_PROFILE.email}</div>
          </div>
        </div>
        <div className="profile-dropdown-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon size={20} />
                <span>{item.label}</span>
              </>
            );
            return item.isLink ? (
              <Link
                key={index}
                to={item.to}
                className="profile-menu-item"
                onClick={() => setProfileOpen(false)}
              >
                {content}
              </Link>
            ) : (
              <button
                key={index}
                className="profile-menu-item"
                onClick={item.onClick}
              >
                {content}
              </button>
            );
          })}
          <div className="profile-menu-divider"></div>
          <button className="profile-menu-item logout">
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="HAATEE" className="logo-image" />
          <span className="logo-text">HAATEE</span>
        </Link>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/agent/listings"
            className="list-home-button-mobile"
            onClick={() => setMobileMenuOpen(false)}
          >
            รายการประกาศ
          </Link>
        </nav>

        {/* Desktop Header Actions */}
        <div className="header-right">
          <Link to="/agent/chat" className="chat-link">
            <MessageCircle size={18} />
            <span>Chat</span>
          </Link>
          <Link to="/agent/listings" className="list-home-button list-home-button-desktop">
            รายการประกาศ
          </Link>
          <div className="notification-wrapper">
            <NotificationButton />
            <NotificationDropdown />
          </div>
          <div className="profile-wrapper">
            <ProfileButton />
            <ProfileDropdown />
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="mobile-header-right">
          <Link to="/agent/chat" className="chat-link chat-link-mobile">
            <MessageCircle size={18} />
          </Link>
          <div className="notification-wrapper">
            <NotificationButton className="notification-button-mobile" />
            <NotificationDropdown />
          </div>
          <div className="profile-wrapper">
            <ProfileButton className="profile-button-mobile" />
            <ProfileDropdown />
          </div>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDocuments && (
        <EmptyStateModal
          title="คลังเอกสาร"
          icon={FileText}
          message="ยังไม่มีเอกสาร"
          subMessage="คุณยังไม่ได้อัปโหลดเอกสารใดๆ เริ่มต้นด้วยการอัปโหลดเอกสารของคุณ"
          onClose={() => setShowDocuments(false)}
        />
      )}
      {showGuide && (
        <EmptyStateModal
          title="คู่มือการใช้งาน"
          icon={Book}
          message="ยังไม่มีคู่มือ"
          subMessage="คู่มือการใช้งานจะแสดงที่นี่ คู่มือจะถูกเพิ่มเข้ามาในอนาคต"
          onClose={() => setShowGuide(false)}
        />
      )}
    </header>
  );
};

export default Header;
