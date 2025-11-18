import { format, subDays } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Phone,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import './Statistics.css';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', '90', 'all'

  // Mock data - ใน production จะดึงจาก API
  const stats = {
    totalViews: 12450,
    totalInterested: 156,
    totalContacts: 89,
    conversionRate: 12.5,
  };

  const dailyStats = [
    { date: subDays(new Date(), 6), views: 120, interested: 8, contacts: 5 },
    { date: subDays(new Date(), 5), views: 145, interested: 12, contacts: 7 },
    { date: subDays(new Date(), 4), views: 98, interested: 6, contacts: 4 },
    { date: subDays(new Date(), 3), views: 167, interested: 15, contacts: 9 },
    { date: subDays(new Date(), 2), views: 134, interested: 10, contacts: 6 },
    { date: subDays(new Date(), 1), views: 189, interested: 18, contacts: 11 },
    { date: new Date(), views: 156, interested: 14, contacts: 8 },
  ];

  const listingStats = [
    {
      id: 1,
      title: 'คอนโดมิเนียมหรูใจกลางเมือง',
      views: 3420,
      interested: 45,
      contacts: 28,
      conversionRate: 13.2,
    },
    {
      id: 2,
      title: 'บ้านเดี่ยว 3 ห้องนอน',
      views: 1890,
      interested: 22,
      contacts: 14,
      conversionRate: 11.6,
    },
    {
      id: 3,
      title: 'ทาวน์เฮาส์ 2 ชั้น',
      views: 1560,
      interested: 18,
      contacts: 10,
      conversionRate: 11.5,
    },
  ];

  const maxViews = Math.max(...dailyStats.map(d => d.views));
  const maxInterested = Math.max(...dailyStats.map(d => d.interested));
  const maxContacts = Math.max(...dailyStats.map(d => d.contacts));

  return (
    <Layout>
      <div className="statistics-page container">
        <div className="page-header">
          <div>
            <h1>สถิติประกาศ</h1>
            <p>วิเคราะห์ประสิทธิภาพของประกาศของคุณ</p>
          </div>
          <div className="time-range-selector">
            <label>ช่วงเวลา:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="7">7 วันล่าสุด</option>
              <option value="30">30 วันล่าสุด</option>
              <option value="90">90 วันล่าสุด</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="overview-stats">
          <div className="stat-card-large">
            <div className="stat-icon-large stat-icon-primary">
              <Eye size={32} />
            </div>
            <div className="stat-content-large">
              <h2>{stats.totalViews.toLocaleString()}</h2>
              <p>ยอดดูทั้งหมด</p>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                <span>+12% จากเดือนที่แล้ว</span>
              </div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon-large stat-icon-turquoise">
              <Heart size={32} />
            </div>
            <div className="stat-content-large">
              <h2>{stats.totalInterested}</h2>
              <p>ผู้สนใจ</p>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                <span>+8% จากเดือนที่แล้ว</span>
              </div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon-large stat-icon-green">
              <Phone size={32} />
            </div>
            <div className="stat-content-large">
              <h2>{stats.totalContacts}</h2>
              <p>ติดต่อ</p>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                <span>+15% จากเดือนที่แล้ว</span>
              </div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon-large stat-icon-blue">
              <BarChart3 size={32} />
            </div>
            <div className="stat-content-large">
              <h2>{stats.conversionRate}%</h2>
              <p>อัตราการแปลง</p>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                <span>+2.5% จากเดือนที่แล้ว</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats Chart */}
        <div className="chart-card card">
          <h2>สถิติรายวัน</h2>
          <div className="chart-container">
            <div className="chart-bars">
              {dailyStats.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar bar-views"
                      style={{ height: `${(day.views / maxViews) * 100}%` }}
                      title={`${day.views} views`}
                    />
                    <div 
                      className="chart-bar bar-interested"
                      style={{ height: `${(day.interested / maxInterested) * 100}%` }}
                      title={`${day.interested} interested`}
                    />
                    <div 
                      className="chart-bar bar-contacts"
                      style={{ height: `${(day.contacts / maxContacts) * 100}%` }}
                      title={`${day.contacts} contacts`}
                    />
                  </div>
                  <div className="chart-label">
                    {format(day.date, 'dd MMM', { locale: th })}
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color views"></div>
                <span>ยอดดู</span>
              </div>
              <div className="legend-item">
                <div className="legend-color interested"></div>
                <span>สนใจ</span>
              </div>
              <div className="legend-item">
                <div className="legend-color contacts"></div>
                <span>ติดต่อ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Listings */}
        <div className="top-listings-card card">
          <div className="section-header">
            <h2>ประกาศที่ได้รับความสนใจมากที่สุด</h2>
            <PieChart size={24} />
          </div>

          <div className="listings-stats-table">
            <table>
              <thead>
                <tr>
                  <th>ชื่อประกาศ</th>
                  <th>ยอดดู</th>
                  <th>สนใจ</th>
                  <th>ติดต่อ</th>
                  <th>อัตราการแปลง</th>
                </tr>
              </thead>
              <tbody>
                {listingStats.map((listing) => (
                  <tr key={listing.id}>
                    <td className="listing-title-cell">
                      <strong>{listing.title}</strong>
                    </td>
                    <td>
                      <div className="stat-with-icon">
                        <Eye size={16} />
                        {listing.views.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="stat-with-icon">
                        <Heart size={16} />
                        {listing.interested}
                      </div>
                    </td>
                    <td>
                      <div className="stat-with-icon">
                        <Phone size={16} />
                        {listing.contacts}
                      </div>
                    </td>
                    <td>
                      <span className={`conversion-rate ${listing.conversionRate >= 12 ? 'high' : 'medium'}`}>
                        {listing.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="insights-card card">
          <h2>ข้อมูลเชิงลึก</h2>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon">
                <TrendingUp size={24} />
              </div>
              <div className="insight-content">
                <h3>ยอดดูเพิ่มขึ้น</h3>
                <p>ยอดดูเพิ่มขึ้น 12% เมื่อเทียบกับเดือนที่แล้ว</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">
                <Calendar size={24} />
              </div>
              <div className="insight-content">
                <h3>ช่วงเวลาที่ดีที่สุด</h3>
                <p>วันจันทร์-ศุกร์ เวลา 09:00-12:00 และ 18:00-21:00</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">
                <BarChart3 size={24} />
              </div>
              <div className="insight-content">
                <h3>อัตราการแปลง</h3>
                <p>อัตราการแปลงเฉลี่ย 12.5% สูงกว่าค่าเฉลี่ยของตลาด</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;

