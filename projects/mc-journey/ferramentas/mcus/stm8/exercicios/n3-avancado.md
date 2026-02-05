---
layout: default
title: N3 Avancado
---


## 📚 NÍVEL 3 - AVANÇADO (Semanas 11-14)

### Tópicos Avançados

#### 1. Watchdog Timer (Sistema Crítico)
```c
#include <stdint.h>

#define IWDG_KR  (*(volatile uint8_t *)0x50E0)
#define IWDG_PR  (*(volatile uint8_t *)0x50E1)
#define IWDG_RLR (*(volatile uint8_t *)0x50E2)

void watchdog_init(void) {
    // Desbloquear watchdog
    IWDG_KR = 0x55;
    
    // Prescaler = 64 -> ~250ms com RLR=255
    IWDG_PR = 0x03;
    IWDG_RLR = 255;
    
    // Refresh
    IWDG_KR = 0xAA;
    
    // Habilitar
    IWDG_KR = 0xCC;
}

void watchdog_refresh(void) {
    IWDG_KR = 0xAA;
}

void main(void) {
    watchdog_init();
    
    while(1) {
        // Código crítico
        do_important_work();
        
        // DEVE resetar watchdog regularmente
        watchdog_refresh();
        
        // Se travar, watchdog reseta MCU!
    }
}
```

#### 2. Low Power Modes
```c
#include <stdint.h>

void enter_halt_mode(void) {
    // Desabilitar periféricos desnecessários
    CLK_PCKENR1 = 0x00;
    
    // Entrar em halt (wake-up por interrupção)
    __asm__("halt");
    
    // Acordou! Reconfigurar clock
    CLK_PCKENR1 = 0xFF;
}

void main(void) {
    gpio_init();
    
    // Configurar interrupção externa
    // (ex: botão wake-up)
    
    while(1) {
        printf("Trabalhando...\n");
        delay_ms(1000);
        
        printf("Dormindo...\n");
        delay_ms(100);
        
        enter_halt_mode();
        
        printf("Acordei!\n");
    }
}
```

---

### 🎯 PROJETO NÍVEL 3: Sistema de Alarme Residencial

**Descrição:** Sistema completo de alarme com múltiplos sensores.

**Componentes:**
- STM8S103F3
- Sensores PIR (movimento)
- Sensores magnéticos (porta/janela)
- Sirene (buzzer potente)
- Teclado matricial 4x4
- Display LCD 16x2 (I2C)
- LED RGB (status)
- EEPROM externa (logs)

**Funcionalidades:**
1. Monitorar 8 zonas diferentes
2. Senha para armar/desarmar
3. Log de eventos em EEPROM
4. Envio de alertas via UART (módulo GSM)
5. Watchdog para confiabilidade
6. Bateria backup (funciona sem energia)
7. Delay de saída/entrada

**Características de Sistema Crítico:**
- Código otimizado (memória limitada)
- Debounce robusto
- Watchdog sempre ativo
- Fail-safe mechanisms
- Consumo ultra-baixo em standby

---
