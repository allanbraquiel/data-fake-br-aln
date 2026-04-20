function obterLabel(input) {
  if (input.labels && input.labels.length > 0)
    return input.labels[0].innerText || "";

  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label)
      return label.innerText || "";
  }

  const parentLabel = input.closest("label");
  if (parentLabel)
    return parentLabel.innerText || "";

  return "";
}

function normalizar(texto) {
  return (texto || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectarTipoCampo(input) {
  const atributos = [
    input.name,
    input.id,
    input.placeholder,
    input.getAttribute("aria-label"),
    input.getAttribute("autocomplete"),
    obterLabel(input),
    input.type
  ];

  const campo = normalizar(atributos.join(" "));

  if (campo.includes("cpf"))
    return "cpf";

  if (campo.includes("cnpj"))
    return "cnpj";

  if (campo.includes("rg") || campo.includes("registro geral") || campo.includes("identidade") || campo.includes("identity"))
    return "rg";

  if (campo.includes("profissao") || campo.includes("profissional") || campo.includes("occupation") || campo.includes("profession") || campo.includes("cargo") || campo.includes("ocupacao"))
    return "profissao";

  if (campo.includes("razao social") || campo.includes("nome da empresa") || campo.includes("empresa") || campo.includes("company") || campo.includes("fantasia"))
    return "empresa";

  if (campo.includes("telefone") || campo.includes("celular") || campo.includes("whatsapp") || campo.includes("phone") || campo.includes("mobile") || campo.includes("tel"))
    return "telefone";

  if (campo.includes("e-mail") || campo.includes("email") || campo.includes("mail"))
    return "email";

  if (campo.includes("primeiro nome") || campo.includes("first name") || campo.includes("firstname"))
    return "firstName";

  if (campo.includes("sobrenome") || campo.includes("last name") || campo.includes("lastname"))
    return "lastName";

  if (campo.includes("nome da mae") || campo.includes("mother") || campo.includes("mother name"))
    return "nomeMae";

  if (campo.includes("nome completo") || campo.includes("full name") || campo.includes("nome"))
    return "nome";

  if (campo.includes("senha") || campo.includes("password"))
    return "senha";

  if (campo.includes("nascimento") || campo.includes("birth") || campo.includes("data"))
    return "dataNascimento";

  if (campo.includes("cep") || campo.includes("zipcode") || campo.includes("postal"))
    return "cep";

  if (campo.includes("logradouro") || campo.includes("rua") || campo.includes("avenida") || campo.includes("endereco") || campo.includes("address"))
    return "logradouro";

  if (campo.includes("numero") || campo.includes("number"))
    return "numero";

  if (campo.includes("complemento") || campo.includes("complement"))
    return "complemento";

  if (campo.includes("bairro") || campo.includes("district"))
    return "bairro";

  if (campo.includes("cidade") || campo.includes("city") || campo.includes("municipio"))
    return "cidade";

  if (campo.includes("estado") || campo.includes("uf") || campo.includes("state"))
    return "estado";

  if (campo.includes("paragrafo") || campo.includes("paragraph") || campo.includes("descricao") || campo.includes("description") || campo.includes("observacao") || campo.includes("comentario") || campo.includes("comment"))
    return "paragrafo";
  
  return "texto";
}