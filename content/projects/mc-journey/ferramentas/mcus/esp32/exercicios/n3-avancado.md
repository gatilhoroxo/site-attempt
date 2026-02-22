---
layout: default
title: No computador, na pasta com firmware.bin
---


## 📚 NÍVEL 3 - AVANÇADO (Semanas 11-14)

**Progresso:** [ ] Semana 11 | [ ] Semana 12 | [ ] Semana 13 | [ ] Semana 14 | [ ] Projeto Final

---

## 📑 Índice

### [Semana 11: FreeRTOS Avançado](#semana-11-freertos-avançado)
- [Exercício 13: Tasks e Queues](#exercício-13-tasks-e-queues)
- [Exercício 14: Semaphores e Mutexes](#exercício-14-semaphores-e-mutexes)

### [Semana 12: Dual-Core Programming](#semana-12-dual-core-programming)
- [Exercício 15: Pinned Tasks em Cores Diferentes](#exercício-15-pinned-tasks-em-cores-diferentes)
- [Exercício 16: Comunicação Entre Cores](#exercício-16-comunicação-entre-cores)

### [Semana 13: Bluetooth Low Energy (BLE)](#semana-13-bluetooth-low-energy-ble)
- [Exercício 17: BLE Advertising](#exercício-17-ble-advertising)
- [Exercício 18: BLE GATT Server](#exercício-18-ble-gatt-server)

### [Semana 14: OTA Updates e Power Management](#semana-14-ota-updates-e-power-management)
- [Exercício 19: OTA via HTTP](#exercício-19-ota-via-http)
- [Exercício 20: Deep Sleep e Wake-up](#exercício-20-deep-sleep-e-wake-up)

### [🎯 Projeto Final: Sistema IoT Completo](#-projeto-final-sistema-iot-completo)

### [⚠️ Problemas Comuns e Soluções](#️-problemas-comuns-e-soluções)

### [🔗 Próximos Passos](#-próximos-passos)

---

## Semana 11: FreeRTOS Avançado

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 18-22 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** Multitasking, sincronização, IPC, prioridades
- ✅ **Checklist:** [ ] Exercício 13 | [ ] Exercício 14

### 📖 Fundamentos - FreeRTOS Avançado

**O que é FreeRTOS?**
- Sistema operacional em tempo real (RTOS)
- Permite executar múltiplas tarefas "simultaneamente"
- Scheduler gerencia prioridades e tempo de CPU
- Essencial para projetos complexos

**Conceitos Principais:**

**Tasks (Tarefas):**
- Funções que rodam independentemente
- Cada task tem sua própria pilha (stack)
- Prioridades: 0 (menor) a 25 (maior) - quanto maior, mais prioritária
- Estados: Running, Ready, Blocked, Suspended

**Queues (Filas):**
- Comunicação entre tasks
- FIFO (First In, First Out)
- Thread-safe (seguro para múltiplas tasks)
- Bloqueia sender se cheia, bloqueia receiver se vazia

**Semaphores:**
- **Binary:** Sinalização (0 ou 1) - como um flag melhor
- **Counting:** Contador (0 a N) - para recursos limitados
- **Mutex:** Mutual Exclusion - protege recursos compartilhados

**Diferença Semaphore vs Mutex:**
- Semaphore: Sinalização entre tasks
- Mutex: Proteção de recursos (com priority inheritance)

**APIs Principais:**
```c
// Tasks
xTaskCreate()              // Cria task
xTaskCreatePinnedToCore()  // Cria task em core específico
vTaskDelay()              // Delay não-bloqueante
vTaskDelete()             // Deleta task

// Queues
xQueueCreate()            // Cria fila
xQueueSend()              // Envia para fila
xQueueReceive()           // Recebe da fila

// Semaphores
xSemaphoreCreateBinary()  // Cria semáforo binário
xSemaphoreCreateMutex()   // Cria mutex
xSemaphoreGive()          // Libera semáforo
xSemaphoreTake()          // Pega semáforo
```

---

### Exercício 13: Tasks e Queues

**Objetivo:** Criar múltiplas tasks que se comunicam via queues

**Componentes Necessários:**
- 2x LEDs (ou use GPIO_NUM_2 e GPIO_NUM_4)
- 1x Botão (GPIO_NUM_0)
- 2x Resistores 220Ω (para LEDs)
- Jumpers

**Conceitos:**
- Criação de múltiplas tasks
- Comunicação via queues
- Prioridades de tasks
- Bloqueio em queues

```c
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"

#define LED1_PIN GPIO_NUM_2
#define LED2_PIN GPIO_NUM_4
#define BUTTON_PIN GPIO_NUM_0

QueueHandle_t command_queue;

typedef struct {
    uint8_t led_id;
    bool state;
} led_command_t;

void button_task(void *pvParameters)
{
    gpio_set_direction(BUTTON_PIN, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_PIN, GPIO_PULLUP_ONLY);
    
    led_command_t cmd;
    bool led1_state = false;
    
    while(1) {
        if(gpio_get_level(BUTTON_PIN) == 0) {  // Botão pressionado
            led1_state = !led1_state;
            cmd.led_id = 1;
            cmd.state = led1_state;
            
            // Envia comando para fila
            xQueueSend(command_queue, &cmd, portMAX_DELAY);
            
            vTaskDelay(300 / portTICK_PERIOD_MS);  // Debounce
        }
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}

void led_controller_task(void *pvParameters)
{
    gpio_set_direction(LED1_PIN, GPIO_MODE_OUTPUT);
    gpio_set_direction(LED2_PIN, GPIO_MODE_OUTPUT);
    
    led_command_t cmd;
    
    while(1) {
        // Aguarda comando na fila (bloqueia até receber)
        if(xQueueReceive(command_queue, &cmd, portMAX_DELAY) == pdTRUE) {
            if(cmd.led_id == 1) {
                gpio_set_level(LED1_PIN, cmd.state);
                printf("LED1: %s\n", cmd.state ? "ON" : "OFF");
            } else if(cmd.led_id == 2) {
                gpio_set_level(LED2_PIN, cmd.state);
                printf("LED2: %s\n", cmd.state ? "ON" : "OFF");
            }
        }
    }
}

void blink_task(void *pvParameters)
{
    led_command_t cmd;
    bool state = false;
    
    while(1) {
        state = !state;
        cmd.led_id = 2;
        cmd.state = state;
        
        xQueueSend(command_queue, &cmd, 0);  // Não bloqueia se fila cheia
        
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

void app_main(void)
{
    // Criar fila com capacidade para 10 comandos
    command_queue = xQueueCreate(10, sizeof(led_command_t));
    
    // Criar tasks com diferentes prioridades
    xTaskCreate(button_task, "button", 2048, NULL, 5, NULL);
    xTaskCreate(led_controller_task, "led_ctrl", 2048, NULL, 10, NULL);  // Maior prioridade
    xTaskCreate(blink_task, "blink", 2048, NULL, 3, NULL);
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar task de monitoramento que imprime estatísticas da fila
2. 🟡 **Médio:** Implementar sistema de prioridade de comandos usando múltiplas filas
3. 🔴 **Difícil:** Criar watchdog que reinicia tasks travadas

---

### Exercício 14: Semaphores e Mutexes

**Objetivo:** Proteger recursos compartilhados entre tasks

**Componentes Necessários:**
- Apenas ESP32 (sem hardware externo)

**Conceitos:**
- Mutexes para proteção de recursos
- Semaphores binários para sincronização
- Race conditions e como evitar
- Priority inversion

```c
#include "freertos/semphr.h"

SemaphoreHandle_t uart_mutex;
SemaphoreHandle_t sync_semaphore;

int shared_counter = 0;  // Recurso compartilhado

void producer_task(void *pvParameters)
{
    while(1) {
        // Simula produção de dados
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        
        // Protege acesso ao recurso compartilhado
        if(xSemaphoreTake(uart_mutex, portMAX_DELAY) == pdTRUE) {
            shared_counter++;
            printf("[Producer] Counter: %d\n", shared_counter);
            xSemaphoreGive(uart_mutex);
        }
        
        // Sinaliza que dado está pronto
        xSemaphoreGive(sync_semaphore);
    }
}

void consumer_task(void *pvParameters)
{
    while(1) {
        // Aguarda sinal de dado pronto
        if(xSemaphoreTake(sync_semaphore, portMAX_DELAY) == pdTRUE) {
            
            // Protege acesso ao recurso compartilhado
            if(xSemaphoreTake(uart_mutex, portMAX_DELAY) == pdTRUE) {
                printf("[Consumer] Processing counter: %d\n", shared_counter);
                xSemaphoreGive(uart_mutex);
            }
        }
    }
}

void stats_task(void *pvParameters)
{
    while(1) {
        vTaskDelay(5000 / portTICK_PERIOD_MS);
        
        if(xSemaphoreTake(uart_mutex, portMAX_DELAY) == pdTRUE) {
            printf("\n=== Stats ===\n");
            printf("Counter: %d\n", shared_counter);
            printf("Free heap: %d bytes\n", esp_get_free_heap_size());
            printf("=============\n\n");
            xSemaphoreGive(uart_mutex);
        }
    }
}

void app_main(void)
{
    // Criar mutex para proteger printf (UART)
    uart_mutex = xSemaphoreCreateMutex();
    
    // Criar semáforo binário para sincronização
    sync_semaphore = xSemaphoreCreateBinary();
    
    xTaskCreate(producer_task, "producer", 2048, NULL, 5, NULL);
    xTaskCreate(consumer_task, "consumer", 2048, NULL, 5, NULL);
    xTaskCreate(stats_task, "stats", 2048, NULL, 3, NULL);
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar counting semaphore para limitar recursos
2. 🟡 **Médio:** Implementar padrão producer-consumer com buffer circular
3. 🔴 **Difícil:** Detectar e resolver deadlock automaticamente

---

## Semana 12: Dual-Core Programming

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 16-20 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** Multicore, task affinity, load balancing
- ✅ **Checklist:** [ ] Exercício 15 | [ ] Exercício 16

### 📖 Fundamentos - Dual-Core no ESP32

**Arquitetura Dual-Core:**
- ESP32 tem 2 cores Xtensa LX6 (PRO_CPU e APP_CPU)
- Core 0 (PRO_CPU): Protocolo - WiFi, Bluetooth
- Core 1 (APP_CPU): Aplicação - código do usuário
- Rodam a até 240MHz cada

**Vantagens:**
- Paralelismo real (não apenas concorrência)
- Separação de tarefas críticas
- Melhor performance em aplicações complexas
- WiFi/BLE rodando em core separado

**Task Pinning:**
- Por padrão, tasks podem migrar entre cores
- `xTaskCreatePinnedToCore()` fixa task em core específico
- Core 0: Deixar para WiFi/BLE quando possível
- Core 1: Processamento pesado

**Sincronização Entre Cores:**
- Mesmos mecanismos: queues, semaphores, mutexes
- Hardware garante sincronização
- Cache coherency automático (na maioria dos casos)

**Cuidados:**
- IRAM é compartilhado (atenção com ISR)
- Evitar contenção de recursos
- Mutex pode causar espera entre cores

**APIs Principais:**
```c
xTaskCreatePinnedToCore()   // Cria task fixada em core
xPortGetCoreID()            // Retorna ID do core atual (0 ou 1)
esp_cpu_get_core_id()       // Alternativa para pegar core ID
```

---

### Exercício 15: Pinned Tasks em Cores Diferentes

**Objetivo:** Executar tasks em cores específicos para otimização

**Componentes Necessários:**
- 2x LEDs (GPIO_NUM_2 e GPIO_NUM_4)
- 2x Resistores 220Ω
- Jumpers

**Conceitos:**
- Task affinity (pinning)
- Identificação de core
- Load balancing manual
- Medição de performance

```c
#include "esp_system.h"

#define LED_CORE0 GPIO_NUM_2
#define LED_CORE1 GPIO_NUM_4

void intensive_task_core0(void *pvParameters)
{
    gpio_set_direction(LED_CORE0, GPIO_MODE_OUTPUT);
    
    while(1) {
        // Simula processamento pesado
        uint32_t sum = 0;
        for(int i = 0; i < 1000000; i++) {
            sum += i;
        }
        
        // Blink LED
        gpio_set_level(LED_CORE0, 1);
        vTaskDelay(100 / portTICK_PERIOD_MS);
        gpio_set_level(LED_CORE0, 0);
        vTaskDelay(100 / portTICK_PERIOD_MS);
        
        printf("[Core %d] Task 0 - Sum: %u\n", xPortGetCoreID(), sum);
    }
}

void intensive_task_core1(void *pvParameters)
{
    gpio_set_direction(LED_CORE1, GPIO_MODE_OUTPUT);
    
    while(1) {
        // Processamento diferente
        float result = 0;
        for(int i = 1; i < 10000; i++) {
            result += 1.0 / i;
        }
        
        gpio_set_level(LED_CORE1, 1);
        vTaskDelay(150 / portTICK_PERIOD_MS);
        gpio_set_level(LED_CORE1, 0);
        vTaskDelay(150 / portTICK_PERIOD_MS);
        
        printf("[Core %d] Task 1 - Result: %.4f\n", xPortGetCoreID(), result);
    }
}

void monitor_task(void *pvParameters)
{
    while(1) {
        vTaskDelay(5000 / portTICK_PERIOD_MS);
        
        printf("\n=== System Stats ===\n");
        printf("Free heap: %d bytes\n", esp_get_free_heap_size());
        printf("Min free heap: %d bytes\n", esp_get_minimum_free_heap_size());
        printf("Running on core: %d\n", xPortGetCoreID());
        printf("===================\n\n");
    }
}

void app_main(void)
{
    // Task pesada no Core 0
    xTaskCreatePinnedToCore(
        intensive_task_core0,
        "task_core0",
        4096,
        NULL,
        5,
        NULL,
        0  // Core 0
    );
    
    // Task pesada no Core 1
    xTaskCreatePinnedToCore(
        intensive_task_core1,
        "task_core1",
        4096,
        NULL,
        5,
        NULL,
        1  // Core 1
    );
    
    // Monitor pode rodar em qualquer core
    xTaskCreate(monitor_task, "monitor", 2048, NULL, 3, NULL);
}
```

**Desafios:**
1. 🟢 **Fácil:** Medir tempo de execução de cada task com `esp_timer_get_time()`
2. 🟡 **Médio:** Implementar load balancing dinâmico entre cores
3. 🔴 **Difícil:** Criar benchmark comparando single-core vs dual-core

---

### Exercício 16: Comunicação Entre Cores

**Objetivo:** Sincronizar processamento entre os dois cores

**Componentes Necessários:**
- Display OLED I2C (opcional, mas recomendado)
- Jumpers

**Conceitos:**
- Queues entre cores
- Sincronização cross-core
- Pipeline de processamento
- Cache coherency

```c
#include "freertos/queue.h"

QueueHandle_t core0_to_core1_queue;
QueueHandle_t core1_to_core0_queue;

typedef struct {
    uint32_t data;
    uint32_t timestamp;
} data_packet_t;

void data_producer_core0(void *pvParameters)
{
    data_packet_t packet;
    uint32_t counter = 0;
    
    while(1) {
        // Core 0: Coleta dados
        packet.data = counter++;
        packet.timestamp = esp_timer_get_time() / 1000;  // ms
        
        printf("[Core %d] Producing: %u\n", xPortGetCoreID(), packet.data);
        
        // Envia para Core 1 processar
        xQueueSend(core0_to_core1_queue, &packet, portMAX_DELAY);
        
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void data_processor_core1(void *pvParameters)
{
    data_packet_t input, output;
    
    while(1) {
        // Core 1: Aguarda dados do Core 0
        if(xQueueReceive(core0_to_core1_queue, &input, portMAX_DELAY) == pdTRUE) {
            
            printf("[Core %d] Processing: %u\n", xPortGetCoreID(), input.data);
            
            // Processamento pesado
            uint32_t result = input.data * input.data;
            
            // Simula processamento
            vTaskDelay(200 / portTICK_PERIOD_MS);
            
            // Prepara resposta
            output.data = result;
            output.timestamp = esp_timer_get_time() / 1000;
            
            // Envia resultado de volta para Core 0
            xQueueSend(core1_to_core0_queue, &output, portMAX_DELAY);
        }
    }
}

void result_handler_core0(void *pvParameters)
{
    data_packet_t result;
    
    while(1) {
        // Core 0: Recebe resultados processados
        if(xQueueReceive(core1_to_core0_queue, &result, portMAX_DELAY) == pdTRUE) {
            
            uint32_t latency = (esp_timer_get_time() / 1000) - result.timestamp;
            
            printf("[Core %d] Result: %u (latency: %u ms)\n", 
                   xPortGetCoreID(), result.data, latency);
        }
    }
}

void app_main(void)
{
    // Criar filas de comunicação entre cores
    core0_to_core1_queue = xQueueCreate(5, sizeof(data_packet_t));
    core1_to_core0_queue = xQueueCreate(5, sizeof(data_packet_t));
    
    // Producer e Result Handler no Core 0
    xTaskCreatePinnedToCore(data_producer_core0, "producer", 2048, NULL, 5, NULL, 0);
    xTaskCreatePinnedToCore(result_handler_core0, "result", 2048, NULL, 5, NULL, 0);
    
    // Processor no Core 1
    xTaskCreatePinnedToCore(data_processor_core1, "processor", 2048, NULL, 5, NULL, 1);
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar estatísticas de throughput (itens/segundo)
2. 🟡 **Médio:** Implementar pipeline de 3 estágios alternando entre cores
3. 🔴 **Difícil:** Criar sistema de trabalho distribuído com balanceamento automático

---

## Semana 13: Bluetooth Low Energy (BLE)

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 18-22 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐⭐ Muito Avançado
- 🎯 **Habilidades desenvolvidas:** BLE, GATT, advertising, características
- ✅ **Checklist:** [ ] Exercício 17 | [ ] Exercício 18

### 📖 Fundamentos - Bluetooth Low Energy

**O que é BLE?**
- Bluetooth de baixa energia (versão 4.0+)
- Consumo muito menor que Bluetooth Clássico
- Ideal para IoT, wearables, sensores
- Range: ~10-100m

**Conceitos BLE:**

**GAP (Generic Access Profile):**
- **Advertising:** Dispositivo anuncia sua presença
- **Scanning:** Procura por dispositivos
- **Central:** Inicia conexão (ex: smartphone)
- **Peripheral:** Aceita conexão (ex: ESP32)

**GATT (Generic Attribute Profile):**
- **Service:** Grupo de características relacionadas
- **Characteristic:** Dado individual (leitura/escrita/notificação)
- **Descriptor:** Metadados da característica
- **UUID:** Identificador único (16-bit ou 128-bit)

**Exemplo de Estrutura:**
```
Device (ESP32 Sensor)
└── Service: Environmental Sensing (UUID: 0x181A)
    ├── Characteristic: Temperature (UUID: 0x2A6E)
    │   └── Descriptor: Unit (Celsius)
    └── Characteristic: Humidity (UUID: 0x2A6F)
        └── Descriptor: Unit (%)
```

**Modos de Operação:**
- **Read:** Cliente lê valor
- **Write:** Cliente escreve valor
- **Notify:** Servidor envia notificações automáticas
- **Indicate:** Notify com confirmação

**APIs Principais:**
```c
esp_ble_gap_config_adv_data()      // Configura advertising
esp_ble_gatts_create_service()     // Cria serviço GATT
esp_ble_gatts_add_char()           // Adiciona característica
esp_ble_gatts_send_indicate()      // Envia notificação
```

---

### Exercício 17: BLE Advertising

**Objetivo:** Criar beacon BLE que anuncia dados

**Componentes Necessários:**
- ESP32
- Smartphone com app BLE (nRF Connect, LightBlue)

**Conceitos:**
- Advertising packets
- Scan response
- Beacons
- Broadcast mode

```c
#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_main.h"
#include "nvs_flash.h"

#define DEVICE_NAME "ESP32-Beacon"

static uint8_t adv_data[] = {
    0x02, 0x01, 0x06,  // Flags
    0x0A, 0x09, 'E', 'S', 'P', '3', '2', '-', 'I', 'o', 'T'  // Name
};

static esp_ble_adv_params_t adv_params = {
    .adv_int_min = 0x20,
    .adv_int_max = 0x40,
    .adv_type = ADV_TYPE_IND,
    .own_addr_type = BLE_ADDR_TYPE_PUBLIC,
    .channel_map = ADV_CHNL_ALL,
    .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY,
};

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    switch (event) {
        case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
            printf("Advertising data set, starting advertising\n");
            esp_ble_gap_start_advertising(&adv_params);
            break;
            
        case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
            if (param->adv_start_cmpl.status == ESP_BT_STATUS_SUCCESS) {
                printf("Advertising started successfully\n");
            }
            break;
            
        default:
            break;
    }
}

void app_main(void)
{
    // Inicializar NVS
    nvs_flash_init();
    
    // Inicializar Bluetooth
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_bt_controller_init(&bt_cfg);
    esp_bt_controller_enable(ESP_BT_MODE_BLE);
    
    esp_bluedroid_init();
    esp_bluedroid_enable();
    
    // Registrar callback GAP
    esp_ble_gap_register_callback(gap_event_handler);
    
    // Configurar advertising data
    esp_ble_gap_config_adv_data_raw(adv_data, sizeof(adv_data));
    
    printf("BLE Beacon iniciado. Procure por 'ESP32-IoT' no seu smartphone.\n");
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar temperatura no advertising packet
2. 🟡 **Médio:** Implementar iBeacon compatível com iOS
3. 🔴 **Difícil:** Criar Eddystone beacon com URL

---

### Exercício 18: BLE GATT Server

**Objetivo:** Criar servidor GATT com controle de LED via BLE

**Componentes Necessários:**
- 1x LED (GPIO_NUM_2)
- 1x Resistor 220Ω
- Smartphone com app BLE
- Jumpers

**Conceitos:**
- GATT server
- Services e characteristics
- Read/Write operations
- Notifications

```c
#include "esp_gatts_api.h"

#define GATTS_SERVICE_UUID   0x00FF
#define GATTS_CHAR_UUID_LED  0xFF01
#define LED_PIN GPIO_NUM_2

static uint16_t led_handle_table[4];
static uint8_t led_state = 0;

// Profile
struct gatts_profile_inst {
    esp_gatts_cb_t gatts_cb;
    uint16_t gatts_if;
    uint16_t app_id;
    uint16_t conn_id;
    uint16_t service_handle;
    esp_gatt_srvc_id_t service_id;
    uint16_t char_handle;
    esp_bt_uuid_t char_uuid;
};

static void gatts_profile_event_handler(esp_gatts_cb_event_t event,
                                        esp_gatt_if_t gatts_if,
                                        esp_ble_gatts_cb_param_t *param)
{
    switch (event) {
        case ESP_GATTS_REG_EVT:
            printf("GATT server registered\n");
            
            // Configurar advertising
            esp_ble_gap_set_device_name(DEVICE_NAME);
            esp_ble_gap_config_adv_data(&adv_data);
            
            // Criar serviço
            esp_ble_gatts_create_service(gatts_if, &service_id, 4);
            break;
            
        case ESP_GATTS_CREATE_EVT:
            printf("Service created\n");
            esp_ble_gatts_start_service(param->create.service_handle);
            
            // Adicionar característica LED
            esp_ble_gatts_add_char(param->create.service_handle,
                                   &char_uuid,
                                   ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
                                   ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_WRITE | ESP_GATT_CHAR_PROP_BIT_NOTIFY,
                                   &char_val, NULL);
            break;
            
        case ESP_GATTS_WRITE_EVT:
            printf("GATT write event\n");
            
            if (param->write.handle == led_handle_table[2]) {
                // Atualizar estado do LED
                led_state = param->write.value[0];
                gpio_set_level(LED_PIN, led_state);
                
                printf("LED %s via BLE\n", led_state ? "ON" : "OFF");
            }
            break;
            
        case ESP_GATTS_READ_EVT:
            printf("GATT read event\n");
            
            esp_gatt_rsp_t rsp;
            memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
            rsp.attr_value.handle = param->read.handle;
            rsp.attr_value.len = 1;
            rsp.attr_value.value[0] = led_state;
            
            esp_ble_gatts_send_response(gatts_if, param->read.conn_id,
                                       param->read.trans_id,
                                       ESP_GATT_OK, &rsp);
            break;
            
        default:
            break;
    }
}

void app_main(void)
{
    // Setup GPIO
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);
    
    // Inicializar BLE (similar ao exercício anterior)
    nvs_flash_init();
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_bt_controller_init(&bt_cfg);
    esp_bt_controller_enable(ESP_BT_MODE_BLE);
    
    esp_bluedroid_init();
    esp_bluedroid_enable();
    
    // Registrar profile GATT
    esp_ble_gatts_register_callback(gatts_profile_event_handler);
    esp_ble_gatts_app_register(0);
    
    printf("BLE GATT Server iniciado\n");
    printf("Conecte via smartphone e controle o LED\n");
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar característica para ler temperatura
2. 🟡 **Médio:** Implementar notificações automáticas a cada segundo
3. 🔴 **Difícil:** Criar serviço completo de automação residencial (múltiplos dispositivos)

---

## Semana 14: OTA Updates e Power Management

**📊 Metadados:**
- ⏱️ **Tempo estimado:** 16-20 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐ Avançado
- 🎯 **Habilidades desenvolvidas:** OTA, partições, deep sleep, RTC
- ✅ **Checklist:** [ ] Exercício 19 | [ ] Exercício 20

### 📖 Fundamentos - OTA e Power Management

**OTA (Over-The-Air) Updates:**
- Atualizar firmware remotamente
- Via WiFi, sem cabo USB
- Essencial para dispositivos em produção
- Requer partições OTA na flash

**Partições OTA:**
```
Factory (boot inicial)
OTA_0 (versão A do firmware)
OTA_1 (versão B do firmware)
```
- Sistema alterna entre OTA_0 e OTA_1
- Rollback automático se falhar

**Deep Sleep:**
- Consumo ~10µA (vs ~80mA ativo)
- Desliga CPU, RAM, WiFi, Bluetooth
- Mantém RTC (Real Time Clock)
- Wake-up por: timer, GPIO, touch, ULP

**Light Sleep:**
- Consumo intermediário (~0.8mA)
- CPU pausada, WiFi off
- Mais rápido para acordar
- Mantém conexão WiFi (em modo especial)

**APIs Principais:**
```c
// OTA
esp_https_ota()                  // OTA via HTTPS
esp_ota_begin()                  // Inicia OTA manual
esp_ota_write()                  // Escreve firmware
esp_ota_end()                    // Finaliza OTA

// Sleep
esp_sleep_enable_timer_wakeup()  // Wake por timer
esp_sleep_enable_ext0_wakeup()   // Wake por GPIO
esp_deep_sleep_start()           // Entra em deep sleep
esp_light_sleep_start()          // Entra em light sleep
```

---

### Exercício 19: OTA via HTTP

**Objetivo:** Atualizar firmware remotamente via servidor web

**Componentes Necessários:**
- ESP32
- Rede WiFi
- Servidor HTTP (pode usar Python SimpleHTTPServer)

**Conceitos:**
- Partições OTA
- Download de firmware
- Validação e instalação
- Rollback em caso de falha

```c
#include "esp_https_ota.h"
#include "esp_ota_ops.h"
#include "esp_wifi.h"
#include "esp_http_client.h"

#define WIFI_SSID "SeuWiFi"
#define WIFI_PASS "SuaSenha"
#define FIRMWARE_URL "http://192.168.1.100:8000/firmware.bin"

void print_ota_info(void)
{
    const esp_partition_t *running = esp_ota_get_running_partition();
    esp_ota_img_states_t ota_state;
    
    printf("\n=== OTA Info ===\n");
    printf("Running partition: %s\n", running->label);
    printf("Partition address: 0x%x\n", running->address);
    
    if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK) {
        printf("OTA state: %d\n", ota_state);
    }
    
    printf("App version: %s\n", esp_app_get_description()->version);
    printf("================\n\n");
}

void ota_task(void *pvParameters)
{
    printf("Starting OTA update from: %s\n", FIRMWARE_URL);
    
    esp_http_client_config_t config = {
        .url = FIRMWARE_URL,
        .timeout_ms = 5000,
    };
    
    esp_err_t ret = esp_https_ota(&config);
    
    if (ret == ESP_OK) {
        printf("OTA update successful! Rebooting...\n");
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        esp_restart();
    } else {
        printf("OTA update failed: %s\n", esp_err_to_name(ret));
    }
    
    vTaskDelete(NULL);
}

void check_ota_button(void)
{
    gpio_set_direction(GPIO_NUM_0, GPIO_MODE_INPUT);
    gpio_set_pull_mode(GPIO_NUM_0, GPIO_PULLUP_ONLY);
    
    if (gpio_get_level(GPIO_NUM_0) == 0) {
        printf("OTA button pressed! Starting update...\n");
        xTaskCreate(ota_task, "ota_task", 8192, NULL, 5, NULL);
    }
}

void app_main(void)
{
    nvs_flash_init();
    
    // Mostrar informações da partição atual
    print_ota_info();
    
    // Conectar WiFi (código similar aos exercícios anteriores)
    wifi_init_sta();
    
    printf("\nPress BOOT button to start OTA update\n");
    
    while(1) {
        check_ota_button();
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}
```

**Preparar servidor HTTP local:**
```bash
# No computador, na pasta com firmware.bin
python3 -m http.server 8000
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar verificação de versão antes de atualizar
2. 🟡 **Médio:** Implementar rollback automático se firmware falhar
3. 🔴 **Difícil:** Criar sistema de atualização segura com assinatura digital

---

### Exercício 20: Deep Sleep e Wake-up

**Objetivo:** Reduzir consumo de energia com deep sleep

**Componentes Necessários:**
- 1x LED (GPIO_NUM_2)
- 1x Botão (GPIO_NUM_33 para wake-up externo)
- 2x Resistores (220Ω e 10kΩ)
- Multímetro (para medir consumo)
- Jumpers

**Conceitos:**
- Deep sleep modes
- RTC memory
- Wake-up sources
- Otimização de energia

```c
#include "esp_sleep.h"
#include "driver/rtc_io.h"

#define LED_PIN GPIO_NUM_2
#define WAKEUP_PIN GPIO_NUM_33
#define SLEEP_TIME_US (10 * 1000000)  // 10 segundos

RTC_DATA_ATTR int boot_count = 0;  // Mantém valor em deep sleep

void print_wakeup_reason(void)
{
    esp_sleep_wakeup_cause_t wakeup_reason;
    wakeup_reason = esp_sleep_get_wakeup_cause();
    
    switch(wakeup_reason) {
        case ESP_SLEEP_WAKEUP_EXT0:
            printf("Wake-up por botão externo\n");
            break;
        case ESP_SLEEP_WAKEUP_TIMER:
            printf("Wake-up por timer\n");
            break;
        case ESP_SLEEP_WAKEUP_UNDEFINED:
        default:
            printf("Primeiro boot\n");
            break;
    }
}

void blink_led(int times)
{
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);
    
    for(int i = 0; i < times; i++) {
        gpio_set_level(LED_PIN, 1);
        vTaskDelay(200 / portTICK_PERIOD_MS);
        gpio_set_level(LED_PIN, 0);
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}

void app_main(void)
{
    boot_count++;
    
    printf("\n=== Boot #%d ===\n", boot_count);
    printf("Free heap: %d bytes\n", esp_get_free_heap_size());
    
    print_wakeup_reason();
    
    // Pisca LED (número de vezes = boot_count)
    blink_led(boot_count);
    
    // Configurar wake-up por timer (10 segundos)
    esp_sleep_enable_timer_wakeup(SLEEP_TIME_US);
    printf("Timer wake-up configurado para %d segundos\n", SLEEP_TIME_US / 1000000);
    
    // Configurar wake-up por botão externo (GPIO_NUM_33)
    esp_sleep_enable_ext0_wakeup(WAKEUP_PIN, 0);  // Wake quando LOW
    printf("External wake-up configurado no GPIO %d\n", WAKEUP_PIN);
    
    // Desabilitar power domains desnecessários
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_SLOW_MEM, ESP_PD_OPTION_OFF);
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_FAST_MEM, ESP_PD_OPTION_OFF);
    
    printf("Entrando em deep sleep em 5 segundos...\n");
    printf("Pressione o botão ou aguarde 10s para acordar.\n\n");
    
    vTaskDelay(5000 / portTICK_PERIOD_MS);
    
    // Entrar em deep sleep
    esp_deep_sleep_start();
}
```

**Desafios:**
1. 🟢 **Fácil:** Adicionar wake-up por toque (touch sensor)
2. 🟡 **Médio:** Implementar sensor de movimento que acorda ESP32
3. 🔴 **Difícil:** Criar logger de dados que acorda periodicamente, lê sensor, salva em RTC memory e volta a dormir (durar 1 semana com bateria)

---

## 🎯 Projeto Final: Sistema IoT Completo

**📊 Metadados do Projeto:**
- ⏱️ **Tempo estimado:** 30-40 horas
- 📊 **Dificuldade:** ⭐⭐⭐⭐⭐ Muito Avançado
- 🎯 **Habilidades integradas:** FreeRTOS, dual-core, WiFi, BLE, OTA, deep sleep, I2C, HTTP

**Descrição:**
Sistema IoT completo de monitoramento ambiental com conectividade dual (WiFi + BLE), atualizável remotamente (OTA) e com gestão inteligente de energia.

**Componentes Necessários:**
- 1x Sensor BME280 (temperatura, umidade, pressão) I2C
- 1x Display OLED 128x64 SSD1306 I2C
- 2x LEDs (status: verde e vermelho)
- 1x Botão (wake-up / configuração)
- 3x Resistores 220Ω
- 1x Resistor 10kΩ
- Fonte de alimentação / bateria
- Jumpers

**Funcionalidades Obrigatórias:**

**1. Monitoramento Multi-Sensor:**
- ✅ Leitura contínua de temperatura, umidade e pressão
- ✅ Display OLED mostra dados em tempo real
- ✅ Histórico das últimas 50 leituras em RTC memory

**2. Conectividade Dual:**
- ✅ **WiFi:** Servidor HTTP com dashboard web
- ✅ **BLE:** GATT server para app mobile
- ✅ Ambos funcionando simultaneamente
- ✅ API REST JSON para integração

**3. Sistema Multi-Core:**
- ✅ **Core 0:** WiFi, BLE, comunicações
- ✅ **Core 1:** Leitura de sensores, display, processamento
- ✅ Queues para comunicação entre cores

**4. Gestão de Energia:**
- ✅ Deep sleep quando inativo (> 5min sem conexão)
- ✅ Wake-up por botão ou timer (1h)
- ✅ Indicador LED de modo (ativo/sleep)
- ✅ Medição e log de consumo

**5. OTA Updates:**
- ✅ Atualização via WiFi (HTTP)
- ✅ Verificação de versão automática
- ✅ Rollback em caso de falha
- ✅ Indicador visual de progresso

**Arquitetura de Tasks:**
```
Core 0:
├── wifi_task (prioridade 6)
├── ble_task (prioridade 6)
├── http_server_task (prioridade 5)
└── ota_monitor_task (prioridade 3)

Core 1:
├── sensor_read_task (prioridade 10)
├── display_update_task (prioridade 8)
├── data_logger_task (prioridade 7)
└── power_manager_task (prioridade 4)

Queues:
- sensor_data_queue (Core1 → Core0)
- command_queue (Core0 → Core1)
- log_queue (qualquer → logger)
```

**Critérios de Avaliação:**
- [ ] Todos sensores lendo corretamente
- [ ] Display atualiza em tempo real (< 1s latência)
- [ ] WiFi e BLE operando simultaneamente
- [ ] Dashboard web funcional e responsivo
- [ ] BLE acessível via smartphone
- [ ] OTA funciona sem travar sistema
- [ ] Deep sleep reduz consumo para < 100µA
- [ ] Sistema roda estável por > 24h
- [ ] Código bem organizado com documentação
- [ ] Logging adequado para debug

**Extensões Opcionais (🌟 Desafios Extras):**
1. 🟡 Adicionar MQTT para integração com Home Assistant
2. 🟡 Implementar previsão de bateria e alertas
3. 🔴 Criar app mobile Flutter/React Native
4. 🔴 Adicionar criptografia TLS para comunicações
5. 🔴 Implementar mesh network com múltiplos ESP32

---

## ⚠️ Problemas Comuns e Soluções

### Task trava ou watchdog timeout
**Sintoma:** "Task watchdog got triggered" no serial

**Soluções:**
- ✅ Adicionar `vTaskDelay()` em loops infinitos
- ✅ Aumentar watchdog timeout em `sdkconfig`
- ✅ Dividir processamento pesado em chunks
- ✅ Usar `taskYIELD()` para ceder CPU voluntariamente

### Heap overflow / Stack corruption
**Sintoma:** Crash aleatório, "Guru Meditation Error"

**Soluções:**
- ✅ Aumentar stack size em `xTaskCreate()` (mínimo 2048)
- ✅ Não alocar grandes buffers na stack (usar heap)
- ✅ Verificar uso com `uxTaskGetStackHighWaterMark()`
- ✅ Monitorar heap livre com `esp_get_free_heap_size()`

### Priority inversion
**Sintoma:** Task de alta prioridade não executa

**Soluções:**
- ✅ Usar mutex ao invés de semaphore para recursos compartilhados
- ✅ Mutex tem priority inheritance automático
- ✅ Evitar compartilhar recursos entre prioridades muito diferentes
- ✅ Considerar usar critical sections `taskENTER_CRITICAL()`

### BLE não conecta ou desconecta
**Sintoma:** Pareamento falha ou conexão cai

**Soluções:**
- ✅ Verificar que NVS foi inicializado
- ✅ Advertising interval adequado (100-1000ms)
- ✅ Não usar WiFi e BLE com alta carga simultânea (compartilham antena)
- ✅ Aumentar connection interval em GATT
- ✅ Verificar MTU size (máximo 512 bytes)

### OTA falha ou ESP32 não boota após update
**Sintoma:** Loop de reboot ou firmware inválido

**Soluções:**
- ✅ Verificar partições OTA em `partitions.csv`
- ✅ Firmware deve ser compilado para partition scheme correto
- ✅ Validar checksum antes de `esp_ota_end()`
- ✅ Testar rollback: `esp_ota_mark_app_invalid_rollback_and_reboot()`
- ✅ Não fazer OTA com WiFi instável

### Deep sleep não acorda ou consumo alto
**Sintoma:** ESP32 não acorda ou bateria drena rápido

**Soluções:**
- ✅ Verificar se wake-up source foi configurado
- ✅ GPIOs devem estar em RTC domain para ext wake-up
- ✅ Desabilitar power domains desnecessários
- ✅ LED pode estar consumindo (usar transistor com controle)
- ✅ Verificar corrente de quiescent do regulador de tensão

### Dual-core causa race condition
**Sintoma:** Dados corrompidos, comportamento imprevisível

**Soluções:**
- ✅ Sempre usar mutex/semaphore para recursos compartilhados
- ✅ Variáveis compartilhadas devem ser `volatile`
- ✅ Considerar usar `portENTER_CRITICAL()` para seções curtas
- ✅ Evitar acesso simultâneo ao mesmo periférico (I2C, SPI)
- ✅ Usar queues para transferir dados entre cores

---

## 🔗 Próximos Passos

**🎉 Parabéns por completar o Nível 3 - ESP32 Master!**

Você agora domina:
- ✅ FreeRTOS avançado (tasks, queues, semaphores, mutexes)
- ✅ Programação dual-core com task pinning
- ✅ Bluetooth Low Energy (GAP, GATT, advertising)
- ✅ OTA updates para produção
- ✅ Power management e deep sleep
- ✅ Integração complexa de múltiplos sistemas
- ✅ Arquitetura de firmware profissional

**Habilidades Profissionais Adquiridas:**
- ✅ Desenvolvimento de firmware para produção
- ✅ Otimização de performance e energia
- ✅ Debugging de sistemas complexos
- ✅ Integração de protocolos wireless
- ✅ Manutenibilidade e escalabilidade de código

**Próximas Jornadas:**

**1. Microcontroladores Alternativos:**
🔼 **[RP2040]** - PIO, dual-core ARM Cortex-M0+

🔼 **[STM8]** - Bare-metal, registradores, baixo nível

**2. Especialização ESP32:**
- **ESP-NOW:** Comunicação P2P sem WiFi
- **ESP-MESH:** Redes mesh auto-organizáveis
- **ULP Co-processor:** Programação ultra-low-power
- **Secure Boot:** Boot seguro e flash encryption
- **Rainmaker:** Plataforma IoT da Espressif

**3. Projetos Avançados:**
- Sistema de automação residencial completo
- Gateway IoT multi-protocolo
- Wearable com BLE e sensores
- Edge computing com TensorFlow Lite
- Mesh network para smart city

**Recomendações Finais:**
1. 📝 Contribuir com projetos open-source ESP32
2. 🛠️ Criar seu próprio produto IoT comercial
3. 📚 Estudar ESP32-S3 (USB, maior RAM) e ESP32-C6 (WiFi 6, Zigbee)
4. 🔍 Aprofundar em segurança IoT e certificações
5. 🎓 Considerar certificação profissional Espressif

**Recursos Avançados:**
- 📖 [ESP-IDF Advanced Topics](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/index.html)
- 📖 [ESP32 Technical Reference](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- 📺 [Espressif YouTube](https://www.youtube.com/@EspressifSystems)
- 💻 [ESP32 Forum](https://www.esp32.com/)
- 🎮 [Awesome ESP32](https://github.com/agucova/awesome-esp)

**Comunidade:**
- [ESP32.com Forum](https://esp32.com)
- [Reddit r/esp32](https://reddit.com/r/esp32)
- [Discord ESP32](https://discord.gg/espressif)

---

**Última atualização:** 26/12/2025

**Versão do Curso:** 3.0 - Avançado Completo
