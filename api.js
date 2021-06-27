const axios = require('axios');
const MONGODB_URI = process.env.MONGODB_URI;
const instance = axios.create({
  baseURL: MONGODB_URI,
  mode: 'cors',
  cache: 'no-cache',
headers: { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*'}
});

const getMovie = async ()=> {
  try {
    const list = await instance.get();
    return list.data;
  } catch (err) {
    console.error(err);
  }
};

const addMovie =  async item => {
  const result = await instance.post('', item)
  console.log(result);
  return result;
};

const updateMovie =  async item => {
  const result = await instance.put('/' + item._id, item);
  console.log(result);
  return result;
};

const deleteMovie =  async item => {
  const result = await instance.delete('/' + item._id);
  console.log(result);
  return result;
};

module.exports = {
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie,
  instance
}
