import axios from "../utils/axios";

export const createComment = (content: string, user_id: string | null) => {
  return axios.post("/comments", {
    content,
    user_id
  });
};

export const queryComment = (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
    return axios.get("/comments", {
        params: {
            offset,
            limit
        }
    })
}

export const queryCommentById = (id: number) => {
    return axios.get(`/comments/${id}`)
}

export const updateCommentById = (id: number, content: string, user_id: string) => {
    return axios.put(`/comments/${id}`, {
        content,
        user_id
    })
}

export const deleteCommentById = (id: number) => {
    return axios.delete(`/comments/${id}`)
}