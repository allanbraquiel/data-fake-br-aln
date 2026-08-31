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
- **Suporte a iframes** — preenche formulários dentro de iframes (ex.: pagamentos)
- Marcação automática de `checkbox`/`radio` quando aplicável
- Menu de contexto (botão direito) para mapear manualmente qual variável preencher em cada campo
- Geração local de documentos e dados fake (sem backend)
- Integração com ViaCEP para enriquecer dados de endereço
- **Perfis de dados** (Pessoa Física, Pessoa Jurídica, Paciente SUS, Completo)
- **Preencher apenas campos vazios** — não sobrescreve dados já preenchidos no formulário
- **Seed determinístico** para reproduzir a mesma identidade
- **Relatório de cobertura** com exportação em CSV
- **Validação de origem** das mensagens recebidas
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

## 👤 Perfis de dados

O popup permite escolher um **perfil** que define quais tipos de campo serão preenchidos:

| Perfil | Descrição |
|---|---|
| **Completo** | Preenche todos os campos detectados (padrão) |
| **Pessoa Física** | Dados pessoais: nome, CPF, RG, CNS, telefone, profissão, endereço |
| **Pessoa Jurídica** | Dados de empresa: CNPJ, CNPJ Alfanumérico, razão social, endereço |
| **Paciente SUS** | Dados de saúde: nome, CNS, CPF, RG, data de nascimento, endereço |

Campos cujo tipo não pertence ao perfil selecionado são ignorados e registrados no relatório como `fora_do_perfil`.

A opção **"Preencher apenas campos vazios"** faz com que a extensão ignore campos que já possuem valor (não sobrescreve dados existentes). Campos ignorados por já estarem preenchidos são registrados no relatório como `ja_preenchido`.

Os perfis são definidos em `utils/profiles.js` e podem ser estendidos facilmente.

---

## 🎲 Seed determinístico

Para **reproduzir a mesma identidade** em execuções diferentes, informe uma **seed** (número) no popup.

- Com a mesma seed, os mesmos dados são gerados (CPF, nome, e-mail, endereço etc.).
- Sem seed, os dados são aleatórios a cada preenchimento.
- A seed é aplicada apenas durante o preenchimento e limpa ao final.

Isso é essencial para reproduzir bugs de QA: o mesmo cenário pode ser recriado quantas vezes forem necessárias.

---

## 📊 Relatório de cobertura e exportação

Após preencher, a extensão gera um **relatório detalhado** de cada campo:

- **identificador** — como o campo foi localizado (id, name, data-testid, aria-label ou caminho)
- **tipoCampo** — o tipo detectado (CPF, e-mail, CEP etc.)
- **status** — `preenchido` ou `ignorado`
- **motivo** — por que foi ignorado (`disabled`, `readonly`, `hidden`, `file`, `botao`, `fora_do_perfil`, `sem_valor`)

O botão **"Exportar relatório"** no popup baixa o relatório em **CSV**, pronto para anexar a um bug report ou planilha de QA.

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

Atualmente são **26 testes**, cobrindo:

- Validação de CPF, CNPJ, CNPJ Alfanumérico e CNS
- Formato de RG, telefone, e-mail e CEP
- Consistência de endereço (CEP + cidade + estado)
- Cobertura das 27 UFs
- `gerarCEPOutraUF` nunca retorna CEP de Goiás
- Nome, nome da mãe, empresa e profissão
- **Seed determinístico** (mesma seed → mesma sequência; seeds diferentes → sequências diferentes)
- **Perfis de dados** (perfil completo, pessoa física/jurídica, campos permitidos)

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
├── demo.html
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
│   ├── addressService.js
│   ├── random.js
│   └── profiles.js
└── test/
    ├── generators.test.js
    └── random-profiles.test.js
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
- Reprodução de bugs com **seed determinística**
- Auditoria de cobertura de formulários via **relatório exportado**

### Página de demonstração

O arquivo **`demo.html`** (na raiz do projeto) é uma página de teste para validar a assertividade do preenchimento e apresentar o comportamento para outras pessoas.

- Use o link **"Baixar página de demonstração"** no popup para baixar o arquivo `demo.html`, ou abra-o diretamente na raiz do projeto.
- Abra o `demo.html` baixado no navegador (duplo clique ou arraste para a aba).
- Clique no ícone da extensão e em **Preencher formulário**.
- **Importante:** para que a extensão funcione em arquivos locais (`file://`), ative a opção **"Permitir acesso a URLs de arquivo"** nas configurações da extensão em `chrome://extensions`.
- A página contém:
  - **Campos que a extensão preenche** (verde): dados pessoais, documentos, contato, empresa, endereço, textos, checkbox/radio.
  - **Campos que NÃO são preenchidos** (vermelho): desabilitados, somente leitura, ocultos, arquivo e botões — permanecem intactos.
- O campo **Senha** possui um botão de olho (👁) para **visualizar/ocultar** o valor preenchido.
- Use o **menu de contexto** (botão direito) em qualquer campo para mapear manualmente um tipo e demonstrar o preenchimento individual.

> **Importante:** os dados são fictícios, mas podem passar em validações de formato. Use somente em ambientes de teste/homologação.

---

## 🔐 Permissões e privacidade

A extensão utiliza:

- `activeTab`: para interagir com a aba ativa
- `scripting`: para executar lógica de preenchimento
- `contextMenus`: para exibir opções no clique com botão direito em campos editáveis
- `storage`: para salvar mapeamentos manuais por campo/host
- `webNavigation`: para localizar e preencher formulários dentro de iframes

Além disso, faz requisição HTTP para a API pública do **ViaCEP** ao buscar endereço por CEP gerado.

- Não há backend próprio neste projeto.
- O armazenamento local do navegador é usado para persistir mapeamentos manuais de campos.
- A geração de dados é 100% local; nenhum dado é enviado a servidores além da consulta de CEP ao ViaCEP.
- As mensagens recebidas pelo script de conteúdo são **validadas por origem**: apenas mensagens da própria extensão (popup/background) são aceitas, via verificação do `sender.id`.

---

## ⚠️ Limitações conhecidas

- Nem todo componente customizado de UI será reconhecido/preenchido.
- Detecção depende de convenções de nomes/labels dos campos.
- Alguns formulários com máscaras rígidas ou validações complexas podem exigir ajustes.
- Iframes de origem cruzada (cross-origin) só são preenchidos se a extensão tiver permissão de host para o domínio do iframe.
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
- adicionar geração em lote (CSV/JSON) de múltiplas identidades;
- suportar iframes aninhados (iframe dentro de iframe).

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).
