function addUnsigned() {
    var nameSpace = mw.config.get('wgNamespaceNumber');
    //Check to see if page is in the name space we want
    if (-1 < [1,3,5,7,9,11,13,15,110].indexOf(nameSpace)) {
        //Sets up variables and gets info from the server
        var pageId = mw.config.get('wgArticleId');
        $.getJSON("/api.php", {action: "query", prop: "revisions", titles: wgPageName, rvprop: "user", format: "json", indexpageids: 1}, function(json) {
            var user = json.query.pages[pageId].revisions[0].user,
            addText = '{{Unsigned|' + user + '}}';
            //Posts info to the server
            $.post("/api.php", {action: "edit", title: wgPageName, token: mw.user.tokens.values.editToken, appendtext: addText, summary: "Marking unsigned"});
        });
    } else {
        return;
    }
}

//Nooo I have to use jQuery for this ~sniffle~
$('ul.tools').prepend('<li><a onclick="this.innerHTML = \'Added\'; addUnsigned();">Unsigned</a></li>');
