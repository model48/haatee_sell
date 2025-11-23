import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Upload,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layoutsell';
import './CreateListingsell.css';

const CreateListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'sell', // 'sell' or 'rent'
    title: '',
    description: '',
    price: '',
    usableArea: '',
    landArea: '',
    yearBuilt: '',
    bedrooms: '3',
    bathrooms: '2',
    address: '',
    mapEmbed: '',
    propertyType: 'house',
    features: [],
    otherFeature: '',
    contactLine: '',
    contactPhone: '',
    contactEmail: '',
    status: 'draft',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // Watermark settings
  const [watermarkSettings, setWatermarkSettings] = useState({
    enabled: false,
    text1: '',
    text2: '',
    position: 'center' // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  });

  const propertyTypes = [
    { value: 'condo', label: 'คอนโด' },
    { value: 'house', label: 'บ้านเดี่ยว' },
    { value: 'townhouse', label: 'ทาวเฮ้าส์' },
    { value: 'townhome', label: 'ทาวโฮม' },
    { value: 'land', label: 'ที่ดิน' },
    { value: 'apartment', label: 'อพาร์ทเมนท์' },
    { value: 'dormitory', label: 'หอพัก' },
    { value: 'shophouse', label: 'ตึกแถว' },
    { value: 'commercial', label: 'อาคารพาณิชย์' },
  ];

  const steps = [
    { number: 1, title: 'ข้อมูลทรัพย์', subtitle: 'รายละเอียดหลัก' },
    { number: 2, title: 'ที่ตั้ง', subtitle: 'ตำแหน่งทรัพย์' },
    { number: 3, title: 'รูปภาพ', subtitle: 'อัปโหลดภาพ' },
    { number: 4, title: 'ช่องทางติดต่อ', subtitle: 'ข้อมูลติดต่อ' },
    { number: 5, title: 'สรุปประกาศ', subtitle: 'ตรวจสอบและยืนยัน' },
  ];

  const features = [
    'สระว่ายน้ำ',
    'ฟิตเนส',
    'ที่จอดรถ',
    'ลิฟต์',
    'ระบบรักษาความปลอดภัย',
    'ใกล้รถไฟฟ้า',
    'ใกล้ห้างสรรพสินค้า',
    'ใกล้โรงเรียน',
    'อื่นๆ',
  ];

  const validateEmail = (email) => {
    if (!email || !email.trim()) return null;
    
    const emailValue = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check basic email format
    if (!emailRegex.test(emailValue)) {
      return 'กรุณากรอกอีเมลที่ถูกต้อง';
    }
    
    // Check for fake/test email patterns
    const [localPart, domain] = emailValue.split('@');
    const domainName = domain.split('.')[0];
    
    // Block common test/fake email patterns
    const fakeEmailPatterns = [
      /^test/i,
      /^example/i,
      /^demo/i,
      /^sample/i,
      /^fake/i,
      /^dummy/i,
      /^temp/i,
      /^tmp/i,
    ];
    
    const isFakeLocal = fakeEmailPatterns.some(pattern => pattern.test(localPart));
    const isFakeDomain = fakeEmailPatterns.some(pattern => pattern.test(domainName));
    
    // Block if local part and domain name are the same (e.g., test@test.com)
    const isSameLocalDomain = localPart === domainName;
    
    // Block if local part has too many repeated characters (e.g., aaaaa@bbbb.com)
    const hasRepeatedChars = /(.)\1{4,}/.test(localPart);
    
    // Block common fake domains
    const fakeDomains = ['test.com', 'example.com', 'demo.com', 'sample.com', 'fake.com', 'dummy.com', 'temp.com', 'tmp.com'];
    const isFakeDomainName = fakeDomains.includes(domain);
    
    if (isFakeLocal || isFakeDomain || isSameLocalDomain || hasRepeatedChars || isFakeDomainName) {
      return 'กรุณากรอกอีเมลจริงที่ใช้งานได้';
    }
    
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) return null;
    
    const phoneValue = phone.replace(/[-\s]/g, '');
    
    // Check basic phone format (9-10 digits)
    if (!/^[0-9]{9,10}$/.test(phoneValue)) {
      return 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)';
    }
    
    // Check for fake/test phone patterns
    // Block if all digits are the same (e.g., 0999999999, 1111111111)
    const allSameDigit = /^(\d)\1+$/.test(phoneValue);
    
    // Block if digits are sequential (e.g., 1234567890, 0987654321)
    const isSequential = (str) => {
      const digits = str.split('').map(Number);
      let isAscending = true;
      let isDescending = true;
      
      for (let i = 1; i < digits.length; i++) {
        if (digits[i] !== digits[i - 1] + 1) isAscending = false;
        if (digits[i] !== digits[i - 1] - 1) isDescending = false;
      }
      
      return isAscending || isDescending;
    };
    
    // Block if starts with 0 and followed by repeated digits (e.g., 099999999999999)
    const startsWithZeroRepeated = /^0(\d)\1{7,}$/.test(phoneValue);
    
    // Block if has too many repeated digits in sequence (more than 6 same digits)
    const hasManyRepeatedDigits = /(\d)\1{6,}/.test(phoneValue);
    
    if (allSameDigit || isSequential(phoneValue) || startsWithZeroRepeated || hasManyRepeatedDigits) {
      return 'กรุณากรอกเบอร์โทรศัพท์จริงที่ใช้งานได้';
    }
    
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for email and phone
    if (name === 'contactEmail') {
      const emailError = validateEmail(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (emailError) {
          newErrors.contactEmail = emailError;
        } else {
          delete newErrors.contactEmail;
        }
        return newErrors;
      });
    } else if (name === 'contactPhone') {
      const phoneError = validatePhone(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (phoneError) {
          newErrors.contactPhone = phoneError;
        } else {
          delete newErrors.contactPhone;
        }
        return newErrors;
      });
    } else if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // If empty, set to empty string
    if (cleanValue === '') {
      setFormData(prev => ({
        ...prev,
        price: ''
      }));
      if (errors.price) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.price;
          return newErrors;
        });
      }
      return;
    }
    
    // Parse to number
    const numValue = parseFloat(cleanValue);
    
    // If not a valid number, don't update
    if (isNaN(numValue)) {
      return;
    }
    
    // Format with comma for display
    const formattedValue = numValue.toLocaleString('th-TH');
    
    setFormData(prev => ({
      ...prev,
      price: formattedValue
    }));
    
    if (errors.price) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const isOther = feature === 'อื่นๆ';
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];
      
      const otherFeature = isOther && !newFeatures.includes('อื่นๆ') ? '' : prev.otherFeature;
      
      return {
        ...prev,
        features: newFeatures,
        otherFeature: otherFeature
      };
    });
  };

  const handleOtherFeatureChange = (e) => {
    setFormData(prev => ({
      ...prev,
      otherFeature: e.target.value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('อัปโหลดได้สูงสุด 10 รูป');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image && !image.isExisting && image.preview && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    setImages(prev => {
      const newImages = [...prev];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return newImages;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'กรุณากรอกชื่อประกาศ';
    
    // Validate price - remove comma before checking
    const priceValue = formData.price ? formData.price.replace(/,/g, '') : '';
    if (!priceValue.trim()) {
      newErrors.price = 'กรุณากรอกราคา';
    } else {
      const numPrice = parseFloat(priceValue);
      if (isNaN(numPrice) || numPrice <= 0) {
        newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง';
      }
    }
    
    if (!formData.usableArea.trim()) newErrors.usableArea = 'กรุณากรอกพื้นที่ใช้สอย';
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่';
    if (images.length === 0) newErrors.images = 'กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป';
    
    // Validate contact information - at least one contact method is required
    if (!formData.contactLine.trim() && !formData.contactPhone.trim() && !formData.contactEmail.trim()) {
      newErrors.contact = 'กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง';
    }
    
    // Validate email format if provided
    if (formData.contactEmail.trim()) {
      const emailError = validateEmail(formData.contactEmail);
      if (emailError) {
        newErrors.contactEmail = emailError;
      }
    }
    
    // Validate phone format if provided (Thai phone number format)
    if (formData.contactPhone.trim()) {
      const phoneError = validatePhone(formData.contactPhone);
      if (phoneError) {
        newErrors.contactPhone = phoneError;
      }
    }
    
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const getStepForField = (fieldName) => {
    const step1Fields = ['title', 'description', 'price', 'usableArea', 'landArea', 'yearBuilt', 'bedrooms', 'bathrooms', 'propertyType'];
    if (step1Fields.includes(fieldName)) return 1;
    if (fieldName === 'address' || fieldName === 'mapEmbed') return 2;
    if (fieldName === 'images') return 3;
    if (fieldName === 'contactLine' || fieldName === 'contactPhone' || fieldName === 'contactEmail' || fieldName === 'contact') return 4;
    return 1;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const validation = validateForm();
    
    if (!validation.isValid) {
      const firstErrorField = Object.keys(validation.errors)[0];
      setCurrentStep(getStepForField(firstErrorField));
      alert(`กรุณากรอกข้อมูลให้ครบถ้วน: ${validation.errors[firstErrorField]}`);
      return;
    }

    setIsSubmitting(true);

    const applyWatermark = (imageDataUrl) => {
      return new Promise((resolve) => {
        if (!watermarkSettings.enabled || (!watermarkSettings.text1 && !watermarkSettings.text2)) {
          resolve(imageDataUrl);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Calculate watermark position
          const padding = 20;
          let x, y;
          const fontSize = Math.max(16, Math.min(img.width, img.height) / 30);
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.lineWidth = 2;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          
          // Calculate text width for positioning
          const text1 = watermarkSettings.text1 || '';
          const text2 = watermarkSettings.text2 || '';
          const text1Width = ctx.measureText(text1).width;
          const text2Width = ctx.measureText(text2).width;
          const maxTextWidth = Math.max(text1Width, text2Width);
          const lineHeight = fontSize * 1.5;
          const totalHeight = (text1 ? lineHeight : 0) + (text2 ? lineHeight : 0);
          
          // Position calculation
          switch (watermarkSettings.position) {
            case 'top-left':
              x = padding;
              y = padding;
              break;
            case 'top-right':
              x = img.width - maxTextWidth - padding;
              y = padding;
              break;
            case 'bottom-left':
              x = padding;
              y = img.height - totalHeight - padding;
              break;
            case 'bottom-right':
              x = img.width - maxTextWidth - padding;
              y = img.height - totalHeight - padding;
              break;
            case 'center':
            default:
              x = (img.width - maxTextWidth) / 2;
              y = (img.height - totalHeight) / 2;
              break;
          }
          
          // Draw watermark text with stroke for visibility
          let currentY = y;
          if (text1) {
            ctx.strokeText(text1, x, currentY);
            ctx.fillText(text1, x, currentY);
            currentY += lineHeight;
          }
          if (text2) {
            ctx.strokeText(text2, x, currentY);
            ctx.fillText(text2, x, currentY);
          }
          
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => resolve(imageDataUrl);
        img.src = imageDataUrl;
      });
    };

    const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const convertImagesToBase64 = async () => {
      if (!images?.length) return [];
      
      const validImages = images.filter(img => img && (img.file || img.preview || (img.isExisting && img.preview)));
      if (!validImages.length) return [];
      
      const compressExisting = (base64) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 1200;
            let w = img.width, h = img.height;
            if (w > h && w > maxSize) {
              h = (h * maxSize) / w;
              w = maxSize;
            } else if (h > maxSize) {
              w = (w * maxSize) / h;
              h = maxSize;
            }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = () => resolve(base64);
          img.src = base64;
        });
      };
      
      return Promise.all(validImages.map(async (image) => {
        let processedImage = '';
        
        if (image.isExisting && image.preview && !image.file) {
          const estimatedSizeKB = (image.preview.length * 3) / 4 / 1024;
          if (estimatedSizeKB > 500 && image.preview.startsWith('data:image')) {
            try {
              processedImage = await compressExisting(image.preview);
            } catch {
              processedImage = image.preview;
            }
          } else {
            processedImage = image.preview;
          }
        } else if (image.file) {
          try {
            processedImage = await compressImage(image.file);
          } catch {
            processedImage = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(image.file);
            });
          }
        } else {
          processedImage = image.preview || '';
        }
        
        // Apply watermark if enabled
        if (processedImage && watermarkSettings.enabled) {
          try {
            return await applyWatermark(processedImage);
          } catch {
            return processedImage;
          }
        }
        
        return processedImage;
      }));
    };

    const getListings = () => {
      try {
        const saved = localStorage.getItem('listings');
        return saved ? JSON.parse(saved) : [];
      } catch {
        try {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('listing_') || key === 'listings') {
              try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                if (Array.isArray(data)) {
                  const filtered = data.filter(l => 
                    l.status === 'active' || 
                    (l.status === 'draft' && l.createdAt && new Date(l.createdAt) > thirtyDaysAgo)
                  );
                  localStorage.setItem(key, JSON.stringify(filtered));
                }
              } catch {
                localStorage.removeItem(key);
              }
            }
          });
          const saved = localStorage.getItem('listings');
          return saved ? JSON.parse(saved) : [];
        } catch {
          alert('พื้นที่เก็บข้อมูลเต็ม กรุณาลบประกาศเก่าบางรายการออกก่อน');
          setIsSubmitting(false);
          return null;
        }
      }
    };

    try {
      const imageBase64Array = await convertImagesToBase64();
      const existingListings = getListings();
      if (existingListings === null) return;
      
      const saveListings = (listings) => {
        try {
          localStorage.setItem('listings', JSON.stringify(listings));
          return true;
        } catch {
          try {
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            const cleaned = listings.filter(l => 
              !(l.status === 'expired' && l.expiresAt && new Date(l.expiresAt) <= sixtyDaysAgo)
            );
            localStorage.setItem('listings', JSON.stringify(cleaned));
            alert('บันทึกสำเร็จ (ลบประกาศเก่าบางรายการเพื่อเพิ่มพื้นที่)');
            return true;
          } catch {
            setIsSubmitting(false);
            alert('พื้นที่เก็บข้อมูลเต็ม กรุณาลบประกาศเก่าบางรายการออกก่อน');
            return false;
          }
        }
      };

      if (isEditMode && editId) {
        const updatedListings = existingListings.map(l => {
          if (l.id === editId) {
            const expiresAt = formData.status === 'active' && !l.expiresAt
              ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
              : formData.status === 'active' && l.expiresAt
              ? l.expiresAt
              : formData.status === 'draft' ? null : l.expiresAt;
            return {
              ...l,
              ...formData,
              image: imageBase64Array[0] || l.image || '',
              images: imageBase64Array,
              expiresAt,
              // Preserve original dates
              createdAt: l.createdAt || new Date().toISOString(),
              closedAt: l.closedAt || null,
              // Ensure all contact fields are saved
              contactLine: formData.contactLine || '',
              contactPhone: formData.contactPhone || '',
              contactEmail: formData.contactEmail || '',
            };
          }
          return l;
        });
        
        if (!saveListings(updatedListings)) return;
        setIsSubmitting(false);
        alert(formData.status === 'active' 
          ? 'แก้ไขประกาศสำเร็จ! ประกาศของคุณจะแสดงทันที'
          : 'บันทึกเป็นร่างสำเร็จ!');
        navigate('/agent/listings');
      } else {
        const newListing = {
          id: Date.now().toString(),
          ...formData,
          image: imageBase64Array[0] || '',
          images: imageBase64Array,
          createdAt: new Date().toISOString(),
          expiresAt: formData.status === 'active' 
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            : null,
          closedAt: null,
        };
        
        if (!saveListings([...existingListings, newListing])) return;
        setIsSubmitting(false);
        alert(formData.status === 'active' 
          ? 'สร้างประกาศสำเร็จ! ประกาศของคุณจะแสดงทันที'
          : 'บันทึกเป็นร่างสำเร็จ!');
        navigate('/agent/listings');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      setIsSubmitting(false);
      alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message || error}`);
    }
  };

  // Load watermark settings from localStorage
  useEffect(() => {
    const savedWatermark = localStorage.getItem('watermarkSettings');
    if (savedWatermark) {
      try {
        const parsed = JSON.parse(savedWatermark);
        setWatermarkSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading watermark settings:', e);
      }
    }
  }, []);

  // Save watermark settings to localStorage when changed
  useEffect(() => {
    if (watermarkSettings.enabled || watermarkSettings.text1 || watermarkSettings.text2) {
      localStorage.setItem('watermarkSettings', JSON.stringify(watermarkSettings));
    }
  }, [watermarkSettings]);

  useEffect(() => {
    if (editId) {
      const savedListings = JSON.parse(localStorage.getItem('listings') || '[]');
      const listingToEdit = savedListings.find(l => l.id === editId);
      
      if (listingToEdit) {
        setIsEditMode(true);
        
        // Format price with comma if it's a number
        let formattedPrice = listingToEdit.price || '';
        if (formattedPrice) {
          const priceNum = parseFloat(formattedPrice.toString().replace(/[^0-9.]/g, ''));
          if (!isNaN(priceNum)) {
            formattedPrice = priceNum.toLocaleString('th-TH');
          }
        }
        
        setFormData({
          type: listingToEdit.type || 'sell',
          title: listingToEdit.title || '',
          description: listingToEdit.description || '',
          price: formattedPrice,
          usableArea: listingToEdit.usableArea || '',
          landArea: listingToEdit.landArea || '',
          yearBuilt: listingToEdit.yearBuilt || '',
          bedrooms: listingToEdit.bedrooms || '3',
          bathrooms: listingToEdit.bathrooms || '2',
          address: listingToEdit.address || '',
          mapEmbed: listingToEdit.mapEmbed || '',
          propertyType: listingToEdit.propertyType || 'house',
          features: listingToEdit.features || [],
          otherFeature: listingToEdit.otherFeature || '',
          contactLine: listingToEdit.contactLine || '',
          contactPhone: listingToEdit.contactPhone || '',
          contactEmail: listingToEdit.contactEmail || '',
          status: listingToEdit.status || 'draft',
        });
        
        if (listingToEdit.images?.length > 0) {
          setImages(listingToEdit.images.map((img, i) => ({
            id: `existing-${i}-${Date.now()}`,
            preview: img,
            file: null,
            isExisting: true,
          })));
        } else if (listingToEdit.image) {
          setImages([{
            id: `existing-0-${Date.now()}`,
            preview: listingToEdit.image,
            file: null,
            isExisting: true,
          }]);
        }
      }
    }
  }, [editId]);

  const formatPrice = (price) => {
    if (!price) return '';
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return price;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return num.toLocaleString('th-TH');
  };

  const renderStepContent = () => {
    if (currentStep === 5) {
      return (
        <div className="form-card card">
          <div className="form-header">
            <h2>สรุปประกาศ</h2>
            <p className="form-subtitle">ตรวจสอบข้อมูลก่อนยืนยัน</p>
          </div>

          <div className="summary-review-content">
            <div className="summary-section">
              <h3 className="summary-section-title">ข้อมูลทรัพย์</h3>
              <div className="summary-grid">
                <div className="summary-review-item">
                  <span className="summary-review-label">ชื่อประกาศ</span>
                  <span className="summary-review-value">{formData.title || '-'}</span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ประเภททรัพย์</span>
                  <span className="summary-review-value">
                    {propertyTypes.find(t => t.value === formData.propertyType)?.label || '-'}
                  </span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ประเภทการประกาศ</span>
                  <span className="summary-review-value">
                    {formData.type === 'sell' ? 'ขาย' : 'เช่า'}
                  </span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ราคา</span>
                  <span className="summary-review-value">
                    {formData.price ? `฿${formatPrice(formData.price)}` : '-'}
                  </span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ห้องนอน</span>
                  <span className="summary-review-value">{formData.bedrooms || '-'}</span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ห้องน้ำ</span>
                  <span className="summary-review-value">{formData.bathrooms || '-'}</span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">พื้นที่ใช้สอย</span>
                  <span className="summary-review-value">
                    {formData.usableArea ? `${formData.usableArea} ตร.ม.` : '-'}
                  </span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ที่ดิน</span>
                  <span className="summary-review-value">
                    {formData.landArea ? `${formData.landArea} ตร.ว.` : '-'}
                  </span>
                </div>
                <div className="summary-review-item">
                  <span className="summary-review-label">ปีที่สร้าง</span>
                  <span className="summary-review-value">{formData.yearBuilt || '-'}</span>
                </div>
              </div>
              {formData.description && (
                <div className="summary-review-item full-width">
                  <span className="summary-review-label">รายละเอียด</span>
                  <p className="summary-review-description">{formData.description}</p>
                </div>
              )}
            </div>

            <div className="summary-section">
              <h3 className="summary-section-title">ที่ตั้ง</h3>
              <div className="summary-grid">
                <div className="summary-review-item full-width">
                  <span className="summary-review-label">ที่อยู่</span>
                  <span className="summary-review-value">{formData.address || '-'}</span>
                </div>
              </div>
              {formData.mapEmbed && (
                <div className="summary-review-item full-width" style={{ marginTop: '1rem' }}>
                  <span className="summary-review-label">แผนที่</span>
                  <div 
                    className="summary-map-preview"
                    dangerouslySetInnerHTML={{ __html: formData.mapEmbed }}
                  />
                </div>
              )}
            </div>

            <div className="summary-section">
              <h3 className="summary-section-title">รูปภาพ ({images.length} รูป)</h3>
              {images.length > 0 ? (
                <div className="summary-images-grid">
                  {images.slice(0, 6).map((image) => (
                    <div key={image.id} className="summary-image-item">
                      <img src={image.preview} alt="Preview" />
                    </div>
                  ))}
                  {images.length > 6 && (
                    <div className="summary-image-item more-images">
                      <span>+{images.length - 6}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="summary-empty">ยังไม่มีรูปภาพ</p>
              )}
            </div>

            {formData.features.length > 0 && (
              <div className="summary-section">
                <h3 className="summary-section-title">สิ่งอำนวยความสะดวก</h3>
                <div className="summary-features">
                  {formData.features
                    .filter(f => f !== 'อื่นๆ' || formData.otherFeature)
                    .map((feature) => (
                      <span key={feature} className="summary-feature-tag">
                        {feature === 'อื่นๆ' && formData.otherFeature 
                          ? formData.otherFeature 
                          : feature}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="summary-section">
              <h3 className="summary-section-title">ช่องทางติดต่อ</h3>
              <div className="summary-grid">
                {formData.contactLine && (
                  <div className="summary-review-item">
                    <span className="summary-review-label">ไลน์</span>
                    <span className="summary-review-value">{formData.contactLine}</span>
                  </div>
                )}
                {formData.contactPhone && (
                  <div className="summary-review-item">
                    <span className="summary-review-label">เบอร์โทร</span>
                    <span className="summary-review-value">{formData.contactPhone}</span>
                  </div>
                )}
                {formData.contactEmail && (
                  <div className="summary-review-item">
                    <span className="summary-review-label">อีเมล</span>
                    <span className="summary-review-value">{formData.contactEmail}</span>
                  </div>
                )}
                {!formData.contactLine && !formData.contactPhone && !formData.contactEmail && (
                  <div className="summary-review-item full-width">
                    <span className="summary-review-value" style={{ color: '#ef4444' }}>ยังไม่ได้กรอกช่องทางติดต่อ</span>
                  </div>
                )}
              </div>
            </div>

            <div className="summary-section">
              <h3 className="summary-section-title">การเผยแพร่</h3>
              <div className="publish-options">
                <label className="publish-option">
                  <input
                    type="radio"
                    name="publishStatus"
                    value="publish"
                    checked={formData.status === 'active'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                  />
                  <div className="publish-option-content">
                    <span className="publish-option-title">เผยแพร่ทันที</span>
                    <span className="publish-option-desc">ประกาศจะแสดงในระบบทันที</span>
                  </div>
                </label>
                <label className="publish-option">
                  <input
                    type="radio"
                    name="publishStatus"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                  />
                  <div className="publish-option-content">
                    <span className="publish-option-title">บันทึกเป็นร่าง</span>
                    <span className="publish-option-desc">บันทึกไว้เพื่อแก้ไขและเผยแพร่ภายหลัง</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="summary-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(4)}
              >
                กลับไปแก้ไข
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'กำลังส่ง...' 
                  : formData.status === 'active' 
                    ? 'ยืนยันและเผยแพร่ประกาศ' 
                    : 'บันทึกเป็นร่าง'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="form-card card">
          <div className="form-header">
            <h2>ข้อมูลทรัพย์</h2>
            <p className="form-subtitle">รายละเอียดหลัก</p>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>ประเภทการประกาศ</label>
              <div className="listing-type-options">
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'sell' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'sell' }))}
                >
                  ขาย
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'rent' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'rent' }))}
                >
                  เช่า
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">ชื่อประกาศ</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="เช่น Modern Family Home near Park"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">ราคา</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                placeholder="เช่น 5,000,000"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">ประเภททรัพย์</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">ห้องนอน</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="3"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">ห้องน้ำ</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="usableArea">พื้นที่ใช้สอย (ตร.ม.)</label>
                <input
                  type="text"
                  id="usableArea"
                  name="usableArea"
                  value={formData.usableArea}
                  onChange={handleInputChange}
                  placeholder="180"
                />
              </div>

              <div className="form-group">
                <label htmlFor="landArea">ที่ดิน (ตร.ว.)</label>
                <input
                  type="text"
                  id="landArea"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  placeholder="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearBuilt">ปีที่สร้าง</label>
                <input
                  type="text"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="2019"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">รายละเอียดเพิ่มเติม</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="ระบุจุดเด่น สภาพบ้าน และบริเวณโดยรอบ"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label>สิ่งอำนวยความสะดวก</label>
              <div className="features-grid">
                {features.map((feature) => (
                  <label 
                    key={feature} 
                    className={`feature-checkbox ${feature === 'อื่นๆ' ? 'feature-other' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span className="feature-label">{feature}</span>
                  </label>
                ))}
              </div>
              {formData.features.includes('อื่นๆ') && (
                <div className="other-feature-input">
                  <input
                    type="text"
                    value={formData.otherFeature}
                    onChange={handleOtherFeatureChange}
                    placeholder="ระบุสิ่งอำนวยความสะดวกอื่นๆ"
                    className="other-feature-text"
                  />
                </div>
              )}
            </div>

            <div className="form-tip">
              <strong>เคล็ดลับ:</strong> ใช้ประโยคสั้นๆ และระบุ Landmark ใกล้เคียง
            </div>

            {/* Navigation */}
            <div className="form-navigation">
              <button
                type="button"
                className="btn-nav btn-nav-secondary"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ChevronLeft size={20} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="btn-nav btn-nav-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                ถัดไป
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="form-card card">
          <div className="form-header">
            <h2>ที่ตั้ง</h2>
            <p className="form-subtitle">ตำแหน่งทรัพย์</p>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label htmlFor="address">ที่อยู่</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="ระบุที่อยู่เต็ม เช่น 123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mapEmbed">
                Embed a map (Google Maps)
              </label>
              <textarea
                id="mapEmbed"
                name="mapEmbed"
                value={formData.mapEmbed}
                onChange={handleInputChange}
                rows="4"
                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
                className={errors.mapEmbed ? 'error' : ''}
              />
              {errors.mapEmbed && <span className="error-message">{errors.mapEmbed}</span>}
              <div className="form-help-text">
                <strong>วิธีหา Embed Code:</strong>
                <ol>
                  <li>เปิด Google Maps และค้นหาตำแหน่งที่ต้องการ</li>
                  <li>คลิกที่ปุ่ม "Share" (แชร์)</li>
                  <li>เลือกแท็บ "Embed a map"</li>
                  <li>คัดลอก iframe code และวางที่นี่</li>
                </ol>
              </div>
            </div>

            {formData.mapEmbed && (
              <div className="form-group">
                <label>ตัวอย่างแผนที่</label>
                <div 
                  className="map-preview"
                  dangerouslySetInnerHTML={{ __html: formData.mapEmbed }}
                />
              </div>
            )}

            <div className="form-navigation">
              <button
                type="button"
                className="btn-nav btn-nav-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ChevronLeft size={20} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="btn-nav btn-nav-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                ถัดไป
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="form-card card">
          <div className="form-header">
            <h2>รูปภาพ</h2>
            <p className="form-subtitle">อัปโหลดภาพ</p>
          </div>

          <div className="form-content">
            {errors.images && (
              <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444' }}>
                {errors.images}
              </div>
            )}

            {/* Watermark Settings */}
            <div className="watermark-settings">
              <div className="watermark-toggle-section">
                <label className="watermark-toggle-label">
                  <span>เปิดการใช้ลายน้ำ</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={watermarkSettings.enabled}
                      onChange={(e) => setWatermarkSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>

              {watermarkSettings.enabled && (
                <>
                  <div className="form-group">
                    <label>กรุณากรอกข้อมูลที่คุณต้องการแสดง</label>
                    <div className="watermark-text-inputs">
                      <div className="form-group">
                        <label htmlFor="watermark-text1">ข้อความที่ 1</label>
                        <input
                          type="text"
                          id="watermark-text1"
                          maxLength={30}
                          value={watermarkSettings.text1}
                          onChange={(e) => setWatermarkSettings(prev => ({ ...prev, text1: e.target.value }))}
                          placeholder="เช่น ทรัพย์มหาศาล"
                        />
                        <span className="char-count">{watermarkSettings.text1.length}/30</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="watermark-text2">ข้อความที่ 2</label>
                        <input
                          type="text"
                          id="watermark-text2"
                          maxLength={30}
                          value={watermarkSettings.text2}
                          onChange={(e) => setWatermarkSettings(prev => ({ ...prev, text2: e.target.value }))}
                          placeholder="เช่น 098-989-8998"
                        />
                        <span className="char-count">{watermarkSettings.text2.length}/30</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>กรุณาเลือกตำแหน่งของลายน้ำที่ต้องการ</label>
                    <div className="watermark-position-grid">
                      <button
                        type="button"
                        className={`watermark-position-btn ${watermarkSettings.position === 'center' ? 'active' : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: 'center' }))}
                      >
                        <div className="position-preview">
                          <div className="position-indicator center"></div>
                        </div>
                        <span>ตรงกลาง</span>
                      </button>
                      <button
                        type="button"
                        className={`watermark-position-btn ${watermarkSettings.position === 'top-left' ? 'active' : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: 'top-left' }))}
                      >
                        <div className="position-preview">
                          <div className="position-indicator top-left"></div>
                        </div>
                        <span>บนซ้าย</span>
                      </button>
                      <button
                        type="button"
                        className={`watermark-position-btn ${watermarkSettings.position === 'top-right' ? 'active' : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: 'top-right' }))}
                      >
                        <div className="position-preview">
                          <div className="position-indicator top-right"></div>
                        </div>
                        <span>บนขวา</span>
                      </button>
                      <button
                        type="button"
                        className={`watermark-position-btn ${watermarkSettings.position === 'bottom-left' ? 'active' : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: 'bottom-left' }))}
                      >
                        <div className="position-preview">
                          <div className="position-indicator bottom-left"></div>
                        </div>
                        <span>ล่างซ้าย</span>
                      </button>
                      <button
                        type="button"
                        className={`watermark-position-btn ${watermarkSettings.position === 'bottom-right' ? 'active' : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: 'bottom-right' }))}
                      >
                        <div className="position-preview">
                          <div className="position-indicator bottom-right"></div>
                        </div>
                        <span>ล่างขวา</span>
                      </button>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="form-group">
                      <label>ตัวอย่างแสดงลายน้ำ</label>
                      <div className="watermark-preview-container">
                        <div className="watermark-preview-image">
                          <img src={images[0].preview} alt="Preview" />
                          {watermarkSettings.text1 && (
                            <div className={`watermark-preview-overlay ${watermarkSettings.position}`}>
                              <div className="watermark-preview-text">
                                {watermarkSettings.text1 && <div className="watermark-text-line">{watermarkSettings.text1}</div>}
                                {watermarkSettings.text2 && <div className="watermark-text-line">{watermarkSettings.text2}</div>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="image-upload-area">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-label">
                <Upload size={48} className="upload-icon" />
                <div className="upload-text">
                  <strong>คลิกเพื่ออัปโหลด</strong>
                  <span>หรือลากวางไฟล์ที่นี่</span>
                </div>
                <span className="upload-hint">รองรับไฟล์ JPG, PNG, GIF (สูงสุด 10 รูป)</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="images-grid">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`image-item ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="image-preview">
                      <div className="drag-handle" title="ลากเพื่อเรียงลำดับ">
                        <GripVertical size={20} />
                      </div>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(image.id)}
                        title="ลบรูปภาพ"
                        aria-label="ลบรูปภาพ"
                      >
                        <X size={18} />
                      </button>
                      <img src={image.preview} alt={`Preview ${index + 1}`} />
                      {index === 0 && (
                        <div className="primary-badge">รูปหลัก</div>
                      )}
                    </div>
                    <div className="image-info">
                      <span className="image-number">รูปที่ {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="image-count-info">
              <span>อัปโหลดแล้ว {images.length} / 10 รูป</span>
            </div>

            <div className="form-tip">
              <strong>เคล็ดลับ:</strong> อัปโหลดรูปภาพที่ชัดเจนและแสดงจุดเด่นของทรัพย์สิน รูปแรกจะเป็นรูปหลักที่แสดงในรายการ
            </div>

            {/* Navigation */}
            <div className="form-navigation">
              <button
                type="button"
                className="btn-nav btn-nav-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ChevronLeft size={20} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="btn-nav btn-nav-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                ถัดไป
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="form-card card">
          <div className="form-header">
            <h2>ช่องทางติดต่อ</h2>
            <p className="form-subtitle">ข้อมูลติดต่อ</p>
          </div>

          <div className="form-content">
            {errors.contact && (
              <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444' }}>
                {errors.contact}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="contactLine">ไลน์ (Line ID)</label>
              <input
                type="text"
                id="contactLine"
                name="contactLine"
                value={formData.contactLine}
                onChange={handleInputChange}
                placeholder="เช่น @username หรือ username"
                className={errors.contactLine ? 'error' : ''}
              />
              {errors.contactLine && <span className="error-message">{errors.contactLine}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="เช่น 0812345678"
                className={errors.contactPhone ? 'error' : ''}
              />
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">อีเมล</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="เช่น example@email.com"
                className={errors.contactEmail ? 'error' : ''}
              />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
            </div>

            <div className="form-tip">
              <strong>หมายเหตุ:</strong> กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง เพื่อให้ผู้สนใจสามารถติดต่อคุณได้
            </div>

            {/* Navigation */}
            <div className="form-navigation">
              <button
                type="button"
                className="btn-nav btn-nav-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ChevronLeft size={20} />
                ย้อนกลับ
              </button>
              <button
                type="button"
                className="btn-nav btn-nav-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                ไปที่สรุป
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout>
      <div className="create-listing-page">
        <div className="create-listing-container">
          <div className="listing-nav-sidebar">
            <div className="nav-header">
              <h2>{isEditMode ? 'แก้ไขประกาศ' : 'เพิ่มประกาศ'}</h2>
              <span className="step-indicator">Step {currentStep}/5</span>
            </div>
            <nav className="steps-nav">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`step-item ${currentStep === step.number ? 'active' : ''}`}
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-subtitle">{step.subtitle}</div>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="listing-form-section">
            <form onSubmit={handleSubmit} className="listing-form">
              {renderStepContent()}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;

