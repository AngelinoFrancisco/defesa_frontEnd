$(document).ready(function() {
	// Adicionar evento de clique ao botão "Buscar Dados"
	$('#buscar-dados').click(function() {
		// Exibir a modal "Processando..."
		$('#modal-processando').modal({backdrop: 'static', keyboard: false});

		// Fazer a solicitação para buscar os dados do backend
		axios.get('/buscar-dados')
		  .then(function (response) {
		    // Esconder a modal "Processando..." e atualizar o conteúdo da modal com os dados recebidos
		    $('#modal-processando').modal('hide');
		    $('#modal-processando .modal-body').html('Os dados foram recebidos.');
		    console.log(response.data);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	});
});
