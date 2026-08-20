@echo off
cd /d %~dp0
py -3 -m http.server 4174 -d preview
