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