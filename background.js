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
  { key: "cns", label: "CNS" },
  { key: "cpf", label: "CPF" },
  { key: "cnpj", label: "CNPJ" },
  { key: "cnpjAlfanumerico", label: "CNPJ Alfanumerico" },
  { key: "telefone", label: "Telefone" },
  { key: "empresa", label: "Empresa" },
  { key: "profissao", label: "Profissão" },
  { key: "dataNascimento", label: "Data de nascimento" },
  { key: "cepGO", label: "CEP GO" },
  { key: "cepUF", label: "CEP UF" },
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

function enviarParaFrame(tabId, frameId, opcoes) {
  return new Promise((resolve) => {
    const opcoesFrame = { ...opcoes, skipIframes: true };
    chrome.tabs.sendMessage(tabId, { action: "fillForm", opcoes: opcoesFrame }, { frameId }, (response) => {
      if (chrome.runtime.lastError || !response || response.status !== "sucesso") {
        resolve({ preenchidos: 0, ignorados: 0, relatorio: [] });
        return;
      }

      resolve({
        preenchidos: response.preenchidos || 0,
        ignorados: response.ignorados || 0,
        relatorio: Array.isArray(response.relatorio) ? response.relatorio : []
      });
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== "fillAllFrames")
    return;

  const tabId = sender.tab && sender.tab.id;
  const frameIdTopo = sender.frameId;

  if (typeof tabId !== "number") {
    sendResponse({ status: "erro", mensagem: "Tab invalida." });
    return;
  }

  chrome.webNavigation.getAllFrames({ tabId }, async (frames) => {
    if (chrome.runtime.lastError || !Array.isArray(frames)) {
      sendResponse({ status: "sucesso", preenchidos: 0, ignorados: 0, relatorio: [] });
      return;
    }

    const framesAlvo = frames.filter((frame) => frame.frameId !== frameIdTopo);

    const resultados = await Promise.all(
      framesAlvo.map((frame) => enviarParaFrame(tabId, frame.frameId, request.opcoes || {}))
    );

    const preenchidos = resultados.reduce((soma, r) => soma + r.preenchidos, 0);
    const ignorados = resultados.reduce((soma, r) => soma + r.ignorados, 0);
    const relatorio = resultados.flatMap((r) => r.relatorio);

    sendResponse({ status: "sucesso", preenchidos, ignorados, relatorio });
  });

  return true;
});
