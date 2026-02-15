# Documentação do Sistema de Testes

## Visão Geral

Este documento descreve o sistema completo de testes implementado para o projeto Jekyll. O sistema abrange 7 fases de testes automatizados com múltiplas tecnologias.

## Estrutura dos Testes

### 📁 Organização de Diretórios

```
tests/
├── .pa11yci.json
├── playwright.config.js
├── e2e/                          # Testes End-to-End (Playwright)
│   ├── fixtures/
│   ├── page-objects/
│   └── specs/
├── accessibility/                 # Testes de Acessibilidade
│   └── a11y-tests.spec.js
├── unit/
│   ├── js/                       # Testes Unitários JavaScript
│   │   ├── ThemeManager.test.js
│   │   ├── FontSizeManager.test.js
│   │   ├── SidebarStateManager.test.js
│   │   └── SearchEngine.test.js
│   ├── ruby/                     # Testes Unitários Ruby (RSpec)
│   │   └── spec/
│   └── python/                   # Testes Unitários Python (pytest)
│       ├── config/
│       │   ├── pytest.ini
│       │   └── requirements-dev.txt
│       └── tests
│           ├── test_update_repositories_metadata.py
│           └── test_process_docs.py
└── validation/                   # Validação de Build e HTML
    ├── validation_config.yml
    ├── build_validator.rb
    ├── frontmatter_validator.js
    ├── search_index_validator.js
    └── html_validator.py
```

## Fases de Teste Implementadas

### 🎭 Fase 1: Testes E2E (Playwright)

**Objetivo:** Validar a experiência completa do usuário no site.

**Tecnologias:**
- Playwright 1.40.0
- Multi-browser (Chrome, Firefox, Safari, Mobile)
- Page Object Model

**Cenários de Teste:**
- ✅ Navegação na sidebar
- ✅ Funcionalidade de busca
- ✅ Alternância de tema (claro/escuro)
- ✅ Controle de tamanho da fonte
- ✅ Navegação breadcrumb
- ✅ Layout de pasta (index pages)

**Comandos:**
```bash
make test-e2e           # Execução headless
make test-e2e-headed    # Com interface gráfica
make test-e2e-debug     # Com Playwright inspector
```

### ♿ Fase 2: Testes de Acessibilidade

**Objetivo:** Garantir conformidade com WCAG 2.1 e acessibilidade universal.

**Tecnologias:**
- axe-core (análise automática)
- pa11y (validação CLI)
- Playwright (integração)

**Verificações:**
- ✅ Estrutura semântica HTML
- ✅ Contraste de cores
- ✅ Textos alternativos em imagens
- ✅ Navegação por teclado
- ✅ Labels em formulários
- ✅ Padrões ARIA

**Comandos:**
```bash
make test-a11y          # Testes interativos
make test-a11y-auto     # Análise automática
```

### 🟨 Fase 3: Testes Unitários JavaScript

**Objetivo:** Validar módulos JavaScript extraídos dos arquivos HTML.

**Tecnologia:**
- Vitest (test runner)
- jsdom (ambiente DOM)
- c8 (cobertura de código)

**Módulos Testados:**
- ✅ **ThemeManager:** Alternância entre temas claro/escuro
- ✅ **FontSizeManager:** Controles de tamanho de fonte
- ✅ **SidebarStateManager:** Estado da sidebar (expandida/colapsada)
- ✅ **SearchEngine:** Funcionalidade de busca no site

**Comandos:**
```bash
make test-unit-js               # Execução básica
make test-unit-js-watch         # Modo watch (desenvolvimento)
make test-unit-js-coverage      # Com relatório de cobertura
```

### 💎 Fase 4: Testes Unitários Ruby (RSpec)

**Objetivo:** Testar plugins e funcionalidades Jekyll personalizadas.

**Tecnologia:**
- RSpec 3.12+
- Jekyll mocks
- Fixtures customizadas

