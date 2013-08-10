var rcModule = '<section class="module"><h1>' + 'Recent Changes' + '</h1>' + '<div id="rc-module"><ul id="rc-list"><li id="ch1"></li><li id="ch2"></li><li id="ch3"></li><li id="ch4"></li><li id="ch5"></li><li id="ch6"></li><li id="ch7"></li><li id="ch8"></li><li id="ch9"></li><li id="ch10"></li></ul></div>' + '</section>';
$('#WikiaRail').prepend(rcModule);
 
updateRC()
setInterval(function() {updateRC()}, 30000);
 
function updateRC() {
    "use strict";
    $.getJSON(wgServer + '/api.php?action=query&list=recentchanges&rclimit=10&rctype=edit&rcprop=user|timestamp|title&format=json', function(data) {
        var rc = data.query.recentchanges;
        $('#ch1').html('Page: <a href="/wiki/' + rc[0].title + '">' + rc[0].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[0].user + '">' + rc[0].user + '</a><br />');
        $('#ch2').html('Page: <a href="/wiki/' + rc[1].title + '">' + rc[1].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[1].user + '">' + rc[1].user + '</a><br />');
        $('#ch3').html('Page: <a href="/wiki/' + rc[2].title + '">' + rc[2].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[2].user + '">' + rc[2].user + '</a><br />');
        $('#ch4').html('Page: <a href="/wiki/' + rc[3].title + '">' + rc[3].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[3].user + '">' + rc[3].user + '</a><br />');
        $('#ch5').html('Page: <a href="/wiki/' + rc[4].title + '">' + rc[4].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[4].user + '">' + rc[4].user + '</a><br />');
        $('#ch6').html('Page: <a href="/wiki/' + rc[5].title + '">' + rc[5].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[5].user + '">' + rc[5].user + '</a><br />');
        $('#ch7').html('Page: <a href="/wiki/' + rc[6].title + '">' + rc[6].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[6].user + '">' + rc[6].user + '</a><br />');
        $('#ch8').html('Page: <a href="/wiki/' + rc[7].title + '">' + rc[7].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[7].user + '">' + rc[7].user + '</a><br />');
        $('#ch9').html('Page: <a href="/wiki/' + rc[8].title + '">' + rc[8].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[8].user + '">' + rc[8].user + '</a><br />');
        $('#ch10').html('Page: <a href="/wiki/' + rc[9].title + '">' + rc[9].title + '</a><br />User: <a href="/wiki/Special:Contributions/' + rc[9].user + '">' + rc[9].user + '</a>');
    });
}
