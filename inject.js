// Script para injetar faker no contexto da página
(function() {
  console.log("✓ inject.js iniciado");
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('faker.min.js');
  script.type = 'text/javascript';
  script.onload = function() {
    console.log("✓ Faker carregado, window.faker disponível?", typeof window.faker !== 'undefined');
  };
  script.onerror = function() {
    console.error("✗ Erro ao carregar faker.min.js");
  };
  
  // Injetar no head se disponível, senão no documentElement
  const target = document.head || document.documentElement;
  if (target) {
    target.appendChild(script);
    console.log("✓ Script faker inserido no", target.tagName);
  } else {
    console.error("✗ Não foi possível encontrar onde inserir o script");
  }
})();
