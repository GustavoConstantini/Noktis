import distancia from './distancia';

export default function jsonEditor(object, latitude, longitude) {
  const filterArray = object.map((index) => index.locations.dataValues);
  filterArray.map((index) => {
    index.distancia = distancia(index.latitude, index.longitude, latitude, longitude);
    delete index.latitude;
    delete index.longitude;
    return this;
  });

  return filterArray;
}
