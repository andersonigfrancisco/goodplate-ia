import axios from "axios";

export const api =  axios.create({
  baseURL: 'https://api.clarifai.com',
  headers:{
    'Accept': 'application/json',
    "Authorization":"Key f1c6450c5bd7421aa65946865ad8de52"
  }
})