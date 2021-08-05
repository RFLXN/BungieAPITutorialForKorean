# ※아직 미완임※

# 번지넷 API 튜토리얼
이 튜토리얼은 번지 API의 간단한 사용법에 관한 튜토리얼입니다.    
특히, 데스티니 2에 관련된 사항을 주로 다룰것입니다.
    
아주 기초적인 내용만을 서술 할 예정이니 참고해주세요.    
    
이 튜토리얼은 windows10 + javascript/node.js 환경을 기준으로 작성되었습니다.


# 참조 사이트
* [번지넷 API GitHub](https://github.com/Bungie-net/api)    
* [번지넷 API 문서](https://bungie-net.github.io/multi/index.html)    
* [번지넷 API oAuth 관련 사항들](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)    
* [번지넷 API 테스트 폼](http://destinydevs.github.io/BungieNetPlatform/docs/API-Test)    


# 목차
1. 개발 환경 세팅
   1. node.js 설치
   2. 프로젝트 설정
2. 번지 애플리케이션 등록
3. REST API 기초지식
4. 실제로 API를 사용해 보기 위한 기초 코드 세팅
   1. 초심자를 위한 소스코드
   2. 번지 API 기초 설정 관련 사항 (숙련자용)
5. API 실제로 사용해보기

서술 예정 내용
* JSON
* Path Parameter
* Querystring
* OAuth (Require Domain, Web Server, HTTPS Certification)

# 1.개발 환경 세팅
본 튜토리얼은 windows10 + javascript/node.js 환경을 기준으로 작성되었습니다.    
현 섹션은 node.js 및 javascript, 그 외에 기본적인 라이브러리를 설치하는 내용이므로 필요 없으신분은 스킵해서 2번으로 가셔도 상관 없습니다.


## 1-1. node.js 설치
[node.js 다운로드 링크](https://nodejs.org/ko/download/)    
운영체제에 맞는 인스톨러로 node.js를 설치해 주세요.    
설치가 완료되면 cmd 창을 열고 아래의 명령어를 입력합니다.
```
node -v
```
그러면 아마 node.js의 버전이 출력될 것입니다.   

한번 더 확인하기 위해 아래의 명령어를 입력해주세요.
```
npm -v
```
이번에는 npm(node.js 패키지 매니저)의 버전이 출력될 것입니다.    
    
해당 명령어를 입력해서 둘 다 문제없이 버전이 출력되었다면 1단계는 끝입니다!    

뭔가 잘 안된다 싶으면 구글에 조금만 검색해도 나오니 알아서 설치하십셔.


## 1-2. 프로젝트 설정
대충 원하는 디렉토리에 프로젝트 디렉토리를 생성해 주세요.   
cmd 창에서 해당 프로젝트 디렉토리를 엽니다.
```
cd {프로젝트_디렉토리_경로}
```

즉, C 드라이브에 bungie_api 폴더를 만드셨다면
```
cd c:\bungie_api
```
라고 치시면 됩니다.    


위의 명령어로 해당 디렉토리를 연 뒤에 아래의 명령어를 실행합니다.
```
npm init -y
```
위의 명령어를 실행하면 디렉토리에 package.json 파일이 생성될 것입니다.

다음으로, API와의 http통신을 위한 라이브러리를 설치합니다.
```
npm install axios
```
그러면 package.json의 내용이 조금 변하고, package-lock.json이라는 파일이 생성될 것입니다.    
    
최소한의 기초 설정은 이것으로 끝입니다.    
    
추가적으로, 원활한 코딩을 위해 Visual Studio Code 같은 에디터나, WebStorm 같은 IDE 사용을 권장합니다.    
참고로 필자는 WebStorm을 사용중임을 밝힙니다.


# 2. 번지 애플리케이션 등록
번지 API는 API를 사용하기 위해서 API 키가 필요합니다.    
API키를 발급받기 위해 아래로 들어가서 로그인합니다.  
    
[번지넷 API 애플리케이션](https://www.bungie.net/ko/Application)    
    
로그인이 끝나서 위의 페이지에 들어갔다면, 우측 상단의 "새로운 앱 만들기" 버튼을 클릭합니다.    
그 후에, 적당히 폼에 내용을 기입합니다.    
폼 기입 중에 OAuth 관련은 나중에 추후 설명하도록 하고, 지금은 대충 애플리케이션 이름 정도만 기입하도록 합니다.    

생성을 완료했다면, 해당 애플리케이션의 상세 정보 페이지에서 "API 키"를 저장해두도록 합시다.


# 3. REST API 기초지식
해당 섹션은 REST API 이용에 관한 아주 기초적인 지식에 관한 내용임으로 필요없으신분은 5번으로 가셔도 상관 없습니다.    
더불어서, 아래의 해당 섹션의 내용은 번지 API를 사용하기 위한 내용이므로 실제 REST API의 정의와는 다소 다른 점이 있음을 미리 알립니다.    
    
REST API를 번지 API를 사용하기 위한 내용으로만 최대한 간추려서 설명하면, 
API Endpoint에 http request를 보내면 API 서버 측에서 API와 관련된 정보를 해당 request에 맞게 가공해서 되돌려주는 API의 형식을 
REST API 라고 부릅니다.    
관련 지식이 없으면 이해하기 힘든게 정상이니 아래의 예제와 같이 이해해봅시다.    

번지 API의 API Root Path는 아래와 같습니다.    
https://www.bungie.net/Platform    

그리고 이 아래에 여러개의 API Endpoint들이 있는데, 우선은 Destiny2.GetDestinyManifest 엔드포인트를 예제로 들어 봅시다.

[Destiny2.GetDestinyManifest 엔드포인트 문서](https://bungie-net.github.io/multi/operation_get_Destiny2-GetDestinyManifest.html#operation_get_Destiny2-GetDestinyManifest)    

위의 엔드포인트 문서를 보시면, 아래와 같은 내용을 확인 할 수 있습니다.
```
Verb: GET
Path: /Destiny2/Manifest/
```

이게 무슨 내용이냐 하면, "/Destiny2/Manifest/"라는 경로로 GET 메소드로 request를 보내면 된다는 소리입니다.
뭔소리냐고요? 아래를 보면 이해가 되실겁니다.
```
https://www.bungie.net/Platform/Destiny2/Manifest/
```
뭔가 본 두개가 합쳐진 모습이죠?    
번지 API Root Path와 엔드포인트의 Path가 합쳐진 모양입니다.    

GET 메소드에 관한 내용은 나중에 실제로 API를 사용해 볼 때 확인하기로 하고, 
여기에선 번지 API는 API Root Path와 엔드포인트 Path의 조합을 이용한다는것을 알고 가도록 합시다.


# 4. 실제로 API를 사용해 보기 위한 기초 코드 세팅
여기에선 API 사용을 위한 기초 코드를 작성하게 될 것입니다.    

REST API에 관련해 숙련되신 분들은 4-2번으로 바로 가주세요!


## 4-1. 초심자를 위한 소스코드
우선 프로젝트 내에 새로운 소스파일을 생성해 줍시다.    
여기서는 test.js라는 이름의 파일로 진행합니다.    
파일을 만들었다면, 에디터나 IDE로 test.js파일을 열고 아래의 코드를 써줍니다.

```javascript
const axios = require("axios");

// 번지 애플리케이션 API KEY
const API_KEY = "2번에서_발급받은_API_KEY";

// 번지 API Root Path
const ROOT_PATH = "https://www.bungie.net/Platform"

// request header 설정
const headers = {
   "Content-Type": "application/json",
   "X-API-Key": API_KEY
};

//---------- 엔드포인트 Path 설정 ----------
const endpointPath = "사용할_엔드포인트_Path";
const endpointMethod = "사용할_엔드포인트_Verb";

//
const requestOption = {
   headers,
   url: `${ROOT_PATH}${endpointPath}`,
   method: endpointMethod
};

// API와 통신 후 결과 출력
(async () => {
   const response = await axios(requestOption);
   console.log(response.data);
})();
```

위의 코드를 모두 작성했다면 이제 API를 사용할 준비가 완료된것입니다!


## 4-2. 번지 API 기초 설정 관련 사항 (숙련자용)

아래는 번지 API용 http request header 폼 입니다.

```http request
Content-Type: application/json
X-API-KEY: {YOUR_API_KEY}
```

헤더에 Content-Type를 application/json으로,     
X-API-KEY 헤더를 2번에서 발급받은 API KEY로 설정해주시고 request를 보내주시면 됩니다.

method랑 url 관련 내용은 생략하도록 하겠습니다.


## 5. API 실제로 사용해보기
이번엔 실제로 API에서 데이터를 받아와 봅시다.    
3번에서처럼 Destiny2.GetDestinyManifest 엔드포인트를 예시로 진행 해 보겠습니다.    
    
4-1번에서 짠 소스코드를 보면 아래와 같은 부분이 있을것입니다.

```javascript
// 번지 애플리케이션 API KEY
const API_KEY = "2번에서_발급받은_API_KEY";
```
주석대로 2번에서 발급받은 API KEY를 설정해 줍시다.    
즉, 발급받은 API KEY가 1q2w3e43r5t6y7u라고 가정한다면, 
```javascript
const API_KEY = "1q2w3e43r5t6y7u";
```
가 되겠죠.    
    
이번엔 엔드포인트를 설정해줍시다.
```javascript
//---------- 엔드포인트 Path 설정 ----------
const endpointPath = "사용할_엔드포인트_Path";
const endpointMethod = "사용할_엔드포인트_Verb";
```
위의 내용에서 "사용할_엔드포인트_Path" 부분과 "사용할_엔드포인트_Verb" 부분을 우리가 사용할 엔드포인트에 맞게 설정해 줍시다.    
Destiny2.GetDestinyManifest 엔드포인트를 예시로 사용하기로 했으니깐 해당 엔드포인트의 Path와 Verb를 넣어주면 아래와 같이 되겠죠.

```javascript
//---------- 엔드포인트 Path 설정 ----------
const endpointPath = "/Destiny2/Manifest/";
const endpointMethod = "GET";
```

위와 같이 설정함으로써 API에서 정보를 받아오기 위한 모든 준비가 끝났습니다!
    
참고로, 3번에서 설명할 때
```
https://www.bungie.net/Platform/Destiny2/Manifest/
```
라는 URL이 필요하다고 했었습니다.

해당 URL을 위 소스코드의
```
url: `${ROOT_PATH}${endpointPath}`
```
부분에서 위의 URL의 형태로 가공한다고 알고 계시면 됩니다.    
    
아무튼, 소스코드는 완성되었으니 실제로 사용해 볼까요?

cmd창을 다시 열고, 프로젝트 디렉토리를 다시 열어 주세요.    
혹시 모르니 한번 더 써주자면
```
cd {프로젝트_디렉토리}
```
로 열어주시면 됩니다.    

디렉토리를 열었다면 아래의 명령어를 입력합니다.
```
node {소스파일명}
```

예제의 경우에는 test.js 라는 이름으로 만들었으니
```
node test.js
```
가 되겠네요.

위의 명령어를 실행하면 API로부터 가져온 데이터가 출력됩니다. 짠 짜잔!
