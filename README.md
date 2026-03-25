# Data Fake Brasil - ALN

Extensão de navegador (Chrome/Chromium) para **preenchimento automático de formulários** com dados fictícios brasileiros.

Ideal para testes manuais de cadastro, QA e validação visual de formulários sem usar dados reais.

---

## ✨ Finalidade do projeto

O projeto foi criado para agilizar o trabalho de desenvolvimento e testes, preenchendo campos comuns de formulários web com dados fake como:

- Nome e sobrenome
- E-mail
- CPF e CNPJ
- Telefone
- Empresa
- CEP e endereço (logradouro, bairro, cidade, estado)
- Senha
- Data de nascimento

A extensão identifica os campos por atributos como `name`, `id`, `placeholder`, `aria-label`, `autocomplete`, label e tipo do input.

---

## ⚙️ Como funciona

1. A extensão adiciona um popup com o botão **"Preencher formulário"**.
2. Ao clicar, ela envia uma mensagem para o script de conteúdo da aba atual.
3. O script:
   - monta uma identidade fake;
   - tenta buscar endereço via **ViaCEP** a partir de um CEP gerado;
   - detecta o tipo de cada campo;
   - preenche inputs nativos (`input`, `textarea`, `select`) e parte de componentes customizados (`role="combobox"`, `role="textbox"`, etc.).
4. O popup exibe o status e quantidade de campos preenchidos.

---

## ✅ Principais recursos

- Preenchimento inteligente por detecção textual de campos (PT-BR e alguns termos em inglês)
- Suporte a campos nativos e alguns componentes customizados
- Marcação automática de `checkbox`/`radio` quando aplicável
- Geração local de documentos e dados fake
- Integração com ViaCEP para enriquecer dados de endereço

---

## 📦 Estrutura do projeto

```text
.
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── inject.js
├── content.js
├── faker.min.js
├── generators/
│   ├── person.js
│   ├── cpf.js
│   ├── cnpj.js
│   ├── company.js
│   ├── phone.js
│   ├── email.js
│   └── cep.js
└── utils/
    ├── fieldDetector.js
    └── addressService.js
```

---

## 🚀 Instalação (modo desenvolvedor)

### Pré-requisitos

- Google Chrome ou navegador baseado em Chromium

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

Além disso, faz requisição HTTP para a API pública do **ViaCEP** ao buscar endereço por CEP gerado.

- Não há backend próprio neste projeto.
- Não há armazenamento persistente configurado no código atual.

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

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Sugestões de melhorias:

- ampliar heurísticas de detecção de campos;
- melhorar suporte a bibliotecas de componentes (React/Vue/Angular);
- adicionar testes automatizados de geradores e detector.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).