@echo off
echo Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Users\%USERNAME%\AppData\Roaming\npm
echo Node.js added to PATH!
echo.
echo Starting the app...
cd /d "c:\Users\adib\Downloads\umar-media-master"
npm run dev
pause
