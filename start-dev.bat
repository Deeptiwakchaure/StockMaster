@echo off
echo Starting StockMaster Development Environment...
echo.

echo Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB service found. Starting...
    net start MongoDB
) else (
    echo WARNING: MongoDB service not found!
    echo Please ensure MongoDB is running manually or install it as a service.
    echo.
)

echo.
echo Starting Backend Server...
start "StockMaster Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Client...
start "StockMaster Client" cmd /k "cd client && npm start"

echo.
echo StockMaster is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul
