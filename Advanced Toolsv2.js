(function(window, $, mw) {
    //Global Variables
    var pageName = mw.config.get( "wgPageName" ),
        server = mw.config.get( "wgServer" ),
        token = mw.user.tokens.values.editToken,
        pageId = mw.config.get( "wgArticleId" ),
        namespace = mw.config.get( "wgNamespaceNumber" ),
        signature = "~~" + "~~";

    //Un-urlencoding pagename
    pageName = pageName.replace(/_/g, ' ');

    //Main menu modal
    
}(this, this.jQuery, this.mediaWiki));
