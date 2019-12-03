import distancia from './distancia';

export default (object, latitude, longitude) => {
  try {
    if (!(object.latitude && object.longitude)) {
      object.distancia = null;
      delete object.latitude;
      delete object.longitude;
      return object;
    }
    object.distancia = distancia(object.latitude, object.longitude, latitude, longitude);
    delete object.latitude;
    delete object.longitude;
    return object;
  } catch (error) {
    return new Error(error);
  }
};
