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
    "use strict";
    //Global Variables
    var page_name = mw.config.get("wgPageName"),
        server = mw.config.get("wgServer"),
        token = mw.user.tokens.values.editToken,
        page_id = mw.config.get("wgArticleId"),
        namespace = mw.config.get("wgNamespaceNumber"),
        signature = "~~" + "~~",
        modal_title,
        modal_html,
        modal_id,
        modal_button_name,
        modal_function_to_call;

    //Un-urlencoding pagename
    page_name = page_name.replace(/_/g, ' ');

    //Main menu modal
    mainMenu();

    function mainMenu() {
        $.showCustomModal("Advanced Tools", '<form class="WikiaForm" method="" name=""><fieldset><div style="text-align: center;"><a class="wikia-button" id="at-block">Block user</a>&nbsp;<a class="wikia-button" id="at-delete">Delete page</a>&nbsp;<a class="wikia-button" id="at-move">Move page</a>&nbsp;<a class="wikia-button" id="at-protect">(Un)Protect page</a>&nbsp;<a class="wikia-button" id="at-purge">Purge page</a><br><br><a class="wikia-button" id="at-redirect">Redirect page</a>&nbsp;<a class="wikia-button" id="at-redlinks">Remove redlinks</a>&nbsp;<a class="wikia-button" href="/index.php?title=' + encodeURIComponent(page_name) + '&amp;useskin=monobook">Switch skin</a>&nbsp;<a class="wikia-button" id="at-template">Add template</a>&nbsp;<a class="wikia-button" id="at-unsigned">Add unsigned</a>&nbsp;<a class="wikia-button" id="at-batch">Batch delete</a></div></fieldset></form>', {
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

        //Stupid Hack
        $("#at-block").click(function () {
            modal("block");
        });
        $("#at-delete").click(function () {
            modal("delete");
        });
        $("#at-move").click(function () {
            modal("move")
        });
        $("#at-protect").click(function () {
            modal("protect");
        });
        $("#at-purge").click(function () {
            function(){var page=encodeURIComponent(page_name);$.get('/index.php?title='+page+'&action=purge',function(){location.reload(true);});}
        });
        $("#at-redirect").click(function () {
            modal("redirect")
        });
        $("#at-redlinks").click(function () {
            function(){$.getJSON('/api.php?action=query&prop=revisions&titles='+encodeURIComponent(wgPageName)+'&rvprop=content&indexpageids=1&format=json',function(result){var text=result.query.pages[result.query.pageids[0]].revisions[0]['*'];var redlinks=$('a.new');var ref=0;while(text.indexOf('[[',ref)!=-1){if(text.indexOf(']]',text.indexOf('[[',ref))!=-1){var open=text.indexOf('[[',ref);var pipe=text.indexOf('|',open);var close=text.indexOf(']]',open);if(text.indexOf('<br/>',open)!=-1&&text.indexOf('<br/>',open)<close){ref=open+1;continue;}if(pipe!=-1&&pipe<close){if(pipe==close-1){var title=text.substring(open+2,pipe);var display=title.substring(title.indexOf(':')+1);}else{var title=text.substring(open+2,pipe);var display=text.substring(pipe+1,close);}}else{var title=text.substring(open+2,close);var display=title;}if(!title){ref=open+1;continue;}for(var i=0;i<redlinks.length;i++){var utitle=title[0].toUpperCase()+title.substring(1);if(redlinks[i].title.indexOf(' (page does not exist)')){var redlink=redlinks[i].title.substring(0,redlinks[i].title.length-22);}else{var redlink=redlinks[i];}if(utitle==redlink||utitle==':'+redlink){if(pipe==close-1){var show=title;}else{var show=display;}text=text.substring(0,open)+show+text.substring(close+2);break;}}ref=open+2;}else{break;}}$.getJSON('/api.php?action=query&prop=info&titles='+encodeURIComponent(wgPageName)+'&intoken=edit&indexpageids=1&format=json',function(result){$.post('/api.php',{action:'edit',title:wgPageName,text:text,summary:'Fixing redlinks',token:EditToken},function(){window.location.reload();});});});}
        });
        $("#at-template").click(function () {
            modal("template");
        });
        $("#at-unsigned").click(function () {
            function(){if(-1<[1,3,4,5,7,9,11,13,15,110].indexOf(Namespace)){var pageId=page_id;$.getJSON("/api.php",{action:"query",prop:"revisions",titles:page_name,rvprop:"user",format:"json",indexpageids:1},function(json){var user=json.query.pages[pageId].revisions[0].user,addText='{{Unsigned|'+user+'}}';url=server+'/api.php?action=edit&title='+encodeURIComponent(page_name)+'&appendtext='+encodeURIComponent(addText)+'&summary='+encodeURIComponent("Adding unsigned template for ")+'+encodeURIComponent(user)+'&token='+encodeURIComponent(token);$.post(url,function(){alert('Unsigned template has been added!');});});}}
        });
        $("#at-batch").click(function () {
            modal("batch");
        });
    }

    function modal(mode) {
        //Switch function (more compact?)
        switch (mode) {
        case "block":
            break;
        case "delete":
            break;
        case "move":
            break;
        case "protect":
            break;
        case "redirect":
            break;
        case "template":
            break;
        case "batch";
        break;
        default:
            alert("Error encountered!");
            break;
        }
        
        //Modal thing
        $.showCustomModal(modal_title, '<form class="WikiaForm" method="" name=""><fieldset>' + modal_html + '</feildset></form>', {
            id: modal_id,
            width: 650,
            buttons: [{
                id: "cancel",
                message: "Cancel",
                handler: function () {
                    $('#' + modal_id).closeModal();
                }
            }, {
                id: "submit",
                defaultButton: true,
                message: modal_button_name,
                handler: modal_function_to_call
            }]
        });
    }
}(this, this.jQuery, this.mediaWiki));
