---
layout: default
title: Adicionar geração do PIO
---


## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 5-8)

### Semana 5-6: I2C e Display OLED

#### Exercício 7: I2C Scanner
**Objetivo:** Detectar dispositivos I2C

```c
#include "pico/stdlib.h"
#include "hardware/i2c.h"

#define I2C_PORT i2c0
#define SDA_PIN 4
#define SCL_PIN 5

void i2c_scan() {
    printf("\nI2C Bus Scan\n");
    printf("   0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F\n");

    for (int addr = 0; addr < (1 << 7); ++addr) {
        if (addr % 16 == 0) {
            printf("%02x ", addr);
        }

        int ret;
        uint8_t rxdata;
        ret = i2c_read_blocking(I2C_PORT, addr, &rxdata, 1, false);

        printf(ret < 0 ? "." : "@");
        printf(addr % 16 == 15 ? "\n" : "  ");
    }
    printf("Done.\n");
}

int main() {
    stdio_init_all();
    
    i2c_init(I2C_PORT, 400 * 1000);  // 400kHz
    gpio_set_function(SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(SDA_PIN);
    gpio_pull_up(SCL_PIN);
    
    sleep_ms(2000);
    i2c_scan();
    
    while (true) {
        tight_loop_contents();
    }
    
    return 0;
}
```

**CMakeLists.txt adicionar:**
```cmake
target_link_libraries(meu_projeto 
    pico_stdlib
    hardware_i2c  # ADICIONAR
)
```

---

#### Exercício 8: Display OLED SSD1306
**Objetivo:** Mostrar texto e gráficos

```c
// Use biblioteca como:
// https://github.com/daschr/pico-ssd1306

#include "pico/stdlib.h"
#include "hardware/i2c.h"
#include "ssd1306.h"

int main() {
    stdio_init_all();
    
    i2c_init(i2c0, 400000);
    gpio_set_function(4, GPIO_FUNC_I2C);
    gpio_set_function(5, GPIO_FUNC_I2C);
    gpio_pull_up(4);
    gpio_pull_up(5);
    
    ssd1306_t disp;
    disp.external_vcc = false;
    ssd1306_init(&disp, 128, 64, 0x3C, i2c0);
    
    ssd1306_clear(&disp);
    ssd1306_draw_string(&disp, 0, 0, 2, "RP2040");
    ssd1306_draw_string(&disp, 0, 20, 1, "Hello World!");
    ssd1306_show(&disp);
    
    while (true) {
        tight_loop_contents();
    }
    
    return 0;
}
```

---

### Semana 7-8: PIO (Programmable I/O) - O DIFERENCIAL!

#### Exercício 9: Entendendo PIO Básico
**Objetivo:** Piscar LED usando PIO ao invés de CPU

**O que é PIO?**
- 8 state machines independentes
- Podem executar programas simples
- Perfeito para protocolos de timing crítico
- Libera CPU para outras tarefas

**Analogia One Piece:** É como ter 8 "clones" do Zoro, cada um executando uma técnica específica enquanto o original faz outra coisa!

```pio
; blink.pio
.program blink
    set pins, 1   ; Liga LED
    set x, 31     ; Delay (32 ciclos)
delay_high:
    nop [31]
    jmp x-- delay_high
    
    set pins, 0   ; Desliga LED
    set x, 31
delay_low:
    nop [31]
    jmp x-- delay_low
    
    jmp blink     ; Loop infinito
```

**main.c:**
```c
#include "pico/stdlib.h"
#include "hardware/pio.h"
#include "blink.pio.h"  // Gerado automaticamente

#define LED_PIN 25

int main() {
    PIO pio = pio0;
    uint offset = pio_add_program(pio, &blink_program);
    uint sm = pio_claim_unused_sm(pio, true);
    
    pio_gpio_init(pio, LED_PIN);
    pio_sm_set_consecutive_pindirs(pio, sm, LED_PIN, 1, true);
    
    pio_sm_config c = blink_program_get_default_config(offset);
    sm_config_set_set_pins(&c, LED_PIN, 1);
    
    // 125MHz / 2^25 ≈ 4Hz
    sm_config_set_clkdiv(&c, 1 << 23);
    
    pio_sm_init(pio, sm, offset, &c);
    pio_sm_set_enabled(pio, sm, true);
    
    // LED piscando via PIO, CPU livre!
    while (true) {
        printf("CPU fazendo outras coisas!\n");
        sleep_ms(1000);
    }
    
    return 0;
}
```

**CMakeLists.txt modificar:**
```cmake
# Adicionar geração do PIO
pico_generate_pio_header(meu_projeto ${CMAKE_CURRENT_LIST_DIR}/blink.pio)

target_link_libraries(meu_projeto 
    pico_stdlib
    hardware_pio  # ADICIONAR
)
```

---

#### Exercício 10: PIO para WS2812 (NeoPixel)
**Objetivo:** Controlar LEDs RGB usando PIO

```pio
; ws2812.pio - Simplificado
.program ws2812
.side_set 1

.wrap_target
bitloop:
    out x, 1       side 0 [2]
    jmp !x do_zero side 1 [1]
do_one:
    jmp bitloop    side 1 [4]
do_zero:
    nop            side 0 [4]
.wrap
```

```c
// Use este exemplo como base:
// pico-examples/pio/ws2812/ws2812.c

void put_pixel(uint32_t pixel_grb) {
    pio_sm_put_blocking(pio0, 0, pixel_grb << 8u);
}

uint32_t rgb_to_grb(uint8_t r, uint8_t g, uint8_t b) {
    return ((uint32_t)g << 16) | ((uint32_t)r << 8) | b;
}

int main() {
    // Setup PIO...
    
    while (true) {
        // Ciclo de cores
        put_pixel(rgb_to_grb(255, 0, 0));   // Vermelho
        sleep_ms(500);
        put_pixel(rgb_to_grb(0, 255, 0));   // Verde
        sleep_ms(500);
        put_pixel(rgb_to_grb(0, 0, 255));   // Azul
        sleep_ms(500);
    }
}
```

---

### 🎯 PROJETO NÍVEL 2: Analisador de Sinais Dual-Core

**Descrição:** Sistema que captura sinais digitais em um core e processa/exibe no outro.

**Componentes:**
- Entrada digital (sensor ou gerador de sinais)
- Display OLED
- LEDs indicadores

**Arquitetura:**
- **Core 0:** Interface, display, comunicação
- **Core 1:** Captura de sinais com PIO
- **PIO:** Captura timing preciso

```c
// Estrutura de dados compartilhada
typedef struct {
    uint32_t frequency;
    uint32_t pulse_width;
    bool signal_detected;
} signal_data_t;

volatile signal_data_t shared_data;

void core1_entry() {
    // Core 1: Análise de sinais
    while (true) {
        // Capturar e processar sinais
        // Atualizar shared_data
    }
}

int main() {
    // Core 0: Interface
    multicore_launch_core1(core1_entry);
    
    while (true) {
        // Mostrar dados no display
        // Processar comandos do usuário
    }
}
```

---
