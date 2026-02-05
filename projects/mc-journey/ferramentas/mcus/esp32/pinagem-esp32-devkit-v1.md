---
title: ESP32 DevKit V1 - Pinagem
---
- ESP32-WROOM-32
- 30 GPIOs (18 ADC, 16 PWM)
- WiFi + Bluetooth
- [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)

## 📐 Diagrama de Pinos (30 pinos)

```
                         ┌─────────────┐
                         │     USB     │
                         └──────┬──────┘
                                │
     ┌──────────────────────────┴──────────────────────┐
     │                                                 │
     │              ESP32 DEVKIT V1                    │
     │              (30 PIN VERSION)                   │
     │                                                 │
  EN ├─○  [EN]                              [VP]  36 ○─┤ GPIO36 (ADC1_0) *INPUT ONLY*
 VP  ├─○  [VP]  36                          [VN]  39 ○─┤ GPIO39 (ADC1_3) *INPUT ONLY*
 VN  ├─○  [VN]  39                          [34]  34 ○─┤ GPIO34 (ADC1_6) *INPUT ONLY*
 D34 ├─○  [34]  34                          [35]  35 ○─┤ GPIO35 (ADC1_7) *INPUT ONLY*
 D32 ├─○  [32]  32  (ADC1_4, TOUCH9)        [32]  32 ○─┤ GPIO32 (ADC1_4, TOUCH9)
 D33 ├─○  [33]  33  (ADC1_5, TOUCH8)        [33]  33 ○─┤ GPIO33 (ADC1_5, TOUCH8)
 D25 ├─○  [25]  25  (ADC2_8, DAC1)          [25]  25 ○─┤ GPIO25 (ADC2_8, DAC1)
 D26 ├─○  [26]  26  (ADC2_9, DAC2)          [26]  26 ○─┤ GPIO26 (ADC2_9, DAC2)
 D27 ├─○  [27]  27  (ADC2_7, TOUCH7)        [27]  27 ○─┤ GPIO27 (ADC2_7, TOUCH7)
 D14 ├─○  [14]  14  (ADC2_6, TOUCH6)        [14]  14 ○─┤ GPIO14 (ADC2_6, TOUCH6)
 D12 ├─○  [12]  12 *(ADC2_5, TOUCH5)        [12]  12 ○─┤ GPIO12 (ADC2_5, TOUCH5) *
 GND ├─○  [GND]                             [GND]    ○─┤
 D13 ├─○  [13]  13  (ADC2_4, TOUCH4)        [13]  13 ○─┤ GPIO13 (ADC2_4, TOUCH4)
  SD2├─○  [SD2]  9 *                        [SD2]  9 ○─┤ GPIO9 (Flash) *
  SD3├─○  [SD3] 10 *                        [SD3] 10 ○─┤ GPIO10 (Flash) *
 CMD ├─○  [CMD] 11 *                        [CMD] 11 ○─┤ GPIO11 (Flash) *
  5V ├─○  [5V]                              [5V]     ○─┤
 GND ├─○  [GND]                             [GND]    ○─┤
     │                                                 │
LEFT SIDE:                                    RIGHT SIDE:
  3V3├─○  [3V3]                             [23]  23 ○─┤ GPIO23 (SPI MOSI)
  EN ├─○  [EN]                              [22]  22 ○─┤ GPIO22 (I2C SCL)
  VP ├─○  [VP]  36                          [TX0]  1 ○─┤ GPIO1  (UART0 TX)
  VN ├─○  [VN]  39                          [RX0]  3 ○─┤ GPIO3  (UART0 RX)
 D34 ├─○  [34]  34                          [21]  21 ○─┤ GPIO21 (I2C SDA)
 D35 ├─○  [35]  35                          [19]  19 ○─┤ GPIO19 (SPI MISO)
 D32 ├─○  [32]  32                          [18]  18 ○─┤ GPIO18 (SPI SCK)
 D33 ├─○  [33]  33                          [5]    5 ○─┤ GPIO5  (SPI SS)
 D25 ├─○  [25]  25                          [17]  17 ○─┤ GPIO17 (UART2 TX)
 D26 ├─○  [26]  26                          [16]  16 ○─┤ GPIO16 (UART2 RX)
 D27 ├─○  [27]  27                          [4]    4 ○─┤ GPIO4  (ADC2_0)
 D14 ├─○  [14]  14                          [0]    0 ○─┤ GPIO0 * (BOOT)
 D12 ├─○  [12]  12 *                        [2]    2 ○─┤ GPIO2 * (LED)
 D13 ├─○  [13]  13                          [15]  15 ○─┤ GPIO15 * (ADC2_3)
 GND ├─○  [GND]                             [GND]    ○─┤
  5V ├─○  [5V]                              [3V3]    ○─┤
     │                                                 │
     └─────────────────────────────────────────────────┘

* = Strapping pin (cuidado no boot!)
```

