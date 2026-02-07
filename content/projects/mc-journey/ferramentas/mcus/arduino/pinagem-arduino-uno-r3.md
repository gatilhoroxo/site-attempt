---
title: Arduino Uno R3 - Pinagem
---
- ATmega328P
- 14 pinos digitais (6 PWM)
- 6 entradas analógicas
- [Datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)

## 📐 Diagrama de Pinos

```
                     ┌─────────────┐
                     │     USB     │
                     └──────┬──────┘
                            │
     ┌──────────────────────┴──────────────────────┐
     │                                             │
     │              ARDUINO UNO R3                 │
     │                                             │
RESET├─○  [RESET]                      [SCL] A5  ○─┤
  3V3├─○  [3V3]                        [SDA] A4  ○─┤
   5V├─○  [5V]                         [A3]  A3  ○─┤
  GND├─○  [GND]                        [A2]  A2  ○─┤
  GND├─○  [GND]                        [A1]  A1  ○─┤
  VIN├─○  [VIN]                        [A0]  A0  ○─┤
     │                                             │
   A0├─○  [A0]                         [AREF]    ○─┤
   A1├─○  [A1]                         [GND]     ○─┤
   A2├─○  [A2]                         [13]  ~   ○─┤ D13/SCK  (LED)
   A3├─○  [A3]                         [12]      ○─┤ D12/MISO
   A4├─○  [A4/SDA]                     [11]  ~   ○─┤ D11/MOSI (PWM)
   A5├─○  [A5/SCL]                     [10]  ~   ○─┤ D10/SS   (PWM)
     │                                             │
   D0├─○  [0]  RX                      [9]   ~   ○─┤ D9       (PWM)
   D1├─○  [1]  TX                      [8]       ○─┤ D8
   D2├─○  [2]                          [7]       ○─┤ D7
   D3├─○  [3]  ~                       [6]   ~   ○─┤ D6       (PWM)
   D4├─○  [4]                          [5]   ~   ○─┤ D5       (PWM)
   D5├─○  [5]  ~                       [4]       ○─┤ D4
   D6├─○  [6]  ~                       [3]   ~   ○─┤ D3       (PWM)
   D7├─○  [7]                          [2]       ○─┤ D2
     │                                             │
     └─────────────────────────────────────────────┘
```

**Legenda:**
- `~` = PWM (Pulse Width Modulation)
- `○` = Pino físico

---

## 📊 Tabela de Pinos

### Pinos Digitais (D0-D13)

| Pino | Função Principal | Funções Alternativas | PWM | Notas |
|------|------------------|---------------------|-----|-------|
| D0 | GPIO | UART RX | ❌ | Evite usar se precisar Serial |
| D1 | GPIO | UART TX | ❌ | Evite usar se precisar Serial |
| D2 | GPIO | Interrupt 0 | ❌ | INT0 |
| D3 | GPIO | Interrupt 1, PWM | ✅ | INT1, OC2B (PWM) |
| D4 | GPIO | - | ❌ | - |
| D5 | GPIO | PWM | ✅ | OC0B (PWM) |
| D6 | GPIO | PWM | ✅ | OC0A (PWM) |
| D7 | GPIO | - | ❌ | - |
| D8 | GPIO | - | ❌ | - |
| D9 | GPIO | PWM | ✅ | OC1A (PWM) |
| D10 | GPIO | PWM, SPI SS | ✅ | OC1B (PWM), SS |
| D11 | GPIO | PWM, SPI MOSI | ✅ | OC2A (PWM), MOSI |
| D12 | GPIO | SPI MISO | ❌ | MISO |
| D13 | GPIO | SPI SCK, LED | ❌ | SCK, LED_BUILTIN |

### Pinos Analógicos (A0-A5)

