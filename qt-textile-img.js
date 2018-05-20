// JS QuickTags for Jogger (Textile + img) by Łukasz "Lukem" Wójcik (http://lukem.net)
//
// Adapted from JS QuickTags script by Alex King - http://alexking.org/projects/js-quicktags
//
// Licensed under the LGPL license
// http://www.gnu.org/copyleft/lesser.html
//
// **********************************************************************
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
// **********************************************************************
//
// This JavaScript will insert the tags below at the cursor position in IE and 
// Gecko-based browsers (Mozilla, Camino, Firefox, Netscape). For browsers that 
// do not support inserting at the cursor position (older versions of Safari, 
// OmniWeb) it appends the tags to the end of the content.
//
// Pass the ID of the <textarea> element to the edToolbar and function.
//
// Example:
//
//  <script type="text/javascript">edToolbar('canvas');</script>
//  <textarea id="canvas" rows="20" cols="50"></textarea>

var dictionaryUrl = 'http://pl.wikipedia.org/wiki/';

// inne warianty:
//
// var dictionaryUrl = 'http://en.wikipedia.org/wiki/';
// var dictionaryUrl = 'http://www.answers.com/';
// var dictionaryUrl = 'http://www.dictionary.com/';


var edButtons = new Array();
var edLinks = new Array();
var edOpenTags = new Array();
function edButton(id, display, tagStart, tagEnd, access, open) {
	this.id = id; // nazwa przycisku	
	this.display = display;	// etykietka przycisku
	this.tagStart = tagStart; // tag otwierający
	this.tagEnd = tagEnd; // tag zamykający
	this.access = access; // -1 jeżeli tag nie wymaga zamknięcia
	this.open = open; // -1 jeżeli tag nie wymaga zamknięcia
}

edButtons.push(
	new edButton(
		'ed_bold'
		,'strong'
		,'*'
		,'* '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_italic'
		,'em'
		,'_'
		,'_ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_link'
		,'link'
		,'"Opis linka":'
		,''
		,''
		,-1
	)
);

edButtons.push(
	new edButton(
		'ed_ul'
		,'ul'
		,'* '
		,''
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_ol'
		,'ol'
		,'# '
		,''
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_block'
		,'cytat'
		,'bq. '
		,''
		,''
		,-1
	)
);

edButtons.push(
	new edButton(
		'ed_acronym'
		,'akronim'
		,'Akronim'
		,''
		,''
		,-1
	)
);

edButtons.push(
	new edButton(
		'ed_img'
		,'obrazek'
		,''
		,''
		,''
		,-1
	)
);

var extendedStart = edButtons.length; // poniższe przyciski pojawiają się po kliknięciu "więcej"

edButtons.push(
	new edButton(
		'ed_p'
		,'akapit'
		,'p. '
		,''
		,''
		,-1
	)
);

edButtons.push(
	new edButton(
		'ed_b'
		,'b'
		,'**'
		,'** '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_i'
		,'i'
		,'__'
		,'__ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_del'
		,'del'
		,'-'
		,'- '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_ins'
		,'ins'
		,'+'
		,'+ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_sup'
		,'sup'
		,'^'
		,'^ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_sub'
		,'sub'
		,'~'
		,'~ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_code'
		,'code'
		,'@'
		,'@ '
		,''
	)
);

edButtons.push(
	new edButton(
		'ed_pre'
		,'pre'
		,'pre. '
		,''
		,''
		,-1
	)
);

function edLink(display, URL, newWin) {
	this.display = display;
	this.URL = URL;
	if (!newWin) {
		newWin = 0;
	}
	this.newWin = newWin;
}


edLinks[edLinks.length] = new edLink('','');

function edShowButton(which, button, i) {
	if (button.access) {
		var accesskey = ' accesskey = "' + button.access + '"'
	}
	else {
		var accesskey = '';
	}
	switch (button.id) {
		case 'ed_img':
			document.write('<input type="button" id="' + button.id + '_' + which + '" ' + accesskey + ' class="ed_button" onclick="edInsertImage(\'' + which + '\');" value="' + button.display + '" />');
			break;
		case 'ed_link':
			document.write('<input type="button" id="' + button.id + '_' + which + '" ' + accesskey + ' class="ed_button" onclick="edInsertLink(\'' + which + '\', ' + i + ');" value="' + button.display + '" />');
			break;
		case 'ed_acronym':
			document.write('<input type="button" id="' + button.id + '_' + which + '" ' + accesskey + ' class="ed_button" onclick="edInsertAcronym(\'' + which + '\', ' + i + ');" value="' + button.display + '" />');
			break;
		default:
			document.write('<input type="button" id="' + button.id + '_' + which + '" ' + accesskey + ' class="ed_button" onclick="edInsertTag(\'' + which + '\', ' + i + ');" value="' + button.display + '"  />');
			break;
	}
}

