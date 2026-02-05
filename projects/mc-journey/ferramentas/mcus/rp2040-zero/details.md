---
layout: default
title: 🔷 Roadmap Detalhado - RP2040 Zero
---

# 🔷 Roadmap Detalhado - RP2040 Zero

## 📌 Por Que RP2040 Zero Depois do RP2040 Normal?

Se o RP2040 normal é o Zoro, o RP2040 Zero é o **Usopp** - aparentemente mais limitado, mas extremamente criativo e eficiente com os recursos que tem! Ele força você a pensar em cada pino, cada byte de memória, e cada miliampere de corrente.

### Características do RP2040 Zero
- ✅ **Mesma CPU** do RP2040 (dual-core, 133MHz)
- ✅ **Mesma memória** (264KB SRAM, 2MB Flash)
- ⚠️ **Menos pinos expostos** (~13 GPIO úteis vs 26 do Pico)
- ⚠️ **Form factor muito pequeno** (23.5mm x 18mm)
- ⚠️ **Sem LED onboard** (em alguns modelos)
- ✅ **USB-C** (mais moderno)
- ✅ **Perfeito para wearables e projetos compactos**

### O Desafio
Você tem todo o poder do RP2040, mas precisa:
- **Planejar uso de pinos** cuidadosamente
- **Otimizar espaço** físico
- **Gerenciar energia** para bateria
- **Pensar em portabilidade**

---

## 🗺️ Estratégia de Aprendizado

Como você já dominou o RP2040 normal, aqui vamos focar em:
1. **Adaptação para hardware limitado**
2. **Técnicas de economia de energia**
3. **Projetos wearable/portáteis**
4. **Multiplexação de pinos**
5. **Design compacto**

---

## 🛠️ Configuração e Mapeamento (Semana 1)

### Pinos Disponíveis no RP2040 Zero

**Mapeamento Típico:**
```
RP2040 Zero (Waveshare)
┌────────────────┐
│   USB-C        │
├────────────────┤
│ 0  GP0     5V  │  GP0-GP12: GPIO disponíveis
│ 1  GP1    GND  │  GP29: ADC3
│ 2  GP2     3V3 │  Alguns modelos: LED em GP16
│ 3  GP3    GP29 │
│ 4  GP4    GP28 │  Total: ~13 GPIO úteis
│ 5  GP5    GP27 │
│ 6  GP6    GP26 │  ADC: GP26, GP27, GP28, GP29
│ 7  GP7    GP15 │
│ 8  GP8    GP14 │  I2C0: GP0(SDA), GP1(SCL)
│ 9  GP9    GP13 │  I2C1: GP2(SDA), GP3(SCL)
│10  GP10   GP12 │  
│11  GP11   GP11 │  SPI0: GP3(SCK), GP4(MOSI), GP5(MISO)
└────────────────┘  UART0: GP0(TX), GP1(RX)
```

### Template de Projeto Minimalista

```c
#include "pico/stdlib.h"
#include <stdio.h>

// Definir pinos específicos para seu projeto
#define LED_PIN 16  // Se tiver LED interno
#define BUTTON_PIN 9

// Mapeamento de funcionalidades
#define I2C_SDA 0
#define I2C_SCL 1
#define ADC_PIN 26

int main() {
    // Inicialização mínima
    stdio_init_all();
    
    // Seu código aqui
    
    return 0;
}
```

---

## 📚 NÍVEL 1 - BÁSICO (Semanas 2-4)

### Exercício 1: LED Externo (Sem LED Onboard)
**Objetivo:** Trabalhar sem luxos!

---

### Exercício 2: Multiplexação de Pinos
**Objetivo:** Fazer mais com menos

---

### Exercício 3: Display 7-Segmentos com Shift Register
**Objetivo:** Expandir GPIOs com hardware externo

---

### Exercício 4: Matriz de Botões (Teclado Matricial)
**Objetivo:** Ler múltiplos botões com poucos pinos

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

---

## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 5-7)

### Semana 5: Gerenciamento de Energia

#### Exercício 5: Sleep Modes
**Objetivo:** Maximizar duração da bateria

---

#### Exercício 6: Medidor de Bateria
**Objetivo:** Monitorar nível de bateria via ADC

---

### Semana 6-7: Sensores Wearable

#### Exercício 7: Sensor de Movimento (Acelerômetro I2C)
**Objetivo:** Detectar movimentos

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

---

## 📚 NÍVEL 3 - AVANÇADO (Semanas 8-10)

### Projeto Nível 3: Smartwatch Básico

**Descrição:** Relógio inteligente completo e funcional.

**Componentes:**
- RP2040 Zero
- Display OLED 128x64
- RTC (Real Time Clock) I2C
- MPU6050
- Bateria LiPo
- Carregador TP4056
- Botões capacitivos

**Funcionalidades:**
1. Relógio com alarmes
2. Pedômetro
3. Monitor cardíaco (sensor óptico)
4. Notificações Bluetooth (via módulo)
5. Diversos watch faces
6. Sleep profundo (só acorda ao tocar)
7. Duração: 3-5 dias por carga

**Desafios de Engenharia:**
- PCB custom
- Case 3D impresso
- Interface touch
- Gerenciamento agressivo de energia
- Firmware OTA

---

## 📖 REFERÊNCIAS ESPECÍFICAS RP2040 ZERO

### Hardware
- **Datasheet Waveshare RP2040-Zero**
- **Low Power Design Techniques** - AN002
- **Battery Management** - Guias LiPo

### Wearables
- "Make: Wearable Electronics" - Kate Hartman
- "Fashioning Technology" - Syuzi Pakhchyan

### Projetos Inspiração
- https://hackaday.io/projects?tag=rp2040
- https://www.hackster.io/raspberry-pi/projects

---

## 💡 Dicas Específicas RP2040 Zero

### Planejamento de Pinos
```
Antes de começar qualquer projeto:
1. Liste TODAS funcionalidades
2. Mapeie pinos necessários
3. Identifique conflitos
4. Considere multiplexação
5. Documente!
```

### Economia de Energia
```c
// Checklist de economia:
- ✓ Desligar periféricos não usados
- ✓ Reduzir clock quando possível
- ✓ Deep sleep agressivo
- ✓ LEDs apenas quando necessário
- ✓ Display off quando inativo
```

### Design Físico
- PCB fino (<1.6mm)
- Componentes SMD (surface mount)
- Considerar dissipação de calor
- Proteger contra ESD
- Impermeabilização (para wearables)

### Debugging Sem Pinos
```c
// Usar USB serial para debug
stdio_init_all();
printf("Debug: valor = %d\n", x);

// Ou piscar LED em padrões morse
void debug_blink(int code) {
    for(int i = 0; i < code; i++) {
        led_on(); sleep_ms(100);
        led_off(); sleep_ms(100);
    }
}
```

---

*Próximo: STM8 - Bare Metal Extremo!*