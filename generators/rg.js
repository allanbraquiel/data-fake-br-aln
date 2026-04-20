function gerarRG() {
  let rg = "";
  for (let i = 0; i < 8; i++)
    rg += Math.floor(Math.random() * 10).toString();
  return rg;
}
