const empresas1 = [
  "Tech", "Brasil", "Inova", "Global", "Prime",
  "Alpha", "Beta", "Delta", "Omega", "Sigma",
  "Startup", "Digital", "Net", "Web", "Cloud",
  "Data", "Info", "Soft", "Cyber", "Smart",
];

const empresas2 = [
  "Solutions", "Sistemas", "Tecnologia", "Inovação", "Software",
  "Consultoria", "Vidros", "Acabamentos", "Construções",
  "Engenharia", "Arquitetura", "Design", "Móveis", "Decorações",
  "Alimentos", "Bebidas", "Logística", "Transporte", "Serviços", 
  "Comércio", "Indústria", "Automação", "Eletrônicos", "Energias",
];

const tipoEmpresa = [
  "LTDA", "ME", "EIRELI", "SA",
  "SAS", "GmbH", "Inc", "Corp", "LLC",
]

function gerarEmpresa() {

  let nome1 = empresas1[Math.floor(Math.random()*empresas1.length)];
  let nome2 = empresas2[Math.floor(Math.random()*empresas2.length)];
  let tipo = tipoEmpresa[Math.floor(Math.random()*tipoEmpresa.length)];

  return nome1 + " " + nome2 + " " + tipo;
}