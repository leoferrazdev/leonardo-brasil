"""Upload de um ZIP estático pelo endpoint TUS temporário da Hostinger.

Recebe uma linha JSON em stdin com url, auth_key, rest_auth_key e file_path.
Não imprime nem grava credenciais. Uso interno do deploy assistido.
"""

import json
import os
import subprocess
import sys
import urllib.parse


def main() -> None:
    config = json.loads(sys.stdin.readline())
    file_path = config["file_path"]
    size = os.path.getsize(file_path)
    name = urllib.parse.quote(os.path.basename(file_path))
    endpoint = f"{config['url'].rstrip('/')}/{name}?override=true"
    auth_headers = [
        "-H", f"X-Auth: {config['auth_key']}",
        "-H", f"X-Auth-Rest: {config['rest_auth_key']}",
        "-H", "Tus-Resumable: 1.0.0",
    ]
    common = ["curl.exe", "--silent", "--show-error", "--max-time", "60"]
    create = subprocess.run(
        common + ["-X", "POST", endpoint, *auth_headers,
                  "-H", f"Upload-Length: {size}", "-H", "Upload-Offset: 0",
                  "-o", "NUL", "-w", "%{http_code}"],
        capture_output=True, text=True, check=True,
    )
    if create.stdout.strip() != "201":
        raise RuntimeError(f"TUS POST retornou {create.stdout.strip()}")
    upload = subprocess.run(
        common + ["-X", "PATCH", endpoint, *auth_headers,
                  "-H", "Content-Type: application/offset+octet-stream",
                  "-H", "Upload-Offset: 0", "--data-binary", f"@{file_path}",
                  "-D", "-", "-o", "NUL"],
        capture_output=True, text=True, check=True,
    )
    headers = upload.stdout.lower()
    if " 204 " not in headers or f"upload-offset: {size}" not in headers:
        raise RuntimeError("TUS PATCH nao confirmou upload completo")
    print(f"Upload concluido: {name}, {size} bytes")


if __name__ == "__main__":
    main()
