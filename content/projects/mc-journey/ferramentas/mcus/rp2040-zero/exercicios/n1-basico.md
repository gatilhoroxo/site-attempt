---
layout: default
title: N1 Basico
---


## 📚 NÍVEL 1 - BÁSICO (Semanas 2-4)

### Exercício 1: LED Externo (Sem LED Onboard)
**Objetivo:** Trabalhar sem luxos!

```c
#include "pico/stdlib.h"

#define LED_PIN 2  // LED externo em GP2

int main() {
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    while (true) {
        gpio_put(LED_PIN, 1);
        sleep_ms(1000);
        gpio_put(LED_PIN, 0);
        sleep_ms(1000);
    }
    
    return 0;
}
```

**Montagem:**
```
GP2 ---[LED]---[220Ω]--- GND
```

---

### Exercício 2: Multiplexação de Pinos
**Objetivo:** Fazer mais com menos

**Cenário:** Você precisa de 8 LEDs mas só tem 5 pinos disponíveis.
**Solução:** Charlieplexing!

```c
#include "pico/stdlib.h"

#define PIN1 2
#define PIN2 3
#define PIN3 4

// Configurações para cada LED
typedef struct {
    uint8_t output_pin;
    uint8_t high_pin;
    uint8_t low_pin;
} led_config_t;

const led_config_t leds[] = {
    {PIN1, PIN1, PIN2},  // LED 1: PIN1 HIGH, PIN2 LOW
    {PIN1, PIN2, PIN1},  // LED 2: PIN2 HIGH, PIN1 LOW
    {PIN2, PIN2, PIN3},  // LED 3: PIN2 HIGH, PIN3 LOW
    // ... mais LEDs
};

void set_all_input() {
    gpio_init(PIN1); gpio_set_dir(PIN1, GPIO_IN);
    gpio_init(PIN2); gpio_set_dir(PIN2, GPIO_IN);
    gpio_init(PIN3); gpio_set_dir(PIN3, GPIO_IN);
}

void light_led(int led_num) {
    set_all_input();
    
    led_config_t led = leds[led_num];
    gpio_init(led.high_pin);
    gpio_set_dir(led.high_pin, GPIO_OUT);
    gpio_put(led.high_pin, 1);
    
    gpio_init(led.low_pin);
    gpio_set_dir(led.low_pin, GPIO_OUT);
    gpio_put(led.low_pin, 0);
}

int main() {
    while (true) {
        for(int i = 0; i < 3; i++) {
            light_led(i);
            sleep_ms(500);
        }
    }
    
    return 0;
}
```

**Conceito:** Com N pinos, pode controlar N*(N-1) LEDs!

---

### Exercício 3: Display 7-Segmentos com Shift Register
**Objetivo:** Expandir GPIOs com hardware externo

```c
#include "pico/stdlib.h"

// 3 pinos controlam 8 saídas (74HC595)
#define DATA_PIN  2
#define CLOCK_PIN 3
#define LATCH_PIN 4

void shift_out(uint8_t data) {
    gpio_put(LATCH_PIN, 0);
    
    for(int i = 7; i >= 0; i--) {
        gpio_put(CLOCK_PIN, 0);
        gpio_put(DATA_PIN, (data >> i) & 1);
        gpio_put(CLOCK_PIN, 1);
    }
    
    gpio_put(LATCH_PIN, 1);
}

// Padrões 7-seg para dígitos 0-9
const uint8_t digits[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    0b01011011,  // 2
    // ... resto
};

int main() {
    gpio_init(DATA_PIN);  gpio_set_dir(DATA_PIN, GPIO_OUT);
    gpio_init(CLOCK_PIN); gpio_set_dir(CLOCK_PIN, GPIO_OUT);
    gpio_init(LATCH_PIN); gpio_set_dir(LATCH_PIN, GPIO_OUT);
    
    int counter = 0;
    
    while (true) {
        shift_out(digits[counter % 10]);
        sleep_ms(1000);
        counter++;
    }
    
    return 0;
}
```

