import { z } from "zod";

export const AcceptFriendshipDTO = z.object({
	requesterId: z.uuid(),
	acceptorId: z.uuid(),
});
export type AcceptFriendshipDTO = z.infer<typeof AcceptFriendshipDTO>;

export const CreateFriendshipDTO = AcceptFriendshipDTO;
export type CreateFriendshipDTO = AcceptFriendshipDTO;

export const DeleteFriendshipDTO = AcceptFriendshipDTO;
export type DeleteFriendshipDTO = AcceptFriendshipDTO;