---

## 📊 Tabela de Pinos - Lado Esquerdo

| Pino | GPIO | ADC | Touch | DAC | Função Especial | Notas |
|------|------|-----|-------|-----|-----------------|-------|
| EN | - | ❌ | ❌ | ❌ | RESET | Pull-up HIGH para operar |
| VP | 36 | ADC1_0 | ❌ | ❌ | - | **INPUT ONLY** |
| VN | 39 | ADC1_3 | ❌ | ❌ | - | **INPUT ONLY** |
| 34 | 34 | ADC1_6 | ❌ | ❌ | - | **INPUT ONLY** |
| 35 | 35 | ADC1_7 | ❌ | ❌ | - | **INPUT ONLY** |
| 32 | 32 | ADC1_4 | TOUCH9 | ❌ | - | OK |
| 33 | 33 | ADC1_5 | TOUCH8 | ❌ | - | OK |
| 25 | 25 | ADC2_8 | ❌ | DAC1 | - | OK |
| 26 | 26 | ADC2_9 | ❌ | DAC2 | - | OK |
| 27 | 27 | ADC2_7 | TOUCH7 | ❌ | - | OK |
| 14 | 14 | ADC2_6 | TOUCH6 | ❌ | - | OK |
| 12 | 12 | ADC2_5 | TOUCH5 | ❌ | MTDI | ⚠️ Boot config |
| 13 | 13 | ADC2_4 | TOUCH4 | ❌ | - | OK |

## 📊 Tabela de Pinos - Lado Direito

| Pino | GPIO | ADC | Touch | Função Especial | Notas |
|------|------|-----|-------|-----------------|-------|
| 23 | 23 | ❌ | ❌ | SPI MOSI | OK |
| 22 | 22 | ❌ | ❌ | I2C SCL | OK |
| TX0 | 1 | ❌ | ❌ | UART0 TX | USB Serial |
| RX0 | 3 | ❌ | ❌ | UART0 RX | USB Serial |
| 21 | 21 | ❌ | ❌ | I2C SDA | OK |
| 19 | 19 | ❌ | ❌ | SPI MISO | OK |
| 18 | 18 | ❌ | ❌ | SPI SCK | OK |
| 5 | 5 | ❌ | ❌ | SPI SS | OK |
| 17 | 17 | ❌ | ❌ | UART2 TX | OK |
| 16 | 16 | ❌ | ❌ | UART2 RX | OK |
| 4 | 4 | ADC2_0 | TOUCH0 | - | OK |
| 0 | 0 | ADC2_1 | TOUCH1 | BOOT | ⚠️ Pull-up no boot |
| 2 | 2 | ADC2_2 | TOUCH2 | LED | ⚠️ Boot config |
| 15 | 15 | ADC2_3 | TOUCH3 | - | ⚠️ Boot config |

---

## 🔌 Interfaces de Comunicação

### UART
- **UART0:** GPIO1 (TX), GPIO3 (RX) - USB Serial
- **UART1:** GPIO9 (TX), GPIO10 (RX) - Flash (não usar!)
- **UART2:** GPIO17 (TX), GPIO16 (RX) - Livre para uso

### I2C (Wire)
- **SDA:** GPIO21
- **SCL:** GPIO22
- **Clock:** Até 400kHz (padrão)
- Pode usar qualquer GPIO