function edShowLinks() {
	var tempStr = '<select onchange="edQuickLink(this.options[this.selectedIndex].value, this);"><option value="-1" selected>(Quick Links)</option>';
	for (i = 0; i < edLinks.length; i++) {
		tempStr += '<option value="' + i + '">' + edLinks[i].display + '</option>';
	}
	tempStr += '</select>';
	document.write(tempStr);
}

function edAddTag(which, button) {
	if (edButtons[button].tagEnd != '') {
		edOpenTags[which][edOpenTags[which].length] = button;
		document.getElementById(edButtons[button].id + '_' + which).value = '/' + document.getElementById(edButtons[button].id + '_' + which).value;
	}
}

function edRemoveTag(which, button) {
	for (i = 0; i < edOpenTags[which].length; i++) {
		if (edOpenTags[which][i] == button) {
			edOpenTags[which].splice(i, 1);
			document.getElementById(edButtons[button].id + '_' + which).value = document.getElementById(edButtons[button].id + '_' + which).value.replace('/', '');
		}
	}
}

function edCheckOpenTags(which, button) {
	var tag = 0;
	for (i = 0; i < edOpenTags[which].length; i++) {
		if (edOpenTags[which][i] == button) {
			tag++;
		}
	}
	if (tag > 0) {
		return true;
	}
	else {
		return false;
	}
}	

function edCloseAllTags(which) {
	var count = edOpenTags[which].length;
	for (o = 0; o < count; o++) {
		edInsertTag(which, edOpenTags[which][edOpenTags[which].length - 1]);
	}
}

function edQuickLink(i, thisSelect) {
	if (i > -1) {
		var newWin = '';
		if (edLinks[i].newWin == 1) {
			newWin = '';
		}
		var tempStr = '"Opis linka":' 
		            + edLinks[i].display;
		thisSelect.selectedIndex = 0;
		edInsertContent(edCanvas, tempStr);
	}
	else {
		thisSelect.selectedIndex = 0;
	}
}

function edSpell(which) {
    myField = document.getElementById(which);
	var word = '';
	if (document.selection) {
		myField.focus();
	    var sel = document.selection.createRange();
		if (sel.text.length > 0) {
			word = sel.text;
		}
	}
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		if (startPos != endPos) {
			word = myField.value.substring(startPos, endPos);
		}
	}
	if (word == '') {
		word = prompt('Wpisz słowo do sprawdzenia:', '');
	}
	if (word != '') {
		window.open(dictionaryUrl + escape(word));
	}
}

function edToolbar(which) {
	document.write('<div id="ed_toolbar_' + which + '"><span>');
	for (i = 0; i < extendedStart; i++) {
		edShowButton(which, edButtons[i], i);
	}
	if (edShowExtraCookie()) {
		document.write(
			'<input type="button" id="ed_close_' + which + '" class="ed_button" onclick="edCloseAllTags(\'' + which + '\');" value="zamknij tagi" />'
			+ '<input type="button" id="ed_spell_' + which + '" class="ed_button" onclick="edSpell(\'' + which + '\');" value="wiki" />'
			+ '<input type="button" id="ed_extra_show_' + which + '" class="ed_button" onclick="edShowExtra(\'' + which + '\')" value="więcej &raquo;" style="visibility: hidden;" />'
			+ '</span><br />'
			+ '<span id="ed_extra_buttons_' + which + '">'
			+ '<input type="button" id="ed_extra_hide_' + which + '" class="ed_button" onclick="edHideExtra(\'' + which + '\');" value="&laquo; mniej" />'
		);
	}
	else {
		document.write(
			'<input type="button" id="ed_close_' + which + '" class="ed_button" onclick="edCloseAllTags(\'' + which + '\');" value="zamknij tagi" />'
			+ '<input type="button" id="ed_spell_' + which + '" class="ed_button" onclick="edSpell(\'' + which + '\');" value="wiki" />'
			+ '<input type="button" id="ed_extra_show_' + which + '" class="ed_button" onclick="edShowExtra(\'' + which + '\')" value="więcej &raquo;" />'
			+ '</span><br />'
			+ '<span id="ed_extra_buttons_' + which + '" style="display: none;">'
			+ '<input type="button" id="ed_extra_hide_' + which + '" class="ed_button" onclick="edHideExtra(\'' + which + '\');" value="&laquo; mniej" />'
		);
	}
	for (i = extendedStart; i < edButtons.length; i++) {
		edShowButton(which, edButtons[i], i);
	}
	document.write('</span>');
	document.write('</div>');
    edOpenTags[which] = new Array();
}


function edShowExtra(which) {
	document.getElementById('ed_extra_show_' + which).style.visibility = 'hidden';
	document.getElementById('ed_extra_buttons_' + which).style.display = 'block';
	edSetCookie(
		'js_quicktags_extra'
		, 'show'
		, new Date("December 31, 2100")
	);
}

