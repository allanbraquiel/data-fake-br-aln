const botaoPreencher = document.getElementById("fill");
const status = document.getElementById("status");

function atualizarStatus(mensagem, variante = "idle") {
  status.textContent = mensagem;
  status.dataset.variant = variante;
}

botaoPreencher.addEventListener("click", async () => {
  botaoPreencher.disabled = true;
  atualizarStatus("Preenchendo campos detectados...", "idle");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "fillForm" }, (response) => {
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
      atualizarStatus(`Preenchimento concluido. ${total} campo(s) atualizado(s).`, "success");
    });
  } catch (error) {
    botaoPreencher.disabled = false;
    atualizarStatus("Erro ao enviar comando para a aba atual.", "error");
    console.error("Erro ao enviar mensagem:", error);
  }
});