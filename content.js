function dispararEventos(campo) {
  campo.dispatchEvent(new Event("input", { bubbles: true }));
  campo.dispatchEvent(new Event("change", { bubbles: true }));
  campo.dispatchEvent(new Event("blur", { bubbles: true }));
}

function setarValor(campo, valor) {
  if (campo.tagName === "SELECT") {
    const opcoes = Array.from(campo.options || []);
    const opcaoExata = opcoes.find((opcao) => {
      const texto = normalizar(opcao.textContent || "");
      const valorOpcao = normalizar(opcao.value || "");
      const esperado = normalizar(valor || "");
      return texto === esperado || valorOpcao === esperado;
    });

    if (opcaoExata) {
      campo.value = opcaoExata.value;
    } else {
      const opcaoValida = opcoes.find((opcao) => (opcao.value || "").trim() !== "");
      if (opcaoValida)
        campo.value = opcaoValida.value;
    }

    dispararEventos(campo);
    return;
  }

  campo.value = valor;
  dispararEventos(campo);
}

const STORAGE_FIELD_MAPPINGS_KEY = "fieldMappingsByHost";
const TIPOS_MENU_SUPORTADOS = new Set([
  "texto",
  "nome",
  "firstName",
  "lastName",
  "nomeMae",
  "email",
  "cpf",
  "cnpj",
  "telefone",
  "empresa",
  "senha",
  "dataNascimento",
  "cep",
  "cepGoiania",
  "cepCuritiba",
  "logradouro",
  "numero",
  "complemento",
  "bairro",
  "cidade",
  "estado"
]);

let ultimoCampoContexto = null;

function gerarTextoPortugues100() {
  const blocos = [
    "Texto de exemplo para validar campos de comentários de formulário com conteúdo coerente e natural.",
    "Mensagem padrão criada para testes de interface em campos de texto com cem caracteres de preenchimento.",
    "Conteúdo de teste para simular escrita real em campos de texto e comentário de cadastro e descrição."
  ];

  let texto = blocos[Math.floor(Math.random() * blocos.length)];
  if (texto.length > 100)
    return texto.slice(0, 100);

  if (texto.length < 100)
    return `${texto}${".".repeat(100 - texto.length)}`;

  return texto;
}

function obterValorPorTipo(tipoCampo, identidade) {
  switch (tipoCampo) {
    case "texto":
      return identidade.texto;
    case "nome":
      return identidade.nomeCompleto;
    case "nomeMae":
      return identidade.nomeMae;
    case "firstName":
      return identidade.primeiroNome;
    case "lastName":
      return identidade.ultimoNome;
    case "email":
      return identidade.email;
    case "cpf":
      return identidade.cpf;
    case "cnpj":
      return identidade.cnpj;
    case "telefone":
      return identidade.telefone;
    case "empresa":
      return identidade.empresa;
    case "senha":
      return identidade.senha;
    case "dataNascimento":
      return identidade.dataNascimento;
    case "cep":
      return identidade.endereco.cep || "";
    case "cepGoiania":
      return gerarCEPGoiania();
    case "cepCuritiba":
      return gerarCEPCuritiba();
    case "logradouro":
      return identidade.endereco.logradouro || "Rua de Teste";
    case "numero":
      return identidade.numero;
    case "complemento":
      return identidade.complemento;
    case "bairro":
      return identidade.endereco.bairro || "Centro";
    case "cidade":
      return identidade.endereco.cidade || "Curitiba" || "Goiania";
    case "estado":
      return identidade.endereco.estado || "PR" || "GO";
    default:
      return "";
  }
}

function ehElementoDOM(valor) {
  return valor instanceof Element;
}

function ehCampoMapeavel(elemento) {
  if (!ehElementoDOM(elemento))
    return false;

  if (elemento.matches("input, textarea, select"))
    return true;

  if (elemento.isContentEditable)
    return true;

  const role = (elemento.getAttribute("role") || "").toLowerCase();
  return role === "textbox" || role === "combobox";
}

function encontrarCampoMapeavel(elemento) {
  if (!ehElementoDOM(elemento))
    return null;

  return elemento.closest('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"]');
}

function registrarCampoContexto(elemento) {
  const campo = encontrarCampoMapeavel(elemento);
  if (!campo)
    return;

  ultimoCampoContexto = campo;
}

function obterCampoContextoAtual() {
  if (ultimoCampoContexto && document.contains(ultimoCampoContexto))
    return ultimoCampoContexto;

  const campoAtivo = encontrarCampoMapeavel(document.activeElement);
  if (campoAtivo)
    return campoAtivo;

  return null;
}

