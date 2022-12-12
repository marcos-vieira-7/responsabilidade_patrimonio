var lista_patrimonios = [];
var lista_responsaveis = [];
var usuario_logado = "";
var matricula_usuario = "";
var lista_patrimonios_modal = "";
var lista_responsaveis_modal = "";
var myLoading1 = FLUIGC.loading('#conteudo');
var numero_obra_grupo = "";
var local_patrimonio = "";
var codigo_obra = "";
var login_usuario_logado;
var codigo_coligada;
var grupos_usuario_logado;
var grupos_validos_usuario_logado = [];
var local = "";
	
	
$(document).ready(function () {
	
    //Obtendo o usuário logado <h6 id="usuario_logado"></h6>
    usuario_logado = USUARIO_LOGADO;
    $("#usuario_logado").text(usuario_logado);

    //Obtendo matrícula do usuário logado
    matricula_usuario = MATRICULA_USUARIO_LOGADO;

    //Verificando se usuario e matrícula foram obtidos corretamente
    if ((usuario_logado == "") || (matricula_usuario == "")) {
        alert("Erro ao identificar usuario/matrícula do usuário logado, informe ao T.I");
        console.log("Mensagem de erro: Não foi possível obter usuário e matrícula");
    }

    //Obtendo os grupos vinculados ao usuário logado
    var onlyNormalClass = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", MATRICULA_USUARIO_LOGADO, MATRICULA_USUARIO_LOGADO, ConstraintType.MUST);
    var constraints = new Array(onlyNormalClass);
    grupos_usuario_logado = (DatasetFactory.getDataset("colleagueGroup", null, constraints, null).values);

    //Filtrando grupos válidos do usuário logado
	for(var i=0; i<grupos_usuario_logado.length; i++){
		//Removendo grupos inválidos das obras
		var grupoAtual = grupos_usuario_logado[i]["colleagueGroupPK.groupId"];
		if((grupoAtual != "Default") && (grupoAtual != "DefaultGroup-1") && (grupoAtual != "admin")){
			grupos_validos_usuario_logado.push(grupos_usuario_logado[i]["colleagueGroupPK.groupId"]);
		}
	}
	
	if(grupos_validos_usuario_logado.length == 0){
		alert("O usuário não esta incluído em nenhuma obra(grupo), informe ao T.I");
		console.log("Mensagem de erro: Não foi detectado um numero de obra válido nos grupos do usuário, favor checar os grupos do usuário atual");
		console.log("Numero da obra detectado: " + numero_obra_grupo);
		
		//Modal para usuário sem obra
		lista_patrimonios_modal = "<h4 style='color: red;'>Você precisa estar cadastrado em um grupo para visualizar os patrimônios</h4><h5>Solicite o cadastro ao T.I</h5>"
	}

});

