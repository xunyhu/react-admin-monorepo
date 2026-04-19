import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

import app from './app';

const port = Number(process.env.PORT || 3001);

app.listen(port, '0.0.0.0', () => {
  console.log(`server running http://0.0.0.0:${port}`);
});
