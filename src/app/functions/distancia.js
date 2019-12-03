export default function Distancia(latOne, lonOne, latTwo, lonTwo) {
  try {
    const latOneDivided = latOne / 180;
    const latTwoDivided = latTwo / 180;

    const latOneR = Math.PI * latOneDivided;
    const latTwoR = Math.PI * latTwoDivided;
    const lonDelta = lonOne - lonTwo;

    const lonDeltaDivided = lonDelta / 180;

    const lonDeltaR = Math.PI * lonDeltaDivided;

    let distancia = Math.sin(latOneR) * Math.sin(latTwoR);
    distancia += Math.cos(latOneR) * Math.cos(latTwoR) * Math.cos(lonDeltaR);
    distancia = Math.acos(distancia);
    distancia *= 180;
    distancia /= Math.PI;
    distancia = distancia * 60 * 1.1515;
    distancia *= 1.609344;

    return distancia.toFixed(2);
  } catch (error) {
    return new Error(error);
  }
}
