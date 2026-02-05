---
title: STM8S103F3 - Pinagem
---

- STMicroelectronics STM8
- 15 pinos I/O
- 5 canais ADC
- [Datasheet](https://www.st.com/resource/en/datasheet/stm8s103f3.pdf)

## 📐 Diagrama de Pinos (TSSOP20)

```
                        ┌────────┐
                        │   STM8 │
                        │S103F3P6│
                        └────┬───┘
                             │
         ┌───────────────────┴───────────────┐
         │                                   │
         │            STM8S103F3P6           │
         │          (TSSOP20 Package)        │
         │                                   │
    UART │ 1  ○ [PD1/SWIM]          Vdd ○ 20 │ 3.3V
    UART │ 2  ○ [PD2/AIN3]          Vss ○ 19 │ GND
      HS │ 3  ○ [PD3/AIN4, TIM2]    Vdd ○ 18 │ 3.3V
    NRST │ 4  ○ [NRST]              PA1 ○ 17 │ OSC
      HS │ 5  ○ [PD4/AIN5, TIM2]    PA2 ○ 16 │ OSC
    SWIM │ 6  ○ [PD5/AIN6, UART]    Vss ○ 15 │ GND
 UART TX │ 7  ○ [PD6/AIN7, UART]    PB4 ○ 14 │ I2C SCL
         │ 8  ○ [PC1/TIM1]          PB5 ○ 13 │ I2C SDA
  TIM1/2 │ 9  ○ [PC2/TIM1]          PB6 ○ 12 │ I2C SCL
  SPI SS │ 10 ○ [PC3/TIM1, SPI]     PB7 ○ 11 │ I2C SDA
         │                                   │
         └───────────────────────────────────┘

Pinagem alternativa (DIP20):
         ┌─────────────┐
    PD1 ─│1          20│─ Vdd
    PD2 ─│2          19│─ Vss
    PD3 ─│3          18│─ Vdd
   NRST ─│4   STM8   17│─ PA1
    PD4 ─│5   S103   16│─ PA2
    PD5 ─│6    F3    15│─ Vss
    PD6 ─│7          14│─ PB4
    PC1 ─│8          13│─ PB5
    PC2 ─│9          12│─ PB6
    PC3 ─│10         11│─ PB7
         └─────────────┘
```

---

## 📊 Tabela de Pinos

| Pin | GPIO | ADC | Timer | I2C | SPI | UART | Funções Alternativas | Notas |
|-----|------|-----|-------|-----|-----|------|---------------------|-------|
| 1 | **PD1** | ❌ | ❌ | ❌ | ❌ | ❌ | SWIM | **Debug/Programming** |
| 2 | **PD2** | AIN3 | ❌ | ❌ | ❌ | ❌ | - | ADC |
| 3 | **PD3** | AIN4 | TIM2_CH2 | ❌ | ❌ | ❌ | HS | High Sink |
| 4 | **NRST** | ❌ | ❌ | ❌ | ❌ | ❌ | RESET | Reset (active low) |
| 5 | **PD4** | AIN5 | TIM2_CH1 | ❌ | ❌ | ❌ | HS | High Sink |
| 6 | **PD5** | AIN6 | ❌ | ❌ | ❌ | UART2_TX | HS | High Sink |
| 7 | **PD6** | AIN7 | ❌ | ❌ | ❌ | UART2_RX | - | ADC + UART |
| 8 | **PC1** | ❌ | TIM1_CH1 | ❌ | ❌ | ❌ | - | Timer 1 |
| 9 | **PC2** | ❌ | TIM1_CH2 | ❌ | ❌ | ❌ | - | Timer 1 |
| 10 | **PC3** | ❌ | TIM1_CH3 | ❌ | SPI_SS | ❌ | - | Timer 1 + SPI |
| 11 | **PB7** | ❌ | ❌ | I2C_SDA | ❌ | ❌ | - | I2C Data |
| 12 | **PB6** | ❌ | ❌ | I2C_SCL | ❌ | ❌ | - | I2C Clock |
| 13 | **PB5** | ❌ | ❌ | I2C_SDA | ❌ | ❌ | - | I2C Data (alt) |
| 14 | **PB4** | ❌ | ❌ | I2C_SCL | ❌ | ❌ | - | I2C Clock (alt) |
| 15 | **Vss** | - | - | - | - | - | GND | Ground |
| 16 | **PA2** | ❌ | ❌ | ❌ | ❌ | ❌ | OSC_OUT | Crystal |
| 17 | **PA1** | ❌ | ❌ | ❌ | ❌ | ❌ | OSC_IN | Crystal |
| 18 | **Vdd** | - | - | - | - | - | 3.3V | Power |
| 19 | **Vss** | - | - | - | - | - | GND | Ground |
| 20 | **Vdd** | - | - | - | - | - | 3.3V | Power |

**Legenda:**
- **HS:** High Sink (até 20mA)
- **AIN:** Analog Input (ADC channel)

---

## 🔌 Interfaces de Comunicação

### UART2
- **TX:** PD5
- **RX:** PD6
- **Baud rate:** Até 625kbps (com 16MHz)
- **Config manual:** Registradores UART2_CR, UART2_BRR

### I2C
- **SDA:** PB5 ou PB7
- **SCL:** PB4 ou PB6
- **Clock:** Até 400kHz (Fast mode)
- **Config manual:** Registradores I2C_CR, I2C_FREQR

### SPI
- **MOSI:** PC6 (não disponível no STM8S103F3!)
- **MISO:** PC7 (não disponível no STM8S103F3!)
- **SCK:** PC5 (não disponível no STM8S103F3!)
- **SS:** PC3
- ⚠️ **Nota:** SPI completo não está quebrado no STM8S103F3 (package de 20 pinos)

### SWIM (Debug)
- **SWIM:** PD1
- Interface de debug/programação
- Precisa de ST-Link ou similar

---

## ⚡ Especificações Elétricas

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Tensão operação | 2.95-5.5V | Típico 3.3V ou 5V |
| Corrente por pino | 10mA | Standard pins |
| Corrente High Sink | 20mA | PD3, PD4, PD5 |
| Clock CPU | 16MHz | RC interno ou cristal externo |
| Flash | 8KB | Program memory |
| RAM | 1KB | Data memory |
| EEPROM | 640 bytes | Non-volatile |
| ADC Channels | 5 | 10-bit (PD2-PD6) |
| Timers | 3 | TIM1 (16-bit), TIM2 (16-bit), TIM4 (8-bit) |

---

## 📝 Programação Bare Metal

### Configurar GPIO Output (Bare Metal)
```c
// PD4 como output (LED)
PD_DDR |= (1 << 4);   // Direction = output
PD_CR1 |= (1 << 4);   // Push-pull
PD_CR2 &= ~(1 << 4);  // Speed = 2MHz

// Set HIGH
PD_ODR |= (1 << 4);

// Set LOW
PD_ODR &= ~(1 << 4);
```

### Configurar GPIO Input
```c
// PD2 como input (botão)
PD_DDR &= ~(1 << 2);  // Direction = input
PD_CR1 |= (1 << 2);   // Pull-up enabled
PD_CR2 &= ~(1 << 2);  // Interrupt disabled

// Ler estado
if (PD_IDR & (1 << 2)) {
    // Botão solto (HIGH)
} else {
    // Botão pressionado (LOW)
}
```

### Configurar ADC
```c
// Habilitar ADC
ADC_CR1 = 0x00;       // Single conversion
ADC_CSR = 0x03;       // Select AIN3 (PD2)
ADC_CR2 = 0x08;       // Right aligned

// Iniciar conversão
ADC_CR1 |= (1 << 0);  // ADON = 1

// Aguardar conversão
while (!(ADC_CSR & (1 << 7)));  // Wait EOC

// Ler resultado (10-bit)
uint16_t adc_value = (ADC_DRH << 8) | ADC_DRL;
```

### Configurar Timer (PWM)
```c
// TIM2 CH1 (PD4) - PWM
TIM2_PSCR = 0x00;     // Prescaler = 1
TIM2_ARRH = 0x03;     // Auto-reload HIGH
TIM2_ARRL = 0xFF;     // Auto-reload LOW (1023)
TIM2_CCR1H = 0x01;    // Compare HIGH
TIM2_CCR1L = 0xFF;    // Compare LOW (50% duty)
TIM2_CCMR1 = 0x60;    // PWM mode 1
TIM2_CCER1 = 0x01;    // Enable CH1
TIM2_CR1 = 0x01;      // Enable timer
```

---

## ⚠️ Notas Importantes

1. **Bare Metal:** STM8 é ideal para aprender programação bare metal (sem Arduino framework).

2. **SWIM Programming:** Precisa de ST-Link V2 ou similar para programar via SWIM (PD1).

3. **Clock:** Usa RC interno de 16MHz ou cristal externo (8MHz típico).

4. **Limited Pins:** Apenas 15 GPIOs disponíveis (20-pin package).

5. **High Sink:** PD3, PD4, PD5 podem fornecer até 20mA (vs 10mA nos outros).

6. **ADC:** 5 canais apenas (AIN3-AIN7 em PD2-PD6).

7. **SPI Limitado:** Pinos SPI completos não estão quebrados no package de 20 pinos.

8. **Datasheet é Essencial:** Programação bare metal requer leitura do datasheet e reference manual.

---

## 🛠️ Ferramentas de Desenvolvimento

### Compilador
- **SDCC:** Small Device C Compiler (open source)
```bash
sdcc -mstm8 main.c -o main.ihx
```

### Programador
- **ST-Link V2:** Clone barato (~$2-5)
- **stm8flash:** Open source flash tool
```bash
stm8flash -c stlinkv2 -p stm8s103f3 -w main.ihx
```

### Debugger
- **OpenOCD:** Suporte para STM8 (limitado)
- **STVD:** ST Visual Develop (Windows, gratuito)

---

## 📐 Mapa de Memória

| Região | Endereço | Tamanho | Descrição |
|--------|----------|---------|-----------|
| Flash | 0x8000-0x9FFF | 8KB | Program memory |
| RAM | 0x0000-0x03FF | 1KB | Data memory |
| EEPROM | 0x4000-0x427F | 640B | Non-volatile |
| Registers | 0x5000-0x57FF | - | Peripheral registers |

---

## 🔗 Registradores Principais

### GPIO
- **PX_ODR:** Output Data Register
- **PX_IDR:** Input Data Register
- **PX_DDR:** Data Direction Register (0=in, 1=out)
- **PX_CR1:** Control Register 1 (pull-up/push-pull)
- **PX_CR2:** Control Register 2 (speed/interrupt)

### Clock
- **CLK_CKDIVR:** Clock divider
- **CLK_PCKENR1/2:** Peripheral clock enable

### ADC
- **ADC_CR1/CR2:** Control registers
- **ADC_CSR:** Channel selection
- **ADC_DRH/DRL:** Data registers

---

## 🔗 Referências

- [STM8S103F3 Datasheet](https://www.st.com/resource/en/datasheet/stm8s103f3.pdf)
- [STM8S Reference Manual](https://www.st.com/resource/en/reference_manual/cd00190271-stm8s-series-and-stm8af-series-8bit-microcontrollers-stmicroelectronics.pdf)
- [SDCC Compiler](http://sdcc.sourceforge.net/)
- [stm8flash Tool](https://github.com/vdudouyt/stm8flash)

---

**Voltar:** [📍 Pin Diagrams](README.md) | [STM8](../i4-stm8/README.md)
