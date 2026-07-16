/**
 * Code Block Accessibility Enhancement
 * Adiciona atributos de acessibilidade aos blocos de código
 */

(function() {
  'use strict';

  /**
   * Inicializa acessibilidade dos blocos de código
   */
  function initCodeAccessibility() {
    // Seleciona todos os elementos pre com conteúdo que pode ter scroll
    const codeBlocks = document.querySelectorAll('pre.highlight, pre code');
    
    codeBlocks.forEach((block, index) => {
      const preElement = block.tagName === 'PRE' ? block : block.closest('pre');
      
      if (preElement && !preElement.hasAttribute('tabindex')) {
        // Adiciona tabindex para tornar focável via teclado
        preElement.setAttribute('tabindex', '0');
        
        // Adiciona role e aria-label para screen readers
        preElement.setAttribute('role', 'region');
        preElement.setAttribute('aria-label', `Bloco de código ${index + 1}`);
        
        // Adiciona dica visual ao focar
        preElement.addEventListener('focus', function() {
          this.style.outlineOffset = '2px';
        });
      }
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeAccessibility);
  } else {
    initCodeAccessibility();
  }
})();