| Pino | Função Principal | ADC Channel | Funções Alternativas | Notas |
|------|------------------|-------------|---------------------|-------|
| A0 | ADC | ADC0 | GPIO (D14) | 10-bit ADC |
| A1 | ADC | ADC1 | GPIO (D15) | 10-bit ADC |
| A2 | ADC | ADC2 | GPIO (D16) | 10-bit ADC |
| A3 | ADC | ADC3 | GPIO (D17) | 10-bit ADC |
| A4 | ADC | ADC4 | GPIO (D18), I2C SDA | 10-bit ADC, SDA |
| A5 | ADC | ADC5 | GPIO (D19), I2C SCL | 10-bit ADC, SCL |

### Pinos de Alimentação

| Pino | Tensão | Corrente Max | Descrição |
|------|--------|--------------|-----------|
| VIN | 7-12V | - | Alimentação externa (recomendado 7-12V) |
| 5V | 5V | 500mA | Saída regulada 5V |
| 3V3 | 3.3V | 50mA | Saída regulada 3.3V (baixa corrente!) |
| GND | 0V | - | Ground (2 pinos disponíveis) |
| AREF | 0-5V | - | Referência analógica externa |

---

## 🔌 Interfaces de Comunicação

### UART (Serial)
- **TX:** Pino D1
- **RX:** Pino D0
- **Baud rate:** Até 115200 (padrão)
- **Uso:** `Serial.begin(9600);`

### I2C (Wire)
- **SDA:** Pino A4
- **SCL:** Pino A5
- **Clock:** Até 400kHz
- **Uso:** `Wire.begin();`

### SPI
- **MOSI:** Pino D11
- **MISO:** Pino D12
- **SCK:** Pino D13
- **SS:** Pino D10 (pode usar outros pinos)
- **Clock:** Até 8MHz
- **Uso:** `SPI.begin();`

---

## ⚡ Especificações Elétricas

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Tensão operação | 5V | Pinos são 5V logic |
| Corrente por pino | 20mA | 40mA absoluto máximo |
| Corrente total I/O | 200mA | Soma de todos os pinos |
| PWM Resolution | 8-bit | 0-255 (analogWrite) |
| ADC Resolution | 10-bit | 0-1023 (analogRead) |
| ADC Range | 0-5V | Ou AREF se configurado |

---

## ⚠️ Notas Importantes

1. **UART Conflict:** Pinos D0/D1 são usados pelo USB. Desconecte Serial ao fazer upload.

2. **LED Builtin:** Pino D13 tem LED integrado. Pode afetar circuitos conectados.

3. **PWM Frequency:**
   - Pinos 5, 6: ~980Hz
   - Demais PWM: ~490Hz

4. **Interrupt Pins:**
   - INT0: Pino D2
   - INT1: Pino D3
   - Use `attachInterrupt()`

5. **I2C Pull-ups:** Precisa de resistores pull-up externos (4.7kΩ típico)

6. **3.3V Current:** Pino 3.3V fornece apenas 50mA! Use para referências, não para alimentação.

7. **VIN Range:** Recomendado 7-12V. Acima de 12V aquece o regulador.

---

## 📝 Exemplo de Uso

```cpp
// Configuração comum
const int LED_PIN = 13;      // LED builtin
const int BUTTON_PIN = 2;    // Interrupt 0
const int SENSOR_PIN = A0;   // ADC
const int PWM_PIN = 9;       // PWM

void setup() {
  Serial.begin(9600);        // UART
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(PWM_PIN, OUTPUT);
  
  // I2C
  Wire.begin();
  
  // Interrupt
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), isr, FALLING);
}
```

---

## 🔗 Referências

- [ATmega328P Datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)
- [Arduino Uno Schematic](https://www.arduino.cc/en/uploads/Main/arduino-uno-schematic.pdf)
- [Arduino Reference](https://www.arduino.cc/reference/en/)

---

**Voltar:** [📍 Pin Diagrams](README.md) | [Arduino](../i0-arduino/README.md)
