import { TTaskPayload } from "@/lib/validations/task";
import { baseApi } from "@/redux/api/baseApi";
import { TResponse, TTask } from "@/types";

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
      { taskId: string; data: Partial<TTaskPayload>; query: any }
    >({
      query: ({ taskId, data, query }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(
        { taskId, data, query },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData("getAllTasks", query, (draft) => {
            const task = draft.data.find((item) => item._id === taskId);
            if (task) {
              Object.assign(task, data);
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
    deleteTask: builder.mutation<TResponse<TTask>, any>({
      query: ({ taskId, query }) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ taskId, query }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData("getAllTasks", query, (draft) => {
            draft.data = draft.data.filter((item) => item._id !== taskId);
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
  useAddTaskMutation,
  useGetTaskQuery,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