### SPI (VSPI)
- **MOSI:** GPIO23
- **MISO:** GPIO19
- **SCK:** GPIO18
- **SS:** GPIO5
- **Clock:** Até 80MHz

### SPI (HSPI) - Alternativo
- **MOSI:** GPIO13
- **MISO:** GPIO12
- **SCK:** GPIO14
- **SS:** GPIO15

---

## ⚡ Especificações Elétricas

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Tensão operação | 3.3V | **NÃO use 5V nos GPIOs!** |
| Corrente por pino | 40mA | 12mA recomendado |
| Tensão entrada | 0-3.3V | 3.6V absoluto máximo |
| PWM Canais | 16 | LEDC (8-bit padrão) |
| ADC1 Canais | 8 | 12-bit (0-4095) |
| ADC2 Canais | 10 | **Não use com WiFi!** |
| DAC Canais | 2 | GPIO25, GPIO26 (8-bit) |
| Touch Pins | 10 | Capacitive sensing |

---

## ⚠️ Pinos Strapping (Boot Configuration)

**CUIDADO:** Estes pinos afetam o modo de boot!

| GPIO | Estado no Boot | Função | Recomendação |
|------|----------------|--------|--------------|
| **GPIO0** | HIGH | Boot normal | **Pull-up externo!** LOW = flash mode |
| **GPIO2** | LOW | Boot normal | Evite pull-up |
| **GPIO12** | LOW | 3.3V flash | **Mantenha LOW!** HIGH = 1.8V flash |
| **GPIO15** | HIGH | SDIO | Pull-up no boot |
| GPIO5 | - | Boot mensagem | Não crítico |

**Regra de ouro:** Evite conectar botões/leds nestes pinos sem entender o boot!

---

## 🚫 Pinos a Evitar

| GPIO | Razão |
|------|-------|
| **GPIO6-11** | Conectados à flash SPI interna! **NUNCA USE!** |
| **GPIO1, 3** | UART0 (USB Serial) - conflito ao fazer upload |
| **GPIO34-39** | INPUT ONLY - sem pull-up/pull-down interno |
| **ADC2 (todos)** | Não funcionam quando WiFi está ativo |

---

## 📝 Pinos Recomendados para Uso Geral

**✅ Seguros para GPIO:**
- GPIO4, GPIO5
- GPIO16, GPIO17, GPIO18, GPIO19
- GPIO21, GPIO22, GPIO23
- GPIO25, GPIO26, GPIO27
- GPIO32, GPIO33

**✅ Seguros para ADC (sem WiFi):**
- GPIO32-39 (ADC1) - funcionam com WiFi
- GPIO4, GPIO12-15, GPIO25-27 (ADC2) - **NÃO funcionam com WiFi**

---

## 💡 Exemplos de Uso

### GPIO Digital
```cpp
const int LED_PIN = 2;  // GPIO2 (LED builtin)

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}
```

### ADC (Analógico)
```cpp
const int ADC_PIN = 34;  // GPIO34 (ADC1_6)

void setup() {
  Serial.begin(115200);
  analogSetAttenuation(ADC_11db);  // 0-3.3V range
}

void loop() {
  int value = analogRead(ADC_PIN);  // 0-4095
  Serial.println(value);
  delay(100);
}
```

### PWM (LEDC)
```cpp
const int PWM_PIN = 25;
const int PWM_CHANNEL = 0;
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 8;

void setup() {
  ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  ledcAttachPin(PWM_PIN, PWM_CHANNEL);
}

void loop() {
  for(int duty = 0; duty <= 255; duty++) {
    ledcWrite(PWM_CHANNEL, duty);
    delay(10);
  }
}
```

### Touch Sensor
```cpp
const int TOUCH_PIN = 4;  // GPIO4 (TOUCH0)
const int THRESHOLD = 40;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int touchValue = touchRead(TOUCH_PIN);
  
  if(touchValue < THRESHOLD) {
    Serial.println("Touched!");
  }
  
  delay(100);
}
```

---

## 🔗 Referências

- [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- [ESP32 Technical Reference](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- [ESP32 Pinout Reference](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)

---

**Voltar:** [📍 Pin Diagrams](README.md) | [ESP32](../i1-esp32/README.md)
