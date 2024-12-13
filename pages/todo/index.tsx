import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Checkbox, Modal } from 'antd';
import { getTodoListAPI, removeTodoAPI, TodoObj, updateTodoAPI } from '@/utils/api/todo.api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const Todo = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  const getTodoList = async (page: number) => {
      try {
        const todoListResponse = await getTodoListAPI({page, limit: 10});
        if(todoListResponse.success) {
            setTotalRecords(todoListResponse.totalCount);
            setTodos(todoListResponse.data);
        }
      } catch (error) {
        console.error('[getTodoList error]', error);
      }
  };

  const handleCheckboxChange = async (id: string, isChecked: boolean) => {
    try {
        const response = await updateTodoAPI({todoId: id , payload : {isCompleted: isChecked}});
        if(response.success) {
            setTodos((prevData) => {
                const data = prevData.filter((todo: TodoObj) => {
                    if(todo.id === response.data.id) {
                        todo.isCompleted = response.data.isCompleted
                    }
                    return todo
                })
                return data;
            })
        }
    } catch (error) {
        console.error('[handleCheckboxChange : error]', error);
    }
  }

  useEffect(() => {
    getTodoList(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string | string[]) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Todo?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const todoResponse = await removeTodoAPI(id);
          if (todoResponse.success) {
            setTodos((prevTodos) => prevTodos.filter((todo: TodoObj) => todo.id !== id));
          }
        } catch (error) {
          console.error('[handleDelete error]', error);
        }
      },
      onCancel() {
        console.log('Delete action cancelled');
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed',
        render: (completed: boolean, record: TodoObj) => (
          <Checkbox
            checked={record.isCompleted}
            onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
          />
        ),
      },
    {
        title: 'Actions',
        key: 'actions',
        render: (text: string, record: TodoObj) => (
          <Space size="middle">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => router.push(`/todo/manage?id=${record.id}`)}
            >
              Edit
            </Button>
            <Button 
              type="link" 
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
  ];

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: totalRecords,
    onChange: handlePaginationChange,
  };

  return (
   
    <div style={{ padding: '20px' }}>
    <h1>Todo List</h1>

    <Button 
      type="primary" 
      style={{ marginBottom: '20px' }} 
      onClick={() => router.push(`/todo/manage`)}
    >
      Add Todo
    </Button>

    <div style={{ marginTop: '20px' }}>
    <Table
      columns={columns}
      dataSource={todos}
      rowKey="id"
      pagination={pagination}
    />
    </div>
  </div>
  );
};

export default Todo;
