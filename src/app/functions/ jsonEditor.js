import distancia from './distancia';

export default function jsonEditor(object, latitude, longitude) {
  const filterObject = object.map((index) => index.dataValues);
  filterObject.map((index) => {
    index.distancia = distancia(index.latitude, index.longitude, latitude, longitude);
    delete index.latitude;
    delete index.longitude;
    return this;
  });
  return filterObject;
}