function carregar_contexto() {

	// Loading até carregar a API
	myLoading1.show();
	
	//Verificando se o usuário pertence ao grupo do patrimônio
	var pertenceAoPatrimonio = false;

	for(var i = 0; i < grupos_validos_usuario_logado.length; i++){
		
		if(grupos_validos_usuario_logado[i] == "99"){
			pertenceAoPatrimonio = true;
		}
	}
	
	if(pertenceAoPatrimonio){
		grupos_validos_usuario_logado = ["99"];
	}
	
	// Iterar sobre os grupos/obra do usuario logado:
	for(var i = 0; i < grupos_validos_usuario_logado.length; i++){
	
	numero_obra_grupo = grupos_validos_usuario_logado[i];
		
    //Trazer todos patrimônio (Aplicado ao grupo do patrimônio) vê todos os patrimonios
	if (numero_obra_grupo == "99") {
	    codigo_obra = "%";
	}
    //Filtrar pelo grupo - vê os patrimonios de sua obra
	else if (numero_obra_grupo != "99") {
	    codigo_obra = numero_obra_grupo;
	    console.log("LOCAL PATRIMONIO=>" + codigo_obra);
	}

    //Caso as condições acima não forem aceitas, será retornado apenas os patrimônios em nome do usuário logado
    usuario_logado = USUARIO_LOGADO;
    matricula_usuario = MATRICULA_USUARIO_LOGADO;
    $("#matricula_solicitante").val(matricula_usuario);
    codigo_coligada = $("#numero_coligada").val();
    
    console.log("Matricula Solicitante: " + matricula_usuario);
    console.log("CODCOLIGADA " + codigo_coligada);
    console.log("LOCAL_S "+ codigo_obra);
    
    // somente chamar o ajax de obter patrimonio se codigo_obra estiver definido:
    if ((codigo_obra != "") && (codigo_obra != 0)){ 
	// Obtendo patrimônios e listando patrimônios no modal
	var url = "https://pelicanoconstrucoes127067.rm.cloudtotvs.com.br:8051/api/framework/v1/consultaSQLServer/RealizaConsulta/660606/1/G/?parameters=CHAPA=null"
		+ ";CODCOLIGADA=" + codigo_coligada
		+ ";LOCAL_S="+ codigo_obra;
	
	console.log("Esta URL:" + url);
	console.log("codigo_obra+before ajax" + codigo_obra);
		
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'json',
		headers : {
			"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
		},
		success : function(data) {
			//Analisar retorno da requisição
            if (data.length == 0) {
            	//alert("Patrimônios não encontrados, informe ao T.I");
                console.log("Mensagem de erro: Não foi encontrado nenhum patrimônio vinculado ao grupo ou chapa do usuário logado");
            }
            
            else{
            	// se somente se grupo não for patrimonio:
	            if(numero_obra_grupo != "99"){
	            	
	            	if(lista_patrimonios_modal == ""){
	            		lista_patrimonios_modal = '<input type="text" class="form-control" style="margin-bottom: 10px;" placeholder="Procurar Patrimônio" name="procurar_patrimonio" id="procurar_patrimonio" onkeyup="filtrar_patrimonio()">'
						lista_patrimonios_modal = lista_patrimonios_modal + '<div class="list-group">';
	            	}
					for (var i = 0; i < data.length; i++) {
						lista_patrimonios_modal = lista_patrimonios_modal
							+ '<a class="list-group-item lista_obras_origem lista_patrimonio_obras" id="pat_'+ i + '" onclick="definir_patrimonio(`' + data[i].CODPATRIMONIO + " - " + data[i].DESCRICAO.replace('"','')
							+ '`,'+ i + ', ' + (lista_patrimonios.length) + ')">'+ data[i].CODPATRIMONIO+ " - "+ data[i].DESCRICAO+ '</a>';
					}
					
					if(grupos_validos_usuario_logado[i] == grupos_validos_usuario_logado[grupos_validos_usuario_logado.length]){
						lista_patrimonios_modal = lista_patrimonios_modal + '</div>';
					}
					//Identificando patrimônio escolhido para definir se passará pela diretoria				
					lista_patrimonios.push(data);
				}
				else{
					lista_patrimonios_modal = '<div style="display: flex; height: 34px;"><input type="text" class="form-control" style="margin-bottom: 10px;" placeholder="Procurar Patrimônio" name="procurar_patrimonio" id="procurar_patrimonio"><button class="btn btn-primary" onclick="buscar_patrimonio_lista()">Buscar</button></div>'
							
					for (var i = 0; i < data.length; i++) {
						lista_patrimonios_modal = lista_patrimonios_modal
							+ '<a class="list-group-item lista_obras_origem lista_patrimonio_obras" style="display:none;" id="pat_'+ i + '" onclick="definir_patrimonio(`' + data[i].CODPATRIMONIO + " - " + data[i].DESCRICAO.replace('"','')
							+ '`,'+ i + ', ' + (lista_patrimonios.length) + ')">'+ data[i].CODPATRIMONIO+ " - "+ data[i].DESCRICAO+ '</a>';
					}
															
					lista_patrimonios_modal = lista_patrimonios_modal + '</div>';
														
					lista_patrimonios.push(data);
				}
	         }
			myLoading1.hide();
		},
		error : function(erro) {
			if (erro.responseJSON.Message == "Não foi possível consumir a licença no Slot 527: Erro: -1505 Message: Excedeu numero de licenças") {
				alert("Estamos sem licenças, tente novamente mais tarde!");
			}
			myLoading1.show();
		},
		async:false
	});
	
    }//if codigo_obra
	
    }//for
	
	// $('#lista_patrimonio_obras_gestor').append(local + '<br>' + lista_patrimonios_modal + '<br><br>');
			
	// Loading até carregar a API
	myLoading1.hide();

	// Exibindo inputs e spans preenchidos preenchidos anteriormente no formulário
	for (var i = 2; i <= 15; i++) {

		if ($("#patrimonio_" + i).text().trim() != "") {
			$("#item_" + i).show();
	
			if (i > 2) {
				itens = itens + 1;
			}
		}
	}

	//lista_patrimonios_modal = lista_patrimonios_modal + '</div>';
	
	//listar_locais_estoque();

}

