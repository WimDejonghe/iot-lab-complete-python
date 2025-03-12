---
author: [Wim Dejonghe]
description: [Opbouw OOP lessen IoT.]
ms.date: [CREATION/UPDATE DATE - mm/dd/yyyy]
marp: true
title: [OOP 1 + 2]
---

# MQTT  

![example image](mqtt3.png "An exemplary image")

---

MQTT staat voor MQ Telemetry Transport. Het is een publish / subscribe, extreem eenvoudig en lichtgewicht messaging-protocol, ontworpen voor beperkte apparaten met een lage bandbreedte, hoge latentie (sterk vertragend werkende netwerken) of onbetrouwbare netwerken. De ontwerpprincipes zijn om de bandbreedte van het netwerk en de apparaatvereisten te minimaliseren en tegelijkertijd te proberen betrouwbaarheid en een zekere mate van zekerheid van levering te garanderen. Deze principes blijken het protocol ook ideaal te maken voor de opkomende "machine-to-machine"(M2M) of "Internet of Things-wereld van verbonden apparaten, en voor mobiele toepassingen waar bandbreedte en batterijvermogen beperkt zijn.  

MQTT was invented by Dr Andy Stanford-Clark of IBM, and Arlen Nipper of Arcom (now Eurotech), in 1999.

---

MQTT has been widely implemented across a variety of industries since 1999. 
https://www.youtube.com/watch?v=NtyyfcYQxa4

---

Vanaf maart 2013 is MQTT bezig met standaardisatie bij OASIS. De protocolspecialisatie is al vele jaren openlijk gepubliceerd met een royalty vrije licentie en bedrijven zoals Eurotech (voorheen bekend als Arcom) hebben het protocol geïmplementeerd in hun producten. In november 2011 kondigden IBM en Eurotech hun gezamenlijke deelname aan de Eclipse M2M Industry Working Group en de schenking van MQTT-code aan het voorgestelde Eclipse Paho-project aan.

---

TCP/IP-poort 1883 is gereserveerd bij IANA voor gebruik met MQTT. TCP/IP-poort 8883 is ook geregistreerd voor het gebruik van MQTT via SSL.

---

MQTT is speciaal gebouwd om communicatie over een TCP/IP netwerk te vereenvoudigen. Het communiceren binnen dit protocol zou kunnen gerealiseerd worden door enerzijds een server op te zetten en anderzijds een client. De server zou in dit geval zo zijn ingesteld dat die luistert op een bepaalde poort voor inkomende pakketjes (request). Deze zouden van een client zijn verzonden naar de server (al of niet via DNS of rechtstreeks naar een TCP/IP adres). Hierop zou de server een antwoord sturen naar de client. Een typisch voorbeeld van een dergelijke werking is het HTTP-protocol. Dit protocol draait bovenop het TCP/IP protocol. (HTTP trekt zich niets aan hoe, en langswaar de datapakketjes hun weg zoeken van zender naar ontvanger). Hierbij wordt de poort 80 gebruikt al request kanaal. Een random (gekozen door de client) poort ergens boven de 1024 zou dan als antwoord kanaal gebruikt worden. Tussenliggende routers en switchen zorgen dat de pakketjes heen en weer worden verzonden en de juiste bestemming bereikt.

Voor dergelijke toepassingen moeten een Socket geprogrammeerd worden. Een Socket is een stuk code die de computer (of het netwerk device) in staat stelt om naar een poort adres te luisteren tot een inkomend pakket arriveert. Dit is niet zo eenvoudig te programmeren. Het gebruiken van een MQTT protocol boven het TCP/IP stelt de gebruiker in staat om eenvoudige data te versturen van een client naar een server (publish). Het protocol zorgt ervoor dat het antwoord van de server niet alleen naar de client wordt teruggestuurd, maar dat het ook aan een eventuele geïntereseerde (of meerdere) (subscribers) zal worden medegedeeld.

![example image](mqtt2.png "An exemplary image")

---

Stel je wilt het licht meten met een lichtsensor op een bepaalde plaats. Je wilt ook die gemeten lichtsterkte (waarschijnlijk een analoog getal??, bij een detector zou een digitaal getal volstaan) doorgeven aan een ander device (aangesloten op het internet, bedraad of mobiel). Dan kan je hiervoor het MQTT protocol gebruiken. Hierbij zal het device die het licht meet, ook moeten verbonden zijn aan het internet. Dit device kan zijn data (lichtsterkte) door sturen naar een server. De server wordt bij MQTT een Broker genoemd. De lichtsterkte wordt dus gepubliceerd op de Broker. Dit zal gebeuren in een specifieke `topic` op de broker
.
Een sensor (temperatuur en/of licht) kan de gemeten waarde doorsturen naar de Broker. Dit kan eenmalig zijn of continue. De Broker zal deze gegevens opslaan in een specifieke `topic`. Een gebouwbeheersapplicatie kan zich abonneren op deze gegevens (`topic`) en zal dus deze waarden weten / kennen / doorgestuurd krijgen. Bij bepaalde sensorwaarden kan de gebouwenbeheersapplicatie beslissen om bijvoorbeeld de rolluiken neer te laten. Hiervoor gebruikt de applicatie ook de Broker om via een andere (of dezelfde, maar dan wordt het een beetje ingewikkeld) `topic` een commando te sturen (publishen) naar het device die de rolluiken kan activeren (dit device is dus een subscriber op deze laatste topic).

