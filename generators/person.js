const nomes = [
  "João","Maria","Pedro","Ana","Lucas",
  "Mariana","Carlos","Fernanda","Rafael","Juliana",
  "Gustavo","Camila","Bruno","Larissa","Felipe",
  "Amanda","Ricardo","Sofia","Diego","Isabela", 
  "Leonardo","Gabriela","Matheus","Carolina","Vinicius",
  "Beatriz","Eduardo","Thiago","Priscila",
  "André","Renato","Vanessa","Fábio",
  "Patrícia","Bruna","Sabrina",
  "Mauricio","Otavio","Cesar","Igor","Daniel",
  "Henrique","Rodrigo","Caio","Wesley","Afonso",
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
  "Mendes","Assis","Duarte",
  "Fernandes","Tavares","Bandeira","Barros","Leal",
  "Peixoto","Matos","Queiroz","Diniz","Pacheco"
];

const nomesFemininos = [
  "Maria", "Ana", "Mariana", "Fernanda", "Juliana",
  "Camila", "Larissa", "Amanda", "Sofia", "Isabela",
  "Gabriela", "Carolina", "Beatriz", "Priscila", "Alice",
  "Vanessa", "Patricia", "Bruna", "Sabrina", "Daniela",
  "Aline", "Renata", "Cláudia", "Luciana", "Mônica",
  "Carla", "Flávia", "Tatiana", "Cíntia", "Márcia",
  "Simone", "Eliane", "Rosana", "Adriana", "Sílvia",
  "Cristina", "Débora", "Elenice", "Fátima", "Gisele",
  "Heloísa", "Inês", "Jéssica", "Kátia", "Lívia",
  "Lorena", "Natália", "Bianca", "Clara", "Cecília",
  "Manuela", "Mirela", "Talita", "Verônica", "Yasmin"
];

function gerarNome() {

  let nome = nomes[Math.floor(Math.random()*nomes.length)];
  let sobrenome = sobrenomes[Math.floor(Math.random()*sobrenomes.length)];
  let sobrenome2 = sobrenomes[Math.floor(Math.random()*sobrenomes.length)];

  return nome + " " + sobrenome + " " + sobrenome2;
}

function gerarNomeMae() {
  const primeiroNome = nomesFemininos[Math.floor(Math.random() * nomesFemininos.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${primeiroNome} ${sobrenome} ${sobrenome2}`;
}