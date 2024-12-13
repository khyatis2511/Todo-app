/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosAPI } from "../helper"

export interface TodoObj {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: Date
  updatedAt: Date;
}

export const getTodoListAPI = async ({page, limit}: {page: number, limit: number}): Promise<any> => {
  return await axiosAPI({
    url: `/todo?page=${page}&limit=${limit}`,
    method: 'GET'
  })
}

export const getTodoAPI = async (id: string | string[]): Promise<any> => {
  return await axiosAPI({
    url: `/todo/${id}`,
    method: 'GET'
  })
}

export const removeTodoAPI = async (id: string | string[]): Promise<any> => {
  return await axiosAPI({
    url: `/todo/${id}`,
    method: 'DELETE'
  })
}

export const createTodoAPI = async (payload: any): Promise<any> => {
  return await axiosAPI({
    url: '/todo',
    method: 'POST',
    data: payload
  })
}

export const updateTodoAPI = async ({ todoId, payload }: any): Promise<any> => {
  return await axiosAPI({
    url: `/todo/${todoId}`,
    method: 'PUT',
    data: payload
  })
}

