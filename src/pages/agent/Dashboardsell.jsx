import { format, subDays } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronDown,
  Circle,
  Edit,
  Eye,
  Heart,
  List,
  Phone,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layoutsell';
import './Dashboardsell.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // รายชื่อลูกค้าจากแชท - ใน production จะดึงจาก API
  const customers = [
    { id: 1, name: 'สมชาย ใจดี', avatar: null },
    { id: 2, name: 'สมหญิง รักดี', avatar: null },
    { id: 3, name: 'วิชัย เก่งดี', avatar: null },
    { id: 4, name: 'นาย สมศักดิ์', avatar: null },
    { id: 5, name: 'นางสาว สมศรี', avatar: null },
    { id: 6, name: 'นาย สมหมาย', avatar: null },
    { id: 7, name: 'นางสาว สมปอง', avatar: null },
  ];

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // ยอดการปิดดีลรายสัปดาห์ - สำหรับแสดงกราฟ
  const dealsClosedData = [
    { date: subDays(new Date(), 6), deals: 2, revenue: 8500000 },
    { date: subDays(new Date(), 5), deals: 3, revenue: 12500000 },
    { date: subDays(new Date(), 4), deals: 1, revenue: 4200000 },
    { date: subDays(new Date(), 3), deals: 4, revenue: 16800000 },
    { date: subDays(new Date(), 2), deals: 2, revenue: 9500000 },
    { date: subDays(new Date(), 1), deals: 3, revenue: 13200000 },
    { date: new Date(), deals: 2, revenue: 8800000 },
  ];

  const maxDeals = Math.max(...dealsClosedData.map(d => d.deals));
  const totalDeals = dealsClosedData.reduce((sum, d) => sum + d.deals, 0);
  const totalRevenue = dealsClosedData.reduce((sum, d) => sum + d.revenue, 0);

  // Real-time Key Metrics with comparison - สถิติการทำงาน
  const keyMetrics = {
    interestedCustomers: {
      current: 156,
      previous: 138,
      change: 13.0,
      status: 'good',
      target: 200,
      progress: 78
    },
    postViews: {
      current: 12450,
      previous: 11000,
      change: 13.2,
      status: 'good',
      target: 15000,
      progress: 83
    },
    contacts: {
      current: 89,
      previous: 75,
      change: 18.7,
      status: 'good',
      target: 120,
      progress: 74
    },
    postCount: {
      current: 24,
      previous: 20,
      change: 20.0,
      status: 'good',
      target: 30,
      progress: 80
    }
  };

  // Alerts and Notifications
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'ประกาศใกล้หมดอายุ',
      message: 'มี 3 ประกาศจะหมดอายุภายใน 7 วัน',
      time: '2 ชั่วโมงที่แล้ว',
      action: 'ดูรายการ'
    },
    {
      id: 2,
      type: 'info',
      title: 'มีข้อความใหม่',
      message: 'คุณมี 5 ข้อความที่ยังไม่ได้อ่าน',
      time: '1 ชั่วโมงที่แล้ว',
      action: 'เปิดแชท'
    },
    {
      id: 3,
      type: 'success',
      title: 'สัญญาใหม่',
      message: 'ลูกค้าได้เซ็นสัญญาแล้ว 1 ฉบับ',
      time: '30 นาทีที่แล้ว',
      action: 'ดูสัญญา'
    }
  ];

  // To-do List
  const [todos, setTodos] = useState([
    {
      id: 1,
      taskName: 'นัดแสดงบ้าน 456 ถ.สุขุมวิท',
      client: 'สมชาย ใจดี',
      type: '',
      status: 'รอทำ',
      priority: 'สูง',
      dueDate: '2025-11-09',
      completed: false
    },
    {
      id: 2,
      taskName: 'ติดตามลูกค้า สมชาย',
      client: 'สมชาย ใจดี',
      type: 'ติดตาม',
      status: 'กำลังทำ',
      priority: 'สูง',
      dueDate: '2025-11-10',
      completed: false
    },
    {
      id: 3,
      taskName: 'เตรียมเอกสารโอนกรรมสิทธิ์',
      client: 'สมหญิง รักดี',
      type: 'เตรียมเอกสาร',
      status: 'รอทำ',
      priority: 'ปกติ',
      dueDate: '2025-11-12',
      completed: false
    },
    {
      id: 4,
      taskName: 'นัดดูคอนโดมิเนียม',
      client: 'นาย สมศักดิ์',
      type: '',
      status: 'เสร็จแล้ว',
      priority: 'ปกติ',
      dueDate: '2025-11-08',
      completed: true
    },
    {
      id: 5,
      taskName: 'ส่งเอกสารสัญญา',
      client: 'นางสาว สมศรี',
      type: 'อื่น ๆ',
      status: 'ล่าช้า',
      priority: 'สูง',
      dueDate: '2025-11-07',
      completed: false
    },
    {
      id: 6,
      taskName: 'ติดตามการชำระเงิน',
      client: 'นาย สมหมาย',
      type: 'ติดตาม',
      status: 'กำลังทำ',
      priority: 'ปกติ',
      dueDate: '2025-11-11',
      completed: false
    },
    {
      id: 7,
      taskName: 'ตรวจสอบเอกสาร',
      client: 'นางสาว สมปอง',
      type: 'เตรียมเอกสาร',
      status: 'รอทำ',
      priority: 'ต่ำ',
      dueDate: '2025-11-15',
      completed: false
    },
    {
      id: 8,
      taskName: 'นัดเซ็นสัญญา',
      client: 'นาย สมศักดิ์',
      type: '',
      status: 'กำลังทำ',
      priority: 'สูง',
      dueDate: '2025-11-09',
      completed: false
    },
    {
      id: 9,
      taskName: 'อัปเดตข้อมูลลูกค้า',
      client: 'สมหญิง รักดี',
      type: 'อื่น ๆ',
      status: 'เสร็จแล้ว',
      priority: 'ต่ำ',
      dueDate: '2025-11-08',
      completed: true
    },
    {
      id: 10,
      taskName: 'ส่งรายงานประจำเดือน',
      client: '-',
      type: 'อื่น ๆ',
      status: 'รอทำ',
      priority: 'ปกติ',
      dueDate: '2025-11-13',
      completed: false
    }
  ]);

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: '',
    client: '',
    status: 'รอทำ',
    priority: 'ปกติ',
    dueDate: ''
  });

  // ฟังก์ชันตรวจสอบและอัปเดตสถานะล่าช้าอัตโนมัติ
  const updateOverdueStatus = (todo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    
    // ถ้าเกินกำหนดและยังไม่เสร็จ และสถานะไม่ใช่ล่าช้า ให้เปลี่ยนเป็นล่าช้า
    if (due < today && !todo.completed && todo.status !== 'ล่าช้า' && todo.status !== 'เสร็จแล้ว') {
      return { ...todo, status: 'ล่าช้า' };
    }
    // ถ้ายังไม่เกินกำหนดและสถานะเป็นล่าช้า ให้เปลี่ยนกลับเป็นรอทำ
    if (due >= today && todo.status === 'ล่าช้า' && !todo.completed) {
      return { ...todo, status: 'รอทำ' };
    }
    return todo;
  };

  // อัปเดตสถานะล่าช้าทุกครั้งที่ todos เปลี่ยนหรือวันที่เปลี่ยน
  useEffect(() => {
    const updatedTodos = todos.map(updateOverdueStatus);
    const hasChanges = updatedTodos.some((todo, index) => todo.status !== todos[index]?.status);
    if (hasChanges) {
      setTodos(updatedTodos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos.length, new Date().toDateString()]); // ตรวจสอบเมื่อจำนวน todos เปลี่ยนหรือวันเปลี่ยน

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCustomerDropdown && !event.target.closest('.customer-select-wrapper')) {
        setShowCustomerDropdown(false);
      }
    };

    if (showCustomerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerDropdown]);

  // ฟังก์ชันคำนวณวัน
  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'เกินกำหนด';
    } else if (diffDays === 0) {
      return 'วันนี้';
    } else if (diffDays === 1) {
      return '1 วัน';
    } else {
      return `${diffDays} วัน`;
    }
  };

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // เรียงลำดับงานตามความสำคัญและวันครบกำหนด (งานที่เสร็จแล้วไว้ล่างสุด)
  const sortedTodos = [...todos].sort((a, b) => {
    // แยกงานที่เสร็จแล้วไปไว้ล่างสุด
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // ถ้าทั้งคู่เสร็จแล้วหรือยังไม่เสร็จ ให้เรียงตามความสำคัญและวันครบกำหนด
    const priorityOrder = { 'สูง': 1, 'ปกติ': 2, 'ต่ำ': 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const displayedTodos = showAllTasks ? sortedTodos : sortedTodos.slice(0, 5);

  const handleDismissAlert = (id) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, status: todo.completed ? 'รอทำ' : 'เสร็จแล้ว' }
        : todo
    ));
  };


  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowAddTaskModal(false);
    setShowCustomerDropdown(false);
    setNewTask({
      taskName: '',
      client: '',
      status: 'รอทำ',
      priority: 'ปกติ',
      dueDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    
    if (!newTask.taskName.trim() || !newTask.dueDate) {
      alert('กรุณากรอกชื่องานและวันที่ครบกำหนด');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(newTask.dueDate);
    due.setHours(0, 0, 0, 0);
    
    // ตรวจสอบว่าล่าช้าหรือไม่ (ถ้าเกินกำหนดให้เป็นล่าช้าอัตโนมัติ)
    let finalStatus = newTask.status;
    if (due < today) {
      finalStatus = 'ล่าช้า';
    }

    const task = {
      id: Date.now(),
      taskName: newTask.taskName.trim(),
      client: newTask.client || '-',
      type: '-',
      status: finalStatus,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false
    };

    setTodos([...todos, task]);
    handleCloseModal();
  };

  const handleEditTask = (id) => {
    // ใน production จะเปิด modal หรือหน้าแก้ไขงาน
    alert(`แก้ไขงาน ID: ${id}`);
  };

  const handleClientClick = (clientName) => {
    // ไปที่หน้าแชทพร้อมค้นหาลูกค้า
    navigate(`/agent/chat?customer=${encodeURIComponent(clientName)}`);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>ภาพรวมธุรกิจแบบเรียลไทม์</p>
          </div>
        </div>

        {/* Alerts Section */}
        {visibleAlerts.length > 0 && (
          <div className="alerts-section">
            {visibleAlerts.map(alert => (
              <div key={alert.id} className={`alert alert-${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'warning' && <AlertCircle size={20} />}
                  {alert.type === 'info' && <Bell size={20} />}
                  {alert.type === 'success' && <CheckCircle size={20} />}
                </div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <button className="alert-action">{alert.action}</button>
                <button 
                  className="alert-dismiss"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Deals Closed Chart - กราฟแสดงยอดการปิดดีล */}
        <div className="chart-card card">
          <div className="section-header">
            <h2>ยอดการปิดดีล</h2>
            <div className="deals-summary">
              <div className="summary-item">
                <span className="summary-label">รวมดีล:</span>
                <span className="summary-value">{totalDeals} ดีล</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">ยอดรวม:</span>
                <span className="summary-value">{(totalRevenue / 1000000).toFixed(1)}M บาท</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {dealsClosedData.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar bar-deals"
                      style={{ height: `${maxDeals > 0 ? (day.deals / maxDeals) * 100 : 0}%` }}
                      title={`${day.deals} ดีล - ${(day.revenue / 1000000).toFixed(1)}M บาท`}
                    >
                      <div className="chart-bar-value">
                        {(day.revenue / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                  <div className="chart-label">
                    {format(day.date, 'dd MMM', { locale: th })}
                  </div>
                  <div className="chart-value">
                    {day.deals} ดีล
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards - สถิติการทำงาน */}
        <div className="key-metrics-grid">
          <div className="metric-card metric-card-interested">
            <div className="metric-header">
              <div className="metric-icon metric-icon-interested">
                <Heart size={20} />
              </div>
              <div className="metric-value">
                {keyMetrics.interestedCustomers.current.toLocaleString()}
              </div>
            </div>
            <div className="metric-content">
              <h3>จำนวนลูกค้าที่สนใจ</h3>
              <div className={`metric-change ${keyMetrics.interestedCustomers.change > 0 ? 'positive' : 'negative'}`}>
                {keyMetrics.interestedCustomers.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(keyMetrics.interestedCustomers.change)}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-views">
            <div className="metric-header">
              <div className="metric-icon metric-icon-views">
                <Eye size={20} />
              </div>
              <div className="metric-value">
                {keyMetrics.postViews.current.toLocaleString()}
              </div>
            </div>
            <div className="metric-content">
              <h3>จำนวนคนกดเข้าชม</h3>
              <div className={`metric-change ${keyMetrics.postViews.change > 0 ? 'positive' : 'negative'}`}>
                {keyMetrics.postViews.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(keyMetrics.postViews.change)}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-contacts">
            <div className="metric-header">
              <div className="metric-icon metric-icon-contacts">
                <Phone size={20} />
              </div>
              <div className="metric-value">{keyMetrics.contacts.current}</div>
            </div>
            <div className="metric-content">
              <h3>จำนวนการติดต่อ</h3>
              <div className={`metric-change ${keyMetrics.contacts.change > 0 ? 'positive' : 'negative'}`}>
                {keyMetrics.contacts.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(keyMetrics.contacts.change)}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-posts">
            <div className="metric-header">
              <div className="metric-icon metric-icon-posts">
                <List size={20} />
              </div>
              <div className="metric-value">{keyMetrics.postCount.current}</div>
            </div>
            <div className="metric-content">
              <h3>จำนวนการโพสต์</h3>
              <div className={`metric-change ${keyMetrics.postCount.change > 0 ? 'positive' : 'negative'}`}>
                {keyMetrics.postCount.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(keyMetrics.postCount.change)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* To-do List */}
        <div className="todo-card card">
          <div className="section-header">
            <h2>งานที่ต้องทำ</h2>
            <div className="section-header-actions">
              <button className="btn-add-task" onClick={handleAddTask}>
                <Plus size={18} />
                เพิ่มงานใหม่
              </button>
            </div>
          </div>
          <div className="todo-table-container">
            <table className="todo-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>ชื่องาน</th>
                  <th>ลูกค้า</th>
                  <th>สถานะ</th>
                  <th>ความสำคัญ</th>
                  <th>วันที่ครบกำหนด</th>
                  <th>ระยะเวลาที่เหลือ</th>
                  <th style={{ width: '100px' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {displayedTodos.map(todo => (
                  <tr key={todo.id} className={todo.completed ? 'completed' : ''}>
                    <td>
                      <button 
                        className="todo-checkbox"
                        onClick={() => handleToggleTodo(todo.id)}
                      >
                        {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </button>
                    </td>
                    <td className="task-name">{todo.taskName}</td>
                    <td>
                      {todo.client !== '-' ? (
                        <button 
                          className="client-link"
                          onClick={() => handleClientClick(todo.client)}
                          title={`แชทกับ ${todo.client}`}
                        >
                          {todo.client}
                        </button>
                      ) : (
                        <span>{todo.client}</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${todo.status}`}>
                        {todo.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${todo.priority}`}>
                        {todo.priority}
                      </span>
                    </td>
                    <td>{formatDate(todo.dueDate)}</td>
                    <td className={calculateDaysLeft(todo.dueDate) === 'เกินกำหนด' ? 'overdue' : ''}>
                      {calculateDaysLeft(todo.dueDate)}
                    </td>
                    <td>
                      <div className="task-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditTask(todo.id)}
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteTodo(todo.id)}
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedTodos.length > 5 && !showAllTasks && (
              <div className="todo-table-footer">
                <button 
                  className="view-more-btn"
                  onClick={() => setShowAllTasks(true)}
                >
                  ดูเพิ่มเติม ({sortedTodos.length - 5} รายการ)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTaskModal && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>เพิ่มงานใหม่</h2>
                <button className="modal-close-btn" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              <form className="modal-body" onSubmit={handleSubmitTask}>
                <div className="form-group">
                  <label htmlFor="taskName">ชื่องาน *</label>
                  <input
                    type="text"
                    id="taskName"
                    name="taskName"
                    value={newTask.taskName}
                    onChange={handleInputChange}
                    placeholder="เช่น นัดแสดงบ้าน 456 ถ.สุขุมวิท"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="client">ลูกค้า</label>
                  <div className="customer-select-wrapper">
                    <button
                      type="button"
                      className="customer-select-button"
                      onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    >
                      {newTask.client && newTask.client !== '-' ? (
                        <div className="customer-select-selected">
                          <div className="customer-avatar">
                            {customers.find(c => c.name === newTask.client)?.avatar ? (
                              <img 
                                src={customers.find(c => c.name === newTask.client).avatar} 
                                alt={newTask.client}
                              />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <span>{newTask.client}</span>
                        </div>
                      ) : (
                        <span className="customer-select-placeholder">เลือกลูกค้า</span>
                      )}
                      <ChevronDown size={20} className={showCustomerDropdown ? 'rotate' : ''} />
                    </button>
                    {showCustomerDropdown && (
                      <div className="customer-dropdown">
                        <div 
                          className="customer-option"
                          onClick={() => {
                            setNewTask({...newTask, client: '-'});
                            setShowCustomerDropdown(false);
                          }}
                        >
                          <div className="customer-avatar">
                            <span>-</span>
                          </div>
                          <span>-</span>
                        </div>
                        {customers.map(customer => (
                          <div
                            key={customer.id}
                            className="customer-option"
                            onClick={() => {
                              setNewTask({...newTask, client: customer.name});
                              setShowCustomerDropdown(false);
                            }}
                          >
                            <div className="customer-avatar">
                              {customer.avatar ? (
                                <img src={customer.avatar} alt={customer.name} />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <span>{customer.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="status">สถานะ</label>
                  <select
                    id="status"
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                  >
                    <option value="รอทำ">รอทำ</option>
                    <option value="กำลังทำ">กำลังทำ</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">ความสำคัญ</label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                    >
                      <option value="สูง">สูง</option>
                      <option value="ปกติ">ปกติ</option>
                      <option value="ต่ำ">ต่ำ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dueDate">วันที่ครบกำหนด *</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-submit">
                    เพิ่มงาน
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
