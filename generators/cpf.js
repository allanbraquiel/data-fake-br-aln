function gerarCPF() {

  let cpf = [];

  for (let i = 0; i < 9; i++)
    cpf.push(Math.floor(Math.random() * 9));

  let soma = 0;

  for (let i = 0; i < 9; i++)
    soma += cpf[i] * (10 - i);

  let dig1 = (soma * 10) % 11;
  if (dig1 === 10) dig1 = 0;

  cpf.push(dig1);

  soma = 0;

  for (let i = 0; i < 10; i++)
    soma += cpf[i] * (11 - i);

  let dig2 = (soma * 10) % 11;
  if (dig2 === 10) dig2 = 0;

  cpf.push(dig2);

  return cpf.join("");
}