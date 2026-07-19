---
layout: default
title: ⚡ Roadmap Detalhado - STM8
---

# ⚡ Roadmap Detalhado - STM8

## 📌 Por Que STM8 Por Último?

Se os outros MCUs eram membros da tripulação do Luffy, o STM8 é o **Roronoa Zoro treinando com Mihawk** - não tem luxos, não tem abstrações, é você, o hardware e suas habilidades puras. É o treino mais duro, mas que te transforma em mestre!

### Características do STM8
- ⚠️ **8-bit** (vs 32-bit dos outros)
- ⚠️ **Até 16MHz** (vs 133MHz do RP2040)
- ⚠️ **1-8KB RAM** (vs 264KB do RP2040)
- ⚠️ **8-128KB Flash** (vs 2MB do RP2040)
- ✅ **Extremamente barato** (~$0.20)
- ✅ **Baixíssimo consumo** (ideal para bateria)
- ✅ **Periféricos robustos**
- ✅ **Perfeito para sistemas críticos**

### Por Que Aprender STM8?

Você vai aprender:
1. **Programação bare metal real** (nada de abstrações)
2. **Leitura intensiva de datasheets** (habilidade crucial)
3. **Otimização extrema** (cada byte conta!)
4. **Arquitetura de hardware** (registradores, clocks, periféricos)
5. **Sistemas embarcados de verdade** (como é na indústria automotiva/industrial)

**Analogia One Piece:** É como treinar Haki do Armamento - você precisa dominar o básico até se tornar segunda natureza!

---

## 🛠️ Configuração Inicial (Semana 1-2)

### Ferramentas Necessárias

#### 1. Compilador SDCC (Open Source)
```bash
# Linux
sudo apt install sdcc

# Windows
# Baixar de: http://sdcc.sourceforge.net/

# Verificar instalação
sdcc --version
```

#### 2. Programador ST-LINK V2
- Hardware necessário para gravar o STM8
- Clone chinês (~$3) funciona perfeitamente
- Conexões: SWIM, RST, VCC, GND

#### 3. STM8Flash (Ferramenta de Gravação)
```bash
git clone https://github.com/vdudouyt/stm8flash.git
cd stm8flash
make
sudo make install
```

#### 4. Editor/IDE
- VS Code + Extensão C/C++
- Ou qualquer editor de texto

---

### Primeiro Projeto: Blink LED Bare Metal

**Estrutura:**
```
projeto_stm8/
├── main.c
├── stm8s.h           # Registradores
├── stm8s_conf.h
├── Makefile
└── README.md
```

**Makefile:**
```makefile
# Configurações
CC = sdcc
CFLAGS = -mstm8 --std-sdcc99 --opt-code-size
TARGET = main
MCU = stm8s103f3

# Compilação
all: $(TARGET).ihx

$(TARGET).ihx: $(TARGET).c
	$(CC) $(CFLAGS) $(TARGET).c -o $(TARGET).ihx

# Gravação
flash: $(TARGET).ihx
	stm8flash -c stlinkv2 -p $(MCU) -w $(TARGET).ihx

# Limpeza
clean:
	rm -f *.asm *.lst *.rel *.rst *.sym *.ihx *.lk *.map *.mem

.PHONY: all flash clean
```

---

### Seu Primeiro "Hello World" (LED Blink)

**Entendendo os Registradores:**

No STM8, você controla TUDO via registradores. Não existe `digitalWrite()` ou `gpio_put()`. Você escreve diretamente na memória mapeada!

