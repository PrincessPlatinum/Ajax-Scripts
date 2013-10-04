//Made by Prince(ss) Platinum

$(function () {
    if (mw.config.get("wgPageName").indexOf("Special:WhatLinksHere") > -1) {
        $('#mw-content-text').append('&nbsp;(<a id="redlinks-fix" href="javascript:void(0)">Fix all redlinks</a>)<img src="http://images2.wikia.nocookie.net/__cb20120926174803/dev/images/8/82/Facebook_throbber.gif" id="throbber" style="display: none"></img>');
    }

    $('#redlinks-fix').click(function() { findLinks(); $('#throbber').css('display', ''); setTimeout($('#throbber').css('display', 'none'), 5000); });

    function findLinks() {
        var pages = $("#mw-whatlinkshere-list").find('a').text();
            pages2 = pages.split(/← links/g);
        for (var i = 0; i < pages2.length; i++) {
            beginFixer(pages2[i]);
        }
    }

    function beginFixer(page_name) {
        $.getJSON('/api.php?action=query&prop=revisions&titles=' + encodeURIComponent(page_name) + '&rvprop=content&indexpageids=1&format=json', function (result) {
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
                    if (pipe != -1 && pipe < close) {
                        if (pipe == close - 1) {
                            var title = text.substring(open + 2, pipe);
                            var display = title.substring(title.indexOf(':') + 1);
                        } else {
                            var title = text.substring(open + 2, pipe);
                            var display = text.substring(pipe + 1, close);
                        }
                    } else {
                        var title = text.substring(open + 2, close);
                        var display = title;
                    } if (!title) {
                        ref = open + 1;
                        continue;
                    }
                    for (var i = 0; i < redlinks.length; i++) {
                        var utitle = title[0].toUpperCase() + title.substring(1);
                        if (redlinks[i].title.indexOf(' (page does not exist)')) {
                            var redlink = redlinks[i].title.substring(0, redlinks[i].title.length - 22);
                        } else {
                            var redlink = redlinks[i];
                        } if (utitle == redlink || utitle == ':' + redlink) {
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
            $.getJSON('/api.php?action=query&prop=info&titles=' + encodeURIComponent(page_name) + '&intoken=edit&indexpageids=1&format=json', function (result) {
                $.post('/api.php', {
                    action: 'edit',
                    title: page_name,
                    text: text,
                    summary: 'Fixing redlinks',
                    token: mw.user.tokens.values.editToken
                });
            });
        });
    }
});