function obterHostAtual() {
  return window.location.host || "default";
}

function gerarCaminhoElemento(elemento) {
  const partes = [];
  let atual = elemento;

  while (atual && atual.nodeType === Node.ELEMENT_NODE && atual !== document.body) {
    const tag = (atual.tagName || "").toLowerCase();
    if (!tag)
      break;

    let indice = 1;
    let irmao = atual.previousElementSibling;
    while (irmao) {
      if ((irmao.tagName || "").toLowerCase() === tag)
        indice += 1;
      irmao = irmao.previousElementSibling;
    }

    partes.push(`${tag}:nth-of-type(${indice})`);
    atual = atual.parentElement;
  }

  partes.push("body");
  return partes.reverse().join(" > ");
}

function obterIdentificadorCampo(campo) {
  if (!ehCampoMapeavel(campo))
    return "";

  const tag = (campo.tagName || "").toLowerCase();
  const tipo = (campo.type || "").toLowerCase();
  const id = (campo.id || "").trim();
  const name = (campo.name || "").trim();
  const dataTestId = (campo.getAttribute("data-testid") || "").trim();
  const ariaLabel = (campo.getAttribute("aria-label") || "").trim();

  if (id)
    return `${tag}|${tipo}|id:${normalizar(id)}`;

  if (name)
    return `${tag}|${tipo}|name:${normalizar(name)}`;

  if (dataTestId)
    return `${tag}|${tipo}|data-testid:${normalizar(dataTestId)}`;

  if (ariaLabel)
    return `${tag}|${tipo}|aria-label:${normalizar(ariaLabel)}`;

  return `${tag}|${tipo}|path:${gerarCaminhoElemento(campo)}`;
}

function carregarMapeamentosTodosHosts() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ [STORAGE_FIELD_MAPPINGS_KEY]: {} }, (resultado) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(resultado[STORAGE_FIELD_MAPPINGS_KEY] || {});
    });
  });
}

function salvarMapeamentosTodosHosts(mapeamentos) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_FIELD_MAPPINGS_KEY]: mapeamentos }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve();
    });
  });
}

async function carregarMapeamentosHostAtual() {
  const todosHosts = await carregarMapeamentosTodosHosts();
  return todosHosts[obterHostAtual()] || {};
}

async function salvarMapeamentoCampo(campo, tipoCampo) {
  const identificador = obterIdentificadorCampo(campo);
  if (!identificador)
    throw new Error("Nao foi possivel identificar o campo selecionado.");

  const todosHosts = await carregarMapeamentosTodosHosts();
  const host = obterHostAtual();
  const mapeamentosHost = todosHosts[host] || {};
  mapeamentosHost[identificador] = tipoCampo;
  todosHosts[host] = mapeamentosHost;

  await salvarMapeamentosTodosHosts(todosHosts);
  return identificador;
}

function obterTipoCampoComMapeamento(campo, mapeamentosHost) {
  const identificador = obterIdentificadorCampo(campo);
  if (!identificador)
    return detectarTipoCampo(campo);

  return mapeamentosHost[identificador] || detectarTipoCampo(campo);
}

function preencherCampoPorTipo(campo, tipoCampo, identidade) {
  if (!campo || !tipoCampo)
    return false;

  const role = (campo.getAttribute && campo.getAttribute("role") || "").toLowerCase();

  if (role === "combobox") {
    const valorCombobox = tipoCampo === "dataNascimento" ? "" : obterValorPorTipo(tipoCampo, identidade);
    return selecionarEmComboboxCustom(campo, valorCombobox);
  }

  if (campo.type === "checkbox") {
    if (!campo.checked)
      campo.click();
    return true;
  }

  if (campo.type === "radio") {
    if (!campo.checked)
      campo.click();
    return true;
  }

  const valor = tipoCampo === "dataNascimento"
    ? gerarDataNascimento(campo)
    : obterValorPorTipo(tipoCampo, identidade);

  if ((role === "textbox" || campo.isContentEditable) && valor) {
    campo.focus();
    campo.textContent = valor;
    dispararEventos(campo);
    return true;
  }

  if (valor) {
    setarValor(campo, valor);
    return true;
  }

  if (campo.tagName === "TEXTAREA") {
    setarValor(campo, identidade.texto);
    return true;
  }

  return false;
}