function buscar_patrimonio_lista(){
	var conteudo_busca = $("#procurar_patrimonio").val();
	if (conteudo_busca != "") {
		$(".lista_patrimonio_obras").each(function(index) {
					if ($(this).text().toUpperCase().includes(conteudo_busca.toUpperCase())) {
						$(this).show();
					} else {
						$(this).hide();
					}
				});
	}
	else {
		$(".lista_patrimonio_obras").each(function(index) {
			$(this).show();
		});
	}
}

/*
function selecionar_patrimonio(id) {
	var indice_selecionado = $("#patrimonio_" + id).val();
	alert("Teste");
	$("#local" + id).text(lista_patrimonios[indice_selecionado].LOCAL);
	$("#marca_" + id).text(lista_patrimonios[indice_selecionado].MARCA);
	$("#modelo_" + id).text(lista_patrimonios[indice_selecionado].MODELO);
	$("#placa_" + id).text(lista_patrimonios[indice_selecionado].PLACA);
	$("#serie_" + id).text(lista_patrimonios[indice_selecionado].SERIE);
}
*/

var itens = 1;
function add_item_tabela() {
	if (itens < 15) {
		itens = itens + 1;
		$("#bt_remover_item").removeClass("disabled");
		$("#item_" + itens).show();
	}
}

function remover_item_tabela() {
	if (itens > 1) {
		$("#item_" + itens).hide();
		
		//Limpar conteúdo dos campos ocultados
		$("#patrimonio_" + itens).val("");
		$("#local_" + itens).val("");
		$("#marca_" + itens).val("");
		$("#modelo_" + itens).val("");
		$("#placa_" + itens).val("");
		$("#serie_" + itens).val("");

		itens = itens - 1;
		if (itens == 1) {
			$("#bt_remover_item").addClass("disabled");
		}
	}
}

var lista_obras = "";
var obras_carregadas = false;

//function listar_locais_estoque() {
//
//	var codColigada = 1;
//	console.log("listar_locais_estoque 1");
//	$.ajax({
//		url: "https://pelicanoconstrucoes127067.rm.cloudtotvs.com.br:8051/api/framework/v1/consultaSQLServer/RealizaConsulta/660607/1/G/",
//		dataType : "json",
//		type : "GET",
//		headers : {
//			"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
//		},
//		success : function(data) {
//			if (data.length == 0) {
//                alert("Falha ao consultar locais de estoque no RM, favor informar ao T.I");
//                console.log("Não foram encontrados locais de estoque, favor revisar consulta #660607");
//            }
//			
//			lista_obras = '<input type="text" class="form-control" style="margin-bottom: 10px;" placeholder="Procurar Obra" name="procurar_obra" id="procurar_obra" onkeyup="filtrar_obra_origem()">'
//			lista_obras = lista_obras + '<div class="list-group">';
//			for (var i = 0; i < data.length; i++) {
//				lista_obras = lista_obras
//					+ '<a class="list-group-item lista_obras_origem" onclick="definir_obra(`'
//					+ data[i].CODLOCAL + ' - '
//					+ data[i].NOME + '`)">'
//					+ data[i].CODLOCAL + ' - '
//					+ data[i].NOME + '</a>';
//			}''
//			lista_obras = lista_obras + '</div>';
//			obras_carregadas = true;
//			$("#obra_origem").prop("placeholder","Escolha a Obra de Origem");
//		},
//		error : function(erro) {
//			if (erro.responseJSON.Message == "Não foi possível consumir a licença no Slot 527: Erro: -1505 Message: Excedeu numero de licenças") {
//				alert("Estamos sem licenças, tente novamente mais tarde!");
//				console.log("Mensagem de erro: Sem licenças no RM");
//			}
//		}
//	})
//}

/*
function atualizar_obra() {
	var num_obra = $("#obra_origem").val().split(".")[0];
	$("#nDeControle").text("OBRA " + num_obra + "- 0000");
}
*/

