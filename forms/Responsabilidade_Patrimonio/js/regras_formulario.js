var myLoading2 = FLUIGC.loading('#div_aprovacao');
var modal_coligada;


$(document).ready(function() {
	
	
	console.log("Aqui estamos NUMERO_PROCESSO " + NUMERO_PROCESSO);	
	console.log("FORM EM MODO" + FORM_MODE);
	
	console.log("SQUARTLE" + ID_PROCESSO);
	console.log("TyPE"+ typeof ID_PROCESSO);
	

	switch (ID_PROCESSO) {
	
	//Início da solicitação
	// ADM informa responsável pelo patrimônio:
	case "0":
		//carregar_contexto();
		carregar_responsaveis();
		if (FORM_MODE == "ADD") {
			
			// etapa do patrimonio nao aparece aqui:
			$("#div_aprovacao").hide();
			$("#div_select_aprovacao_patrimonio").hide();	
			
			$("#decisao_solicitante_data_hora").val(obterHoraMovimentacao());
			$("#nome_solicitante").val(USUARIO_LOGADO);
			
			//Ocultar a barra de menu superior do Fluig
			$('#processTabs', window.parent.document).hide();
			$("#workflowview-header", window.parent.document).hide();
			
			//Exibir modal para seleção de coligada
			var lista_coligadas = '<div style="padding: 20px 0; height: 90%; overflow-y: scroll;"><h2 style="margin-top: 0;">Selecione a Coligada</h2><div class="list-group">';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(1, `PELICANO CONSTRUÇÕES S/A`)">1 - PELICANO CONSTRUÇÕES S/A</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(2, `RAF EMPREENDIMENTOS`)">2 - RAF EMPREENDIMENTOS</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(3, `UNIPEL ENGENHARIA`)">3 - UNIPEL ENGENHARIA</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(4, `CONSÓRCIO TAP`)">4 - CONSÓRCIO TAP</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(7, `TENCOL ENGENHARIA LTDA`)">7 - TENCOL ENGENHARIA LTDA</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(9, `EXOTIC IMPORTAÇÃO. EXPORTAÇÃO DE MÁRMORES E GRANITOS EIRELLI`)">9 - EXOTIC IMPORTAÇÃO. EXPORTAÇÃO DE MÁRMORES E GRANITOS EIRELLI</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(10, `CONSÓRCIO PELICANO/MONTEIRO DE CASTRO - PMC`)">10 - CONSÓRCIO PELICANO/MONTEIRO DE CASTRO - PMC</a>';
			lista_coligadas += '</div></div>';
			
			modal_coligada = FLUIGC.modal({
				title : '',
				content : lista_coligadas,
				id : 'fluig-modal'
			}, function(err, data) {
				if (err) {
					// do error handling
				} else {
					// do something with data
				}
			});
			$(".close").hide();
		
		}//form-mode-add
		
		exibirPatrimonios();
		$("#matricula_solicitante").val(MATRICULA_USUARIO_LOGADO);
		
		var teste_codigo_coligada = $("#numero_coligada").val();
		
		break;

	// Retornar ao início pro solicitante acertar o que precisar:
	//TODO: checar valor do evento 'voltar ao início':
	case "1":
		console.log("ESTOU NA atividade=" + ID_PROCESSO);
		
		if (FORM_MODE == "MOD") {
			//carregar_contexto(); // carregar patrimonios
			carregar_responsaveis();
			// Ocultando os selects de aprovação
			$("#decisao_solicitante_data_hora").val(obterHoraMovimentacao());
			$("#nome_solicitante").val(USUARIO_LOGADO);
			
			//Ocultar a barra de menu superior do Fluig
			$('#processTabs', window.parent.document).hide();
			$("#workflowview-header", window.parent.document).hide();
			
			//Exibir modal para seleção de coligada			
			var lista_coligadas = '<div style="padding: 20px 0; height: 90%; overflow-y: scroll;"><h2 style="margin-top: 0;">Selecione a Coligada</h2><div class="list-group">';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(1, `PELICANO CONSTRUÇÕES S/A`)">1 - PELICANO CONSTRUÇÕES S/A</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(2, `RAF EMPREENDIMENTOS`)">2 - RAF EMPREENDIMENTOS</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(3, `UNIPEL ENGENHARIA`)">3 - UNIPEL ENGENHARIA</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(4, `CONSÓRCIO TAP`)">4 - CONSÓRCIO TAP</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(7, `TENCOL ENGENHARIA LTDA`)">7 - TENCOL ENGENHARIA LTDA</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(9, `EXOTIC IMPORTAÇÃO. EXPORTAÇÃO DE MÁRMORES E GRANITOS EIRELLI`)">9 - EXOTIC IMPORTAÇÃO. EXPORTAÇÃO DE MÁRMORES E GRANITOS EIRELLI</a>';
			lista_coligadas += '<a class="list-group-item lista_coligadas" onclick="definir_coligada(10, `CONSÓRCIO PELICANO/MONTEIRO DE CASTRO - PMC`)">10 - CONSÓRCIO PELICANO/MONTEIRO DE CASTRO - PMC</a>';
			lista_coligadas += '</div></div>';
			
			modal_coligada = FLUIGC.modal({
				title : '',
				content : lista_coligadas,
				id : 'fluig-modal'
			}, function(err, data) {
				if (err) {
					// do error handling
				} else {
					// do something with data
				}
			});
			$(".close").hide();
		
		exibirPatrimonios(); 
		
		// etapa do patrimonio nao aparece aqui:
			
		// Exibindo Info da etapa Patrimônio valida
		if ($("#aprovacao_patrimonio").text() == "Aprovado") {
			$("#label_patrimonio_aprovacao").text("Patrimônio ");
			$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		} else if ($("#aprovacao_patrimonio").text() == "Reprovado") {
			// mostra icon red:
			$("#label_patrimonio_aprovacao").text("Patrimônio ");
			$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		}
		// hide no select de aprovacao patrimonio:
		$("#div_select_aprovacao_patrimonio").hide();
		$("#div_justificativa_reprovacao").show();
		$("#justificativa_reprovacao").prop('readonly', true);

		}//form-mod
		
		break;
	
	// Patrimonio valida informações:
	case "3":
		console.log("Estou Na Atividade=" + ID_PROCESSO);
		
		if (FORM_MODE == "MOD"){
			//carregar_contexto();
			// Pega data da criação do processo:
			if ($('#dataEmissao').val() == ''){
				$("#dataEmissao").val(pega_data_criacao_processo());
			}
			//show na aprovação:
			$("#div_aprovacao").show();
			$("#card_aprovacao_patrimonio").show();
		} else {
			$("#div_aprovacao").hide();
			$("#card_aprovacao_patrimonio").hide();			
		}
		exibirPatrimonios();
		break;
		
	// Fim do processo
	case "6":
		
		// Show resultado aprovacao patrimonio:
		// Exibindo Info da etapa Patrimônio valida
		if ($("#aprovacao_patrimonio").text() == "Aprovado") {
			$("#label_patrimonio_aprovacao").text("Patrimônio ");
			$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		} else if ($("#aprovacao_patrimonio").text() == "Reprovado") {
			// Exibindo justificativa da reprovação pelo patrimonio:
			$("#div_justificativa_reprovacao").show();
			$("#justificativa_reprovacao").prop('readonly', true);
			// mostra icon red:
			$("#label_patrimonio_aprovacao").text("Patrimônio ");
			$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		}
		
		exibirPatrimonios();
		
		break;
	} //switch
});



