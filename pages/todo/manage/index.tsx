/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTodoAPI, getTodoAPI, updateTodoAPI } from '@/utils/api/todo.api';
import { ERROR_MESSAGES } from '@/utils/constants';
import { TodoFormValues, todoSchema } from '@/utils/schema/todoSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const ManageTodo = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState<string | string[]>('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TodoFormValues>({
    resolver: yupResolver(todoSchema),
  });

  const onSubmit = async (values: TodoFormValues) => {
    setLoading(true);
    if (isEditMode) {
      await editTodo(values);
    } else {
      await addTodo(values);
    }
    setLoading(false);
  };

  const editTodo = async (values: TodoFormValues) => {
    try {
      const response = await updateTodoAPI({
        todoId: isEditMode,
        payload: {
          title: values.title,
          description: values.description,
        },
      });

      if (response.success) {
        showSuccessModal(response.message);
      }
    } catch (error: any) {
      console.error('[editTodo error]', error.message);
      showErrorModal(ERROR_MESSAGES.todo.update);
    }
  };

  const addTodo = async (values: TodoFormValues) => {
    try {
      const response = await createTodoAPI({
        title: values.title,
        description: values.description,
      });

      if (response.success) {
        showSuccessModal(response.message);
      }
    } catch (error) {
      console.error('[addTodo error]', error);
      showErrorModal(ERROR_MESSAGES.todo.create);
    }
  };

  const showSuccessModal = (message: string) => {
    Modal.success({
      title: message,
      onOk() {
        router.push('/todo');
      },
    });
  };

  const showErrorModal = (message: string) => {
    Modal.error({
      title: message,
      onOk() {
        router.push('/todo');
      },
    });
  };

  const getTodo = async (id: string | string[]) => {
    try {
      const todoResponse = await getTodoAPI(id);
      if (todoResponse.success) {
        setValue('title', todoResponse.data.title);
        setValue('description', todoResponse.data.description);
      }
    } catch (error) {
      console.error('[getTodo error]', error);
    }
  };

  useEffect(() => {
    if (router.query && router.query.id) {
      setIsEditMode(router.query.id);
      getTodo(router.query.id);
    }
  }, [router.query]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{isEditMode ? 'Edit Todo' : 'Add Todo'}</h1>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} >
        <Form.Item
          label="Title"
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title ? errors.title.message : ''}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description ? errors.description.message : ''}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => <Input.TextArea {...field} />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? 'Update Todo' : 'Add Todo'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ManageTodo;
