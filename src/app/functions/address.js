import { get } from 'axios';

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';
const FORMAT = 'json';

export default async function addressByCoordinates(latitude, longitude) {
  const { data } = await get(ENDPOINT, {
    params: {
      format: FORMAT,
      lat: latitude,
      lon: longitude,
    },
  });

  return data.address;
}
