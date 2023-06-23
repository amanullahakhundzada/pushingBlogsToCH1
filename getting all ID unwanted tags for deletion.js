  const fs = require('fs');
  const axios = require('axios');
  
  const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/?system.contentType.id=blogTag';
  const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzUwNzcwMSwiZXhwIjoxNjg3NTA4NjAxLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.k3JAJWGnXZ5igZGvwtDNAqmUw5P2t-8RKFIbEWpRxS5HnZaSCh5ki5vFoXxMId899hb_bdQlFwHhvx-jL_LWJzt4rvc0nSxYclnCpRxeDmLTCfrVKo1aN0oy3V9Ji9HeLJuSsLRWrt3ZrMTI26cg5Wf5l3twPhVXVOGVFRPmZ__FS7cMNgara2LyukZK_MkgXrukoQ633Z5ub7OiXGHCeWkWrlYYd-kYKg8PhLRJe5wJIATlC1EvL91G1UhKymI973nomjbTDaqp6ehGuQTSZbRjw9tWwSV13hjiYEjX6PYjwAZw8TCSsUxJfAWreFfnJOfZDi8bRbSpT_34VIVCTg';
  const outputFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/TagsNeedToBeDeleted/tags.json';
  // const outputFilePath = 'tags.json'; // Path to the output JSON file
  
  const getTags = async () => {
    let allTags = [];
    let pageNumber = 1;
    let pageSize = 20;
    let totalPages = 1;
  
    while (pageNumber <= totalPages) {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`
          },
          params: {
            pageNumber,
            pageSize,
          },
        });
  
        if (response.data && Array.isArray(response.data.data)) {
          allTags.push(
            ...response.data.data.filter(item => item.name && item.name.includes(','))
          );
  
          pageNumber = response.data.pageNumber;
          pageSize = response.data.pageSize;
          totalPages = Math.ceil(response.data.totalCount / pageSize);
        } else {
          console.error('Invalid response data:', response.data);
          break;
        }
      } catch (error) {
        console.error('Error retrieving tags:', error);
        break;
      }
  
      pageNumber++;
    }
  
    return allTags;
  };
  
  getTags()
    .then(tags => {
      const formattedTags = tags.map(({ id, name }) => ({
        tagsid: id,
        name,
      }));
  
      const jsonData = JSON.stringify(formattedTags, null, 2);
  
      try {
        fs.writeFileSync(outputFilePath, jsonData, 'utf8');
        console.log(`Tags written to file: ${outputFilePath}`);
      } catch (err) {
        console.error('Error writing to file:', err);
      }
    })
    .catch(error => {
      console.error('Error retrieving tags:', error);
    });






    // const fs = require('fs');
    // const axios = require('axios');
    
    // const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/?system.contentType.id=blogTag';
    // const bearerToken = 'YOUR_BEARER_TOKEN';
    // const outputFilePath = 'tags.json'; // Path to the output JSON file
    
    // axios.get(apiUrl, {
    //   headers: {
    //     Authorization: `Bearer ${bearerToken}`
    //   }
    // })
    //   .then(response => {
    //     console.log('Response data:', response.data);
        
    //     if (response.data && Array.isArray(response.data.data)) {
    //       const tags = response.data.data
    //         .filter(item => {
    //           console.log('Name:', item.name);
    //           return item.name && item.name.includes(',');
    //         })
    //         .map(item => {
    //           const { id, name } = item;
    //           return { tagsid: id, name };
    //         });
    
    //       const jsonData = JSON.stringify(tags, null, 2);
    
    //       try {
    //         fs.writeFileSync(outputFilePath, jsonData, 'utf8');
    //         console.log(`Tags written to file: ${outputFilePath}`);
    //       } catch (err) {
    //         console.error('Error writing to file:', err);
    //       }
    //     } else {
    //       console.error('Invalid response data:', response.data);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error retrieving tags:', error);
    //   });
    
