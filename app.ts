import express, { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

type ErrorResponse = { error: string };

type CreateFileRequestBody = {
  name: string,
  content: string
};
type CreateFileResponse = {
  name: string,
  content: string
};
app.post('/files', async (request: Request<any, any, CreateFileRequestBody>, response: Response<CreateFileResponse | ErrorResponse>) => {
  const BASE_PATH = './';
  const { name } = request.body;
  if (!name) {
    response.status(403).json({ error: 'File name or content are missing' });
    return;
  }

  const filePath = `${BASE_PATH}${name}`;
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath).toString();
    response.status(409).json({ name, content: existingContent });
    return;
  }

  const content = request.body.content || (await axios.get(
    'https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text'
  )).data;
  fs.writeFileSync(filePath, content);
  response.status(200).json({ name, content });
});

export default app;