function desativar_formulario(){
	
	//Obra de origem e destino
	$("#justificativa").prop("readonly", true);
	$("#justificativa").prop("onfocus", null);
	
	$("#bt_add_item").prop("onclick", null);
	$("#bt_remover_item").prop("onclick", null);
	
	$('#bts_add_remover_item').hide();
	
	//Conteudo patrimonios
	for(var i=1; i<=15; i++){
		$("#patrimonio_" + i).prop("onfocus",null);
		$("#patrimonio_" + i).prop("readonly",true);
	}
}


function ativar_formulario(){
	//ativar justificativa e form de adicionar patrimonios:
	$("#justificativa").prop("readonly", null);
	$("#justificativa").prop("onfocus", null);
	
	//	$("#bt_add_item").prop("onclick", add_item_tabela());
	//	$("#bt_remover_item").prop("onclick", remover_item_tabela());
	$('#bts_add_remover_item').show();
	
	//Conteudo patrimonios
	for(var i=1; i<=15; i++){
	//		$("#patrimonio_" + i).prop("onfocus", escolher_patrimonio(i));
		$("#patrimonio_" + i).prop("readonly", null);
	}
}


function exibirPatrimonios(){
	for(var i = 2; i<=15; i++){
		if($("#patrimonio_" + i).prop("tagName") == "SPAN"){
			if($("#patrimonio_" + i).text().trim() != ""){
				$("#item_" + i).show();
			}
			else{
				$("#item_" + i).hide();
			}
		}
		else if($("#patrimonio_" + i).prop("tagName") == "INPUT"){
			if($("#patrimonio_" + i).val().trim() != ""){
				$("#item_" + i).show();
			}
			else{
				$("#item_" + i).hide();
			}
		}
	}
}


