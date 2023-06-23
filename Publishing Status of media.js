const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzU0MzQyMCwiZXhwIjoxNjg3NTQ0MzIwLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.W0SaFLsJ9Tq9BWnHoNkuoTU7N9uKEsJ--gaaX0rGAXgZ1hSzNldgzjQWoeeF31j8z5hbilOfbADTfue25356ZcsALznE5o9qqvrJDbqegv5ksZwVXcUfy8wbNEftHCH3WrR30L69D2IYMeaZsOnjHA2abxKnJtUu7TUmsaRTe6HuDKz4x3G-ch9EizyZCeQLqs3HCvru14-QE1_JrCdEZu3GELUos2vh7xCYx5RHK59hhp_XYVUD5z-0Yc9c3GQTmWEa7fX1732ehXyRb4nSX1E1yD1TgArmNjm_4GhkdmbkUgR1MUmYK7aSIPNgrpZL3p3jatYB-ASWJykGIjqVzw';
const pageSize = 20;

// Step 1: Retrieve Media IDs with status not equal to "Published"
const fetchMediaIds = async () => {
  let pageNumber = 1;
  let mediaIds = [];

  while (true) {
    const url = `https://content-api.sitecorecloud.io/api/content/v1/media?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve media IDs. Status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      // All media IDs have been retrieved
      break;
    }

    const filteredMediaIds = data.data
      .filter(item => item.system.status !== "Published")
      .map(item => item.id);

    mediaIds = mediaIds.concat(filteredMediaIds);

    pageNumber++;
  }

  return mediaIds;
};

// Step 2: Publish each Media ID
const publishMediaIds = async () => {
  const mediaIds = await fetchMediaIds();

  mediaIds.forEach(mediaId => {
    const publishUrl = `https://content-api.sitecorecloud.io/api/content/v1/media/${mediaId}/publish`;

    fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          console.log(`Successfully published media with ID: ${mediaId}`);
        } else {
          console.error(`Failed to publish media with ID: ${mediaId} => Status: ${response.status} ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(`Error publishing media with ID: ${mediaId}:`, error);
      });
  });
};

// Start the process
publishMediaIds()
  .catch(error => {
    console.error('Error retrieving and publishing media IDs:', error);
  });
