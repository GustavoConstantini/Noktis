/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
function distancia(lat1, lon1, lat2, lon2) {
  const lat1R = Math.PI * lat1 / 180;
  const lat2R = Math.PI * lat2 / 180;
  const lonDelta = lon1 - lon2;
  const lonDeltaR = Math.PI * lonDelta / 180;
  let distancia = Math.sin(lat1R) * Math.sin(lat2R) + Math.cos(lat1R) * Math.cos(lat2R) * Math.cos(lonDeltaR);

  distancia = Math.acos(distancia);
  distancia = distancia * 180 / Math.PI;
  distancia = distancia * 60 * 1.1515;
  distancia *= 1.609344;

  return distancia.toFixed(2);
}


export default distancia;
