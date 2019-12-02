import distancia from './distancia';

export default (object, latitude, longitude) => {
  object.distancia = distancia(object.latitude, object.longitude, latitude, longitude);
  delete object.latitude;
  delete object.longitude;
  return object;
};
