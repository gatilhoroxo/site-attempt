---
layout: default
title: N3 Avancado
---


## 📚 NÍVEL 3 - AVANÇADO (Semanas 9-12)

### Tópicos Avançados

#### 1. DMA (Direct Memory Access)
```c
#include "hardware/dma.h"

// Transferir dados sem usar CPU
int dma_chan = dma_claim_unused_channel(true);
dma_channel_config c = dma_channel_get_default_config(dma_chan);
channel_config_set_transfer_data_size(&c, DMA_SIZE_32);

dma_channel_configure(
    dma_chan,
    &c,
    dest,    // Destino
    src,     // Origem
    count,   // Quantidade
    true     // Iniciar agora
);
```

#### 2. Comunicação Entre Cores
```c
#include "pico/multicore.h"

// Core 0 envia para Core 1
multicore_fifo_push_blocking(data);

// Core 1 recebe de Core 0
uint32_t data = multicore_fifo_pop_blocking();
```

#### 3. Timers e Alarmes
```c
#include "hardware/timer.h"

bool timer_callback(struct repeating_timer *t) {
    printf("Timer fired!\n");
    return true;  // Continuar repetindo
}

int main() {
    struct repeating_timer timer;
    add_repeating_timer_ms(500, timer_callback, NULL, &timer);
    
    while(true) {
        tight_loop_contents();
    }
}
```

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
