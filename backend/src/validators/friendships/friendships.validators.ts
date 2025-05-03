import { z } from "zod";

export const AcceptFriendshipDTO = z.object({
  requesterId: z.string().uuid(),
  acceptorId: z.string().uuid(),
});
export type AcceptFriendshipDTO = z.infer<typeof AcceptFriendshipDTO>;

export const CreateFriendshipDTO = AcceptFriendshipDTO;
export type CreateFriendshipDTO = AcceptFriendshipDTO;

export const DeleteFriendshipDTO = AcceptFriendshipDTO;
export type DeleteFriendshipDTO = AcceptFriendshipDTO;
