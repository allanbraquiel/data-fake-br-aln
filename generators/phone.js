function gerarTelefone() {

  let ddd = ["11","21","31","41","51","61","62","71","81"];
  let d = ddd[Math.floor(Math.random()*ddd.length)];

  let numero = "9" + Math.floor(10000000 + Math.random()*90000000);

  return "(" + d + ") " + numero;
}