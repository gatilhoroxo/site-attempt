---
layout: default
title: N1 Basico
---


## 📚 NÍVEL 1 - BÁSICO (Semanas 2-4)

### Semana 2: GPIO Básico e Comparação

#### Exercício 1: Blink LED (Comparando com ESP32)
**Objetivo:** Ver diferenças de sintaxe

```c
#include "pico/stdlib.h"

#define LED_PIN 25  // LED interno do Pico

int main() {
    // Inicializar GPIO
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

**Comparação com ESP32:**
| ESP32 | RP2040 |
|-------|---------|
| `gpio_reset_pin()` | `gpio_init()` |
| `gpio_set_direction()` | `gpio_set_dir()` |
| `gpio_set_level()` | `gpio_put()` |
| `vTaskDelay()` | `sleep_ms()` |

**Conceitos Novos:**
- SDK mais simples e direto
- Sem FreeRTOS por padrão (mas pode adicionar)
- `sleep_ms()` é blocking (diferente de FreeRTOS)

---

#### Exercício 2: Múltiplos LEDs com Máscara de Bits
**Objetivo:** Controlar vários GPIOs eficientemente

```c
#include "pico/stdlib.h"

// LEDs nos pinos 10, 11, 12
#define LED1_PIN 10
#define LED2_PIN 11
#define LED3_PIN 12

// Criar máscara: bits 10, 11, 12 ativos
#define LED_MASK ((1 << LED1_PIN) | (1 << LED2_PIN) | (1 << LED3_PIN))

int main() {
    // Inicializar múltiplos pinos de uma vez
    gpio_init_mask(LED_MASK);
    gpio_set_dir_out_masked(LED_MASK);
    
    while (true) {
        // Sequência binária nos LEDs
        for(int i = 0; i < 8; i++) {
            uint32_t pattern = i << LED1_PIN;
            gpio_put_masked(LED_MASK, pattern);
            sleep_ms(500);
        }
    }
    
    return 0;
}
```

**Conceitos:**
- Máscaras de bits (muito usado em bare metal)
- Operações com múltiplos pinos simultaneamente
- Mais eficiente que controlar um por um

**Analogia One Piece:** É como o Zoro usando Santoryu (três espadas) ao mesmo tempo ao invés de uma por vez!

---

#### Exercício 3: Botão com Pull-up e Debounce
**Objetivo:** Leitura robusta de botão

```c
#include "pico/stdlib.h"

#define BUTTON_PIN 14
#define LED_PIN 25
#define DEBOUNCE_MS 50

bool button_pressed_debounced() {
    static uint32_t last_time = 0;
    static bool last_state = true;  // Pull-up: true = não pressionado
    
    bool current_state = gpio_get(BUTTON_PIN);
    uint32_t current_time = to_ms_since_boot(get_absolute_time());
    
    if (current_state != last_state) {
        if ((current_time - last_time) > DEBOUNCE_MS) {
            last_state = current_state;
            last_time = current_time;
            return !current_state;  // true quando pressionado
        }
    }
    
    return false;
}

int main() {
    stdio_init_all();
    
    gpio_init(BUTTON_PIN);
    gpio_set_dir(BUTTON_PIN, GPIO_IN);
    gpio_pull_up(BUTTON_PIN);
    
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    bool led_state = false;
    
    while (true) {
        if (button_pressed_debounced()) {
            led_state = !led_state;
            gpio_put(LED_PIN, led_state);
            printf("LED: %s\n", led_state ? "ON" : "OFF");
        }
        sleep_ms(1);
    }
    
    return 0;
}
```

---

### Semana 3: PWM e ADC

#### Exercício 4: PWM no RP2040
**Objetivo:** Controle de brilho

```c
#include "pico/stdlib.h"
#include "hardware/pwm.h"

#define LED_PIN 15

