---
layout: default
title: Compilar e verificar uso de memória
---

## 📚 NÍVEL 3 - AVANÇADO (Semanas 9-12)

**Progresso:** [ ] Semana 9 | [ ] Semana 10 | [ ] Semana 11 | [ ] Semana 12 | [ ] Projeto Final

---

## 📑 Índice

### [Semana 9: Manipulação Direta de Registradores](#semana-9-manipulação-direta-de-registradores)
- [Exercício 17: GPIO com Registradores (PORT, DDR, PIN)](#exercício-17-gpio-com-registradores-port-ddr-pin)
- [Exercício 18: PWM com Registradores Timer](#exercício-18-pwm-com-registradores-timer)

### [Semana 10: Timer Interrupts Avançado](#semana-10-timer-interrupts-avançado)
- [Exercício 19: Timer1 Interrupt (CTC Mode)](#exercício-19-timer1-interrupt-ctc-mode)
- [Exercício 20: Geração de Tons Precisos](#exercício-20-geração-de-tons-precisos)

### [Semana 11: Power Management e Watchdog](#semana-11-power-management-e-watchdog)
- [Exercício 21: Sleep Modes (Power Down)](#exercício-21-sleep-modes-power-down)
- [Exercício 22: Watchdog Timer](#exercício-22-watchdog-timer)

### [Semana 12: Bibliotecas Customizadas](#semana-12-bibliotecas-customizadas)
- [Exercício 23: Criar Biblioteca Própria](#exercício-23-criar-biblioteca-própria)
- [Exercício 24: Otimização de Performance](#exercício-24-otimização-de-performance)

### [🎯 Projeto Final: Sistema de Aquisição de Dados](#-projeto-final-sistema-de-aquisição-de-dados)

### [⚠️ Problemas Comuns e Soluções](#️-problemas-comuns-e-soluções)

### [🔗 Próximos Passos](#-próximos-passos)

---

## Semana 9: Manipulação Direta de Registradores

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 14-16 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** Register manipulation, bitwise operations, ATmega328P datasheet
- ✅ **Checklist:** [ ] Exercício 17 | [ ] Exercício 18

### 📖 Fundamentos - Registradores do ATmega328P

**Por que usar Registradores?**
- ✅ **Performance:** 20-40x mais rápido que digitalWrite()
- ✅ **Controle preciso:** Acesso direto ao hardware
- ✅ **Menor código:** Footprint reduzido
- ✅ **Múltiplos pinos:** Controlar 8 pinos simultaneamente
- ⚠️ **Complexidade:** Requer conhecimento do datasheet
- ⚠️ **Portabilidade:** Código específico para ATmega328P

**Comparação Arduino vs Bare-Metal:**
```cpp
// Arduino abstraction (lento)
digitalWrite(13, HIGH);  // ~50 ciclos de clock

// Registradores (rápido)
PORTB |= (1 << PB5);     // 2 ciclos de clock
```

**Registradores GPIO:**
- **DDRx (Data Direction Register):** Configura pino como INPUT (0) ou OUTPUT (1)
- **PORTx (Port Output Register):** Escreve HIGH (1) ou LOW (0) em OUTPUT, ou ativa pull-up em INPUT
- **PINx (Port Input Register):** Lê estado do pino

**Mapeamento Arduino → ATmega328P:**
```
Arduino UNO Pinout:
Pinos 0-7   → PORTD (PD0-PD7)
Pinos 8-13  → PORTB (PB0-PB5)
Pinos A0-A5 → PORTC (PC0-PC5)

Exemplos:
Arduino 13 = PORTB bit 5 (PB5)
Arduino 12 = PORTB bit 4 (PB4)
Arduino 8  = PORTB bit 0 (PB0)
Arduino 7  = PORTD bit 7 (PD7)
Arduino 0  = PORTD bit 0 (PD0) - RX
Arduino 1  = PORTD bit 1 (PD1) - TX
Arduino A0 = PORTC bit 0 (PC0)
```

**Operações Bitwise:**
```cpp
// Setar bit (ligar)
PORTB |= (1 << PB5);    // PB5 = 1, outros bits inalterados

// Limpar bit (desligar)
PORTB &= ~(1 << PB5);   // PB5 = 0, outros bits inalterados

// Toggle bit
PORTB ^= (1 << PB5);    // Inverte PB5

// Ler bit
if (PINB & (1 << PB5))  // Verifica se PB5 está HIGH

// Setar múltiplos bits
PORTB |= (1 << PB5) | (1 << PB4);  // Liga PB5 e PB4

// Escrever valor completo (cuidado!)
PORTB = 0b00101100;     // Sobrescreve todos os 8 bits
```

**Datasheet Essencial:**
- **ATmega328P Datasheet:** https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf
- Seções importantes:
  - 13. I/O Ports (GPIO)
  - 14. 8-bit Timer/Counter0
  - 15. 16-bit Timer/Counter1
  - 19. Analog-to-Digital Converter

---

### Exercício 17: GPIO com Registradores (PORT, DDR, PIN)

**Objetivo:** Controlar LEDs e ler botões usando registradores

**Componentes Necessários:**
- 3x LEDs (vermelho, amarelo, verde)
- 3x Resistores 220Ω
- 1x Botão
- Jumpers

**Conceitos:**
- DDRx para configurar direção
- PORTx para escrever
- PINx para ler
- Bitwise operations
- Arduino vs bare-metal comparison

**Circuito:**
```
LEDs (PORTB):
  Pino 13 (PB5) → LED Vermelho → 220Ω → GND
  Pino 12 (PB4) → LED Amarelo → 220Ω → GND
  Pino 11 (PB3) → LED Verde → 220Ω → GND

Botão (PORTD):
  Pino 2 (PD2) → Botão → GND (usaremos pull-up interno)
```

**Resultados Esperados:**
- digitalWrite(): ~500-600 us para 10k iterações
- Registradores: ~20-30 us para 10k iterações
- **Speedup: ~20-30x mais rápido!**

**Desafios:**
1. 🟢 **Fácil:** Criar padrão binário crescente (000 → 001 → 010 → 011 → 100 → 101 → 110 → 111)
2. 🟡 **Médio:** Ler 3 botões e exibir estado em binário nos LEDs (sem usar if/else, apenas operações bitwise)
3. 🔴 **Difícil:** Implementar debounce por hardware usando capacitor + interrupt

---

### Exercício 18: PWM com Registradores Timer

**Objetivo:** Gerar PWM controlando diretamente Timer1

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- Timer/Counter registers
- Fast PWM mode
- Prescaler
- OCR1A/OCR1B (Output Compare Register)
- Frequência PWM customizada

**Circuito:**
```
LED: Pino 9 (PB1/OC1A) → Resistor 220Ω → LED → GND
```

**Timer1 Modes:**
- **Normal:** Conta de 0 a 0xFFFF e overflow
- **CTC (Clear Timer on Compare):** Conta até OCR1A e reseta
- **Fast PWM:** PWM com frequência fixa
- **Phase Correct PWM:** PWM com frequência variável

**Fórmula Frequência PWM:**
```
PWM_freq = F_CPU / (Prescaler × (1 + TOP))

Onde:
- F_CPU = 16MHz (Arduino UNO)
- Prescaler = 1, 8, 64, 256, 1024
- TOP = valor máximo (0xFF para 8-bit, 0xFFFF para 16-bit)
```

**Modos Timer1:**
```cpp
// Fast PWM 8-bit (0-255)
TCCR1A = (1 << COM1A1) | (1 << WGM10);
TCCR1B = (1 << WGM12) | (1 << CS11);  // Prescaler 8
OCR1A = 128;  // Duty cycle

// Fast PWM 9-bit (0-511)
TCCR1A = (1 << COM1A1) | (1 << WGM11);
TCCR1B = (1 << WGM12) | (1 << CS11);
OCR1A = 256;

// Fast PWM 10-bit (0-1023)
TCCR1A = (1 << COM1A1) | (1 << WGM11) | (1 << WGM10);
TCCR1B = (1 << WGM12) | (1 << CS11);
OCR1A = 512;

// Fast PWM com ICR1 como TOP (frequência customizada)
TCCR1A = (1 << COM1A1) | (1 << WGM11);
TCCR1B = (1 << WGM13) | (1 << WGM12) | (1 << CS11);
ICR1 = 999;   // TOP (define frequência)
OCR1A = 500;  // Duty cycle
```

**Desafios:**
1. 🟢 **Fácil:** Gerar PWM de 20kHz (ultrassônico) no pino 10 (OC1B)
2. 🟡 **Médio:** Criar PWM com frequência variável controlada por potenciômetro (100Hz - 10kHz)
3. 🔴 **Difícil:** Gerar dois sinais PWM com phase shift de 90° (quadratura)

---

## Semana 10: Timer Interrupts Avançado

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 12-14 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** Timer interrupts, CTC mode, tone generation, real-time tasks
- ✅ **Checklist:** [ ] Exercício 19 | [ ] Exercício 20

### 📖 Fundamentos - Timer Interrupts

**Por que Timer Interrupts?**
- ✅ Execução precisa de tarefas periódicas
- ✅ Não depende de loop() (timing garantido)
- ✅ Múltiplas tarefas "simultâneas"
- ✅ Base para RTOS (Real-Time Operating System)

**Timers do ATmega328P:**
- **Timer0:** 8-bit, usado por millis() e delay() (evitar!)
- **Timer1:** 16-bit, mais preciso e flexível (recomendado)
- **Timer2:** 8-bit, independente

**CTC Mode (Clear Timer on Compare):**
- Timer conta de 0 até OCR1A
- Ao atingir OCR1A, gera interrupt e reseta para 0
- Frequência precisa de interrupção

**Fórmula Interrupt Frequency:**
```
F_interrupt = F_CPU / (Prescaler × (1 + OCR1A))

Exemplo: 1Hz (1 segundo)
16MHz / (1024 × (1 + 15624)) = 1Hz
OCR1A = 15624
```

**ISR (Interrupt Service Routine):**
```cpp
ISR(TIMER1_COMPA_vect) {
  // Código executado a cada interrupt
  // Deve ser RÁPIDO!
}
```

**Registradores Timer1:**
```cpp
TCCR1A  // Timer/Counter Control Register A
TCCR1B  // Timer/Counter Control Register B
TCNT1   // Timer/Counter (valor atual)
OCR1A   // Output Compare Register A (comparação)
OCR1B   // Output Compare Register B
TIMSK1  // Timer Interrupt Mask Register
TIFR1   // Timer Interrupt Flag Register
```

---

### Exercício 19: Timer1 Interrupt (CTC Mode)

**Objetivo:** Executar tarefas periódicas com Timer1 interrupt

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- CTC mode
- ISR (Interrupt Service Routine)
- Cálculo de OCR1A
- Volatile variables
- Tarefas periódicas precisas

**Circuito:**
```
LED: Pino 13 → Resistor 220Ω → LED → GND
```

**Tabela de Prescaler:**
```
Prescaler 1:    CS12=0, CS11=0, CS10=1
Prescaler 8:    CS12=0, CS11=1, CS10=0
Prescaler 64:   CS12=0, CS11=1, CS10=1
Prescaler 256:  CS12=1, CS11=0, CS10=0
Prescaler 1024: CS12=1, CS11=0, CS10=1
```

**Cálculo de OCR1A (Exemplos):**
```cpp
// 1Hz (1 segundo): OCR1A = 15624
// 10Hz (100ms):    OCR1A = 1562
// 100Hz (10ms):    OCR1A = 155
// 1kHz (1ms):      OCR1A = 15 (prescaler 1024)
// 1kHz (1ms):      OCR1A = 249 (prescaler 64)
```

**Desafios:**
1. 🟢 **Fácil:** Criar relógio digital (horas:minutos:segundos) com 3 interrupts
2. 🟡 **Médio:** Implementar scheduler simples (executar 5 tarefas em períodos diferentes)
3. 🔴 **Difícil:** Criar encoder de quadratura por software (gerar sinais A/B em fase)

---

### Exercício 20: Geração de Tons Precisos

**Objetivo:** Gerar notas musicais com Timer2

**Componentes Necessários:**
- 1x Buzzer piezoelétrico
- Jumpers

**Conceitos:**
- Timer2 (8-bit)
- Toggle OC2A
- Frequências musicais
- Melodias

**Circuito:**
```
Buzzer: Pino 11 (PB3/OC2A) → Buzzer → GND
```

**Frequências Musicais (Notas):**
```cpp
#define NOTE_C4  262  // Dó
#define NOTE_D4  294  // Ré
#define NOTE_E4  330  // Mi
#define NOTE_F4  349  // Fá
#define NOTE_G4  392  // Sol
#define NOTE_A4  440  // Lá
#define NOTE_B4  494  // Si
#define NOTE_C5  523  // Dó (oitava acima)

#define NOTE_REST 0   // Pausa
```

**Tabela de Frequências Musicais:**
```
Nota  | Frequência (Hz)
------|----------------
C4    | 261.63
C#4   | 277.18
D4    | 293.66
D#4   | 311.13
E4    | 329.63
F4    | 349.23
F#4   | 369.99
G4    | 392.00
G#4   | 415.30
A4    | 440.00
A#4   | 466.16
B4    | 493.88
C5    | 523.25
```

**Desafios:**
1. 🟢 **Fácil:** Tocar melodia "Happy Birthday"
2. 🟡 **Médio:** Criar sintetizador controlado por 8 botões (escala musical)
3. 🔴 **Difícil:** Gerar acordes (3 notas simultâneas) usando múltiplos timers

---

## Semana 11: Power Management e Watchdog

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 10-12 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** Sleep modes, power optimization, watchdog timer, low-power design
- ✅ **Checklist:** [ ] Exercício 21 | [ ] Exercício 22

### 📖 Fundamentos - Power Management

**Por que Power Management?**
- ✅ Economia de energia (baterias duram mais)
- ✅ Redução de calor
- ✅ Projetos IoT e wearables
- ✅ Conformidade com normas (ex: Energy Star)

**Consumo Arduino UNO:**
- **Ativo (16MHz):** ~50mA
- **Idle:** ~15mA
- **Power-down:** ~0.1mA (100µA)
- **Desligado:** ~0.01mA (10µA)

**Sleep Modes ATmega328P:**
1. **Idle:** CPU para, periféricos ativos (~15mA)
2. **ADC Noise Reduction:** Para CPU e ADC clock
3. **Power-down:** Para tudo exceto WDT e interrupts externos (~0.1mA)
4. **Power-save:** Similar ao Power-down, mas Timer2 ativo
5. **Standby:** Oscilador ativo, CPU parada
6. **Extended Standby:** Timer2 + oscilador ativo

**Wake-up Sources:**
- Interrupt externo (pinos 2 e 3)
- Pin change interrupt (qualquer pino)
- Watchdog Timer
- Timer2 (Power-save mode)
- TWI/I2C address match

**Biblioteca avr/sleep.h:**
```cpp
#include <avr/sleep.h>
#include <avr/power.h>

set_sleep_mode(SLEEP_MODE_PWR_DOWN);  // Define modo
sleep_enable();                        // Habilita sleep
sleep_mode();                          // Entra em sleep
sleep_disable();                       // Desabilita após acordar
```

---

### Exercício 21: Sleep Modes (Power Down)

**Objetivo:** Reduzir consumo com Power-down mode

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- 1x Botão
- Jumpers
- (Opcional: multímetro para medir corrente)

**Conceitos:**
- Sleep modes
- Wake-up por interrupt externo
- Power optimization
- Medição de consumo

**Circuito:**
```
LED: Pino 13 → Resistor 220Ω → LED → GND
Botão: Pino 2 (INT0) → Botão → GND (INPUT_PULLUP)
```

**Resultados Esperados (com multímetro):**
- Modo ativo: ~40-50mA
- Power-down: ~0.1-0.5mA (depende do regulador da placa)
- **Redução: ~99% de economia!**

**Otimizações Adicionais:**
```cpp
// Desabilitar LED power (economiza ~5mA)
// Requer modificação física: remover LED ou cortar trilha

// Desabilitar regulador de tensão
// Alimentar direto em 3.3V no pino VCC

// Usar ATmega328P standalone (sem UNO)
// Consumo pode chegar a <1µA em power-down
```

**Desafios:**
1. 🟢 **Fácil:** Criar datalogger que acorda a cada 10 minutos (usando WDT)
2. 🟡 **Médio:** Implementar debounce sem delay() no wake-up
3. 🔴 **Difícil:** Criar sensor de temperatura que acorda por mudança de temperatura (comparador analógico)

---

### Exercício 22: Watchdog Timer

**Objetivo:** Usar Watchdog para reset automático e wake-up

**Componentes Necessários:**
- Apenas Arduino UNO

**Conceitos:**
- Watchdog Timer (WDT)
- System reset
- Wake-up periódico
- Failsafe mechanism

**O que é Watchdog Timer?**
- Timer independente que reseta MCU se não for "alimentado"
- Detecta travamentos (infinite loops, crashes)
- Pode acordar MCU de sleep periodicamente
- Timeouts: 16ms, 32ms, 64ms, 125ms, 250ms, 500ms, 1s, 2s, 4s, 8s

**Circuito:**
```
Apenas Arduino UNO (sem componentes externos)
```

**Timeouts Disponíveis:**
```cpp
WDTO_15MS   // 15ms
WDTO_30MS   // 30ms
WDTO_60MS   // 60ms
WDTO_120MS  // 120ms
WDTO_250MS  // 250ms
WDTO_500MS  // 500ms
WDTO_1S     // 1 segundo
WDTO_2S     // 2 segundos
WDTO_4S     // 4 segundos
WDTO_8S     // 8 segundos
```

**Desafios:**
1. 🟢 **Fácil:** Criar contador de resets (salvar na EEPROM)
2. 🟡 **Médio:** Implementar logger que acorda a cada 1 minuto (combinar WDT 8s)
3. 🔴 **Difícil:** Criar sistema de recuperação de falhas (bootloader customizado)

---

## Semana 12: Bibliotecas Customizadas

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 12-14 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** C++ classes, library development, API design, optimization
- ✅ **Checklist:** [ ] Exercício 23 | [ ] Exercício 24

### 📖 Fundamentos - Criação de Bibliotecas

**Por que criar bibliotecas?**
- ✅ Reutilização de código
- ✅ Organização e modularidade
- ✅ Compartilhamento com comunidade
- ✅ Abstração de hardware
- ✅ API limpa e consistente

**Estrutura de uma Biblioteca:**
```
MyLibrary/
├── src/
│   ├── MyLibrary.h      # Header (declarações)
│   └── MyLibrary.cpp    # Implementation
├── examples/
│   └── BasicUsage/
│       └── BasicUsage.ino
├── keywords.txt         # Syntax highlighting
├── library.properties   # Metadata
└── README.md
```

**Boas Práticas:**
- Classes em C++ (encapsulamento)
- `begin()` para inicialização
- Construtores leves
- Documentação clara
- Exemplos funcionais
- Compatibilidade com múltiplas placas

---

### Exercício 23: Criar Biblioteca Própria

**Objetivo:** Criar biblioteca para controle de LED RGB

**Componentes Necessários:**
- 1x LED RGB (cátodo comum)
- 3x Resistores 220Ω
- Jumpers

**Conceitos:**
- C++ classes
- Header files (.h)
- Implementation files (.cpp)
- API design
- Keywords.txt

**Circuito:**
```
LED RGB (cátodo comum):
  Cátodo → GND
  R → Pino 9 (PWM)
  G → Pino 10 (PWM)
  B → Pino 11 (PWM)
  (cada anodo com resistor 220Ω)
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar método `breathe()` (fade in/out contínuo)
2. 🟡 **Médio:** Implementar conversão HSV → RGB completa
3. 🔴 **Difícil:** Criar biblioteca para matriz de LEDs 8x8

---

### Exercício 24: Otimização de Performance

**Objetivo:** Comparar e otimizar código Arduino vs bare-metal

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- Profiling de código
- Otimizações de compilador
- Inline functions
- Lookup tables
- Memory footprint

**Circuito:**
```
LED: Pino 13 → Resistor 220Ω → LED → GND
```

**Código Completo:** Ver [`k1-otimizacao/performance_test.ino`](k1-otimizacao/performance_test.ino)

**Principais Técnicas de Otimização:**

1. **Registradores vs digitalWrite:**
   - 20-30x mais rápido
   - Controle simultâneo de múltiplos pinos

2. **Inline functions vs Normal:**
   - Elimina overhead de chamada
   - Aumenta tamanho do código (trade-off)

3. **Lookup Tables vs Cálculo:**
   - Troca cálculo por memória
   - Ideal para trigonometria, exponenciais

4. **PROGMEM para Constantes:**
   - Salva constantes na Flash (32KB)
   - Libera RAM (2KB) para variáveis

**Análise de Memória:**
```bash
# Compilar e verificar uso de memória
pio run -t size

# Saída esperada:
# Flash: 1234 bytes (3.8%)
# RAM:   456 bytes (22.3%)
```

**Flags de Otimização (platformio.ini):**
```ini
[env:uno_optimized]
platform = atmelavr
board = uno
framework = arduino
build_flags = 
    -O3                    # Otimização máxima
    -flto                  # Link-time optimization
    -fno-exceptions        # Desabilita exceptions
    -fno-rtti              # Desabilita RTTI
    -ffunction-sections    # Cada função em seção própria
    -fdata-sections        # Cada dado em seção própria
    -Wl,--gc-sections      # Remove seções não usadas
```

**Desafios:**
1. 🟢 **Fácil:** Comparar uso de memória: String vs char[] vs F()
2. 🟡 **Médio:** Otimizar algoritmo de ordenação (bubble sort vs quick sort)
3. 🔴 **Difícil:** Criar FFT (Fast Fourier Transform) otimizado para ADC

---

## 🎯 Projeto Final: Sistema de Aquisição de Dados

**Objetivo:** Criar datalogger completo com múltiplos sensores

**Tempo estimado:** 12-16 horas

**Componentes Necessários:**
- 1x Arduino UNO
- 1x Sensor BME280 (temperatura, umidade, pressão)
- 1x RTC DS3231 (relógio tempo real)
- 1x Módulo SD card
- 1x Display LCD 16x2 I2C
- 2x Botões (menu, select)
- 1x LED RGB
- 1x Buzzer
- Resistores, jumpers

**Funcionalidades:**

1. **Aquisição de Dados:**
   - Ler BME280 a cada 10 segundos
   - Timestamp via RTC
   - Salvar em CSV no SD card

2. **Interface LCD:**
   - Mostrar leituras em tempo real
   - Menu de configuração
   - Status do sistema

3. **Power Management:**
   - Sleep mode entre leituras
   - Acordar via Timer interrupt
   - Consumo otimizado

4. **Alertas:**
   - LED RGB indica status (verde=ok, amarelo=alerta, vermelho=erro)
   - Buzzer para alarmes (temperatura > limite)
   - Log de eventos

5. **Configuração:**
   - Intervalo de aquisição (5s-1h)
   - Limites de alarme
   - Formato de timestamp
   - Salvar config na EEPROM

**Estrutura do Projeto:**
```
nivel-3-avancado/
└── k2-projeto-final/
    ├── projeto_final.ino
    ├── config.h
    ├── sensors.cpp
    ├── sensors.h
    ├── display.cpp
    ├── display.h
    ├── storage.cpp
    ├── storage.h
    ├── power.cpp
    └── power.h
```

**Arquivo: config.h**
Ver [`k2-projeto-final/config.h`](k2-projeto-final/config.h)

**Arquivo Principal: projeto_final.ino**
Ver [`k2-projeto-final/projeto_final.ino`](k2-projeto-final/projeto_final.ino)

**Formato CSV (SD Card):**
```csv
timestamp,temperature_c,humidity_percent,pressure_hpa,status
2025-12-27 10:30:00,23.5,65.2,1013.25,OK
2025-12-27 10:30:10,23.6,65.1,1013.30,OK
2025-12-27 10:30:20,24.1,64.8,1013.28,ALERT_TEMP
```

**Menu LCD:**
```
[Main Screen]
T:23.5C H:65%
P:1013 hPa  OK

[Menu]
>Start Log
 Config
 View Stats
 About

[Config]
>Interval: 10s
 Alarm: 30C
 Format: CSV
 Save & Exit
```

**Melhorias Opcionais:**
- Comunicação Bluetooth (HC-05)
- Servidor web (ESP32 upgrade)
- Gráficos no display TFT
- Múltiplos sensores (4-8)
- Bateria com indicador de carga

---

## ⚠️ Problemas Comuns e Soluções

### 1. Registradores não funcionam como esperado
- ✅ Verificar mapeamento correto (PB5 = pino 13, não PB13!)
- ✅ Consultar datasheet ATmega328P
- ✅ Usar máscara correta: `|=` para setar, `&= ~` para limpar
- ✅ Testar com LED_BUILTIN primeiro

### 2. Timer interrupt não dispara
- ✅ Verificar prescaler correto
- ✅ OCR1A dentro do range (0-65535 para Timer1)
- ✅ Habilitar interrupt: `TIMSK1 |= (1 << OCIE1A)`
- ✅ Chamar `sei()` para habilitar interrupts globais
- ✅ ISR declarado corretamente: `ISR(TIMER1_COMPA_vect)`

### 3. Sleep mode não funciona
- ✅ Desabilitar Serial antes de dormir (Serial.end())
- ✅ Usar `sleep_mode()` em vez de `sleep_cpu()`
- ✅ Configurar wake-up source (interrupt externo ou WDT)
- ✅ LED power da placa consome ~5mA (remover se necessário)

### 4. Watchdog reseta mesmo com wdt_reset()
- ✅ Bootloader pode habilitar WDT - desabilitar no setup()
- ✅ Chamar `wdt_reset()` regularmente (< timeout)
- ✅ Verificar se não há loop infinito ou delay longo
- ✅ Usar `MCUSR = 0` antes de configurar WDT

### 5. Biblioteca customizada não compila
- ✅ Header guard correto (#ifndef / #define / #endif)
- ✅ `#include "Arduino.h"` no .h
- ✅ Declaração no .h, implementação no .cpp
- ✅ Construtor definido corretamente
- ✅ Pasta em `libraries/` ou `src/`

### 6. Otimização quebra código
- ✅ Variáveis compartilhadas com ISR devem ser `volatile`
- ✅ Delays muito curtos podem ser otimizados para zero
- ✅ Usar `asm volatile("" ::: "memory")` como barrier
- ✅ Testar com -O0, -O1, -O2, -O3 progressivamente

### 7. PROGMEM não funciona
- ✅ Usar `pgm_read_byte()`, `pgm_read_word()`, etc.
- ✅ Incluir `<avr/pgmspace.h>`
- ✅ Sintaxe: `const uint8_t data[] PROGMEM = {...}`
- ✅ Não acessar diretamente: `data[i]` → `pgm_read_byte(&data[i])`

### 8. Consumo alto mesmo em sleep
- ✅ Desabilitar ADC: `power_adc_disable()`
- ✅ Desabilitar periféricos não usados
- ✅ Usar ATmega328P standalone (sem placa UNO)
- ✅ Remover LED power e regulador de tensão
- ✅ Alimentar em 3.3V direto no VCC

---

## 🔗 Próximos Passos

### Transição para Bare-Metal

Após dominar o Nível 3, você está pronto para:

1. **ESP32 com ESP-IDF** → [`../../i1-esp32/`](../../i1-esp32/)
   - Framework profissional (Espressif)
   - WiFi, Bluetooth, FreeRTOS
   - Dual-core, 240MHz
   - Bare-metal opcional

2. **RP2040 Bare-Metal** → [`../../i2-rp2040-a/`](../../i2-rp2040-a/)
   - SDK oficial da Raspberry Pi
   - Dual-core ARM Cortex-M0+
   - PIO (Programmable I/O)
   - Transição suave do Arduino

3. **STM32 HAL/LL** → [`../../i4-stm8/`](../../i4-stm8/)
   - STM32CubeMX
   - HAL (Hardware Abstraction Layer)
   - Bare-metal com registradores
   - ARM Cortex-M4

### Habilidades Desenvolvidas Neste Nível

✅ **Manipulação de Registradores**
- Controle direto de hardware
- Bitwise operations avançadas
- Leitura de datasheets

✅ **Timer/Counter Avançado**
- CTC mode
- PWM customizado
- Interrupt timing preciso

✅ **Power Management**
- Sleep modes
- Otimização de consumo
- Wake-up strategies

✅ **Watchdog Timer**
- Failsafe systems
- System recovery
- Periodic wake-up

✅ **Desenvolvimento de Bibliotecas**
- API design
- C++ classes
- Documentação

✅ **Otimização de Performance**
- Profiling
- Memory footprint
- Speed optimization

### Recursos Adicionais

**Livros:**
- "Make: AVR Programming" - Elliot Williams
- "Embedded C Programming" - Mark Siegesmund
- "The AVR Microcontroller and Embedded Systems" - Muhammad Ali Mazidi

**Cursos Online:**
- FastBit Embedded Brain Academy (Udemy)
- Bare-metal embedded programming (Udemy)
- Microchip University (microchip.com)

**Ferramentas:**
- **avr-objdump:** Análise de assembly
- **avr-size:** Análise de memória
- **SimulIDE:** Simulador de circuitos
- **Logic Analyzer:** Análise de sinais

**Comunidades:**
- AVRFreaks Forum
- Arduino Forum (Advanced)
- Stack Overflow [avr] tag
- Reddit r/embedded

---

## 📊 Checklist de Conclusão Nível 3

Antes de avançar para ESP32 ou bare-metal, certifique-se:

### Conceitos Teóricos
- [ ] Entendo registradores DDR, PORT, PIN
- [ ] Sei calcular OCR para Timer interrupts
- [ ] Conheço sleep modes e wake-up sources
- [ ] Entendo Watchdog Timer
- [ ] Sei criar bibliotecas C++
- [ ] Compreendo otimizações de compilador

### Habilidades Práticas
- [ ] Controlo GPIO via registradores
- [ ] Configuro PWM com Timer1/Timer2
- [ ] Implemento Timer interrupts precisos
- [ ] Uso sleep modes efetivamente
- [ ] Configurei Watchdog para failsafe
- [ ] Criei biblioteca própria funcional
- [ ] Otimizei código para performance/memória

### Projeto Final
- [ ] Completei projeto de aquisição de dados
- [ ] Sistema funciona com sleep mode
- [ ] Dados salvos corretamente no SD
- [ ] Interface LCD responsiva
- [ ] Alarmes funcionando
- [ ] Código organizado e documentado

### Desafios Extras
- [ ] Completei pelo menos 3 desafios 🟡 (médio)
- [ ] Completei pelo menos 1 desafio 🔴 (difícil)
- [ ] Li seções relevantes do datasheet ATmega328P
- [ ] Comparei código assembly (avr-objdump)
- [ ] Medi consumo de corrente real

---

## 🎓 Certificado de Conclusão (Auto-avaliação)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          NÍVEL 3 AVANÇADO - ARDUINO CONCLUÍDO             ║
║                                                            ║
║  Habilidades Desenvolvidas:                               ║
║  ✓ Manipulação de Registradores                          ║
║  ✓ Timer Interrupts Avançado                             ║
║  ✓ Power Management                                       ║
║  ✓ Watchdog Timer                                         ║
║  ✓ Desenvolvimento de Bibliotecas                        ║
║  ✓ Otimização de Performance                             ║
║                                                            ║
║  Projeto Final: Sistema de Aquisição de Dados            ║
║  Data: _____________________                              ║
║                                                            ║
║  Próximo Desafio: ESP32 ESP-IDF / RP2040 Bare-Metal      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

**Parabéns por completar o Nível 3!** 🎉

Você agora tem conhecimento sólido de:
- Hardware (registradores, timers, power management)
- Software (bibliotecas, otimização, debugging)
- Integração (sensores, displays, armazenamento)

**Está pronto para bare-metal e microcontroladores mais avançados!**

---

**Voltar para:**
- [README Arduino](../../README.md)
- [Exercícios Nível 2](../nivel-2-intermediario/info-intermediario.md)
- [Roadmap Geral](../../../../learn/roadmap_geral.md) 