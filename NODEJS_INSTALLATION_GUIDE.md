# 🚀 Node.js Installation Guide

## 📥 **Node.js انسٹال کرنے کے طریقے**

### **Method 1: Official Website (Recommended)**
1. **Browser کھولیں**: https://nodejs.org
2. **LTS version ڈاؤن لوڈ کریں** (Long Term Support)
3. **Installer ڈاؤن لوڈ کریں** (Windows .msi file)
4. **Installer run کریں**
5. **Next, Next, Finish** پر کلک کریں
6. **Command Prompt restart کریں**

### **Method 2: Windows Terminal (Quick)**
```powershell
# Windows 11 کے لیے
winget install OpenJS.NodeJS.LTS

# یا Chocolatey استعمال کریں
choco install nodejs-lts
```

### **Method 3: PowerShell Script**
```powershell
# PowerShell میں یہ command run کریں
Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi" -OutFile "node-installer.msi"
Start-Process "node-installer.msi" -Wait
```

## ✅ **Verification**

انسٹال کے بعد verify کریں:
```powershell
node --version
npm --version
```

**Expected Output:**
```
v20.12.2
10.5.0
```

## 🚀 **App چلانے کے لیے**

جب Node.js انسٹال ہو جائے:
```powershell
# پروجیکٹ فولڈر میں جائیں
cd "c:\Users\adib\Downloads\umar-media-master"

# App چلائیں
npm run dev
```

## 📱 **Expected Result**

```
  VITE v5.4.10  ready in 323 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h to show help
```

## 🔗 **Login Details**

- **URL**: http://localhost:5173
- **Admin Login Code**: `345341`
- **Features**: All working

## 🛠️ **Troubleshooting**

### **Issue: "node is not recognized"**
**Solution**: 
1. Command Prompt close کریں اور دوبارہ کھولیں
2. PC restart کریں
3. Node.js دوبارہ انسٹال کریں

### **Issue: Permission Error**
**Solution**:
```powershell
# Administrator کے طور پر PowerShell run کریں
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue: Port Already in Use**
**Solution**:
```powershell
# Different port پر run کریں
npm run dev -- --port 3000
```

## 📊 **Node.js Version Requirements**

| Component | Minimum Version | Recommended |
|-----------|----------------|--------------|
| Node.js | 18.0.0 | 20.12.2 (LTS) |
| npm | 8.0.0 | 10.5.0 |
| pnpm | 7.0.0 | 8.15.0 |

## 🎯 **Quick Start Commands**

```powershell
# 1. Node.js انسٹال کریں
# 2. Verify کریں
node --version

# 3. پروجیکٹ فولڈر میں جائیں
cd "c:\Users\adib\Downloads\umar-media-master"

# 4. Dependencies انسٹال کریں (if needed)
npm install

# 5. App چلائیں
npm run dev

# 6. Browser میں کھولیں
# http://localhost:5173
# Login: 345341
```

## 📞 **Help**

اگر کوئی issue آئے:
1. **Node.js version check کریں**: `node --version`
2. **Path verify کریں**: `where node`
3. **Command Prompt restart کریں**
4. **PC restart کریں**

**Node.js انسٹال کرنے کے بعد آپ کا ایپ بغیر issues چل جائے گا!** 🎉

**Login Code**: `345341` 🔐
