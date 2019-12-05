import distance from './distance';

export default (object, latitude, longitude) => {
  const usersArray = object.map((index) => index.locations.dataValues);
  usersArray.map((index) => {
    index.distance = distance(index.latitude, index.longitude, latitude, longitude);
    delete index.latitude;
    delete index.longitude;
    return this;
  });

  return usersArray;
};
