import { headers } from "./config.js";

function errorHandle(res,statusCode = 400, message = '欄位未填寫正確，或無此 todo id') {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify({
    'status': 'error',
    message
  }))
}

export default errorHandle;