# Política de Segurança

## Versões Suportadas

Este projeto está em desenvolvimento ativo. Atualmente, apenas a versão mais 
recente do branch `main` recebe atualizações de segurança.

| Versão | Suportada          |
| ------ | ------------------ |
| main   | :white_check_mark: |
| outras | :x:                |

## Escopo de Segurança

Como este é um **site estático** gerado com Jekyll, a superfície de ataque é 
limitada. No entanto, ainda existem considerações de segurança importantes:

### Vulnerabilidades Relevantes

**Dependências Ruby/Jekyll**
- Vulnerabilidades conhecidas em gems (Jekyll, kramdown, Rouge, etc.)
- Plugins Jekyll com falhas de segurança
- Versões desatualizadas com CVEs publicados

**Conteúdo e Scripts**
- Cross-Site Scripting (XSS) em JavaScript client-side
- Injeção de conteúdo malicioso via Markdown
- Links para recursos externos comprometidos
- Vazamento de informações sensíveis em commits

**Configuração e Deploy**
- Exposição de tokens ou secrets em arquivos de configuração
- Permissões incorretas em workflows do GitHub Actions
- Configurações inseguras de CORS ou Content-Security-Policy

**Build e CI/CD**
- Código malicioso em dependências de build
- Workflows do GitHub Actions com permissões excessivas
- Injeção de comandos em scripts de build

### Fora do Escopo

Não são consideradas vulnerabilidades de segurança:

- Problemas puramente estéticos ou de UX
- Funcionalidades faltantes
- Bugs que não apresentam risco de segurança
- Questões de performance
- Vulnerabilidades teóricas sem exploit prático

## Como Reportar uma Vulnerabilidade

### Canais de Reporte

**Para Vulnerabilidades Sérias** (recomendado):

