import { prisma } from "../../lib/prisma";

export const markMessageAsFailed = async (error: Error, aiMessageId: string) => {
  let errorMessage = "Something went wrong while processing your request.";

  if (error.message?.includes("timed out")) {
    errorMessage = "Request timed out. Please try again with a simpler request.";
  } else if (error.message?.includes("sandbox")) {
    errorMessage = "Failed to create development environment";
  }

  await prisma.message.update({
    where: {
      id: aiMessageId,
    },
    data: {
      status: "FAILED",
      content: errorMessage,
      type: "ERROR",
    },
  });
};
