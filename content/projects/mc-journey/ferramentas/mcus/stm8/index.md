---
layout: pasta
title: STM8
description: Microcontrolador 8-bit da STMicroelectronics
---

# STM8

O **STM8** é uma família de microcontroladores 8-bit da STMicroelectronics, conhecidos por seu baixo custo e eficiência energética.

## 🔧 Especificações Técnicas (STM8S103F3)

- **Microcontrolador:** STM8S Core
- **Tensão de Operação:** 2.95-5.5V
- **Clock:** até 16 MHz
- **Memória Flash:** 8 KB
- **RAM:** 1 KB
- **EEPROM:** 640 bytes
- **Pinos I/O:** 28

## 📚 Recursos

- [STM8 Programming Manual](https://www.st.com/resource/en/programming_manual/cd00161709.pdf)
    - **Por quê:** BÍBLIA dos registradores
    - **Uso:** Consulta CONSTANTE
- [STM8S103F3 Datasheet](https://www.st.com/resource/en/datasheet/stm8s103f3.pdf)
    - **Por quê:** Seu chip específico
    - **Seções:** Pinout, specs elétricas
- [Programming Manual (PM0051)](https://www.st.com/resource/en/programming_manual/cd00161709-stm8-cpu-programming-manual-stmicroelectronics.pdf)
    - **Por quê:** Instruções assembly, arquitetura

- [SDCC (Compilador)](http://sdcc.sourceforge.net/)
    - **Por quê:** Compilador C open source
    - **Instalação:** `sudo apt install sdcc`
- [stm8flash (Programador)](https://github.com/vdudouyt/stm8flash)
    - **Por quê:** Gravar via ST-LINK
    - **Uso:** `stm8flash -c stlinkv2 -p stm8s103f3 -w main.ihx`
- [STM8 Standard Peripheral Library](https://www.st.com/en/embedded-software/stsw-stm8069.html)
    - **Por quê:** Drivers oficiais (opcional)

- [STM8 SPL for SDCC](https://github.com/gicking/STM8-SPL_SDCC_patch)
    - **Por quê:** SPL adaptado para SDCC
- [STM8EF (Forth para STM8)](https://github.com/TG9541/stm8ef)
    - **Por quê:** Alternativa interessante

---
