---
layout: default
title: N2 Intermediario
---

## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 5-8)

**Progresso:** [ ] Semana 5 | [ ] Semana 6 | [ ] Semana 7 | [ ] Semana 8 | [ ] Projeto Final

---

## 📑 Índice

### [Semana 5: Interrupts e Eventos](#semana-5-interrupts-e-eventos)
- [Exercício 9: Interrupt Externo](#exercício-9-interrupt-externo)
- [Exercício 10: Encoder Rotativo](#exercício-10-encoder-rotativo)

### [Semana 6: I2C e Displays](#semana-6-i2c-e-displays)
- [Exercício 11: LCD 16x2 com I2C](#exercício-11-lcd-16x2-com-i2c)
- [Exercício 12: Sensor BME280 (I2C)](#exercício-12-sensor-bme280-i2c)

### [Semana 7: SPI e Armazenamento](#semana-7-spi-e-armazenamento)
- [Exercício 13: Cartão SD via SPI](#exercício-13-cartão-sd-via-spi)
- [Exercício 14: Display TFT SPI](#exercício-14-display-tft-spi)

### [Semana 8: EEPROM e Timers](#semana-8-eeprom-e-timers)
- [Exercício 15: Salvar Dados na EEPROM](#exercício-15-salvar-dados-na-eeprom)
- [Exercício 16: Timer Interrupts](#exercício-16-timer-interrupts)

### [🎯 Projeto Final: Estação Meteorológica](#-projeto-final-estação-meteorológica)

### [⚠️ Problemas Comuns e Soluções](#️-problemas-comuns-e-soluções)

### [🔗 Próximos Passos](#-próximos-passos)

---

## Semana 5: Interrupts e Eventos

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 10-12 horas
- 📊 **Dificuldade:** ⭐⭐⭐ Intermediário
- 🎯 **Habilidades desenvolvidas:** attachInterrupt, ISR, volatile variables, encoder decoding
- ✅ **Checklist:** [ ] Exercício 9 | [ ] Exercício 10

### 📖 Fundamentos - Interrupts (Interrupções)

**O que são Interrupts?**
- Mecanismo para responder imediatamente a eventos
- CPU para execução atual e executa ISR (Interrupt Service Routine)
- Após ISR, retorna ao ponto interrompido
- Prioridade sobre código do loop()

**Tipos de Triggers:**
- **LOW:** Dispara enquanto pino está LOW
- **CHANGE:** Dispara em qualquer mudança (LOW→HIGH ou HIGH→LOW)
- **RISING:** Dispara na borda de subida (LOW→HIGH)
- **FALLING:** Dispara na borda de descida (HIGH→LOW)

**Pinos com Interrupt no Arduino UNO:**
- **Pino 2:** Interrupt 0
- **Pino 3:** Interrupt 1
- Apenas esses dois pinos suportam interrupts externos!

**Regras para ISR:**
- Deve ser RÁPIDA (< 1ms ideal)
- Evitar: delay(), Serial.print(), millis()
- Variáveis compartilhadas devem ser `volatile`
- Não usar funções complexas

**Funções Principais:**
```cpp
attachInterrupt(digitalPinToInterrupt(pin), ISR, mode)
detachInterrupt(digitalPinToInterrupt(pin))

// Variáveis compartilhadas entre ISR e loop
volatile int counter = 0;
```

---

### Exercício 9: Interrupt Externo

**Objetivo:** Contar pulsos de botão usando interrupt

**Componentes Necessários:**
- 1x Botão
- 1x Resistor 10kΩ (ou usar INPUT_PULLUP)
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- attachInterrupt()
- Variáveis volatile
- ISR (Interrupt Service Routine)
- Comparação interrupt vs polling

**Circuito:**
```
Botão: Pino 2 (INT0) → Botão → GND (com INPUT_PULLUP)
LED: Pino 13 → Resistor 220Ω → LED → GND
```

```cpp
const int BUTTON_PIN = 2;   // INT0
const int LED_PIN = 13;

volatile int buttonPresses = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  
  // Anexar interrupt ao pino 2 (INT0)
  // FALLING = borda de descida (quando pressiona com pull-up)
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonISR, FALLING);
  
  Serial.println("Sistema iniciado. Pressione o botão!");
}

void buttonISR() {
  // ISR - deve ser RÁPIDA!
  buttonPresses++;
}

void loop() {
  // Variável local para evitar race condition
  int presses;
  
  noInterrupts();  // Desabilita interrupts temporariamente
  presses = buttonPresses;
  interrupts();    // Reabilita interrupts
  
  Serial.print("Total de pressionamentos: ");
  Serial.println(presses);
  
  // Pisca LED na mesma velocidade dos pressionamentos
  digitalWrite(LED_PIN, (presses % 2 == 0) ? LOW : HIGH);
  
  delay(500);
}
```

**Desafios:**
1. 🟢 **Fácil:** Implementar debounce na ISR usando timestamp
2. 🟡 **Médio:** Detectar pressionamento duplo (< 500ms entre pressionamentos)
3. 🔴 **Difícil:** Medir frequência de pulsos (Hz) de um sensor

---

### Exercício 10: Encoder Rotativo

**Objetivo:** Ler encoder rotativo usando interrupts

**Componentes Necessários:**
- 1x Encoder rotativo (KY-040 ou similar)
- Jumpers

**Conceitos:**
- Quadrature encoding
- Dual interrupts (pinos 2 e 3)
- Direção de rotação
- Decodificação de sinais A/B

**Circuito:**
```
Encoder:
  CLK (A): Pino 2 (INT0)
  DT (B): Pino 3 (INT1)
  SW: Pino 4 (botão opcional)
  +: 5V
  GND: GND
```

**Encoder Quadrature:**
```
      A: ──┐   ┌───┐   ┌──
           └───┘   └───┘
      
      B: ─────┐   ┌───┐   
              └───┘   └──

Horário: A muda antes de B
Anti-horário: B muda antes de A
```

```cpp
const int ENC_A = 2;  // INT0
const int ENC_B = 3;  // INT1
const int ENC_SW = 4;

volatile int encoderPos = 0;
volatile int lastEncoded = 0;

void setup() {
  pinMode(ENC_A, INPUT_PULLUP);
  pinMode(ENC_B, INPUT_PULLUP);
  pinMode(ENC_SW, INPUT_PULLUP);
  
  Serial.begin(9600);
  
  // Anexar interrupts em ambos os pinos
  attachInterrupt(digitalPinToInterrupt(ENC_A), updateEncoder, CHANGE);
  attachInterrupt(digitalPinToInterrupt(ENC_B), updateEncoder, CHANGE);
  
  Serial.println("Encoder iniciado. Gire o encoder!");
}

void updateEncoder() {
  int MSB = digitalRead(ENC_A);  // Bit mais significativo
  int LSB = digitalRead(ENC_B);  // Bit menos significativo
  
  int encoded = (MSB << 1) | LSB;  // Converte para número
  int sum = (lastEncoded << 2) | encoded;  // Adiciona estado anterior
  
  // Tabela de decodificação
  if (sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) {
    encoderPos++;  // Horário
  }
  if (sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) {
    encoderPos--;  // Anti-horário
  }
  
  lastEncoded = encoded;
}

void loop() {
  static int lastPos = 0;
  
  // Copiar posição com segurança
  noInterrupts();
  int currentPos = encoderPos;
  interrupts();
  
  // Exibir apenas quando mudar
  if (currentPos != lastPos) {
    Serial.print("Posição: ");
    Serial.println(currentPos);
    lastPos = currentPos;
  }
  
  // Verificar botão do encoder
  if (digitalRead(ENC_SW) == LOW) {
    noInterrupts();
    encoderPos = 0;  // Reset posição
    interrupts();
    Serial.println("RESET!");
    delay(200);  // Debounce
  }
  
  delay(10);
}
```

**Desafios:**
1. 🟢 **Fácil:** Limitar posição do encoder (0-100)
2. 🟡 **Médio:** Controlar brilho de LED com encoder (PWM 0-255)
3. 🔴 **Difícil:** Criar menu navegável com encoder + display LCD

---

## Semana 6: I2C e Displays

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 12-14 horas
- 📊 **Dificuldade:** ⭐⭐⭐ Intermediário
- 🎯 **Habilidades desenvolvidas:** I2C, LiquidCrystal_I2C, Wire library, sensores digitais
- ✅ **Checklist:** [ ] Exercício 11 | [ ] Exercício 12

### 📖 Fundamentos - I2C (Inter-Integrated Circuit)

**O que é I2C?**
- Protocolo de comunicação serial síncrono
- 2 fios: SDA (dados) e SCL (clock)
- Múltiplos dispositivos no mesmo barramento
- Cada dispositivo tem endereço único (7 bits)

**Pinos I2C no Arduino UNO:**
- **SDA:** A4
- **SCL:** A5
- Não confundir com pinos digitais!

**Características:**
- **Master/Slave:** Arduino é master
- **Velocidade:** 100kHz (standard), 400kHz (fast)
- **Endereçamento:** 0x00 a 0x7F (geralmente em hexadecimal)
- **Pull-up:** Requer resistores 4.7kΩ (muitos módulos já incluem)

**Dispositivos I2C Comuns:**
- Display LCD 16x2 com adaptador I2C (0x27 ou 0x3F)
- Display OLED SSD1306 (0x3C ou 0x3D)
- Sensores: BME280 (0x76, 0x77), MPU6050 (0x68), DS1307 RTC (0x68)
- EEPROM AT24C32 (0x50-0x57)
- Expansor GPIO PCF8574 (0x20-0x27)

**Wire Library (I2C):**
```cpp
#include <Wire.h>

Wire.begin()                    // Inicia I2C como master
Wire.beginTransmission(address) // Inicia comunicação com device
Wire.write(data)                // Envia byte
Wire.endTransmission()          // Finaliza transmissão
Wire.requestFrom(address, qty)  // Solicita bytes do device
Wire.available()                // Bytes disponíveis para ler
Wire.read()                     // Lê byte recebido
```

**Scanner I2C (encontrar endereços):**
```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(9600);
  Serial.println("Escaneando I2C...");
  
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Device encontrado: 0x");
      Serial.println(addr, HEX);
    }
  }
}

void loop() {}
```

---

### Exercício 11: LCD 16x2 com I2C

**Objetivo:** Exibir texto em display LCD via I2C

**Componentes Necessários:**
- 1x Display LCD 16x2 com adaptador I2C (PCF8574)
- Jumpers

**Conceitos:**
- Biblioteca LiquidCrystal_I2C
- Endereçamento I2C
- Controle de cursor e backlight
- Caracteres especiais

**Circuito:**
```
LCD I2C:
  VCC → 5V
  GND → GND
  SDA → A4
  SCL → A5
```

**Instalação da Biblioteca:**
- Arduino IDE: Sketch → Include Library → Manage Libraries
- Buscar: "LiquidCrystal I2C" by Frank de Brabander
- Instalar

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Endereço I2C (0x27 ou 0x3F), colunas, linhas
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();           // Inicializa LCD
  lcd.backlight();      // Liga backlight
  
  // Exibir mensagem inicial
  lcd.setCursor(0, 0);  // Coluna 0, linha 0
  lcd.print("Arduino LCD I2C");
  lcd.setCursor(0, 1);  // Coluna 0, linha 1
  lcd.print("Ola Mundo!");
}

void loop() {
  // Atualizar contador
  static int counter = 0;
  
  lcd.setCursor(10, 1);
  lcd.print("      ");  // Limpar área
  lcd.setCursor(10, 1);
  lcd.print(counter);
  
  counter++;
  delay(1000);
}
```

**Funções Úteis:**
```cpp
lcd.clear()              // Limpa tela
lcd.home()               // Cursor para (0,0)
lcd.setCursor(col, row)  // Posiciona cursor
lcd.print(data)          // Exibe texto/número
lcd.cursor()             // Mostra cursor piscante
lcd.noCursor()           // Esconde cursor
lcd.blink()              // Cursor piscando
lcd.noBlink()            // Cursor fixo
lcd.scrollDisplayLeft()  // Rola texto para esquerda
lcd.scrollDisplayRight() // Rola texto para direita
lcd.noBacklight()        // Desliga backlight
lcd.backlight()          // Liga backlight
```

**Desafios:**
1. 🟢 **Fácil:** Criar animação de texto rolando (scrolling)
2. 🟡 **Médio:** Exibir temperatura de LM35 em tempo real no LCD
3. 🔴 **Difícil:** Criar menu navegável com encoder rotativo + LCD

---

### Exercício 12: Sensor BME280 (I2C)

**Objetivo:** Ler temperatura, umidade e pressão com BME280

**Componentes Necessários:**
- 1x Sensor BME280 (I2C)
- Jumpers

**Conceitos:**
- Comunicação I2C com sensores
- Biblioteca Adafruit BME280
- Altitude calculada
- Oversampling

**Circuito:**
```
BME280:
  VCC → 3.3V (não use 5V!)
  GND → GND
  SDA → A4
  SCL → A5
```

**Instalação da Biblioteca:**
- Sketch → Include Library → Manage Libraries
- Buscar: "Adafruit BME280"
- Instalar (vai pedir para instalar dependências - aceitar todas)

```cpp
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;  // Objeto BME280

// Pressão ao nível do mar local (ajustar para sua cidade)
#define SEALEVELPRESSURE_HPA (1013.25)

void setup() {
  Serial.begin(9600);
  Serial.println("BME280 Test");
  
  // Tentar inicializar (endereço padrão 0x76 ou 0x77)
  if (!bme.begin(0x76)) {
    Serial.println("BME280 não encontrado!");
    while (1) delay(10);  // Trava aqui
  }
  
  Serial.println("BME280 iniciado com sucesso!");
}

void loop() {
  // Ler sensores
  float temp = bme.readTemperature();        // °C
  float pressure = bme.readPressure() / 100.0F;  // hPa
  float altitude = bme.readAltitude(SEALEVELPRESSURE_HPA);  // metros
  float humidity = bme.readHumidity();       // %
  
  // Exibir no Serial
  Serial.println("========== Leituras BME280 ==========");
  Serial.print("Temperatura: ");
  Serial.print(temp);
  Serial.println(" °C");
  
  Serial.print("Pressão: ");
  Serial.print(pressure);
  Serial.println(" hPa");
  
  Serial.print("Altitude aprox: ");
  Serial.print(altitude);
  Serial.println(" m");
  
  Serial.print("Umidade: ");
  Serial.print(humidity);
  Serial.println(" %");
  
  Serial.println();
  delay(2000);
}
```

**Cálculo de Altitude:**
- Baseado na fórmula barométrica
- Precisa da pressão ao nível do mar de referência
- Erro: ±10-20m dependendo das condições

**Desafios:**
1. 🟢 **Fácil:** Exibir leituras no LCD 16x2 (alternando entre telas)
2. 🟡 **Médio:** Registrar min/max de temperatura e umidade
3. 🔴 **Difícil:** Criar logger que salva leituras no cartão SD com timestamp

---

## Semana 7: SPI e Armazenamento

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 14-16 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Intermediário-Avançado
- 🎯 **Habilidades desenvolvidas:** SPI, SD card, FAT filesystem, displays gráficos
- ✅ **Checklist:** [ ] Exercício 13 | [ ] Exercício 14

### 📖 Fundamentos - SPI (Serial Peripheral Interface)

**O que é SPI?**
- Protocolo de comunicação serial síncrono
- Mais rápido que I2C (pode chegar a vários MHz)
- 4 fios: MISO, MOSI, SCK, SS/CS
- Full-duplex (envia e recebe simultaneamente)

**Pinos SPI no Arduino UNO:**
- **MOSI (Master Out Slave In):** Pino 11
- **MISO (Master In Slave Out):** Pino 12
- **SCK (Serial Clock):** Pino 13
- **SS/CS (Slave Select):** Qualquer pino digital (geralmente 10)

**Características:**
- **Master/Slave:** Arduino é master
- **Velocidade:** Até 8MHz no Arduino UNO
- **Chip Select:** Cada dispositivo precisa de pino SS próprio
- **Não tem endereçamento:** Usa SS para selecionar device

**Comparação I2C vs SPI:**
| Aspecto | I2C | SPI |
|---------|-----|-----|
| Fios | 2 (SDA, SCL) | 4 (MISO, MOSI, SCK, SS) |
| Velocidade | 100-400kHz | 1-8MHz+ |
| Dispositivos | Endereçamento | Pino SS por device |
| Complexidade | Simples | Média |
| Uso típico | Sensores, displays | SD cards, displays TFT |

**SPI Library:**
```cpp
#include <SPI.h>

SPI.begin()                // Inicia SPI
SPI.beginTransaction(settings)  // Configura velocidade/modo
SPI.transfer(data)         // Envia e recebe byte
SPI.endTransaction()       // Finaliza transação
digitalWrite(SS_PIN, LOW)  // Seleciona device
digitalWrite(SS_PIN, HIGH) // Desseleciona device
```

---

### Exercício 13: Cartão SD via SPI

**Objetivo:** Ler e escrever arquivos em cartão SD

**Componentes Necessários:**
- 1x Módulo cartão SD (com regulador 5V→3.3V)
- 1x Cartão microSD (FAT32, ≤32GB)
- Jumpers

**Conceitos:**
- Biblioteca SD.h
- Sistema de arquivos FAT
- File operations (open, write, read, close)
- Datalogger

**Circuito:**
```
Módulo SD:
  VCC → 5V
  GND → GND
  MISO → Pino 12
  MOSI → Pino 11
  SCK → Pino 13
  CS → Pino 10 (ou outro digital)
```

**⚠️ IMPORTANTE:** Cartão SD opera em 3.3V! Use módulo com regulador ou divisor de tensão.

```cpp
#include <SPI.h>
#include <SD.h>

const int CS_PIN = 10;
File myFile;

void setup() {
  Serial.begin(9600);
  Serial.println("Inicializando SD card...");
  
  if (!SD.begin(CS_PIN)) {
    Serial.println("Falha ao inicializar SD card!");
    while (1);
  }
  Serial.println("SD card inicializado.");
  
  // ========== ESCREVER ARQUIVO ==========
  myFile = SD.open("teste.txt", FILE_WRITE);
  
  if (myFile) {
    Serial.println("Escrevendo em teste.txt...");
    myFile.println("Teste de escrita no SD card");
    myFile.println("Arduino UNO + SPI");
    myFile.print("Timestamp: ");
    myFile.println(millis());
    myFile.close();
    Serial.println("Escrita concluída.");
  } else {
    Serial.println("Erro ao abrir teste.txt para escrita");
  }
  
  // ========== LER ARQUIVO ==========
  myFile = SD.open("teste.txt");
  
  if (myFile) {
    Serial.println("\n========== Conteúdo de teste.txt ==========");
    while (myFile.available()) {
      Serial.write(myFile.read());
    }
    myFile.close();
  } else {
    Serial.println("Erro ao abrir teste.txt para leitura");
  }
}

void loop() {
  // Datalogger: adicionar leitura a cada 10 segundos
  static unsigned long lastLog = 0;
  
  if (millis() - lastLog > 10000) {
    myFile = SD.open("datalog.txt", FILE_WRITE);
    
    if (myFile) {
      int sensorValue = analogRead(A0);
      
      myFile.print(millis());
      myFile.print(",");
      myFile.println(sensorValue);
      myFile.close();
      
      Serial.print("Log adicionado: ");
      Serial.println(sensorValue);
    }
    
    lastLog = millis();
  }
}
```

**Funções Úteis:**
```cpp
SD.begin(cs_pin)              // Inicializa SD card
SD.exists(filename)           // Verifica se arquivo existe
SD.remove(filename)           // Deleta arquivo
SD.mkdir(dirname)             // Cria diretório
SD.rmdir(dirname)             // Remove diretório

// File operations
file.available()              // Bytes disponíveis
file.read()                   // Lê byte
file.write(data)              // Escreve byte/string
file.println(data)            // Escreve linha
file.seek(pos)                // Move cursor
file.position()               // Posição atual
file.size()                   // Tamanho do arquivo
file.close()                  // Fecha arquivo
```

**Desafios:**
1. 🟢 **Fácil:** Criar arquivo CSV com cabeçalho (timestamp,temperatura,umidade)
2. 🟡 **Médio:** Implementar log rotativo (quando arquivo > 1MB, criar novo)
3. 🔴 **Difícil:** Ler configuração de arquivo JSON no SD e aplicar ao sistema

---

### Exercício 14: Display TFT SPI

**Objetivo:** Exibir gráficos em display colorido TFT

**Componentes Necessários:**
- 1x Display TFT 1.8" ST7735 (SPI)
- Jumpers

**Conceitos:**
- Biblioteca Adafruit ST7735
- Gráficos primitivos (linhas, círculos, retângulos)
- Coordenadas (x, y)
- Cores RGB565

**Circuito:**
```
TFT ST7735:
  VCC → 5V
  GND → GND
  SCK → Pino 13
  MOSI (SDA) → Pino 11
  CS → Pino 10
  RST → Pino 9
  DC (A0) → Pino 8
  (LED → 3.3V opcional)
```

**Instalação da Biblioteca:**
- Sketch → Include Library → Manage Libraries
- Buscar: "Adafruit ST7735"
- Instalar (aceitar dependências: Adafruit GFX, Adafruit BusIO)

```cpp
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

#define TFT_CS   10
#define TFT_RST  9
#define TFT_DC   8

Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  Serial.begin(9600);
  
  // Inicializar display (1.8" 128x160)
  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1);  // Landscape
  
  // Preencher fundo preto
  tft.fillScreen(ST77XX_BLACK);
  
  // Texto
  tft.setCursor(10, 10);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
  tft.println("Arduino TFT");
  
  // Formas geométricas
  tft.drawRect(10, 40, 100, 60, ST77XX_RED);      // Retângulo
  tft.fillCircle(140, 70, 20, ST77XX_BLUE);       // Círculo cheio
  tft.drawLine(0, 120, 160, 120, ST77XX_GREEN);   // Linha
  
  Serial.println("TFT inicializado!");
}

void loop() {
  // Animação simples: barra que cresce
  static int barWidth = 0;
  
  tft.fillRect(10, 100, 140, 10, ST77XX_BLACK);  // Limpar barra
  tft.fillRect(10, 100, barWidth, 10, ST77XX_YELLOW);  // Desenhar barra
  
  barWidth += 5;
  if (barWidth > 140) barWidth = 0;
  
  delay(50);
}
```

**Cores RGB565:**
```cpp
ST77XX_BLACK   = 0x0000
ST77XX_WHITE   = 0xFFFF
ST77XX_RED     = 0xF800
ST77XX_GREEN   = 0x07E0
ST77XX_BLUE    = 0x001F
ST77XX_YELLOW  = 0xFFE0
ST77XX_MAGENTA = 0xF81F
ST77XX_CYAN    = 0x07FF
```

**Funções Gráficas:**
```cpp
tft.drawPixel(x, y, color)
tft.drawLine(x0, y0, x1, y1, color)
tft.drawRect(x, y, w, h, color)
tft.fillRect(x, y, w, h, color)
tft.drawCircle(x, y, r, color)
tft.fillCircle(x, y, r, color)
tft.drawTriangle(x0,y0, x1,y1, x2,y2, color)
tft.fillTriangle(x0,y0, x1,y1, x2,y2, color)
tft.drawRoundRect(x, y, w, h, r, color)
tft.fillRoundRect(x, y, w, h, r, color)
```

**Desafios:**
1. 🟢 **Fácil:** Criar gráfico de barras com 5 valores aleatórios
2. 🟡 **Médio:** Exibir sensor de temperatura com ponteiro estilo gauge
3. 🔴 **Difícil:** Criar jogo Snake com controle por encoder rotativo

---

## Semana 8: EEPROM e Timers

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 10-12 horas
- 📊 **Dificuldade:** ⭐⭐⭐ Intermediário
- 🎯 **Habilidades desenvolvidas:** EEPROM, persistent storage, Timer1, interrupts por timer
- ✅ **Checklist:** [ ] Exercício 15 | [ ] Exercício 16

### 📖 Fundamentos - EEPROM

**O que é EEPROM?**
- Electrically Erasable Programmable Read-Only Memory
- Memória não-volátil (persiste após desligar)
- Arduino UNO: 1KB (1024 bytes)
- Endereços: 0 a 1023

**Características:**
- Leitura ilimitada
- **Escrita limitada:** ~100.000 ciclos por célula
- Escrita lenta (~3ms por byte)
- Ideal para configurações, calibrações, contadores

**⚠️ CUIDADO:**
- Não escrever constantemente (desgasta EEPROM)
- Verificar antes de escrever (write only if changed)
- Usar wear leveling para dados frequentes

**EEPROM Library:**
```cpp
#include <EEPROM.h>

EEPROM.read(address)        // Lê byte
EEPROM.write(address, val)  // Escreve byte
EEPROM.update(address, val) // Escreve só se mudou (recomendado!)
EEPROM.get(address, data)   // Lê estrutura/tipo complexo
EEPROM.put(address, data)   // Escreve estrutura/tipo complexo
```

---

### Exercício 15: Salvar Dados na EEPROM

**Objetivo:** Salvar configurações e contadores na EEPROM

**Componentes Necessários:**
- Apenas Arduino UNO
- (Opcional: botão para reset)

**Conceitos:**
- EEPROM.write() vs EEPROM.update()
- Estruturas (struct) em EEPROM
- Validação de dados (magic number)
- Contadores persistentes

```cpp
#include <EEPROM.h>

// Estrutura de configuração
struct Config {
  byte magicNumber;   // Validação (ex: 0xAB)
  int bootCount;      // Contador de boots
  float threshold;    // Valor de configuração
  char name[10];      // String
};

const int CONFIG_ADDR = 0;  // Endereço inicial na EEPROM
Config config;

void saveConfig() {
  config.magicNumber = 0xAB;  // Marca como válido
  EEPROM.put(CONFIG_ADDR, config);
  Serial.println("Configuração salva!");
}

void loadConfig() {
  EEPROM.get(CONFIG_ADDR, config);
  
  // Verificar se EEPROM tem dados válidos
  if (config.magicNumber != 0xAB) {
    Serial.println("EEPROM vazia ou inválida. Usando padrões.");
    
    // Valores padrão
    config.magicNumber = 0xAB;
    config.bootCount = 0;
    config.threshold = 25.5;
    strcpy(config.name, "Arduino");
    
    saveConfig();
  } else {
    Serial.println("Configuração carregada da EEPROM!");
  }
}

void setup() {
  Serial.begin(9600);
  Serial.println("\n========== Sistema Iniciado ==========");
  
  loadConfig();
  
  // Incrementar contador de boots
  config.bootCount++;
  saveConfig();
  
  // Exibir configuração
  Serial.print("Boot #");
  Serial.println(config.bootCount);
  Serial.print("Nome: ");
  Serial.println(config.name);
  Serial.print("Threshold: ");
  Serial.println(config.threshold);
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    
    switch(cmd) {
      case 'r':  // Reset contador
        config.bootCount = 0;
        saveConfig();
        Serial.println("Contador resetado!");
        break;
        
      case 's':  // Mostrar status
        Serial.print("Boot count: ");
        Serial.println(config.bootCount);
        break;
        
      case 't':  // Mudar threshold
        Serial.println("Digite novo threshold:");
        while (!Serial.available());
        config.threshold = Serial.parseFloat();
        saveConfig();
        Serial.print("Novo threshold: ");
        Serial.println(config.threshold);
        break;
    }
  }
}
```

**Exemplo: Contador de Uso:**
```cpp
// Salvar quanto tempo total o sistema ficou ligado
unsigned long totalUptime = 0;  // Segundos
const int UPTIME_ADDR = 10;

void setup() {
  EEPROM.get(UPTIME_ADDR, totalUptime);
  Serial.print("Uptime total: ");
  Serial.print(totalUptime);
  Serial.println(" segundos");
}

void loop() {
  static unsigned long lastSave = 0;
  
  // Salvar a cada 60 segundos
  if (millis() - lastSave > 60000) {
    totalUptime += 60;
    EEPROM.put(UPTIME_ADDR, totalUptime);
    lastSave = millis();
  }
}
```

**Desafios:**
1. 🟢 **Fácil:** Salvar último valor de potenciômetro ao desligar
2. 🟡 **Médio:** Criar sistema de high score para um jogo
3. 🔴 **Difícil:** Implementar wear leveling para distribuir escritas

---

### Exercício 16: Timer Interrupts

**Objetivo:** Usar Timer1 para interrupções precisas

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- Jumpers

**Conceitos:**
- Timer1 (16 bits)
- Interrupts de comparação
- Registro de controle de timer
- Prescaler

**⚠️ AVISO:** Manipular timers diretamente afeta funções como delay(), millis(), PWM!

**Instalação da Biblioteca:**
- Sketch → Include Library → Manage Libraries
- Buscar: "TimerOne"
- Instalar

```cpp
#include <TimerOne.h>

const int LED_PIN = 13;
volatile bool ledState = false;

void timerISR() {
  // Chamado a cada 500ms
  ledState = !ledState;
  digitalWrite(LED_PIN, ledState);
}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  
  // Inicializar Timer1 com período de 500000 microsegundos (500ms)
  Timer1.initialize(500000);
  Timer1.attachInterrupt(timerISR);
  
  Serial.println("Timer1 configurado para 500ms");
}

void loop() {
  // Loop principal livre para outras tarefas
  Serial.println("Loop executando...");
  delay(2000);
}
```

**Timer Manual (sem biblioteca):**
```cpp
// Configurar Timer1 para interrupt a cada 1 segundo
// Clock: 16MHz, Prescaler: 256, Compare: 62499
// 16MHz / 256 / (62499+1) = 1Hz

const int LED_PIN = 13;
volatile bool ledState = false;

ISR(TIMER1_COMPA_vect) {
  // Interrupt Service Routine
  ledState = !ledState;
  digitalWrite(LED_PIN, ledState);
}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  
  cli();  // Desabilita interrupts durante configuração
  
  // Configurar Timer1
  TCCR1A = 0;  // Modo normal
  TCCR1B = 0;
  TCNT1 = 0;   // Inicializar contador
  
  // Configurar compare match register (16MHz/256/1Hz - 1)
  OCR1A = 62499;
  
  // Modo CTC (Clear Timer on Compare)
  TCCR1B |= (1 << WGM12);
  
  // Prescaler 256
  TCCR1B |= (1 << CS12);
  
  // Habilitar interrupt de comparação
  TIMSK1 |= (1 << OCIE1A);
  
  sei();  // Habilita interrupts
}

void loop() {
  // Loop livre
}
```

**Cálculo de Prescaler e OCR:**
```
Frequência desejada = Clock / (Prescaler * (OCR + 1))

Prescaler options: 1, 8, 64, 256, 1024

Exemplo para 1Hz (1 segundo):
16MHz / 256 / X = 1Hz
X = 16000000 / 256 / 1 = 62500
OCR1A = 62500 - 1 = 62499
```

**Desafios:**
1. 🟢 **Fácil:** Fazer LED piscar a 10Hz (100ms)
2. 🟡 **Médio:** Criar relógio usando timer (horas:minutos:segundos)
3. 🔴 **Difícil:** Gerar sinal PWM customizado com timer (frequência exata)

---

## 🎯 Projeto Final: Estação Meteorológica

**Objetivo:** Sistema completo de monitoramento com display e datalogger

**Tempo estimado:** 12-16 horas

**Componentes Necessários:**
- 1x Arduino UNO
- 1x Sensor BME280 (temperatura, umidade, pressão)
- 1x Display LCD 16x2 I2C
- 1x Módulo SD card
- 1x Botão (trocar telas)
- 1x LED RGB (indicador de status)
- 3x Resistores 220Ω (para LED RGB)
- Cartão microSD
- Fonte externa 9V (recomendado)
- Jumpers e protoboard

**Funcionalidades:**
1. **Leitura de sensores:** Temperatura, umidade, pressão (BME280)
2. **Display LCD:** Mostra leituras (3 telas alternadas)
3. **Datalogger:** Salva dados no SD a cada 5 minutos
4. **EEPROM:** Salva estatísticas (min/max desde boot)
5. **LED RGB:** Verde=OK, Amarelo=Aviso, Vermelho=Erro
6. **Botão:** Navegar entre telas do LCD
7. **Serial:** Comandos de configuração

**Arquitetura:**
```
I2C Bus (A4=SDA, A5=SCL):
  ├── BME280 (0x76)
  └── LCD (0x27)

SPI Bus:
  └── SD Card (CS=10)

GPIO:
  ├── Botão (Pino 2 com interrupt)
  ├── LED RGB R (Pino 9)
  ├── LED RGB G (Pino 6)
  └── LED RGB B (Pino 5)
```

**Código Completo:**
```cpp
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_BME280.h>
#include <EEPROM.h>

// ========== PINOS ==========
const int SD_CS = 10;
const int BUTTON_PIN = 2;
const int LED_R = 9;
const int LED_G = 6;
const int LED_B = 5;

// ========== OBJETOS ==========
LiquidCrystal_I2C lcd(0x27, 16, 2);
Adafruit_BME280 bme;

// ========== CONFIGURAÇÃO ==========
struct Stats {
  float tempMin;
  float tempMax;
  float humidMin;
  float humidMax;
  int bootCount;
};

Stats stats;
const int STATS_ADDR = 0;

// ========== VARIÁVEIS ==========
volatile int currentScreen = 0;
const int NUM_SCREENS = 3;
unsigned long lastLog = 0;
const long LOG_INTERVAL = 300000;  // 5 minutos

// ========== ISR ==========
void buttonISR() {
  static unsigned long lastPress = 0;
  if (millis() - lastPress > 200) {  // Debounce
    currentScreen = (currentScreen + 1) % NUM_SCREENS;
    lastPress = millis();
  }
}

// ========== SETUP ==========
void setup() {
  Serial.begin(9600);
  
  // Pinos
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  
  setColor(255, 255, 0);  // Amarelo: inicializando
  
  // Interrupt
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonISR, FALLING);
  
  // LCD
  lcd.init();
  lcd.backlight();
  lcd.print("Iniciando...");
  
  // BME280
  if (!bme.begin(0x76)) {
    lcd.clear();
    lcd.print("Erro BME280!");
    setColor(255, 0, 0);  // Vermelho: erro
    while (1);
  }
  
  // SD Card
  if (!SD.begin(SD_CS)) {
    lcd.clear();
    lcd.print("Erro SD Card!");
    setColor(255, 0, 0);
    while (1);
  }
  
  // Carregar estatísticas
  EEPROM.get(STATS_ADDR, stats);
  if (stats.bootCount == 255) {  // EEPROM vazia
    stats.tempMin = 999;
    stats.tempMax = -999;
    stats.humidMin = 999;
    stats.humidMax = 0;
    stats.bootCount = 0;
  }
  stats.bootCount++;
  EEPROM.put(STATS_ADDR, stats);
  
  // Criar arquivo CSV com cabeçalho se não existir
  if (!SD.exists("weather.csv")) {
    File file = SD.open("weather.csv", FILE_WRITE);
    file.println("Timestamp,Temp(C),Humidity(%),Pressure(hPa)");
    file.close();
  }
  
  setColor(0, 255, 0);  // Verde: OK
  lcd.clear();
  lcd.print("Pronto!");
  delay(1000);
}

// ========== LOOP ==========
void loop() {
  // Ler sensores
  float temp = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F;
  
  // Atualizar estatísticas
  if (temp < stats.tempMin) {
    stats.tempMin = temp;
    EEPROM.put(STATS_ADDR, stats);
  }
  if (temp > stats.tempMax) {
    stats.tempMax = temp;
    EEPROM.put(STATS_ADDR, stats);
  }
  if (humidity < stats.humidMin) {
    stats.humidMin = humidity;
    EEPROM.put(STATS_ADDR, stats);
  }
  if (humidity > stats.humidMax) {
    stats.humidMax = humidity;
    EEPROM.put(STATS_ADDR, stats);
  }
  
  // Atualizar LCD
  lcd.clear();
  switch(currentScreen) {
    case 0:  // Tela 1: Temp e Umidade
      lcd.setCursor(0, 0);
      lcd.print("Temp: ");
      lcd.print(temp, 1);
      lcd.print("C");
      lcd.setCursor(0, 1);
      lcd.print("Umid: ");
      lcd.print(humidity, 1);
      lcd.print("%");
      break;
      
    case 1:  // Tela 2: Pressão
      lcd.setCursor(0, 0);
      lcd.print("Pressao:");
      lcd.setCursor(0, 1);
      lcd.print(pressure, 1);
      lcd.print(" hPa");
      break;
      
    case 2:  // Tela 3: Estatísticas
      lcd.setCursor(0, 0);
      lcd.print("T:");
      lcd.print(stats.tempMin, 0);
      lcd.print("-");
      lcd.print(stats.tempMax, 0);
      lcd.print("C");
      lcd.setCursor(0, 1);
      lcd.print("H:");
      lcd.print(stats.humidMin, 0);
      lcd.print("-");
      lcd.print(stats.humidMax, 0);
      lcd.print("%");
      break;
  }
  
  // Datalogger
  if (millis() - lastLog > LOG_INTERVAL) {
    File file = SD.open("weather.csv", FILE_WRITE);
    if (file) {
      file.print(millis() / 1000);
      file.print(",");
      file.print(temp);
      file.print(",");
      file.print(humidity);
      file.print(",");
      file.println(pressure);
      file.close();
      
      Serial.println("Log salvo!");
      
      // Piscar LED verde
      setColor(0, 0, 0);
      delay(50);
      setColor(0, 255, 0);
    }
    
    lastLog = millis();
  }
  
  // Serial commands
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'r') {  // Reset stats
      stats.tempMin = 999;
      stats.tempMax = -999;
      stats.humidMin = 999;
      stats.humidMax = 0;
      EEPROM.put(STATS_ADDR, stats);
      Serial.println("Estatísticas resetadas!");
    }
  }
  
  delay(2000);  // Atualizar a cada 2 segundos
}

