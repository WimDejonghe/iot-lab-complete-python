---
mathjax:
  presets: '\def\lr#1#2#3{\left#1#2\right#3}'
---
# ESP32 en Wifi

De ESP32 bezit een Wifi module. Deze kan voor verschillende toepassingen worden gebruikt. Hier een aantal voorbeelden waarbij de microcontroller gebruik maakt van deze Wifi module:

> - Verbinding met WAP om data te versturen en of te onvangen via bv.: MQTT
> - Verbinding met WAP om als webserver te functioneren (HTTP)
> - Verbinding met WAP om data op te vragen op het internet (HTTP, FTP, ...)
> - ESP32 kan zelf een WAP opzetten om andere clients erop te laten connecteren

Er worden hier nu enkele eenvoudige codevoorbeelden gegeven. Meer kan gevonden worden op het internet.

## Wifi scan

De ESP32 kan net zoals andere wifi clients een scan uitvoeren op zoek naar de beschikbare WAP. De gevonden WAP's worden geprint in de console.

```python
import network
import ubinascii

def scan_wifi():
    wlan = network.WLAN(network.STA_IF)  # Station mode inschakelen, dus geen WAP
    wlan.active(True)  # WiFi activeren
    
    print("Scannen naar beschikbare WiFi-netwerken...")
    networks = wlan.scan()  # Lijst van gevonden netwerken ophalen
    
    for net in networks:
        ssid = net[0].decode('utf-8')  # SSID van het netwerk
        signal_strength = net[3]  # Signaalsterkte (RSSI)
        print(f"SSID: {ssid}, Signaalsterkte: {signal_strength} dBm")
    
    wlan_mac = wlan.config('mac')
    print("MAC Address:", str(wlan_mac))  # Show MAC for peering
    print(ubinascii.hexlify(wlan_mac).decode())
    wlan.active(False)  # WiFi uitschakelen na scan

if __name__ == "__main__":
    scan_wifi()
```

## Wifi connect 

In volgende code wordt de ESP32 geconnecteerd met een WAP (SSID + wachtwoord). Eenmaal geconnecteerd krijgt de ESP32 een IP adres van de DHCP server die aanwezig is in het Wifi. Een alternatief kan zijn dat het device (ESP32) een fixed IP-adres krijgt. Dit moet dan in de code worden geprogrammeerd.

Verder zal volgende code, eenmaal de WAP connectie is gelukt, de huidige tijd en datum opvragen aan een time-server op het internet.

```python
import network
import ntptime
import time
import machine

# Wifi-instellingen
SSID = "YOUR_SSID" #Hier komt de SSID van uw WifiAccessPoint
PASSWORD = "YOUR_PASSWORD" #Hier komt het wachtwoord voor die accessppint

# Verbinden met WiFi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Verbinden met WiFi...")
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
    print("Verbonden met WiFi:", wlan.ifconfig())
    print(wlan.status())
    print(wlan.config('ssid'))
    print(wlan.config('channel'))
    print(wlan.config('hostname'))
    
    print(wlan.config('txpower'))

# Haal tijd op en pas aan naar Brusselse tijd (CET/CEST)
def get_brussels_time():
    try:
        ntptime.settime()  # Synchroniseer met de NTP-server (standaard pool.ntp.org)
        # Verkrijg UTC tijd
        year, month, day, hour, minute, second, _, _ = time.localtime()

        # Brussel tijdzone (CET = UTC+1, CEST = UTC+2)
        # Controleer of zomertijd van toepassing is (ruwe benadering)
        if (month > 3 and month < 10) or (month == 3 and day >= 25 and hour >= 2) or (month == 10 and day < 25):
            hour += 2  # CEST (zomertijd)
        else:
            hour += 1  # CET (wintertijd)

        # Zorg ervoor dat het uur binnen de 24-uurs klok blijft
        if hour >= 24:
            hour -= 24
            day += 1  # Eenvoudige correctie voor de dag

        print(f"Brussel tijd: {year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
    except Exception as e:
        print("Kon tijd niet ophalen:", e)

# Voer de functies uit
connect_wifi()
time.sleep(2)  # Wacht even voor stabiliteit
get_brussels_time()
```

## Opdrachten: 
### Opdracht1 : WiFi scan

<div style="background-color:darkgreen; text-align:left; vertical-align:left; padding:15px;">
<p style="color:lightgreen; margin:10px">
Opdracht: Maak een programma die uw esp32 laten scannen naar beschikbare SSID's.
<ul style="color: white;">
<li>Geef alle SSID acces points weer in de console.</li>
<li>Geef ook de signaalsterkte (decibell) weer.</li>
<li>Zoek op wat die dB waarden willen zeggen (wat is een goede signaalsterkte en wat niet).</li>
</ul>
</p>
</div>

### Opdracht2 : WiFi SSID connect Fixed IP

<div style="background-color:darkgreen; text-align:left; vertical-align:left; padding:15px;">
<p style="color:lightgreen; margin:10px">
Opdracht: Connecteer uw esp32 met een SSID en geef uw esp32 een fixed adres.
<ul style="color: white;">
<li>Connecteer met een SSID en geef client een fixed IP adres.</li>
<li>Zorg dat je de tijd kunt opvragen aan een time server op het internet.</li>
<li>Geef de tijd weer in de console.</li>
</ul>
</p>
</div>

### Opdracht3 : WiFi SSID connect Dynamic IP

<div style="background-color:darkgreen; text-align:left; vertical-align:left; padding:15px;">
<p style="color:lightgreen; margin:10px">
Opdracht: Connecteer uw esp32 met een SSID en geef uw esp32 een dynamic adres (DHCP).
<ul style="color: white;">
<li>Connecteer met een SSID en geef client een dynamic IP adres.</li>
<li>Display uw IP gegevens op de console.</li>
<li>Zorg dat je de tijd kunt opvragen aan een time server op het internet.</li>
<li>Geef de tijd weer in de console.</li>
</ul>
</p>
</div>