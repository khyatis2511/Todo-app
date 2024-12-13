/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTodoAPI, getTodoAPI, updateTodoAPI } from '@/utils/api/todo.api';
import { ERROR_MESSAGES } from '@/utils/constants';
import { TodoFormValues, todoSchema } from '@/utils/schema/todoSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const ManageTodo = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState<string | string[]>('');
  const [loading, setLoading] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [message, setMessage] = useState('');

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
        showSuccessDialog(response.message);
      }
    } catch (error: any) {
      console.error('[editTodo error]', error.message);
      showErrorDialog(ERROR_MESSAGES.todo.update);
    }
  };

  const addTodo = async (values: TodoFormValues) => {
    try {
      const response = await createTodoAPI({
        title: values.title,
        description: values.description,
      });

      if (response.success) {
        showSuccessDialog(response.message);
      }
    } catch (error) {
      console.error('[addTodo error]', error);
      showErrorDialog(ERROR_MESSAGES.todo.create);
    }
  };

  const showSuccessDialog = (message: string) => {
    setMessage(message);
    setOpenSuccessDialog(true);
  };

  const showErrorDialog = (message: string) => {
    setMessage(message);
    setOpenErrorDialog(true);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    router.push('/todo');
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
    router.push('/todo');
  };

  const getTodo = useCallback(async (id: string | string[]) => {
    try {
      const todoResponse = await getTodoAPI(id);
      if (todoResponse.success) {
        setValue('title', todoResponse.data.title);
        setValue('description', todoResponse.data.description);
      }
    } catch (error) {
      console.error('[getTodo error]', error);
    }
  }, [setValue]);

  useEffect(() => {
    if (router.query && router.query.id) {
      setIsEditMode(router.query.id);
      getTodo(router.query.id);
    }
  }, [router.query, getTodo]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{isEditMode ? 'Edit Todo' : 'Add Todo'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ''}
              />
            )}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description ? errors.description.message : ''}
              />
            )}
          />
        </div>

        <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
          {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update Todo' : 'Add Todo'}
        </Button>
      </form>

      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageTodo;
