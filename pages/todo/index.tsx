/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTodoListAPI, removeTodoAPI, TodoObj, updateTodoAPI } from '@/utils/api/todo.api';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Button, Checkbox, Dialog, DialogActions, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Todo = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const pageSize = 10;

  const getTodoList = async (page: number) => {
    try {
      const todoListResponse = await getTodoListAPI({ page, limit: pageSize });
      if (todoListResponse.success) {
        setTotalRecords(todoListResponse.totalCount);
        setTodos(todoListResponse.data);
      }
    } catch (error) {
      console.error('[getTodoList error]', error);
    }
  };

  const handleCheckboxChange = async (id: string, isChecked: boolean) => {
    try {
      const response = await updateTodoAPI({ todoId: id, payload: { isCompleted: isChecked } });
      if (response.success) {
        setTodos((prevData) => {
          const data = prevData.map((todo: TodoObj) => {
            if (todo.id === response.data.id) {
              todo.isCompleted = response.data.isCompleted;
            }
            return todo;
          });
          return data;
        });
      }
    } catch (error) {
      console.error('[handleCheckboxChange : error]', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTodoId) return;

    try {
      const todoResponse = await removeTodoAPI(selectedTodoId);
      if (todoResponse.success) {
        setTodos((prevTodos) => prevTodos.filter((todo: TodoObj) => todo.id !== selectedTodoId));
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('[handleDelete error]', error);
    }
  };

  const handlePaginationChange = (event: any, newPage: number) => {
    setCurrentPage(newPage + 1); // MUI paginators are 0-indexed
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedTodoId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTodoId(null);
  };

  useEffect(() => {
    getTodoList(currentPage);
  }, [currentPage]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo List</h1>

      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => router.push(`/todo/manage`)}
      >
        Add Todo
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo: TodoObj) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>
                <Checkbox
                  checked={todo.isCompleted}
                  onChange={(e) => handleCheckboxChange(todo.id, e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Edit Todo">
                  <IconButton onClick={() => router.push(`/todo/manage?id=${todo.id}`)}>
                    <EditOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Todo">
                  <IconButton onClick={() => handleOpenDeleteDialog(todo.id)}>
                    <DeleteOutline color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalRecords}
        page={currentPage - 1} // Adjust for zero-indexing
        rowsPerPage={pageSize}
        onPageChange={handlePaginationChange}
        rowsPerPageOptions={[]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this Todo?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Todo;
