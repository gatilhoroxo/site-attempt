# Guia de Verificação da Migração

Este guia lista todos os arquivos modificados durante a reorganização e comandos 
para validar que a migração foi bem-sucedida.

## Arquivos Modificados

### Configuração (2 arquivos)
- [x] `_config.yml` - Atualizado com novos diretórios
- [x] `.gitignore` - Mantido (não necessitou mudanças)

### Dados (1 arquivo)
- [x] `src/_data/repositories.yml` - Paths mantêm URLs públicas

### Workflows (3 arquivos)
- [x] `.github/workflows/sync-mc-journey-docs.yml` - Path atualizado
- [x] `.github/scripts/process_docs.py` - target_dir atualizado
- [x] `.github/scripts/update_repositories_metadata.py` - data_file path atualizado

### Diretórios Movidos
- [x] `_layouts/` → `src/_layouts/`
- [x] `_includes/` → `src/_includes/`
- [x] `_sass/` → `src/_sass/`
- [x] `_data/` → `src/_data/`
- [x] `assets/` → `src/assets/` (+ symlink na raiz)
- [x] `gatilhos/` → `content/gatilhos/`
- [x] `posts/` → `content/posts/`
- [x] `projects/` → `content/projects/`

### Documentação Criada
- [x] `LICENSE` (91 linhas)
- [x] `README.md` (210 linhas)
- [x] `CODE_OF_CONDUCT.md` (153 linhas)
- [x] `CONTRIBUTING.md` (270 linhas)
- [x] `SECURITY.md` (267 linhas)
- [x] `docs/ARCHITECTURE.md` (273 linhas)
- [x] `docs/CONVENTIONS.md` (280 linhas)
- [x] Guias em `docs/getting-started/` (3 arquivos)
- [x] Guias em `docs/guides/` (3 arquivos)

## Comandos de Verificação

### 1. Verificar URLs Públicas Mantidas

```bash
# Gatilhos devem estar em /gatilhos/ (sem /content/)
grep -r "'/gatilhos/'" content/ | head -5

# Posts devem estar em /posts/
grep -r "'/posts/'" content/ | head -5

# Verificar _site gerado
ls _site/gatilhos/ _site/posts/ _site/projects/
```

### 2. Verificar Assets

```bash
# Symlink correto
ls -la assets

# Assets copiados para _site
find _site/assets -type f | head -10

# CSS compilado
ls -la _site/assets/css/style.css
```

### 3. Verificar Build

```bash
# Build sem erros
make test-build

# Servidor funciona
make dev
# Acessar: http://localhost:4000/site-attempt/
```

### 4. Verificar Paths em Includes

```bash
# Includes não devem referenciar paths antigos
grep -r "_layouts\|_includes\|_sass" src/_includes/ | grep -v "src/"

# Data files acessíveis
grep -r "site.data" src/_includes/ | head -5
```

### 5. Verificar SCSS

```bash
# Utilitários importados
grep "utilities" src/_sass/_components.scss

# CSS gerado inclui utilities
grep "\.m-1\|\.text-center" _site/assets/css/style.css
```

## Resultados Esperados

### Build
- ✅ Sem erros de compilação
- ✅ 50+ páginas HTML geradas
- ✅ CSS compilado (~30KB)
- ✅ Assets copiados (imagens, JSON)

### URLs
- ✅ `/gatilhos/` funciona (não `/content/gatilhos/`)
- ✅ `/posts/` funciona
- ✅ `/projects/` funciona
- ✅ Assets em `/assets/` funcionam

### Navegação
- ✅ Menu principal funciona
- ✅ Sidebar carrega
- ✅ Breadcrumb aparece
- ✅ Busca funciona

### Temas
- ✅ Toggle claro/escuro funciona
- ✅ Controle de fonte funciona
- ✅ Preferências persistem (localStorage)

## Checklist Final

- [ ] `make test-build` passa
- [ ] Site acessível em localhost:4000
- [ ] Navegação funciona (menu, sidebar, breadcrumb)
- [ ] Tema toggle funciona
- [ ] Assets carregam (CSS, imagens)
- [ ] Links internos funcionam
- [ ] Busca retorna resultados
- [ ] Documentação completa e dentro dos limites
