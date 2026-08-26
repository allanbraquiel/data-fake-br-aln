# Data Fake BR — QA Test Data Generator

Extensão de navegador (Chrome/Chromium) para **preenchimento automático de formulários** com dados fictícios brasileiros.

Ideal para testes manuais de cadastro, QA e validação visual de formulários sem usar dados reais.

---

## ✨ Finalidade do projeto

O projeto foi criado para agilizar o trabalho de desenvolvimento e testes, preenchendo campos comuns de formulários web com dados fake **válidos** (que passam em validações de formato) como:

- Nome e sobrenome
- Nome da Mãe
- E-mail
- CPF, CNPJ e CNPJ Alfanumérico
- RG
- **CNS (Cartão Nacional de Saúde)**
- Telefone
- Empresa
- Profissão
- CEP e endereço (logradouro, bairro, cidade, estado)
- Senha
- Data de nascimento
- Texto e parágrafo em português

A extensão identifica os campos por atributos como `name`, `id`, `placeholder`, `aria-label`, `autocomplete`, label e tipo do input.

---

## ⚙️ Como funciona

1. A extensão adiciona um popup com o botão **"Preencher formulário"**.
2. Ao clicar, ela envia uma mensagem para o script de conteúdo da aba atual.
3. O script:
   - monta uma identidade fake;
   - gera um CEP real e tenta buscar o endereço via **ViaCEP** (com timeout e fallback local);
   - detecta o tipo de cada campo;
   - preenche inputs nativos (`input`, `textarea`, `select`) e componentes customizados (`role="combobox"`, `role="textbox"`, etc.).
4. O popup exibe o status e a quantidade de campos preenchidos.

---

## ✅ Principais recursos

- **Preenchimento inteligente** por detecção textual de campos (PT-BR e alguns termos em inglês)
- **Documentos válidos**: CPF, CNPJ, CNPJ Alfanumérico, RG e CNS gerados conforme os algoritmos oficiais de validação
- **CEP para todas as 27 UFs**, com prioridade configurável para Goiás
- **Suporte a inputs controlados** (React/Vue/Angular) via *native setter*
- Suporte a campos nativos e alguns componentes customizados
- Marcação automática de `checkbox`/`radio` quando aplicável
- Menu de contexto (botão direito) para mapear manualmente qual variável preencher em cada campo
- Geração local de documentos e dados fake (sem backend)
- Integração com ViaCEP para enriquecer dados de endereço
- **Testes automatizados** dos geradores (`npm test`)

---

## 🧾 Documentos gerados

| Documento | Formato | Validação |
|---|---|---|
| CPF | 11 dígitos | Dígitos verificadores (módulo 11) |
| CNPJ | 14 dígitos | Dígitos verificadores (módulo 11) |
| CNPJ Alfanumérico | 14 caracteres (letras e números) | Dígitos verificadores (módulo 11) |
| RG | 8 dígitos | — |
| CNS | 15 dígitos | Dígito verificador (módulo 11) e primeiro dígito em `1, 2, 7, 8, 9` |

---

## 📍 Geração de CEP

A extensão mantém listas de **CEPs reais das capitais de todas as 27 UFs** e gera endereços consistentes (CEP + cidade + estado).

- **Prioridade por UF**: a constante `UFS_PRIORITARIAS` (padrão `["GO"]`) define quais UFs são priorizadas, e `PROBABILIDADE_UF_PRIORITARIA` (padrão `0.5`) controla a força dessa prioridade. Assim, Goiás é priorizado (~50%) sem ser fixo, e as demais UFs continuam alcançáveis.
- **Menu de contexto**:
  - **CEP GO** → gera apenas CEPs de Goiás.
  - **CEP UF** → gera CEPs de qualquer outra UF (nunca Goiás).
- **Fallback local**: se o ViaCEP falhar ou demorar, o endereço local é usado com cidade/estado coerentes com o CEP gerado.

Para ajustar a prioridade, edite as constantes no topo de `generators/cep.js`:

