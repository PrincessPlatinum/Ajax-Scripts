(function (window, $, mw) {
    //Global Variables
    var pageName = mw.config.get("wgPageName"),
        server = mw.config.get("wgServer"),
        token = mw.user.tokens.values.editToken,
        pageId = mw.config.get("wgArticleId"),
        namespace = mw.config.get("wgNamespaceNumber"),
        signature = "~~" + "~~",
        mode,
        modal_title,
        modal_html,
        modal_id,
        modal_button_name,
        modal_function_to_call;

    //Un-urlencoding pagename
    pageName = pageName.replace(/_/g, ' ');

    //Main menu modal

    function mainMenu() {
        $.showCustomModal("Advanced Tools", '<form class="WikiaForm" method="" name=""><fieldset><div style="text-align: center;"><a class="wikia-button" onclick="function(){mode=\'block\';}">Block user</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'delete\';}">Delete page</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'move\';}">Move page</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'protect\';}">(Un)Protect page</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'purge\';}">Purge page</a><br><br><a class="wikia-button" onclick="function(){mode=\'redirect\';}">Redirect page</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'redlinks\';}">Remove redlinks</a>&nbsp;<a class="wikia-button" href="/index.php?title=' + encodeURIComponent(wgPageName) + '&amp;useskin=monobook">Switch skin</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'template\';}">Add template</a>&nbsp;<a class="wikia-button" onclick="function(){mlde=\'unsigned\';}">Add unsigned</a>&nbsp;<a class="wikia-button" onclick="function(){mode=\'batch\';}">Batch delete</a></div></fieldset></form>', {
            id: "advancedtools",
            width: 650,
            buttons: [{
                id: "close-menu",
                defaultButton: true,
                message: "Close form",
                handler: function () {
                    $("#advancedtools").closeModal();
                }
            }]
        });
        //Passing to modal generator
        modal(mode);
    }

    function modal(mode) {
        //Switch function (more compact?)
        switch(mode) {
            case "block":
                modal("block");
                break;
            case "delete":
                modal("delete");
                break;
            case "move":
                modal("move");
                break;
            case "protect":
                modal("protect");
                break;
        }
    }
}(this, this.jQuery, this.mediaWiki));
