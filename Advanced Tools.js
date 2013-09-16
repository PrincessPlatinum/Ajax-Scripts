if ( skin === 'oasis' || skin === 'wikia' ) {
    var node = document.createElement('a');
        node.textContent = "Advanced Tools";
        node.className = "wikia-button";
        node.id = "advanced_tools";
        node.addEventListener('click', function () {
            mainFunct();
        });
    $('li.start-a-wiki').html($(node));
} else {
    $('<li id="ca-at"><a onclick="mainFunct();">Advanced Tools</a></li>').appendTo( '#p-cactions > .pBody > ul' );
}

function mainFunct() {
    var form_HTML = '<form class="WikiaForm" method="" name=""><fieldset><h2 style="text-align: center">Tools</h2><br /><hr /><div style="text-align: center;"><a class="wikia-button" onclick="blockMod();">Block user</a>&nbsp;<a class="wikia-button" onclick="deleteMod();">Delete page</a>&nbsp;<a class="wikia-button" onclick="openWindow();">Message user</a>&nbsp;<a class="wikia-button" onclick="moveMod();">Move page</a>&nbsp;<a class="wikia-button" onclick="protectMod();">(Un)Protect page</a>&nbsp;<a class="wikia-button" onclick="purgePage();">Purge page</a><br /><br /><a class="wikia-button" onclick="redirectMod();">Redirect page</a>&nbsp;<a class="wikia-button"onclick="FixRedlinks();">Remove redlinks</a>&nbsp;<a class="wikia-button" href="/index.php?title=' + encodeURIComponent( wgPageName ) + '&useskin=monobook">Switch skin</a>&nbsp;<a class="wikia-button" onclick="ajaxTemplate();">Add template</a>&nbsp;<a class="wikia-button" onclick="ajaxUnsigned">Add unsigned</a>&nbsp;<a class="wikia-button" onclick="bdMod();">Batch delete</a></div></feildset></form>';

    $.showCustomModal("Advanced Tools", form_HTML, {
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
}


//Variables
var $ = this.jQuery,
    mw = this.mediaWiki,
    wgPageName = mw.config.get('wgPageName'),
    wgServer = mw.config.get('wgServer'),
    wgScriptPath = mw.config.get('wgScriptPath'),
    EditToken = mw.user.tokens.values.editToken,
    PageID = mw.config.get('wgArticleId'),
    Namespace = mw.config.get('wgNamespaceNumber'),
    Signature = '~~' + '~~';

//Pagename fixes
var wgPageName = wgPageName.replace(/_/g, ' ');

//Functions
//Frontend
//Block modal

function blockMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("Block user", '<form class="WikiaForm" method="" name=""><fieldset><strong>Username/IP to block:</strong><br /><input type="text" id="block-username" placeholder="Username/IP" style="width: 500px"></input><br /><strong>Duration of the block:</strong><br /><input type="text" id="block-duration" placeholder="2 Weeks" style="width: 500px"></input><br /><strong>Reason for blocking:</strong><br /><input type="text" id="block-reason" placeholder="Vandalism" style="width: 500px"></input></feildset></form>', {
        id: "block-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Cancel",
            handler: function () {
                $('#block-modal').closeModal();
            }
        }, {
            id: "submit",
            defaultButton: true,
            message: "Block",
            handler: function () {
                ajaxBlock();
            }
        }]
    });
}

function deleteMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("Delete page", '<form class="WikiaForm" method="" name=""><fieldset><strong>Title of page to delete:</strong><br/><input type="text" id="delete-page" style="width: 500px;"></input><br /><strong>Reason for deleting: </strong><br /><input type="text" id="delete-reason" placeholder="Spam" style="width: 500px;"></input></feildset></form>', {
        id: "delete-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Cancel",
            handler: function () {
                $('#delete-modal').closeModal();
            }
        }, {
            id: "submit",
            defaultButton: true,
            message: "Delete",
            handler: function () {
                ajaxDelete();
            }
        }]
    });

    document.getElementById('delete-page').value = wgPageName;
}

function moveMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("Move page", '<form class="WikiaForm" method="" name=""><fieldset><strong>Page destination:</strong><br /><input type="text" id="move-destination" placeholder="I ran out of ideas..." style="width: 500px"></input><br /><strong>Reason for moving: </strong><br /><input type="text" id="move-reason" placeholder="I like this better" style="width: 500px;"></input><br /><strong>Leave a redirect </strong><input type="checkbox" id="redirect-check" /></feildset></form>', {
        id: "move-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Cancel",
            handler: function () {
                $('#move-modal').closeModal();
            }
        }, {
            id: "submit",
            defaultButton: true,
            message: "Move",
            handler: function () {
                ajaxMove();
            }
        }]
    });
}

function protectMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("(Un)Protect page", '<form class="WikiaForm" method="" name=""><fieldset><strong>Check to unprotect, Un-Check to protect : </strong><input type="checkbox" id="protect-toggle"></input><br /><strong>Durration of protection:</strong><br /><input type="text" id="protect-durration" style="width: 500px;" placeholder="3 days"></input><br /><strong>Reason for (Un)Protecting: </strong><br /><input type="text" id="protect-reason" placeholder="Vandalism" style="width: 500px;"></input></feildset></form>', {
        id: "protect-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Cancel",
            handler: function () {
                $('#protect-modal').closeModal();
            }
        }, {
            id: "submit",
            defaultButton: true,
            message: "(Un)Protect",
            handler: function () {
                ajaxProtect();
            }
        }]
    });
}

function redirectMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("Redirect page", '<form class="WikiaForm" method="" name=""><fieldset><strong>Redirect:</strong><br /><input type="text" id="redirect-from" style="width: 500px;"></input><br /><strong>To:</strong><br /><input type="text" id="redirect-location" placeholder="Walrus" style="width: 500px"></input></feildset></form>', {
        id: "redirect-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Cancel",
            handler: function () {
                $('#redirect-modal').closeModal();
            }
        }, {
            id: "submit",
            defaultButton: true,
            message: "Redirect",
            handler: function () {
                ajaxRedirect();
            }
        }]
    });

    document.getElementById('redirect-from').value = wgPageName;
}

function bdMod() {
    $('#advancedtools').closeModal();
    $.showCustomModal("Batch delete", '<form class="WikiaForm" method="" name=""><fieldset><textarea id="abd-textarea" style="height: 20em;width: 500px;"></textarea><p><label for="abd-reason">Delete reason:</label><input id="abd-reason"style="width: 20em;" type="text"></p><p><input id="abd-startbutton" type="button" value="start" onclick="ajaxDeleteStart();"></p><pre style="width: 500px; height: 60px; overflow: scroll;" id="abd-output"></pre></feildset></form>', {
        id: "bd-modal",
        width: 650,
        buttons: [{
            id: "cancel",
            message: "Close",
            handler: function () {
                $('#bd-modal').closeModal();
            }
        }]
    });
}

//Backend
//Block User

function ajaxBlock() {
    var BlockUser = document.getElementById('').value,
        Expiry = document.getElementById('').value,
        Reason = document.getElementById('').value,
        url = wgServer + '/api.php?action=block&user=' + encodeURIComponent(BlockUser) + '&expiry=' + encodeURIComponent(Expiry) + '&reason=' + encodeURIComponent(Reason) + '&nocreate&autoblock&noemail&format=json&token=' + encodeURIComponent(EditToken);
    $.post(url, function () {
        $('#block-modal').closeModal();
        alert(BlockUser + ' has been blocked.');
    });
}

//Delete Page

function ajaxDelete() {
    var DeletePage = document.getElementById('delete-page').value,
        DeleteReason = document.getElementById('delete-reason').value;
    var url = wgServer + '/api.php?action=delete&title=' + encodeURIComponent(DeletePage) + '&reason=' + encodeURIComponent(DeleteReason) + '&format=json&token=' + encodeURIComponent(EditToken);
    $.post(url, function () {
       $('#delete-modal').closeModal();
       document.location.reload(false);
    });
}

//Message functions

function openWindow() {
    if (Namespace === 3) {
        var windowHTML = $.showCustomModal("Message Form", '<form class="WikiaForm" method="" name=""><fieldset><strong>Message title:</strong><br/><input id="message-header" type="text" placeholder="Enter message title here." style="width: 500px"/><br/><br/><strong>Message:</strong><br/><textarea id="message-body" cols="80" rows="10" placeholder="Write your message to me here."></textarea></feildset></form>', {
            id: "messageWindow",
            width: 600,
            buttons: [{
                id: "cancel",
                message: "Cancel",
                handler: function () {
                    cancelChanges();
                }
            }, {
                id: "submit",
                defaultButton: true,
                message: "Submit",
                handler: function () {
                    submitForm();
                }
            }]
        });
    } else {
        alert("This function is to be used on user talk pages only!");
    }
}

function cancelChanges() {
    $('#messageWindow').closeModal();
}

function submitForm() {
    var header = document.getElementById("message-header").value || 'null',
        body = document.getElementById("message-body").value || 'null';

    if (header === 'null' || body === 'null') {
        alert("Please fully complete the form before sending!");
        return;
    } else {
        var editToken = mw.user.tokens.values.editToken;
        var url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(wgPageName) + '&section=new&sectiontitle=' + encodeURIComponent(header) + '&text=' + encodeURIComponent(body) + '&token=' + encodeURIComponent(editToken);
        $.post(url, function () {
            $('#messageWindow').closeModal();
            window.location.reload();
        });
    }
}

