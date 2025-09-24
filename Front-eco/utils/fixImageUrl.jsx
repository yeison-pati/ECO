

import IP from "../api/IP";

export function fixImageUrl(url) {

  if (!url) return url;


  const regex = /(?:localhost|\b\d{1,3}(?:\.\d{1,3}){3}\b)/;

  return url.replace(regex, IP);
}