De node die de rolluiken bediend is op zijn beurt geabonneerd (subscribed) op de `topic` en zal de rolluiken activeren. Eventueel kan nu nog een controle worden ingebouwd door de rolluiken node via een eindeloopsensor op de rolluik het einde van het proces te laten bevestigen naar de beheersapplicatie. Dit kan opnieuw via de Broker worden uitgevoerd.

![example image](mqtt3.jpg "An exemplary image")

---

Het MQTT protocol is dus een berichten wachtrij systeem voor lichtgewichte data. Het is tevens een asynchroon communicatiemodel dat werkt op berichten op basis van een bepaalde gebeurtenis (event). Het protocol voorziet een beperkte overhead (2 bytes) zodat het heel geschikt is voor netwerken met een lage bandbreedte (lees: geschikt voor trage netwerken).
Zoals in het voorbeeld duidelijk werd gesteld, werkt het protocol volgens een publish (publiceer een `topic`) en subscribe (abonneer op een `topic`) model. Er is dus een ontkoppeling van dataproducent (publisher) en dataconsument (subscriber) door `topic`s (berichtenwachtrijen). Het is een eenvoudig protocol, gericht op een lage complexiteit, een laag stroomverbruik en implementaties met weinig footprint zoals WSN netwerken (WSN = Wireless Sensor Networks).
Het protocol werkt via een connection-oriented verbinding (TCP). Door het lichtgewicht protocol is MQTT erg geschikt bij (draadloze) netwerkverstoringen.

---

We werken verder met hetzelfde programma op de Nucleo processor (zie Serial.pdf). Dit zag er zo uit:

```c++
//Nucleo_read_hyperterminal
#include "mbed.h"

Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
char c = '0';
void ToonTekstTerminal (char data);

int main()
{
    ToonTekstTerminal(c);
    while(1) {
        c = pc.getc(); // Read hyperterminal
        if (c == '0') {
            led = 0; // OFF
        }
        if (c == '1') {
            led = 1; // ON
        }
        ToonTekstTerminal(c);
    }
}
void ToonTekstTerminal(char waarde)
{
    pc.printf("De LED1 is %c\r\n", waarde);
    pc.printf("Press '1' to turn LED1 ON, '0' to turn it OFF\r\n");
}
```

We hebben eerder een applicatie en een dashboard gebouwd met Node-Red. We gaan hier nu een stap verder. We zullen nu de nodes binnen Node-Red ook gebruiken om een koppeling te maken met een MQTT broker. Je kan hiervoor de HiveMQ broker voor gebruiken. Je kan natuurlijk ook zelf een broker maken met evt een raspberry PI. Maar die moet steeds toegankelijk zijn voor subscribers en publishers. Omdat die twee wel eens op verschillende plaatsen op het internet hun verbinding maken is het dus best dat de broker op een fixed_IP adres geconnecteerd staat (kan desnoods ook bij Azure of Amazon).  

![example image](hivemq.gif "An exemplary image")

---
## Configuratie Broker

Om de broker te kunnen gebruiken hebben we een `topic` nodig op de broker waar we als publisher onze data willen in plaatsen en die op zijn beurt die data zal doorsturen naar alle subscribers.  
Als we een LED willen aansturen op de Nucleo micocontroller vanaf een mobile device, dan kunnen we volgend schema opstellen:

- Nucleo met zijn aan te sturen LED is een **Subscriber** op die specifieke MQTT `topic`
- Een device waar we de LED willen mee aan sturen (bv een mobile APP) is een **Publisher** naar die specifieke MQTT `topic`

Laat ons nu focussen op die `topic`: Hoe maken we die aan? Wel we gebruiken een gratis MQTT broker nl: HIVEMQ. Deze bezit volgende gegevens (in te stellen via:  hivemq.com/demos/websocket-client/):

- URL: broker.mqttdashboard.com
- Poort: 8000
- ClientID : *****
- Username :  
- Password :  
- Keep Alive : 60  

![example image](hivemq.png "An exemplary image")

Klik op Connect.

Stel we willen daar een unieke `topic` maken voor mijn microcontroller met daarop LED1. De `topic`-structuur kun je zelf bepalen. Hier kies ik volgende structuur:

`VIVES/IoT/WimD/LED1`

In die `topic` zet ik de info (data) die ik zelf wil. Aangezien de communicatie met de Nucleo met een '0' en een '1' gebeurt (zie seriele communicatie), zal ik ook die data-structuur gebruiken om in die `topic` te plaatsen:

![example image](broker1.png "An exemplary image")

Ik kan ook via deze hivemq webpagina mij abonneren op diezelfde `topic`. Klik hiervoor op Subscriptions. Test de werking hiervan:

![example image](broker2.png "An exemplary image")

Nu is het de bedoeling dat we onze Node-Red laten abonneren op deze `topic` zodanig dat die de inhoud van die `topic` binnenkrijgt als daar iemand iets in publiceert. Dit doen we zo:
Plaats eerst een MQTT input node op de flow en verbind de output ervan met een Debug node:

