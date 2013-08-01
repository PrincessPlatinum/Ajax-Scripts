function addTemplate() {
    "use strict";
    //Variables for use later on in the script.
	var tName = prompt('Title of the designated template along with parameters separated by a "|"'),
	uSignature = '~~' + String.fromCharCode(126) + '~',
	tVal = '{{SUBST:' + tName + '}} ' + uSignature,
	mVal = '{{Template:' + tName + '}}',
	eSummary = 'Using the [[w:c:dev:AjaxTemplate|AjaxTemplate]] script.',
	editToken = mw.user.tokens.values.editToken,
    
    //Name space detection and list.
    nameSpace = mw.config.get('wgNamespaceNumber');

    //Deciding how to proceed based on the name space.
    //User/main spaces (Article, Project etc...)
    if (-1 < [0,2,4,6,8,10,12,14].indexOf(nameSpace)) {
    	$.post("/api.php", {action: "edit", title: wgPageName, token: editToken, prependtext: mVal, summary: eSummary});
        console.log('User Page');
    }
    //For the talk/forum name space
    if (-1 < [1,3,5,7,9,11,13,15,110].indexOf(nameSpace)) {
    	$.post("/api.php", {action: "edit", title: wgPageName, token: editToken, appendtext: tVal, summary: eSummary});
        console.log('Talk Page');
    } else {
        return;
        console.log('Failed');
    }
}

//Adds the button to the header
function addButton() {
	var button = '<a class="wikia-button" onclick="this.innerHTML = \'Added\'; addTemplate();">Add Template</a>';
	document.getElementById('WikiHeader').innerHTML += button;
}

addOnloadHook(addButton);
