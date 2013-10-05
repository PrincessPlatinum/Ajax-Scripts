(function (mw, $) {
    $('.mw-rev-head-action').append('&nbsp;(<a href="javascript:void(0)">Rollback</a>)&nbsp;').attr('id', 'ajax-rollback').click(function() {
        var username = prompt('Please enter your username to confirm this action.');
        if (username === mw.config.get('wgUserName')) {
            continueOperation();
        } else {
            alert('Confirmation failed, action aborted');
        }
    });

    function continueOperation() {
        (new mw.Api()).get({
            action: 'query',
            prop: 'revisions',
            titles: mw.config.get('wgPageName'),
            rvprop: 'user|ids',
            rvlimit: '50',
            format: 'json'
        }).done(function (result) {
            var i = 0,
                currentrev, lastcleanrev, revisions = result.query.pages[mw.config.get('wgArticleId')].revisions;
            // Iterate over the revisions authored by the same user and cache the first clean rev & the current one	    
            do {
                i++;
            } while (revisions[i].user === revisions[i - 1].user);
            currentrev = revisions[0].revid;
            lastcleanrev = revisions[i].revid;

            // Edit the page
            (new mw.Api()).post({
                action: 'edit',
                undo: currentrev,
                undoafter: lastcleanrev,
                title: mw.config.get('wgPageName'),
                token: mw.user.tokens.get('editToken')
            });
        });
    }
}(mediaWiki, jQuery));