![example image](NodeRedBroker.png "An exemplary image")

Editeer de MQTT input node:

![example image](broker3.png "An exemplary image")

Abonneer op deze `topic` op deze broker:

![example image](broker4.png "An exemplary image")

Test dit door op de webpage van Hivemq eens een '0' en een '1' te publiceren in de juiste `topic`:

![example image](broker5.png "An exemplary image")

Controlleer wat je nu binnen krijgt in Node-Red op het Debug venster:

![example image](mqtt_debug.png "An exemplary image")

Je ziet dat die data mooi binnenkomt. Goed zo!!

Wel nu willen we onze MQTT ontvangen data binnen Node_red doorsturen naar de Nucleo. Aangezien de data content waarschijnlijk ok , dus een '0' en een '1', zou onze LED al moeten reageren. Wijzig hiervoor de Node-Red flow:

![example image](mqtt_nodered.png "An exemplary image")

Stuur nu vanuit de webpagina van HiveMQ een '0' en een '1' om die data in de `topic` te publiceren. De LED zou moeten reageren. Test dit.

Maar we kunnen de gebruiker, die onze LED wenst aan te sturen, toch niet de LED laten bedienen via de website van de MQTT broker (HiveMQ). De gebruiker weet trouwens niet op welke `topic` hij/zij moet publiceren en wat de data binnen die topic moet zijn. Handig zou zijn dat we een Mobile App aplicatie zouden hebben op onze smartphone. Als die, via een Switch-control, afhankelijk van zijn positie, de juiste info (hier '0' of '1') naar de juiste `topic` kan publiceren, dan hebben we toch al een beetje van een IoT-applicatie.

---

## Mobile App

![example image](Android.jpg "An exemplary image")

![example image](LinearMQTT.png "An exemplary image")

Zoals hierboven vermeld willen we hier een mobile App op onze smartphone. We zouden graag hebben dat deze App een MQTT bericht (data) kan doorsturen naar een specifieke topic op een specifieke broker. Er zijn wel meerdere MQTT client of dashboard te vinden op de Store. Wij gebruiken hier : Linear MQTT Dashboard op de PlayStore voor Android toestellen. Download deze App. Voor Apple devices heb ik de beste ervaring met IoT OnOff. Installeer deze App. 

![example image](LinearMQTT.jpg "An exemplary image")

Stel volgende gegevens in (App settings:):

- Server : tcp://broker.hivemq.com  
- Port : 1883  
  
