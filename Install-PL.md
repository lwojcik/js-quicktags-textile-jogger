==O skrypcie==

'''Uwaga: Textile na Joggerze został zastąpiony przez Markdown.'''

Skrypt umożliwia wstawianie znaczników [[Textile]] za pomocą niewielkiego panelu umieszczonego w formularzu komentowania. Dzięki temu komentujący nie musi znać składni, by móc skorzystać z jej funkcji, np. do wstawienia linku, fragmentu kodu czy cytatu.

Dostępne są cztery wersje skryptu, obsługujące Textile i Textile Lite (z obrazkami lub bez).

==Instalacja==

* Wybieramy wersję skryptu stosowną do używanej przez nas składni i pobieramy ją [http://lukem.net/2008/09/05/tagi-textile-w-komentarzach-skrypt-js/ stąd].
* Umieszczamy skrypt w katalogu /files/ naszego Joggera (Szablony > Pliki).
* W sekcji ''meta'' szablonu komentarzy umieszczamy odwołanie do skryptu, zmieniając odpowiednio jego nazwę (poniższy przykład dotyczy wersji dla Textile z obrazkami):
 &lt;script type="text/javascript" src="/files/qt-textile-img.js"&gt;&lt;/script&gt;
* W miejscu, gdzie chcemy wstawić panel umieszczamy następujący kod:
 &lt;script type="text/javascript"&gt;edToolbar('commbody')&lt;/script&gt;
gdzie '''commbody''' to identyfikator pola ''textarea'', do którego wpisuje się treść komentarza. Aby panel pojawił się nad polem treści komentarza, kod powinien znaleźć się bezpośrednio przed znacznikiem ''&lt;textarea /&gt;''.

==Modyfikacje skryptu==

===Pozycja elementów panelu===

Część funkcji jest domyślnie ukryta - można je wyświetlić klikając na przycisk "więcej". Aby zmodyfikować ustawienie przycisków funkcji w panelu, musimy odszukać w skrypcie ich definicje - zaczynają się one od ''edButtons.push'', np.

 edButtons.push(
    new edButton(
        'ed_ul'
        ,'ul'
        ,'* '
        ,''
        ,''
    )
 );

Aby dana funkcja panelu była zawsze widoczna (tzn. umieszczona w pierwszej linii), odpowiadający jej fragment kodu musi być umieszczony przed linijką

 var extendedStart = edButtons.length;

===Zmiana słownika===

* Domyślnie używanym słownikiem (przycisk "wiki") jest [http://pl.wikipedia.org/ polska Wikipedia]. Aby to zmienić, należy odnaleźć w skrypcie linijkę

 var dictionaryUrl = '<nowiki>http://pl.wikipedia.org/wiki/</nowiki>';

i zamiast ''<nowiki>http://pl.wikipedia.org/wiki/</nowiki>'' wstawić adres URL innego słownika, np.

* <nowiki>http://en.wikipedia.org/wiki/</nowiki>
* <nowiki>http://answers.com/</nowiki>
* <nowiki>http://dictionary.reference.com/browse/</nowiki>
* <nowiki>http://sjp.pwn.pl/lista.php?co=</nowiki>

'''Uwaga:''' Wybrany słownik/encyklopedia musi obsługiwać przesyłanie szukanego hasła przez adres URL podstrony (np. <nowiki>http://sjp.pwn.pl/lista.php?co=</nowiki>'''hasło''')

===Wygląd przycisków===

* Przyciski można ostylować, dodając do arkusza CSS regułę:

 .ed_button {
 // parametry CSS
 }

==Credits==

* Skrypt powstał na bazie JS-Quicktags autorstwa Alexa Kinga i jest udostępniany na licencji LGPL. [http://alexking.org/projects/js-quicktags/]
* Autorem modyfikacji jest Łukasz "Lukem" Wójcik. [http://lukem.net/] 

[[Kategoria:Pomoc]]