// ========== FUNÇÕES ==========
void setColor(int r, int g, int b) {
  analogWrite(LED_R, r);
  analogWrite(LED_G, g);
  analogWrite(LED_B, b);
}
```

**Melhorias Opcionais:**
- RTC DS1307 para timestamp real
- Conexão WiFi com ESP8266 para enviar dados
- Display gráfico TFT com gráficos históricos
- Previsão do tempo básica (análise de tendência de pressão)
- Alarmes configuráveis

---

## ⚠️ Problemas Comuns e Soluções

### 1. I2C device não encontrado
- ✅ Usar I2C scanner para encontrar endereço
- ✅ Verificar conexões SDA/SCL (A4/A5)
- ✅ Verificar pull-ups (módulos geralmente já têm)
- ✅ Testar com diferentes endereços (0x27 ou 0x3F para LCD)

### 2. SD card não inicializa
- ✅ Verificar se cartão é FAT32 (não exFAT, não NTFS)
- ✅ Tamanho ≤32GB
- ✅ Módulo deve ter regulador 5V→3.3V
- ✅ Testar com outro cartão
- ✅ Formatar cartão no computador

### 3. Interrupt não funciona
- ✅ Usar apenas pinos 2 ou 3 no Arduino UNO
- ✅ ISR deve ser rápida (sem delay)
- ✅ Variáveis compartilhadas devem ser `volatile`
- ✅ Implementar debounce

### 4. Display LCD mostra quadrados
- ✅ Ajustar contraste (potenciômetro no módulo I2C)
- ✅ Verificar endereço I2C (0x27 ou 0x3F)
- ✅ Verificar se inicializou corretamente (lcd.init())

### 5. EEPROM parece não salvar
- ✅ Usar EEPROM.put() ao invés de write() para structs
- ✅ Verificar se endereço não ultrapassa 1023
- ✅ Aguardar 4ms após escrita antes de desligar
- ✅ Validar dados com magic number

### 6. SPI conflito (SD + TFT)
- ✅ Cada device precisa de CS próprio
- ✅ Desselecionar device (CS=HIGH) quando não em uso
- ✅ Usar mesma velocidade SPI para ambos
- ✅ Compartilhar MISO/MOSI/SCK, CS separados

### 7. Timer afeta delay() e millis()
- ✅ Timer0 controla millis/delay - não mexer!
- ✅ Usar Timer1 ou Timer2 para interrupts
- ✅ Usar biblioteca TimerOne para facilitar
- ✅ PWM em pinos 9/10 afetados por Timer1

---

## 🔗 Próximos Passos

**Parabéns!** Você completou o Nível 2 - Intermediário do Arduino! 🎉

**O que você aprendeu:**
- ✅ Interrupts externos (attachInterrupt)
- ✅ I2C: LCD 16x2, sensores BME280
- ✅ SPI: SD card, displays TFT
- ✅ EEPROM: armazenamento persistente
- ✅ Timer interrupts (Timer1)
- ✅ Encoder rotativo
- ✅ Datalogger completo
- ✅ Projeto: Estação Meteorológica

**Próximo nível:**
📘 **[Nível 3 - Avançado](../nivel-3-avancado/info-avancado.md)**
- Manipulação de registradores (PORTB, DDRB)
- Interrupções por timer avançadas
- Watchdog timer
- Power management (sleep modes)
- Bootloader customizado
- Criação de bibliotecas próprias
- Comparação Arduino vs bare-metal

**Transição recomendada:**
Após o Nível 3 do Arduino, você estará pronto para:
- 🚀 **[ESP32](../../i1-esp32/README.md)** - WiFi, Bluetooth, dual-core
- 🔧 **[RP2040](../../i2-rp2040-a/README.md)** - PIO, dual-core ARM
- ⚡ **Bare-metal AVR** - Programação sem framework Arduino

**Outros recursos:**
- 📖 Conceitos fundamentais: [`../../../../learn/i1-conceitos-fundamentais/`](../../../../learn/i1-conceitos-fundamentais/)
- 🗺️ Roadmap completo: [`../../../../learn/roadmap_geral.md`](../../../../learn/roadmap_geral.md)
- 📚 Referências: [`../../README.md`](../../README.md)

**Voltar:** [`../README.md`](../README.md)