Use o [GitHub Security Advisories](https://github.com/gatilhoroxo/site-attempt/security/advisories/new) 
para reportar de forma privada. Isto permite discussão confidencial antes da 
divulgação pública.

**Para Questões Menos Críticas**:

Abra uma [issue pública](https://github.com/gatilhoroxo/site-attempt/issues/new) 
com a tag `security` se o problema não for altamente sensível.

### O Que Incluir no Reporte

Para nos ajudar a entender e resolver a questão rapidamente, inclua:

1. **Descrição da Vulnerabilidade**
   - Tipo de vulnerabilidade (XSS, dependência desatualizada, etc.)
   - Componente afetado (gem específica, script, configuração)
   - Severidade estimada (crítica, alta, média, baixa)

2. **Passos para Reproduzir**
   - Ambiente necessário
   - Passos detalhados para explorar a vulnerabilidade
   - Proof of Concept se possível

3. **Impacto Potencial**
   - O que um atacante poderia fazer
   - Quais dados ou recursos estariam em risco
   - Número estimado de usuários afetados

4. **Remediação Sugerida** (opcional)
   - Possíveis soluções ou mitigações
   - Versões corrigidas de dependências
   - Patches ou workarounds

### Exemplo de Reporte

```markdown
### Descrição
XSS refletido no componente de busca client-side

### Severidade
Média - requer interação do usuário

### Reprodução
1. Acesse /gatilhos/
2. No campo de busca, insira: `<script>alert(document.cookie)</script>`
3. Pressione Enter
4. Observe execução do script

### Impacto
Atacante pode executar JavaScript no contexto do site, potencialmente:
- Roubar dados de sessão (se houver)
- Modificar conteúdo da página
- Redirecionar para sites maliciosos

### Remediação
Sanitizar input em src/_includes/scripts/sidebar/search.html
usando DOMPurify ou escapamento adequado antes de inserir no DOM
```

## Processo de Resposta

### Timeline Esperado

1. **Reconhecimento**: Dentro de 48 horas úteis
   - Confirmação de recebimento do reporte
   - Atribuição de ID de rastreamento

2. **Avaliação Inicial**: Dentro de 5 dias úteis
   - Validação da vulnerabilidade
   - Classificação de severidade
   - Planejamento de correção

3. **Correção**: Dependente da severidade
   - **Crítica**: 7 dias
   - **Alta**: 14 dias
   - **Média**: 30 dias
   - **Baixa**: 60 dias ou próximo release

4. **Divulgação**: Após correção implementada
   - Advisory publicado
   - Crédito dado ao reporter (se desejado)
   - Documentação atualizada

### Classificação de Severidade

**Crítica**
- Execução remota de código
- Acesso não autorizado a dados sensíveis
- Comprometimento completo do sistema de build

**Alta**
- XSS persistente afetando múltiplos usuários
- Dependências com CVE crítico
- Exposição de secrets ou tokens

**Média**
- XSS refletido
- Dependências com CVE de severidade média
- Configurações inseguras sem exploração clara

**Baixa**
- Dependências desatualizadas sem CVE conhecido
- Problemas teóricos sem exploit prático
- Melhorias de segurança preventivas

## Divulgação Coordenada

Pedimos que você:

- **NÃO divulgue publicamente** até que tenhamos tempo de corrigir
- **Aguarde nossa confirmação** antes de publicar detalhes
- **Nos dê tempo razoável** para desenvolver e testar correções

Em troca, nos comprometemos a:

- **Reconhecer seu reporte** prontamente
- **Manter você informado** sobre o progresso
- **Dar crédito** pela descoberta (se desejado)
- **Divulgar transparentemente** após correção

## Atualizações de Segurança

### Como Ficará Sabendo

- **Security Advisories**: Publicados no GitHub
- **Changelog**: Entradas marcadas com tag `[SECURITY]`
- **Releases**: Notas de release incluem correções de segurança

### Como Atualizar

```bash
# Atualize dependências
bundle update

# Verifique por vulnerabilidades conhecidas
bundle audit check --update

# Rebuilde o site
bundle exec jekyll build
```

## Melhores Práticas para Contribuidores

Se você está contribuindo para o projeto:

### Antes de Commitar

- **NÃO comite secrets**: Tokens, senhas, chaves API
- **Revise diffs**: Verifique o que está sendo commitado
- **Use .gitignore**: Para arquivos sensíveis locais
- **Escanei dependências**: `bundle audit` antes de PRs

### Em Pull Requests

- **Atualize dependências responsavelmente**: Teste após upgrades
- **Evite JavaScript inline**: Use arquivos separados
- **Sanitize inputs**: Sempre escape conteúdo dinâmico
- **Siga CSP**: Content Security Policy se implementado

### Em Workflows

- **Use permissões mínimas**: `permissions:` explícitos
- **Fixe versões de actions**: Use `@v2.1.0` não `@v2`
- **Não exponha secrets**: Em logs ou outputs
- **Valide inputs**: Em workflow_dispatch

## Dependências e Auditoria

### Ferramentas Recomendadas

```bash
# Bundler Audit - escanear gems conhecidas
gem install bundler-audit
bundle audit check --update

# Dependabot - automatizado no GitHub
# Já configurado em .github/dependabot.yml
```

### Processo de Atualização

1. Dependabot abre PR automaticamente
2. CI executa testes
3. Revisar changelog da dependência
4. Testar localmente se mudanças breaking
5. Merge após validação

## Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Ruby Security](https://rubysec.com/)
- [Jekyll Security](https://jekyllrb.com/docs/security/)

## Contato

Para questões de segurança:

- **GitHub Security Advisory**: [Criar advisory](https://github.com/gatilhoroxo/site-attempt/security/advisories/new)
- **Issues públicas**: [Abrir issue](https://github.com/gatilhoroxo/site-attempt/issues/new) com tag `security`

## Reconhecimentos

Agradecemos aos seguintes pesquisadores de segurança:

*(Nenhum reporte recebido ainda)*

---

**Última atualização**: Fevereiro de 2026  
**Próxima revisão**: Agosto de 2026
