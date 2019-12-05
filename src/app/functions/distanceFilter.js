export default (usersArray, maxDistance) => {
  const users = usersArray.filter((index) => index.locations.dataValues.distance >= 0 && index.locations.dataValues.distance <= maxDistance);
  return users;
};
