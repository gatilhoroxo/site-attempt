---
layout: default
title: N2 Intermediario
---


## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 5-7)

### Semana 5: Gerenciamento de Energia

#### Exercício 5: Sleep Modes
**Objetivo:** Maximizar duração da bateria

```c
#include "pico/stdlib.h"
#include "pico/sleep.h"
#include "hardware/clocks.h"
#include "hardware/rosc.h"
#include "hardware/structs/scb.h"

// Configurar wake-up por GPIO
void setup_wake_pin(uint gpio) {
    gpio_init(gpio);
    gpio_set_dir(gpio, GPIO_IN);
    gpio_pull_up(gpio);
    gpio_set_dormant_irq_enabled(gpio, GPIO_IRQ_EDGE_FALL, true);
}

// Entrar em deep sleep
void enter_deep_sleep() {
    // Desligar tudo que não precisa
    uart_default_tx_wait_blocking();
    
    // Configurar ROSC
    rosc_write(&rosc_hw->ctrl, ROSC_CTRL_ENABLE_VALUE_ENABLE << ROSC_CTRL_ENABLE_LSB);
    
    // Sleep profundo
    sleep_run_from_xosc();
    sleep_goto_dormant_until_pin(WAKE_PIN, true, false);
    
    // Acordou! Reinicializar clocks
    rosc_write(&rosc_hw->ctrl, ROSC_CTRL_ENABLE_VALUE_ENABLE << ROSC_CTRL_ENABLE_LSB);
    clocks_init();
}

int main() {
    stdio_init_all();
    
    setup_wake_pin(BUTTON_PIN);
    
    while (true) {
        printf("Acordado! Fazendo trabalho...\n");
        
        // Fazer algo útil
        for(int i = 0; i < 5; i++) {
            gpio_put(LED_PIN, 1);
            sleep_ms(100);
            gpio_put(LED_PIN, 0);
            sleep_ms(100);
        }
        
        printf("Dormindo...\n");
        sleep_ms(100);
        
        enter_deep_sleep();
        
        printf("Acordei!\n");
    }
    
    return 0;
}
```

**Consumo Típico:**
- Normal: ~30mA
- Sleep: ~2-3mA
- Deep Sleep: ~0.4mA
- Dormant: ~0.18mA

---

#### Exercício 6: Medidor de Bateria
**Objetivo:** Monitorar nível de bateria via ADC

```c
#include "pico/stdlib.h"
#include "hardware/adc.h"

#define VBAT_ADC 29  // ADC3 pode medir VSYS

float read_battery_voltage() {
    adc_select_input(3);  // ADC3
    uint16_t raw = adc_read();
    
    // VSYS é dividido por 3 internamente no Pico
    // Então: V_real = (raw / 4095) * 3.3 * 3
    float voltage = (raw / 4095.0f) * 3.3f * 3.0f;
    
    return voltage;
}

int battery_percentage(float voltage) {
    // LiPo: 4.2V (100%) -> 3.0V (0%)
    if(voltage >= 4.2f) return 100;
    if(voltage <= 3.0f) return 0;
    
    return (int)((voltage - 3.0f) / 1.2f * 100);
}

int main() {
    stdio_init_all();
    adc_init();
    adc_gpio_init(VBAT_ADC);
    
    while (true) {
        float vbat = read_battery_voltage();
        int percent = battery_percentage(vbat);
        
        printf("Bateria: %.2fV (%d%%)\n", vbat, percent);
        
        if(percent < 10) {
            printf("⚠️ BATERIA BAIXA!\n");
            // Piscar LED de alerta
        }
        
        sleep_ms(5000);
    }
    
    return 0;
}
```

---

### Semana 6-7: Sensores Wearable

#### Exercício 7: Sensor de Movimento (Acelerômetro I2C)
**Objetivo:** Detectar movimentos