```c
// main.c
#include <stdint.h>

// ========================================
// REGISTRADORES DO STM8S103F3
// ========================================

// Clock Control Register (CLK)
#define CLK_DIVR   (*(volatile uint8_t *)0x50C6)
#define CLK_PCKENR1 (*(volatile uint8_t *)0x50C7)

// Port B Registers (LED normalmente em PB5)
#define PB_ODR  (*(volatile uint8_t *)0x5005)  // Output Data Register
#define PB_IDR  (*(volatile uint8_t *)0x5006)  // Input Data Register
#define PB_DDR  (*(volatile uint8_t *)0x5007)  // Data Direction Register
#define PB_CR1  (*(volatile uint8_t *)0x5008)  // Control Register 1
#define PB_CR2  (*(volatile uint8_t *)0x5009)  // Control Register 2

// ========================================
// DELAY SIMPLES (BLOQUEANTE)
// ========================================
void delay_ms(uint16_t ms) {
    uint16_t i;
    uint8_t j;
    
    for(i = 0; i < ms; i++) {
        for(j = 0; j < 120; j++) {
            // Loop vazio para delay
            // ~1ms a 16MHz (aproximado)
        }
    }
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================
void main(void) {
    // 1. Configurar Clock
    CLK_DIVR = 0x00;  // Sem divisão = 16MHz
    
    // 2. Configurar PB5 como saída (LED)
    PB_DDR |= (1 << 5);   // 1 = Output, 0 = Input
    PB_CR1 |= (1 << 5);   // 1 = Push-pull, 0 = Pseudo open-drain
    PB_CR2 &= ~(1 << 5);  // 0 = Até 2MHz, 1 = Até 10MHz
    
    // 3. Loop infinito
    while(1) {
        PB_ODR |= (1 << 5);   // Liga LED (bit 5 = 1)
        delay_ms(1000);
        
        PB_ODR &= ~(1 << 5);  // Desliga LED (bit 5 = 0)
        delay_ms(1000);
    }
}
```

**Compilar e Gravar:**
```bash
make
make flash
```

---

## 📚 Entendendo os Registradores

### O Que São Registradores?

Registradores são **posições específicas de memória** que controlam o hardware. Cada bit tem uma função específica.

**Analogia One Piece:** Pense nos registradores como os **botões de controle do Going Merry**. Cada botão (bit) controla algo específico: velas, leme, âncora, etc.

### Anatomia de um Registrador GPIO

```
PB_DDR (Data Direction Register) - Endereço: 0x5007
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 7 │ 6 │ 5 │ 4 │ 3 │ 2 │ 1 │ 0 │  <- Bit
└───┴───┴───┴───┴───┴───┴───┴───┘
 PB7 PB6 PB5 PB4 PB3 PB2 PB1 PB0  <- Pino

Para cada bit:
0 = Input (entrada)
1 = Output (saída)

Exemplo: PB_DDR = 0b00100000 (0x20)
         Configura PB5 como output, resto como input
```

### Manipulação de Bits

```c
// Setar bit (ligar)
PB_ODR |= (1 << 5);    // Liga PB5
// Operação: PB_ODR = PB_ODR | 0b00100000

// Limpar bit (desligar)
PB_ODR &= ~(1 << 5);   // Desliga PB5
// Operação: PB_ODR = PB_ODR & 0b11011111

// Toggle bit (inverter)
PB_ODR ^= (1 << 5);    // Inverte PB5

// Ler bit
if(PB_IDR & (1 << 5)) {
    // PB5 está HIGH
}

// Setar múltiplos bits
PB_DDR |= (1 << 5) | (1 << 4) | (1 << 3);  // PB5, PB4, PB3

// Limpar múltiplos bits
PB_ODR &= ~((1 << 5) | (1 << 4));
```

---

## 📚 NÍVEL 1 - BÁSICO (Semanas 3-6)

### Semana 3: Leitura de Botão

#### Exercício 1: Botão Controla LED

---

#### Exercício 2: Debounce em Software

---

### Semana 4: Timers (Hardware Timing)

#### Exercício 3: Timer Básico com Interrupt

---

### Semana 5: PWM (Controle de Brilho)

#### Exercício 4: PWM no Timer 2

---

### Semana 6: ADC (Leitura Analógica)

#### Exercício 5: Ler Potenciômetro

---

### 🎯 PROJETO NÍVEL 1: Controle de Velocidade de Motor DC

**Descrição:** Controlar velocidade de motor DC com potenciômetro e display 7-seg.

**Componentes:**
- STM8S103F3
- Potenciômetro 10kΩ
- Driver motor L293D
- Motor DC 6V
- Display 7-seg (velocidade em %)
- LEDs indicadores

