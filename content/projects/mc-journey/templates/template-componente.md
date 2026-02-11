---
title: Template de Componente
---

# [Nome do Componente]

**Categoria:** Sensor / Atuador / Display / Comunicação / Outro  
**Interface:** GPIO / I2C / SPI / UART / Analógico  
**Tensão:** 3.3V / 5V / Ambos

---

**Última atualização:** YYYY-MM-DD  
**Testado em:** Arduino UNO, ESP32, RP2040  
**Status:** ✅ Verificado / ⚠️ Não testado

---

## 📑 Índice

1. [🔍 Visão Geral](#-visão-geral)
2. [⚡ Especificações](#-especificações)
3. [📌 Pinout](#-pinout)
4. [🔌 Conexão](#-conexão)
5. [💻 Código](#-código)
6. [📊 Características](#-características)
7. [💡 Dicas de Uso](#-dicas-de-uso)

---

## 🔍 Visão Geral

[Breve descrição do que é o componente e para que serve]

**Aplicações típicas:**
- Aplicação 1
- Aplicação 2
- Aplicação 3

**Vantagens:**
- ✅ Vantagem 1
- ✅ Vantagem 2
- ✅ Vantagem 3

**Desvantagens:**
- ❌ Desvantagem 1
- ❌ Desvantagem 2

---

## ⚡ Especificações

### Elétricas
- **Tensão de operação:** X.X - X.X V
- **Corrente típica:** XX mA
- **Corrente máxima:** XX mA
- **Tensão lógica:** 3.3V / 5V
- **Interface:** I2C / SPI / UART / Analógico

### Físicas
- **Dimensões:** XX x XX x XX mm
- **Peso:** XX g
- **Temperatura de operação:** -XX°C a +XX°C
- **Temperatura de armazenamento:** -XX°C a +XX°C

### Performance
- **Resolução:** XX bits / XX mV
- **Precisão:** ±X%
- **Taxa de atualização:** XX Hz
- **Tempo de resposta:** XX ms

### Comunicação (se aplicável)
- **Protocolo:** I2C / SPI / UART
- **Velocidade:** XX kHz / MHz
- **Endereço I2C:** 0xXX (padrão)
- **Frequência SPI:** XX MHz (máx)

---

## 📌 Pinout

```
┌─────────────┐
│  1  VCC     │ ← Alimentação (3.3V ou 5V)
│  2  GND     │ ← Terra
│  3  SDA/RX  │ ← Dados (I2C/UART)
│  4  SCL/TX  │ ← Clock/Transmit
│  5  INT     │ ← Interrupt (opcional)
│  6  RST     │ ← Reset (opcional)
└─────────────┘
```

### Descrição dos Pinos

| Pino | Nome | Tipo | Descrição |
|------|------|------|-----------|
| 1 | VCC | Power | Alimentação positiva |
| 2 | GND | Power | Terra (0V) |
| 3 | SDA | I/O | Linha de dados I2C |
| 4 | SCL | Input | Linha de clock I2C |
| 5 | INT | Output | Sinal de interrupção |
| 6 | RST | Input | Reset (ativo em LOW) |

---

## 🔌 Conexão

### Com Arduino UNO
```
Componente VCC → Arduino 5V (ou 3.3V)
Componente GND → Arduino GND
Componente SDA → Arduino A4 (SDA)
Componente SCL → Arduino A5 (SCL)
```

### Com ESP32
```
Componente VCC → ESP32 3.3V
Componente GND → ESP32 GND
Componente SDA → ESP32 GPIO21 (ou qualquer GPIO)
Componente SCL → ESP32 GPIO22 (ou qualquer GPIO)
```

### Com RP2040
```
Componente VCC → RP2040 3.3V
Componente GND → RP2040 GND
Componente SDA → RP2040 GP4 (I2C0 SDA)
Componente SCL → RP2040 GP5 (I2C0 SCL)
```

### Diagrama de Conexão
[Adicionar imagem do circuito completo]

### Resistores Pull-up (I2C)
```
SDA ──┬── 4.7kΩ ── VCC
      └── MCU SDA

SCL ──┬── 4.7kΩ ── VCC
      └── MCU SCL
```
*Nota: Alguns módulos já incluem pull-ups*

---

## 💻 Código

### Arduino
```cpp
#include <Wire.h>
#include <[Biblioteca].h>

[Biblioteca] sensor;

void setup() {
    Serial.begin(9600);
    Wire.begin();
    
    if (!sensor.begin()) {
        Serial.println("Erro ao inicializar!");
        while (1);
    }
}

void loop() {
    float valor = sensor.read();
    Serial.println(valor);
    delay(1000);
}
```

**Biblioteca necessária:**
- Nome: `[Biblioteca]`
- Instalação: `Tools > Manage Libraries > Buscar "[Biblioteca]"`
- Link: [URL do GitHub]

### ESP32 (ESP-IDF)
```c
#include "driver/i2c.h"

#define I2C_MASTER_SCL_IO 22
#define I2C_MASTER_SDA_IO 21
#define I2C_MASTER_FREQ_HZ 100000

void app_main(void) {
    // Configuração I2C
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = I2C_MASTER_FREQ_HZ,
    };
    i2c_param_config(I2C_NUM_0, &conf);
    i2c_driver_install(I2C_NUM_0, conf.mode, 0, 0, 0);
    
    // Uso do sensor
}
```

### RP2040 (Pico SDK)
```c
#include "pico/stdlib.h"
#include "hardware/i2c.h"

#define I2C_PORT i2c0
#define I2C_SDA 4
#define I2C_SCL 5

int main() {
    stdio_init_all();
    
    i2c_init(I2C_PORT, 100 * 1000);
    gpio_set_function(I2C_SDA, GPIO_FUNC_I2C);
    gpio_set_function(I2C_SCL, GPIO_FUNC_I2C);
    gpio_pull_up(I2C_SDA);
    gpio_pull_up(I2C_SCL);
    
    // Uso do sensor
}
```

---

## 📊 Características

### Vantagens
- ✅ Fácil de usar
- ✅ Baixo consumo de energia
- ✅ Boa precisão
- ✅ Interface padrão (I2C/SPI)
- ✅ Bibliotecas disponíveis

### Limitações
- ⚠️ Limitação 1
- ⚠️ Limitação 2
- ⚠️ Sensível a [condição]

### Comparação com Alternativas

| Característica | Este Componente | Alternativa 1 | Alternativa 2 |
|----------------|----------------|---------------|---------------|
| Preço | R$ XX | R$ XX | R$ XX |
| Precisão | ±X% | ±X% | ±X% |
| Interface | I2C | SPI | Analógico |
| Consumo | XX mA | XX mA | XX mA |

---

## 💡 Dicas de Uso

### Boas Práticas
- ✅ Usar capacitor de desacoplamento (0.1µF) próximo ao VCC
- ✅ Respeitar tensões máximas
- ✅ Usar resistores pull-up adequados (I2C)
- ✅ Proteger contra inversão de polaridade

### Erros Comuns
1. **Não detecta o sensor (I2C)**
   - Verificar conexões SDA/SCL
   - Conferir endereço I2C
   - Checar pull-ups

2. **Leituras instáveis**
   - Adicionar filtro (média móvel)
   - Verificar alimentação estável
   - Reduzir comprimento dos fios

3. **Aquecimento excessivo**
   - Verificar tensão de alimentação
   - Checar curto-circuito

### Otimizações
- Para economia de energia: [Dica específica]
- Para maior velocidade: [Dica específica]
- Para melhor precisão: [Dica específica]

---

## 🛒 Onde Comprar

- **Fornecedor 1** - [Link] - R$ XX,XX
- **Fornecedor 2** - [Link] - R$ XX,XX
- **AliExpress** - [Link] - R$ XX,XX (30-60 dias)

**Custo médio:** R$ XX,XX

---

## 📖 Referências

### Datasheet
- [Link para datasheet oficial](URL)
- [Link para datasheet traduzido](URL) (se existir)

### Bibliotecas
- Arduino: [Nome da biblioteca](URL GitHub)
- ESP-IDF: [Componente](URL GitHub)
- Pico SDK: [Exemplo](URL GitHub)

### Tutoriais
- [Tutorial completo](URL)
- [Vídeo explicativo](URL)

---

## 🔗 Projetos que Usam Este Componente

- Link para documentação do projeto em `ferramentas/mcus/_mcu_/projetos/`
- Link para outro projeto relacionado
> **Nota:** O código-fonte dos projetos está em `/mcu/` (repositório raiz)

---

## 📝 Notas Adicionais

[Informações extras, curiosidades, histórico do componente, etc.]

---

