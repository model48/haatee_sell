import { AlertCircle, ArrowLeft, FileText, Filter, Image } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layoutsell';
import './Guidesell.css';

const Guide = () => {
  const [selectedSection, setSelectedSection] = useState('posting-guide');

  // Scroll to section smoothly when section changes
  useEffect(() => {
    // Wait for section to be rendered, then scroll smoothly
    const timer = setTimeout(() => {
      const element = document.getElementById(selectedSection);
      if (element) {
        // Use scrollIntoView with smooth behavior for better animation
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 50); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [selectedSection]);
  const guideSections = [
    {
      id: 'posting-guide',
      title: 'วิธีลงประกาศบนเว็บไซต์และแอปฯของเรา',
      icon: FileText,
      content: (
        <div className="guide-section-content">
          <div className="guide-banner stats-banner">
            <h2>ผู้เข้าชมมากกว่า</h2>
            <h1>3 ล้านคน / เดือน</h1>
            <p className="tagline">ง่ายกว่า ถูกกว่า ดีกว่า</p>
          </div>
          <div className="guide-text">
            <p >เมื่อคุณสมัครสมาชิกในระบบ HaaTee และทำการยืนยันตัวตน โปรไฟล์ของคุณจะมีความน่าเชื่อถือมากขึ้น</p>
            <h3>คุณจะได้รับประโยชน์ดังนี้</h3>
            
            <div className="benefit-item">
              <h4>✔️ โปรไฟล์ที่เชื่อถือได้</h4>
              <ul>
                <li>แสดงสัญลักษณ์ "Verified"</li>
                <li>เพิ่มความมั่นใจให้ผู้สนใจทรัพย์</li>
                <li>ลดโอกาสถูกมองว่าเป็นประกาศไม่จริง</li>
              </ul>
            </div>

            <div className="benefit-item">
              <h4>✔️ ใช้งานฟีเจอร์ได้เต็มรูปแบบ</h4>
              <p>รวมถึง:</p>
              <ul>
                <li>สร้างสัญญาดิจิทัล (E-Contract)</li>
                <li>เซ็นสัญญาออนไลน์</li>
                <li>ระบบแจ้งเตือนและแชทในระบบ</li>
                <li>จัดการประกาศอย่างละเอียด</li>
              </ul>
            </div>

            <h3>ขั้นตอนการลงประกาศ</h3>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-content">
                  <h4>คลิกปุ่ม "เพิ่มประกาศใหม่"</h4>
                  <p>ไปที่เมนู "รายการประกาศ" และคลิกปุ่ม "เพิ่มประกาศใหม่" หรือ "สร้างประกาศ"</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-content">
                  <h4>กรอกข้อมูลทรัพย์สิน</h4>
                  <p>กรอกข้อมูลรายละเอียดทรัพย์สิน เช่น ประเภทอสังหาริมทรัพย์, ราคา, พื้นที่, จำนวนห้องนอน, ห้องน้ำ, ที่ตั้ง เป็นต้น</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-content">
                  <h4>อัปโหลดรูปภาพ</h4>
                  <p>อัปโหลดรูปภาพของทรัพย์สิน (ขั้นต่ำ 3 รูป) และเลือกรูปภาพหลักที่จะแสดงเป็นภาพปก</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-content">
                  <h4>ระบุตำแหน่งบนแผนที่</h4>
                  <p>ปักหมุดตำแหน่งทรัพย์สินบนแผนที่เพื่อให้ลูกค้าสามารถดูตำแหน่งได้อย่างชัดเจน</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-content">
                  <h4>ตรวจสอบและยืนยัน</h4>
                  <p>ตรวจสอบข้อมูลทั้งหมดให้ถูกต้อง แล้วคลิก "ยืนยันการสร้างประกาศ" หรือ "เผยแพร่ประกาศ"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rules',
      title: 'กฎระเบียบและกติกา ในการระงับหรือปิดประกาศ ที่เกิดจากการถูกรายงาน',
      icon: AlertCircle,
      content: (
        <div className="guide-section-content">
          <div className="guide-banner rules-banner">
            <h2>เพื่อให้ประกาศ มีคุณภาพและความถูกต้อง มากขึ้น</h2>
          </div>
          <div className="guide-text">
            <p>แพลตฟอร์มของเราได้กลายเป็นกลไกสำคัญในตลาดอสังหาริมทรัพย์ของประเทศไทย เนื่องจากมีผู้ใช้หลายล้านคนต่อเดือน เราจึงได้รับคำแนะนำและข้อร้องเรียนจากผู้ใช้เกี่ยวกับประกาศที่ไม่ถูกต้อง</p>
            <p>สมาชิกทุกคนต้องปฏิบัติตามข้อกำหนดการใช้งานและกฎระเบียบอย่างเคร่งครัด เพื่อให้แน่ใจว่าประกาศมีคุณภาพและความถูกต้อง</p>
            <h3>กระบวนการจัดการประกาศที่ถูกรายงาน:</h3>
            <ul>
              <li>ระบบจะระงับการแสดงผลอัตโนมัติ</li>
              <li>ย้ายไปยังหมวดหมู่ "รอแก้ไข" หรือ "ปิดการขาย"</li>
              <li>ผู้ใช้สามารถแก้ไขหรือติดต่อทีมงานเพื่อขอความช่วยเหลือ</li>
            </ul>
            <h3>กฎระเบียบและกติกามีดังนี้:</h3>
            <ol>
              <li><strong>รายงานว่า "ขายหรือให้เช่าแล้ว" มากกว่า 2 ครั้ง หรือผู้ใช้ให้หลักฐานที่ยืนยันได้ว่าขายหรือให้เช่าแล้ว</strong> - ระบบจะปิดประกาศอัตโนมัติ</li>
              <li><strong>รายงานว่า "ราคาไม่ถูกต้อง"</strong> - ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</li>
              <li><strong>รายงานว่า "ใช้ภาพหรือข้อมูลของผู้อื่นโดยไม่ได้รับอนุญาต"</strong> - ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</li>
              <li><strong>รายงานและระบบพบว่า "ราคาที่ระบุในระบบและรายละเอียดไม่ตรงกัน"</strong> - ระบบจะย้ายประกาศไปยังหมวด "รอแก้ไข"</li>
            </ol>
            <p>ระบบมีทีมงานตรวจสอบและป้องกันการรายงานด้วยเจตนาร้าย เนื่องจากผู้รายงานต้องเข้าสู่ระบบ ทำให้ทราบตัวตนได้ และการรายงานเท็จเป็นความผิดทางกฎหมาย ดังนั้นผู้ใช้ไม่ต้องกังวลเรื่องการรายงานด้วยเจตนาร้าย</p>
            <p>หากพบว่าการรายงานเป็นความเข้าใจผิด หรือข้อมูลประกาศของผู้ใช้ไม่ผิดกฎหมาย ระบบจะนำประกาศกลับมาแสดงผลตามปกติโดยไม่เสียค่าธรรมเนียมการลงประกาศใหม่</p>
          </div>
        </div>
      )
    },
    {
      id: 'watermark',
      title: 'Watermark ใส่ภาพลายน้ำเพื่อป้องกันลิขสิทธิ์ภาพของเรากันเลย',
      icon: Image,
      content: (
        <div className="guide-section-content">
          <div className="guide-banner">
            <h2>ใส่ลายน้ำ ให้ภาพของเราได้แล้ว!</h2>
          </div>
          <div className="guide-text">
            <p>หากคุณต้องการป้องกัน การนำภาพของคุณไปใช้ โดยไม่ได้ขออนุญาต คุณสามารถสร้างลายน้ำบนทุกภาพในประกาศของคุณได้ทันที</p>
            <p>โดยคุณสามารถ เลือก"รูปแบบข้อความ"และ"ตำแหน่งของลายน้ำ" ได้เลยตามที่คุณต้องการ</p>
            <h3>คุณสมบัติ:</h3>
            <ul>
              <li>✓ ป้องกันการปลอมแปลง หรือนำภาพไปใช้ โดยไม่ได้รับอนุญาติ</li>
              <li>✓ ทำเองได้ ใช้งานง่าย ไม่ยุ่งยาก</li>
            </ul>
            <p className="guide-warning">โปรดระวัง! การคัดลอกภาพและนำมาใช้โดยไม่ได้รับอนุญาต มีความผิดทั้งทางแพ่งและอาญา</p>
          </div>
        </div>
      )
    },
    {
      id: 'filter',
      title: 'MyStock Filter - สำหรับคนมีประกาศเยอะๆ เรามีระบบกรอง และค้นหาประกาศของคุณได้ง่ายมากขึ้น',
      icon: Filter,
      content: (
        <div className="guide-section-content">
          <div className="guide-banner">
            <h2>กรองประกาศให้เจอง่ายมากๆ</h2>
          </div>
          <div className="guide-text">
            <p>สำหรับคนที่มีประกาศเยอะๆ ระบบกรองจะช่วยให้คุณค้นหาประกาศได้ง่ายขึ้น</p>
            <p>มีตัวกรองสำหรับ "ประกาศใกล้หมดอายุ" ที่จะแสดงรายการที่ใกล้หมดอายุภายใน 7 วัน ทำให้ง่ายต่อการต่ออายุหรือดันประกาศ</p>
            <h3>คุณสมบัติการกรอง:</h3>
            <ul>
              <li>กรองตามราคา</li>
              <li>กรองตามจำนวนห้องนอน</li>
              <li>กรองตามพื้นที่</li>
              <li>กรองตามการอนุญาตเลี้ยงสัตว์</li>
              <li>กรองตามประกาศใกล้หมดอายุ</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="guide-page">
      <div className="guide-header">
        <Link to="/agent/dashboard" className="guide-back-link">
          <ArrowLeft size={18} />
          กลับไปที่หน้าหลัก
        </Link>
        <h1 className="guide-main-title">คู่มือการใช้งาน</h1>
      </div>

      <div className="guide-container">
        <div className="guide-sidebar">
          <h2>หัวข้อคู่มือ</h2>
          <nav className="guide-nav">
            {guideSections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`guide-nav-item ${selectedSection === section.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSection(section.id);
                  }}
                >
                  <Icon size={18} />
                  <span>{section.title}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="guide-content">
          {guideSections.map((section) => {
            const Icon = section.icon;
            const isVisible = selectedSection === section.id;
            return (
              <section 
                key={section.id} 
                id={section.id} 
                className={`guide-section ${isVisible ? 'visible' : 'hidden'}`}
              >
                <div className="guide-section-header">
                  <Icon size={24} className="guide-section-icon" />
                  <h2>{section.title}</h2>
                </div>
                {section.content}
              </section>
            );
          })}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Guide;

