import { UserWithCredentials } from "../../src/models/User";

export const USER: UserWithCredentials = {
  id: "3daf7676-ec0f-4548-85a7-67b4382166d4",
  login: "login2",
  password: "37b4a40ef177c39863a3fa75de835f4ab276c18f00ba4e909e54b039215143d0", // "pass2"
  firstName: "Kylian",
  lastName: "Mekambe",
  photoURL: "65ee3504-123f-4ccb-b6c9-97f8e302b40d.webp",
  lastActive: new Date(),
  salt: "$2a$10$MeDYRqv3QH3jcggJCtiRoe",
};

export const VALID_USER_ID = USER.id;
