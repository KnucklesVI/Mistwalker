#!/usr/bin/env python3
"""Dev server with no-cache headers for ES modules."""
import http.server
import os
import sys
import signal

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress request logging to avoid broken pipe on closed stdout
        pass

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            pass

server = http.server.HTTPServer(('', 8000), NoCacheHandler)
print('Serving Mistwalker at http://localhost:8000 (no-cache)', flush=True)

# Ignore broken pipe signals
signal.signal(signal.SIGPIPE, signal.SIG_DFL)

try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
