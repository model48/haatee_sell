import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  CheckCircle, Clock,
  Download,
  Edit, Eye,
  FileText, PlusCircle, Search,
  Send,
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import Layout from '../../components/Layout/Layoutsell';
import './Contractssell.css';

const INITIAL_CONTRACT = {
  customerName: '',
  customerIdCard: '',
  customerPhone: '',
  customerEmail: '',
  listingId: '',
  contractType: 'sell',
  price: '',
  deposit: '',
  terms: '',
};

const STATUS_BADGES = {
  pending: { icon: Clock, text: 'รอเซ็น', className: 'badge-warning' },
  signed: { icon: CheckCircle, text: 'เซ็นแล้ว', className: 'badge-success' },
  cancelled: { icon: XCircle, text: 'ยกเลิก', className: 'badge-danger' },
};

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [contracts, setContracts] = useState([
    {
      id: 1,
      contractNumber: 'CON-2024-001',
      customerName: 'สมชาย ใจดี',
      listingTitle: 'คอนโดมิเนียมหรูใจกลางเมือง',
      listingId: 1,
      contractType: 'ขาย',
      price: '15,000,000',
      deposit: '500,000',
      status: 'pending',
      createdAt: new Date('2024-01-20'),
      signedAt: null,
      expiresAt: new Date('2024-02-20'),
    },
    {
      id: 2,
      contractNumber: 'CON-2024-002',
      customerName: 'สมหญิง รักดี',
      listingTitle: 'บ้านเดี่ยว 3 ห้องนอน',
      listingId: 2,
      contractType: 'เช่า',
      price: '25,000/เดือน',
      deposit: '50,000',
      status: 'signed',
      createdAt: new Date('2024-01-15'),
      signedAt: new Date('2024-01-18'),
      expiresAt: null,
    },
    {
      id: 3,
      contractNumber: 'CON-2024-003',
      customerName: 'วิชัย เก่งดี',
      listingTitle: 'ทาวน์เฮาส์ 2 ชั้น',
      listingId: 3,
      contractType: 'ขาย',
      price: '8,500,000',
      deposit: '300,000',
      status: 'cancelled',
      createdAt: new Date('2024-01-10'),
      signedAt: null,
      expiresAt: new Date('2024-02-10'),
    },
  ]);
  const [newContract, setNewContract] = useState(INITIAL_CONTRACT);

  const filteredContracts = contracts.filter(contract => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(search) ||
      contract.customerName.toLowerCase().includes(search) ||
      contract.listingTitle.toLowerCase().includes(search);
    return matchesSearch && (filterStatus === 'all' || contract.status === filterStatus);
  });

  const handleCreateContract = () => {
    if (!newContract.customerName || !newContract.listingId || !newContract.price) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const contract = {
      id: contracts.length + 1,
      contractNumber: `CON-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      ...newContract,
      listingTitle: `ประกาศ #${newContract.listingId}`,
      status: 'pending',
      createdAt: new Date(),
      signedAt: null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    setContracts([contract, ...contracts]);
    setShowCreateModal(false);
    setNewContract(INITIAL_CONTRACT);
    alert('สร้างสัญญาสำเร็จ!');
  };

  const handleSendContract = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    alert(`ส่งสัญญา ${contract?.contractNumber} ให้ลูกค้าแล้ว`);
  };

  const handleCancelContract = (contractId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกสัญญานี้?')) {
      setContracts(prev => prev.map(contract =>
        contract.id === contractId ? { ...contract, status: 'cancelled' } : contract
      ));
    }
  };

  const getStatusBadge = (status) => {
    const badge = STATUS_BADGES[status];
    if (!badge) return null;
    const Icon = badge.icon;
    return <span className={`badge ${badge.className}`}><Icon size={14} /> {badge.text}</span>;
  };

  const updateContract = (field, value) => {
    setNewContract(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="contracts-page container">
        <div className="page-header">
          <div>
            <h1>สัญญาออนไลน์ (E-Contract)</h1>
            <p>สร้างและจัดการสัญญาดิจิทัล</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle size={20} />
            สร้างสัญญาใหม่
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-card card">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="ค้นหาหมายเลขสัญญา, ชื่อลูกค้า, หรือชื่อประกาศ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>สถานะ:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอเซ็น</option>
              <option value="signed">เซ็นแล้ว</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        {/* Contracts List */}
        <div className="contracts-grid">
          {filteredContracts.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>ไม่พบสัญญา</p>
            </div>
          ) : (
            filteredContracts.map(contract => (
              <div key={contract.id} className="contract-card card">
                <div className="contract-header">
                  <div>
                    <h3>{contract.contractNumber}</h3>
                    <p className="contract-type">{contract.contractType}</p>
                  </div>
                  {getStatusBadge(contract.status)}
                </div>

                <div className="contract-details">
                  <div className="detail-item">
                    <strong>ลูกค้า:</strong> {contract.customerName}
                  </div>
                  <div className="detail-item">
                    <strong>ทรัพย์สิน:</strong> {contract.listingTitle}
                  </div>
                  <div className="detail-item">
                    <strong>ราคา:</strong> {contract.price}
                  </div>
                  <div className="detail-item">
                    <strong>มัดจำ:</strong> {contract.deposit}
                  </div>
                  <div className="detail-item">
                    <strong>สร้างเมื่อ:</strong> {format(contract.createdAt, 'dd MMM yyyy', { locale: th })}
                  </div>
                  {contract.signedAt && (
                    <div className="detail-item">
                      <strong>เซ็นเมื่อ:</strong> {format(contract.signedAt, 'dd MMM yyyy', { locale: th })}
                    </div>
                  )}
                  {contract.status === 'pending' && contract.expiresAt && (
                    <div className="detail-item warning">
                      <strong>หมดอายุ:</strong> {format(contract.expiresAt, 'dd MMM yyyy', { locale: th })}
                    </div>
                  )}
                </div>

                <div className="contract-actions">
                  <button className="btn-secondary btn-sm">
                    <Eye size={16} />
                    ดูสัญญา
                  </button>
                  <button className="btn-secondary btn-sm">
                    <Download size={16} />
                    ดาวน์โหลด
                  </button>
                  {contract.status === 'pending' && (
                    <>
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => handleSendContract(contract.id)}
                      >
                        <Send size={16} />
                        ส่งให้ลูกค้า
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleCancelContract(contract.id)}
                      >
                        <XCircle size={16} />
                        ยกเลิก
                      </button>
                    </>
                  )}
                  {contract.status === 'signed' && (
                    <button className="btn-secondary btn-sm">
                      <Edit size={16} />
                      แก้ไข
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Contract Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>สร้างสัญญาใหม่</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>ประเภทสัญญา *</label>
                  <select value={newContract.contractType} onChange={(e) => updateContract('contractType', e.target.value)}>
                    <option value="sell">ขาย</option>
                    <option value="rent">เช่า</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ชื่อลูกค้า *</label>
                    <input type="text" value={newContract.customerName} onChange={(e) => updateContract('customerName', e.target.value)} placeholder="สมชาย ใจดี" />
                  </div>
                  <div className="form-group">
                    <label>เลขบัตรประชาชน *</label>
                    <input type="text" value={newContract.customerIdCard} onChange={(e) => updateContract('customerIdCard', e.target.value)} placeholder="1234567890123" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>เบอร์โทรศัพท์ *</label>
                    <input type="tel" value={newContract.customerPhone} onChange={(e) => updateContract('customerPhone', e.target.value)} placeholder="081-234-5678" />
                  </div>
                  <div className="form-group">
                    <label>อีเมล</label>
                    <input type="email" value={newContract.customerEmail} onChange={(e) => updateContract('customerEmail', e.target.value)} placeholder="customer@email.com" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>รหัสประกาศ *</label>
                    <input type="text" value={newContract.listingId} onChange={(e) => updateContract('listingId', e.target.value)} placeholder="1" />
                  </div>
                  <div className="form-group">
                    <label>ราคา *</label>
                    <input type="text" value={newContract.price} onChange={(e) => updateContract('price', e.target.value)} placeholder="15,000,000" />
                  </div>
                  <div className="form-group">
                    <label>มัดจำ *</label>
                    <input type="text" value={newContract.deposit} onChange={(e) => updateContract('deposit', e.target.value)} placeholder="500,000" />
                  </div>
                </div>

                <div className="form-group">
                  <label>เงื่อนไขเพิ่มเติม</label>
                  <textarea value={newContract.terms} onChange={(e) => updateContract('terms', e.target.value)} rows="4" placeholder="เงื่อนไขพิเศษ..." />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateContract}
                >
                  สร้างสัญญา
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Contracts;

