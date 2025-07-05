import { TCategoryPayload } from "@/lib/validations/task";
import { baseApi } from "@/redux/api/baseApi";
import { TCategory, TResponse } from "@/types";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation<TResponse<TCategory>, TCategoryPayload, any>({
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
    updateCategory: builder.mutation<
      TResponse<TCategory>,
      { categoryId: string; data: Partial<TCategoryPayload> }
    >({
      query: ({ categoryId, data }) => ({
        url: `/categories/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ categoryId, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          categoryApi.util.updateQueryData("getCategories", null, (draft) => {
            const category = draft.data.find((item) => item._id === categoryId);
            if (category) {
              Object.assign(category, data);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteCategory: builder.mutation<TResponse<TCategory>, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      async onQueryStarted(categoryId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          categoryApi.util.updateQueryData("getCategories", null, (draft) => {
            draft.data = draft.data.filter((item) => item._id !== categoryId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
