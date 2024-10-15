
// Get your own API key https://huggingface.co/docs/api-inference/quicktour
const API_TOKEN = "XXXXXTOKENXXXXX"

// The API key would be public here
// If someone else used it, you could run out of access for a bit
// If you want to use it, you can take that risk, which is a mild risk
// If your key is used too much, HuggingFace wont respond to your requests for a while


// You'll meed a modelURL, and a payload, which will be different 
// depending on what task you want to do:
// 		e.g. zero-shot (classify text into one of several category)
// 		or autocompletion
//		or anything else
// Browse all the tasks here: https://huggingface.co/docs/api-inference/detailed_parameters

// Find a good model for your use case? Tell the discord!!!!

function makeRequestFromHuggingFace({ modelURL, payload }) {
  return new Promise((resolve, reject) => {
    const baseURL = "https://api-inference.huggingface.co/models/";
    const API_URL = baseURL + modelURL;

    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    console.log("==========\nHUGGING FACE REQUEST!");
    console.log("Payload:\n", JSON.stringify(payload, null, 2));
    console.log("Headers:\n", JSON.stringify(headers, null, 2));

    // Make the fetch request
    fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle non-OK response here
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        resolve(data); // Resolve the promise with the fetched data
      })
      .catch((error) => {
        console.error(error);
        reject(error); // Reject the promise with the error
      });
  });
}

// // Test different API calls here:
// // Comment these out when not using them
// // Make a Zero-shot classification request
// makeRequestFromHuggingFace({
// 	modelURL: "facebook/bart-large-mnli",
// 	payload: {
// 		"inputs": "Ok, I hate it though",
// 		"parameters": {"candidate_labels": ["happy", "unhappy", "requestChange", "other"]},
// 	}
// })

// // Text completion trained on code
// makeRequestFromHuggingFace({
// 	modelURL: "codellama/CodeLlama-34b-Instruct-hf",
// 	payload: {
// 		"inputs": "Give me P5 code to draw a turquoise triangle",
// 		parameters: {max_new_tokens: 100}
// 	}
// })
		