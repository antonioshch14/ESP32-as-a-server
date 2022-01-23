#pragma once
// Adjust the following values to match your needs
// -----------------------------------------------
#define   servername "ESP32server"     // Set your server's logical name here e.g. if myserver then address is http://myserver.local/
IPAddress local_IP(192, 168, 0, 150); // Set your server's fixed IP address here
IPAddress gateway(192, 168, 0, 1);    // Set your network Gateway usually your Router base address
IPAddress subnet(255, 255, 255, 0);   // Set your network sub-network mask here
IPAddress dns(192, 168, 0, 1);           // Set your network DNS usually your Router base address
const char ssid_1[] = "Keenetic - 4574";
const char password_1[] = "Gfmsd45kaxu69$";

const char ssid_2[] = "Keenetic - 4574-5G";
const char password_2[] = "Gfmsd45kaxu69$";

const char ssid_3[] = "your_SSID3";
const char password_3[] = "your_PASSWORD_for SSID3";

const char ssid_4[] = "your_SSID4";
const char password_4[] = "your_PASSWORD_for SSID4";


