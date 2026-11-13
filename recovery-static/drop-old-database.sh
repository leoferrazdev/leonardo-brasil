#!/usr/bin/env bash
set -Eeuo pipefail

# Uso: bash drop-old-database.sh NOME_EXATO_DO_BANCO
# O cliente mysql usa credenciais configuradas fora deste arquivo.
if [[ $# -ne 1 || ! $1 =~ ^[A-Za-z0-9_]+$ ]]; then
  echo 'Informe o nome exato do banco (somente letras, numeros e _).' >&2
  exit 2
fi
db_name=$1
printf 'DROP DATABASE IRREVERSIVEL: %s\n' "$db_name"
printf 'Digite DROP %s para confirmar: ' "$db_name"
IFS= read -r confirmation
[[ $confirmation == "DROP $db_name" ]] || { echo 'Cancelado.' >&2; exit 2; }
mysql --execute="DROP DATABASE \`$db_name\`;"
