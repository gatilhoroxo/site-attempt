---
layout: default
title: N1 Basico
---

## 📚 NÍVEL 1 - BÁSICO (Semanas 1-4)

**Progresso:** [ ] Semana 1 | [ ] Semana 2 | [ ] Semana 3 | [ ] Semana 4 | [ ] Projeto Final

---

## 📑 Índice

### [Semana 1: GPIO Digital](#semana-1-gpio-digital)
- [Exercício 1: Blink LED Clássico](#exercício-1-blink-led-clássico)
- [Exercício 2: Botão e LED](#exercício-2-botão-e-led)
- [Exercício 3: Debounce de Botão](#exercício-3-debounce-de-botão)

### [Semana 2: PWM e Controle Analógico](#semana-2-pwm-e-controle-analógico)
- [Exercício 4: Fade LED com PWM](#exercício-4-fade-led-com-pwm)
- [Exercício 5: Controle de Servo Motor](#exercício-5-controle-de-servo-motor)

### [Semana 3: ADC e Sensores Analógicos](#semana-3-adc-e-sensores-analógicos)
- [Exercício 6: Ler Potenciômetro](#exercício-6-ler-potenciômetro)
- [Exercício 7: Sensor de Temperatura LM35](#exercício-7-sensor-de-temperatura-lm35)

### [Semana 4: Serial e Múltiplos Dispositivos](#semana-4-serial-e-múltiplos-dispositivos)
- [Exercício 8: Display 7 Segmentos](#exercício-8-display-7-segmentos)

### [🎯 Projeto Final: Semáforo Inteligente](#-projeto-final-semáforo-inteligente)

### [⚠️ Problemas Comuns e Soluções](#️-problemas-comuns-e-soluções)

### [🔗 Próximos Passos](#-próximos-passos)

---

## Semana 1: GPIO Digital

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐ Iniciante
- 🎯 **Habilidades desenvolvidas:** pinMode, digitalWrite, digitalRead, pull-up resistors
- ✅ **Checklist:** [ ] Exercício 1 | [ ] Exercício 2 | [ ] Exercício 3

### 📖 Fundamentos - GPIO (General Purpose Input/Output)

**O que é GPIO?**
- Pinos configuráveis como entrada (INPUT) ou saída (OUTPUT)
- Arduino UNO tem 14 pinos digitais (0-13)
- Níveis lógicos: HIGH (5V) e LOW (0V)
- Pinos 0 e 1 são usados para Serial (TX/RX)

**Modos de Operação:**
- **OUTPUT:** Controla dispositivos (LEDs, relés, buzzer)
- **INPUT:** Lê estado de sensores, botões (flutuante)
- **INPUT_PULLUP:** Input com resistor pull-up interno (20-50kΩ)

**Pull-up vs Pull-down:**
- **Pull-up:** Pino HIGH quando botão não pressionado, LOW quando pressionado
- **Pull-down:** Pino LOW quando não pressionado, HIGH quando pressionado
- Arduino tem pull-up interno, não tem pull-down interno

**Debouncing:**
- Contatos mecânicos "quicam" ao pressionar (geram múltiplos sinais)
- Solução: delay simples ou técnica com millis()

**Funções Principais:**
```cpp
pinMode(pin, mode)        // Configura pino (OUTPUT, INPUT, INPUT_PULLUP)
digitalWrite(pin, value)  // Escreve HIGH ou LOW
digitalRead(pin)          // Lê estado do pino (HIGH ou LOW)
delay(ms)                 // Pausa por millisegundos (bloqueante)
millis()                  // Retorna tempo desde boot em ms
```

---

### Exercício 1: Blink LED Clássico

**Objetivo:** Piscar LED interno usando delay()

**Componentes Necessários:**
- Arduino UNO
- Cabo USB
- (LED interno no pino 13 - LED_BUILTIN)

**Conceitos:**
- Estrutura setup() e loop()
- pinMode() para configurar saída
- digitalWrite() para controlar LED
- delay() para temporização

```cpp
// Blink básico - LED interno pino 13

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  // LED_BUILTIN = pino 13
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // Liga LED
  delay(1000);                      // Aguarda 1 segundo
  digitalWrite(LED_BUILTIN, LOW);   // Desliga LED
  delay(1000);                      // Aguarda 1 segundo
}
```

**Upload:**
- Arduino IDE: Sketch → Upload (Ctrl+U)
- PlatformIO: `pio run --target upload`

**Desafios:**
1. 🟢 **Fácil:** Fazer piscar mais rápido (200ms)
2. 🟡 **Médio:** Criar padrão S.O.S em morse (•••  ---  •••)
3. 🔴 **Difícil:** Usar 3 LEDs externos criando efeito "corrida" (knight rider)

---

### Exercício 2: Botão e LED

**Objetivo:** Controlar LED com botão físico

**Componentes Necessários:**
- 1x LED
- 1x Botão (pushbutton)
- 1x Resistor 220Ω (para LED)
- 1x Resistor 10kΩ (pull-down para botão) OU usar INPUT_PULLUP
- Protoboard e jumpers

**Conceitos:**
- pinMode() com INPUT_PULLUP
- digitalRead() para ler botão
- Lógica invertida com pull-up (LOW = pressionado)

**Circuito:**
```
Botão: Pino 2 → Botão → GND (usando INPUT_PULLUP)
LED: Pino 13 → Resistor 220Ω → LED → GND
```

```cpp
const int LED_PIN = 13;
const int BUTTON_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Pull-up interno
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if (buttonState == LOW) {  // LOW = pressionado (pull-up invertido)
    digitalWrite(LED_PIN, HIGH);  // Liga LED
  } else {
    digitalWrite(LED_PIN, LOW);   // Desliga LED
  }
}
```

**Desafios:**
1. 🟢 **Fácil:** Inverter lógica (botão apaga LED)
2. 🟡 **Médio:** Toggle LED (pressiona uma vez liga, pressiona de novo desliga)
3. 🔴 **Difícil:** Contar número de pressionamentos e exibir no Serial Monitor

---

### Exercício 3: Debounce de Botão

**Objetivo:** Eliminar bouncing com técnica millis()

**Componentes Necessários:**
- Mesmos do Exercício 2

**Conceitos:**
- Problema de bouncing mecânico
- Técnica millis() (não-bloqueante)
- Variáveis static
- Estados anteriores

```cpp
const int LED_PIN = 13;
const int BUTTON_PIN = 2;
const long DEBOUNCE_DELAY = 50;  // 50ms

int ledState = LOW;
int buttonState;
int lastButtonState = HIGH;  // Pull-up: HIGH quando solto
unsigned long lastDebounceTime = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(LED_PIN, ledState);
}

void loop() {
  int reading = digitalRead(BUTTON_PIN);
  
  // Se o estado mudou (ruído ou pressionamento real)
  if (reading != lastButtonState) {
    lastDebounceTime = millis();  // Reseta timer
  }
  
  // Se passou tempo suficiente desde última mudança
  if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
    // Se o estado mudou de fato
    if (reading != buttonState) {
      buttonState = reading;
      
      // Toggle LED apenas quando botão é pressionado (LOW)
      if (buttonState == LOW) {
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState);
      }
    }
  }
  
  lastButtonState = reading;
}
```

**Desafios:**
1. 🟢 **Fácil:** Ajustar tempo de debounce para 100ms
2. 🟡 **Médio:** Detectar pressionamento longo (> 2 segundos) vs curto
3. 🔴 **Difícil:** Implementar double-click (dois cliques rápidos)

---

## Semana 2: PWM e Controle Analógico

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** analogWrite, PWM, Servo library
- ✅ **Checklist:** [ ] Exercício 4 | [ ] Exercício 5

### 📖 Fundamentos - PWM (Pulse Width Modulation)

**O que é PWM?**
- Técnica para simular saída analógica com sinal digital
- Alterna rapidamente entre HIGH e LOW
- Duty cycle: percentual do tempo em HIGH (0-100%)
- Arduino: frequência ~490Hz (pinos 5, 6) e ~980Hz (pinos 3, 9, 10, 11)

**Pinos PWM no Arduino UNO:**
- Pinos com símbolo ~ : **3, 5, 6, 9, 10, 11**
- Usam timers internos (Timer0, Timer1, Timer2)

**Aplicações:**
- Controle de brilho de LEDs
- Controle de velocidade de motores DC
- Posicionamento de servos
- Geração de tons (buzzer)

**Função Principal:**
```cpp
analogWrite(pin, value)  // value: 0-255 (0% a 100% duty cycle)
```

**Relação Valor → Duty Cycle:**
- 0 = 0% (sempre LOW)
- 128 = 50% (metade do tempo HIGH)
- 255 = 100% (sempre HIGH)

---

### Exercício 4: Fade LED com PWM

**Objetivo:** Criar efeito de fade (respiração) em LED

**Componentes Necessários:**
- 1x LED
- 1x Resistor 220Ω
- Protoboard e jumpers

**Conceitos:**
- analogWrite() em pinos PWM
- Loop incremental/decremental
- Controle de brilho

**Circuito:**
```
Pino 9 → Resistor 220Ω → LED → GND
```

```cpp
const int LED_PIN = 9;  // Deve ser pino PWM (~)
int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  analogWrite(LED_PIN, brightness);  // 0-255
  
  brightness += fadeAmount;
  
  // Inverte direção nos extremos
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }
  
  delay(30);  // Velocidade da animação
}
```

**Desafios:**
1. 🟢 **Fácil:** Fazer fade mais lento (delay maior)
2. 🟡 **Médio:** Controlar 3 LEDs RGB criando efeito arco-íris
3. 🔴 **Difícil:** Usar potenciômetro para controlar velocidade do fade

---

### Exercício 5: Controle de Servo Motor

**Objetivo:** Controlar posição de servo com biblioteca Servo

**Componentes Necessários:**
- 1x Servo motor SG90 (ou similar)
- Jumpers
- Fonte externa 5V (se servo consumir > 200mA)

**Conceitos:**
- Biblioteca Servo.h
- Sinais PWM especiais (50Hz, pulsos 1-2ms)
- Ângulos de 0° a 180°

**Circuito:**
```
Servo:
  Fio Marrom/Preto: GND
  Fio Vermelho: 5V (usar fonte externa se possível)
  Fio Laranja/Amarelo: Pino 9
```

```cpp
#include <Servo.h>

Servo myServo;
const int SERVO_PIN = 9;

void setup() {
  myServo.attach(SERVO_PIN);  // Conecta servo ao pino
  myServo.write(90);           // Posição inicial (centro)
}

void loop() {
  // Varre de 0° a 180°
  for (int pos = 0; pos <= 180; pos++) {
    myServo.write(pos);
    delay(15);
  }
  
  // Varre de volta (180° a 0°)
  for (int pos = 180; pos >= 0; pos--) {
    myServo.write(pos);
    delay(15);
  }
}
```

**Desafios:**
1. 🟢 **Fácil:** Fazer servo ir para posições fixas (0°, 90°, 180°) com pausas
2. 🟡 **Médio:** Controlar posição do servo com potenciômetro (0-1023 → 0-180)
3. 🔴 **Difícil:** Criar "braço robótico" com 2 servos controlados por Serial

---

## Semana 3: ADC e Sensores Analógicos

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** analogRead, conversão ADC, calibração
- ✅ **Checklist:** [ ] Exercício 6 | [ ] Exercício 7

### 📖 Fundamentos - ADC (Analog to Digital Converter)

**O que é ADC?**
- Converte sinais analógicos (voltagem) em valores digitais
- Arduino UNO: ADC de 10 bits (0-1023)
- Faixa de tensão: 0V a 5V (referência padrão)

**Pinos Analógicos:**
- Arduino UNO: **A0, A1, A2, A3, A4, A5** (6 pinos)
- Também podem ser usados como GPIO digital (14, 15, 16, 17, 18, 19)

**Resolução:**
- 10 bits = 1024 valores possíveis (0-1023)
- Resolução: 5V / 1024 = ~4.88mV por step

**Conversão Valor → Voltagem:**
```cpp
int rawValue = analogRead(A0);
float voltage = (rawValue / 1023.0) * 5.0;
```

**Função Principal:**
```cpp
analogRead(pin)  // Retorna valor 0-1023
```

**Sensores Analógicos Comuns:**
- Potenciômetro (resistência variável)
- LM35 (temperatura)
- LDR (luminosidade)
- TMP36 (temperatura)
- Joystick analógico

---

### Exercício 6: Ler Potenciômetro

**Objetivo:** Ler potenciômetro e exibir valor no Serial Monitor

**Componentes Necessários:**
- 1x Potenciômetro 10kΩ
- Jumpers

**Conceitos:**
- analogRead() para leitura analógica
- Serial.begin() e Serial.print()
- Mapeamento de valores (map)

**Circuito:**
```
Potenciômetro:
  Pino 1: 5V
  Pino 2 (central): A0
  Pino 3: GND
```

```cpp
const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);  // Inicia comunicação serial
}

void loop() {
  int rawValue = analogRead(POT_PIN);  // 0-1023
  float voltage = (rawValue / 1023.0) * 5.0;
  
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println("V");
  
  delay(200);  // Atualiza 5x por segundo
}
```

**Usar Serial Monitor:**
- Ferramentas → Serial Monitor (Ctrl+Shift+M)
- Configurar baud rate para 9600

**Desafios:**
1. 🟢 **Fácil:** Mapear valor 0-1023 para 0-100 (percentual)
2. 🟡 **Médio:** Controlar brilho de LED com potenciômetro (usar map)
3. 🔴 **Difícil:** Criar bargraph com 5 LEDs mostrando nível do potenciômetro

---

### Exercício 7: Sensor de Temperatura LM35

**Objetivo:** Ler temperatura com sensor LM35

**Componentes Necessários:**
- 1x Sensor LM35
- Jumpers

**Conceitos:**
- Conversão de voltagem para temperatura
- Calibração de sensores
- Média móvel para suavização

**Circuito:**
```
LM35:
  Pino 1 (esquerda): 5V
  Pino 2 (centro): A0
  Pino 3 (direita): GND
```

**Especificação LM35:**
- 10mV por °C
- 0°C = 0V
- 100°C = 1V

```cpp
const int LM35_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawValue = analogRead(LM35_PIN);
  float voltage = (rawValue / 1023.0) * 5.0;
  float tempC = voltage * 100.0;  // LM35: 10mV/°C
  float tempF = (tempC * 9.0 / 5.0) + 32.0;
  
  Serial.print("Temperatura: ");
  Serial.print(tempC);
  Serial.print("°C (");
  Serial.print(tempF);
  Serial.println("°F)");
  
  delay(1000);
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar alerta se temperatura > 30°C (LED vermelho)
2. 🟡 **Médio:** Implementar média móvel de 10 leituras para suavizar ruído
3. 🔴 **Difícil:** Criar datalogger que grava temperatura a cada minuto no EEPROM

---

## Semana 4: Serial e Múltiplos Dispositivos

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 8-10 horas
- 📊 **Dificuldade:** ⭐⭐ Básico-Intermediário
- 🎯 **Habilidades desenvolvidas:** Multiplexação, display 7seg, lógica combinacional
- ✅ **Checklist:** [ ] Exercício 8

### 📖 Fundamentos - Display 7 Segmentos

**O que é Display 7 Segmentos?**
- 7 LEDs (segmentos) + 1 ponto decimal
- Exibe dígitos 0-9 e algumas letras
- Tipos: Cátodo comum ou Ânodo comum

**Segmentos:**
```
   A
 F   B
   G
 E   C
   D   (DP)
```

**Cátodo Comum vs Ânodo Comum:**
- **Cátodo comum:** Todos cátodos juntos no GND, segmentos acendem com HIGH
- **Ânodo comum:** Todos ânodos juntos no 5V, segmentos acendem com LOW

**Controle:**
- Direto: 7 pinos GPIO + resistores (simples mas usa muitos pinos)
- Shift Register (74HC595): 3 pinos controlam 8 saídas (economiza GPIO)
- Decodificador BCD (7447): 4 pinos BCD → 7 segmentos

---

### Exercício 8: Display 7 Segmentos

**Objetivo:** Exibir números 0-9 em display 7 segmentos

**Componentes Necessários:**
- 1x Display 7 segmentos (cátodo comum)
- 7x Resistores 220Ω
- Protoboard e jumpers

**Conceitos:**
- Mapeamento de segmentos
- Arrays e lookup tables
- Lógica combinacional

**Circuito:**
```
Display cátodo comum:
  COM → GND
  Segmentos A-G → Pinos 2-8 (cada um com resistor 220Ω)
```

```cpp
// Pinos dos segmentos (A-G)
const int segmentPins[] = {2, 3, 4, 5, 6, 7, 8};  // A, B, C, D, E, F, G

// Padrões para dígitos 0-9 (cátodo comum: HIGH acende)
const byte digitPatterns[10][7] = {
  {1,1,1,1,1,1,0},  // 0
  {0,1,1,0,0,0,0},  // 1
  {1,1,0,1,1,0,1},  // 2
  {1,1,1,1,0,0,1},  // 3
  {0,1,1,0,0,1,1},  // 4
  {1,0,1,1,0,1,1},  // 5
  {1,0,1,1,1,1,1},  // 6
  {1,1,1,0,0,0,0},  // 7
  {1,1,1,1,1,1,1},  // 8
  {1,1,1,1,0,1,1}   // 9
};

void setup() {
  for (int i = 0; i < 7; i++) {
    pinMode(segmentPins[i], OUTPUT);
  }
}

void displayDigit(int digit) {
  if (digit < 0 || digit > 9) return;
  
  for (int i = 0; i < 7; i++) {
    digitalWrite(segmentPins[i], digitPatterns[digit][i]);
  }
}

void loop() {
  for (int i = 0; i <= 9; i++) {
    displayDigit(i);
    delay(1000);
  }
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar padrões para letras A, b, C, d, E, F
2. 🟡 **Médio:** Usar 4 displays multiplexados para mostrar relógio (minutos:segundos)
3. 🔴 **Difícil:** Criar contador regressivo com botão de start/pause

---

## 🎯 Projeto Final: Semáforo Inteligente

**Objetivo:** Criar semáforo com botão de pedestre e sensor de luminosidade

**Tempo estimado:** 6-8 horas

**Componentes Necessários:**
- 3x LEDs (vermelho, amarelo, verde)
- 1x LED branco (pedestre)
- 1x Botão (pedestre)
- 1x LDR (sensor de luminosidade)
- 1x Resistor 10kΩ (para LDR)
- 4x Resistores 220Ω (para LEDs)
- 1x Resistor 10kΩ (pull-down botão) OU usar INPUT_PULLUP
- Protoboard e jumpers

**Funcionalidades:**
1. Ciclo automático: Verde (5s) → Amarelo (2s) → Vermelho (5s)
2. Botão pedestre: Ao pressionar, após ciclo atual vai para vermelho
3. Modo noturno: Se escuro (LDR), pisca amarelo
4. Serial Monitor: Mostra estado atual

**Conceitos Aplicados:**
- Máquina de estados
- Debounce
- ADC (LDR)
- Múltiplos LEDs
- Lógica temporal com millis()

```cpp
const int RED_PIN = 8;
const int YELLOW_PIN = 9;
const int GREEN_PIN = 10;
const int PEDESTRIAN_LED = 11;
const int BUTTON_PIN = 2;
const int LDR_PIN = A0;

enum State { GREEN, YELLOW, RED, NIGHT_MODE };
State currentState = GREEN;

unsigned long lastStateChange = 0;
bool pedestrianRequest = false;
int lightThreshold = 300;  // Ajustar conforme LDR

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(PEDESTRIAN_LED, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void setTrafficLight(bool red, bool yellow, bool green) {
  digitalWrite(RED_PIN, red);
  digitalWrite(YELLOW_PIN, yellow);
  digitalWrite(GREEN_PIN, green);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  
  // Verificar botão pedestre (com debounce simples)
  if (digitalRead(BUTTON_PIN) == LOW) {
    pedestrianRequest = true;
    delay(200);  // Debounce simples
  }
  
  // Modo noturno se escuro
  if (lightLevel < lightThreshold) {
    currentState = NIGHT_MODE;
    setTrafficLight(false, false, false);
    digitalWrite(YELLOW_PIN, millis() % 1000 < 500);  // Pisca amarelo
    Serial.println("MODO NOTURNO");
    return;
  }
  
  unsigned long now = millis();
  
  switch (currentState) {
    case GREEN:
      setTrafficLight(false, false, true);
      digitalWrite(PEDESTRIAN_LED, LOW);
      Serial.println("VERDE - Veículos podem passar");
      
      if (now - lastStateChange > 5000) {  // 5 segundos
        currentState = YELLOW;
        lastStateChange = now;
      }
      break;
      
    case YELLOW:
      setTrafficLight(false, true, false);
      Serial.println("AMARELO - Atenção");
      
      if (now - lastStateChange > 2000) {  // 2 segundos
        currentState = RED;
        lastStateChange = now;
      }
      break;
      
    case RED:
      setTrafficLight(true, false, false);
      digitalWrite(PEDESTRIAN_LED, HIGH);
      Serial.println("VERMELHO - Pedestres podem atravessar");
      
      if (now - lastStateChange > 5000) {  // 5 segundos
        currentState = GREEN;
        lastStateChange = now;
        pedestrianRequest = false;
      }
      break;
  }
  
  delay(100);
}
```

**Melhorias Opcionais:**
- Adicionar buzzer para pedestre
- Display 7seg mostrando tempo restante
- Modo de emergência (todos vermelhos)
- Sensor ultrassônico para detectar veículos

---

## ⚠️ Problemas Comuns e Soluções

### 1. LED não acende
- ✅ Verificar polaridade (perna longa = ânodo +)
- ✅ Testar LED com bateria 3V
- ✅ Confirmar resistor correto (220Ω)
- ✅ Verificar conexões no protoboard

### 2. Botão não funciona
- ✅ Usar INPUT_PULLUP ao invés de INPUT
- ✅ Verificar se está lendo estado invertido (LOW = pressionado)
- ✅ Implementar debounce
- ✅ Testar com Serial.println(digitalRead(pin))

### 3. Leituras ADC instáveis
- ✅ Adicionar capacitor 100nF entre pino analógico e GND
- ✅ Fazer média de várias leituras
- ✅ Usar referência de tensão estável
- ✅ Evitar cabos longos

### 4. Serial Monitor não mostra nada
- ✅ Verificar baud rate (deve ser 9600 se usou Serial.begin(9600))
- ✅ Não usar pinos 0 e 1 (TX/RX)
- ✅ Fechar Serial Plotter se estiver aberto
- ✅ Verificar cabo USB (alguns são só para carga)

### 5. Código não compila
- ✅ Verificar ponto-e-vírgula no final das linhas
- ✅ Declarar variáveis antes de usar
- ✅ Incluir bibliotecas necessárias (#include)
- ✅ Verificar se placa está selecionada corretamente

### 6. Upload falha
- ✅ Verificar porta COM selecionada
- ✅ Fechar Serial Monitor antes de upload
- ✅ Pressionar reset na placa antes de upload
- ✅ Testar outro cabo USB

### 7. PWM não funciona
- ✅ Usar apenas pinos com ~ (3, 5, 6, 9, 10, 11)
- ✅ Verificar se não está usando pinMode OUTPUT antes
- ✅ Valores devem ser 0-255 (não 0-100)
- ✅ Alguns pinos compartilham timer (6 e 5, 9 e 10)

---

## 🔗 Próximos Passos

**Parabéns!** Você completou o Nível 1 - Básico do Arduino! 🎉

**O que você aprendeu:**
- ✅ Controle de GPIO digital (pinMode, digitalWrite, digitalRead)
- ✅ PWM para controle analógico (analogWrite)
- ✅ Leitura de sensores analógicos (analogRead)
- ✅ Debouncing de botões
- ✅ Comunicação serial (Serial.print)
- ✅ Controle de servos e displays
- ✅ Temporização com delay() e millis()
- ✅ Projeto completo: Semáforo Inteligente

**Próximo nível:**
📘 **[Nível 2 - Intermediário](../nivel-2-intermediario/info-intermediario.md)**
- Interrupts (attachInterrupt)
- I2C (displays OLED, sensores)
- SPI (cartão SD, displays TFT)
- Timers avançados
- EEPROM
- Bibliotecas externas

**Outros recursos:**
- 📖 Conceitos fundamentais: [`../../../../learn/i1-conceitos-fundamentais/`](../../../../learn/i1-conceitos-fundamentais/)
- 🗺️ Roadmap completo: [`../../../../learn/roadmap_geral.md`](../../../../learn/roadmap_geral.md)
- 📚 Referências: [`../../README.md`](../../README.md)

**Voltar:** [`../README.md`](../README.md)
