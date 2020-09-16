import { Router } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

import { getDb } from '../helpers/db_client.ts'

const router = new Router();

interface Todo {
    id?: String,
    text: String
}

interface TodoSchema {
    _id: { $oid: string },
    text: string
}

type RequestParams = { todoId: string };
type RequestBody = { text: string };


router.get('/todos', async (ctx) => {
    const todos = await getDb().collection<TodoSchema>('todos').find();
    const transformedTodos = todos.map(
        (todo: TodoSchema) => {
            return {
                id: todo._id.$oid,
                text: todo.text
            }
        }
    )
    ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx) => {
    const body = await ctx.request.body().value as RequestBody;
    const newTodo: Todo = {
        text: body.text
    }
    const id = await getDb().collection('todos').insertOne(newTodo);
    newTodo.id = id.$oid;
    ctx.response.body = { message: 'ToDo added', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
    const body = await ctx.request.body().value as RequestBody;
    const params = ctx.params! as RequestParams;
    const todoId = params.todoId;
    await getDb().collection('todos').updateOne({ _id: ObjectId(todoId) }, {
        $set: {
            text: body.text
        }
    });
    ctx.response.body = { message: 'ToDo edited' };
});

router.delete('/todos/:todoId', async (ctx) => {
    const params = ctx.params! as RequestParams;
    const todoId = params.todoId;
    await getDb().collection('todos').deleteOne({_id: ObjectId(todoId)});
    ctx.response.body = { message: 'ToDo deleted' };
});

export default router;