#!/usr/bin/env bash

# Double-clickable launcher script for macOS / Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/myslack-web"

echo "==================================================================="
echo "              MySlack Offline & Local Wi-Fi Launcher (Mac)"
echo "==================================================================="
echo ""

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "-------------------------------------------------------------------"
echo "  [Host Mac URL]:        http://localhost:5173"
echo "  [Other Wi-Fi Devices]: http://$LOCAL_IP:5173"
echo "-------------------------------------------------------------------"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing required packages..."
    npm install
fi

echo "Starting local web server..."
open "http://localhost:5173" 2>/dev/null || true
npm run dev -- --host 0.0.0.0
