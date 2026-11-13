#!/usr/bin/env bash
set -Eeuo pipefail

# Preencha estas tres variaveis e execute: bash deploy-rsync.sh --execute
USER="PREENCHER_USUARIO"
HOST="PREENCHER_HOST"
DIRETORIO_DESTINO="/home/PREENCHER_USUARIO/public_html"

if [[ $# -ne 1 || $1 != --execute ]]; then
  echo 'Uso: bash deploy-rsync.sh --execute' >&2
  exit 2
fi
[[ $USER != PREENCHER_USUARIO && $HOST != PREENCHER_HOST ]] || { echo 'Preencha USER e HOST.' >&2; exit 2; }
[[ $USER =~ ^[A-Za-z0-9_-]+$ && $HOST =~ ^[A-Za-z0-9.-]+$ ]] || { echo 'USER ou HOST invalido.' >&2; exit 2; }
[[ $DIRETORIO_DESTINO =~ ^/home/[A-Za-z0-9_./-]+/public_html$ && $DIRETORIO_DESTINO != *..* ]] || { echo 'DIRETORIO_DESTINO invalido.' >&2; exit 2; }
for binary in rsync ssh sed mktemp; do
  command -v "$binary" >/dev/null 2>&1 || { echo "Comando ausente: $binary" >&2; exit 2; }
done

source_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
for file in index.html styles.css .htaccess robots.txt sitemap.xml assets/leonardo.jpg; do
  [[ -f $source_dir/$file ]] || { echo "Arquivo ausente: $file" >&2; exit 2; }
done

# Confirma que o alvo remoto existe e nao e um link simbolico.
ssh -o BatchMode=yes -- "$USER@$HOST" "test -d '$DIRETORIO_DESTINO' && test ! -L '$DIRETORIO_DESTINO'"
printf 'DESTINO: %s@%s:%s\n' "$USER" "$HOST" "$DIRETORIO_DESTINO"
printf 'Digite o caminho remoto acima para confirmar a sincronizacao com exclusao: '
IFS= read -r confirmation
[[ $confirmation == "$DIRETORIO_DESTINO" ]] || { echo 'Cancelado.' >&2; exit 2; }

stage=$(mktemp -d)
trap 'rm -rf -- "$stage"' EXIT
install -m 0644 "$source_dir/index.html" "$stage/index.html"
# O CDN Tailwind e apenas para previa local. O destino usa CSS compilado.
sed -i '/<script src="https:\/\/cdn.tailwindcss.com"><\/script>/d' "$stage/index.html"
for file in styles.css .htaccess robots.txt sitemap.xml; do
  install -m 0644 "$source_dir/$file" "$stage/$file"
done
install -d -m 0755 "$stage/assets"
install -m 0644 "$source_dir/assets/leonardo.jpg" "$stage/assets/leonardo.jpg"

# O stage contem apenas a lista permitida. --delete remove residuos antigos.
rsync -av --delete --chmod=D755,F644 -e 'ssh -o BatchMode=yes' -- "$stage/" "$USER@$HOST:$DIRETORIO_DESTINO/"

ssh -o BatchMode=yes -- "$USER@$HOST" "test -f '$DIRETORIO_DESTINO/index.html' && test -f '$DIRETORIO_DESTINO/.htaccess' && test -f '$DIRETORIO_DESTINO/robots.txt' && test -f '$DIRETORIO_DESTINO/sitemap.xml'"
echo 'Arquivos sincronizados; valide as respostas HTTP publicas.'
