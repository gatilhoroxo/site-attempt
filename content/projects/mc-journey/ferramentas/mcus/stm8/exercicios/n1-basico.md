---
layout: default
title: N1 Basico
---


## 📚 NÍVEL 1 - BÁSICO (Semanas 3-6)

### Semana 3: Leitura de Botão

#### Exercício 1: Botão Controla LED

```c
#include <stdint.h>

// Registradores Port B
#define PB_ODR  (*(volatile uint8_t *)0x5005)
#define PB_IDR  (*(volatile uint8_t *)0x5006)
#define PB_DDR  (*(volatile uint8_t *)0x5007)
#define PB_CR1  (*(volatile uint8_t *)0x5008)

#define LED_PIN    5
#define BUTTON_PIN 4

void gpio_init(void) {
    // LED (PB5) como saída
    PB_DDR |= (1 << LED_PIN);
    PB_CR1 |= (1 << LED_PIN);
    
    // Botão (PB4) como entrada com pull-up
    PB_DDR &= ~(1 << BUTTON_PIN);  // Input
    PB_CR1 |= (1 << BUTTON_PIN);   // Pull-up ativado
}

void main(void) {
    gpio_init();
    
    while(1) {
        // Ler botão (pull-up: 0 = pressionado)
        if(!(PB_IDR & (1 << BUTTON_PIN))) {
            PB_ODR |= (1 << LED_PIN);   // Liga LED
        } else {
            PB_ODR &= ~(1 << LED_PIN);  // Desliga LED
        }
    }
}
```

---

#### Exercício 2: Debounce em Software

```c
#include <stdint.h>

#define DEBOUNCE_TIME 50  // ms

typedef struct {
    uint8_t last_state;
    uint16_t last_time;
} button_t;

// Contador de milissegundos (será incrementado por timer)
volatile uint16_t millis = 0;

uint8_t button_read_debounced(button_t *btn, uint8_t current_state) {
    if(current_state != btn->last_state) {
        if((millis - btn->last_time) > DEBOUNCE_TIME) {
            btn->last_state = current_state;
            btn->last_time = millis;
            return 1;  // Mudança válida
        }
    }
    return 0;  // Sem mudança ou bouncing
}

void main(void) {
    button_t btn = {1, 0};  // Estado inicial HIGH
    uint8_t led_state = 0;
    
    gpio_init();
    // TODO: Configurar timer para incrementar millis
    
    while(1) {
        uint8_t btn_current = (PB_IDR & (1 << BUTTON_PIN)) ? 1 : 0;
        
        if(button_read_debounced(&btn, btn_current)) {
            if(btn_current == 0) {  // Pressionado
                led_state = !led_state;
                if(led_state) {
                    PB_ODR |= (1 << LED_PIN);
                } else {
                    PB_ODR &= ~(1 << LED_PIN);
                }
            }
        }
    }
}
```

---

### Semana 4: Timers (Hardware Timing)

#### Exercício 3: Timer Básico com Interrupt

**Teoria:** Timers no STM8 contam pulsos de clock e geram interrupções quando atingem um valor específico.

```c
#include <stdint.h>

// ========================================
// REGISTRADORES TIMER 4 (8-bit)
// ========================================
#define TIM4_CR1   (*(volatile uint8_t *)0x5340)
#define TIM4_IER   (*(volatile uint8_t *)0x5343)
#define TIM4_SR    (*(volatile uint8_t *)0x5344)
#define TIM4_EGR   (*(volatile uint8_t *)0x5345)
#define TIM4_CNTR  (*(volatile uint8_t *)0x5346)
#define TIM4_PSCR  (*(volatile uint8_t *)0x5347)
#define TIM4_ARR   (*(volatile uint8_t *)0x5348)

// Interrupção (precisa estar neste nome exato!)
void TIM4_UPD_OVF_IRQHandler(void) __interrupt(23) {
    static uint16_t count = 0;
    
    // Incrementar contador de milissegundos
    count++;
    if(count >= 1) {  // 1ms passou
        millis++;
        count = 0;
        
        // Toggle LED a cada 500ms
        if(millis % 500 == 0) {
            PB_ODR ^= (1 << LED_PIN);
        }
    }
    
    // Limpar flag de interrupção
    TIM4_SR &= ~(1 << 0);
}

void timer4_init(void) {
    // Timer 4: 16MHz / 128 = 125kHz
    // ARR = 125 -> 1ms
    
    TIM4_PSCR = 0x07;  // Prescaler = 128 (2^7)
    TIM4_ARR = 125;    // Auto-reload = 125
    TIM4_IER = 0x01;   // Habilita interrupção de update
    TIM4_CR1 = 0x01;   // Habilita timer
    
    __asm__("rim");    // Habilita interrupções globalmente
}

void main(void) {
    gpio_init();
    timer4_init();
    
    while(1) {
        // Loop principal vazio
        // Timer faz o trabalho!
    }
}
```

