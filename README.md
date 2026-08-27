# PROPYLAX GEL — Landing Page

صفحة هبوط تسويقية وطبية تفاعلية لمنتج **PROPYLAX GEL (100GM)**، تم بناؤها باستخدام Pure HTML5 / CSS3 / Vanilla JavaScript بدون أي مكتبات أو أطر عمل خارجية لضمان أعلى سرعة تحميل وأداء سلس على جميع الأجهزة والمتصفحات.

---

## 📁 هيكل المشروع (Project Structure)

```text
├── index.html                  # ملف الواجهة الرئيسي (HTML5 RTL Semantic)
├── assets/
│   ├── css/
│   │   └── style.css           # ملف التنسيقات ونظام التصميم (CSS Variables & Responsive Rules)
│   ├── js/
│   │   └── main.js             # المنطق البرمجي، السلايدر، والتحقق من النماذج
│   └── images/                 # الصور ورندرات المنتج بصيغ WebP و PNG/JPG
└── README.md                   # التوثيق الفني للمشروع
```

---

## ⚙️ المواصفات التقنية (Technical Specifications)

- **Vanilla Stack**: مبني بنسبة 100% بدون تبعيات (Zero Dependencies - No Node.js / No Frameworks).
- **RTL-First Design**: دعم أصيل للغة العربية واتجاه اليمين لليسار باستخدام خطوط `IBM Plex Sans Arabic` و `Cairo`.
- **Mobile Optimized**: متجاوب بالكامل مع كافة الشاشات (Desktop, Tablet, Mobile) مع دعم إيماءات اللمس والسحب (Touch Swipe).
- **Egyptian Carrier Detection**: كشف فوري لشبكات المحمول المصرية (Vodafone, Etisalat, Orange, WE) بناءً على بادئة الرقم مع تحقق فوري وصارم من صحة الرقم (11 رقماً).
- **Asset Optimization**: دعم صيغ `WebP` الحديثة مع Fallback لصيغ `JPG/PNG` مع تحميل كسول (Lazy Loading) للوسائط غير المرئية في البداية لتعزيز درجات Google Lighthouse.

---

## 🛠️ دليل التخصيص والربط البرمجي (Integration & Customization Guide)

### 1. تعديل بيانات المنتج والأسعار
يمكن تعديل أسعار المنتج والخصومات مباشرة عبر كائن الإعدادات في ملف `assets/js/main.js`:

```javascript
const CONFIG = {
  countdownMinutes: 25, // مدة المؤقت التنازلي بالدقائق

  product: {
    name: 'دهان PROPYLAX GEL (عبوة 100GM)',
    qtyLabel: 'عبوة واحدة (100GM)',
    currentPrice: 420,  // السعر الحالي بعد الخصم
    oldPrice: 560,      // السعر الأصلي قبل الخصم
    savings: 140,       // قيمة التوفير
    discountPercent: '25%'
  }
};
```

### 2. ربط نموذج الطلب بالسيرفر أو الـ CRM (Backend / API / Webhook)
نموذج الطلب موجود في `index.html` داخل عنصر `<form id="directOrderForm">`، ويتم التعامل مع حدث الإرسال داخل دالة `initOrderForm()` في `assets/js/main.js`.

للربط مع سيرفر خارجي أو Webhook أو Google Sheets، يمكن استبدال محاكاة الإرسال بطلب `fetch` مباشر كالتالي:

```javascript
// مثال للربط مع API خارجي:
const formData = {
  name: nameVal,
  phone: phoneVal,
  package: 1,
  orderId: orderId,
  createdAt: new Date().toISOString()
};

fetch('https://your-api-endpoint.com/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  // إظهار شاشة النجاح
  formView.style.display = 'none';
  successView.style.display = 'block';
  fireConfetti();
})
.catch(error => {
  console.error('Submission Error:', error);
  alert('حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.');
  submitBtn.disabled = false;
  btnSpinner.style.display = 'none';
  btnText.textContent = 'تأكيد الطلب الآن 📦';
});
```

---

## 🚀 النشر والتشغيل (Deployment)

المشروع جاهز للنشر المباشر (Static Site):
1. **استضافة تقليدية (cPanel / Shared Hosting / VPS)**: رفع كامل مجلدات المشروع إلى المسار الرئيسي `public_html`.
2. **استضافة سحابية ثابتة (Vercel / Netlify / Cloudflare Pages / GitHub Pages)**: رفع المشروع مباشرة دون الحاجة لأي Build Commands.

---

## 🌐 التوافق مع المتصفحات (Browser Compatibility)

- Chrome / Edge / Chromium (النسخ الحديثة)
- Safari (iOS & macOS)
- Firefox
- Samsung Internet & Mobile Browsers
