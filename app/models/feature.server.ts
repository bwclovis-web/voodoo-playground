import type { FeatureType } from "prisma/interfaces"

import { prisma } from "../db.server"

export const getAllFeatures = async (): Promise<FeatureType[]> => (
  prisma.feature.findMany()
)
