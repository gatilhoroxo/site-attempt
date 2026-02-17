#!/bin/bash

# Script auxiliar para gerar o HTML do dashboard consolidado
# Este script é chamado por generate-unified-report.sh
# Usa variáveis definidas no script principal

# Gerar o HTML consolidado
cat > "$REPORT_FILE" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Consolidado de Testes - Site Attempt</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 3rem;
            border-bottom: 4px solid rgba(255, 255, 255, 0.2);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }
        
        .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
            overflow-x: auto;
        }
        
        .tab {
            padding: 1rem 2rem;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 1rem;
            font-weight: 600;
            color: #6c757d;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
            white-space: nowrap;
        }
        
        .tab:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }
        
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: white;
        }
        
        .tab-content {
            display: none;
            padding: 3rem;
            animation: fadeIn 0.3s;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .summary-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 1.5rem;
            border-left: 5px solid #667eea;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        
        .summary-card h3 {
            color: #495057;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }
        
        .summary-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #212529;
            margin-bottom: 0.5rem;
        }
        
        .summary-card .label {
            color: #6c757d;
            font-size: 0.95rem;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin: 0.25rem;
        }
        
        .status-pass {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-fail {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .status-skip {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .test-list {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: white;
            border-radius: 6px;
            margin-bottom: 0.75rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .test-item:last-child {
            margin-bottom: 0;
        }
        
        .test-name {
            font-weight: 600;
            color: #212529;
            font-size: 1.05rem;
        }
        
        .iframe-container {
            width: 100%;
            height: 800px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        
        .iframe-container iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .coverage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .coverage-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .coverage-card h3 {
            color: #212529;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .coverage-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .coverage-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }
        
        .alert {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-left: 5px solid #ffc107;
            border-radius: 6px;
            padding: 1.25rem;
            margin-bottom: 2rem;
            color: #856404;
        }
        
        .alert strong {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .quick-actions {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .quick-actions h3 {
            color: #495057;
            margin-bottom: 1rem;
        }
        
        .quick-actions code {
            background: #212529;
            color: #50fa7b;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            display: inline-block;
            margin: 0.5rem 0;
        }
        
        .timestamp {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
        }
        
        .icon {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="icon">📊</span> Relatório Consolidado de Testes</h1>
            <p class="timestamp">Gerado em: TIMESTAMP_PLACEHOLDER</p>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="openTab(event, 'summary')">📋 Sumário</button>
            <button class="tab" onclick="openTab(event, 'e2e')">🎭 E2E & A11y</button>
            <button class="tab" onclick="openTab(event, 'coverage')">📈 Cobertura</button>
            <button class="tab" onclick="openTab(event, 'unit')">🧪 Testes Unitários</button>
            <button class="tab" onclick="openTab(event, 'validation')">✅ Validação</button>
        </div>
        
        <!-- TAB: SUMÁRIO -->
        <div id="summary" class="tab-content active">
            <h2 style="margin-bottom: 2rem; color: #212529;">Visão Geral dos Testes</h2>
            
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Testes E2E</h3>
                    <div class="value">E2E_TOTAL_PLACEHOLDER</div>
                    <div class="label">
                        <span style="color: #28a745;">✓ E2E_PASSED_PLACEHOLDER</span> | 
                        <span style="color: #dc3545;">✗ E2E_FAILED_PLACEHOLDER</span>
                    </div>
                </div>
                
                <div class="summary-card">
                    <h3>Cobertura JS</h3>
                    <div class="value">JS_COV_PLACEHOLDER</div>
                    <div class="label">Lines covered</div>
                </div>
                
                <div class="summary-card">
                    <h3>Frameworks</h3>
                    <div class="value">8</div>
                    <div class="label">JS, Python, Ruby, Playwright, etc.</div>
                </div>
                
                <div class="summary-card">
                    <h3>Última Execução</h3>
                    <div class="value" style="font-size: 1.5rem;">TIMESTAMP_SHORT_PLACEHOLDER</div>
                    <div class="label">Timestamp</div>
                </div>
            </div>
            
            <h3 style="margin: 2rem 0 1rem; color: #212529;">Estado dos Testes</h3>
            <div class="test-list">
                <div class="test-item">
                    <span class="test-name">🔨 Build Jekyll</span>
                    <span class="status-badge BUILD_STATUS_CLASS">BUILD_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">📦 Testes Unitários JavaScript</span>
                    <span class="status-badge JS_STATUS_CLASS">JS_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">💎 Testes Unitários Ruby</span>
                    <span class="status-badge RUBY_STATUS_CLASS">RUBY_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">🐍 Testes Unitários Python</span>
                    <span class="status-badge PYTHON_STATUS_CLASS">PYTHON_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">✔️ Validação de Build</span>
                    <span class="status-badge VALIDATION_STATUS_CLASS">VALIDATION_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">🎭 Testes E2E (Playwright)</span>
                    <span class="status-badge E2E_STATUS_CLASS">E2E_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">♿ Testes de Acessibilidade</span>
                    <span class="status-badge A11Y_STATUS_CLASS">A11Y_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">♿ pa11y-ci</span>
                    <span class="status-badge PA11Y_STATUS_CLASS">PA11Y_STATUS_PLACEHOLDER</span>
                </div>
            </div>
            
            <div class="quick-actions">
                <h3>🚀 Comandos Rápidos</h3>
                <p><strong>Executar todos os testes (sem E2E):</strong></p>
                <code>make test-all</code>
                
                <p style="margin-top: 1rem;"><strong>Executar todos os testes (com E2E - requer servidor):</strong></p>
                <code>make test-all-with-e2e</code>
                
                <p style="margin-top: 1rem;"><strong>Regenerar apenas este relatório:</strong></p>
                <code>make test-report-only</code>
            </div>
        </div>
        
        <!-- TAB: E2E & A11y -->
        <div id="e2e" class="tab-content">
            <h2 style="margin-bottom: 1.5rem; color: #212529;">Testes E2E e Acessibilidade</h2>
            
            E2E_CONTENT_PLACEHOLDER
        </div>
        
        <!-- TAB: COBERTURA -->
        <div id="coverage" class="tab-content">
            <h2 style="margin-bottom: 1.5rem; color: #212529;">Relatórios de Cobertura de Código</h2>
            
            <div class="coverage-grid">
                COVERAGE_JS_PLACEHOLDER
                
                COVERAGE_PYTHON_PLACEHOLDER
                
                COVERAGE_RUBY_PLACEHOLDER
            </div>
        </div>
        
        <!-- TAB: TESTES UNITÁRIOS -->
        <div id="unit" class="tab-content">
            <h2 style="margin-bottom: 1.5rem; color: #212529;">Testes Unitários</h2>
            
            <div class="test-list">
                <div class="test-item">
                    <span class="test-name">📦 JavaScript (Vitest)</span>
                    <span class="status-badge JS_STATUS_CLASS">JS_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">💎 Ruby (RSpec)</span>
                    <span class="status-badge RUBY_STATUS_CLASS">RUBY_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">🐍 Python (pytest)</span>
                    <span class="status-badge PYTHON_STATUS_CLASS">PYTHON_STATUS_PLACEHOLDER</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #212529;">Detalhes</h3>
                <p style="color: #6c757d; line-height: 1.8;">
                    Os testes unitários cobrem a funcionalidade principal do site em três linguagens:<br><br>
                    <strong>JavaScript:</strong> Theme manager, sidebar state, font size control, search engine<br>
                    <strong>Ruby:</strong> Jekyll plugins e geradores de navegação<br>
                    <strong>Python:</strong> Scripts de automação e processamento de docs
                </p>
            </div>
        </div>
        
        <!-- TAB: VALIDAÇÃO -->
        <div id="validation" class="tab-content">
            <h2 style="margin-bottom: 1.5rem; color: #212529;">Testes de Validação</h2>
            
            <div class="test-list">
                <div class="test-item">
                    <span class="test-name">🏗️ Build Validator</span>
                    <span class="status-badge VALIDATION_STATUS_CLASS">VALIDATION_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">📄 Frontmatter Validator</span>
                    <span class="status-badge VALIDATION_STATUS_CLASS">VALIDATION_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">🔍 Search Index Validator</span>
                    <span class="status-badge VALIDATION_STATUS_CLASS">VALIDATION_STATUS_PLACEHOLDER</span>
                </div>
                <div class="test-item">
                    <span class="test-name">🌐 HTML Validator</span>
                    <span class="status-badge VALIDATION_STATUS_CLASS">VALIDATION_STATUS_PLACEHOLDER</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #212529;">Sobre a Validação</h3>
                <p style="color: #6c757d; line-height: 1.8;">
                    Os testes de validação garantem a integridade estrutural do site:<br><br>
                    • <strong>Build Validator:</strong> Verifica que o Jekyll pode fazer build sem erros<br>
                    • <strong>Frontmatter Validator:</strong> Valida metadados YAML nas páginas markdown<br>
                    • <strong>Search Index Validator:</strong> Confirma estrutura correta do índice de busca<br>
                    • <strong>HTML Validator:</strong> Valida HTML gerado contra padrões W3C
                </p>
            </div>
        </div>
    </div>
    
    <script>
        function openTab(evt, tabName) {
            // Hide all tab contents
            const tabContents = document.getElementsByClassName('tab-content');
            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove('active');
            }
            
            // Remove active class from all tabs
            const tabs = document.getElementsByClassName('tab');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
            }
            
            // Show current tab and mark button as active
            document.getElementById(tabName).classList.add('active');
            evt.currentTarget.classList.add('active');
        }
    </script>
</body>
</html>
HTMLEOF

escape_sed() {
    echo "$1" | sed -e 's/[\/&]/\\&/g'
}

replace_placeholder() {
    local placeholder="$1"
    local value="$2"
    local file="$3"
    perl -0777 -i -pe "s|\Q$placeholder\E|$value|gs" "$file"
}

# Substituir placeholders com valores reais
sed -i "s|TIMESTAMP_PLACEHOLDER|$(escape_sed "$TIMESTAMP")|g" "$REPORT_FILE"
sed -i "s|TIMESTAMP_SHORT_PLACEHOLDER|$(date '+%H:%M:%S')|g" "$REPORT_FILE"
sed -i "s|BUILD_STATUS_PLACEHOLDER|$(escape_sed "$BUILD_STATUS")|g" "$REPORT_FILE"  
sed -i "s|BUILD_STATUS_CLASS|$(escape_sed "$BUILD_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|JS_STATUS_PLACEHOLDER|$(escape_sed "$JS_TEST_STATUS")|g" "$REPORT_FILE"
sed -i "s|JS_STATUS_CLASS|$(escape_sed "$JS_TEST_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|RUBY_STATUS_PLACEHOLDER|$(escape_sed "$RUBY_TEST_STATUS")|g" "$REPORT_FILE"
sed -i "s|RUBY_STATUS_CLASS|$(escape_sed "$RUBY_TEST_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|PYTHON_STATUS_PLACEHOLDER|$(escape_sed "$PYTHON_TEST_STATUS")|g" "$REPORT_FILE"
sed -i "s|PYTHON_STATUS_CLASS|$(escape_sed "$PYTHON_TEST_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|VALIDATION_STATUS_PLACEHOLDER|$(escape_sed "$VALIDATION_STATUS")|g" "$REPORT_FILE"
sed -i "s|VALIDATION_STATUS_CLASS|$(escape_sed "$VALIDATION_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|E2E_STATUS_PLACEHOLDER|$(escape_sed "$E2E_STATUS")|g" "$REPORT_FILE"
sed -i "s|E2E_STATUS_CLASS|$(escape_sed "$E2E_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|A11Y_STATUS_PLACEHOLDER|$(escape_sed "$A11Y_STATUS")|g" "$REPORT_FILE"
sed -i "s|A11Y_STATUS_CLASS|$(escape_sed "$A11Y_STATUS_CLASS")|g" "$REPORT_FILE"
sed -i "s|PA11Y_STATUS_PLACEHOLDER|$(escape_sed "$PA11Y_STATUS")|g" "$REPORT_FILE"
sed -i "s|PA11Y_STATUS_CLASS|$(escape_sed "$PA11Y_STATUS_CLASS")|g" "$REPORT_FILE"

# Métricas E2E
sed -i "s|E2E_TOTAL_PLACEHOLDER|$(escape_sed "$E2E_TESTS_TOTAL")|g" "$REPORT_FILE"
sed -i "s|E2E_PASSED_PLACEHOLDER|$(escape_sed "$E2E_TESTS_PASSED")|g" "$REPORT_FILE"
sed -i "s|E2E_FAILED_PLACEHOLDER|$(escape_sed "$E2E_TESTS_FAILED")|g" "$REPORT_FILE"

# Cobertura
sed -i "s|JS_COV_PLACEHOLDER|$(escape_sed "$JS_COVERAGE")|g" "$REPORT_FILE"

# Gerar conteúdo E2E
if [ -f "test-reports/unified/embedded/playwright/index.html" ]; then
    E2E_CONTENT='<div class="iframe-container">
                <iframe src="embedded/playwright/index.html" title="Playwright Test Report"></iframe>
            </div>
            <p style="margin-top: 1rem; color: #6c757d;">
                💡 <strong>Dica:</strong> O relatório Playwright é interativo. Clique nos testes para ver detalhes, traces e screenshots.
            </p>'
else
    E2E_CONTENT='<div class="alert">
                <strong>⚠️ Nenhum relatório E2E encontrado</strong>
                <p>Para gerar relatórios E2E:</p>
                <ol style="margin-top: 0.5rem; margin-left: 1.5rem;">
                    <li>Em um terminal, execute: <code style="background: #212529; color: #50fa7b; padding: 0.25rem 0.5rem; border-radius: 3px;">make serve</code></li>
                    <li>Em outro terminal, execute: <code style="background: #212529; color: #50fa7b; padding: 0.25rem 0.5rem; border-radius: 3px;">make test-e2e</code></li>
                    <li>Regenere este relatório: <code style="background: #212529; color: #50fa7b; padding: 0.25rem 0.5rem; border-radius: 3px;">make coverage-report</code></li>
                </ol>
            </div>'
fi
replace_placeholder "$E2E_CONTENT" "$REPORT_FILE"

# Gerar cards de cobertura
if [ -f "test-reports/unified/embedded/coverage-js/index.html" ]; then
    COVERAGE_JS='<div class="coverage-card">
                    <h3>📦 JavaScript</h3>
                    <p style="color: #6c757d; margin-bottom: 1rem;">Cobertura: <strong>'$JS_COVERAGE'</strong></p>
                    <a href="embedded/coverage-js/index.html" class="coverage-link" target="_blank">Ver Relatório Completo →</a>
                </div>'
else
    COVERAGE_JS='<div class="coverage-card">
                    <h3>📦 JavaScript</h3>
                    <p style="color: #dc3545;">Nenhum relatório disponível</p>
                    <p style="color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem;">Execute: <code>make test-unit-js-coverage</code></p>
                </div>'
fi
replace_placeholder "$COVERAGE_JS" "$REPORT_FILE"

if [ -f "test-reports/unified/embedded/coverage-python/index.html" ]; then
    COVERAGE_PYTHON='<div class="coverage-card">
                    <h3>🐍 Python</h3>
                    <p style="color: #6c757d; margin-bottom: 1rem;">Cobertura: <strong>'$PYTHON_COVERAGE'</strong></p>
                    <a href="embedded/coverage-python/index.html" class="coverage-link" target="_blank">Ver Relatório Completo →</a>
                </div>'
else
    COVERAGE_PYTHON='<div class="coverage-card">
                    <h3>🐍 Python</h3>
                    <p style="color: #dc3545;">Nenhum relatório disponível</p>
                    <p style="color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem;">Execute: <code>make test-unit-python-coverage</code></p>
                </div>'
fi
replace_placeholder "$COVERAGE_PYTHON" "$REPORT_FILE"

if [ -f "test-reports/unified/embedded/coverage-ruby/index.html" ]; then
    COVERAGE_RUBY='<div class="coverage-card">
                    <h3>💎 Ruby</h3>
                    <p style="color: #6c757d; margin-bottom: 1rem;">SimpleCov Report</p>
                    <a href="embedded/coverage-ruby/index.html" class="coverage-link" target="_blank">Ver Relatório Completo →</a>
                </div>'
else
    COVERAGE_RUBY='<div class="coverage-card">
                    <h3>💎 Ruby</h3>
                    <p style="color: #dc3545;">Nenhum relatório disponível</p>
                    <p style="color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem;">Execute: <code>make test-unit-ruby</code></p>
                </div>'
fi
replace_placeholder "$COVERAGE_RUBY" "$REPORT_FILE"
