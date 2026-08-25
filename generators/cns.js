function gerarCNS() {

  const primeirosValidos = [1, 2, 7, 8, 9];

  let cns;
  let digitoVerificador;

  do {
    cns = [];

    cns.push(primeirosValidos[Math.floor(Math.random() * primeirosValidos.length)]);

    for (let i = 0; i < 13; i++)
      cns.push(Math.floor(Math.random() * 10));

    let soma = 0;

    for (let i = 0; i < 14; i++)
      soma += cns[i] * (15 - i);

    digitoVerificador = (11 - (soma % 11)) % 11;
  } while (digitoVerificador === 10);

  cns.push(digitoVerificador);

  return cns.join("");
}
