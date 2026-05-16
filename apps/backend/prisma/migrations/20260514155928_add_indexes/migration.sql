/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "File_messageId_idx" ON "File"("messageId");

-- CreateIndex
CREATE INDEX "File_postId_idx" ON "File"("postId");

-- CreateIndex
CREATE INDEX "Friend_acceptorId_idx" ON "Friend"("acceptorId");

-- CreateIndex
CREATE INDEX "Message_chatId_createdAt_idx" ON "Message"("chatId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Message_responseId_idx" ON "Message"("responseId");

-- CreateIndex
CREATE INDEX "Message_authorId_idx" ON "Message"("authorId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "PostReport_postId_idx" ON "PostReport"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_name_key" ON "Reaction"("name");

-- CreateIndex
CREATE INDEX "UserChat_userId_idx" ON "UserChat"("userId");

-- CreateIndex
CREATE INDEX "UserReaction_messageId_idx" ON "UserReaction"("messageId");
