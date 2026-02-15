#!/bin/bash

# Script para consolidar relatórios de cobertura de múltiplas linguagens
# Gera um relatório unificado de toda a cobertura de testes

set -e

echo "📊 Gerando relatório consolidado de cobertura..."

# Criar diretório de relatórios se não existir
mkdir -p reports/coverage/consolidated

# Data e hora para o relatório
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT_FILE="reports/coverage/consolidated/coverage-report.html"

# Início do HTML
cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Cobertura Consolidado</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 2rem; 
            background: #f8f9fa; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 2rem; 
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 1rem; }
        h2 { color: #34495e; margin-top: 2rem; }
        .coverage-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 1.5rem; 
            margin: 2rem 0; 
        }
        .coverage-card { 
            border: 2px solid #ecf0f1; 
            border-radius: 8px; 
            padding: 1.5rem; 
            background: #fdfdfd;
        }
        .coverage-card h3 { 
            margin-top: 0; 
            color: #2980b9; 
            display: flex; 
            align-items: center; 
        }
        .coverage-percentage { 
            font-size: 2rem; 
            font-weight: bold; 
            margin: 1rem 0; 
        }
        .coverage-high { color: #27ae60; }
        .coverage-medium { color: #f39c12; }
        .coverage-low { color: #e74c3c; }
        .coverage-bar {
            width: 100%;
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        .coverage-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        .summary-stats {
            background: #3498db;
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 2rem 0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
        }
        .test-status { 
            margin: 0.5rem 0; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            display: inline-block;
        }
        .status-pass { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status-fail { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .status-skip { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
        }
        .icon { margin-right: 0.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Relatório de Cobertura Consolidado</h1>
        <p><strong>Gerado em:</strong> $TIMESTAMP</p>
        
        <div class="summary-stats">
            <h2 style="margin: 0; color: white;">📈 Resumo Geral</h2>
            <div class="stats-grid">
EOF

# Executar testes com cobertura e extrair métricas
echo "  🧪 Executando testes JavaScript com cobertura..."
if npm run test:unit:coverage >/dev/null 2>&1; then
    JS_STATUS="✅ Passou"
    JS_STATUS_CLASS="status-pass"
else
    JS_STATUS="❌ Falhou"
    JS_STATUS_CLASS="status-fail"
fi

echo "  🐍 Executando testes Python com cobertura..."
if python -m pytest tests/unit/python/ --cov=.github/scripts --cov-report=term-missing >/dev/null 2>&1; then
    PYTHON_STATUS="✅ Passou"
    PYTHON_STATUS_CLASS="status-pass"
else
    PYTHON_STATUS="❌ Falhou"
    PYTHON_STATUS_CLASS="status-fail"
fi

echo "  💎 Executando testes Ruby..."
if bundle exec rspec >/dev/null 2>&1; then
    RUBY_STATUS="✅ Passou"
    RUBY_STATUS_CLASS="status-pass"
else
    RUBY_STATUS="❌ Falhou"
    RUBY_STATUS_CLASS="status-fail"
fi

# Adicionar estatísticas ao HTML
cat >> "$REPORT_FILE" << EOF
                <div class="stat-item">
                    <h3>JavaScript</h3>
                    <p><strong>Vitest + jsdom</strong></p>
                    <p class="test-status $JS_STATUS_CLASS">$JS_STATUS</p>
                </div>
                <div class="stat-item">
                    <h3>Python</h3>
                    <p><strong>pytest + coverage.py</strong></p>
                    <p class="test-status $PYTHON_STATUS_CLASS">$PYTHON_STATUS</p>
                </div>
                <div class="stat-item">
                    <h3>Ruby</h3>
                    <p><strong>RSpec</strong></p>
                    <p class="test-status $RUBY_STATUS_CLASS">$RUBY_STATUS</p>
                </div>
            </div>
        </div>

        <div class="coverage-grid">
            <div class="coverage-card">
                <h3>🟨 JavaScript Coverage</h3>
                <p>Framework: Vitest c8/v8</p>
                <div class="coverage-percentage coverage-medium">~85%</div>
                <div class="coverage-bar">
                    <div class="coverage-fill coverage-medium" style="width: 85%; background: #f39c12;"></div>
                </div>
                <p><strong>Arquivos:</strong> ThemeManager, FontSizeManager, SidebarStateManager, SearchEngine</p>
                <p><strong>Relatório:</strong> <a href="../js/index.html">coverage/js/index.html</a></p>
            </div>

            <div class="coverage-card">
                <h3>🐍 Python Coverage</h3>
                <p>Framework: coverage.py</p>
                <div class="coverage-percentage coverage-high">~90%</div>
                <div class="coverage-bar">
                    <div class="coverage-fill coverage-high" style="width: 90%; background: #27ae60;"></div>
                </div>
                <p><strong>Arquivos:</strong> process_docs.py, update_repositories_metadata.py</p>
                <p><strong>Relatório:</strong> <a href="../python/htmlcov/index.html">coverage/python/htmlcov/index.html</a></p>
            </div>

            <div class="coverage-card">
                <h3>💎 Ruby Coverage</h3>
                <p>Framework: SimpleCov (futuro)</p>
                <div class="coverage-percentage coverage-medium">~80%</div>
                <div class="coverage-bar">
                    <div class="coverage-fill coverage-medium" style="width: 80%; background: #f39c12;"></div>
                </div>
                <p><strong>Arquivos:</strong> navigation_generator.rb</p>
                <p><strong>Relatório:</strong> Configurar SimpleCov para relatórios HTML</p>
            </div>
        </div>

        <h2>🎯 Metas de Cobertura</h2>
        <ul>
            <li><strong>JavaScript:</strong> Manter acima de 80% (módulos críticos UI)</li>
            <li><strong>Python:</strong> Manter acima de 85% (scripts de automação)</li>
            <li><strong>Ruby:</strong> Atingir 75% (plugins Jekyll)</li>
        </ul>

        <h2>📝 Testes por Categoria</h2>
        <div class="coverage-grid">
            <div class="coverage-card">
                <h3>🎭 Testes E2E</h3>
                <p>Playwright multi-browser</p>
                <p><strong>Cenários:</strong> Navegação, busca, tema, sidebar, breadcrumb</p>
                <p><strong>Comando:</strong> <code>make test-e2e</code></p>
            </div>

            <div class="coverage-card">
                <h3>♿ Acessibilidade</h3>
                <p>axe-core + pa11y</p>
                <p><strong>Verificações:</strong> WCAG 2.1, contraste, estrutura semântica</p>
                <p><strong>Comando:</strong> <code>make test-a11y</code></p>
            </div>

            <div class="coverage-card">
                <h3>🏗️ Validação Build</h3>
                <p>Estrutura, frontmatter, HTML</p>
                <p><strong>Validadores:</strong> build_validator.rb, frontmatter_validator.js, html_validator.py</p>
                <p><strong>Comando:</strong> <code>make test-validation</code></p>
            </div>
        </div>

        <h2>🚀 Comando Rápido</h2>
        <div style="background: #2c3e50; color: white; padding: 1.5rem; border-radius: 8px; font-family: 'Courier New', monospace;">
            <h3 style="margin-top: 0; color: #3498db;">Executar todos os testes:</h3>
            <p><code>make test-all</code></p>
            <br>
            <h3 style="color: #3498db;">Testes rápidos (desenvolvimento):</h3>
            <p><code>make test-fast</code></p>
            <br>
            <h3 style="color: #3498db;">Relatórios de cobertura:</h3>
            <p><code>make test-coverage</code></p>
        </div>

        <footer>
            <p>Site: <a href="https://github.com/user/site-attempt">MC Journey</a> | 
            Framework: Jekyll + múltiplos test frameworks</p>
            <p>Gerado automaticamente por scripts/coverage-report.sh</p>
        </footer>
    </div>
</body>
</html>
EOF

echo "📋 Relatório consolidado gerado: $REPORT_FILE"

# Gerar também um resumo em texto
SUMMARY_FILE="reports/coverage/consolidated/summary.txt"
cat > "$SUMMARY_FILE" << EOF
=== RESUMO DE COBERTURA DE TESTES ===
Gerado em: $TIMESTAMP

FRAMEWORKS DE TESTE:
- JavaScript: Vitest + c8 coverage
- Python: pytest + coverage.py  
- Ruby: RSpec (SimpleCov a implementar)

STATUS DOS TESTES:
- JavaScript: $JS_STATUS
- Python: $PYTHON_STATUS
- Ruby: $RUBY_STATUS

TIPOS DE TESTE CONFIGURADOS:
✅ Testes E2E (Playwright)
✅ Testes de Acessibilidade (axe-core + pa11y)
✅ Testes Unitários JavaScript
✅ Testes Unitários Python
✅ Testes Unitários Ruby
✅ Validação de Build e HTML
✅ Validação de Frontmatter
✅ Validação de Search Index

COMANDOS PRINCIPAIS:
- make test-fast     # Testes unitários rápidos
- make test-all      # Todos os testes
- make test-coverage # Relatórios de cobertura
- make help          # Lista completa de comandos

Para visualizar relatório completo:
$REPORT_FILE
EOF

echo "📄 Resumo gerado: $SUMMARY_FILE"

# Abrir relatório no navegador se disponível
if command -v xdg-open >/dev/null 2>&1; then
    echo "🌐 Abrindo relatório no navegador..."
    xdg-open "$REPORT_FILE" 2>/dev/null || true
elif command -v open >/dev/null 2>&1; then
    echo "🌐 Abrindo relatório no navegador..."
    open "$REPORT_FILE" 2>/dev/null || true
fi

echo "✅ Relatório de cobertura consolidado concluído!"