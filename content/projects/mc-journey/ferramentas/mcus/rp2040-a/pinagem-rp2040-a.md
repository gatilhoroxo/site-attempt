---
title: RP2040-A - Pinagem
---
- Raspberry Pi RP2040
- 26 GPIOs multifuncionais
- 8 PIO state machines
- [Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

## 📐 Diagrama de Pinos

```
                         ┌─────────────┐
                         │   USB       │
                         └──────┬──────┘
                                │
     ┌──────────────────────────┴──────────────────────┐
     │                                                 │
     │              RP2040-A BOARD                     │
     │           (Raspberry Pi RP2040)                 │
     │                                                 │
UART0├─○  [GP0]   0  (UART0 TX, I2C0 SDA, SPI0 RX)     │
UART0├─○  [GP1]   1  (UART0 RX, I2C0 SCL, SPI0 CS)     │
     ├─○  [GND]                                        │
     ├─○  [GP2]   2  (I2C1 SDA, SPI0 SCK)              │
     ├─○  [GP3]   3  (I2C1 SCL, SPI0 TX)               │
     ├─○  [GP4]   4  (UART1 TX, I2C0 SDA, SPI0 RX)     │
     ├─○  [GP5]   5  (UART1 RX, I2C0 SCL, SPI0 CS)     │
     ├─○  [GND]                                        │
     ├─○  [GP6]   6  (SPI0 SCK)                        │
     ├─○  [GP7]   7  (SPI0 TX)                         │
     ├─○  [GP8]   8  (UART1 TX, I2C0 SDA, SPI1 RX)     │
     ├─○  [GP9]   9  (UART1 RX, I2C0 SCL, SPI1 CS)     │
     ├─○  [GND]                                        │
     ├─○  [GP10] 10  (SPI1 SCK)                        │
     ├─○  [GP11] 11  (SPI1 TX)                         │
     ├─○  [GP12] 12  (UART0 TX, I2C0 SDA, SPI1 RX)     │
     ├─○  [GP13] 13  (UART0 RX, I2C0 SCL, SPI1 CS)     │
     ├─○  [GND]                                        │
     ├─○  [GP14] 14  (UART0 TX, I2C1 SDA, SPI1 SCK)    │
     ├─○  [GP15] 15  (UART0 RX, I2C1 SCL, SPI1 TX)     │
     ├─○  [GP16] 16  (SPI0 RX, UART0 TX, I2C0 SDA)     │
     ├─○  [GP17] 17  (SPI0 CS, UART0 RX, I2C0 SCL)     │
     ├─○  [GND]                                        │
     ├─○  [GP18] 18  (SPI0 SCK, I2C1 SDA)              │
     ├─○  [GP19] 19  (SPI0 TX, I2C1 SCL)               │
     ├─○  [GP20] 20  (I2C0 SDA, UART1 TX)              │
     ├─○  [GP21] 21  (I2C0 SCL, UART1 RX)              │
     ├─○  [GND]                                        │
     ├─○  [GP22] 22                                    │
     ├─○  [RUN]      (RESET - active low)              │
     ├─○  [GP26] 26  (ADC0, I2C1 SDA)                  │
     ├─○  [GP27] 27  (ADC1, I2C1 SCL)                  │
     ├─○  [GND]                                        │
     ├─○  [GP28] 28  (ADC2)                            │
VREF ├─○  [AGND]     (Analog ground)                   │
 3V3 ├─○  [3V3(OUT)]                                   │
3V3E ├─○  [3V3_EN]   (Enable/disable 3.3V output)      │
     ├─○  [GND]                                        │
VSYS ├─○  [VSYS]     (2-5V input)                      │
VBUS ├─○  [VBUS]     (5V from USB)                     │
     │                                                 │
     └─────────────────────────────────────────────────┘
```

---

## 📊 Tabela de Pinos GPIO

| GPIO | ADC | PIO | PWM | I2C | SPI | UART | Notas |
|------|-----|-----|-----|-----|-----|------|-------|
| GP0 | ❌ | ✅ | PWM0 A | I2C0 SDA | SPI0 RX | UART0 TX | Multifuncional |
| GP1 | ❌ | ✅ | PWM0 B | I2C0 SCL | SPI0 CS | UART0 RX | Multifuncional |
| GP2 | ❌ | ✅ | PWM1 A | I2C1 SDA | SPI0 SCK | - | Multifuncional |
| GP3 | ❌ | ✅ | PWM1 B | I2C1 SCL | SPI0 TX | - | Multifuncional |
| GP4 | ❌ | ✅ | PWM2 A | I2C0 SDA | SPI0 RX | UART1 TX | Multifuncional |
| GP5 | ❌ | ✅ | PWM2 B | I2C0 SCL | SPI0 CS | UART1 RX | Multifuncional |
| GP6 | ❌ | ✅ | PWM3 A | I2C1 SDA | SPI0 SCK | - | Multifuncional |
| GP7 | ❌ | ✅ | PWM3 B | I2C1 SCL | SPI0 TX | - | Multifuncional |
| GP8 | ❌ | ✅ | PWM4 A | I2C0 SDA | SPI1 RX | UART1 TX | Multifuncional |
| GP9 | ❌ | ✅ | PWM4 B | I2C0 SCL | SPI1 CS | UART1 RX | Multifuncional |
| GP10 | ❌ | ✅ | PWM5 A | I2C1 SDA | SPI1 SCK | - | Multifuncional |
| GP11 | ❌ | ✅ | PWM5 B | I2C1 SCL | SPI1 TX | - | Multifuncional |
| GP12 | ❌ | ✅ | PWM6 A | I2C0 SDA | SPI1 RX | UART0 TX | Multifuncional |
| GP13 | ❌ | ✅ | PWM6 B | I2C0 SCL | SPI1 CS | UART0 RX | Multifuncional |
| GP14 | ❌ | ✅ | PWM7 A | I2C1 SDA | SPI1 SCK | UART0 TX | Multifuncional |
| GP15 | ❌ | ✅ | PWM7 B | I2C1 SCL | SPI1 TX | UART0 RX | Multifuncional |
| GP16 | ❌ | ✅ | PWM0 A | I2C0 SDA | SPI0 RX | UART0 TX | Multifuncional |
| GP17 | ❌ | ✅ | PWM0 B | I2C0 SCL | SPI0 CS | UART0 RX | Multifuncional |
| GP18 | ❌ | ✅ | PWM1 A | I2C1 SDA | SPI0 SCK | - | Multifuncional |
| GP19 | ❌ | ✅ | PWM1 B | I2C1 SCL | SPI0 TX | - | Multifuncional |
| GP20 | ❌ | ✅ | PWM2 A | I2C0 SDA | - | UART1 TX | Multifuncional |
| GP21 | ❌ | ✅ | PWM2 B | I2C0 SCL | - | UART1 RX | Multifuncional |
| GP22 | ❌ | ✅ | PWM3 A | - | - | - | GPIO simples |
| GP26 | ADC0 | ✅ | PWM5 A | I2C1 SDA | - | - | **Analógico** |
| GP27 | ADC1 | ✅ | PWM5 B | I2C1 SCL | - | - | **Analógico** |
| GP28 | ADC2 | ✅ | PWM6 A | - | - | - | **Analógico** |

---

## 🔌 Interfaces de Comunicação

### UART (2x periféricos)
- **UART0:** Flexível (vários pinos possíveis)
- **UART1:** Flexível (vários pinos possíveis)
- **Baud rate:** Até 921600 (ou mais)
- **Configuração:** Qualquer GPIO pode ser UART TX/RX

### I2C (2x periféricos)
- **I2C0:** Flexível
- **I2C1:** Flexível
- **Clock:** Até 400kHz (Fast mode)
- **Configuração:** Qualquer GPIO pode ser SDA/SCL

### SPI (2x periféricos)
- **SPI0:** Flexível
- **SPI1:** Flexível
- **Clock:** Até 62.5MHz
- **Configuração:** Qualquer GPIO pode ser MOSI/MISO/SCK/CS

---

## ⚡ Especificações Elétricas

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Tensão operação | 3.3V | **NÃO use 5V nos GPIOs!** |
| Corrente por pino | 12mA | Padrão, até 16mA max |
| Tensão entrada | 0-3.3V | 3.63V absoluto máximo |
| PWM Canais | 16 | 8 slices × 2 canais |
| PWM Resolution | 16-bit | Configurável |
| ADC Canais | 4 | GP26-29 (GP29 = temperatura interna) |
| ADC Resolution | 12-bit | 0-4095 |
| Clock CPU | 133MHz | Padrão (até 250MHz overclock) |
| PIO State Machines | 8 | 2 blocos × 4 SMs |

---

## 💡 Recursos Especiais do RP2040

### PIO (Programmable I/O)
- **8 State Machines** (4 em cada PIO0 e PIO1)
- Programáveis em assembly PIO
- Permitem criar protocolos customizados
- Funcionam independentemente da CPU

### Dual-Core
- **Core 0:** Principal (setup/loop)
- **Core 1:** Secundário (tarefas paralelas)
- **Comunicação:** FIFO entre cores

### PWM Slices
- **8 slices**, cada com 2 canais (A e B)
- Resolução de 16-bit
- Frequência independente por slice

---

## 📝 Exemplos de Uso

### GPIO Digital (Pico SDK)
```c
#include "pico/stdlib.h"

#define LED_PIN 25  // GP25 (LED interno no Pico, não no RP2040-A)

int main() {
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    while(1) {
        gpio_put(LED_PIN, 1);
        sleep_ms(1000);
        gpio_put(LED_PIN, 0);
        sleep_ms(1000);
    }
}
```

### ADC (Analógico)
```c
#include "hardware/adc.h"

int main() {
    stdio_init_all();
    adc_init();
    
    // GP26 = ADC0
    adc_gpio_init(26);
    adc_select_input(0);  // Select ADC0
    
    while(1) {
        uint16_t result = adc_read();  // 0-4095
        printf("ADC: %d\n", result);
        sleep_ms(100);
    }
}
```

### PWM
```c
#include "hardware/pwm.h"

#define PWM_PIN 16

int main() {
    gpio_set_function(PWM_PIN, GPIO_FUNC_PWM);
    uint slice_num = pwm_gpio_to_slice_num(PWM_PIN);
    
    pwm_set_wrap(slice_num, 65535);  // 16-bit
    pwm_set_enabled(slice_num, true);
    
    while(1) {
        for(int level = 0; level < 65536; level += 256) {
            pwm_set_gpio_level(PWM_PIN, level);
            sleep_ms(10);
        }
    }
}
```

### Dual-Core
```c
#include "pico/multicore.h"

void core1_entry() {
    while(1) {
        // Core 1 tasks
        sleep_ms(100);
    }
}

int main() {
    multicore_launch_core1(core1_entry);
    
    while(1) {
        // Core 0 tasks
        sleep_ms(100);
    }
}
```

---

## ⚠️ Notas Importantes

1. **3.3V Logic:** O RP2040 opera em 3.3V. **NÃO conecte sinais 5V diretamente!**

2. **ADC Pins:** Apenas GP26, GP27, GP28 e GP29 (temperatura) têm ADC.

3. **No Built-in LED:** O RP2040-A pode não ter LED interno (depende da board).

4. **PIO é Poderoso:** Use PIO para protocolos customizados (WS2812, DPI, etc).

5. **Pin Multiplexing:** Cada GPIO pode ter múltiplas funções. Configure com `gpio_set_function()`.

6. **BOOTSEL:** Pressione BOOTSEL ao conectar USB para entrar em modo bootloader (aparecer como drive USB).

7. **Flash Externa:** RP2040 precisa de flash SPI externa (normalmente 2MB ou 16MB na board).

---

## 🔋 Alimentação

| Pino | Tensão | Descrição |
|------|--------|-----------|
| **VSYS** | 1.8-5.5V | Alimentação principal (regulado para 3.3V) |
| **VBUS** | 5V | Vem do USB quando conectado |
| **3V3(OUT)** | 3.3V | Saída regulada (pode alimentar periféricos) |
| **3V3_EN** | - | HIGH = 3.3V ON, LOW = OFF (controle power) |

---

## 🔗 Referências

- [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- [Pico SDK Documentation](https://raspberrypi.github.io/pico-sdk-doxygen/)
- [RP2040 Hardware Design](https://datasheets.raspberrypi.com/rp2040/hardware-design-with-rp2040.pdf)

---

**Voltar:** [📍 Pin Diagrams](README.md) | [RP2040-A](../i2-rp2040-a/README.md)