**Conceito:** Shift register = expansão infinita de GPIOs!

---

### Exercício 4: Matriz de Botões (Teclado Matricial)
**Objetivo:** Ler múltiplos botões com poucos pinos

```c
#include "pico/stdlib.h"

// 4x4 keypad = 8 pinos (4 linhas + 4 colunas)
#define ROW1 2
#define ROW2 3
#define ROW3 4
#define ROW4 5

#define COL1 6
#define COL2 7
#define COL3 8
#define COL4 9

const uint8_t rows[] = {ROW1, ROW2, ROW3, ROW4};
const uint8_t cols[] = {COL1, COL2, COL3, COL4};

const char keys[4][4] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}
};

void init_keypad() {
    // Linhas como saída
    for(int i = 0; i < 4; i++) {
        gpio_init(rows[i]);
        gpio_set_dir(rows[i], GPIO_OUT);
        gpio_put(rows[i], 1);
    }
    
    // Colunas como entrada com pull-up
    for(int i = 0; i < 4; i++) {
        gpio_init(cols[i]);
        gpio_set_dir(cols[i], GPIO_IN);
        gpio_pull_up(cols[i]);
    }
}

char scan_keypad() {
    for(int r = 0; r < 4; r++) {
        gpio_put(rows[r], 0);  // Ativa linha
        
        sleep_us(10);  // Debounce
        
        for(int c = 0; c < 4; c++) {
            if(!gpio_get(cols[c])) {
                gpio_put(rows[r], 1);  // Desativa linha
                return keys[r][c];
            }
        }
        
        gpio_put(rows[r], 1);  // Desativa linha
    }
    
    return 0;  // Nenhuma tecla
}

int main() {
    stdio_init_all();
    init_keypad();
    
    while (true) {
        char key = scan_keypad();
        if(key) {
            printf("Tecla: %c\n", key);
            sleep_ms(200);  // Debounce
        }
        sleep_ms(10);
    }
    
    return 0;
}
```

---

### 🎯 PROJETO NÍVEL 1: Badge LED Wearable

**Descrição:** Badge com 8x8 matriz de LEDs e animações.

**Desafios de Design:**
- Apenas 4 pinos para 64 LEDs (usar matriz + shift register)
- Bateria LiPo (gerenciamento de energia)
- Pequeno o suficiente para vestir
- Botão para trocar animações

**Componentes:**
- RP2040 Zero
- Matriz LED 8x8 (MAX7219)
- Bateria LiPo 3.7V
- Regulador 3.3V
- Botão
- Interruptor on/off

```c
#include "pico/stdlib.h"
#include "hardware/spi.h"

// MAX7219 controla matriz 8x8 com SPI (3 pinos!)
#define MAX_CLK  2
#define MAX_DIN  3
#define MAX_CS   4

// Padrões de animação
const uint8_t smile[8] = {
    0b00111100,
    0b01000010,
    0b10100101,
    0b10000001,
    0b10100101,
    0b10011001,
    0b01000010,
    0b00111100
};

const uint8_t heart[8] = {
    0b00000000,
    0b01100110,
    0b11111111,
    0b11111111,
    0b11111111,
    0b01111110,
    0b00111100,
    0b00011000
};

void max7219_write(uint8_t reg, uint8_t data) {
    gpio_put(MAX_CS, 0);
    spi_write_blocking(spi0, &reg, 1);
    spi_write_blocking(spi0, &data, 1);
    gpio_put(MAX_CS, 1);
}

void display_pattern(const uint8_t *pattern) {
    for(int row = 0; row < 8; row++) {
        max7219_write(row + 1, pattern[row]);
    }
}

int main() {
    // Setup SPI...
    
    int animation = 0;
    
    while (true) {
        switch(animation % 2) {
            case 0: display_pattern(smile); break;
            case 1: display_pattern(heart); break;
        }
        
        // Botão troca animação
        sleep_ms(100);
    }
    
    return 0;
}
```

---