**Componentes Testados:**
- ✅ **NavigationGenerator:** Plugin para geração automática de navegação
- ✅ Mock de Jekyll::Site
- ✅ Processamento de dados YAML
- ✅ Estrutura de navegação hierárquica

**Comandos:**
```bash
make test-unit-ruby             # Execução básica
make test-unit-ruby-verbose     # Com saída detalhada
```

### 🐍 Fase 5: Testes Unitários Python (pytest)

**Objetivo:** Validar scripts de automação do GitHub.

**Tecnologia:**
- pytest
- coverage.py (relatórios de cobertura)
- unittest.mock (mocking)

**Scripts Testados:**
- ✅ **process_docs.py:** Processamento de documentação e frontmatter
- ✅ **update_repositories_metadata.py:** Atualização de metadados de repositórios

**Comandos:**
```bash
make test-unit-python           # Execução básica
make test-unit-python-coverage  # Com relatório de cobertura
```

### 🏗️ Fase 6: Validação de Build e HTML

**Objetivo:** Garantir qualidade estrutural e conformidade do site gerado.

**Tecnologias:**
- Ruby (build_validator.rb)
- Node.js (frontmatter_validator.js, search_index_validator.js)
- Python (html_validator.py)
- BeautifulSoup4, html5lib

**Validações Implementadas:**

#### Build Validator (Ruby)
- ✅ Configuração Jekyll (_config.yml)
- ✅ Estrutura de diretórios
- ✅ Arquivos de layout obrigatórios
- ✅ Arquivos de dados (navigation.yml, repositories.yml)
- ✅ Sintaxe YAML

#### Frontmatter Validator (JavaScript)
- ✅ Presença de frontmatter obrigatório
- ✅ Campos obrigatórios por layout
- ✅ Formatos de data válidos
- ✅ Referências a layouts existentes
- ✅ Estrutura de tags e categorias

#### Search Index Validator (JavaScript)
- ✅ Estrutura JSON válida
- ✅ Campos obrigatórios (title, url, content)
- ✅ Cobertura de conteúdo
- ✅ Funcionalidade de busca JavaScript
- ✅ Tamanho e qualidade do conteúdo

#### HTML Validator (Python)
- ✅ Estrutura HTML5 válida
- ✅ Elementos semânticos
- ✅ Meta tags obrigatórias (title, description, viewport)
- ✅ Hierarquia de headings
- ✅ Links internos e externos
- ✅ Atributos alt em imagens
- ✅ Acessibilidade básica
- ✅ Performance (tamanho de arquivos)

**Comandos:**
```bash
make test-validation        # Validações estruturais
make test-validation-html   # Validação HTML completa
```

### 🚀 Fase 7: Automação e Relatórios

**Objetivo:** Automatizar execução de testes e gerar relatórios consolidados.

#### Scripts de Automação

**setup-tests.sh:**
- ✅ Verificação de dependências do sistema
- ✅ Instalação automática (Ruby, Node.js, Python)
- ✅ Instalação de browsers Playwright
- ✅ Testes de verificação inicial
- ✅ Criação de estrutura de relatórios

**coverage-report.sh:**
- ✅ Execução de todos os testes com cobertura
- ✅ Consolidação de métricas
- ✅ Relatório HTML unificado
- ✅ Resumo em texto
- ✅ Abertura automática no navegador

#### GitHub Actions (CI/CD)
- ✅ Pipeline de testes paralelos
- ✅ Matriz de ambientes
- ✅ Artefatos de build
- ✅ Relatórios de cobertura (Codecov)
- ✅ Cache inteligente de dependências

## Comandos Principais

### Comandos Rápidos (Desenvolvimento)
```bash
make test-fast          # JavaScript + Ruby + Python unitários
make serve              # Servidor Jekyll para testes
./scripts/setup-tests.sh # Configuração inicial completa
```

### Comandos Completos (CI/Produção)
```bash
make test-all           # Todos os testes (build + unit + e2e + a11y + validation)
make test-coverage      # Relatórios de cobertura (JS + Python)
./scripts/coverage-report.sh # Relatório consolidado HTML
```