**Entendendo:**
1. Timer conta de 0 até ARR (125)
2. Quando atinge ARR, gera interrupção
3. Interrupção executa e recomeça contagem
4. CPU livre para fazer outras coisas!

---

### Semana 5: PWM (Controle de Brilho)

#### Exercício 4: PWM no Timer 2

```c
#include <stdint.h>

// ========================================
// REGISTRADORES TIMER 2 (16-bit, tem PWM)
// ========================================
#define TIM2_CR1     (*(volatile uint8_t *)0x5300)
#define TIM2_CCMR1   (*(volatile uint8_t *)0x5307)
#define TIM2_CCER1   (*(volatile uint8_t *)0x530A)
#define TIM2_ARRH    (*(volatile uint8_t *)0x530F)
#define TIM2_ARRL    (*(volatile uint8_t *)0x5310)
#define TIM2_CCR1H   (*(volatile uint8_t *)0x5311)
#define TIM2_CCR1L   (*(volatile uint8_t *)0x5312)

#define LED_PIN 3  // PD3 = TIM2_CH1

void pwm_init(void) {
    // Configurar PD3 como saída (TIM2_CH1)
    PD_DDR |= (1 << LED_PIN);
    PD_CR1 |= (1 << LED_PIN);
    
    // Timer 2 configuração
    TIM2_ARRH = 0x00;
    TIM2_ARRL = 0xFF;  // ARR = 255 (8-bit PWM)
    
    // PWM Mode 1: OCM = 110
    TIM2_CCMR1 = 0x60;
    
    // Habilitar saída do canal 1
    TIM2_CCER1 = 0x01;
    
    // Iniciar timer
    TIM2_CR1 = 0x01;
}

void pwm_set_duty(uint8_t duty) {
    TIM2_CCR1H = 0x00;
    TIM2_CCR1L = duty;
}

void main(void) {
    pwm_init();
    
    uint8_t brightness = 0;
    uint8_t direction = 1;
    
    while(1) {
        pwm_set_duty(brightness);
        
        // Fade in/out
        if(direction) {
            brightness++;
            if(brightness == 255) direction = 0;
        } else {
            brightness--;
            if(brightness == 0) direction = 1;
        }
        
        delay_ms(10);
    }
}
```

---

### Semana 6: ADC (Leitura Analógica)

#### Exercício 5: Ler Potenciômetro

```c
#include <stdint.h>

// ========================================
// REGISTRADORES ADC
// ========================================
#define ADC_CSR    (*(volatile uint8_t *)0x5400)
#define ADC_CR1    (*(volatile uint8_t *)0x5401)
#define ADC_CR2    (*(volatile uint8_t *)0x5402)
#define ADC_DRH    (*(volatile uint8_t *)0x5404)
#define ADC_DRL    (*(volatile uint8_t *)0x5405)

void adc_init(void) {
    // Habilita ADC
    ADC_CR1 = 0x01;  // ADON = 1
    
    // Esperar estabilizar
    delay_ms(10);
}

uint16_t adc_read(uint8_t channel) {
    // Selecionar canal (0-5)
    ADC_CSR = channel;
    
    // Iniciar conversão
    ADC_CR1 |= 0x01;
    
    // Aguardar fim de conversão (EOC)
    while(!(ADC_CSR & 0x80));
    
    // Ler resultado (10 bits)
    uint16_t result = ADC_DRH << 8;
    result |= ADC_DRL;
    
    // Limpar EOC
    ADC_CSR &= ~0x80;
    
    return result >> 6;  // 10-bit -> 0-1023
}

void main(void) {
    gpio_init();
    pwm_init();
    adc_init();
    
    while(1) {
        // Ler potenciômetro (canal 2 = PD2/AIN2)
        uint16_t pot_value = adc_read(2);  // 0-1023
        
        // Converter para duty cycle (0-255)
        uint8_t brightness = pot_value >> 2;  // Divide por 4
        
        // Aplicar ao PWM
        pwm_set_duty(brightness);
        
        delay_ms(50);
    }
}
```

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

```c
void main(void) {
    // Inicializações
    gpio_init();
    adc_init();
    pwm_init();
    display_init();
    
    while(1) {
        // Ler entrada
        uint16_t pot = adc_read(POT_CHANNEL);
        
        // Botão de emergência
        if(button_emergency_pressed()) {
            pwm_set_duty(0);
            display_show_error();
            continue;
        }
        
        // Converter para velocidade (0-100%)
        uint8_t speed = (pot * 100) / 1023;
        
        // Aplicar PWM
        uint8_t pwm_duty = (pot * 255) / 1023;
        pwm_set_duty(pwm_duty);
        
        // Mostrar em display
        display_show_number(speed);
        
        delay_ms(100);
    }
}
```

---
