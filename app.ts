import { Application } from "https://deno.land/x/oak/mod.ts";
import { connect } from './helpers/db_client.ts';
import todoRoutes from './routes/todos.ts';

connect();

const app = new Application();

app.use(async (ctx, next) => {
    ctx.response.headers.set('Access-Control-Allow-Origin', '*');
    ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    await next();
})

app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());


console.log("http://localhost:8000/");
await app.listen({ port: 8000 });