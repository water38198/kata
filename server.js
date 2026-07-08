import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { headers } from './config.js';
import errorHandle from './errorHandel.js';

const todos = [
  {
    title: '今天要刷牙',
    id: uuidv4(),
  }
];

const successResponse = (res) => {
  res.writeHead(200, headers);
  res.end(JSON.stringify({
    status: 'success',
    data: todos
  }));
}
const requestListener = (req,res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url === '/todos' && req.method === 'GET') {
    successResponse(res);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title.trim();
        const isValidTitle = typeof title === 'string' && title !== '';
        if (isValidTitle) {
          const todo = {
            title,
            id:uuidv4(),
          }
          todos.push(todo);
          successResponse(res);
        } else {
          errorHandle(res)
        }
      } catch (error) {
        errorHandle(res)
      }
    })
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    successResponse(res);
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(el => el.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      successResponse(res);
    } else {
      errorHandle(res, 404, '無此 todo id');
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const isValidTitle = typeof title === 'string' && title.trim() !== '';
        const id = req.url.split('/').pop();
        const index = todos.findIndex(el => el.id === id);
        if (isValidTitle && index !== -1) {
          todos[index].title = title;
          successResponse(res);
        } else if(index === -1){
          errorHandle(res,404,'無此 todo id');
        }else {
          errorHandle(res);
        }
      } catch (error) {
        res.writeHead(404, headers);
        res.end({status:'error',message:'找不到網頁'})
      }
    })
  } else {
    
  }
}


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

