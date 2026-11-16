"""Serve only prototype/ on the local network, with automatic page reload."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import hashlib
import os

ROOT = Path(__file__).resolve().parents[1] / 'prototype'
PORT = int(os.environ.get('PREVIEW_PORT', '5500'))
RELOAD = b'''<script>
let previewVersion;
setInterval(async () => {
  try {
    const response = await fetch('/__preview_version', {cache: 'no-store'});
    if (!response.ok) return;
    const next = await response.text();
    if (previewVersion !== undefined && previewVersion !== next) location.reload();
    previewVersion = next;
  } catch (_) {}
}, 1000);
</script>'''

class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.split('?')[0] == '/__preview_version':
            entries = []
            for path in sorted(ROOT.rglob('*')):
                if path.is_file():
                    stat = path.stat()
                    entries.append(f'{path.relative_to(ROOT)}:{stat.st_mtime_ns}:{stat.st_size}')
            payload = hashlib.sha256('\n'.join(entries).encode()).hexdigest().encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / 'index.html'
        if path.is_file() and path.suffix == '.html':
            payload = path.read_bytes() + RELOAD
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def log_message(self, format, *args):
        if self.path != '/__preview_version':
            super().log_message(format, *args)

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), partial(PreviewHandler, directory=str(ROOT)))
    print(f'Preview ready: http://localhost:{PORT} — Ctrl+C to stop', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