var modal_obras;
var obra_selecionada = "origem";
//function selecionar_obra(obraSelecionada) {
//
//	obra_selecionada = obraSelecionada;
//	$('#processTabs', window.parent.document).hide();
//	$("#workflowview-header", window.parent.document).hide();
//
//	if (obras_carregadas) {
//		modal_obras = FLUIGC.modal({
//			title : 'Selecione o Destino',
//			content : lista_obras,
//			id : 'fluig-modal'
//
//		}, function(err, data) {
//			if (err) {
//				// do error handling
//			} else {
//				// do something with data
//			}
//		});
//	}
//}

//function definir_obra(obra) {
//
//	if (obra_selecionada == "origem") {
//		$("#obra_origem").val(obra);
//		//$("#nDeControle").text(obra.split("-")[0] + "- 0000");
//
//	}
//	else if (obra_selecionada == "destino") {
//		$("#obra_destino").val(obra);
//	}
//
//	modal_obras.remove();
//	var grupo_obra_destino = obra.split("-")[0].trim();
//	var usuario_gestor_obra_destino;	
//	
//	//Obter email do gestor da obra de destino
//	$.ajax({
//		url: "https://pelicanoconstrucoes142642.fluig.cloudtotvs.com.br/api/public/wcm/group/findUsingFilter?limit=200",
//		dataType : "json",
//		type : "GET",
//		headers : {
//			"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
//		},
//		success : function(data) {
//			
//			$("#email_responsavel").val("");
//						
//			for(var i = 0; i<data.content.length; i++){
//				if(data.content[i].groupCode == grupo_obra_destino){
//					$("#email_responsavel").val(data.content[i].dataMap.emailFluigGestor);
//					usuario_gestor_obra_destino = data.content[i].dataMap.loginFluigGestor;
//				}
//			}
//			
//			if ($("#email_responsavel").val() == "") {
//                $("#semGestor").show();
//            }
//            else {
//                $("#semGestor").hide();
//            }
//			
//			//Obter matricula do gestor da obra de destino
//			$.ajax({
//				url: "https://pelicanoconstrucoes142642.fluig.cloudtotvs.com.br/api/public/2.0/users/listAll?limit=500",
//				dataType : "json",
//				type : "GET",
//				headers : {
//					"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
//				},
//				success : function(data) {
//					for(var i = 0; i < data.content.length; i++){
//						var loginGestor = data.content[i].login.toLowerCase();
//						if(loginGestor == usuario_gestor_obra_destino){
//							$("#matricula_gestor_destino").val(data.content[i].code);
//						}
//					}
//					if($("#matricula_gestor_destino").val() == ""){
//						$("#obraSemGestor").show();
//					}
//					else{
//						$("#obraSemGestor").hide();
//					}
//					
//				},
//				error : function(erro) {
//					console.log(erro);	
//				}
//			});
//			
//			matricula_gestor_destino
//		},
//		error : function(erro) {
//			console.log(erro);	
//		}
//	});
//	
//	$('#processTabs', window.parent.document).show();
//	$("#workflowview-header" , window.parent.document).show();
//	
//}


function formata_data(data_string){
	/*
	 * Pega uma string de data e formata no modelo dd mm yyyy
	 * */
	console.log("QUEM É DATA INI +" + data_string);
	var currentTime = new Date(data_string);
	var mes = currentTime.getMonth() + 1;
	var dia = currentTime.getDate();
	var ano = currentTime.getFullYear();
	var data_formatada = dia + "/" + mes + "/" + ano;
	console.log("AQUI ESTOU DATA FIM" + data_formatada);
	return data_formatada;
}


