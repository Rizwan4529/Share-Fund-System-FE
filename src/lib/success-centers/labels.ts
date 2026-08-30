import type {
  SuccessCenterCategory,
  SuccessCenterProgramStatus,
  SuccessCenterProgramType,
} from "../../types/successCenters";

export function categoryNameById(
  categories: SuccessCenterCategory[],
  categoryId: string,
): string {
  return categories.find((category) => category._id === categoryId)?.name ?? "—";
}

export function programStatusLabel(status: SuccessCenterProgramStatus): string {
  return status.replace(/_/g, " ");
}

export function programTypeLabel(type: SuccessCenterProgramType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
