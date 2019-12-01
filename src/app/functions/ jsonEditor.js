import ageConverter from './ageConverter';

function distancia(latOne, lonOne, latTwo, lonTwo) {
  const latOneDivided = latOne / 180;
  const latTwoDivided = latTwo / 180;

  const latOneR = Math.PI * latOneDivided;
  const latTwoR = Math.PI * latTwoDivided;
  const lonDelta = lonOne - lonTwo;

  const lonDeltaDivided = lonDelta / 180;

  const lonDeltaR = Math.PI * lonDeltaDivided;

  let Distancia = Math.sin(latOneR) * Math.sin(latTwoR);
  Distancia += Math.cos(latOneR) * Math.cos(latTwoR) * Math.cos(lonDeltaR);
  Distancia = Math.acos(Distancia);
  Distancia *= 180;
  Distancia /= Math.PI;
  Distancia = Distancia * 60 * 1.1515;
  Distancia *= 1.609344;

  return Distancia.toFixed(2);
}

function appendDistancia(object, latitude, longitude) {
  const filterObject = object.map((index) => index.dataValues);
  filterObject.map((index) => {
    index.distancia = distancia(index.latitude, index.longitude, latitude, longitude);
    index.age = ageConverter(index.birth_timestamp);
    delete index.latitude;
    delete index.longitude;
    delete index.birth_timestamp;
    return this;
  });
  return filterObject;
}


export default appendDistancia;
