import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../entity/User";
import ensureConnection from "../../../init/db";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureConnection();
  const user = new User();
  const {
    body: {
      age,
      firstName,
      lastName,
      userType,
      currentLocationLat,
      currentLocationLong,
      currentLocation,
      id,
      email,
      password,
    },
    method,
  } = req;

  switch (method) {
    case "GET":
      const getAllUsers = await User.find({});
      res.status(200).json(getAllUsers);
      break;
    case "POST":
      const userAlreadyExists = await User.findOne({ where: { email } });
      if (userAlreadyExists) {
        res.status(400).json({ error: "User already exists" });
        break;
      }
      user.age = age as string;
      user.email = email as string;
      user.password = password as string;
      user.firstName = firstName as string;
      user.lastName = lastName as string;
      user.userType = userType as string;
      user.currentLocation = currentLocation as string;
      await user.save().catch((err) => console.log("err"));
      res.status(200).json({ user });
      break;
    case "PUT":
      const updateUser = await User.findOneOrFail({ where: { id } });
      updateUser.currentLocationLat = currentLocationLat;
      updateUser.currentLocationLong = currentLocationLong;
      updateUser.currentLocation = currentLocation;
      await updateUser?.save();
      res.status(200).json(updateUser);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
