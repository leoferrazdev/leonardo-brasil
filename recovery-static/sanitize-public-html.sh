#!/usr/bin/env bash
set -Eeuo pipefail

# Uso: bash sanitize-public-html.sh /home/USUARIO/public_html --execute [NOME_EXATO_DO_BANCO]
# Execute de fora de public_html. O pacote deve conter index.html, styles.css,
# .htaccess e assets/leonardo.jpg.

if [[ ( $# -ne 2 && $# -ne 3 ) || ${2:-} != --execute ]]; then
  printf 'Uso: bash %s /home/USUARIO/public_html --execute [NOME_EXATO_DO_BANCO]\n' "$0" >&2
  exit 2
fi

source_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
target_input=${1%/}
[[ -d $target_input && ! -L $target_input ]] || { echo 'Diretorio ausente ou link simbolico.' >&2; exit 2; }
target=$(cd -- "$target_input" && pwd -P)
[[ ${target##*/} == public_html && $target != /public_html ]] || { echo 'Alvo deve ser o public_html de uma conta.' >&2; exit 2; }
[[ $source_dir != "$target" && $source_dir != "$target/"* ]] || { echo 'Pacote de origem deve ficar fora do public_html.' >&2; exit 2; }
if [[ $# -eq 3 ]]; then
  [[ $3 =~ ^[A-Za-z0-9_]+$ ]] || { echo 'Nome do banco invalido.' >&2; exit 2; }
  [[ -f $source_dir/drop-old-database.sh && ! -L $source_dir/drop-old-database.sh ]] || { echo 'Script de remocao de banco ausente.' >&2; exit 2; }
fi
for file in index.html styles.css .htaccess robots.txt sitemap.xml assets/leonardo.jpg; do
  [[ -f $source_dir/$file && ! -L $source_dir/$file ]] || { echo "Arquivo de origem ausente: $file" >&2; exit 2; }
done

printf 'ALVO QUE SERA APAGADO: %s\n' "$target"
printf 'Digite o caminho absoluto acima para confirmar: '
IFS= read -r confirmation
[[ $confirmation == "$target" ]] || { echo 'Confirmacao divergente; nenhuma exclusao realizada.' >&2; exit 2; }

stage=$(mktemp -d -- "${target%/*}/.static-recovery.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT
install -m 0644 "$source_dir/index.html" "$stage/index.html"
# Remove o CDN de desenvolvimento: a versao publicada usa CSS Tailwind compilado.
sed -i '/<script src="https:\/\/cdn.tailwindcss.com"><\/script>/d' "$stage/index.html"
install -m 0644 "$source_dir/styles.css" "$stage/styles.css"
install -m 0644 "$source_dir/.htaccess" "$stage/.htaccess"
install -m 0644 "$source_dir/robots.txt" "$stage/robots.txt"
install -m 0644 "$source_dir/sitemap.xml" "$stage/sitemap.xml"
install -d -m 0755 "$stage/assets"
install -m 0644 "$source_dir/assets/leonardo.jpg" "$stage/assets/leonardo.jpg"

# Nao seguir symlinks nem atravessar pontos de montagem internos ao document root.
if command -v findmnt >/dev/null 2>&1 && findmnt -rn -o TARGET | grep -Fqx -- "$target"; then
  echo 'O proprio public_html e um ponto de montagem; revise manualmente.' >&2
  exit 2
fi
if command -v findmnt >/dev/null 2>&1 && findmnt -rn -o TARGET | grep -F -- "$target/" >/dev/null; then
  echo 'Ha ponto de montagem dentro do public_html; revise manualmente.' >&2
  exit 2
fi

if [[ $# -eq 3 ]]; then
  bash "$source_dir/drop-old-database.sh" "$3"
fi

find "$target" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a -- "$stage/." "$target/"
printf 'Publicacao estatica instalada em %s\n' "$target"
