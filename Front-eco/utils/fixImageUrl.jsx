// Definimos una constante LOCAL_IP que guarda la IP local de la red Wi-Fi

import IP from "../api/IP";

export function fixImageUrl(url) {

  if (!url) return url;

  // Expresión regular para encontrar 'localhost' o una IP (IPv4)
  const regex = /(?:localhost|\b\d{1,3}(?:\.\d{1,3}){3}\b)/;

  return url.replace(regex, IP);
}