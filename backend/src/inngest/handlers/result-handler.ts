import { prisma } from "../../lib/prisma";
import type { NetworkState } from "../types/network-types";

interface SaveResultParams {
  aiMessageId: string;
  result: { state: { data: NetworkState } };
  sandboxId: string;
  sandboxUrl: string;
}

export const isResultError = (result: { state: { data: NetworkState } }): boolean => {
  return !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;
};

export const saveErrorResult = async (aiMessageId: string) => {
  return await prisma.message.update({
    where: {
      id: aiMessageId,
    },
    data: {
      content: "Something went wrong",
      type: "ERROR",
      status: "FAILED",
    },
  });
};

export const saveSuccessfullResult = async ({
  aiMessageId,
  result,
  sandboxId,
  sandboxUrl,
}: SaveResultParams) => {
  const fragmentTitle = result.state.data.fragmentTitle || "Untitled";
  return await prisma.message.update({
    where: {
      id: aiMessageId,
    },
    data: {
      content: result.state.data.enhancedSummary,
      type: "RESULT",
      status: "SUCCESS",
      fragments: {
        create: {
          sandboxUrl: sandboxUrl,
          sandboxId: sandboxId,
          title: fragmentTitle,
          files: result.state.data.files || {},
        },
      },
    },
  });
};

export const saveResult = async (params: SaveResultParams) => {
  if (isResultError(params.result)) {
    return await saveErrorResult(params.aiMessageId);
  }
  return await saveSuccessfullResult(params);
};
