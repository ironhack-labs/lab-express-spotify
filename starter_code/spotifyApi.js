const axios = require("axios")


axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });

  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        "Authorization": 'Basic ' + btoa(clientId + ':' + clientSecret) 
    },
    data: qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId
    })
})
    .then((response)=> {
        access_token = response.data.access_token;
        console.log(access_token);
    })
    .catch((err)=> {
        console.log(err)
    })