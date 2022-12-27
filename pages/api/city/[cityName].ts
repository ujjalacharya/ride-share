import type { NextApiRequest, NextApiResponse } from "next";
import ensureConnection from "../../../init/db";
import { ICity } from ".";
import { City } from "../../../entity/City";

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function findClosePosts(location: ICity, radius: number, posts: ICity[]) {
  return posts.filter(
    (post) =>
      // find close points within the radius of the location, but exclude the location itself from results
      getDistanceFromLatLonInKm(
        +location?.coordsLat,
        +location?.coordsLong,
        +post.coordsLat,
        +post.coordsLong
      ) <= radius && location !== post
  );
}

function findLocationByName(name: string, posts: ICity[]) {
  return posts.find((post) => post.name.toLowerCase() === name.toLowerCase());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICity[] | []>
) {
  ensureConnection();

  const cityName = req.query.cityName as string;
  const posts = await City.find();
  const city = findLocationByName(cityName, posts) as City;

  if (!city) res.status(200).json([]);

  const closePosts = findClosePosts(city, 20, posts);

  res.status(200).json(closePosts);
}
