import request from 'supertest';
import fs from 'fs';
import axios from 'axios';
import app from '../app';

afterEach(() => {
  jest.resetAllMocks();
});

describe('POST /files', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'writeFileSync').mockReturnValue();
  });

  it('creates a new file with provided params', async () => {
    const result = await request(app)
      .post('/files')
      .send({ name: 'test', content: 'something' });
    expect(result.body).toEqual({ name: 'test', content: 'something' });
    expect(result.statusCode).toEqual(200);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('creates a new file with Lorem Ipsum if no content is provided', async () => {
    jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: 'test content' }));

    const result = await request(app)
      .post('/files')
      .send({ name: 'test' });
    expect(result.body).toEqual({ name: 'test', content: 'test content' });
    expect(result.statusCode).toEqual(200);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('responds with an error if file name param is mising', async () => {
    const result = await request(app)
      .post('/files')
      .send({});
    expect(result.body).toHaveProperty('error');
    expect(result.statusCode).toEqual(403);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('responds with a file content if the file already exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('something');
    const res2 = await request(app)
      .post('/files')
      .send({ name: 'test', content: 'duplicate' });
    expect(res2.body).toEqual({ name: 'test', content: 'something' });
    expect(res2.statusCode).toEqual(409);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
  });
});
