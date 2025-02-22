# Driver met meerdere transistoren

## Darlington Driver (ULN....)

Wanneer er nood is aan een reeks transistoren om bijvoorbeeld acht vermogenuitgangen te sturen kan men gebruik maken van een driver-IC. In deze behuizing zitten dan bijvoorbeeld acht vermogentrappen om van gewone digitale uitgangen vermogensturingen te maken. Ook hier is het zo dat de voedingsspanning zelf kan worden bepaald en dit hoeft geen beperking te zijn tot de voedingsspanning van de microcontroller zelf.

Een veel gebruikte reeks van driver-IC's zijn de ULN-reeksen, gemaakt door verschillende fabrikanten. Een voorbeeld is de ULN2803 met acht darlingtontransistor uitgangstrappen. Een darlingtontransistor of kort darlington is een schakeling van twee in cascade gekoppelde transistoren zoals in volgende figuur waar het symbool is afgebeeld.

![example image](./images/darlington.png "An exemplary image")

De stroomversterkingsfactor hFE van een darlingtontransistor is bij benadering het product van de stroomversterkingsfactoren van de twee afzonderlijke transistoren, zodat een darlington een zeer grote stroomversterkingsfactor heeft.

![example image](./images/darlington2.png "An exemplary image")

Soms is het nodig om met een kleine stroom (uitgangspoort van een microcontroller) een veel grotere stroom te sturen. Laagvermogentransistoren hebben een grote versterkingsfactor, maar kunnen geen grote stroom sturen. Hoogvermogentransistoren hebben doorgaans een lage stroomversterkingsfactor, en kunnen daarom met een niet al te kleine stroom aangestuurd worden. Door twee zulke transistoren in één schakeling te gebruiken, kunnen beide kenmerken samengevoegd worden en daarmee de goede eigenschappen kunnen worden gecombineerd.

Een dergelijk IC kan, afhankelijk van het type tot 50 V aan de uitgang schakelen en per kanaal (soms acht kanalen in één IC) een stroom schakelen tot 500mA. Het principeschema van het IC is afgebeeld in de volgende figuur.

![example image](./images/uln.png "An exemplary image")

De dioden in het schema zijn nuttig wanneer inductieve belastingen worden geschakeld. De oplopende EMKz-spanning van die belasting wordt aan de hand van deze beveiligingsdioden kortgesloten. Een detail van een poort is terug te vinden in de volgende figuur. In het schema is duidelijk te zien dat de uitgang enkel een SINK-stroom kan voeren (=rode stroompijlen) en geen SOURCE-stroom.

![example image](./images/uln2.png "An exemplary image")

De aansluitingen en de pin-functies van het IC zijn weergegeven in de volgende figuur en tabel. Voor meer  informatie verwijzen we naar de datasheet.

![example image](./images/uln3.png "An exemplary image")

![example image](./images/uln4.png "An exemplary image")

## Aansturen van een stappenmotor met een ULN2803A

### Principe en werking van een stappenmotor

Stappenmotoren zijn DC-motoren die kunnen ronddraaien in kleine stapjes zoals in de volgende figuur.

![example image](./images/stepper.png "An exemplary image")

Ze worden veel gebruikt in allerlei toepassingen zoals in printers en 3D-printers om de printkop in de juiste positie te positioneren.

![example image](./images/toep.png "An exemplary image")

De stappenmotor is opgebouwd uit een rotor die ronddraait en een stator die vastzit aan de behuizing. De stator wordt hier bestuurd met 6 draden die uit de stappenmotor komen.

![example image](./images/stepper2.png "An exemplary image")

De rotor bestaat uit twee tandwielen die eigenlijk 1 grote permanente magneet vormen waarvan het éne tandwiel de noordpolen vormt en het andere tandwiel de zuidpolen. De tanden van de noordpolen vallen juist tussen de tanden van de zuidpolen (zie groene pijl).

![example image](./images/stepper3.png "An exemplary image")

De stator is opgebouwd uit 4 spoelen met de naam A, A’, B en B’ zoals links afgebeeld in de volgende figuur. Afhankelijk van de zin van de stroom die door zo een spoel gestuurd wordt, wordt de getande metalen spoelkern gemagnetiseerd als noordpool of als zuidpool. In de rechtse afbeelding kan je zien dat er ook stappenmotoren bestaan uit 8 statorspoelen. De 8 spoelen staan dan per twee in serie om een beter magnetische koppeling met de rotor te bekomen. De aansturing is voor beide motoren hetzelfde.

![example image](./images/stepper4.png "An exemplary image")

De meeste stappenmotoren die gebruikt worden zijn tweefasig en hebben een A en een B spoel. Om een nog grotere nauwkeurigheid te bekomen worden de fasen soms verhoogd. Er bestaan stappenmotoren met 3, 4 of soms wel 5 fasen zoals in de figuur. Door het verhogen van de fasen wordt de aansturing er niet eenvoudiger op.

![example image](./images/stepper5.png "An exemplary image")

In de figuur herken je de 4 statorspoelen. De linkse afbeelding is vereenvoudig door het aantalr otorpolen naar 6 te herleiden. Deze bestaan uit 3 noord- en 3 zuidpolen. In het echt zullen het er meer zijn zoals in de rechtse figuur waar het aantal bestaat uit 24 noord- en 24 zuidpolen.

![example image](./images/stepper6.png "An exemplary image")

De stappenmotoren worden ingedeeld in twee grote groepen. De unipolaire en de bipolaire stappenmotoren. Bipolaire stappenmotoren kan je gemakkelijk herkennen omdat ze slechts 4 aansluitdraden hebben. Unipolaire stappenmotoren hebben meestal 6 maar soms ook 8 aansluitdraden.

![example image](./images/stepper7.png "An exemplary image")

De stator van een stappenmotor bestaat uit 4 spoelen. Bij een bipolaire stappenmotor staan die spoelen per twee in serie. Bij unipolaire stappenmotoren is er een extra aftakking van de twee spoelen die naar buiten worden gebracht zodat er in totaal 6 draden zijn. Soms worden de draden van al de spoelen naar buiten gebracht en dan bekom je in totaal 8 aansluitdraden die je zelf nog moet verbinden.
Van een unipolaire stappenmotor kan je altijd een bipolaire stappenmotor maken door de midden aftakkingen van de twee spoelen niet te gebruiken. Bij een stappenmotor kan je gebruik maken van een H-brug zoals verder in het hoofdstuk gebruikt wordt bij het aansturen van een DC-motor.
Unipolaire stappenmotoren ga je aansturen met MOSFETs die beveiligd zijn met vrijloopdioden. Hiervoor kan je de ULN2803A gebruiken.