Onderaan kan je een eigen TAB maken (voorbeelden zie TAB #0), neem bijv TAB #1. Met het PLUS-teken kan je een control toevoegen aan de layout. Kies bij Widget type voor *Switch*.  
Geef die een Naam bij Name: bijvoorbeeld LED1
Plaats in de Sub.topic de topic waar er moet in geschreven worden. In mijn voorbeeld is dit dus:

`VIVES/IoT/WimD/LED1`

Een Switch bezit dus twee toestanden, een On- en een Off toestand. Wanneer een toestand is geselecteerd, dan kan er bepaalde data naar de topic worden gepubliceerd. Om het hier eenvoudig te houden gaan we dezelfde data hierin plaatsen die we ook naar de Nucleo controller willen versturen vanuit Node-Red (dan moeten we geen converties van data doen, een convertie is het omvormen van data naar andere data, meestal string bewerkingen). Dus hier respectievelijk een '0' en een '1'.  
Save de App en Run it, working?

![example image](Apple.png "An exemplary image")

![example image](iotonoff.png "An exemplary image")

Voor Apple devices heb ik de beste ervaring met IoT OnOff. Er kan ook wel met de App MQTTool getest worden, maar enkel tekstueel. Er kunnne geen controls op de dashboard worden geplaatst. Met IoT OnOff kan dit wel. Er zijn echter een aantal instellingen die ook hier in de App dienen te gebeuren. Let wel, deze App is gratis maar er kunnen maar een beperkt aantal controls worden gebruikt. Er staat al een demo dashboard in de App en daar staan al sowieso teveel controls op. Je zal er daar moeten wisssen om de App draaiende te krijgen.  

Volgende settings dienen te gebeuren om connectie te kunnen maken met de HiveMQ broker.  

![example image](iotonoff1.png "An exemplary image")

![example image](iotonoff2.png "An exemplary image")

Er wordt opnieuw gewerkt met een Switch control. Verwar dit niet met een switch-statement in C!!.

![example image](iotonoff3.png "An exemplary image")

Door op Edit (rechtsboven) te klikken kan je de controls op deze dashboard wissen of editeren. Je kan natuurlijk nieuwe controls toevoegen. Door nu op het wieletje te drukken van de switch, kan je die control voorzien van parameters. De belangrijkste is hier publish. Hiermee stel je de topic in waarnaar de switch data zal versturen eenmaal die zal worden bediend.  

![example image](iotonoff4.png "An exemplary image")

![example image](iotonoff6.png "An exemplary image")

Enkel de Publish is hier van belang. Let op: Hier moet je bij PUBLISH VALUES de juiste content invullen. In ons geval zal dat hier een 0 en een 1 zijn. In de figuur staat dit echter verkeerd. Je kan echter hier ook een Subscribe op de ze Control instellen. Wat zou hier de bedoeling van zijn? Kan je dit achterhalen?  

Stel dat je met meerdere Publishers zou werken? Dan moet de switch op het dashboard van de NIET-bediener (NIET-publisher) ook aangepast worden op het moment dat een andere publisher de switch zou bedienen.

![example image](iotonoff5.png "An exemplary image")

Let op : in de laatste afbeelding staat er als Topic : garden/sim/lights  , dit moet natuurlijk voor mijn applicatie `VIVES/IoT/WimD/LED1` zijn. Save and test.

Great job. First IoT applicatie is een feit.

---

## Omgekeerd? Toestand ingang µC visualiseren op Mobile App

We hebben in het voorgaande nu data verzonden van de Mobile App (Publisher) naar de broker die op zijn beurt de data heeft verzonden naar de Microcontroller (via Node-Red, want onze microcontroller bezit geen netwerk verbinding). De microcontroller was dus de subscriber (abonnee) (eigenlijk is Node_red de subscriber en stuurt die de data serieel door naar de microcontroller).

Maar het komt wel heel regelmatig voor dat we ook op de App de toestand van de ingangen (digitaal: detectoren of analoog: sensoren) willen visualiseren op de Mobile App. Ook hiervoor zullen MQTT gebruiken waarbij de microcontroller de publisher is en het (mobiel) device waarop we willen visualiseren is dan de abonnee (subscriber).

Dit is echter iets moeilijker en er treden hier en daar enkele problemen op. We proberen die stelselmatig op te lossen.

### Microcontroller

We beginnen bij de microcontroller met de toestand van een button te lezen en die toestand door te sturen via de seriele COM-poort. We zouden kunnen starten met volgende code:

```c++
//UART_Send_Button
#include "mbed.h"

Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
DigitalIn button(USER_BUTTON);
int main()
{
    char c;
    while(1)  
    {
        //We zullen hier om de 2 seconden de toestand van de USER_Button naar buiten sturen
        if(button){c = '1';}
        else {c = '0';}
        pc.printf("%c\n", c);
        wait(2);
    }
}
```

We sturen een Line-Feed (\n) commando mee omdat Node-Red dit standaard verwacht. Bekijk dit in de RealTerm en ook in Node-Red. Verder in de cursus zullen we niet meer werken met een karakter '0' of '1', maar met een string : 'aan' of 'uit'. Dit zal wel duidelijker zijn voor de eindgebruiker.

---

** Interrupt + telwaarde button **  

Je merkt hier al onmiddelijk dat er maar om de 2 seconden wordt gekeken naar die drukknop. Het kan dus goed zijn, als je in die tussentijd op de drukknop drukt en terug loslaat, dat de microcontroller die toestand nooit heeft gezien (je mist maw een klik) en dat die toestand nooit wordt doorgegeven via de COM-poort. Het is aan de ontwikkelaar (en ook afhankelijk van de soort toepassing) om te beslissen of dit ok is of niet.  

Indien dit niet ok is, en je dus iedere klik wenst te zien en door te sturen, dan werk je best met een interrupt (bij iedere klik wordt het normale programma op de controller onderbroken en wordt er gekeken naar de toestand van die drukknop, op die manier mis je nooit een wijziging van de toestand van die digitale ingang) zoals in volgende code (hier wordt dan wel een telwaarde van het aantal kliks op de drukknop doorgegeven):

```cpp
//AntiDender_INTv2
#include "mbed.h"
Serial pc(USBTX, USBRX);
DigitalOut myled(LED1);
DigitalOut led1(PC_0);
DigitalOut led2(PB_3);
DigitalOut led3(PB_5);
DigitalOut led4(PB_4);
DigitalOut led5(PB_10);
DigitalOut led6(PA_8);
DigitalOut led7(PC_7);
DigitalOut led8(PB_6);
DigitalIn mybutton(USER_BUTTON); //
InterruptIn sw1(PA_1);          //deze button wordt gebruikt als Interrupt
DigitalIn sw2(PA_4);
DigitalIn sw3(PB_0);
DigitalIn sw4(PC_1);
Timer debounce;
int teller;
void toggle(void);
int main() 
{
    teller = 0;
    debounce.start();
    sw1.rise(&toggle);
    while(1)  
    {
        pc.printf("some optional text %d \r\n",teller);
        wait(1);     //we sturen maar om de seconde een update, maar missen geen klik
    }
}
void toggle(void)
    {
        //debounce.start();
    if (debounce.read_ms() > 100)
        {
            led1=!led1;
            teller++;
        }
    debounce.reset();
    }
```

Test vorige code in combinatie met de RealTerm

---

We keren terug naar ons eerste programma die dus om de 2 seconden de toestand van een digitale ingang doorgeeft. Dit zou best ok kunnen zijn indien het hier bv. over een toestand van een deur zou gaan. Is de deur open of dicht. Tussen die 2 seconden is het niet nodig om de toestand te kennen.

We vangen dit op in Node-Red:

![example image](NR_ReadButton.png "An exemplary image")

Zoals je in vorige figuur ziet wordt de data die de microcontroller verstuurt (komt dus uit de Serial COM3 Node, in mijn geval) naar twee nodes gestuurd, naar een debug venster (om te te visualiseren in het debud-venster), maar ook naar de dashboard van Node-Red (zie eerder).

Dit willen we nu ook naar een `topic` sturen op de MQTT broker. Om structuur op de broker te garanderen, maken we hiervoor een nieuwe `topic` aan. Bijvoorbeeld:

`VIVES/IoT/WimD/UserButton`

Herneem de stappen die we gezet hebben bij het aanmaken op de HiveMQbroker van de vorige `topic`, en test dit via de webpage van HiveMQ.

![example image](HiveMQ1.png "An exemplary image")

We zien dat we nu twee `topic`'s hebben. Eén voor de LED1 en één voor de UserButton. In beide kan data '0' of '1' staan. Merk op dat bij de UserButton er een '0' wordt weergegeven bij het indrukken.  

**Dit zou moeten bijzonder duidelijk zijn, voor de student, waarom??????**

Iets met actief laag zijn van drukknoppen (Pull-up weerstand en plaats van de drukknop in het elektrisch schema)!!

Het versturen van die data naar de topic doen we als volgt in Node-Red:

![example image](NodeRed_UB.png "An exemplary image")

Zorg ervoor dat je die node juist configureerd (broker + topic):

![example image](NR_MQTTout.PNG "An exemplary image")

In de topic komt dus de content van de data die de microcontroller verstuurt via Node-Red naar de MQTT broker. 

Test wat je binnen krijgt via de website van HiveMQ als er iets wordt verstuurd:

![example image](hivemq2.PNG "An exemplary image")

We zien hier mooi dat de data om de 2 seconden o de broker arriveert. Goed zo.

Nu willen we alleen nog een visualisate van die content op onze smartphone. Hiervoor gaan we binnen dezelfde TAB (waar ook onze LED1 te besturen was) van de Linear MQTT Dashboard APP.
Je moet wel de APP stoppen || om aanpassingen te kunnen doen aan het dashboard.  

De meest eenvoudige Widget die hiervoor kan gebruiken is Value. Als naam kan je hier UserButton gebruiken (tenzij je op de microcontroller een detector hebt geïnstalleerd die deze input van uw microcontroller bedient, dan kan je hier beter de naam : Voordeur kiezen). Deze widget laat je de verwijzen naar de topic die we juist hebben aangemaakt (Linear MQTT dashboard is nog reeds verbonden met je HiveMQ broker , zie settings binnen Linear MQTT Dashboard).

Run de App en je zou een '0' of een '1' moet zien verschijnen (weliswaar met een delay van 2 seconden) bij het indrukken of het loslaten van de drukknop op de Nucleo processor.

Good job.


---

Voila, maar beide applicaties werken hier nog niet simultaan. En dit zal niet zomaar lukken. De reden is dat in het eerste Nucleo programma (om de LED aan te sturen) de processor bij het commando `c = pc.getc();` de processor staat te wachten tot er een karakter binnenkomt. Hierdoor kunnen we de status van de UserButton niet om de zoveel tijd doorgeven.  

We kunnen dit nu op de Nucleo op een aantal manieren oplossen:

- Eventueel kan er gekeken worden om bij ontvangst of de seriele poort readable is. Maar door het feit dat we de toestand van de 'deur' maar om de twee seconden doorsturen, zouden we ook maar om de twee seconden kunnen kijken of iets binnengekomen is op de seriële poort. Dit zou te lang duren. Daarom zullen we het readable (binnenkomende char op seriële poort) combineren met een timer functie. Zie volgend puntje en ook volgende code.
- Ofwel gebruiken we een Ticker (gelijkaardig aan de timers die hebt geleerd in C#). Die kan om de zoveel tijd (bij ons dus om de 2 seconden) een tick afgeven. Binnen die uitvoerende Tick-methode kunnen we de status van User_Button doorsturen naar de MQTT broker.
- Ofwel zorgen we ervoor dat het binnenkomen van data op de seriele poort door een interrupt wordt verwerkt. In de hoofdlus kunnen we dan bezig zijn met om de 2 seconden de status van de UserButton te versturen.
- Ofwel maken we gebruik van twee interrupt systemen. Een interrupt die plaats vind op het moment er een char binnenkomt, en een interrupt die zich voordoet als de button op de processor wordt ingedrukt of wordt losgelaten. (niet behandeld hier).

---

## Ticker op de Nucleo

We bespreken hier het gebruik van de tweede optie, het werken met een Ticker (zie Google MBED Handbook Ticker). Nog even duidelijk stellen dat het hier de bedoeling is dat, als er geen data van de MQTT broker binnekomt, en dus `c = pc.getc(); ` (staat in de hoofdlus MAIN while(1) ) staat te wachten tot er iets binnenkomt, we toch in staat zijn op basis van een Ticker functie (die om de 2 seconden afgaat) we de toestand van UserButton toch kunnen doorgeven aan de broker, zodat de gebruiker toch kan zien wat de toestand van die input is zonder dat er eerst een wijziging gebeurt van de LED1 (wat niets te maken geeft met de toestand van de UserButton). Ik hoop dat het een beetje duidelijk is.

Let's code op de processor (aan Node-Red en aan de Linear MQTT dashboard hoefen we niets te wijzigen).

```c++
//UART_Recv_SendINT
#include "mbed.h"

Ticker sendStatusUB;
Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
DigitalIn button(USER_BUTTON);

void SendMQTT()
{
    if(button){pc.printf("uit\n");}
    else {pc.printf("aan\n");}  
}
int main()
{
    sendStatusUB.attach(&SendMQTT, 2.0);
    char c;
    while(1)  
    {
        if(pc.readable())
        {
            c = pc.getc(); // Read hyperterminal
            if (c == '0') { led = 0;  }
            if (c == '1') { led = 1;  }
        }
    }
}

```

Door in de hoofdlus eerst te controleren of de seriele poort readable is, sluiten we nog enkele schoonheidsfoutjes uit. Dit werkt eigenlijk ook zonder interrupt.

Opmerking: Het kan een probleem zijn dat er bij de PushButton publisher een \n wordt toegvoegd voor de werking van het dashboard. Dit deden we omdat Node-Red hierop gemakkelijker verschillende binnenkomende strings kan onderscheiden. Hieraan kan tegemoet gekomen worden door in Node-Red dit om te vormen naar een string zonder \n. Dit kan eenvoudig gedaan worden met een Function-node:

![example image](NodeRed7.PNG "An exemplary image")

Met volgende JavaScript code in het Function blok:

```javascript
var bericht = msg.payload;
if (bericht == "aan\n")
{
    msg.payload = "aan";
}
if (bericht == "uit\n")
{
    msg.payload = "uit";
}
return msg;
```

Hiermee wordt eigenlijk de \n weggefiltert. Hiermee werkt een "Edit Led" - Control binnen IoTOnOff dashboard perfect.

---

**Bon Change.**

---

### Meerdere uitgangen aansturen op de processor

Natuurlijk zal het hier nog wel een uitdaging zijn om meerdere LED's (output op de processor) te gaan aansturen. Hiervoor zullen we niet alleen moeten werken met een enkelzijdig karakter (zoals we nu hebben gedaan). Er bestaat in MBED niet alleen `getc` om een enkelvoudig karakter te lezen van de seriele poort, maar ook `scanf`. Hiermee zou een string kunnen worden ingelezen. Echter een string is niet gekend als variabele in C++(MBED). Je kan dus geen string declareren zoals je dit kan in C#.

Er kan ook gedacht worden hoe de structuur van de broker er vervolgens moet uitzien? Je zou voor iedere uitgang een aparte `topic` kunnen voorzien. Maar in dit geval zou je dezelfde `topic` kunnen gebruiken aangezien de data in die topic al specifieert welke LED (welke uitgang) er moet worden aangestuurd. Een goeie structuur van uw broker is zeker een analyse waard.  Splits zoveel mogelijk op in kleine delen.

```c
//UART_Scanf_SndINT
#include "mbed.h"

Ticker sendStatusUB;
Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
DigitalIn button(USER_BUTTON);

void SendMQTT()
{
    if(button){pc.printf("uit\n");}
    else {pc.printf("aan\n");}    
}
int main()
{
    char buf[128];
    sendStatusUB.attach(&SendMQTT, 2.0);
    
    while(1) 
    {
        if(pc.readable())
        {
            pc.scanf("%s", buf);    //leest van de seriele poort tot een carriage return (\r) wordt gedetecteerd. 
                                    //Alle ontvangen CHARs worden in een array gestopt (eigenlijk een string is)
            //pc.printf("recv: %s\r\n", buf);
            //Volgende lijn: we vergelijken de ontvangen CHAR-array met een string met strcmp-command => 
            // levert een 0 op bij gelijk. 
            if(strcmp(buf,"led1on")==0) 
            {
                led = 1;
            }
            if(strcmp(buf,"led1off")==0) 
            {
                led = 0;
            }
        }
       
    }
}
```

Maar hoe kan het anders er zit een nieuw probleem in onze code. Een scanf verwacht een "\r" op het einde van de ontvangen string. Echter is het niet mogelijk om in de Linear MQTT Dashboard (niet getest voor Apple APP's) een "\r" mee te sturen (of althans ik heb het niet gevonden, iemand wel?).

Maar dit kunnen we opvangen in Node-Red door de string die daar ontvangen wordt van de MQTT broker om te vormen en er een "\r" aan te concateneren. Dit kunnen we doen door een Function Node tussen het ontvangen en het verzenden naar de virtuele COM-poort te plaatsen. Dit doen we als volgt:

![example image](FunctionNode.PNG "An exemplary image")

De code van de Function-node is zeer eenvoudig:

![example image](FunctionNode1.PNG "An exemplary image")

Dit is nu eenvoudig uit te breiden om meerdere uitgangen van de Nucleo te sturen vanuit een MQTT publisher.

---

### Meerdere ingangen lezen van de processor

Tot nu toe hebben we maar de toestand van één drukknop verstuurd. Het vergt wat fantasie om er nu meerdere te versturen. ook hier kan nagedacht worden over de structuur van de broker met betrekking tot de verschillende ingangen van de microcontroller.  

Het zou ook een idee kunnen zijn om de toestand van alle inputs op de controller te lezen en dit samen te vatten in één string. Echter, moet je dan die ontvangen string binnen Node_red gaan opsplitsen zodat ieder zijn input dan in een specifieke topic op de broker zal worden gepubliceerd. Dat zal dus wel wat programmeerwerk worden binnen Node-Red.  

Je zou er ook kunnen voor kiezen om iedere input apart als string te versturen naar Node-Red: bv. input5 = '0' of zoiets. Ook hier zal dus binnen Node-Red een analyse moeten gebeuren over welke input dit gaat(in de veronderstelling dat iedere input gekoppeld is aan een specifieke topic op de broker).

Een analyse van de Node-Red node MQTT-output leert ons hetvolgende:

![example image](NR_mqtt_out.PNG "An exemplary image")

Hieruit blijkt dat, als we bij de configuratie de broker in deze node het veld topic leeglaten:

![example image](NR_mqtt_out0.PNG "An exemplary image")

 dat we in code (met een Function-Node) die topic zelf kunnen invullen door te schrijven msg.topic = "...";  

![example image](NR_mqtt_out1.PNG "An exemplary image")

Dus hier zijn veel mogelijkheden, aan de student om hier een studie rond te maken. Er zou met een SWITCH-CASE structuur binnen de Function-Node kunnen gewerkt worden om de juiste payload en de juiste topic in te stellen voor het naar de MQTT-Out node wordt verstuurd.

---

## Een voorbeeld met verschillende combinaties

Hier krijg je een voorbeeld van een µP die in twee richtingen werkt. Sturen van actuatoren (digital en PWM) vanaf IO On Off en visulaiseren van detector (drukknop) en sensor (potentiometer).

Code µP

```cpp
//UART_Scanf_SndINT2
#include "mbed.h"
Ticker sendStatusUB;
Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
DigitalOut led1(A5);
DigitalOut led4(D5);
DigitalIn button(USER_BUTTON);
AnalogIn potentiometer(A0);
PwmOut led6(PA_8);
void SendMQTT()
{
    if(button){pc.printf("button=uit\n");}
    else {pc.printf("button=aan\n");}
    pc.printf("potentiometer=%f\n", potentiometer.read());  
    led4=!led4; 
}
int main()
{
    char buf[128];
    sendStatusUB.attach(&SendMQTT, 1.0);
    led6.period(0.01f);         //freq = 100Hz ; periode = 10 milliseconden
    while(1) 
    {
        if(pc.readable())
        {
            pc.scanf("%s", buf);    //leest van de seriele poort tot een carriage return (\r) wordt gedetecteerd. 
                                    //Alle ontvangen CHARs worden in een array gestopt (eigenlijk een string is)
            //pc.printf("recv: %s\r\n", buf);
            //Volgende lijn: we vergelijken de ontvangen CHAR-array met een string met strcmp-command => 
            // levert een 0 op bij gelijk. 
            led1=!led1; 
            if(strcmp(buf,"led1on")==0) 
            {
                led = 1;
            }
            if(strcmp(buf,"led1off")==0) 
            {
                led = 0;
            }
            char* p; 
            p = strstr(buf, "PWM1="); 
            if(p)
            {
                int lenght = strlen(buf);
                float number = atof(buf + 5);
                led6.write(number);
            }
            for (int i = 0; i < 127; i++) //clear van de buf array omdat. Communicatie verloopt iets beter bij zeer veel binnenkomende strings. Maar µP loopt nog altijd vast???
            {
                buf[i] = '\0';
            }
         }
     }
}
```

Binnen de timer Interrupt Service Routine (die iedere seconde wordt aangeroepen) wordt de toestand van de drukkop en de ingelezen waarde van de potentiometer verstuurd.

Als er een string binnekomt, dan wordt de inhoud ervan bekeken en vergeleken. Herken je welke strings je zal moeten sturen vanuit Node-Red om de led aan te sturen?

De Node-Red flow zal er zo uitzien:

![example image](NodeRedAll.PNG "An exemplary image")

Er zijn twee Function Nodes te bespeuren. Dit is de code voor Voeg een "\r" toe:

```javascript
var bericht = msg.payload;
bericht = bericht + "\r";
msg.payload = bericht;
return msg;
```

En dit is de code voor Button + POT => Broker:

```javascript
var bericht = msg.payload;
var ok = false;
if (bericht == "button=aan\n")
{
    ok = true;
    msg.payload = "aan";
    msg.topic = "VIVES/IoT/WimD/UserButton";
}
if (bericht == "button=uit\n")
{
    ok = true;
    msg.payload = "uit";
    msg.topic = "VIVES/IoT/WimD/UserButton";
    
}
var n = bericht.includes("potentiometer");
if (n === true)
{
    ok = true;
    var res = bericht.substring(14);
    msg.payload = res;
    msg.topic = "VIVES/IoT/WimD/Potentiometer";
    
}
if (ok === true) {return msg;}
```

Op de Mobile App staan vier controls

![example image](iotOnOffAll.PNG "An exemplary image")

De broker ziet er zo uit:

![example image](HiveMQ5.PNG "An exemplary image")

Kan je zelf de controls koppelen en instellen?

----

In de laatste Node-Red Function node een analyse moet wordt gedaan van de binnenkomende string. Hierin wordt bekeken wat er als data allemaal mogelijk is en moet dit door IF-selectie (of een switch case) onderzocht worden. Op bsais van juiste mogelijkheden moet dan de juiste data naar de juiste topic worden gestuurd. Het kan wel eenvoudiger als we binnen de microprocessor kunnen beslissen welke dat naar welke topic op de broker moet worden gepubliseerd. Het is dan echter noodzakelijk om een JSON pakketje of een JavaScript object te printf-en vanuit de microcontroller naar Node_Red.

Dit kan als volgt met C++ code in MBED voor de microcontroller:

```cpp
//UART_Scanf_SndINT2
#include "mbed.h"
Ticker sendStatusUB;
Serial pc(SERIAL_TX, SERIAL_RX);
DigitalOut led(LED1);
DigitalOut led1(A5);
DigitalOut led4(D5);
DigitalIn button(USER_BUTTON);
DigitalIn sw1(PA_1);
DigitalIn sw2(PA_4);
DigitalIn sw3(PB_0);
DigitalIn sw4(PC_1);
AnalogIn potentiometer(A0);
PwmOut led6(PA_8);
void flushSerialBuffer(void);
void SendMQTT()
{
    if(button){pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/UserButton\"}]]\n");}//Make a JSON 
    else {pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/UserButton\"}]]\n");}
    
    pc.printf("[[{\"message\":\"%f\",\"topic\":\"VIVES/IoT/WimD/Potentiometer\"}]]\n", potentiometer.read());
    
    if(sw1){pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/Sw1\"}]]\n");}//Make a JSON 
    else {pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/Sw1\"}]]\n");}
    
    if(sw2){pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/Sw2\"}]]\n");}//Make a JSON 
    else {pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/Sw2\"}]]\n");}
    
    if(sw3){pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/Sw3\"}]]\n");}//Make a JSON 
    else {pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/Sw3\"}]]\n");}
    
    if(sw4){pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/Sw4\"}]]\n");}//Make a JSON 
    else {pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/Sw4\"}]]\n");}
    
    led4=!led4; 
    flushSerialBuffer();
}
void flushSerialBuffer(void) { char char1 = 0; while (pc.readable()) { char1 = pc.getc(); } return; }

int main()
{
    char buf[128];
    sendStatusUB.attach(&SendMQTT, 2.0);
    led6.period(0.01f);         //freq = 100Hz ; periode = 10 milliseconden
    while(1) 
    {
        if(pc.readable())
        {
            pc.scanf("%s", buf);    //leest van de seriele poort tot een carriage return (\r) wordt gedetecteerd. 
                                    //Alle ontvangen CHARs worden in een array gestopt (eigenlijk een string is)
            //pc.printf("recv: %s\r\n", buf);
            //Volgende lijn: we vergelijken de ontvangen CHAR-array met een string met strcmp-command => 
            // levert een 0 op bij gelijk. 
            led1=!led1; 
            if(strcmp(buf,"led1on")==0) 
            {
                led = 1;
                pc.printf("[[{\"message\":\"aan\",\"topic\":\"VIVES/IoT/WimD/led1\"}]]\n");
            }
            if(strcmp(buf,"led1off")==0) 
            {
                led = 0;
                pc.printf("[[{\"message\":\"uit\",\"topic\":\"VIVES/IoT/WimD/led1\"}]]\n");
            }
            char* p; 
            p = strstr(buf, "PWM1="); 
            if(p)
            {
                int lenght = strlen(buf);
                float number = atof(buf + 5);
                led6.write(number);
            }
            //flushSerialBuffer();
            /*
            for (int i = 0; i < 127; i++) //clear van de buf array omdat. Communicatie verloopt iets beter bij zeer veel binnenkomende strings. Maar µP loopt nog altijd vast???
            {
                buf[i] = '\0';
            }*/
         }
     }
}
```

In Node-red kan je dan eenvoudig deze flow hanteren om al de waarden van de inputs van de microcontroller te publishen op de broker in verschillende topics. Test maar eens uit op de website van HiveMQ:

![example image](Nucleo_JSON.PNG "An exemplary image")

Met de instellingen van de JSON node : Always convert to Javascript Object op msg.payload.
En in de Function node de volgende JavaScript code:

```javascript
var waarde;
var tussen;
waarde = msg.payload[0];
tussen = waarde[0];
msg.topic = tussen.topic;
msg.payload = tussen.message;
return msg;
```

Verder wordt de MQTT out node met niets geconfigureerd uitgenomen het adres van de broker zelf. Dus geen payload en geen topic. Als dit niet is ingevuld neemt deze node die uit het Javascript object over.

Er is nog een veiligheid ingebouwd dat bij het aansturen van de led er een andere melding zal gebeuren op een andere topic op de broker. Zo kan de bediener zien of de actie om de led te activeren of te deactivieren wel effectief is gebeurd.  Op die manier kan een andere control visueel angeven of de led effectief is aangestuurd of niet.

Veel succes,
Dhr. Dejonghe