**Funcionalidades:**
1. Ler potenciômetro via ADC
2. Gerar PWM para motor
3. Mostrar velocidade em display
4. Botão de emergência (para tudo)

---

## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 7-10)

### Semana 7-8: UART (Comunicação Serial)

#### Exercício 6: Printf via UART

---

### Semana 9: I2C (Display OLED)

#### Exercício 7: I2C Master

---

### 🎯 PROJETO NÍVEL 2: Data Logger com EEPROM

**Descrição:** Sistema que lê sensores e salva dados na EEPROM interna.

**Funcionalidades:**
1. Ler temperatura e umidade (sensor I2C)
2. Salvar na EEPROM a cada minuto
3. Display mostra último valor
4. UART para dump de dados
5. Continua funcionando após reset

---

## 📚 NÍVEL 3 - AVANÇADO (Semanas 11-14)

### Tópicos Avançados

1. Watchdog Timer (Sistema Crítico)
2. Low Power Modes

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

## 📖 REFERÊNCIAS ESPECÍFICAS STM8

### Documentação Essencial
1. **STM8S Reference Manual (RM0016)** - Bíblia dos registradores
2. **STM8S103F3 Datasheet** - Seu modelo específico
3. **Programming Manual (PM0051)** - Instruções assembly
4. **SDCC User Guide** - Compilador

### Livros
- "The Definitive Guide to ARM Cortex-M3 and Cortex-M4" (aplica conceitos)
- "Embedded Systems Design" - Steve Heath

### Ferramentas Online
- **STM8 Peripherals Explorer** - Calculadora de registradores
- **SDCC Forum** - Comunidade ativa

### Projetos de Referência
- https://github.com/gicking/STM8-SPL_SDCC_patch
- https://github.com/TG9541/stm8ef (Forth para STM8)

---

## 💡 Dicas Específicas STM8

### Leitura de Datasheet
```
Processo sistemático:
1. Encontre o periférico (ex: UART)
2. Leia "Functional Description"
3. Vá para "Register Description"
4. Anote endereços dos registradores
5. Desenhe diagrama de bits
6. Implemente passo-a-passo
```

### Otimização de Memória
```c
// Use uint8_t sempre que possível
uint8_t counter;  // 1 byte

// Evite float! (ocupa MUITA memória)
// Use inteiros x10 ou x100
int16_t temp_celsius_x10;  // 235 = 23.5°C

// Constantes em PROGMEM (flash)
const uint8_t __at(0x8000) lookup_table[] = {...};

// Bits em structs
typedef struct {
    uint8_t bit0 : 1;
    uint8_t bit1 : 1;
    // ... economiza memória!
} flags_t;
```

### Debugging STM8
```c
// LED de debug
#define DEBUG_LED PB_ODR, 5
DEBUG_LED |= (1 << 5);  // Liga

// Printf via UART
printf("Debug: var=%d\n", var);

// Piscar padrões morse
// Ex: 3 piscadas rápidas = erro no sensor
```

### Assembly Inline
```c
// Às vezes necessário para otimização extrema
void critical_section(void) {
    __asm__("sim");  // Desabilita interrupts
    
    // Código crítico
    
    __asm__("rim");  // Habilita interrupts
}
```

---

## 🎓 Reflexão Final

Parabéns por chegar até aqui! O STM8 é onde você realmente aprende **como as coisas funcionam por baixo do capô**.

**O que você ganhou:**
- Leitura fluente de datasheets
- Domínio de registradores
- Otimização extrema
- Pensamento bare metal
- Base sólida para qualquer MCU

**Próximos passos:**
- STM32 (32-bit da mesma família)
- AVR (Arduino sem abstrações)
- PIC (industrial)
- ARM Cortex-M (mais poderosos)

Você agora tem as ferramentas para trabalhar em:
- Automotivo (controle de injeção, ABS, etc.)
- Industrial (PLCs, sensores)
- Aeroespacial (sistemas críticos)
- Médico (dispositivos implantáveis)

**Lembre-se:** Todo sistema embarcado complexo é feito de conceitos simples que você dominou aqui!

---

*"O mar é vasto, mas todo navegador começa com o básico!"* 🌊⛵