import { prisma } from "../../lib/prisma";

export const fetchLatestFragmentById = async (fragmentId: string) => {
  const fragment = prisma.fragment.findUnique({
    where: {
      id: fragmentId,
    },
    select: {
      id: true,
      files: true,
      title: true,
    },
  });
  if (!fragment) {
    throw new Error("Fragment Not Found");
  }
  return fragment;
};

export const fetchLatestFragmentByProjectId = async (projectId: string) => {
  const fragment = await prisma.fragment.findFirst({
    where: {
      message: {
        projectId: projectId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      sandboxId: true,
      files: true,
      title: true,
    },
  });
  return fragment;
};
