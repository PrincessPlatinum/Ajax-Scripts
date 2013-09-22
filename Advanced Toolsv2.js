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
        skin = mw.config.get("skin"),
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
        $.showCustomModal("Advanced Tools", '<form class="WikiaForm" method="" name=""><fieldset><div style="text-align: center;"><a class="wikia-button" id="at-block">Block user</a>&nbsp;<a class="wikia-button" id="at-delete">Delete page</a>&nbsp;<a class="wikia-button" id="at-move">Move page</a>&nbsp;<a class="wikia-button" id="at-protect">(Un)Protect page</a>&nbsp;<a class="wikia-button" id="at-purge">Purge page</a><br><br><a class="wikia-button" id="at-redirect">Redirect page</a>&nbsp;<a class="wikia-button" id="at-redlinks">Remove redlinks</a>&nbsp;<a class="wikia-button" id="at-switch">Switch skin</a>&nbsp;<a class="wikia-button" id="at-template">Add template</a>&nbsp;<a class="wikia-button" id="at-unsigned">Add unsigned</a>&nbsp;<a class="wikia-button" id="at-batch">Batch delete</a></div></fieldset></form>', {
            id: "advancedtools",
            width: 650,
            buttons: [{
                id: "close-menu",
                defaultButton: true,
                message: "Close form",
                handler: function() { $("#advancedtools").closeModal(); }
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
            modal("move");
        });
        $("#at-protect").click(function () {
            modal("protect");
        });
        $("#at-purge").click(function () {
            $.get('/index.php?title='+encodeURIComponent(page_name)+'&action=purge',function(){location.reload(true);});
        });
        $("#at-redirect").click(function () {
            modal("redirect");
        });
        $("#at-redlinks").click(function () {
            $.getJSON('/api.php?action=query&prop=revisions&titles='+encodeURIComponent(wgPageName)+'&rvprop=content&indexpageids=1&format=json',function(result){var text=result.query.pages[result.query.pageids[0]].revisions[0]['*'];var redlinks=$('a.new');var ref=0;while(text.indexOf('[[',ref)!=-1){if(text.indexOf(']]',text.indexOf('[[',ref))!=-1){var open=text.indexOf('[[',ref);var pipe=text.indexOf('|',open);var close=text.indexOf(']]',open);if(text.indexOf('<br/>',open)!=-1&&text.indexOf('<br/>',open)<close){ref=open+1;continue;}if(pipe!=-1&&pipe<close){if(pipe==close-1){var title=text.substring(open+2,pipe);var display=title.substring(title.indexOf(':')+1);}else{var title=text.substring(open+2,pipe);var display=text.substring(pipe+1,close);}}else{var title=text.substring(open+2,close);var display=title;}if(!title){ref=open+1;continue;}for(var i=0;i<redlinks.length;i++){var utitle=title[0].toUpperCase()+title.substring(1);if(redlinks[i].title.indexOf(' (page does not exist)')){var redlink=redlinks[i].title.substring(0,redlinks[i].title.length-22);}else{var redlink=redlinks[i];}if(utitle==redlink||utitle==':'+redlink){if(pipe==close-1){var show=title;}else{var show=display;}text=text.substring(0,open)+show+text.substring(close+2);break;}}ref=open+2;}else{break;}}$.getJSON('/api.php?action=query&prop=info&titles='+encodeURIComponent(wgPageName)+'&intoken=edit&indexpageids=1&format=json',function(result){$.post('/api.php',{action:'edit',title:wgPageName,text:text,summary:'Fixing redlinks',token:EditToken},function(){window.location.reload();});});});
        });
        $("#at-switch").click(function() {
            if(!document.getElementById("ca-skins")){if(skin==="oasis"||skin==="wikia"){window.location=server+"/wiki/"+encodeURIComponent(page_name)+"?useskin=monobook";}else{window.location=server+"/wiki/"+encodeURIComponent(page_name)+"?useskin=wikia";}}
        });
        $("#at-template").click(function () {
            modal("template");
        });
        $("#at-unsigned").click(function () {
            if(-1<[1,3,4,5,7,9,11,13,15,110].indexOf(Namespace)){var pageId=page_id;$.getJSON("/api.php",{action:"query",prop:"revisions",titles:page_name,rvprop:"user",format:"json",indexpageids:1},function(json){var user=json.query.pages[pageId].revisions[0].user,addText='{{Unsigned|'+user+'}}';var summary="Adding Unsigned template for ";url=server+'/api.php?action=edit&title='+encodeURIComponent(page_name)+'&appendtext='+encodeURIComponent(addText)+'&summary='+encodeURIComponent(summary)+''+encodeURIComponent(user)+'&token='+encodeURIComponent(token);$.post(url,function(){alert('Unsigned template has been added!');});});}
        });
        $("#at-batch").click(function () {
            modal("batch");
        });
    }

    function modal(mode) {
        //Close main modal
        $("#advancedtools").closeModal();
        //Switch function (more compact?)
        switch (mode) {
        case "block":
            modal_title = "Block user";
            modal_html = '<strong>Username/IP to block:</strong><br /><input type="text" id="block-username" placeholder="Username/IP" style="width: 500px"></input><br /><strong>Duration of the block:</strong><br /><input type="text" id="block-duration" placeholder="2 Weeks" style="width: 500px"></input><br /><strong>Reason for blocking:</strong><br /><input type="text" id="block-reason" placeholder="Vandalism" style="width: 500px"></input>';
            modal_id = "block";
            modal_button_name = "Block";
            modal_function_to_call = function () { var user = document.getElementById('block-username').value, expiry = document.getElementById('block-duration').value, reason = document.getElementById('block-reason').value; ajaxBlock(user, expiry, reason); };
            break;
        case "delete":
            modal_title = "Delete page";
            modal_html = '<strong>Title of page to delete:</strong><br/><input type="text" id="delete-page" style="width: 500px;"></input><br /><strong>Reason for deleting: </strong><br /><input type="text" id="delete-reason" placeholder="Spam" style="width: 500px;"></input>';
            modal_id = "delete";
            modal_button_name = "Delete";
            modal_function_to_call = function () { var page = document.getElementById('delete-page').value, reason = document.getElementById('delete-reason').value; ajaxDelete(page, reason); };
            break;
        case "move":
            modal_title = "Move page";
            modal_html = '<strong>Page destination:</strong><br /><input type="text" id="move-destination" placeholder="I ran out of ideas..." style="width: 500px"></input><br /><strong>Reason for moving: </strong><br /><input type="text" id="move-reason" placeholder="I like this better" style="width: 500px;"></input><br /><strong>Leave a redirect </strong><input type="checkbox" id="redirect-check" />';
            modal_id = "move";
            modal_button_name = "Move";
            modal_function_to_call = function () { var destination = document.getElementById('move-destination').value, reason = document.getElementById('move-reason').value; ajaxMove(destination, reason); };
            break;
        case "protect":
            modal_title = "(Un)Protect page";
            modal_html = '<strong>Check to unprotect, Un-Check to protect : </strong><input type="checkbox" id="protect-toggle"></input><br /><strong>Durration of protection:</strong><br /><input type="text" id="protect-durration" style="width: 500px;" placeholder="3 days"></input><br /><strong>Reason for (Un)Protecting: </strong><br /><input type="text" id="protect-reason" placeholder="Vandalism" style="width: 500px;"></input>';
            modal_id = "protect";
            modal_button_name = "(Un)Protect";
            modal_function_to_call = function () { var durration = document.getElementById('protect-durration').value, reason = document.getElementById('protect-reason').value; ajaxProtect(durration, reason); };
            break;
        case "redirect":
            modal_title = "Create redirect";
            modal_html = '<strong>Redirect:</strong><br /><input type="text" id="redirect-from" style="width: 500px;"></input><br /><strong>To:</strong><br /><input type="text" id="redirect-location" placeholder="Walrus" style="width: 500px"></input>';
            modal_id = "redirect";
            modal_button_name = "Create";
            modal_function_to_call = function () { var from= document.getElementById('redirect-from').value, to = document.getElementById('redirect-location').value; ajaxRedirect(from, to); };
            break;
        case "template":
            modal_title = "Add template";
            modal_html = '<strong>Template name:</strong><br /><input type="text" id="template-name" style="width: 500px;" placeholder="delete"/><br /><strong>Template parameters (seperated by pipe "|"):</strong><br /><input type="text" id="template-parameters" style="width: 500px" placeholder="Spam|~~~~" />';
            modal_id = "template";
            modal_button_name = "Add";
            modal_function_to_call = function () { var name = document.getElementById('template-name').value, param = document.getElementById('template-parameters').value; ajaxTemplate(name, param); };
            break;
        case "batch":
            modal_title;
            modal_html;
            modal_id;
            modal_button_name;
            modal_function_to_call;
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
                    $('#' + modal_id + '').closeModal();
                }
            }, {
                id: "submit",
                defaultButton: true,
                message: modal_button_name,
                handler: modal_function_to_call
            }]
        });
        //Small helper thangs
        document.getElementById('delete-page').value = page_name;
        document.getElementById('move-destination').value = page_name;
    }

    //List of functions
    /* Block user */

    function ajaxBlock(user, expiry, reason) {
        var url = wgServer + '/api.php?action=block&user=' + encodeURIComponent(user) + '&expiry=' + encodeURIComponent(expiry) + '&reason=' + encodeURIComponent(reason) + '&nocreate&autoblock&noemail&format=json&token=' + encodeURIComponent(token);
        $.post(url, function () {
            $('#block').closeModal();
        });
    }

    /* Delete page */

    function ajaxDelete(page, reason) {
        var url = wgServer + '/api.php?action=delete&title=' + encodeURIComponent(page) + '&reason=' + encodeURIComponent(reason) + '&format=json&token=' + encodeURIComponent(token);
        $.post(url, function () {
            $('#delete').closeModal();
            document.location.reload(false);
        });
    }

    /* Move page */

    function ajaxMove(destination, reason) {
        var url;
        if ($('#redirect-check').prop('checked')) {
            url = wgServer + wgScriptPath + '/api.php?action=move&from=' + encodeURIComponent(page_name) + '&to=' + encodeURIComponent(destination) + '&reason=' + encodeURIComponent(reason) + '&format=json&token=' + encodeURIComponent(token);
            $.post(url, function () {
                $('#move').closeModal();
                document.location.reload(false);
            });
        } else {
            url = wgServer + wgScriptPath + '/api.php?action=move&from=' + encodeURIComponent(page_name) + '&to=' + encodeURIComponent(destination) + '&reason=' + encodeURIComponent(reason) + '&format=json&noredirect&token=' + encodeURIComponent(token);
            $.post(url, function () {
               $('#move').closeModal();
               document.location.reload(false);
            });
        }
    }

    /* (Un)Protect page */

    function ajaxProtect(durration, reason) {
        var url;
        if ($('#protect-toggle').prop('checked') === false) {
            url = wgServer + '/api.php?action=protect&title=' + encodeURIComponent(page_name) + '&protections=edit=sysop%7Cmove=sysop&expiry=' + encodeURIComponent(durration) + '&reason=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(token);
            $.post(url, function () {
                $('#protect').closeModal();
            });
        } else {
            url = wgServer + '/api.php?action=protect&title=' + encodeURIComponent(page_name) + '&protections=edit=all%7Cmove=all&token=' + encodeURIComponent(token);
            $.post(url, function () {
                $('#protect').closeModal();
            });
        }
    }

    /* Redirect page */

    function ajaxRedirect(from, to) {
        var Text = '#REDIRECT [[' + to + ']]';
        var url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(from) + '&text=' + encodeURIComponent(Text) + '&summary=Redirecting&format=json&token=' + encodeURIComponent(token);
        $.post(url, function () {
            $('#redirect').closeModal();
            document.location.reload(false);
        });
    }

    /* Template */
  
    function ajaxTemplate(name, param) {
        var sig = '~~' + '~~',
            addtexttalk = '<br /><br /> {{subst:' + text + '}} ' + sig,
            addtextother = '{{' + name + '' + param + '}} <br />',
            reason = "Using The Advanced Version Of [[w:c:dev:QuickTools|QuickTools]]",
            url;
        if (-1 < [1, 3, 5, 7, 9, 11, 13, 15].indexOf(namespace)) {
            url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(page_name) + '&appendtext=' + encodeURIComponent(addtexttalk) + '&summary=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(token);
            $.post(url, function () {
                alert('Template appended!');
            });
        }
        if (-1 < [0, 2, 4, 6, 8, 10, 12, 14].indexOf(namespace)) {
            url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(page_name) + '&prependtext=' + encodeURIComponent(addtextother) + '&summary=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(token);
            $.post(url, function () {
                alert('Template prepended!');
            });
        }
    }
}(this, this.jQuery, this.mediaWiki));
