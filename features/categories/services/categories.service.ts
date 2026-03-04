import { api } from "@/lib/api/client";
import type {
  Category,
  InfoLimitResponse,
  ParentCategory,
  UpdateCategoryRequest,
} from "@/types";
import { BillTypeEnum } from "@/types/enums";

const BASE = "/Category";

export const categoryService = {
  getCategories: (type?: BillTypeEnum) =>
    api.get<ParentCategory[]>(
      `${BASE}/GetAllCategories${typeof type !== "undefined" ? `/${type}` : ""}`
    ),

  createCategory: (data: Category) =>
    api.post<Category>(`${BASE}/CreateCategory`, data),

  updateCategory: (data: UpdateCategoryRequest) =>
    api.patch<Category>(`${BASE}/UpdateCategory`, data),

  deleteCategory: (id: number) =>
    api.delete<void>(`${BASE}/DeleteCategory/${id}`),

  getLimitInfo: (categoryId: number) =>
    api.get<InfoLimitResponse>(`${BASE}/GetLimitInfo/${categoryId}`),

  updateCategoryLimit: (categoryId: number, limit: number) =>
    api.patch<Category>(`${BASE}/UpdateCategoryLimit`, {
      categoryId,
      amount: limit,
    }),
};
