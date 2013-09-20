/* Copyright (C) 2013 Princess Platinum
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*jshint curly:false laxbreak:true smarttabs:true jquery:true es5:true */
/*global mediaWiki */

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
                
                break;
            case "delete":
                modal_title = "Block user";
                modal_html = "";
                modal_id = "block-modal";
                modal_button_name = "Block";
                modal_function_to_call = function() { ajaxBlock() };
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
