---
title: RP2040 Zero - Pinagem
---

- Raspberry Pi RP2040 (formato compacto)
- 13 GPIOs expostos
- LED RGB integrado
- [Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

## 📐 Diagrama de Pinos (Formato Compacto)

```
                         ┌─────────────┐
                         │   USB-C     │
                         └──────┬──────┘
                                │
     ┌──────────────────────────┴──────────────────────┐
     │                                                 │
     │            RP2040 ZERO (WaveShare)              │
     │           (Raspberry Pi RP2040)                 │
     │              ULTRA COMPACT                      │
     │                                                 │
     │    [GP0]  ○─┤ 0   (UART0 TX)                    │
     │    [GP1]  ○─┤ 1   (UART0 RX)                    │
     │    [GP2]  ○─┤ 2                                 │
     │    [GP3]  ○─┤ 3                                 │
     │    [GP4]  ○─┤ 4   (I2C0 SDA)                    │
     │    [GP5]  ○─┤ 5   (I2C0 SCL)                    │
     │    [GP6]  ○─┤ 6                                 │
     │    [GP7]  ○─┤ 7                                 │
     │    [GP8]  ○─┤ 8                                 │
     │    [GP9]  ○─┤ 9                                 │
     │   [GP10]  ○─┤ 10                                │
     │   [GP11]  ○─┤ 11                                │
     │   [GP12]  ○─┤ 12                                │
     │                                                 │
     │   [GND]   ○─┤ GND                               │
     │   [3V3]   ○─┤ 3.3V                              │
     │                                                 │
     │   INTERNAL (não expostos):                      │
     │   - GP16: LED RGB (Neopixel WS2812)             │
     │   - GP26: ADC0 (não quebrado)                   │
     │   - GP27: ADC1 (não quebrado)                   │
     │   - GP28: ADC2 (não quebrado)                   │
     │                                                 │
     │   [BOOT]  (Botão na parte traseira)             │
     │   [RESET] (Pad de reset na parte traseira)      │
     │                                                 │
     └─────────────────────────────────────────────────┘

            LED RGB (GP16) - WS2812 Neopixel
                    [●] (na parte traseira)
```

---

## 📊 Tabela de Pinos Expostos

| GPIO | Função Primária | PWM | I2C | SPI | UART | Notas |
|------|-----------------|-----|-----|-----|------|-------|
| **GP0** | GPIO | PWM0 A | I2C0 SDA | SPI0 RX | UART0 TX | Exposto |
| **GP1** | GPIO | PWM0 B | I2C0 SCL | SPI0 CS | UART0 RX | Exposto |
| **GP2** | GPIO | PWM1 A | I2C1 SDA | SPI0 SCK | - | Exposto |
| **GP3** | GPIO | PWM1 B | I2C1 SCL | SPI0 TX | - | Exposto |
| **GP4** | GPIO | PWM2 A | I2C0 SDA | SPI0 RX | UART1 TX | Exposto |
| **GP5** | GPIO | PWM2 B | I2C0 SCL | SPI0 CS | UART1 RX | Exposto |
| **GP6** | GPIO | PWM3 A | I2C1 SDA | SPI0 SCK | - | Exposto |
| **GP7** | GPIO | PWM3 B | I2C1 SCL | SPI0 TX | - | Exposto |
| **GP8** | GPIO | PWM4 A | I2C0 SDA | SPI1 RX | UART1 TX | Exposto |
| **GP9** | GPIO | PWM4 B | I2C0 SCL | SPI1 CS | UART1 RX | Exposto |
| **GP10** | GPIO | PWM5 A | I2C1 SDA | SPI1 SCK | - | Exposto |
| **GP11** | GPIO | PWM5 B | I2C1 SCL | SPI1 TX | - | Exposto |
| **GP12** | GPIO | PWM6 A | I2C0 SDA | SPI1 RX | UART0 TX | Exposto |

## 📊 Pinos Internos (Não Expostos)

| GPIO | Função | Descrição |
|------|--------|-----------|
| **GP16** | WS2812 | LED RGB Neopixel (na traseira) |
| **GP26** | ADC0 | ADC (não quebrado em pads) |
| **GP27** | ADC1 | ADC (não quebrado em pads) |
| **GP28** | ADC2 | ADC (não quebrado em pads) |
| **GP29** | ADC3 | Temperatura interna |

---

## 💡 LED RGB (Neopixel WS2812)

O RP2040 Zero tem um **LED RGB endereçável** conectado ao **GP16**.

### Exemplo com PIO (Pico SDK)
```c
#include "hardware/pio.h"
#include "ws2812.pio.h"  // Gerado pelo SDK

#define WS2812_PIN 16

static inline void put_pixel(uint32_t pixel_grb) {
    pio_sm_put_blocking(pio0, 0, pixel_grb << 8u);
}

int main() {
    PIO pio = pio0;
    int sm = 0;
    uint offset = pio_add_program(pio, &ws2812_program);
    ws2812_program_init(pio, sm, offset, WS2812_PIN, 800000, false);
    
    while(1) {
        // Vermelho (GRB format)
        put_pixel(0x00FF0000);
        sleep_ms(500);
        
        // Verde
        put_pixel(0xFF000000);
        sleep_ms(500);
        
        // Azul
        put_pixel(0x0000FF00);
        sleep_ms(500);
    }
}
```

### Exemplo com Arduino (Adafruit_NeoPixel)
```cpp
#include <Adafruit_NeoPixel.h>

#define LED_PIN 16
#define NUM_LEDS 1

Adafruit_NeoPixel pixel(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  pixel.begin();
  pixel.setBrightness(50);  // 0-255
}

void loop() {
  // Vermelho
  pixel.setPixelColor(0, pixel.Color(255, 0, 0));
  pixel.show();
  delay(500);
  
  // Verde
  pixel.setPixelColor(0, pixel.Color(0, 255, 0));
  pixel.show();
  delay(500);
  
  // Azul
  pixel.setPixelColor(0, pixel.Color(0, 0, 255));
  pixel.show();
  delay(500);
}
```

---

## ⚡ Especificações Elétricas

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Tensão operação | 3.3V | **NÃO use 5V nos GPIOs!** |
| Corrente por pino | 12mA | Padrão |
| USB | USB-C | 5V, suporta USB Host e Device |
| Clock CPU | 133MHz | Padrão RP2040 |
| Flash | 2MB | Flash SPI externa |
| RAM | 264KB | SRAM interna |
| Dimensões | 23.5×18mm | Ultra compacto! |
| Peso | ~1g | Muito leve |

---

## 🔌 Diferenças do RP2040-A

| Característica | RP2040 Zero | RP2040-A |
|----------------|-------------|----------|
| **Tamanho** | 23.5×18mm (compacto) | Maior |
| **Pinos Expostos** | 13 GPIOs | 26 GPIOs |
| **LED RGB** | ✅ WS2812 (GP16) | ❌ Geralmente não |
| **ADC Expostos** | ❌ Não | ✅ Sim (GP26-28) |
| **USB** | USB-C | Micro USB / USB-C |
| **Uso** | Wearables, projetos pequenos | Projetos gerais |

---

## 📝 Exemplos de Uso

### GPIO Digital
```c
#include "pico/stdlib.h"

#define LED_EXTERNAL 0  // GP0

int main() {
    gpio_init(LED_EXTERNAL);
    gpio_set_dir(LED_EXTERNAL, GPIO_OUT);
    
    while(1) {
        gpio_put(LED_EXTERNAL, 1);
        sleep_ms(1000);
        gpio_put(LED_EXTERNAL, 0);
        sleep_ms(1000);
    }
}
```

### I2C (Sensor)
```c
#include "hardware/i2c.h"

#define I2C_SDA 4
#define I2C_SCL 5

int main() {
    i2c_init(i2c0, 100 * 1000);  // 100kHz
    gpio_set_function(I2C_SDA, GPIO_FUNC_I2C);
    gpio_set_function(I2C_SCL, GPIO_FUNC_I2C);
    gpio_pull_up(I2C_SDA);
    gpio_pull_up(I2C_SCL);
    
    // Usar i2c_write_blocking(), i2c_read_blocking()
}
```

### PWM
```c
#include "hardware/pwm.h"

#define PWM_PIN 6

int main() {
    gpio_set_function(PWM_PIN, GPIO_FUNC_PWM);
    uint slice = pwm_gpio_to_slice_num(PWM_PIN);
    
    pwm_set_wrap(slice, 65535);
    pwm_set_enabled(slice, true);
    
    while(1) {
        for(int i = 0; i < 65536; i += 256) {
            pwm_set_gpio_level(PWM_PIN, i);
            sleep_ms(5);
        }
    }
}
```

---

## ⚠️ Notas Importantes

1. **ADC Não Exposto:** Os pinos ADC (GP26-28) não estão quebrados. Se precisar de ADC, use o RP2040-A.

2. **LED RGB Interno:** GP16 está conectado ao WS2812. Não use para GPIO normal sem desabilitar o LED.

3. **Tamanho Compacto:** Ideal para wearables e projetos onde espaço é crítico.

4. **USB-C:** Suporta USB Host e Device. Pode ser alimentado por USB ou VSYS.

5. **BOOTSEL Traseiro:** Botão BOOTSEL na parte de trás. Pressione ao conectar USB para bootloader.

6. **Sem Regulador 5V:** Alimenta com 3.3V ou USB 5V (tem regulador para 3.3V).

---

## 🎨 Aplicações Ideais

- **Wearables:** Relógios, pulseiras inteligentes
- **LEDs Portáteis:** Controle de Neopixels (já tem um!)
- **IoT Compacto:** Sensores wireless
- **Projetos Educacionais:** Aprender RP2040 em formato pequeno
- **Drones:** Controladores leves

---

## 🔋 Alimentação

| Pino | Tensão | Descrição |
|------|--------|-----------|
| **VBUS** | 5V | Do USB-C |
| **3V3** | 3.3V | Saída regulada (alimentar periféricos) |
| **GND** | 0V | Ground |

**Nota:** Não há pino VSYS exposto no RP2040 Zero.

---

## 🔗 Referências

- [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- [RP2040 Zero Wiki](https://www.waveshare.com/wiki/RP2040-Zero)
- [Pico SDK](https://github.com/raspberrypi/pico-sdk)

---

**Voltar:** [📍 Pin Diagrams](README.md) | [RP2040 Zero](../i3-rp2040-zero/README.md)