```c
#include "pico/stdlib.h"
#include "hardware/i2c.h"

// MPU6050 - Acelerômetro + Giroscópio
#define MPU6050_ADDR 0x68
#define MPU6050_PWR_MGMT_1 0x6B
#define MPU6050_ACCEL_XOUT_H 0x3B

void mpu6050_init() {
    uint8_t buf[] = {MPU6050_PWR_MGMT_1, 0};  // Wake up
    i2c_write_blocking(i2c0, MPU6050_ADDR, buf, 2, false);
}

void read_accelerometer(int16_t *ax, int16_t *ay, int16_t *az) {
    uint8_t buffer[6];
    uint8_t reg = MPU6050_ACCEL_XOUT_H;
    
    i2c_write_blocking(i2c0, MPU6050_ADDR, &reg, 1, true);
    i2c_read_blocking(i2c0, MPU6050_ADDR, buffer, 6, false);
    
    *ax = (buffer[0] << 8) | buffer[1];
    *ay = (buffer[2] << 8) | buffer[3];
    *az = (buffer[4] << 8) | buffer[5];
}

// Detector simples de shake
bool detect_shake(int16_t ax, int16_t ay, int16_t az) {
    // Magnitude aproximada
    int32_t magnitude = abs(ax) + abs(ay) + abs(az);
    return magnitude > 30000;  // Threshold
}

int main() {
    stdio_init_all();
    
    i2c_init(i2c0, 400000);
    gpio_set_function(0, GPIO_FUNC_I2C);
    gpio_set_function(1, GPIO_FUNC_I2C);
    
    mpu6050_init();
    
    while (true) {
        int16_t ax, ay, az;
        read_accelerometer(&ax, &ay, &az);
        
        if(detect_shake(ax, ay, az)) {
            printf("🎉 SHAKE DETECTADO!\n");
            // Fazer algo legal
        }
        
        sleep_ms(50);
    }
    
    return 0;
}
```

---

### 🎯 PROJETO NÍVEL 2: Pedômetro Wearable

**Descrição:** Contador de passos com display e economia de energia.

**Componentes:**
- RP2040 Zero
- MPU6050 (acelerômetro)
- Display OLED pequeno
- Bateria LiPo 500mAh
- Botão reset/modo

**Funcionalidades:**
1. Contar passos (algoritmo básico)
2. Mostrar no display
3. Sleep quando parado
4. Vibração (motor) a cada 1000 passos
5. Duração bateria: 24h+ de uso contínuo

```c
#include "pico/stdlib.h"
#include "hardware/i2c.h"

typedef struct {
    int steps;
    float distance_km;
    int calories;
    uint32_t active_time_min;
} pedometer_data_t;

pedometer_data_t data = {0};

// Algoritmo simples de detecção de passo
bool detect_step(int16_t ax, int16_t ay, int16_t az) {
    static int32_t last_mag = 0;
    static bool step_detected = false;
    static uint32_t last_step_time = 0;
    
    int32_t mag = abs(ax) + abs(ay) + abs(az);
    uint32_t now = to_ms_since_boot(get_absolute_time());
    
    // Detectar pico (simplificado)
    if(mag > 20000 && last_mag < 20000) {
        // Debounce: mínimo 300ms entre passos
        if(now - last_step_time > 300) {
            last_step_time = now;
            return true;
        }
    }
    
    last_mag = mag;
    return false;
}

void update_stats() {
    // Assumir: 1 passo = 0.762m (média)
    data.distance_km = data.steps * 0.000762f;
    
    // Assumir: 0.04 cal por passo (simplificado)
    data.calories = data.steps * 0.04f;
}

int main() {
    // Setup hardware...
    
    while (true) {
        int16_t ax, ay, az;
        read_accelerometer(&ax, &ay, &az);
        
        if(detect_step(ax, ay, az)) {
            data.steps++;
            update_stats();
            
            // Vibrar a cada 1000 passos
            if(data.steps % 1000 == 0) {
                gpio_put(MOTOR_PIN, 1);
                sleep_ms(100);
                gpio_put(MOTOR_PIN, 0);
            }
        }
        
        // Atualizar display
        display_stats(&data);
        
        // Sleep inteligente
        if(mag < 5000) {  // Parado
            sleep_ms(500);
        } else {
            sleep_ms(50);
        }
    }
    
    return 0;
}
```

---
