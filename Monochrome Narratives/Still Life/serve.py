"""Combined static file server + POST /save/<filename> for screenshots."""
import base64, os
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
SHOT_DIR = os.path.join(ROOT, 'screenshots')

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_POST(self):
        if self.path.startswith('/save/'):
            name = self.path[6:]  # strip /save/
            length = int(self.headers['Content-Length'])
            b64 = self.rfile.read(length)
            os.makedirs(SHOT_DIR, exist_ok=True)
            out = os.path.join(SHOT_DIR, name)
            with open(out, 'wb') as f:
                f.write(base64.b64decode(b64))
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'saved: ' + name.encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, *a): pass

if __name__ == '__main__':
    s = HTTPServer(('127.0.0.1', 8092), Handler)
    print(f'Serving {ROOT} on :8092 (static + POST /save/)', flush=True)
    s.serve_forever()
