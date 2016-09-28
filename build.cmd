@echo off
cd %~dp0

echo Building pages
call npm run build

echo Launching site
explorer index.html
