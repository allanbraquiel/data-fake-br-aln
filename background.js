const MENU_ROOT_ID = "fake-data-root";
const MENU_ITEM_PREFIX = "fake-data-fill:";

const CAMPO_OPCOES = [
  { key: "nome", label: "Nome completo" },
  { key: "firstName", label: "Primeiro nome" },
  { key: "lastName", label: "Sobrenome" },
  { key: "nomeMae", label: "Nome da Mãe" },
  { key: "email", label: "Email" },
  { key: "senha", label: "Senha" },
  { key: "rg", label: "RG" },
  { key: "cpf", label: "CPF" },
  { key: "cnpj", label: "CNPJ" },
  { key: "telefone", label: "Telefone" },
  { key: "empresa", label: "Empresa" },
  { key: "profissao", label: "Profissão" },
  { key: "dataNascimento", label: "Data de nascimento" },
  { key: "cepGoiania", label: "CEP Goiania" },
  { key: "cepCuritiba", label: "CEP Curitiba" },
  { key: "logradouro", label: "Logradouro" },
  { key: "numero", label: "Numero" },
  { key: "complemento", label: "Complemento" },
  { key: "bairro", label: "Bairro" },
  { key: "cidade", label: "Cidade" },
  { key: "estado", label: "Estado (UF)" },
  { key: "texto", label: "Texto (100 caracteres)" },
  { key: "paragrafo", label: "Parágrafo (+100 caracteres)" }
];

function criarMenusContexto() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ROOT_ID,
      title: "Data Fake BR - preencher com...",
      contexts: ["editable"]
    });

    CAMPO_OPCOES.forEach((opcao) => {
      chrome.contextMenus.create({
        id: `${MENU_ITEM_PREFIX}${opcao.key}`,
        parentId: MENU_ROOT_ID,
        title: opcao.label,
        contexts: ["editable"]
      });
    });
  });
}

function obterTipoCampoPeloMenu(menuItemId) {
  if (!menuItemId || typeof menuItemId !== "string")
    return "";

  if (!menuItemId.startsWith(MENU_ITEM_PREFIX))
    return "";

  return menuItemId.slice(MENU_ITEM_PREFIX.length);
}

chrome.runtime.onInstalled.addListener(() => {
  criarMenusContexto();
});

chrome.runtime.onStartup.addListener(() => {
  criarMenusContexto();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const tipoCampo = obterTipoCampoPeloMenu(info.menuItemId);
  if (!tipoCampo)
    return;

  if (!tab || typeof tab.id !== "number")
    return;

  chrome.tabs.sendMessage(tab.id, { action: "assignFieldType", fieldType: tipoCampo }, () => {
    if (chrome.runtime.lastError) {
      console.debug("Falha ao enviar comando para content script:", chrome.runtime.lastError.message);
    }
  });
});
