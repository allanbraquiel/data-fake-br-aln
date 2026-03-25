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

function obterValorPorTipo(tipoCampo, identidade) {
  switch (tipoCampo) {
    case "nome":
      return identidade.nomeCompleto;
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
    case "logradouro":
      return identidade.endereco.logradouro || "Rua de Teste";
    case "numero":
      return identidade.numero;
    case "complemento":
      return identidade.complemento;
    case "bairro":
      return identidade.endereco.bairro || "Centro";
    case "cidade":
      return identidade.endereco.cidade || "Curitiba";
    case "estado":
      return identidade.endereco.estado || "PR";
    default:
      return "";
  }
}

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
  const base = Math.random().toString(36).slice(2, 8);
  return `Teste@${base}9`;
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
    nomeCompleto,
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
  let preenchidos = 0;
  let ignorados = 0;

  campos.forEach((campo) => {
    if (deveIgnorarCampo(campo)) {
      ignorados += 1;
      return;
    }

    const tipoCampo = detectarTipoCampo(campo);

    if (campo.type === "checkbox") {
      if (!campo.checked)
        campo.click();
      preenchidos += 1;
      return;
    }

    if (campo.type === "radio") {
      if (!campo.checked)
        campo.click();
      preenchidos += 1;
      return;
    }

    switch (tipoCampo) {
      case "nome":
        setarValor(campo, identidade.nomeCompleto);
        preenchidos += 1;
        break;

      case "firstName":
        setarValor(campo, identidade.primeiroNome);
        preenchidos += 1;
        break;

      case "lastName":
        setarValor(campo, identidade.ultimoNome);
        preenchidos += 1;
        break;

      case "email":
        setarValor(campo, identidade.email);
        preenchidos += 1;
        break;

      case "cpf":
        setarValor(campo, identidade.cpf);
        preenchidos += 1;
        break;

      case "cnpj":
        setarValor(campo, identidade.cnpj);
        preenchidos += 1;
        break;

      case "telefone":
        setarValor(campo, identidade.telefone);
        preenchidos += 1;
        break;

      case "empresa":
        setarValor(campo, identidade.empresa);
        preenchidos += 1;
        break;

      case "senha":
        setarValor(campo, identidade.senha);
        preenchidos += 1;
        break;

      case "dataNascimento":
        setarValor(campo, gerarDataNascimento(campo));
        preenchidos += 1;
        break;

      case "cep":
        setarValor(campo, identidade.endereco.cep || identidade.endereco.cep);
        preenchidos += 1;
        break;

      case "logradouro":
        setarValor(campo, identidade.endereco.logradouro || "Rua de Teste");
        preenchidos += 1;
        break;

      case "numero":
        setarValor(campo, identidade.numero);
        preenchidos += 1;
        break;

      case "complemento":
        setarValor(campo, identidade.complemento);
        preenchidos += 1;
        break;

      case "bairro":
        setarValor(campo, identidade.endereco.bairro || "Centro");
        preenchidos += 1;
        break;

      case "cidade":
        setarValor(campo, identidade.endereco.cidade || "Curitiba");
        preenchidos += 1;
        break;

      case "estado":
        setarValor(campo, identidade.endereco.estado || "PR");
        preenchidos += 1;
        break;

      default:
        if (campo.tagName === "TEXTAREA") {
          setarValor(campo, "Texto de teste automatizado");
          preenchidos += 1;
        }
        break;
    }
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
});