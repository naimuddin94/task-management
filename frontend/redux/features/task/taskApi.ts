import { TTaskPayload } from "@/lib/validations/task";
import { baseApi } from "@/redux/api/baseApi";
import { TResponse, TSearchParams, TTask } from "@/types";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTask: builder.mutation<TResponse<TTask>, TTaskPayload, any>({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    getTask: builder.query<TResponse<TTask>, string, any>({
      query: (taskId) => ({
        url: `/categories/${taskId}`,
        method: "GET",
      }),
    }),
    getAllTasks: builder.query<TResponse<TTask[]>, any, any>({
      query: (param) => {
        const params = new URLSearchParams();

        for (const key in param) {
          params.append(key, param[key]);
        }

        return {
          url: "/tasks",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["tasks"],
    }),
    updateTask: builder.mutation<
      TResponse<TTask>,
      { taskId: string; data: Partial<TTaskPayload> }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    deleteTask: builder.mutation<TResponse<TTask>, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useAddTaskMutation,
  useGetTaskQuery,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
