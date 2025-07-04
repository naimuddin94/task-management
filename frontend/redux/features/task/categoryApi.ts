import { baseApi } from "@/redux/api/baseApi";
import { TCategory, TResponse, TTask } from "@/types";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation<TResponse<TCategory>, any>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    getCategory: builder.query<TResponse<TCategory>, string, any>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "GET",
      }),
    }),
    getCategories: builder.query<TResponse<TCategory[]>, null, any>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    updateCategory: builder.mutation<TResponse<TCategory>, any>({
      query: (data) => ({
        url: "/categories",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation<TResponse<TCategory>, any>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoryQuery,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
