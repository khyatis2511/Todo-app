import * as Yup from 'yup';

export const todoSchema = Yup.object({
 title: Yup.string().required('Title is required').min(3, 'Title should be at least 3 characters'),
});

export interface TodoFormValues {
 title: string;
 description?: string;
}