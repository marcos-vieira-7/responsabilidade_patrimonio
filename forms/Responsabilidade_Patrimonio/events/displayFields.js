function displayFields(form,customHTML){ 
	
	customHTML.append("<script>var FORM_MODE = '" + form.getFormMode() + "'</script>")
	customHTML.append("<script>var ID_PROCESSO = '" + getValue('WKNumState') + "'</script>")
	customHTML.append("<script>var USUARIO_LOGADO = '" + fluigAPI.getUserService().getCurrent().getFullName() + "'</script>")
	customHTML.append("<script>var MATRICULA_USUARIO_LOGADO = '" + getValue("WKUser") + "'</script>")
	customHTML.append("<script>var NUMERO_PROCESSO = " + getValue('WKNumProces') + "</script>")
	
}