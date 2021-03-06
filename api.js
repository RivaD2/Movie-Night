const axios = require('axios');
const instance = axios.create({
  baseURL: `https://api-server-rd.herokuapp.com/movies`,
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
  return result;
};

const updateMovie =  async item => {
  const result = await instance.put('/' + item._id, item);
  return result;
};

const deleteMovie =  async item => {
  const result = await instance.delete('/' + item._id);
  return result;
};

module.exports = {
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie,
  instance
}
