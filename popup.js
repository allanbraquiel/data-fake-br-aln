const botaoPreencher = document.getElementById("fill");
const botaoExportar = document.getElementById("export");
const selectPerfil = document.getElementById("perfil");
const inputSeed = document.getElementById("seed");
const checkboxApenasVazios = document.getElementById("apenasVazios");
const linkDemo = document.getElementById("linkDemo");
const status = document.getElementById("status");

let ultimoRelatorio = null;

function atualizarStatus(mensagem, variante = "idle") {
  status.textContent = mensagem;
  status.dataset.variant = variante;
}

function obterOpcoes() {
  const opcoes = { perfil: selectPerfil.value };

  const seed = inputSeed.value.trim();
  if (seed !== "")
    opcoes.seed = seed;

  if (checkboxApenasVazios.checked)
    opcoes.apenasVazios = true;

  return opcoes;
}

function baixarArquivo(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  URL.revokeObjectURL(url);
}

function exportarRelatorioCSV(relatorio) {
  const cabecalho = ["identificador", "tipoCampo", "status", "motivo"];
  const linhas = relatorio.map((item) => [
    item.identificador,
    item.tipoCampo,
    item.status,
    item.motivo
  ].map((valor) => `"${String(valor || "").replace(/"/g, '""')}"`).join(";"));

  return [cabecalho.join(";"), ...linhas].join("\n");
}

botaoPreencher.addEventListener("click", async () => {
  botaoPreencher.disabled = true;
  botaoExportar.disabled = true;
  ultimoRelatorio = null;
  atualizarStatus("Preenchendo campos detectados...", "idle");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "fillForm", opcoes: obterOpcoes() }, (response) => {
      botaoPreencher.disabled = false;

      if (chrome.runtime.lastError) {
        atualizarStatus("Nao foi possivel acessar o formulario desta aba.", "error");
        return;
      }

      if (!response || response.status === "erro") {
        atualizarStatus("O preenchimento falhou. Verifique a pagina e tente novamente.", "error");
        return;
      }

      const total = response.preenchidos || 0;
      const ignorados = response.ignorados || 0;
      const perfil = response.perfil || "Completo";
      ultimoRelatorio = response.relatorio || [];
      botaoExportar.disabled = ultimoRelatorio.length === 0;

      atualizarStatus(
        `Perfil: ${perfil}. ${total} campo(s) preenchido(s), ${ignorados} ignorado(s).`,
        "success"
      );
    });
  } catch (error) {
    botaoPreencher.disabled = false;
    atualizarStatus("Erro ao enviar comando para a aba atual.", "error");
    console.error("Erro ao enviar mensagem:", error);
  }
});

botaoExportar.addEventListener("click", () => {
  if (!ultimoRelatorio || !ultimoRelatorio.length)
    return;

  const host = "formulario";
  const csv = exportarRelatorioCSV(ultimoRelatorio);
  baixarArquivo(`relatorio-${host}.csv`, csv, "text/csv;charset=utf-8");
});

linkDemo.addEventListener("click", async (evento) => {
  evento.preventDefault();

  try {
    const resposta = await fetch(chrome.runtime.getURL("demo.html"));
    const conteudo = await resposta.text();
    baixarArquivo("demo.html", conteudo, "text/html;charset=utf-8");
    atualizarStatus("Arquivo demo.html baixado. Abra-o no navegador para testar.", "success");
  } catch (error) {
    console.error("Erro ao baixar demo.html:", error);
    atualizarStatus("Nao foi possivel baixar o arquivo de demonstracao.", "error");
  }
});
