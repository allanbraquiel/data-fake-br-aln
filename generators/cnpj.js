function gerarCNPJ() {

  let cnpj = [];

  for (let i = 0; i < 12; i++)
    cnpj.push(Math.floor(Math.random() * 9));

  let calc = (x) => {

    let n = x.length;
    let pos = n - 7;
    let soma = 0;

    for (let i = n; i >= 1; i--) {
      soma += x[n - i] * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado;

  }

  cnpj.push(calc(cnpj));
  cnpj.push(calc(cnpj));

  return cnpj.join("");
}

function gerarCNPJAlfanumerico() {

  const caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = [];

  for (let i = 0; i < 8; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    base.push(caracteres[indice]);
  }

  base.push("0", "0");
  base.push(String(Math.floor(Math.random() * 10)));
  base.push(String(Math.floor(Math.random() * 10)));

  const calcDigito = (valores) => {
    let peso = 2;
    let soma = 0;

    for (let i = valores.length - 1; i >= 0; i--) {
      soma += valorCaractereCNPJ(valores[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcDigito(base);
  const digito2 = calcDigito([...base, String(digito1)]);

  return `${base.join("")}${digito1}${digito2}`;
}

function valorCaractereCNPJ(caractere) {
  if (/^\d$/.test(caractere))
    return Number(caractere);

  return caractere.charCodeAt(0) - 55;
}