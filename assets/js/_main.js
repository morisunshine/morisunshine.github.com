/*! Plugin options and other jQuery stuff */// dl-menu options$(function() {    $( '#dl-menu' ).dlmenu({      animationClasses : { classin : 'dl-animate-in', classout : 'dl-animate-out' }    });    //jerryni's edit    hljs.initHighlightingOnLoad();	var arr_content_height = [],		DEFAULT_CONTENT_HEIGHT = 200;	$(".hentry").each(function( index, obj ) {		var $descriptionArea = $(obj).find( ".entry-description" );		var $contentArea = $(obj).find(".entry-content"),			$fullTextArea = $contentArea.find( ".full-text" ),			$collapseArea = $contentArea.find( ".collapse-text" );		//截取内容中的前250字，过滤掉空格回车，加上...，加上“全文”链接,正则：过滤末尾的中文标点和所有回车		var text_cut = $descriptionArea.text().substring(0, 250).replace( /([\r\n])|([^\u4e00-\u9fa5]$)/g, "" ) + "......";		//放到一个新div中		$collapseArea.append( text_cut );		$fullTextArea.hide();		$descriptionArea.hide();		$contentArea.find( ".collapse-toggle" ).click( function() {			if ( $fullTextArea.is( ":visible" ) ) { //点击收起				$collapseArea.show();				$fullTextArea.hide();				$( this ).removeClass("collapsed");				//滚动到下一个hentry,如果没有，就最后一个				var $next = $( obj ).next(".hentry");				if( $next.length > 0 ) {					$( "body, html").scrollTop ( $next.offset().top );				} else {					$( "body, html").scrollTop ( $( obj ).offset().top );				}							} else {				$collapseArea.hide();				$fullTextArea.show();				$( this ).addClass( "collapsed" );				//滚动到当前就行了				$( "body, html").scrollTop ( $( obj ).offset().top );			}		});	});	$( ".go-top" ).click(function() {		$( "body, html" ).animate({			scrollTop: 0		}, "slow" );	});  });// FitVids options$(function() {  $("article").fitVids();});$(".close-menu").click(function () {  $(".menu").toggleClass("disabled");  $(".links").toggleClass("enabled");});$(".about").click(function () {  $("#about").css('display','block');});$(".close-about").click(function () {  $("#about").css('display','');});