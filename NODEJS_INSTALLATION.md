# 🚀 Node.js Installation Guide

## ❌ **Problem**
Node.js انسٹال نہیں ہے، اس لیے npm, pnpm, اور vite کام نہیں کر رہے۔

## 🔧 **Solution**

### **Method 1: Download from Official Website**
1. **Browser میں جائیں**: https://nodejs.org
2. **LTS version ڈاؤن لوڈ کریں** (Recommended)
3. **Installer run کریں**
4. **Next, Next, Finish** پر کلک کریں
5. **Command Prompt restart کریں**

### **Method 2: Using Chocolatey (Windows)**
```powershell
# Chocolatey انسٹال کریں (اگر نہیں ہے)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Node.js انسٹال کریں
choco install nodejs-lts
```

### **Method 3: Using Winget (Windows 11)**
```powershell
winget install OpenJS.NodeJS.LTS
```

## ✅ **Verification**

انسٹال کے بعد verify کریں:
```powershell
node --version
npm --version
```

## 🚀 **Run App**

جب Node.js انسٹال ہو جائے تو:
```powershell
cd "c:\Users\adib\Downloads\umar-media-master"
npm run dev
```

یا pnpm استعمال کریں:
```powershell
cd "c:\Users\adib\Downloads\umar-media-master"
pnpm dev
```

## 📦 **Project Dependencies**

آپ کے پروجیکٹ میں پہلے سے dependencies انسٹال ہیں:
- ✅ node_modules/ موجود ہے
- ✅ package.json موجود ہے
- ✅ pnpm-lock.yaml موجود ہے

## 🎯 **Expected Output**

جب ایپ چلے گا تو:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h to show help
```

## 🔗 **Login Details**

ایپ چلنے کے بعد:
- **URL**: http://localhost:5173
- **Admin Login**: Code `345341`
- **Database**: Real Supabase connection

## 📞 **Help**

اگر کوئی issue آئے:
1. Node.js version check کریں (18+ recommended)
2. Command Prompt restart کریں
3. Path verify کریں

**Node.js انسٹال کرنے کے بعد ایپ آسانی سے چل جائے گا!** 🎉
