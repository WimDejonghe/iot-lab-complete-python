---
mathjax:
  presets: '\def\lr#1#2#3{\left#1#2\right#3}'
---

# ESP32 en MQTT

```python
import network
import time
from umqtt.simple import MQTTClient
from machine import Pin

# Wi-Fi instellingen
SSID = "YOUR_SSID"
PASSWORD = "YOUR_PASSWORD"

# MQTT instellingen
MQTT_BROKER = "YOUR_BROKER"  # Gebruik een publieke broker of je eigen server vb: broker.hivemq.com
MQTT_CLIENT_ID = "YOUR_CLIENTID"
MQTT_TOPIC_SUB = "YOUR_SUBSCRIBE_TOPIC"
MQTT_TOPIC_PUB = "YOUR_PUBLISH_TOPIC"

sw1 = Pin(39, Pin.IN)
led = Pin(13, Pin.OUT)
led1 = Pin(21, Pin.OUT)

def callback_sw1(p):
    #print('pin change', p)
    #led1.value(not led1.value())
    client.publish(MQTT_TOPIC_PUB, "SW1 ingedrukt!")


# Wi-Fi verbinden
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    print("Verbinden met Wi-Fi...")
    while not wlan.isconnected():
        time.sleep(1)
    
    print("Verbonden! IP-adres:", wlan.ifconfig()[0])

# Callback functie voor ontvangen berichten
def on_message(topic, msg):
    print(f"Ontvangen: {topic.decode()} -> {msg.decode()}")
    
    # Hier kan je een actie uitvoeren bij een bepaald bericht
    if msg.decode() == "ping":
        client.publish(MQTT_TOPIC_PUB, "pong")
    if msg.decode() == "led":
        led.value(not led.value())

# Verbinden met Wi-Fi
connect_wifi()

# Verbinden met MQTT
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER)
client.set_callback(on_message)
client.connect()
print(f"Verbonden met MQTT-broker {MQTT_BROKER}")

# Abonneren op een topic
client.subscribe(MQTT_TOPIC_SUB)
print(f"Geabonneerd op topic {MQTT_TOPIC_SUB}")

# Publish een testbericht
client.publish(MQTT_TOPIC_PUB, "ESP32 is verbonden!")

sw1.irq(trigger=Pin.IRQ_FALLING, handler=callback_sw1)

# Blijf berichten verwerken
try:
    while True:
        client.check_msg()  # Controleer of er een nieuw bericht is (niet blokkerend)
        led1.value(not led1.value())
        time.sleep(1)
except KeyboardInterrupt:
    print("Verbinding verbreken...")
    client.disconnect()
```



