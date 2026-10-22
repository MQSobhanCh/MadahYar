# مداح‌یار (MaddahYar)

اپلیکیشن مدیریت نوحه، شعر و روضه برای مداحان — React + Vite + Tailwind v4 + Capacitor.

## ساختار

- `src/` — کد برنامه
- `android-res/` و `native-splash/` — آیکون و صفحه‌ی لودینگ اندروید (workflow موقع ساخت کپی‌شان می‌کند)
- `.github/workflows/build-apk.yml` — ساخت خودکار APK در GitHub Actions
- `src/config/app.js` — اطلاعات تماس و لینک فروشگاه‌ها

## اجرا روی وب

```bash
npm install
npm run dev
```

## ساخت APK

با هر push به شاخه‌ی main، workflow در GitHub اجرا می‌شود و APK را در بخش Artifacts می‌گذارد.
برای نسخه‌ی release امضاشده، چهار Secret لازم است: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.

## قالب‌بندی کد

```bash
npm install
npm run format
```