```js
const UFS_PRIORITARIAS = ["GO"];            // ex.: ["GO", "DF"]
const PROBABILIDADE_UF_PRIORITARIA = 0.5;   // ex.: 0.3 para priorizar menos
```

---

## 🖱️ Mapeamento manual por campo

1. Clique com o botão direito em um campo editável.
2. Abra o menu **Data Fake BR - preencher com...**.
3. Escolha a variável desejada (ex.: Texto, CPF, E-mail, Nome da Mãe, Empresa, CNS, CEP GO, CEP UF).

A extensão preenche imediatamente o campo selecionado e salva o mapeamento por host (site).
Nos próximos cliques em **Preencher formulário**, esse mapeamento tem prioridade sobre a detecção automática.

---

## 🧪 Testes automatizados

Os geradores possuem testes automatizados que validam os algoritmos oficiais (CPF, CNPJ, CNPJ Alfanumérico, CNS) e o formato dos demais dados.

```bash
npm test
```

Atualmente são **17 testes**, cobrindo:

- Validação de CPF, CNPJ, CNPJ Alfanumérico e CNS
- Formato de RG, telefone, e-mail e CEP
- Consistência de endereço (CEP + cidade + estado)
- Cobertura das 27 UFs
- `gerarCEPOutraUF` nunca retorna CEP de Goiás
- Nome, nome da mãe, empresa e profissão

---

## 📦 Estrutura do projeto

```text
.
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── content.js
├── background.js
├── package.json
├── generators/
│   ├── person.js
│   ├── cpf.js
│   ├── cnpj.js
│   ├── cns.js
│   ├── rg.js
│   ├── company.js
│   ├── phone.js
│   ├── email.js
│   ├── cep.js
│   └── profession.js
├── utils/
│   ├── fieldDetector.js
│   └── addressService.js
└── test/
    └── generators.test.js
```

---

## 🚀 Instalação (modo desenvolvedor)

### Pré-requisitos

- Google Chrome ou navegador baseado em Chromium
- Node.js 18+ (apenas para rodar os testes)

### Passo a passo

1. Clone ou baixe este repositório.
2. No navegador, acesse: `chrome://extensions/`
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta do projeto (`data-fake-br-aln`).
6. Fixe a extensão na barra (opcional) e abra uma página com formulário.
7. Clique no ícone da extensão e depois em **Preencher formulário**.

---

## 🧪 Uso recomendado

- Testes de usabilidade e fluxo de cadastro
- QA funcional de formulários
- Demonstrações rápidas de interfaces com dados plausíveis

> **Importante:** os dados são fictícios, mas podem passar em validações de formato. Use somente em ambientes de teste/homologação.

---

## 🔐 Permissões e privacidade

A extensão utiliza:

- `activeTab`: para interagir com a aba ativa
- `scripting`: para executar lógica de preenchimento
- `contextMenus`: para exibir opções no clique com botão direito em campos editáveis
- `storage`: para salvar mapeamentos manuais por campo/host

Além disso, faz requisição HTTP para a API pública do **ViaCEP** ao buscar endereço por CEP gerado.

- Não há backend próprio neste projeto.
- O armazenamento local do navegador é usado para persistir mapeamentos manuais de campos.
- A geração de dados é 100% local; nenhum dado é enviado a servidores além da consulta de CEP ao ViaCEP.

---

## ⚠️ Limitações conhecidas

- Nem todo componente customizado de UI será reconhecido/preenchido.
- Detecção depende de convenções de nomes/labels dos campos.
- Alguns formulários com máscaras rígidas ou validações complexas podem exigir ajustes.
- O projeto é voltado ao ecossistema Chromium (manifest v3).

---

## 🛠️ Tecnologias

- JavaScript (Vanilla)
- Chrome Extensions Manifest V3
- API pública ViaCEP
- Node.js `node:test` (testes automatizados)

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Sugestões de melhorias:

- ampliar heurísticas de detecção de campos;
- melhorar suporte a bibliotecas de componentes (React/Vue/Angular);
- adicionar testes automatizados do detector de campos;
- adicionar perfis de dados e geração em lote (CSV/JSON).

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).
