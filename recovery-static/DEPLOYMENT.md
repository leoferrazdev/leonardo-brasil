# Estado da publicação em 13/11/2026

- Domínio principal `leonardobrasil.com.br` publicado na Hostinger como site estático; publicação Git da aplicação anterior removida.
- Subdomínio de teste `brasa.leonardobrasil.com.br` removido; o registro DNS `brasa` não foi encontrado após a remoção.
- `public_html` contém somente `.htaccess`, `index.html`, `styles.css`, `robots.txt`, `sitemap.xml` e `assets/leonardo.jpg`, conforme a listagem da Hostinger após o deploy.
- Hostinger informou SSL ativo, redirecionamento HTTPS habilitado e CDN habilitada. Nenhum banco está atribuído ao domínio e nenhum cron job da conta foi listado antes da substituição.
- Verificação HTTP pública: `/` 200; `/force/`, `/force/index.php/retomada` e `/force/index.php/x?spam=1` 410; `/test.php` e `/.htaccess` 403; `robots.txt`, `sitemap.xml`, `styles.css` e a foto 200; HTTP redireciona para HTTPS.
- A resposta 410 para `/force/index.php/retomada` também foi confirmada com User-Agent Googlebot. A inspeção ao vivo do Search Console, porém, apresentou “Not found (404)” para essa URL. No índice, a URL consta como desconhecida e não indexada; há uma divergência entre o teste ao vivo do Search Console e a resposta HTTP observada diretamente.
- Sitemap publicado contém apenas `https://leonardobrasil.com.br/`, com `<lastmod>2026-11-12</lastmod>`. Reenviado ao Search Console em 13/11/2026: status `Success`, uma página descoberta e última leitura em 13/11/2026.
- Inspeção da página inicial no Search Console: “URL is on Google” e “Page is indexed”. Foi solicitada nova indexação; a interface confirmou que a URL entrou na fila prioritária de rastreamento.
- Search Console: sem problemas de segurança detectados e sem ações manuais. O relatório de indexação exibido estava atualizado em 08/11/2026 (antes da publicação): 1,24 mil indexadas e 151 não indexadas em 6 motivos.
- Removidas todas as 27 submissões antigas de sitemap no Search Console. A lista agora contém somente `https://leonardobrasil.com.br/sitemap.xml`, com status `Success` e uma página descoberta.
- Registro TXT de verificação do Google restaurado após a recriação, sem remover SPF nem MX; a resolução DNS pública confirmou o TXT.
- `disavow.txt` não foi enviado: não há domínios auditados nele; enviar o modelo vazio poderia substituir uma lista existente.

## Revisão QA em 13/11/2026

- `robots.txt` foi ajustado no workspace para incluir `Disallow: /force/` e `Disallow: /*?*`, conforme o checklist. A implantação dessa versão ficou pendente: o File Manager da Hostinger exibiu “You don't have permissions to access this” ao abrir `public_html`; não foram alteradas permissões para contornar o bloqueio. Essas diretivas também impedem o rastreamento das URLs `/force/` enquanto estiverem ativas.
- `sanitize-public-html.sh` agora aceita opcionalmente o nome explícito do banco e chama `drop-old-database.sh`, com uma confirmação independente antes do `DROP DATABASE`.
- Os três scripts Bash passaram em `bash -n`; `sitemap.xml` foi parseado como XML; verificações estáticas confirmaram HTTPS/410/índices bloqueados, CTA `nofollow`, permissões rsync e comandos Certbot documentados.
