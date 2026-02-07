# Convenções de Código

## Front Matter
- Sempre incluir `layout` e `title`
- Usar `description` em páginas índice
- Ordem: layout, title, description, permalink

```md
# Para posts
---
layout: post
title: "Título"
date: YYYY-MM-DD
---

# Para pastas
---
layout: pasta
title: "Nome da Pasta"
description: "Breve descrição"
---
```

## SCSS
- Usar variáveis de `_variables.scss`
- Preferir mixins para código repetido
- Comentar seções complexas