function obterHoraMovimentacao() {
	var data = new Date();
	var dia = String(data.getDate()).padStart(2, '0');
	var mes = String(data.getMonth() + 1).padStart(2, '0');
	var ano = data.getFullYear();
	var dataHoje = (dia + "/" + mes + "/" + ano);
	var hora = data.getHours();
	var minutos = data.getMinutes();
	var horaAtual = (("00" + hora).slice(-2) + ":" + ("00" + minutos).slice(-2));

	return dataHoje + " as " + horaAtual;
}


function definir_coligada(codigo_coligada, nome_coligada){
	modal_coligada.remove();
	$('#processTabs', window.parent.document).show();
	$("#nome_coligada").val(nome_coligada);
	$("#numero_coligada").val(codigo_coligada);
	
	carregar_contexto();
	
	//Exibindo novamente a barra de menu superior do processo
	$('#processTabs', window.parent.document).show();
	$("#workflowview-header", window.parent.document).show();
	
}


function envia_email_atraso(remetente, titulo, destinatario, assunto, tituloConteudo, conteudo, numeroSolicitacao){

    let comentario = "";

    let parametros = {

        remetente: remetente,
        titulo: titulo,
        destinatario: destinatario,
        assunto: assunto,
        tituloConteudo: tituloConteudo,
        conteudo: conteudo,
        numeroSolicitacao: numeroSolicitacao,
        comentario: comentario,

    };

    $.ajax({
        // url: "./enviarEmail.php",
        url: "https://almox.pelicano.eng.br/apis/email/enviarEmail.php",
        type: "POST",
        dataType: "JSON",
        responseType: "JSON",
        data: "parametros=" + JSON.stringify(parametros),
        success: function (data) {
            console.log(data);
        },
        error: function (erro) {
            console.log(erro);
        }
    })
}



function pega_data_criacao_processo(){
    //Obtendo o proprio processo por dataset e pegando sua data de criação:
    var constraint_workflowProcess = DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", NUMERO_PROCESSO, NUMERO_PROCESSO, ConstraintType.MUST);
    var constraints_workflowProcess = new Array(constraint_workflowProcess);
    var dataset_processo_atual = (DatasetFactory.getDataset("workflowProcess", null, constraints_workflowProcess, null).values);
    
    var data_hora_process = new Date(dataset_processo_atual[0]["startDateProcess"]);
    var data_hora_process_br = data_hora_process.toLocaleDateString('pt-BR');
    
    console.log("TWO2---" + data_hora_process_br);
    
    return data_hora_process_br;
}

// ao fechar modal, libera para visualizar o header de envio de anexos
$(document).on('hide.bs.modal','#fluig-modal', function () {
    console.log("fechou modal - ver anexo header");
	//Ocultar a barra de menu superior do Fluig
	$('#processTabs', window.parent.document).show();
	$("#workflowview-header", window.parent.document).show();
//Do stuff here
});