//Move Page

function ajaxMove() {
    var Destination = document.getElementById('move-destination').value,
        MoveReason = document.getElementById('move-reason').value;
    var url;
    if ($('#redirect-check').prop('checked')) {
        url = wgServer + wgScriptPath + '/api.php?action=move&from=' + encodeURIComponent(wgPageName) + '&to=' + encodeURIComponent(Destination) + '&reason=' + encodeURIComponent(MoveReason) + '&format=json&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
            $('#move-modal').closeModal();
            document.location.reload(false);
        });
    } else {
        url = wgServer + wgScriptPath + '/api.php?action=move&from=' + encodeURIComponent(wgPageName) + '&to=' + encodeURIComponent(Destination) + '&reason=' + encodeURIComponent(MoveReason) + '&format=json&noredirect&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
           $('#move-modal').closeModal();
           document.location.reload(false);
        });
    }
}

//Protect

function ajaxProtect() {
    var url;
    if ($('#protect-toggle').prop('checked') === false) {
        var durration = document.getElementById('protect-durration').value,
            reason = document.getElementById('protect-reason').value;
        url = wgServer + '/api.php?action=protect&title=' + wgPageName + '&protections=edit=sysop%7Cmove=sysop&expiry=' + encodeURIComponent(durration) + '&reason=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
            $('#protect-modal').closeModal();
        });
    } else {
        url = wgServer + '/api.php?action=protect&title=' + wgPageName + '&protections=edit=all%7Cmove=all&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
            $('#protect-modal').closeModal();
        });
    }
}

//Purge

function purgePage() {
    var page = encodeURIComponent(wgPageName);
    $.get('/index.php?title=' + page + '&action=purge', function () {
        location.reload(true);
    });
}

//Redirect

function ajaxRedirect() {
    var RedirectFrom = document.getElementById('redirect-from').value;
    var RedirectTo = document.getElementById('redirect-location').value;
    var Text = '#REDIRECT [[' + RedirectTo + ']]';
    var url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(RedirectFrom) + '&text:' + encodeURIComponent(Text) + '&summary:Redirecting&format=json&token=' + encodeURIComponent(EditToken);
    $.post(url, function () {
        $('#redirect-modal').closeModal();
        document.location.reload(false);
    });
}

/*##################################################*/
/*# Red Link Fixer                                                                          
/*# Idea by Madnessfan34537                                                      
/*# Code by Madnessfan34537 and Monchoman45        
/*##################################################*/

function FixRedlinks() {
    $.getJSON('/api.php?action=query&prop=revisions&titles=' + encodeURIComponent(wgPageName) + '&rvprop=content&indexpageids=1&format=json', function (result) {
        var text = result.query.pages[result.query.pageids[0]].revisions[0]['*'];
        var redlinks = $('a.new');

        var ref = 0;
        while (text.indexOf('[[', ref) != -1) {
            if (text.indexOf(']]', text.indexOf('[[', ref)) != -1) {
                var open = text.indexOf('[[', ref);
                var pipe = text.indexOf('|', open);
                var close = text.indexOf(']]', open);
                if (text.indexOf('<br/>', open) != -1 && text.indexOf('<br/>', open) < close) {
                    ref = open + 1;
                    continue;
                }
                if (pipe != -1 && pipe < close) { //is [[page|display]]
                    if (pipe == close - 1) {
                        var title = text.substring(open + 2, pipe);
                        var display = title.substring(title.indexOf(':') + 1);
                    } else {
                        var title = text.substring(open + 2, pipe);
                        var display = text.substring(pipe + 1, close);
                    }
                } else { //is [[page]]
                    var title = text.substring(open + 2, close);
                    var display = title;
                }
                if (!title) {
                    ref = open + 1;
                    continue;
                } //skip [[]] and [[|<anything>]]

                for (var i = 0; i < redlinks.length; i++) {
                    var utitle = title[0].toUpperCase() + title.substring(1);
                    if (redlinks[i].title.indexOf(' (page does not exist)')) {
                        var redlink = redlinks[i].title.substring(0, redlinks[i].title.length - 22);
                    } else {
                        var redlink = redlinks[i];
                    }
                    if (utitle == redlink || utitle == ':' + redlink) {
                        if (pipe == close - 1) {
                            var show = title;
                        } else {
                            var show = display;
                        }
                        text = text.substring(0, open) + show + text.substring(close + 2);
                        break;
                    }
                }
                ref = open + 2;
            } else {
                break;
            }
        }

        $.getJSON('/api.php?action=query&prop=info&titles=' + encodeURIComponent(wgPageName) + '&intoken=edit&indexpageids=1&format=json', function (result) {
            $.post('/api.php', {
                action: 'edit',
                title: wgPageName,
                text: text,
                summary: 'Fixing redlinks',
                token: EditToken
            }, function () {
                window.location.reload();
            });
        });
    });
}

