# Pacote de recuperação estática

Este pacote é independente do site React atual. Não execute os scripts antes de identificar o document root e o banco **exclusivos** de `leonardobrasil.com.br`; o `README.md` da raiz também registra uma API e o Brasa associados ao domínio. A limpeza os removerá do `public_html` escolhido. Faça backup fora do document root e preserve evidências do incidente antes da exclusão.

## Preparação local

O projeto já possui Tailwind CSS 3 no `package.json`. Gere o CSS estático sem instalar outra dependência:

```bash
./node_modules/.bin/tailwindcss -i recovery-static/tailwind.input.css -o recovery-static/styles.css --content recovery-static/index.html --minify
cp public/leonardo.jpg recovery-static/assets/leonardo.jpg
```

O `index.html` contém o CDN solicitado para pré-visualização. O script de implantação retira o script do CDN; o site publicado usa somente `styles.css` compilado. O CDN Play do Tailwind não é recomendado para produção.

## Limpeza e implantação no servidor

Copie o pacote **para fora** de `public_html`, incluindo `.htaccess` e o CSS gerado. Verifique o destino com o painel da hospedagem. Então:

```bash
bash recovery-static/sanitize-public-html.sh /home/USUARIO/public_html --execute
```

O script exige confirmação digitada e substitui todo o conteúdo do document root pelos arquivos estáticos `index.html`, `styles.css`, `.htaccess`, `robots.txt`, `sitemap.xml` e `assets/leonardo.jpg`. Não rode o build ou o deploy automático anterior depois disso sem reconfigurá-lo, pois ele pode republicar a aplicação antiga.

Se o banco comprometido exclusivo também foi identificado e deve ser apagado na mesma operação, passe seu nome exato como terceiro argumento. O script pede uma segunda confirmação e executa `drop-old-database.sh` antes de limpar o document root:

```bash
bash recovery-static/sanitize-public-html.sh /home/USUARIO/public_html --execute NOME_EXATO_DO_BANCO
```

## Banco antigo

Identifique o banco comprometido no painel ou em configuração preservada fora do document root. Depois de garantir que não atende outro serviço e fazer backup:

```bash
bash recovery-static/drop-old-database.sh NOME_EXATO_DO_BANCO
```

Equivalente SQL: `DROP DATABASE \`NOME_EXATO_DO_BANCO\`;`. O script usa as credenciais do cliente `mysql` já configuradas no servidor; não armazene senha neste pacote. A exclusão do banco, por si só, não elimina backdoors em usuários, credenciais, tarefas agendadas ou outros diretórios da conta.

## Verificação após implantação

```bash
curl -sSI https://leonardobrasil.com.br/force/index.php/teste | head -n 1
curl -sSI https://leonardobrasil.com.br/ | head -n 1
curl -sSI http://leonardobrasil.com.br/ | head -n 1
```

Espere `410`, `200` e `301`, respectivamente. Confira também uma amostra das URLs comprometidas no Search Console. `disavow.txt` é um modelo para upload manual na propriedade **URL-prefix** correta da ferramenta Rejeitar Links; ele não deve ser publicado no site. O exemplo de domínio está comentado e não rejeita ninguém até ser substituído por domínios auditados.

## Fase 2: rastreamento e sincronização

`robots.txt` libera o rastreamento em geral, mas bloqueia `/force/` e URLs com query string conforme o requisito de governança. Isso também impede o Googlebot de buscar URLs `/force/` para observar o HTTP 410 enquanto essas regras estiverem ativas. O sitemap de uma URL não apaga nem força a remoção das outras URLs do índice; `<priority>` é ignorado pelo Google. Atualize `<lastmod>` apenas quando a página realmente mudar.

Para sincronizar em um servidor com SSH e rsync, preencha `USER`, `HOST` e `DIRETORIO_DESTINO` em `deploy-rsync.sh`, confira que o destino é exclusivo deste site e execute:

```bash
bash recovery-static/deploy-rsync.sh --execute
```

O script copia apenas os seis arquivos/diretórios públicos listados acima, remove o CDN do HTML, aplica modos 644/755 e usa `--delete` para retirar resíduos do destino. `disavow.txt`, scripts e arquivos ocultos locais não entram na publicação. A confirmação digitada e a checagem SSH ocorrem antes da sincronização.

## SSL (somente servidor com sudo e Certbot instalado)

Escolha **um** comando conforme o servidor web que atende o domínio. O domínio deve apontar para o servidor e estar acessível na porta 80 para a validação HTTP usual:

```bash
# Apache
sudo certbot --apache -d leonardobrasil.com.br --redirect

# Nginx
sudo certbot --nginx -d leonardobrasil.com.br --redirect

# Teste da renovacao automatica
sudo certbot renew --dry-run
```

O `.htaccess` só funciona no Apache; em Nginx, implemente as regras equivalentes de 410, bloqueio de PHP e HTTPS na configuração do servidor. Em hospedagem cPanel compartilhada sem sudo, use o SSL/AutoSSL disponibilizado pelo provedor em vez de executar Certbot. Confira o certificado antes de ativar qualquer redirecionamento HTTPS.
