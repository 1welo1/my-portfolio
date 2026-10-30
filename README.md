# Mohamed Waleed (WELO) - Portfolio

> Production-grade conversational AI systems & automated sales funnels portfolio.

## 🚀 النشر على منصة Vercel (Deployment Methods)

تم إعداد هذا المجلد بالكامل ليكون متوافقاً 100% مع منصة **Vercel** للاستضافة السحابية مع أفضل إعدادات الأمان (Security Headers) وسرعة التحميل والتخزين المؤقت (Caching Optimization).

---

### الطريقة الأولى: الرفع عبر GitHub (الأسهل والموصى بها 🌟)

1. قم بإنشاء مستودع جديد على حسابك في GitHub (مثلاً: `my-portfolio`).
2. افتح منفذ الأوامر (Terminal) في هذا المجلد ونفذ الأوامر التالية:
   ```bash
   git add .
   git commit -m "feat: prepare portfolio for production vercel deployment"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. توجه إلى موقع [Vercel](https://vercel.com) وسجّل الدخول.
4. اضغط على **"Add New..."** ثم **"Project"**.
5. اختر المستودع الخاص بك من GitHub واضغط **"Import"**.
6. اترك كل الإعدادات كما هي (تم ضبطها تلقائياً عبر `vercel.json` كـ Static Site).
7. اضغط **"Deploy"** وخلال ثوانٍ سيكون موقعك مباشراً على الإنترنت برابط سريع ومجاني!

---

### الطريقة الثانية: الرفع المباشر عبر Vercel CLI

يمكنك النشر مباشرة من جهازك دون الحاجة لـ GitHub:

```bash
# تسجيل الدخول والنشر المبدئي (Preview)
cmd.exe /c "npx vercel"

# النشر النهائي للإنتاج (Production)
cmd.exe /c "npx vercel --prod"
```

---

### الطريقة الثالثة: الرفع اليدوي (Drag & Drop)

1. ادخل على لوحة تحكم [Vercel Deploy](https://vercel.com/new).
2. اسحب مجلد المشروع وأفلته داخل الصفحة مباشرة.

---

## 📁 ملفات التهيئة المضافة لـ Vercel

| الملف | الوظيفة |
| :--- | :--- |
| `vercel.json` | تكوين Vercel الكامل، الروابط النظيفة (Clean URLs)، ترويسات الأمان (Security Headers) والتخزين المؤقت (Browser Caching) للملفات الثابتة. |
| `.vercelignore` | استبعاد الملفات التطورية والمسودات والأصول غير المستخدمة لتسريع الرفع وتقليل حجم الباقة. |
| `.gitignore` | استبعاد مخلفات النظام وملفات الإعدادات المؤقتة من تتبع Git. |
| `404.html` | صفحة خطأ مخصصة ومتناسقة بنفس الهوية البصرية عند كتابة رابط غير صحيح. |
| `robots.txt` | توجيه محركات البحث (Google / Bing) لأرشفة الموقع. |
| `sitemap.xml` | خريطة الموقع لمحركات البحث لتعزيز الـ SEO. |
| `package.json` | تعريف المشروع وأوامر التشغيل السريع (`npm start`). |

---

## 💻 التشغيل المحلي (Local Development)

لتجربة الموقع محلياً على جهازك:
- يمكنك تشغيل ملف `start.bat`
- أو تشغيل الأمر:
  ```bash
  cmd.exe /c "npx serve ."
  ```
  ثم فتح الرابط `http://localhost:3000`.

