from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST, PORT = "127.0.0.1", 8000

if __name__ == "__main__":
    print(f"CineOps Agent running at http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler).serve_forever()