function edHideExtra(which) {
	document.getElementById('ed_extra_buttons_' + which).style.display = 'none';
	document.getElementById('ed_extra_show_' + which).style.visibility = 'visible';
	edSetCookie(
		'js_quicktags_extra'
		, 'hide'
		, new Date("December 31, 2100")
	);
}

function edInsertTag(which, i) {
    myField = document.getElementById(which);
	if (document.selection) {
		myField.focus();
	    sel = document.selection.createRange();
		if (sel.text.length > 0) {
			sel.text = edButtons[i].tagStart + sel.text + edButtons[i].tagEnd;
		}
		else {
			if (!edCheckOpenTags(which, i) || edButtons[i].tagEnd == '') {
				sel.text = edButtons[i].tagStart;
				edAddTag(which, i);
			}
			else {
				sel.text = edButtons[i].tagEnd;
				edRemoveTag(which, i);
			}
		}
		myField.focus();
	}
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = myField.scrollTop;
		if (startPos != endPos) {
			myField.value = myField.value.substring(0, startPos)
			              + edButtons[i].tagStart
			              + myField.value.substring(startPos, endPos) 
			              + edButtons[i].tagEnd
			              + myField.value.substring(endPos, myField.value.length);
			cursorPos += edButtons[i].tagStart.length + edButtons[i].tagEnd.length;
		}
		else {
			if (!edCheckOpenTags(which, i) || edButtons[i].tagEnd == '') {
				myField.value = myField.value.substring(0, startPos) 
				              + edButtons[i].tagStart
				              + myField.value.substring(endPos, myField.value.length);
				edAddTag(which, i);
				cursorPos = startPos + edButtons[i].tagStart.length;
			}
			else {
				myField.value = myField.value.substring(0, startPos) 
				              + edButtons[i].tagEnd
				              + myField.value.substring(endPos, myField.value.length);
				edRemoveTag(which, i);
				cursorPos = startPos + edButtons[i].tagEnd.length;
			}
		}
		myField.focus();
		myField.selectionStart = cursorPos;
		myField.selectionEnd = cursorPos;
		myField.scrollTop = scrollTop;
	}
	else {
		if (!edCheckOpenTags(which, i) || edButtons[i].tagEnd == '') {
			myField.value += edButtons[i].tagStart;
			edAddTag(which, i);
		}
		else {
			myField.value += edButtons[i].tagEnd;
			edRemoveTag(which, i);
		}
		myField.focus();
	}
}

function edInsertContent(which, myValue) {
    myField = document.getElementById(which);
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		myField.focus();
	}
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var scrollTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos)
		              + myValue 
                      + myField.value.substring(endPos, myField.value.length);
		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
		myField.scrollTop = scrollTop;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}

function edInsertLink(which, i, defaultValue) {
    myField = document.getElementById(which);
	if (!defaultValue) {
		defaultValue = 'http://';
	}
	if (!edCheckOpenTags(which, i)) {
		var URL = prompt('Wpisz adres URL:' ,defaultValue);
		var desc = prompt('Wpisz nazwę linku:');
		if (URL) {
			edButtons[i].tagStart = '"' + desc + '":' + URL + ' ';
			edInsertTag(which, i);
		}
	}
	else {
		edInsertTag(which, i);
	}
}

function edInsertImage(which) {
    myField = document.getElementById(which);
	var myValue = prompt('Wpisz adres URL obrazka:', 'http://');
	if (myValue) {
		myValue = '!' + myValue + '(' + prompt('Wpisz opis obrazka:', '') + ')!\n\n';
		edInsertContent(which, myValue);
	}
}



function edInsertAcronym(which, i, defaultValue) {
    myField = document.getElementById(which);
	if (!defaultValue) {
		defaultValue = '';
	}
	if (!edCheckOpenTags(which, i)) {
		var akronim = prompt('Wpisz nazwę akronimu:' ,defaultValue);
		var title = prompt('Wpisz rozwinięcie akronimu:');
		if (akronim) {
			edButtons[i].tagStart = akronim + '(' + title + ') ';
			edInsertTag(which, i);
		}
	}
	else {
		edInsertTag(which, i);
	}
}

function edSetCookie(name, value, expires, path, domain) {
	document.cookie= name + "=" + escape(value) +
		((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "");
}

function edShowExtraCookie() {
	var cookies = document.cookie.split(';');
	for (var i=0;i < cookies.length; i++) {
		var cookieData = cookies[i];
		while (cookieData.charAt(0) ==' ') {
			cookieData = cookieData.substring(1, cookieData.length);
		}
		if (cookieData.indexOf('js_quicktags_extra') == 0) {
			if (cookieData.substring(19, cookieData.length) == 'show') {
				return true;
			}
			else {
				return false;
			}
		}
	}
	return false;
}
