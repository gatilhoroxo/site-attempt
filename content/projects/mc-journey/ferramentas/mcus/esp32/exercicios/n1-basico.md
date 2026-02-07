---
layout: default
title: N1 Basico
---

## 📚 NÍVEL 1 - BÁSICO (Semanas 3-6)

**Progresso:** [ ] Semana 3 | [ ] Semana 4 | [ ] Semana 5 | [ ] Semana 6 | [ ] Projeto Final

---

## 📑 Índice

### [Semana 3: GPIO Básico](#semana-3-gpio-básico)
- [Exercício 1: Blink LED Tradicional](#exercício-1-blink-led-tradicional)
- [Exercício 2: Leitura de Botão](#exercício-2-leitura-de-botão)
- [Exercício 3: Debounce de Botão](#exercício-3-debounce-de-botão)

### [Semana 4: PWM e Sons](#semana-4-pwm-e-sons)
- [Exercício 4: Fade LED com PWM](#exercício-4-fade-led-com-pwm)
- [Exercício 5: Buzzer com Notas Musicais](#exercício-5-buzzer-com-notas-musicais)

### [Semana 5: ADC (Conversor Analógico-Digital)](#semana-5-adc-conversor-analógico-digital)
- [Exercício 6: Ler Potenciômetro](#exercício-6-ler-potenciômetro)
- [Exercício 7: Controlar LED com Potenciômetro](#exercício-7-controlar-led-com-potenciômetro)

### [Semana 6: Display 7 Segmentos](#semana-6-display-7-segmentos)
- [Exercício 8: Controlar Display 7seg](#exercício-8-controlar-display-7seg)

### [🎯 Projeto Final: Semáforo Inteligente](#-projeto-final-semáforo-inteligente)

### [⚠️ Problemas Comuns e Soluções](#️-problemas-comuns-e-soluções)

### [🔗 Próximos Passos](#-próximos-passos)

---

## Semana 3: GPIO Básico

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐ Iniciante
- 🎯 **Habilidades desenvolvidas:** Configuração de GPIO, controle digital, leitura de entrada, debounce
- ✅ **Checklist:** [ ] Exercício 1 | [ ] Exercício 2 | [ ] Exercício 3

### 📖 Fundamentos - GPIO (General Purpose Input/Output)

**O que é GPIO?**
- Pinos configuráveis como entrada (input) ou saída (output)
- Operam com níveis lógicos: HIGH (3.3V no ESP32) e LOW (0V)
- Podem ter resistores pull-up/pull-down internos

**Modos de Operação:**
- **Output:** Controla dispositivos (LEDs, relés, etc)
- **Input:** Lê estado de sensores, botões
- **Pull-up/Pull-down:** Resistores internos que definem estado padrão

**Bouncing em Botões:**
- Contatos mecânicos geram múltiplos sinais ao pressionar
- Solução: debounce por software (delay) ou hardware (capacitor)

**APIs Principais ESP-IDF:**
```c
gpio_reset_pin()           // Reseta configuração do pino
gpio_set_direction()       // Define modo (input/output)
gpio_set_level()           // Define estado (HIGH/LOW)
gpio_get_level()           // Lê estado do pino
gpio_set_pull_mode()       // Configura pull-up/pull-down
```

---

### Exercício 1: Blink LED Tradicional

**Objetivo:** Piscar LED usando vTaskDelay

**Componentes Necessários:**
- 1x LED (ou use o LED interno GPIO_NUM_2)
- 1x Resistor 220Ω (se usar LED externo)
- Jumpers

**Conceitos:**
- Configuração de GPIO como saída
- Output mode
- Delays com FreeRTOS (vTaskDelay)

<details>
<summary>Código Básico pro Exercício</summary>

```c
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#define LED_PIN GPIO_NUM_2  // LED interno

void app_main(void)
{
    // Configurar pino como saída
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);
    
    while(1) {
        gpio_set_level(LED_PIN, 1);  // Liga
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        gpio_set_level(LED_PIN, 0);  // Desliga
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Fazer piscar mais rápido e alternado com outro led
2. 🟡 **Médio:** Criar padrão S.O.S em morse (curto-curto-curto, longo-longo-longo, curto-curto-curto)
3. 🔴 **Difícil:** Usar 3 LEDs alternados criando efeito de "corrida"
4. **Extra:** Fazer os três níveis anteriores ao mesmo tempo

---

### Exercício 2: Leitura de Botão

**Objetivo:** Controlar LED com botão

**Componentes Necessários:**
- 1x LED (ou use GPIO_NUM_2)
- 1x Botão (ou use botão BOOT GPIO_NUM_0)
- 1x Resistor 220Ω (para LED externo)
- 1x Resistor 10kΩ (se usar botão externo sem pull-up interno)
- Jumpers

**Conceitos:**
- Configuração de GPIO como entrada (input mode)
- Pull-up resistor interno
- Leitura de estado digital (gpio_get_level)
- Lógica invertida com pull-up (LOW = pressionado)

<details>
<summary>Código Básico pro Exercício</summary>

```c
#define LED_PIN GPIO_NUM_2
#define BUTTON_PIN GPIO_NUM_0  // Boot button

void app_main(void)
{
    // LED como saída
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);
    
    // Botão como entrada com pull-up
    gpio_reset_pin(BUTTON_PIN);
    gpio_set_direction(BUTTON_PIN, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_PIN, GPIO_PULLUP_ONLY);
    
    while(1) {
        int button_state = gpio_get_level(BUTTON_PIN);
        
        if(button_state == 0) {  // Botão pressionado (pull-up)
            gpio_set_level(LED_PIN, 1);
        } else {
            gpio_set_level(LED_PIN, 0);
        }
        
        vTaskDelay(10 / portTICK_PERIOD_MS);  // Pequeno delay
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Inverter lógica (botão apaga LED ao invés de acender)
2. 🟡 **Médio:** Toggle LED (liga/desliga ao pressionar uma vez)
3. 🔴 **Difícil:** Contar quantas vezes o botão foi pressionado e exibir no serial

---

### Exercício 3: Debounce de Botão

**Objetivo:** Eliminar bouncing mecânico do botão

**Componentes Necessários:**
- Mesmos do Exercício 2

**Conceitos:**
- Bouncing mecânico em botões
- Debounce por software
- Uso de timestamps (xTaskGetTickCount)
- Máquina de estados simples

<details>
<summary>Código Básico pro Exercício</summary>

```c
#define DEBOUNCE_TIME_MS 50

bool read_button_debounced(gpio_num_t pin) {
    static int last_state = 1;
    static uint32_t last_time = 0;
    
    int current_state = gpio_get_level(pin);
    uint32_t current_time = xTaskGetTickCount() * portTICK_PERIOD_MS;
    
    if(current_state != last_state) {
        if((current_time - last_time) > DEBOUNCE_TIME_MS) {
            last_state = current_state;
            last_time = current_time;
            return true;  // Mudança válida
        }
    }
    
    return false;
}

void app_main(void)
{
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);
    gpio_reset_pin(BUTTON_PIN);
    gpio_set_direction(BUTTON_PIN, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_PIN, GPIO_PULLUP_ONLY);
    
    bool led_state = false;
    
    while(1) {
        if(read_button_debounced(BUTTON_PIN)) {
            if(gpio_get_level(BUTTON_PIN) == 0) {
                led_state = !led_state;
                gpio_set_level(LED_PIN, led_state);
            }
        }
        vTaskDelay(1 / portTICK_PERIOD_MS);
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Ajustar tempo de debounce para 100ms
2. 🟡 **Médio:** Implementar detecção de pressionamento longo (> 2 segundos)
3. 🔴 **Difícil:** Criar contador de cliques duplos (double-click)

---

## Semana 4: PWM e Sons

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** PWM, controle de brilho, geração de tons, LEDC
- ✅ **Checklist:** [ ] Exercício 4 | [ ] Exercício 5

### 📖 Fundamentos - PWM (Pulse Width Modulation)

**O que é PWM?**
- Técnica de modular largura de pulso para controlar potência média
- Alterna entre HIGH e LOW rapidamente
- Duty cycle: percentual do tempo em HIGH (0-100%)

**Aplicações:**
- Controle de brilho de LEDs
- Controle de velocidade de motores
- Geração de tons/sons
- Controle de servos

**LEDC no ESP32:**
- LED Controller (LEDC) - periférico PWM dedicado
- 8 canais independentes
- Resolução configurável (1-20 bits)
- Frequência ajustável

**APIs Principais:**
```c
ledc_timer_config()        // Configura timer PWM
ledc_channel_config()      // Configura canal
ledc_set_duty()           // Define duty cycle
ledc_update_duty()        // Aplica mudanças
ledc_set_freq()           // Muda frequência (para sons)
```

---

### Exercício 4: Fade LED com PWM

**Objetivo:** Controlar brilho de LED com PWM

**Componentes Necessários:**
- 1x LED (ou use GPIO_NUM_2)
- 1x Resistor 220Ω (se usar LED externo)
- Jumpers

**Conceitos:**
- Configuração de timer LEDC
- Duty cycle (0-255 com resolução de 8 bits)
- Atualização de PWM em tempo real

<details>
<summary>Código Básico pro Exercício</summary>

```c
#include "driver/ledc.h"

#define LED_PIN GPIO_NUM_2
#define PWM_CHANNEL LEDC_CHANNEL_0
#define PWM_TIMER LEDC_TIMER_0

void setup_pwm(void)
{
    // Configurar timer
    ledc_timer_config_t timer_conf = {
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .duty_resolution = LEDC_TIMER_8_BIT,  // 0-255
        .timer_num = PWM_TIMER,
        .freq_hz = 5000,
        .clk_cfg = LEDC_AUTO_CLK
    };
    ledc_timer_config(&timer_conf);
    
    // Configurar canal
    ledc_channel_config_t channel_conf = {
        .gpio_num = LED_PIN,
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .channel = PWM_CHANNEL,
        .timer_sel = PWM_TIMER,
        .duty = 0,
        .hpoint = 0
    };
    ledc_channel_config(&channel_conf);
}

void app_main(void)
{
    setup_pwm();
    
    while(1) {
        // Fade in
        for(int duty = 0; duty <= 255; duty++) {
            ledc_set_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL, duty);
            ledc_update_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL);
            vTaskDelay(10 / portTICK_PERIOD_MS);
        }
        
        // Fade out
        for(int duty = 255; duty >= 0; duty--) {
            ledc_set_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL, duty);
            ledc_update_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL);
            vTaskDelay(10 / portTICK_PERIOD_MS);
        }
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Inverter animação (começar com fade out)
2. 🟡 **Médio:** Criar efeito de "respiração" com velocidade variável
3. 🔴 **Difícil:** Controlar 3 LEDs RGB independentemente criando efeitos de cores

---

### Exercício 5: Buzzer com Notas Musicais

**Objetivo:** Gerar tons musicais diferentes

**Componentes Necessários:**
- 1x Buzzer piezelétrico (passivo)
- Jumpers

**Conceitos:**
- Relação entre frequência e nota musical
- Mudança dinâmica de frequência PWM
- Controle de duração de notas

<details>
<summary>Código Básico pro Exercício</summary>

```c
#define BUZZER_PIN GPIO_NUM_4
#define PWM_CHANNEL LEDC_CHANNEL_0

// Frequências das notas (Hz)
#define NOTE_C4 262
#define NOTE_D4 294
#define NOTE_E4 330
#define NOTE_F4 349
#define NOTE_G4 392
#define NOTE_A4 440
#define NOTE_B4 494
#define NOTE_C5 523

void play_note(int frequency, int duration_ms)
{
    if(frequency > 0) {
        ledc_set_freq(LEDC_LOW_SPEED_MODE, PWM_TIMER, frequency);
        ledc_set_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL, 128);  // 50%
        ledc_update_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL);
    }
    
    vTaskDelay(duration_ms / portTICK_PERIOD_MS);
    
    // Silêncio
    ledc_set_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL, 0);
    ledc_update_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL);
    vTaskDelay(50 / portTICK_PERIOD_MS);
}

void app_main(void)
{
    // Setup PWM igual ao exercício anterior
    setup_pwm();
    
    while(1) {
        // Toca escala C maior
        play_note(NOTE_C4, 500);
        play_note(NOTE_D4, 500);
        play_note(NOTE_E4, 500);
        play_note(NOTE_F4, 500);
        play_note(NOTE_G4, 500);
        play_note(NOTE_A4, 500);
        play_note(NOTE_B4, 500);
        play_note(NOTE_C5, 500);
        
        vTaskDelay(2000 / portTICK_PERIOD_MS);
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Tocar melodia simples (ex: Parabéns pra Você)
2. 🟡 **Médio:** Adicionar pausas entre notas e controlar ritmo
3. 🔴 **Difícil:** Criar sistema de alarme com padrões de beep diferentes

---

## Semana 5: ADC (Conversor Analógico-Digital)

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** Leitura analógica, conversão ADC, mapeamento de valores
- ✅ **Checklist:** [ ] Exercício 6 | [ ] Exercício 7

### 📖 Fundamentos - ADC (Analog-to-Digital Converter)

**O que é ADC?**
- Converte sinais analógicos (voltagem contínua) em valores digitais
- ESP32 tem dois ADCs (ADC1 e ADC2)
- Resolução de 12 bits (valores 0-4095)

**Características ESP32:**
- ADC1: 8 canais (GPIO32-39)
- ADC2: compartilhado com WiFi (evite usar com WiFi ativo)
- Atenuação configurável (define range de voltagem)

**Atenuação (Attenuation):**
- `ADC_ATTEN_DB_0` - 0-1.1V
- `ADC_ATTEN_DB_2_5` - 0-1.5V
- `ADC_ATTEN_DB_6` - 0-2.2V
- `ADC_ATTEN_DB_11` - 0-3.3V (mais usado)

**Conversões Úteis:**
```c
float voltage = (raw_value / 4095.0) * 3.3;  // Para voltagem
int percent = (raw_value * 100) / 4095;     // Para percentual
```

**APIs Principais:**
```c
adc1_config_width()        // Define resolução
adc1_config_channel_atten() // Define atenuação
adc1_get_raw()             // Lê valor bruto
```

---

### Exercício 6: Ler Potenciômetro

**Objetivo:** Ler valores analógicos e converter para voltagem

**Componentes Necessários:**
- 1x Potenciômetro 10kΩ
- Jumpers

**Conceitos:**
- Configuração de canal ADC
- Leitura de valor bruto (0-4095)
- Conversão para voltagem

<details>
<summary>Código Básico pro Exercício</summary>

```c
#include "driver/adc.h"

#define POT_PIN ADC1_CHANNEL_6  // GPIO34

void app_main(void)
{
    // Configurar ADC
    adc1_config_width(ADC_WIDTH_BIT_12);  // 0-4095
    adc1_config_channel_atten(POT_PIN, ADC_ATTEN_DB_11);  // 0-3.3V
    
    while(1) {
        int raw_value = adc1_get_raw(POT_PIN);
        float voltage = (raw_value / 4095.0) * 3.3;
        
        printf("Raw: %d, Voltage: %.2fV\n", raw_value, voltage);
        
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Exibir valor em percentual (0-100%)
2. 🟡 **Médio:** Criar barágrafo no serial (ex: [====    ] 40%)
3. 🔴 **Difícil:** Implementar média móvel para suavizar leituras ruidosas

---

### Exercício 7: Controlar LED com Potenciômetro

**Objetivo:** Integrar ADC + PWM para controle de brilho

**Componentes Necessários:**
- 1x Potenciômetro 10kΩ
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- Mapeamento de valores (0-4095 para 0-255)
- Integração ADC + PWM
- Controle em tempo real

<details>
<summary>Código Básico pro Exercício</summary>

```c
void app_main(void)
{
    setup_pwm();
    adc1_config_width(ADC_WIDTH_BIT_12);
    adc1_config_channel_atten(POT_PIN, ADC_ATTEN_DB_11);
    
    while(1) {
        int raw = adc1_get_raw(POT_PIN);
        int duty = (raw * 255) / 4095;  // Mapeia 0-4095 para 0-255
        
        ledc_set_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL, duty);
        ledc_update_duty(LEDC_LOW_SPEED_MODE, PWM_CHANNEL);
        
        printf("Brilho: %d%%\n", (duty * 100) / 255);
        
        vTaskDelay(50 / portTICK_PERIOD_MS);
    }
}
```

</details>

**Desafios:**
1. 🟢 **Fácil:** Adicionar histerese para evitar flickering
2. 🟡 **Médio:** Controlar freqüência de buzzer com potenciômetro
3. 🔴 **Difícil:** Controlar cor de LED RGB usando 3 potenciômetros (R, G, B)

---

## Semana 6: Display 7 Segmentos

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 6-8 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** Multiplexação de GPIO, controle de displays, padrões binários
- ✅ **Checklist:** [ ] Exercício 8

### 📖 Fundamentos - Display 7 Segmentos

**O que é?**
- 7 LEDs dispostos para formar dígitos (0-9)
- Segmentos: A, B, C, D, E, F, G (+ ponto decimal opcional)
- Tipos: catodo comum (GND compartilhado) ou anodo comum (VCC compartilhado)

**Controle:**
- Cada segmento conectado a um GPIO
- Padrões binários definem qual dígito exibir
- Pode usar multiplexagem para vários displays

**Padrões de Dígitos:**
- Representados em binário (bits = segmentos)
- Exemplo: `0b00111111` = dígito 0 (todos segmentos exceto G)

---

### Exercício 8: Controlar Display 7seg

**Objetivo:** Exibir dígitos 0-9 em display 7 segmentos

**Componentes Necessários:**
- 1x Display 7 segmentos (catodo comum)
- 7x Resistores 220Ω (um para cada segmento)
- Jumpers

**Conceitos:**
- Multiplexação de GPIOs
- Padrões binários para dígitos
- Controle de múltiplos pinos simultaneamente

<details>
<summary>Código Básico pro Exercício</summary>

```c
// Definir pinos (ajuste conforme sua conexão)
#define SEG_A GPIO_NUM_13
#define SEG_B GPIO_NUM_12
#define SEG_C GPIO_NUM_14
#define SEG_D GPIO_NUM_27
#define SEG_E GPIO_NUM_26
#define SEG_F GPIO_NUM_25
#define SEG_G GPIO_NUM_33

const gpio_num_t segments[] = {SEG_A, SEG_B, SEG_C, SEG_D, SEG_E, SEG_F, SEG_G};

// Padrões para dígitos 0-9 (catodo comum)
const uint8_t digit_patterns[] = {
    0b00111111,  // 0
    0b00000110,  // 1
    0b01011011,  // 2
    0b01001111,  // 3
    0b01100110,  // 4
    0b01101101,  // 5
    0b01111101,  // 6
    0b00000111,  // 7
    0b01111111,  // 8
    0b01101111   // 9
};

void setup_7seg(void)
{
    for(int i = 0; i < 7; i++) {
        gpio_reset_pin(segments[i]);
        gpio_set_direction(segments[i], GPIO_MODE_OUTPUT);
    }
}

void display_digit(int digit)
{
    if(digit < 0 || digit > 9) return;
    
    uint8_t pattern = digit_patterns[digit];
    
    for(int i = 0; i < 7; i++) {
        gpio_set_level(segments[i], (pattern >> i) & 1);
    }
}

void app_main(void)
{
    setup_7seg();
    
    int counter = 0;
    
    while(1) {
        display_digit(counter);
        counter = (counter + 1) % 10;
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}
```

</details>

---

## 🎯 Projeto Final: Semáforo Inteligente

**📊 Metadados do Projeto:**
- ⏱️ **Tempo estimado:** 12-15 horas
- 📊 **Dificuldade:** ⭐⭐⭐ Intermediário
- 🎯 **Habilidades integradas:** GPIO, PWM, ADC, debounce, máquina de estados

**Descrição:**
Sistema de semáforo completo com controle automático, botão de pedestre, display de contagem regressiva e sinalizador sonoro.

**Componentes Necessários:**
- 3x LEDs (vermelho, amarelo, verde)
- 3x Resistores 220Ω (para LEDs)
- 1x Botão (pedestre)
- 1x Resistor 10kΩ (pull-down do botão)
- 1x Display 7 segmentos
- 7x Resistores 220Ω (para display)
- 1x Buzzer
- Protoboard e jumpers

**Funcionalidades Obrigatórias:**
1. ✅ Ciclo automático: Verde (10s) → Amarelo (3s) → Vermelho (10s)
2. ✅ Botão de pedestre interrompe ciclo (com debounce)
3. ✅ Display 7seg mostra tempo restante em cada estado
4. ✅ Buzzer sinaliza mudanças de estado
5. ✅ LED verde pisca antes de mudar para amarelo (aviso)

**Diagrama de Estados:**
```
VERDE (10s) --> AMARELO (3s) --> VERMELHO (10s) --> [loop]
    ↑                                    |
    |         BOTÃO PEDESTRE             |
    +------------------------------------+
```

**Pinout Sugerido:**
```c
// LEDs
#define LED_RED    GPIO_NUM_25
#define LED_YELLOW GPIO_NUM_26
#define LED_GREEN  GPIO_NUM_27

// Botão
#define BTN_PEDESTRIAN GPIO_NUM_0  // Botão BOOT

// Display 7seg
#define SEG_A GPIO_NUM_13
#define SEG_B GPIO_NUM_12
#define SEG_C GPIO_NUM_14
#define SEG_D GPIO_NUM_27
#define SEG_E GPIO_NUM_26
#define SEG_F GPIO_NUM_25
#define SEG_G GPIO_NUM_33

// Buzzer
#define BUZZER GPIO_NUM_4
```

<details>
<summary>Template Básico pro Projeto</summary>

```c
#include "driver/gpio.h"
#include "driver/ledc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

typedef enum {
    STATE_GREEN,
    STATE_YELLOW,
    STATE_RED,
    STATE_PEDESTRIAN_WAIT
} traffic_state_t;

typedef struct {
    traffic_state_t current_state;
    int time_remaining;
    bool pedestrian_requested;
} traffic_system_t;

void setup_leds(void) {
    gpio_reset_pin(LED_RED);
    gpio_reset_pin(LED_YELLOW);
    gpio_reset_pin(LED_GREEN);
    gpio_set_direction(LED_RED, GPIO_MODE_OUTPUT);
    gpio_set_direction(LED_YELLOW, GPIO_MODE_OUTPUT);
    gpio_set_direction(LED_GREEN, GPIO_MODE_OUTPUT);
}

void setup_button(void) {
    gpio_reset_pin(BTN_PEDESTRIAN);
    gpio_set_direction(BTN_PEDESTRIAN, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BTN_PEDESTRIAN, GPIO_PULLUP_ONLY);
}

void setup_display(void) {
    // Configurar pinos do display 7seg
    // (implementar baseado no Exercício 8)
}

void setup_buzzer(void) {
    // Configurar PWM para buzzer
    // (implementar baseado no Exercício 5)
}

void set_traffic_light(traffic_state_t state) {
    // Apagar todos os LEDs
    gpio_set_level(LED_RED, 0);
    gpio_set_level(LED_YELLOW, 0);
    gpio_set_level(LED_GREEN, 0);
    
    // Acender LED correspondente
    switch(state) {
        case STATE_GREEN:
            gpio_set_level(LED_GREEN, 1);
            break;
        case STATE_YELLOW:
            gpio_set_level(LED_YELLOW, 1);
            break;
        case STATE_RED:
            gpio_set_level(LED_RED, 1);
            break;
    }
}

void play_beep(void) {
    // Tocar beep curto (implementar com buzzer)
}

void display_number(int num) {
    // Exibir número no display (implementar baseado no Exercício 8)
}

bool read_pedestrian_button(void) {
    // Implementar leitura com debounce (Exercício 3)
    static int last_state = 1;
    static uint32_t last_time = 0;
    // ... código de debounce aqui
    return false;
}

void traffic_light_task(void *pvParameters) {
    traffic_system_t system = {
        .current_state = STATE_GREEN,
        .time_remaining = 10,
        .pedestrian_requested = false
    };
    
    while(1) {
        // Verificar botão pedestre
        if(read_pedestrian_button() && gpio_get_level(BTN_PEDESTRIAN) == 0) {
            system.pedestrian_requested = true;
        }
        
        // Exibir tempo no display
        display_number(system.time_remaining);
        
        // Lógica da máquina de estados
        switch(system.current_state) {
            case STATE_GREEN:
                set_traffic_light(STATE_GREEN);
                
                // Piscar LED verde nos últimos 3 segundos
                if(system.time_remaining <= 3) {
                    gpio_set_level(LED_GREEN, system.time_remaining % 2);
                }
                
                if(system.time_remaining <= 0) {
                    system.current_state = STATE_YELLOW;
                    system.time_remaining = 3;
                    play_beep();
                }
                break;
                
            case STATE_YELLOW:
                set_traffic_light(STATE_YELLOW);
                
                if(system.time_remaining <= 0) {
                    system.current_state = STATE_RED;
                    system.time_remaining = 10;
                    play_beep();
                }
                break;
                
            case STATE_RED:
                set_traffic_light(STATE_RED);
                
                // Se pedestre solicitou, dar mais tempo
                if(system.pedestrian_requested && system.time_remaining > 5) {
                    system.time_remaining = 15;  // Extende tempo vermelho
                    system.pedestrian_requested = false;
                }
                
                if(system.time_remaining <= 0) {
                    system.current_state = STATE_GREEN;
                    system.time_remaining = 10;
                    play_beep();
                }
                break;
        }
        
        system.time_remaining--;
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // 1 segundo
    }
}

void app_main(void) {
    setup_leds();
    setup_button();
    setup_display();
    setup_buzzer();
    
    xTaskCreate(traffic_light_task, "traffic_light", 4096, NULL, 5, NULL);
}
```

</details>

**Critérios de Avaliação:**
- [ ] Código compila sem erros
- [ ] Ciclo automático funciona corretamente
- [ ] Botão pedestre é detectado com debounce
- [ ] Display mostra contagem regressiva
- [ ] Buzzer toca nas transições
- [ ] LED verde pisca antes de mudar
- [ ] Código bem organizado e comentado

**Extensões Opcionais (🌟 Desafios Extras):**
1. 🟡 Adicionar modo noturno (amarelo piscando)
2. 🟡 Usar ADC para sensor de luminosidade (ativa modo noturno)
3. 🔴 Implementar semáforo duplo (cruzamento)
4. 🔴 Adicionar comunicação serial para monitoramento/controle
5. 🔴 Criar interface web com WiFi para mudar parâmetros

---

## ⚠️ Problemas Comuns e Soluções

### GPIO não funciona
**Sintoma:** Pino não responde ou sempre em LOW/HIGH

**Soluções:**
- ✅ Verificar se `gpio_reset_pin()` foi chamado
- ✅ Confirmar direção configurada corretamente (INPUT/OUTPUT)
- ✅ GPIO34-39 são INPUT-ONLY (sem pull-up interno!)
- ✅ GPIO0 deve estar HIGH no boot (evite usar para output)
- ✅ Verificar conexões físicas e resistores

### PWM não gera sinal
**Sintoma:** LED não varia brilho ou buzzer não emite som

**Soluções:**
- ✅ Chamar `ledc_update_duty()` após `ledc_set_duty()`
- ✅ Verificar frequência configurada (5kHz para LED, nota específica para som)
- ✅ Confirmar duty cycle não está em 0 (apagado)
- ✅ Canal e timer configurados corretamente

### ADC retorna valores estranhos
**Sintoma:** Leituras inconsistentes, sempre 4095 ou 0

**Soluções:**
- ✅ Usar ADC1 (ADC2 conflita com WiFi)
- ✅ Configurar atenuação correta (`ADC_ATTEN_DB_11` para 0-3.3V)
- ✅ Aguardar alguns ms após configurar antes de ler
- ✅ Implementar média de várias leituras para reduzir ruído
- ✅ Verificar se pino é ADC-capable (GPIO32-39)

### Botão detecta múltiplos cliques
**Sintoma:** Um pressionamento conta como vários

**Soluções:**
- ✅ Implementar debounce (Exercício 3)
- ✅ Usar tempo de debounce adequado (50-100ms)
- ✅ Detectar apenas borda (mudança de estado)
- ✅ Adicionar capacitor (100nF) em paralelo ao botão (solução hardware)

### Display 7seg mostra dígitos errados
**Sintoma:** Números aparecem incorretos ou fragmentados

**Soluções:**
- ✅ Verificar tipo: catodo comum vs anodo comum (lógica invertida!)
- ✅ Confirmar mapeamento correto de pinos (A-G)
- ✅ Usar resistores em TODOS os segmentos
- ✅ Testar cada segmento individualmente
- ✅ Verificar padrões binários na lookup table

### Código compila mas ESP32 reinicia constantemente
**Sintoma:** Bootloop, mensagens de "panic" no serial

**Soluções:**
- ✅ Stack overflow - aumentar tamanho da stack em `xTaskCreate()`
- ✅ Watchdog timeout - adicionar `vTaskDelay()` em loops
- ✅ Acesso a ponteiro NULL - verificar inicializações
- ✅ GPIO strapping incorreto - evitar GPIO0, 2, 12, 15 para outputs críticos

### Serial não exibe nada
**Sintoma:** Monitor serial em branco

**Soluções:**
- ✅ Verificar baud rate (115200 padrão ESP-IDF)
- ✅ Pressionar botão RESET após conectar monitor
- ✅ Usar `idf.py monitor` ao invés de monitor genérico
- ✅ Verificar porta serial correta (`/dev/ttyUSB0` ou `/dev/ttyACM0`)

---

## 🔗 Próximos Passos

**🎉 Parabéns por completar o Nível 1!**

Você agora domina:
- ✅ Configuração e controle de GPIO (digital I/O)
- ✅ PWM para controle analógico (brilho, som)
- ✅ ADC para leitura de sensores analógicos
- ✅ Debounce e tratamento de entradas
- ✅ Controle de displays e multiplexação
- ✅ Máquinas de estado simples
- ✅ Integração de múltiplos periféricos

**Pré-requisitos atendidos para Nível 2:**
- ✅ Familiaridade com ESP-IDF e FreeRTOS básico
- ✅ Entendimento de periféricos básicos
- ✅ Capacidade de ler datasheets e documentação

**Próximo Nível:**
🔼 **[Nível 2 - Intermediário](../nivel-2-intermediario/info-intermediario.md)**

O que você vai aprender:
- Interrupções (ISR) e eventos
- Comunicação I2C e SPI
- WiFi básico (conexão, HTTP)
- Timers de hardware
- FreeRTOS tasks e sincronização
- UART e comunicação serial avançada

**Recomendações antes de avançar:**
1. 📝 Revisar exercícios que tiveram dificuldade
2. 🛠️ Experimentar com variações dos desafios
3. 📚 Ler documentação oficial: [ESP-IDF GPIO Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/gpio.html)
4. 🔍 Explorar exemplos oficiais: [ESP-IDF Examples](https://github.com/espressif/esp-idf/tree/master/examples)

**Recursos de Referência:**
- 📖 [ESP32 Technical Reference Manual](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- 📺 [Canal Brincando com Ideias](https://www.youtube.com/@BrincandocomIdeias)
- 💻 [ESP32 Pinout Reference](../../pin-diagrams/esp32-devkit-v1.md)

**Voltar:**
- 🏠 [README Principal ESP32](../../README.md)
- 📚 [Roadmap Geral](../../../../learn/roadmap_geral.md)

---

**Última atualização:** 15/01/2026

