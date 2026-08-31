const PERFIS = {
  completo: {
    label: "Completo",
    descricao: "Preenche todos os campos detectados",
    campos: null
  },
  pessoaFisica: {
    label: "Pessoa Física",
    descricao: "Dados pessoais de um indivíduo",
    campos: [
      "nome", "firstName", "lastName", "nomeMae", "email", "cpf", "rg",
      "cns", "telefone", "senha", "dataNascimento", "profissao",
      "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado",
      "texto", "paragrafo"
    ]
  },
  pessoaJuridica: {
    label: "Pessoa Jurídica",
    descricao: "Dados de uma empresa",
    campos: [
      "empresa", "cnpj", "cnpjAlfanumerico", "email", "telefone", "senha",
      "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado",
      "texto", "paragrafo"
    ]
  },
  pacienteSus: {
    label: "Paciente SUS",
    descricao: "Dados de saúde com CNS",
    campos: [
      "nome", "firstName", "lastName", "nomeMae", "cns", "cpf", "rg",
      "dataNascimento", "telefone", "email",
      "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado"
    ]
  }
};

function obterPerfil(nomePerfil) {
  if (!nomePerfil)
    return PERFIS.completo;

  return PERFIS[nomePerfil] || PERFIS.completo;
}

function perfilPermiteCampo(perfil, tipoCampo) {
  if (!perfil || !perfil.campos)
    return true;

  return perfil.campos.includes(tipoCampo);
}
