function beforeTaskSave(colleagueId, nextSequenceId, userList){
	
    var atv = getValue("WKNumState");
    var nextAtv = getValue("WKNextState");

    if (atv == 0 || atv == 1) {

        var anexos   = hAPI.listAttachments();
        var temAnexo = false;

        if (anexos.size() > 0) {
            temAnexo = true;
        }

        if (!temAnexo) {
            throw "Favor anexar o termo de responsabilidade individual devidamente assinado.";
        }

    }
	
}