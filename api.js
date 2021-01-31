const axios = require('axios');
const instance = axios.create({
  baseURL: `https://localhost:3002/movies`,
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
  deleteMovie
}
