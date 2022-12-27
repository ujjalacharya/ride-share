import type { NextApiRequest, NextApiResponse } from 'next'
import ensureConnection from '../../../init/db'
import { City } from '../../../entity/City';
// import cities from '../../../init/germany-cities.json'


export interface Coords {
  lat: string;
  lon: string;
}

export interface ICity {
  area?: string;
  coordsLong: string;
  coordsLat: string;
  district?: string;
  name: string;
  population: string;
  state: string;
}


export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
  ) {
  await ensureConnection()
  
  const cities = await City.find()

  // for(let i=0; i<= cities.length; i++){
  //   const cityDb = new City()
  //   cityDb.area = cities[i].area || ''
  //   cityDb.coordsLat = cities[i].coords.lat
  //   cityDb.coordsLong = cities[i].coords.lon
  //   cityDb.district = cities[i].district || ''
  //   cityDb.population = cities[i].population
  //   cityDb.state = cities[i].state
  //   cityDb.name = cities[i].name
  //   console.log(cityDb)
  //   await cityDb.save()
  // }

  res.status(200).json(cities)
}