function definir_patrimonio(patrimonio, pos, indiceArray) {
	$("#patrimonio_" + num_patrimonio_selecionado).val(patrimonio);

	modal_patrimonios.remove();
	
	console.log("Aqui está json " + JSON.stringify(lista_patrimonios));
	
	var indice_selecionado = $("#patrimonio_" + num_patrimonio_selecionado).val();
	$("#marca_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].MARCA);
	$("#modelo_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].MODELO);
	
	//formatar data e atribui ao campo data
	var data_date_format = new Date(lista_patrimonios[indiceArray][pos].DATAAQUISICAO);
	data_date_format = new Date(data_date_format.getFullYear(), data_date_format.getMonth(), data_date_format.getDate());
	$("#data_aquisicao_" + num_patrimonio_selecionado).val(data_date_format.toLocaleDateString('pt-BR'));
	
	$("#ano_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].ANOFABRICACAO);
	$("#placa_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].PLACA);
	$("#responsavel_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].RESPONSAVEL);
	$("#centro_custo_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].CENTRODECUSTO);
	$("#local_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].LOCAL);
	
	$("#idpatrimonio_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].IDPATRIMONIO);
	$("#codcoligada_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].CODCOLIGADA);
	$("#codfilial_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].CODFILIAL);
	$("#codpatrimonio_" + num_patrimonio_selecionado).val(lista_patrimonios[indiceArray][pos].CODPATRIMONIO);
	
	//Definir se precisa da aprovação do diretor
	if((indice_selecionado.split(".")[0] == 1) || (indice_selecionado.split(".")[0] == 7) || (indice_selecionado.split(".")[0] == 8)){
		$("#grupo_patrimonio").val("diretor");
	}
	else{
		if($("#grupo_patrimonio").val() != "diretor"){
			$("#grupo_patrimonio").val("recebedor");
		}
	}
	
	$('#processTabs', window.parent.document).show();
	$("#workflowview-header", window.parent.document).show();
	
	definir_matricula_gestor_obra();
}


function definir_responsavel(nome, chapa, indice) {
	console.log("NOME..." + nome);
	console.log("CHAPA..." + chapa);
	console.log("INDICE..." + indice);
	console.log("CADE INDEX->>" + indice);
	// o novo responsavel será um unico input, para todos os patrimonios que serão informados:
	$("#responsavel_novo").val(nome);
	$("#chapa_novo_responsavel").val(chapa);
	//$("#responsavel_novo_" + num_responsavel_selecionado).val(nome);
	//	$("#responsavel_novo_" + (indice + 1 )).val(nome);
	modal_responsaveis.remove();
	
}



//Filtrar seleção de obra
//function filtrar_obra_origem() {
//	var conteudo_busca = $("#procurar_obra").val();
//	if (conteudo_busca.length > 0) {
//		$(".lista_obras_origem").each(function(index) {
//			if ($(this).text().toUpperCase().includes(conteudo_busca.toUpperCase())) {
//				$(this).show();
//			}
//			else {
//				$(this).hide();
//			}
//		});
//	} else {
//		$(".lista_obras_origem").each(function(index) {
//			$(this).show();
//		});
//	}
//}



//Filtrar seleção de patrimônio
function filtrar_patrimonio(){
	var conteudo_busca = $("#procurar_patrimonio").val();
	if (conteudo_busca.length > 0) {
		$(".lista_patrimonio_obras").each(function(index) {
			if ($(this).text().toUpperCase().includes(conteudo_busca.toUpperCase())) {
				$(this).show();
			} 
			else {
				$(this).hide();
			}
		});
	}
	else {
		$(".lista_patrimonio_obras").each(function(index) {
			$(this).show();
		});
	}
}



//Filtrar seleção de responsavel
function filtrar_responsavel(){
	var conteudo_busca = $("#procurar_responsavel").val();
	if (conteudo_busca.length > 0) {
		$(".lista_responsaveis").each(function(index) {
			if ($(this).text().toUpperCase().includes(conteudo_busca.toUpperCase())) {
				$(this).show();
			} 
			else {
				$(this).hide();
			}
		});
	}
	else {
		$(".lista_responsaveis").each(function(index) {
			$(this).show();
		});
	}
}




var modal_patrimonios;
var num_patrimonio_selecionado = 1;
function escolher_patrimonio(num) {
	num_patrimonio_selecionado = num;
	
	$('#processTabs', window.parent.document).hide();
	$("#workflowview-header" , window.parent.document).hide();

	modal_patrimonios = FLUIGC.modal({
		title : 'Selecione o Item',
		content : lista_patrimonios_modal,
		id : 'fluig-modal'

	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			// do something with data
		}
	});
}


var modal_responsaveis;
var num_responsavel_selecionado = 1;
function escolher_responsavel(num) {
	num_responsavel_selecionado = num;
	
	$('#processTabs', window.parent.document).hide();
	$("#workflowview-header" , window.parent.document).hide();

	modal_responsaveis = FLUIGC.modal({
		title : 'Selecione',
		content : lista_responsaveis_modal,
		id : 'fluig-modal'

	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			// do something with data
		}
	});
}


//Comportamento da aprovação do Gestor
function definir_aprovacao_gestor() {
	if ($("#aprovacao_gestor").val() == "Aprovado") {
		$("#label_gestor_aprovacao").text("Gestor  ");
		$("#label_gestor_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		$("#div_justificativa_reprovacao").hide();

	} else if ($("#aprovacao_gestor").val() == "Reprovado") {
		$("#label_gestor_aprovacao").text("Gestor  ");
		$("#label_gestor_aprovacao").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		$("#justificativa_reprovacao").val("");
		$("#div_justificativa_reprovacao").show();
	}
	
	$("#decisao_gestor_data_hora").val(obterHoraMovimentacao());
	$("#nome_gestor_aprovador").text(usuario_logado);
}

var myModal;
//Comportamento da aprovação do Patrimônio
function definir_aprovacao_patrimonio() {
	if ($("#aprovacao_patrimonio").val() == "Aprovado") {
		$("#label_patrimonio_aprovacao").text("Patrimônio  ");
		$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		$("#div_justificativa_reprovacao").hide();
		
		//se está na atividade 3 (patrimonio valida) e em modo edição: liberar para gravação no rm
		if((ID_PROCESSO == 3) && (FORM_MODE == "MOD")){
			
			myModal = FLUIGC.modal({
			    title: 'Gravar no RM',
			    content: '<h5>Deseja gravar este processo no RM?</h5><h3 style="color: red; font-weight: bold; width: 100%; text-align: center;"> Atenção! Ao aprovar esta solicitação, as informações serão gravadas no RM. Favor conferir. </h3><div style="width: 100%; text-align: center; margin-top: 20px;"><button id="gravarNoRM" onclick="salvar_no_rm();" class="btn btn-danger">Gravar</button></div>',
			    id: 'fluig-modal',
			    size: 'large',
			    actions: [{
			        'label': 'Não gravar e sair',
			        'autoClose': true
			    }]
			}, function(err, data) {
			    if(err) {
			        // do error handling
			    } else {
			        // do something with data
			    }
			});
			
			$(".close").hide();
		}
	} 
	else if ($("#aprovacao_patrimonio").val() == "Reprovado") {
		$("#label_patrimonio_aprovacao").text("Patrimônio  ");
		$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		$("#justificativa_reprovacao").val("");
		$("#div_justificativa_reprovacao").show();
	}
	$("#decisao_patrimonio_data_hora").val(obterHoraMovimentacao());
	$("#nome_patrimonio_aprovador").text(usuario_logado);
}


//Comportamento da aprovação da Diretoria
function definir_aprovacao_diretoria() {
	if ($("#aprovacao_diretoria").val() == "Aprovado") {
		$("#label_diretoria_aprovacao").text("Diretoria  ");
		$("#label_diretoria_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		$("#div_justificativa_reprovacao").hide();
	} 
	else if ($("#aprovacao_diretoria").val() == "Reprovado") {
		$("#label_diretoria_aprovacao").text("Diretoria  ");;
		$("#label_diretoria_aprovacao").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		$("#justificativa_reprovacao").val("");
		$("#div_justificativa_reprovacao").show();
	}
	$("#decisao_diretoria_data_hora").val(obterHoraMovimentacao());
	$("#nome_diretoria_aprovador").text(usuario_logado);
}


//Comportamento da aprovação do Patrimônio
function definir_aprovacao_patrimonio_2() {
	if ($("#aprovacao_patrimonio_2").val() == "Aprovado") {
		$("#label_patrimonio_aprovacao_2").text("Patrimônio Finaliza ");
		$("#label_patrimonio_aprovacao_2").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
		$("#div_justificativa_reprovacao").hide();
	} 
	else if ($("#aprovacao_patrimonio_2").val() == "Reprovado") {
		$("#label_patrimonio_aprovacao_2").text("Patrimônio Finaliza  ");
		$("#label_patrimonio_aprovacao_2").append('<i class="flaticon flaticon-close icon-sm" aria-hidden="true" style="color: red;"></i>');
		$("#justificativa_reprovacao").val("");
		$("#div_justificativa_reprovacao").show();
	}
	$("#decisao_patrimonio_data_hora_2").val(obterHoraMovimentacao());
	$("#nome_patrimonio_aprovador_2").text(usuario_logado);
}


function definir_matricula_gestor_obra() {
	/*
	  	Busca qual a matricula do gestor da obra, a fim de 
	  	atribuir a atividade de 'avaliação pelo gestor' para a pessoa correta.
	*/
	console.log("1 definir_matricula_gestor_obra");
	//	modal_obras.remove();
	console.log("2 definir_matricula_gestor_obra");
	//pega localizacao do primeiro patrimonio adicionado no form:
	var local_patrimonio = $("#local_1").val();
	var grupo_obra = local_patrimonio.split("-")[0].trim();
	var usuario_gestor_obra_destino;
	
	console.log("LOCAL PATRI>>>" + local_patrimonio);
	
	$.ajax({
		url: "https://pelicanoconstrucoes142643.fluig.cloudtotvs.com.br:1100/api/public/wcm/group/findUsingFilter?limit=500",
		datatype: "json",
		type: "GET",
		headers: {
			"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
		},
		success: function(data) {
			
			$("#email_responsavel").val("");
			
			for(var i = 0; i<data.content.length; i++){
				if(data.content[i].groupCode == grupo_obra){
					$("#email_responsavel").val(data.content[i].dataMap.emailFluigGestor);
					usuario_gestor_obra_destino = data.content[i].dataMap.loginFluigGestor;
				}
			}
			
			if ($("#email_responsavel").val() == ""){
				$("#semGestor").show();// TODO checar se tem no html
			} else {
				$("#semGestor").hide();
			}
			//Obter matricula do gestor da obra de destino
			$.ajax({
				url: "https://pelicanoconstrucoes142642.fluig.cloudtotvs.com.br/api/public/2.0/users/listAll?limit=500",
				dataType : "json",
				type : "GET",
				headers : {
					"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
				},
				success : function(data) {
					for(var i = 0; i < data.content.length; i++){
						var loginGestor = data.content[i].login.toLowerCase();
						if(loginGestor == usuario_gestor_obra_destino){
							$("#matricula_gestor_obra").val(data.content[i].code);
							$("#matricula_gestor_obra").show();
							console.log("MATRICULO DO GESTOR OBRA " + data.content[i].code);
						}
					}
					if($("#matricula_gestor_obra").val() == ""){
						$("#obraSemGestor").show();
					}
					else{
						$("#obraSemGestor").hide();
					}
					
				},
				error : function(erro) {
					console.log(erro);	
				}
			});
			
		},// success
		error: function(erro) {
			console.log(erro);
		}
	});
	
	$('#processTabs', window.parent.document).show();
	$('#workflowview-header', window.parent.document).show();
}


function pega_numero_obra_automatic(){
	/**
	 * Via API, obtem o numero da obra do processo atual para o gestor visualizar a carga patrimonial.
	 * vem com numero da obra - data hoje
	 * */
	var onlyNormalClass = DatasetFactory.createConstraint("processTask.taskObservation", NUMERO_PROCESSO, NUMERO_PROCESSO, ConstraintType.MUST);
	var constraints = new Array(onlyNormalClass);
	obra_automatic = (DatasetFactory.getDataset("processTask", null, new Array(), null).values);
		
	let numeroDaObra = 0;
	
	for(i = 0; i< obra_automatic.length; i++){
		if(parseInt(NUMERO_PROCESSO) == parseInt(obra_automatic[i]["processTaskPK.processInstanceId"])){
			if((numeroDaObra == 0) && (!isNaN(obra_automatic[i].taskObservation))){
				numeroDaObra = obra_automatic[i].taskObservation;
			}
		}
	}
	return numeroDaObra;
}



function carregar_responsaveis() {

	// Loading até carregar a API
	myLoading1.show();
    
	//TODO: dá pra simplificar?
	//nome_responsavel_buscado = $("#nome_responsavel_buscado").val();
	// Obtendo responsaveis e listando no modal
	var url = "https://pelicanoconstrucoes127067.rm.cloudtotvs.com.br:8051/api/framework/v1/consultaSQLServer/RealizaConsulta/660601/1/P/?parameters=NOME=";
	
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'json',
		headers : {
			"Authorization" : "Basic " + btoa("fluig" + ":" + "Centrium505050@@")
		},
		success : function(data) {
			//Analisar retorno da requisição
            if (data.length == 0) {
            	//alert("Patrimônios não encontrados, informe ao T.I");
                console.log("Mensagem de erro: Não foi encontrado nenhum responsável.");
            }
            else{
            	console.log("CADE os responsaveis "+ data.length);
	            	if(lista_responsaveis_modal == ""){
	            		lista_responsaveis_modal = '<input type="text" class="form-control" style="margin-bottom: 10px;" placeholder="Procurar Responsável" name="procurar_responsavel" id="procurar_responsavel" onkeyup="filtrar_responsavel()">'
	            			lista_responsaveis_modal = lista_responsaveis_modal + '<div class="list-group">';
	            	}
					for (var i = 0; i < data.length; i++) {
						chapa_formatada = "";
						chapa_formatada = ("000000" + data[i].CHAPA).slice(-6);
						
						console.log("RESPONSA=>" + chapa_formatada);
						console.log("data[i].CHAPA=>" +  data[i].CHAPA);
						
						lista_responsaveis_modal = lista_responsaveis_modal
							+ '<a class="list-group-item lista_responsaveis" id="resp_'+ i + '" onclick="definir_responsavel(`' + data[i].nome + '`,`' + chapa_formatada + '`,' + (lista_responsaveis.length)  + ')">' + data[i].nome + '</a>';
					}
					lista_responsaveis_modal = lista_responsaveis_modal + '</div>';
					lista_responsaveis.push(data);
	         }
			myLoading1.hide();
		},
		error : function(erro) {
			console.log("Charizard====>" + erro);
			if (erro.responseJSON.Message == "Não foi possível consumir a licença no Slot 527: Erro: -1505 Message: Excedeu numero de licenças") {
				alert("Estamos sem licenças, tente novamente mais tarde!");
			}
			myLoading1.show();
		},
		async:false
	});
	// Loading até carregar a API
	myLoading1.hide();
}


//Comportamento da aprovação do Patrimônio
//function definir_aprovacao_patrimonio() {
//	
//	if ($("#aprovacao_patrimonio").val() == "Aprovado") {
//		//$("#label_patrimonio_aprovacao").text("Patrimônio  ");
//		//$("#icone_aprovacao_patrimonio").removeClass("flaticon-clock");
//		//$("#icone_aprovacao_patrimonio").addClass("flaticon-done");
//		//$("#label_patrimonio_aprovacao").append('<i class="flaticon flaticon-done icon-sm" aria-hidden="true" style="color: green;"></i>');
//		//$("#div_justificativa_reprovacao").hide();
//		
//	}
//	
//	$("#decisao_patrimonio_data_hora").val(obterHoraMovimentacao());
//	$("#nome_patrimonio_aprovador").text(usuario_logado);
//}


function salvar_no_rm() {

	myLoading2.show();
	$("#gravarNoRM").hide();
	var patrimonios = [];
	
	for (var i = 1; i <= 15; i++){
		if($("#patrimonio_" + i).val() != ""){
			var obj = {
				CODPATRIMONIO: $("#codpatrimonio_" + i).val(),
				DESCRICAO : $("#patrimonio_" + i).val(),
				IDPATRIMONIO : $("#idpatrimonio_" + i).val(),
				CODCOLIGADA : $("#codcoligada_" + i).val(),
				CODFILIAL : $("#codfilial_" + i).val(),
				CHAPA : $("#chapa_novo_responsavel").val()
			}
			patrimonios.push(obj);
		}
	}
	
	console.log("patrimonios1==="+ patrimonios);
	console.log("patrimonios==="+ JSON.stringify(patrimonios));
	
	if( $("#gravouNoRM").val() == "Sim" ){
		alert("Você já gravou anteriormente o novo responsável pelos patrimônios informados.");
	} else {
		$.ajax({
			url: "https://almox.pelicano.eng.br/patrimonio/cmi/Transferencia_Responsavel.php",
			type: "POST",
			data: "data="+JSON.stringify(patrimonios),
			success: function(data){
				console.log(data);
				$("#gravouNoRM").val("Sim");
				if (data == "OK"){
					alert("Dados salvos com sucesso no RM.");
				}
				myModal.remove();
				myLoading2.hide();
			},
			error: function(erro){
				console.log(erro);
				myLoading2.hide();
				$("#gravarNoRM").show();
				alert("Erro ao salvar no RM, tente novamente daqui a alguns minutos, se persistir, informe ao T.I");
			}
		})
	}
}







