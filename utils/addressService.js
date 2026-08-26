const TIMEOUT_VIACEP_MS = 5000;

function normalizarCEPParaBusca(cep) {
  return (cep || "").toString().replace(/\D/g, "").slice(0, 8);
}

async function buscarEnderecoPorCEP(cep) {

  const cepLimpo = normalizarCEPParaBusca(cep);
  if (cepLimpo.length !== 8)
    throw new Error("CEP invalido para busca no ViaCEP.");

  const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), TIMEOUT_VIACEP_MS);

  try {
    const response = await fetch(url, { signal: controlador.signal });

    if (!response.ok)
      throw new Error(`ViaCEP respondeu com status ${response.status}.`);

    const data = await response.json();

    if (data.erro)
      throw new Error("CEP nao encontrado no ViaCEP.");

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf
    };
  } finally {
    clearTimeout(timeout);
  }
}