async function mapearCampoSelecionado(tipoCampo) {
  if (!TIPOS_MENU_SUPORTADOS.has(tipoCampo))
    throw new Error("Tipo de variavel nao suportado no menu de contexto.");

  const campo = obterCampoContextoAtual();
  if (!campo)
    throw new Error("Nenhum campo elegivel foi selecionado com o botao direito.");

  const identidade = await montarIdentidade();
  const preenchido = preencherCampoPorTipo(campo, tipoCampo, identidade);
  if (!preenchido)
    throw new Error("Nao foi possivel preencher o campo com a variavel escolhida.");

  const identificador = await salvarMapeamentoCampo(campo, tipoCampo);
  return { tipoCampo, identificador };
}

document.addEventListener("contextmenu", (evento) => {
  registrarCampoContexto(evento.target);
}, true);

document.addEventListener("focusin", (evento) => {
  registrarCampoContexto(evento.target);
}, true);

function elementoVisivel(elemento) {
  if (!elemento)
    return false;

  const estilo = window.getComputedStyle(elemento);
  if (estilo.display === "none" || estilo.visibility === "hidden")
    return false;

  const rect = elemento.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function coletarOpcoesCombobox(elemento) {
  const opcoes = [];
  const ariaControls = elemento.getAttribute("aria-controls");

  if (ariaControls) {
    const container = document.getElementById(ariaControls);
    if (container)
      opcoes.push(...container.querySelectorAll('[role="option"], li'));
  }

  opcoes.push(...document.querySelectorAll('[role="option"]'));

  const unicos = [];
  const vistos = new Set();

  opcoes.forEach((opcao) => {
    if (!opcao || vistos.has(opcao))
      return;
    vistos.add(opcao);
    if (elementoVisivel(opcao))
      unicos.push(opcao);
  });

  return unicos;
}

function selecionarEmComboboxCustom(elemento, valor) {
  if (!valor)
    return false;

  elemento.click();
  elemento.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

  const esperado = normalizar(valor);
  const opcoes = coletarOpcoesCombobox(elemento);

  const opcaoExata = opcoes.find((opcao) => normalizar(opcao.textContent || "") === esperado);
  const opcaoParcial = opcoes.find((opcao) => normalizar(opcao.textContent || "").includes(esperado));
  const alvo = opcaoExata || opcaoParcial;

  if (alvo) {
    alvo.click();
    return true;
  }

  return false;
}

function preencherElementosCustomizados(identidade) {
  let preenchidosCustom = 0;

  const elementos = Array.from(document.querySelectorAll('[role="combobox"], [role="textbox"], [contenteditable="true"], [role="checkbox"], [role="radio"], [role="switch"]'));

  elementos.forEach((elemento) => {
    if (!elementoVisivel(elemento))
      return;

    if (elemento.getAttribute("aria-disabled") === "true")
      return;

    const role = (elemento.getAttribute("role") || "").toLowerCase();
    const tipoCampo = detectarTipoCampo(elemento);
    const valor = obterValorPorTipo(tipoCampo, identidade);

    if (role === "checkbox" || role === "radio" || role === "switch") {
      const marcado = elemento.getAttribute("aria-checked") === "true";
      if (!marcado) {
        elemento.click();
        preenchidosCustom += 1;
      }
      return;
    }

    if (role === "combobox") {
      if (selecionarEmComboboxCustom(elemento, valor))
        preenchidosCustom += 1;
      return;
    }

    if ((role === "textbox" || elemento.isContentEditable) && valor) {
      elemento.focus();
      if (elemento.isContentEditable) {
        elemento.textContent = valor;
        dispararEventos(elemento);
      } else {
        setarValor(elemento, valor);
      }
      preenchidosCustom += 1;
    }
  });

  return preenchidosCustom;
}

function deveIgnorarCampo(campo) {
  const tipo = (campo.type || "").toLowerCase();
  return (
    campo.disabled ||
    campo.readOnly ||
    tipo === "hidden" ||
    tipo === "file" ||
    tipo === "submit" ||
    tipo === "button" ||
    tipo === "reset"
  );
}

function gerarSenha() {
  const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const minusculas = "abcdefghijklmnopqrstuvwxyz";
  const numeros = "0123456789";
  const especiais = "!@#$%^&*";
  const todos = `${maiusculas}${minusculas}${numeros}${especiais}`;

  function numeroAleatorio(maximo) {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % maximo;
    }

    return Math.floor(Math.random() * maximo);
  }

  function caractereAleatorio(conjunto) {
    return conjunto[numeroAleatorio(conjunto.length)];
  }

  const tamanho = numeroAleatorio(5) + 12;
  const senha = [
    caractereAleatorio(maiusculas),
    caractereAleatorio(minusculas),
    caractereAleatorio(numeros),
    caractereAleatorio(especiais)
  ];

  while (senha.length < tamanho)
    senha.push(caractereAleatorio(todos));

  for (let i = senha.length - 1; i > 0; i -= 1) {
    const j = numeroAleatorio(i + 1);
    const atual = senha[i];
    senha[i] = senha[j];
    senha[j] = atual;
  }

  return senha.join("");
}

function formatarDataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function normalizarDataSemTimezone(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function obterDataMaximaCampo(campo) {
  const hoje = normalizarDataSemTimezone(new Date());
  const valorMaximo = campo.max || campo.getAttribute("max");

  if (!valorMaximo)
    return hoje;

  const dataMaxima = new Date(`${valorMaximo}T00:00:00`);
  if (Number.isNaN(dataMaxima.getTime()))
    return hoje;

  const dataNormalizada = normalizarDataSemTimezone(dataMaxima);
  return dataNormalizada > hoje ? hoje : dataNormalizada;
}

function gerarDataNascimento(campo) {
  const dataMinima = new Date(1970, 0, 1);
  const dataMaxima = obterDataMaximaCampo(campo);
  const inicio = dataMinima.getTime();
  const fim = dataMaxima.getTime();
  const timestamp = Math.floor(Math.random() * (fim - inicio + 1)) + inicio;
  const data = new Date(timestamp);
  const placeholder = normalizar(campo.placeholder || "");

  if ((campo.type || "").toLowerCase() === "date")
    return formatarDataISO(data);

  if (placeholder.includes("dd/mm") || placeholder.includes("99/99") || placeholder.includes("dia/mes/ano"))
    return formatarDataBR(data);

  return formatarDataBR(data);
}

async function montarIdentidade() {
  const nomeCompleto = gerarNome();
  const nomeMae = gerarNomeMae();
  const partes = nomeCompleto.split(" ");
  const primeiroNome = partes[0] || "Joao";
  const ultimoNome = partes.length > 1 ? partes[partes.length - 1] : "Silva";

  const cep = gerarCEP();
  let endereco = {
    cep,
    logradouro: "Rua de Teste",
    bairro: "Centro",
    cidade: "Curitiba",
    estado: "PR"
  };

  try {
    const enderecoViaCep = await buscarEnderecoPorCEP(cep);
    if (enderecoViaCep && !enderecoViaCep.erro)
      endereco = enderecoViaCep;
  } catch (error) {
    console.warn("Não foi possível obter endereço do ViaCEP:", error);
  }

  return {
    texto: gerarTextoPortugues100(),
    nomeCompleto,
    nomeMae,
    primeiroNome,
    ultimoNome,
    cpf: gerarCPF(),
    cnpj: gerarCNPJ(),
    telefone: gerarTelefone(),
    email: gerarEmail(nomeCompleto),
    empresa: gerarEmpresa(),
    senha: gerarSenha(),
    numero: String(Math.floor(Math.random() * 9999) + 1),
    complemento: "Apto 101",
    endereco
  };
}

async function preencherFormulario() {
  const campos = document.querySelectorAll("input, textarea, select");
  if (!campos.length)
    return { preenchidos: 0, ignorados: 0 };

  const identidade = await montarIdentidade();
  const mapeamentosHost = await carregarMapeamentosHostAtual().catch((erro) => {
    console.warn("Falha ao carregar mapeamentos do host:", erro);
    return {};
  });

  let preenchidos = 0;
  let ignorados = 0;

  campos.forEach((campo) => {
    if (deveIgnorarCampo(campo)) {
      ignorados += 1;
      return;
    }

    const tipoCampo = obterTipoCampoComMapeamento(campo, mapeamentosHost);
    if (preencherCampoPorTipo(campo, tipoCampo, identidade))
      preenchidos += 1;
  });

  const preenchidosCustom = preencherElementosCustomizados(identidade);

  return { preenchidos: preenchidos + preenchidosCustom, ignorados, preenchidosCustom };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    preencherFormulario()
      .then((resultado) => sendResponse({ status: "sucesso", ...resultado }))
      .catch((error) => {
        console.error("Erro ao preencher formulário:", error);
        sendResponse({ status: "erro", mensagem: error.message });
      });

    return true;
  }

  if (request.action === "assignFieldType") {
    mapearCampoSelecionado(request.fieldType)
      .then((resultado) => sendResponse({ status: "sucesso", ...resultado }))
      .catch((error) => {
        console.error("Erro ao mapear campo via menu de contexto:", error);
        sendResponse({ status: "erro", mensagem: error.message });
      });

    return true;
  }
});