int main() {
    // Configurar PWM
    gpio_set_function(LED_PIN, GPIO_FUNC_PWM);
    uint slice_num = pwm_gpio_to_slice_num(LED_PIN);
    
    // Configurar frequência e wrap
    pwm_set_wrap(slice_num, 255);  // 0-255
    pwm_set_enabled(slice_num, true);
    
    while (true) {
        // Fade in
        for(int level = 0; level <= 255; level++) {
            pwm_set_gpio_level(LED_PIN, level);
            sleep_ms(5);
        }
        
        // Fade out
        for(int level = 255; level >= 0; level--) {
            pwm_set_gpio_level(LED_PIN, level);
            sleep_ms(5);
        }
    }
    
    return 0;
}
```

**Diferenças do ESP32:**
- RP2040 tem PWM "slices" (cada slice controla 2 pinos)
- Configuração mais próxima do hardware
- Mais controle fino sobre timings

**CMakeLists.txt adicionar:**
```cmake
target_link_libraries(meu_projeto 
    pico_stdlib
    hardware_pwm  # ADICIONAR ESTA LINHA
)
```

---

#### Exercício 5: ADC (Leitura Analógica)
**Objetivo:** Ler sensor/potenciômetro

```c
#include "pico/stdlib.h"
#include "hardware/adc.h"

#define POT_PIN 26  // ADC0

int main() {
    stdio_init_all();
    
    // Inicializar ADC
    adc_init();
    adc_gpio_init(POT_PIN);
    adc_select_input(0);  // ADC0 = GPIO26
    
    while (true) {
        uint16_t raw = adc_read();  // 0-4095 (12-bit)
        float voltage = raw * 3.3f / 4095.0f;
        
        printf("Raw: %d, Voltage: %.2fV\n", raw, voltage);
        sleep_ms(500);
    }
    
    return 0;
}
```

**Pinos ADC no RP2040:**
- GPIO26 = ADC0
- GPIO27 = ADC1
- GPIO28 = ADC2
- GPIO29 = ADC3 (também temperatura interna!)

---

### Semana 4: Interrupts

#### Exercício 6: GPIO Interrupt
**Objetivo:** Resposta imediata a eventos

```c
#include "pico/stdlib.h"
#include "hardware/gpio.h"

#define BUTTON_PIN 14
#define LED_PIN 25

volatile int counter = 0;

void gpio_callback(uint gpio, uint32_t events) {
    if (gpio == BUTTON_PIN && (events & GPIO_IRQ_EDGE_FALL)) {
        counter++;
        gpio_put(LED_PIN, !gpio_get(LED_PIN));
    }
}

int main() {
    stdio_init_all();
    
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    gpio_init(BUTTON_PIN);
    gpio_set_dir(BUTTON_PIN, GPIO_IN);
    gpio_pull_up(BUTTON_PIN);
    
    // Configurar interrupt
    gpio_set_irq_enabled_with_callback(
        BUTTON_PIN, 
        GPIO_IRQ_EDGE_FALL, 
        true, 
        &gpio_callback
    );
    
    while (true) {
        printf("Contador: %d\n", counter);
        sleep_ms(1000);
    }
    
    return 0;
}
```

---

### 🎯 PROJETO NÍVEL 1: Knight Rider com Dual-Core

**Descrição:** Efeito Knight Rider em LEDs usando ambos os cores.

**Componentes:**
- 8 LEDs
- 8 resistores 220Ω

**Conceito Novo: Dual-Core!**
```c
#include "pico/stdlib.h"
#include "pico/multicore.h"

#define NUM_LEDS 8
#define FIRST_LED 10

// Core 1: controla LEDs
void core1_entry() {
    while (true) {
        // Efeito de ida
        for(int i = 0; i < NUM_LEDS; i++) {
            gpio_put(FIRST_LED + i, 1);
            sleep_ms(50);
            gpio_put(FIRST_LED + i, 0);
        }
        
        // Efeito de volta
        for(int i = NUM_LEDS - 1; i >= 0; i--) {
            gpio_put(FIRST_LED + i, 1);
            sleep_ms(50);
            gpio_put(FIRST_LED + i, 0);
        }
    }
}

int main() {
    // Core 0: inicialização e monitoramento
    stdio_init_all();
    
    for(int i = 0; i < NUM_LEDS; i++) {
        gpio_init(FIRST_LED + i);
        gpio_set_dir(FIRST_LED + i, GPIO_OUT);
    }
    
    // Iniciar Core 1
    multicore_launch_core1(core1_entry);
    
    // Core 0 fica livre para outras tarefas
    while (true) {
        printf("Core 0 rodando...\n");
        sleep_ms(2000);
    }
    
    return 0;
}
```

**Conceitos:**
- Dual-core programming
- Divisão de tarefas
- Comunicação entre cores (próximo exercício)

---
