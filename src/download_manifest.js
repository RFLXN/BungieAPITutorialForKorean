const axios = require("axios");
const fs = require("fs");

// 번지 애플리케이션 API KEY
const API_KEY = "YOUR_API_KEY";

// 번지 API Root Path
const ROOT_PATH = "https://www.bungie.net/Platform"

// request header 설정
const headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
};

//---------- 엔드포인트 Path 설정 ----------
const endpointPath = "ENDPOINT_PATH";
const endpointMethod = "ENDPOINT_VERB";

//
const requestOption = {
    headers,
    url: `${ROOT_PATH}${endpointPath}`,
    method: endpointMethod
};

(async () => {
    const response = await axios(requestOption);
    await fs.promises.writeFile("./manifest.json", JSON.stringify(response.data));
    console.log(response.data);
})();
