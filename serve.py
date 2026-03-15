#!/usr/bin/env python3
"""
APEX.AI — Local Dev Server
Run: python serve.py
Then open http://localhost:8080
"""
import http.server, webbrowser, threading, sys, os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress noisy request logs

def open_browser():
    import time; time.sleep(0.4)
    webbrowser.open(f"http://localhost:{PORT}")

if __name__ == "__main__":
    server = http.server.HTTPServer(("", PORT), Handler)
    print(f"""
╔══════════════════════════════════════════╗
║          APEX.AI — Resume Builder        ║
╠══════════════════════════════════════════╣
║  Running at: http://localhost:{PORT}        ║
║  Press Ctrl+C to stop                   ║
╚══════════════════════════════════════════╝

Demo accounts:
  demo     / demo
  admin    / apex2024
  wrench   / resume123
""")
    threading.Thread(target=open_browser, daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped.")
        sys.exit(0)
