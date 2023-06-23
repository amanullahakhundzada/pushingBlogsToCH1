const fs = require('fs');
const axios = require('axios');

const file = 'C:/Users/AmanullahAkhundzada/Desktop/TagsNeedToBeDeleted/tags.json';
const baseUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/';
const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzUwODk5MSwiZXhwIjoxNjg3NTA5ODkxLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.lnBtdmuo-bVCfeEW3R4CWPRc0wTP6CzSbVvfzdyVALalUWKJ1PYdA3_s5IovPXf1UsUlqfmaXaSQorQZda0EuKTRKaTbnkTuSXY6umM0NxFLTwc5yNzm_-LQJviP4Vss7A7KdyZvXMCbPa8ZpOmKvZ0clZLxw3xXgSIDhraXX4t2cbJLAxagnBDvCDkFwEs3NrzpItv3Z21Q5RWzEFEAH5hY6ueynHHXSLrxjqpfz4nVRfUOcT_Xr3jyWR1vTwXtSVeFXog1ayPcahK0zo492GGeNZU8yzOANEADfo5cscnL8jR6436C-tCWu8ak5WOeYzTj0JF13PSJexF4CCAipA';

// fs.readFile(file, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   const items = JSON.parse(data);

//   items.forEach(async (item) => {
//     const tagsId = item.tagsid;
//     const url = `${baseUrl}${tagsId}/publish`;

//     try {
//       await axios.delete(url, {
//         headers: {
//           Authorization: `Bearer ${bearerToken}`,
//         },
//       });
//       console.log(`Deleted item with tagsid: ${tagsId}`);
//     } catch (error) {
//       console.error(`Error deleting item with tagsid: ${tagsId}`, error);
//     }
//   });
// });


fs.readFile(file, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
    const items = JSON.parse(data);
    const deletedTagsIds = [];
  
    for (const item of items) {
      const tagsId = item.tagsid;
      const url = `${baseUrl}${tagsId}/publish`;
  
      try {
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        deletedTagsIds.push(tagsId);
        console.log(`Deleted item with tagsid: ${tagsId}`);
      } catch (error) {
        console.error(`Error deleting item with tagsid: ${tagsId}`, error);
      }
    }
  
    console.log('Deleted tagsids:', deletedTagsIds);
  });