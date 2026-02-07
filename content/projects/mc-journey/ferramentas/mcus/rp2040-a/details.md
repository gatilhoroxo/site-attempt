---
layout: default
title: 🍇 Roadmap Detalhado - RP2040
---

# 🍇 Roadmap Detalhado - RP2040

## 📌 Por Que RP2040 em Segundo?

Se o ESP32 é o Luffy (poderoso e versátil), o RP2040 é o **Roronoa Zoro** - extremamente focado, eficiente e com habilidades únicas (PIO = suas três espadas!). Após dominar o ESP32, você já entende os conceitos, agora vai aprender técnicas mais especializadas.

### Vantagens do RP2040
- ✅ Dual-core Cortex-M0+ (133MHz cada)
- ✅ PIO (Programmable I/O) - recurso ÚNICO
- ✅ DMA muito eficiente
- ✅ C SDK extremamente limpo e educativo
- ✅ 264KB SRAM
- ✅ Barato e disponível
- ✅ Documentação técnica excepcional

### O Que Torna o RP2040 Especial?
**PIO (Programmable I/O):** São 8 "mini-processadores" dedicados apenas para I/O. Você pode criar protocolos customizados ou implementar protocolos existentes sem sobrecarregar a CPU principal!

---

## 🛠️ Configuração Inicial (Semana 1)

### Instalação do SDK

#### Linux/Mac
```bash
# Instalar dependências
sudo apt update
sudo apt install cmake gcc-arm-none-eabi libnewlib-arm-none-eabi \
                 build-essential git python3

# Clonar SDK
cd ~
git clone https://github.com/raspberrypi/pico-sdk.git
cd pico-sdk
git submodule update --init

# Exportar path
echo 'export PICO_SDK_PATH=$HOME/pico-sdk' >> ~/.bashrc
source ~/.bashrc
```

#### Windows
```powershell
# Use o instalador oficial:
# https://github.com/raspberrypi/pico-setup-windows/releases
```

### Estrutura de Projeto

```
meu_projeto_rp2040/
├── CMakeLists.txt
├── pico_sdk_import.cmake
└── main.c
```

**CMakeLists.txt:**
```cmake
cmake_minimum_required(VERSION 3.13)

include(pico_sdk_import.cmake)

project(meu_projeto C CXX ASM)
set(CMAKE_C_STANDARD 11)

pico_sdk_init()

add_executable(meu_projeto
    main.c
)

target_link_libraries(meu_projeto 
    pico_stdlib
)

pico_enable_stdio_usb(meu_projeto 1)
pico_enable_stdio_uart(meu_projeto 0)

pico_add_extra_outputs(meu_projeto)
```

### Seu Primeiro "Hello World"

```c
#include <stdio.h>
#include "pico/stdlib.h"

int main() {
    stdio_init_all();
    
    printf("Hello from RP2040!\n");
    
    while (true) {
        printf("RP2040 rodando...\n");
        sleep_ms(1000);
    }
    
    return 0;
}
```

**Compilar:**
```bash
mkdir build
cd build
cmake ..
make
```

**Gravar:**
1. Pressione BOOTSEL no RP2040 enquanto conecta USB
2. Arraste arquivo `.uf2` para o drive que aparece

---

## 📚 NÍVEL 1 - BÁSICO (Semanas 2-4)

### Semana 2: GPIO Básico e Comparação

#### Exercício 1: Blink LED (Comparando com ESP32)
**Objetivo:** Ver diferenças de sintaxe

---

#### Exercício 2: Múltiplos LEDs com Máscara de Bits
**Objetivo:** Controlar vários GPIOs eficientemente

---

#### Exercício 3: Botão com Pull-up e Debounce
**Objetivo:** Leitura robusta de botão

---

### Semana 3: PWM e ADC

#### Exercício 4: PWM no RP2040
**Objetivo:** Controle de brilho

---

#### Exercício 5: ADC (Leitura Analógica)
**Objetivo:** Ler sensor/potenciômetro

---

### Semana 4: Interrupts

#### Exercício 6: GPIO Interrupt
**Objetivo:** Resposta imediata a eventos

---

### 🎯 PROJETO NÍVEL 1: Knight Rider com Dual-Core

**Descrição:** Efeito Knight Rider em LEDs usando ambos os cores.

**Componentes:**
- 8 LEDs
- 8 resistores 220Ω

**Conceitos:**
- Dual-core programming
- Divisão de tarefas
- Comunicação entre cores (próximo exercício)

---

## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 5-8)

### Semana 5-6: I2C e Display OLED

#### Exercício 7: I2C Scanner
**Objetivo:** Detectar dispositivos I2C

---

#### Exercício 8: Display OLED SSD1306
**Objetivo:** Mostrar texto e gráficos

---

### Semana 7-8: PIO (Programmable I/O) - O DIFERENCIAL!

#### Exercício 9: Entendendo PIO Básico
**Objetivo:** Piscar LED usando PIO ao invés de CPU

---

#### Exercício 10: PIO para WS2812 (NeoPixel)
**Objetivo:** Controlar LEDs RGB usando PIO

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

---

## 📚 NÍVEL 3 - AVANÇADO (Semanas 9-12)

### Tópicos Avançados

1. DMA (Direct Memory Access)
2. Comunicação Entre Cores
3. Timers e Alarmes

---

### 🎯 PROJETO NÍVEL 3: Sistema de Aquisição de Dados

**Descrição:** Logger de múltiplos sensores com análise em tempo real.

**Funcionalidades:**
- **Core 0:** Interface, storage (SD card), WiFi (Pico W)
- **Core 1:** Amostragem de sensores
- **PIO:** Protocolos customizados
- **DMA:** Transferência de buffers grandes
- Taxa de amostragem: 10kHz+

**Tecnologias Integradas:**
- ADC com DMA
- I2C para sensores
- SPI para SD card
- PIO para sinais digitais rápidos
- Dual-core para paralelismo

---

## 📖 REFERÊNCIAS ESPECÍFICAS RP2040

### Documentação Essencial
1. **RP2040 Datasheet** - Hardware completo
2. **Raspberry Pi Pico C/C++ SDK** - API reference
3. **Hardware Design with RP2040** - Esquemáticos e PCB
4. **PIO Examples** - pico-examples/pio/

### Livros e Guias
- "Get Started with MicroPython on Raspberry Pi Pico" (oficial)
- "RP2040 Assembly Language Programming" - Stephen Smith

### GitHub Essencial
- https://github.com/raspberrypi/pico-sdk
- https://github.com/raspberrypi/pico-examples
- https://github.com/raspberrypi/pico-extras

### Canais YouTube
- Shawn Hymel (PIO tutorials)
- Low Level Learning (bare metal)
- Raspberry Pi Foundation

---

## 💡 Dicas Específicas RP2040

### PIO é Sua Arma Secreta
- Use para qualquer protocolo com timing crítico
- Pode implementar I2S, DVI, VGA, protocolos customizados
- 8 state machines = 8 tarefas paralelas de I/O!

### Dual-Core Efetivo
```c
// Padrão comum:
// Core 0: UI, rede, storage
// Core 1: Processamento pesado, real-time
```

### Otimização de Memória
- 264KB SRAM parece muito, mas enche rápido
- Use DMA para transferências grandes
- Compile com otimizações: `cmake -DCMAKE_BUILD_TYPE=Release`

### Flash e OTA
- RP2040 não tem flash interno (usa externo)
- Você pode ter dois firmwares e fazer OTA
- Boot em ~100ms (muito rápido!)

---

*Continue com RP2040 Zero e STM8!*