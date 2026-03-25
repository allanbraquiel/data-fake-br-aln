const dominiosEmail = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com.br",
  "empresa.com.br",
  "dominio.com",
  "teste.com",
  "qa.com",
  "automacao.com",
  "fakeemail.com"
];

function gerarEmail(nomeCompleto) {

  if (!nomeCompleto) {
    nomeCompleto = gerarNome();
  }

  let partes = nomeCompleto
    .toLowerCase()
    .replace("ã","a")
    .replace("á","a")
    .replace("é","e")
    .replace("í","i")
    .replace("ó","o")
    .replace("ú","u")
    .split(" ");

  let primeiro = partes[0];
  let ultimo = partes[partes.length - 1];

  let dominio = dominiosEmail[Math.floor(Math.random() * dominiosEmail.length)];

  return primeiro + "." + ultimo + "@" + dominio;
}