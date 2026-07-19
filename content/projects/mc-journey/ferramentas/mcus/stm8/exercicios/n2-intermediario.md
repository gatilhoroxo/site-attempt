---
layout: default
title: N2 Intermediario
---


## 📚 NÍVEL 2 - INTERMEDIÁRIO (Semanas 7-10)

### Semana 7-8: UART (Comunicação Serial)

#### Exercício 6: Printf via UART

```c
#include <stdint.h>
#include <stdio.h>

// ========================================
// REGISTRADORES UART
// ========================================
#define UART1_SR   (*(volatile uint8_t *)0x5230)
#define UART1_DR   (*(volatile uint8_t *)0x5231)
#define UART1_BRR1 (*(volatile uint8_t *)0x5232)
#define UART1_BRR2 (*(volatile uint8_t *)0x5233)
#define UART1_CR2  (*(volatile uint8_t *)0x5235)

void uart_init(uint32_t baudrate) {
    // Calcular divisor de baudrate
    // BRR = F_CPU / baudrate
    // 16MHz / 9600 = 1667 (0x0683)
    
    uint16_t brr = 16000000L / baudrate;
    
    UART1_BRR2 = ((brr >> 8) & 0xF0) | (brr & 0x0F);
    UART1_BRR1 = (brr >> 4) & 0xFF;
    
    // Habilitar TX e RX
    UART1_CR2 = 0x0C;  // TEN = 1, REN = 1
}

void uart_putc(char c) {
    // Aguardar buffer vazio (TXE)
    while(!(UART1_SR & 0x80));
    
    UART1_DR = c;
}

void uart_puts(const char *str) {
    while(*str) {
        uart_putc(*str++);
    }
}

// Redirecionar printf para UART
int putchar(int c) {
    uart_putc(c);
    return c;
}

void main(void) {
    uart_init(9600);
    
    printf("STM8 UART Test\n");
    
    uint16_t counter = 0;
    
    while(1) {
        printf("Counter: %u\n", counter++);
        delay_ms(1000);
    }
}
```

---

### Semana 9: I2C (Display OLED)

#### Exercício 7: I2C Master

```c
#include <stdint.h>

// ========================================
// REGISTRADORES I2C
// ========================================
#define I2C_CR1    (*(volatile uint8_t *)0x5210)
#define I2C_CR2    (*(volatile uint8_t *)0x5211)
#define I2C_FREQR  (*(volatile uint8_t *)0x5212)
#define I2C_DR     (*(volatile uint8_t *)0x5216)
#define I2C_SR1    (*(volatile uint8_t *)0x5217)
#define I2C_SR2    (*(volatile uint8_t *)0x5218)
#define I2C_SR3    (*(volatile uint8_t *)0x5219)
#define I2C_CCRL   (*(volatile uint8_t *)0x521B)
#define I2C_CCRH   (*(volatile uint8_t *)0x521C)

void i2c_init(void) {
    // Configurar PB4 e PB5 como open-drain
    PB_DDR |= 0x30;   // PB4, PB5
    PB_ODR |= 0x30;   // HIGH
    PB_CR1 |= 0x30;
    PB_CR2 |= 0x30;
    
    // Clock I2C: 100kHz
    // CCR = F_CPU / (2 * F_I2C)
    I2C_FREQR = 16;   // 16MHz
    I2C_CCRL = 80;    // 16MHz / (2 * 100kHz) = 80
    I2C_CCRH = 0;
    
    // Habilitar I2C
    I2C_CR1 = 0x01;   // PE = 1
}

void i2c_start(void) {
    I2C_CR2 |= 0x01;  // START = 1
    while(!(I2C_SR1 & 0x01));  // Aguardar SB
}

void i2c_stop(void) {
    I2C_CR2 |= 0x02;  // STOP = 1
}

void i2c_write(uint8_t data) {
    I2C_DR = data;
    while(!(I2C_SR1 & 0x80));  // Aguardar TXE
}

void i2c_write_addr(uint8_t addr, uint8_t rw) {
    i2c_write((addr << 1) | rw);
    while(!(I2C_SR1 & 0x02));  // Aguardar ADDR
    (void)I2C_SR3;  // Limpar ADDR
}

// Exemplo: Escrever no display OLED SSD1306
void ssd1306_command(uint8_t cmd) {
    i2c_start();
    i2c_write_addr(0x3C, 0);  // Endereço 0x3C, escrita
    i2c_write(0x00);  // Control byte: comando
    i2c_write(cmd);
    i2c_stop();
}

void main(void) {
    i2c_init();
    
    // Inicializar display
    ssd1306_command(0xAE);  // Display off
    ssd1306_command(0xA8);  // Multiplex
    ssd1306_command(0x3F);  // ...
    // ... mais comandos de inicialização
    ssd1306_command(0xAF);  // Display on
    
    while(1) {
        // Seu código
    }
}
```

---

### 🎯 PROJETO NÍVEL 2: Data Logger com EEPROM

**Descrição:** Sistema que lê sensores e salva dados na EEPROM interna.

**Funcionalidades:**
1. Ler temperatura e umidade (sensor I2C)
2. Salvar na EEPROM a cada minuto
3. Display mostra último valor
4. UART para dump de dados
5. Continua funcionando após reset

```c
// EEPROM no STM8 (1KB a 2KB dependendo do modelo)
#define EEPROM_START 0x4000
#define EEPROM_SIZE  1024

typedef struct {
    uint16_t timestamp;
    int16_t temperature;  // x10 (ex: 235 = 23.5°C)
    uint16_t humidity;    // x10
} log_entry_t;

void eeprom_write_byte(uint16_t addr, uint8_t data) {
    // Desbloquear EEPROM
    FLASH_DUKR = 0xAE;
    FLASH_DUKR = 0x56;
    while(!(FLASH_IAPSR & 0x08));
    
    // Escrever
    *(volatile uint8_t *)addr = data;
    while(!(FLASH_IAPSR & 0x04));
    
    // Bloquear
    FLASH_IAPSR &= ~0x08;
}

void log_save_entry(log_entry_t *entry, uint16_t index) {
    uint16_t addr = EEPROM_START + (index * sizeof(log_entry_t));
    uint8_t *ptr = (uint8_t *)entry;
    
    for(uint8_t i = 0; i < sizeof(log_entry_t); i++) {
        eeprom_write_byte(addr + i, ptr[i]);
    }
}

void main(void) {
    // Inicializações...
    
    uint16_t log_index = 0;
    log_entry_t entry;
    
    while(1) {
        // Ler sensores
        entry.temperature = read_temperature();
        entry.humidity = read_humidity();
        entry.timestamp = millis / 1000;  // Segundos
        
        // Salvar na EEPROM
        log_save_entry(&entry, log_index++);
        
        // Wrap around
        if(log_index >= (EEPROM_SIZE / sizeof(log_entry_t))) {
            log_index = 0;
        }
        
        // Aguardar 1 minuto
        delay_ms(60000);
    }
}
```

---
