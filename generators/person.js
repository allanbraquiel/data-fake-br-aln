const nomes = [
  "João","Maria","Pedro","Ana","Lucas",
  "Mariana","Carlos","Fernanda","Rafael","Juliana",
  "Gustavo","Camila","Bruno","Larissa","Felipe",
  "Amanda","Ricardo","Sofia","Diego","Isabela", 
  "Leonardo","Gabriela","Matheus","Carolina","Vinicius",
  "Beatriz","Eduardo","Larissa","Thiago","Priscila",
  "André","Aline","Renato","Vanessa","Fábio",
  "Patrícia","Bruna","Gustavo","Sabrina","Rafael",
  "Camila","Felipe","Mariana","Diego","Isabela"
];

const sobrenomes = [
  "Silva","Souza","Oliveira","Santos","Lima",
  "Pereira","Ferreira","Costa","Rodrigues",
  "Almeida","Gomes","Martins","Carvalho","Rocha",
  "Ribeiro","Alves","Melo","Barbosa","Dias",
  "Moreira","Moura","Cardoso","Pinto","Araujo",
  "Nunes","Teixeira","Cavalcanti","Freitas",
  "Siqueira","Castro","Campos","Vasconcelos",
  "Monteiro","Farias","Lopes","Macedo",
  "Gonçalves","Vieira","Correia","Borges",
  "Mendes","Assis","Duarte"
];

function gerarNome() {

  let nome = nomes[Math.floor(Math.random()*nomes.length)];
  let sobrenome = sobrenomes[Math.floor(Math.random()*sobrenomes.length)];

  return nome + " " + sobrenome;
}