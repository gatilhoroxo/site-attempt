---
title: Guia de Resolução de Problemas
---

# Guia de Resolução de Problemas

## Erros de Build

### "Liquid Exception: Could not locate the included file"
**Causa**: Include não encontrado  
**Solução**:
```bash
# Verificar se arquivo existe
ls src/_includes/nome-do-arquivo.html

# Verificar configuração
grep includes_dir _config.yml
```

### "SCSS Syntax Error"
**Causa**: Erro de sintaxe em SCSS  
**Solução**:
```bash
# Ver erro completo
bundle exec jekyll build --trace

# Verificar arquivo mencionado
# Procurar por: chaves não fechadas, ponto-e-vírgula faltando
```

### "GitHub Metadata: No GitHub API authentication"
**Causa**: Aviso inofensivo, não é erro  
**Solução**: Ignorar ou configurar token (opcional)

## Erros de Dependências

### "Gem::LoadError"
**Solução**:
```bash
bundle update
bundle install
```

### "Can't find gem bundler"
**Solução**:
```bash
gem install bundler
bundle install
```

## Problemas de Paths

### CSS não carrega
**Verificar**:
```bash
# Assets devem existir
ls -la _site/assets/css/

# Symlink correto
ls -la assets

# Se não existir
ln -s src/assets assets
```

### Links quebrados
**Verificar**:
```bash
# Testar links
make test-links

# Ou manualmente
bundle exec htmlproofer ./_site --disable-external
```

## Performance

### Build muito lento
**Soluções**:
```bash
# Build incremental
bundle exec jekyll serve --incremental

# Excluir diretórios grandes
# Adicionar em _config.yml:
exclude:
  - node_modules/
  - vendor/
```

## Problemas de Port a

### "Address already in use - bind(2)"
**Solução**:
```bash
# Usar outra porta
bundle exec jekyll serve --port 4001

# Ou matar processo
lsof -i :4000
kill -9 PID
```