//Template

function ajaxTemplate() {
    var text = prompt('Template Name', 'Blacklist'),
        sig = '~~' + '~~',
        addtexttalk = '<br /><br /> {{SUBST:Template:' + text + '}}' + sig,
        addtextother = '{{Template:' + text + '}}<br />',
        reason = "Using The [[w:c:dev:AjaxTemplate|Ajax Template]] Script",
        namespace = mw.config.get('wgNamespaceNumber'),
        url;
    if (text === null) {
        return false;
    }
    if (-1 < [1, 3, 5, 7, 9, 11, 13, 15].indexOf(namespace)) {
        url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(wgPageName) + '&appendtext=' + encodeURIComponent(addtexttalk) + '&summary=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
            alert('Template appended!');
        });
    }
    if (-1 < [0, 2, 4, 6, 8, 10, 12, 14].indexOf(namespace)) {
        url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(wgPageName) + '&prependtext=' + encodeURIComponent(addtextother) + '&summary=' + encodeURIComponent(reason) + '&token=' + encodeURIComponent(EditToken);
        $.post(url, function () {
            alert('Template prepended!');
        });
    }
}

//Unsigned

function ajaxUnsigned() {
    //Check to see if page is in the name space we want
    if (-1 < [1, 3, 4, 5, 7, 9, 11, 13, 15, 110].indexOf(Namespace)) {
        //Sets up variables and gets info from the server
        var pageId = mw.config.get('wgArticleId');
        $.getJSON("/api.php", {
            action: "query",
            prop: "revisions",
            titles: wgPageName,
            rvprop: "user",
            format: "json",
            indexpageids: 1
        }, function (json) {
            var user = json.query.pages[pageId].revisions[0].user,
                addText = '{{Unsigned|' + user + '}}';
            //Posts info to the server
            url = wgServer + '/api.php?action=edit&title=' + encodeURIComponent(wgPageName) + '&appendtext=' + encodeURIComponent(addText) + '&summary=Adding_unsigned_template_for_' + encodeURIComponent(user) + '&token=' + encodeURIComponent(EditToken);
            $.post(url, function () {
                alert('Unsigned template has been added!');
            });
        });
    } else {
        return;
    }
}

//Ajax Batch Delete

function ajaxDeleteStart() {
    document.getElementById('abd-startbutton').setAttribute('disabled', 'disabled');
    var txt = document.getElementById('abd-textarea'),
        deletes = txt.value.split('\n'),
        page = deletes[0],
        reason = document.getElementById('abd-reason').value,
        badchars = /(\#|<|>|\[|\]|\{|\}|\|)/;
    if (page === '') {
        $('#abd-output').append('* Done! Nothing left to do, or next line is blank.\n');
        document.getElementById('abd-startbutton').removeAttribute('disabled');
    } else {
        if (badchars.test(page)) {
            $('#abd-output').append('! Illegal characters detected, skipping:' + page + '\n');
            setTimeout(ajaxDeleteStart, 1000);
        } else {
            $('#abd-output').append('> Attempting to delete [[' + page + ']]\n');
            ajaxBatchDeleteAPage(page, reason);
        }
    }
    deletes = deletes.slice(1, deletes.length);
    txt.value = deletes.join('\n');
}

function ajaxBatchDeleteAPage(title, deleteReason) {
    var token = mw.user.tokens.get('editToken'),
        url = wgServer + wgScriptPath + '/api.php?action=delete&title=' + window.encodeURIComponent(title) + '&reason=' + window.encodeURIComponent(deleteReason) + '&format=json&token=' + window.encodeURIComponent(token);

    $.post(url, function (data) {
        if (data.error) {
            $('#abd-output').append('  > Error: ' + data.error.info + '\n');
        } else {
            $('#abd-output').append('  > Deleted\n');
        }
        setTimeout(ajaxDeleteStart, 1000);
    });
}

if (mw.config.get("wgNamespaceNumber") === -1) {
    $('#WikiaArticle').prepend('<textarea id="output-box" rows="10" cols="100"></textarea>');

    $('ol.special').find('li').each(function() {
        var text = $(this).find('a').first().text();
        document.getElementById('output-box').value += text + '\n';
    });
}
