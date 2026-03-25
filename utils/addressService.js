async function buscarEnderecoPorCEP(cep) {

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    cep: data.cep,
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf
  };
}