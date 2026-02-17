#!/bin/bash

# Script para gerar relatório consolidado de todos os testes
# Cria um dashboard HTML único que agrega resultados de:
# - Testes E2E (Playwright)
# - Testes de Acessibilidade (axe-core + pa11y)
# - Testes Unitários (JavaScript, Python, Ruby)
# - Testes de Validação (Build, HTML, Frontmatter, Search Index)
# - Relatórios de Cobertura (JavaScript, Python, Ruby)

set -e  # Sair em caso de erro

# Detectar se deve pular execução dos testes
SKIP_TESTS=false
if [[ "$1" == "--skip-tests" ]]; then
    SKIP_TESTS=true
    echo "📋 Modo: Regenerar relatório apenas (sem executar testes)"
else
    echo "🧪 Modo: Executar testes e gerar relatório"
fi

# Verificar se estamos no diretório correto
if [ ! -f "_config.yml" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Jekyll"
    exit 1
fi

# Criar estrutura de diretórios para o relatório consolidado
echo "📁 Criando estrutura de diretórios..."
mkdir -p test-reports/unified/{data,embedded,assets}
mkdir -p test-reports/data

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT_FILE="test-reports/unified/index.html"

# =============================================================================
# EXECUTAR TESTES (se não for --skip-tests)
# =============================================================================

if [ "$SKIP_TESTS" = false ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════════"
    echo "🧪 EXECUTANDO TESTES"
    echo "═══════════════════════════════════════════════════════════════════"
    
    # Build do Jekyll
    echo ""
    echo "🔨 1/8 - Build do Jekyll..."
    if bundle exec jekyll build --quiet; then
        BUILD_STATUS="✅ Passou"
        BUILD_STATUS_CLASS="status-pass"
    else
        BUILD_STATUS="❌ Falhou"
        BUILD_STATUS_CLASS="status-fail"
    fi
    
    # Testes Unitários JavaScript
    echo ""
    echo "📦 2/8 - Testes Unitários JavaScript..."
    if npm run test:unit:coverage > /dev/null 2>&1; then
        JS_TEST_STATUS="✅ Passou"
        JS_TEST_STATUS_CLASS="status-pass"
    else
        JS_TEST_STATUS="❌ Falhou"
        JS_TEST_STATUS_CLASS="status-fail"
    fi
    
    # Testes Unitários Ruby
    echo ""
    echo "💎 3/8 - Testes Unitários Ruby..."
    if make test-unit-ruby > /dev/null 2>&1; then
        RUBY_TEST_STATUS="✅ Passou"
        RUBY_TEST_STATUS_CLASS="status-pass"
    else
        RUBY_TEST_STATUS="❌ Falhou"
        RUBY_TEST_STATUS_CLASS="status-fail"
    fi
    
    # Testes Unitários Python
    echo ""
    echo "🐍 4/8 - Testes Unitários Python..."
    if make test-unit-python-coverage > /dev/null 2>&1; then
        PYTHON_TEST_STATUS="✅ Passou"
        PYTHON_TEST_STATUS_CLASS="status-pass"
    else
        PYTHON_TEST_STATUS="❌ Falhou"
        PYTHON_TEST_STATUS_CLASS="status-fail"
    fi
    
    # Testes de Validação
    echo ""
    echo "✔️  5/8 - Testes de Validação..."
    VALIDATION_OUTPUT=$(mktemp)
    if make test-validation test-validation-html > "$VALIDATION_OUTPUT" 2>&1; then
        VALIDATION_STATUS="✅ Passou"
        VALIDATION_STATUS_CLASS="status-pass"
    else
        VALIDATION_STATUS="❌ Falhou"
        VALIDATION_STATUS_CLASS="status-fail"
    fi
    
    # Verificar se servidor está rodando para E2E
    echo ""
    echo "🌐 6/8 - Testes E2E (Playwright)..."
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        if npm run test:e2e > /dev/null 2>&1; then
            E2E_STATUS="✅ Passou"
            E2E_STATUS_CLASS="status-pass"
        else
            E2E_STATUS="❌ Falhou"
            E2E_STATUS_CLASS="status-fail"
        fi
    else
        E2E_STATUS="⏭️  Pulado (servidor não rodando)"
        E2E_STATUS_CLASS="status-skip"
        echo "   ⚠️  Servidor não detectado em http://localhost:4000"
        echo "   Execute 'make serve' em outro terminal para incluir testes E2E"
    fi
    
    # Testes de Acessibilidade
    echo ""
    echo "♿ 7/8 - Testes de Acessibilidade..."
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        if npm run test:a11y > /dev/null 2>&1; then
            A11Y_STATUS="✅ Passou"
            A11Y_STATUS_CLASS="status-pass"
        else
            A11Y_STATUS="❌ Falhou"
            A11Y_STATUS_CLASS="status-fail"
        fi
    else
        A11Y_STATUS="⏭️  Pulado (servidor não rodando)"
        A11Y_STATUS_CLASS="status-skip"
    fi
    
    # pa11y-ci (opcional)
    echo ""
    echo "♿ 8/8 - pa11y-ci..."
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        if npm run test:a11y:pa11y > /dev/null 2>&1; then
            PA11Y_STATUS="✅ Passou"
            PA11Y_STATUS_CLASS="status-pass"
        else
            PA11Y_STATUS="❌ Falhou"
            PA11Y_STATUS_CLASS="status-fail"
        fi
    else
        PA11Y_STATUS="⏭️  Pulado (servidor não rodando)"
        PA11Y_STATUS_CLASS="status-skip"
    fi
    
else
    # Modo skip-tests - detectar status dos resultados existentes
    echo "📊 Analisando resultados existentes..."
    
    BUILD_STATUS="ℹ️  Não executado"
    BUILD_STATUS_CLASS="status-skip"
    
    if [ -f "test-reports/unified/embedded/coverage-js/index.html" ]; then
        JS_TEST_STATUS="✅ Resultados disponíveis"
        JS_TEST_STATUS_CLASS="status-pass"
    else
        JS_TEST_STATUS="⚠️  Sem resultados"
        JS_TEST_STATUS_CLASS="status-skip"
    fi
    
    if [ -f "test-reports/data/rspec-results.json" ]; then
        RUBY_TEST_STATUS="✅ Resultados disponíveis"
        RUBY_TEST_STATUS_CLASS="status-pass"
    else
        RUBY_TEST_STATUS="⚠️  Sem resultados"
        RUBY_TEST_STATUS_CLASS="status-skip"
    fi
    
    if [ -f "test-reports/unified/embedded/coverage-python/index.html" ]; then
        PYTHON_TEST_STATUS="✅ Resultados disponíveis"
        PYTHON_TEST_STATUS_CLASS="status-pass"
    else
        PYTHON_TEST_STATUS="⚠️  Sem resultados"
        PYTHON_TEST_STATUS_CLASS="status-skip"
    fi
    
    VALIDATION_STATUS="ℹ️  Não executado"
    VALIDATION_STATUS_CLASS="status-skip"
    
    if [ -f "playwright-report/index.html" ]; then
        E2E_STATUS="✅ Resultados disponíveis"
        E2E_STATUS_CLASS="status-pass"
        A11Y_STATUS="✅ Resultados disponíveis"
        A11Y_STATUS_CLASS="status-pass"
    else
        E2E_STATUS="⚠️  Sem resultados"
        E2E_STATUS_CLASS="status-skip"
        A11Y_STATUS="⚠️  Sem resultados"
        A11Y_STATUS_CLASS="status-skip"
    fi
    
    PA11Y_STATUS="ℹ️  Não executado"
    PA11Y_STATUS_CLASS="status-skip"
fi

# =============================================================================
# COLETAR E COPIAR RELATÓRIOS
# =============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📋 COLETANDO RELATÓRIOS"
echo "═══════════════════════════════════════════════════════════════════"

# Copiar Playwright report
if [ -d "playwright-report" ]; then
    echo "📦 Copiando relatório Playwright..."
    cp -r playwright-report test-reports/unified/embedded/playwright 2>/dev/null || true
    rm -rf playwright-report || true
fi

# Todos os coverage reports são gerados direto nos destinos:
# - JavaScript: test-reports/unified/embedded/coverage-js (vitest.config.js)
# - Python: test-reports/unified/embedded/coverage-python (Makefile)
# - Ruby: test-reports/unified/embedded/coverage-ruby (spec_helper.rb)
# Não precisa copiar nada!

# =============================================================================
# EXTRAIR MÉTRICAS DOS RELATÓRIOS
# =============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📊 EXTRAINDO MÉTRICAS"
echo "═══════════════════════════════════════════════════════════════════"

# Extrair métricas JavaScript
JS_COVERAGE="N/A"
if [ -f "test-reports/unified/embedded/coverage-js/coverage-summary.json" ]; then
    JS_COVERAGE=$(node -e "
        try {
            const data = require('./test-reports/unified/embedded/coverage-js/coverage-summary.json');
            console.log(Math.round(data.total.lines.pct) + '%');
        } catch(e) { console.log('N/A'); }
    " 2>/dev/null || echo "N/A")
fi

# Extrair métricas Python (simplificado)
PYTHON_COVERAGE="N/A"
if [ -f "test-reports/unified/embedded/coverage-python/index.html" ]; then
    PYTHON_COVERAGE="Disponível"
fi

# Extrair métricas Ruby (simplificado)
RUBY_COVERAGE="N/A"
if [ -d "test-reports/unified/embedded/coverage-ruby" ]; then
    RUBY_COVERAGE="Disponível"
fi

# Contar testes E2E
E2E_TESTS_TOTAL=0
E2E_TESTS_PASSED=0
E2E_TESTS_FAILED=0

if [ -f "test-reports/data/playwright-results.json" ]; then
    E2E_STATS=$(node -e "
        try {
            const data = require('./test-reports/data/playwright-results.json');
            const suites = data.suites || [];
            let total = 0, passed = 0, failed = 0;
            
            function countTests(suite) {
                if (suite.specs) {
                    suite.specs.forEach(spec => {
                        total++;
                        if (spec.ok) passed++;
                        else failed++;
                    });
                }
                if (suite.suites) {
                    suite.suites.forEach(s => countTests(s));
                }
            }
            
            suites.forEach(s => countTests(s));
            console.log(total + ',' + passed + ',' + failed);
        } catch(e) { console.log('0,0,0'); }
    " 2>/dev/null || echo "0,0,0")
    
    E2E_TESTS_TOTAL=$(echo $E2E_STATS | cut -d',' -f1)
    E2E_TESTS_PASSED=$(echo $E2E_STATS | cut -d',' -f2)
    E2E_TESTS_FAILED=$(echo $E2E_STATS | cut -d',' -f3)
fi

# =============================================================================
# GERAR HTML CONSOLIDADO
# =============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "🎨 GERANDO DASHBOARD HTML"
echo "═══════════════════════════════════════════════════════════════════"

# Chamar o gerador de HTML (será criado a seguir)
source "$(dirname "$0")/generate-dashboard-html.sh"

echo "✅ Dashboard HTML gerado: $REPORT_FILE"

# =============================================================================
# GERAR RESUMO EM TEXTO
# =============================================================================

SUMMARY_FILE="test-reports/unified/summary.txt"
cat > "$SUMMARY_FILE" << EOF
═══════════════════════════════════════════════════════════════════
RESUMO DE TESTES - Site Attempt
═══════════════════════════════════════════════════════════════════
Gerado em: $TIMESTAMP

STATUS DOS TESTES:
  Build Jekyll:        $BUILD_STATUS
  JavaScript Unit:     $JS_TEST_STATUS
  Ruby Unit:           $RUBY_TEST_STATUS
  Python Unit:         $PYTHON_TEST_STATUS
  Validação:          $VALIDATION_STATUS
  E2E (Playwright):    $E2E_STATUS
  Acessibilidade:      $A11Y_STATUS
  pa11y-ci:           $PA11Y_STATUS

COBERTURA DE CÓDIGO:
  JavaScript: $JS_COVERAGE
  Python:     $PYTHON_COVERAGE
  Ruby:       $RUBY_COVERAGE

TESTES E2E:
  Total:      $E2E_TESTS_TOTAL
  Passaram:   $E2E_TESTS_PASSED
  Falharam:   $E2E_TESTS_FAILED

═══════════════════════════════════════════════════════════════════
Relatório completo: test-reports/unified/index.html
═══════════════════════════════════════════════════════════════════
EOF

echo "📄 Resumo texto gerado: $SUMMARY_FILE"

# =============================================================================
# ABRIR NO NAVEGADOR
# =============================================================================

if [ -z "$SKIP_BROWSER_OPEN" ]; then
    echo ""
    echo "🌐 Abrindo relatório no navegador..."
    
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "file://$(pwd)/$REPORT_FILE" 2>/dev/null || true
    elif command -v open >/dev/null 2>&1; then
        open "$REPORT_FILE" 2>/dev/null || true
    else
        echo "   ℹ️  Abra manualmente: $REPORT_FILE"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ RELATÓRIO CONSOLIDADO CONCLUÍDO!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Relatório HTML: test-reports/unified/index.html"
echo "📄 Resumo texto:   test-reports/unified/summary.txt"
echo ""
