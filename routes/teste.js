function validarInput(input) {
    const regex = /\s/; // Expressão regular para verificar espaços em branco
    const regexCaracteresEspeciais = /[^a-zA-Z0-9\sç]/g;
    const regexLetrasAcentuadas = /[áàâãéèêíïóôõöúçñ]/gi;
    
    
    return regexLetrasAcentuadas.test(input); // Retorna true se não houver espaços em branco
}
  
  // Exemplo de uso
  const input = "TextoSemEspacos";
  const contemEspacos = validarInput(input);
  console.log( "com", contemEspacos); // Saída: true
  
 