### Comandos Específicos por Fase
```bash
# E2E
make test-e2e           # Playwright headless
make test-e2e-headed    # Playwright com UI
make test-e2e-debug     # Com inspector

# Acessibilidade  
make test-a11y          # axe-core + pa11y
make test-a11y-auto     # Automático

# Unit Tests
make test-unit-js       # JavaScript (Vitest)
make test-unit-ruby     # Ruby (RSpec)  
make test-unit-python   # Python (pytest)

# Validação
make test-validation    # Build + Frontmatter + Search
make test-validation-html # Validação HTML completa
```

## Métricas de Cobertura

### Metas Definidas
- **JavaScript:** ≥80% (módulos críticos de UI)
- **Python:** ≥85% (scripts de automação)  
- **Ruby:** ≥75% (plugins Jekyll)

### Relatórios Gerados
- **JavaScript:** `coverage/js/index.html`
- **Python:** `coverage/python/htmlcov/index.html`
- **Consolidado:** `reports/coverage/consolidated/coverage-report.html`

## Configurações e Dependências

### package.json
```json
{
  "scripts": {
    "test:e2e": "playwright test tests/e2e/",
    "test:e2e:headed": "playwright test tests/e2e/ --headed",
    "test:e2e:debug": "playwright test tests/e2e/ --debug",
    "test:a11y": "playwright test tests/accessibility/",
    "test:unit": "vitest run tests/unit/js/",
    "test:unit:watch": "vitest tests/unit/js/",
    "test:unit:coverage": "vitest run tests/unit/js/ --coverage"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@axe-core/playwright": "^4.8.2",
    "pa11y-ci": "^3.0.1",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "yaml": "^2.3.4"
  }
}
```

### Gemfile (Ruby)
```ruby
group :test do
  gem 'rspec', '~> 3.12'
  gem 'rspec-mocks', '~> 3.12'
  gem 'htmlproofer', '~> 5.0'
end
```

### requirements-dev.txt (Python)
```
pytest>=7.4.0
pytest-cov>=4.1.0
coverage>=7.3.0
html5lib>=1.1
beautifulsoup4>=4.12.0
requests>=2.31.0
lxml>=4.9.0
PyYAML>=6.0.1
```

## Troubleshooting

### Problemas Comuns

**1. Playwright browsers não instalados:**
```bash
npx playwright install --with-deps
```

**2. Dependências Python faltando:**
```bash
pip install -r tests/unit/python/requirements-dev.txt
```

**3. Jekyll não consegue fazer build:**
```bash
bundle install
bundle exec jekyll build --verbose
```

**4. Testes E2E falhando (servidor não rodando):**
```bash
make serve  # Em terminal separado
make test-e2e
```

**5. Permissões de script:**
```bash
chmod +x scripts/*.sh
```

## Melhorias Futuras

### Funcionalidades Planejadas
- [ ] SimpleCov para cobertura Ruby com HTML reports
- [ ] Testes de performance com Lighthouse
- [ ] Testes de SEO automatizados
- [ ] Integração com SonarQube
- [ ] Testes de conteúdo com LanguageTool
- [ ] Monitoramento de dependências com Dependabot

### Otimizações
- [ ] Cache mais agressivo no GitHub Actions
- [ ] Paralelização de testes unitários
- [ ] Testes diferencias (apenas arquivos alterados)
- [ ] Notificações de falhas por Slack/Discord

## Conclusão

O sistema de testes implementado oferece uma cobertura completa e automatizada para o projeto Jekyll MC Journey, abrangendo desde testes unitários até validação de acessibilidade e performance. A estrutura modular e os diferentes frameworks garantem qualidade em todas as camadas da aplicação.

---

**Documentação gerada automaticamente**  
Sistema de Testes MC Journey - v1.0  
Última atualização: $(date '+%Y-%m-%d')