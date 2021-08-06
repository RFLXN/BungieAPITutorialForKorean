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
5. API 실제로 사용해보기 (데스티니 마니페스트 받아오기)
6. JSON이란?
7. 7. 데스티니 마니페스트 다운로드 받기
8. 마니페스트로부터 데스티니 DB 받아오기

> 서술 예정 내용
> * Path Parameter
> * Querystring
> * OAuth (Require Domain, Web Server, HTTPS Certification)
> * Post Method Endpoints

# 1.개발 환경 세팅
> 본 튜토리얼은 windows10 + javascript/node.js 환경을 기준으로 작성되었습니다.    
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
> 해당 섹션은 REST API 이용에 관한 아주 기초적인 지식에 관한 내용임으로 필요없으신분은 5번으로 가셔도 상관 없습니다.    
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
> 여기에선 API 사용을 위한 기초 코드를 작성하게 될 것입니다.    
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


# 5. API 실제로 사용해보기 (데스티니 마니페스트 받아오기)
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


# 6. JSON이란?
> 본 섹션은 API로부터 받아온 JSON 형식의 데이터를 처리하기위한 최소한의 설명을 서술합니다.    
이미 JSON 관련 지식에 대해서 알고 계신 분은 스킵하셔도 문제 없습니다.    

JSON은 데이터의 전달, 저장 등을 위한 일종의 포멧입니다.    
우선은 설명을 위해 JSON의 예시를 보도록 합시다.   

```json
{
   "tian": {
      "intelligence": 0,
      "isTitanStupid": true,
      "favoriteSubclass": "arc middle tree",
      "exotics": [
         "CUIRASS OF THE FALLING STAR",
         "LION RAMPANT"
      ]
   }
}
```

위 예제의 구조를 해석해 보면 아래와 같습니다.
> titan 오브젝트 안에는 intelligence, isTitanStupid, favoriteSubclass, exotics라는 4개의 오브젝트가 있다.    
> intelligence에는 number 타입 (말 대로 숫자를 의미합니다)의 값인 0이 들어가 있다.    
> isTitanStupid에는 boolean타입 (true 혹은 false를 의미합니다)의 값인 true가 들어가 있다.    
> favoriteSubclass에는 string타입 (문자열을 의미합니다)의 값인 "arc middle tree"가 들어가 있다.    
> exotics에는 string타입의 배열 (같은 타입의 값을 여러개 포함하는 오브젝트)이 들어가 있고, 이 배열에는
> 문자열의 값인 "CUIRASS OF THE FALLING STAR"와 "LION RAMPANT"가 들어가 있다.

위의 내용을 이용해서, 소스코드 내에서 활용하려면 아래와 같이 되죠.

```javascript
// titan의 intelligence의 값인 0이 intelOfTitan에 들어가게 됨
const intelOfTitan = titan.intelligence;

// titan의 isTitanStupid의 값인 true가 stupidityOftitan에 들어가게 됨
const stupidityOfTitan = titan.isStupid;

// titan의 favoriteSubclass의 값인 "arc middle tree"가 favTitanClass 안에 들어가게 됨
const favTitanClass = titan.favoriteSubclass;

// titan의 exotics의 첫번쨰 값인 "CUIRASS OF THE FALLING STAR"가 myFavTitanExotic에 들어가게 됨
const myFavTitanExotic = titan.exotics[0];

/* 참고: 배열은 0번부터 시작합니다. 1번째는 [0], 5번째는 [4] 이런식으로 사용한다는 소리. */
```

대충 이해가 가시나요?    
JSON에 관한 내용은 조금만 찾아봐도 많이 나오니, 봐도 모르겠으면 따로 찾아보시는게 나을겁니다.    
그럼 이제 실제로 데스티니 아이템 DB를 받아와 보죠!

# 7. 데스티니 마니페스트 다운로드 받기
5번에서, Destiny2.GetDestinyManifest 엔드포인트로부터 데스티니 마니페스트를 받아왔었습니다.    
이 마니페스트를 이용하기 위해, 우선은 로컬에 파일로 저장해 봅시다.

```javascript
const axios = require("axios");
const fs = require("fs");
```
소스코드의 맨 위에 의 부분에 const fs = require("fs");를 추가해 줍시다.

```javascript
(async () => {
    const response = await axios(requestOption);
    await fs.promises.writeFile("./manifest.json", JSON.stringify(response.data));
    console.log(response.data);
})();
```
소스코드의 아랫부분에 await fs.promises.writeFile("./manifest.json", JSON.stringify(response.data)); 를 추가해 줍니다.    
    
소스코드에 추가가 끝낫고, 저장을 완료했다면 다시한번 실행해 줍시다.   

위에서 했던것처럼 cmd창에서
```
node test.js
```
를 써 주시면 되겠죠.    
    
실행하고나면 manifest.json이라는 파일이 생성 될 것입니다.    
파일을 열어보면 한줄로 simplify 되어서 읽기 힘든 json 파일이 나올것입니다.    
IDE 사용하시면 알아서 리포매팅 하시면 되는데, 이런거 없으신 분들을 위해 정리하자면,
```json
{
   "Response": {
      "jsonWorldComponentContentPaths": {
         "ko": {
            "DestinyNodeStepSummaryDefinition": "/common/destiny2_content/json/ko/DestinyNodeStepSummaryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyArtDyeChannelDefinition": "/common/destiny2_content/json/ko/DestinyArtDyeChannelDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyArtDyeReferenceDefinition": "/common/destiny2_content/json/ko/DestinyArtDyeReferenceDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyPlaceDefinition": "/common/destiny2_content/json/ko/DestinyPlaceDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityDefinition": "/common/destiny2_content/json/ko/DestinyActivityDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityTypeDefinition": "/common/destiny2_content/json/ko/DestinyActivityTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyClassDefinition": "/common/destiny2_content/json/ko/DestinyClassDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyGenderDefinition": "/common/destiny2_content/json/ko/DestinyGenderDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyInventoryBucketDefinition": "/common/destiny2_content/json/ko/DestinyInventoryBucketDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRaceDefinition": "/common/destiny2_content/json/ko/DestinyRaceDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyTalentGridDefinition": "/common/destiny2_content/json/ko/DestinyTalentGridDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyUnlockDefinition": "/common/destiny2_content/json/ko/DestinyUnlockDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyMaterialRequirementSetDefinition": "/common/destiny2_content/json/ko/DestinyMaterialRequirementSetDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySandboxPerkDefinition": "/common/destiny2_content/json/ko/DestinySandboxPerkDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyStatGroupDefinition": "/common/destiny2_content/json/ko/DestinyStatGroupDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyProgressionMappingDefinition": "/common/destiny2_content/json/ko/DestinyProgressionMappingDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyFactionDefinition": "/common/destiny2_content/json/ko/DestinyFactionDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyVendorGroupDefinition": "/common/destiny2_content/json/ko/DestinyVendorGroupDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardSourceDefinition": "/common/destiny2_content/json/ko/DestinyRewardSourceDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyUnlockValueDefinition": "/common/destiny2_content/json/ko/DestinyUnlockValueDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardMappingDefinition": "/common/destiny2_content/json/ko/DestinyRewardMappingDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardSheetDefinition": "/common/destiny2_content/json/ko/DestinyRewardSheetDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyItemCategoryDefinition": "/common/destiny2_content/json/ko/DestinyItemCategoryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyDamageTypeDefinition": "/common/destiny2_content/json/ko/DestinyDamageTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityModeDefinition": "/common/destiny2_content/json/ko/DestinyActivityModeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyMedalTierDefinition": "/common/destiny2_content/json/ko/DestinyMedalTierDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyAchievementDefinition": "/common/destiny2_content/json/ko/DestinyAchievementDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityGraphDefinition": "/common/destiny2_content/json/ko/DestinyActivityGraphDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityInteractableDefinition": "/common/destiny2_content/json/ko/DestinyActivityInteractableDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyBondDefinition": "/common/destiny2_content/json/ko/DestinyBondDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyCharacterCustomizationCategoryDefinition": "/common/destiny2_content/json/ko/DestinyCharacterCustomizationCategoryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyCharacterCustomizationOptionDefinition": "/common/destiny2_content/json/ko/DestinyCharacterCustomizationOptionDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyCollectibleDefinition": "/common/destiny2_content/json/ko/DestinyCollectibleDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyDestinationDefinition": "/common/destiny2_content/json/ko/DestinyDestinationDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyEntitlementOfferDefinition": "/common/destiny2_content/json/ko/DestinyEntitlementOfferDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyEquipmentSlotDefinition": "/common/destiny2_content/json/ko/DestinyEquipmentSlotDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyStatDefinition": "/common/destiny2_content/json/ko/DestinyStatDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyInventoryItemDefinition": "/common/destiny2_content/json/ko/DestinyInventoryItemDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyInventoryItemLiteDefinition": "/common/destiny2_content/json/ko/DestinyInventoryItemLiteDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyItemTierTypeDefinition": "/common/destiny2_content/json/ko/DestinyItemTierTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyLocationDefinition": "/common/destiny2_content/json/ko/DestinyLocationDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyLoreDefinition": "/common/destiny2_content/json/ko/DestinyLoreDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyMetricDefinition": "/common/destiny2_content/json/ko/DestinyMetricDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyObjectiveDefinition": "/common/destiny2_content/json/ko/DestinyObjectiveDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyPlatformBucketMappingDefinition": "/common/destiny2_content/json/ko/DestinyPlatformBucketMappingDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyPlugSetDefinition": "/common/destiny2_content/json/ko/DestinyPlugSetDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyPowerCapDefinition": "/common/destiny2_content/json/ko/DestinyPowerCapDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyPresentationNodeDefinition": "/common/destiny2_content/json/ko/DestinyPresentationNodeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyProgressionDefinition": "/common/destiny2_content/json/ko/DestinyProgressionDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyProgressionLevelRequirementDefinition": "/common/destiny2_content/json/ko/DestinyProgressionLevelRequirementDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRecordDefinition": "/common/destiny2_content/json/ko/DestinyRecordDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardAdjusterPointerDefinition": "/common/destiny2_content/json/ko/DestinyRewardAdjusterPointerDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardAdjusterProgressionMapDefinition": "/common/destiny2_content/json/ko/DestinyRewardAdjusterProgressionMapDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyRewardItemListDefinition": "/common/destiny2_content/json/ko/DestinyRewardItemListDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySackRewardItemListDefinition": "/common/destiny2_content/json/ko/DestinySackRewardItemListDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySandboxPatternDefinition": "/common/destiny2_content/json/ko/DestinySandboxPatternDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySeasonDefinition": "/common/destiny2_content/json/ko/DestinySeasonDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySeasonPassDefinition": "/common/destiny2_content/json/ko/DestinySeasonPassDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySocketCategoryDefinition": "/common/destiny2_content/json/ko/DestinySocketCategoryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinySocketTypeDefinition": "/common/destiny2_content/json/ko/DestinySocketTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyTraitDefinition": "/common/destiny2_content/json/ko/DestinyTraitDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyTraitCategoryDefinition": "/common/destiny2_content/json/ko/DestinyTraitCategoryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyUnlockCountMappingDefinition": "/common/destiny2_content/json/ko/DestinyUnlockCountMappingDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyUnlockEventDefinition": "/common/destiny2_content/json/ko/DestinyUnlockEventDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyUnlockExpressionMappingDefinition": "/common/destiny2_content/json/ko/DestinyUnlockExpressionMappingDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyVendorDefinition": "/common/destiny2_content/json/ko/DestinyVendorDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyMilestoneDefinition": "/common/destiny2_content/json/ko/DestinyMilestoneDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyActivityModifierDefinition": "/common/destiny2_content/json/ko/DestinyActivityModifierDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyReportReasonCategoryDefinition": "/common/destiny2_content/json/ko/DestinyReportReasonCategoryDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyArtifactDefinition": "/common/destiny2_content/json/ko/DestinyArtifactDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyBreakerTypeDefinition": "/common/destiny2_content/json/ko/DestinyBreakerTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyChecklistDefinition": "/common/destiny2_content/json/ko/DestinyChecklistDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json",
            "DestinyEnergyTypeDefinition": "/common/destiny2_content/json/ko/DestinyEnergyTypeDefinition-339ab5ed-b919-4d17-9328-cc340f8c2b61.json"
         }
      }
   }
}
```
위의 내용을 사용하게 될 것입니다.

**오브젝트 내의 문자열 값들은 버전에 따라 바뀔 수 있음에 주의하세요! ("/common/destiny/~~~"에 해당하는 것들)**    
    
# 8. 마니페스트로부터 데스티니 DB 받아오기
우선은, 위에서 받아온 마니페스트 파일을 사용하기 위한 모듈을 만들어 봅시다.    
    
새 파일을 만들어 주세요. 예제에서는 db_downloader.js로 진행합니다.    
    
아래의 소스를 만들어주세요.
```javascript
const axios = require("axios");
const fs = require("fs");
const path = require("path")

class DBDownloader {
    // 데스티니 마니페스트 로드
    static #MANIFEST = JSON.parse(fs.readFileSync("./manifest.json"));
    static #JSON_DB = this.#MANIFEST.Response.jsonWorldComponentContentPaths;

    static #BUNGIE_NET_URL = "https://www.bungie.net/";

    // 마니페스트로부터 데스티니 DB 다운로드
    static async downloadDB(lang, component) {
        const targetPath = this.#JSON_DB[lang][component];
        const url = this.#BUNGIE_NET_URL + targetPath;
        const fileName = `${lang}/${component}.json`;

        const hasLangDir = await this.#hasLangDir(lang);

        if (!hasLangDir) {
            await this.#createLangDir(lang);
        }

        await this.#downloadFile(url, fileName);
    }

    // 특정 언어의 DB 모두 다운로드
    static async downloadLanguageDB(lang) {
        console.log(`Download All DB: "${lang}"`);

        const paths = this.#JSON_DB[lang];
        const components = Object.keys(paths);
        for (const component of components) {
            await this.downloadDB(lang, component);
        }
    }
    
    static async #downloadFile(url, filePath) {
        const response = await axios.get(url);
        const data = JSON.stringify(response.data);

        const resolvedPath = path.resolve(`./${filePath}`);
        await fs.promises.writeFile(resolvedPath, data);
        console.log(`File Downloaded From "${url}" to ${resolvedPath}`);
    }

    static async #hasLangDir(lang) {
        let hasDir = false;

        try {
            const stat = await fs.promises.stat(`./${lang}`);
            hasDir = stat.isDirectory();
        } catch {
            hasDir = false;
        }


        return hasDir;
    }

    static async #createLangDir(lang) {
        await fs.promises.mkdir(lang);
    }
}

module.exports = DBDownloader;
```
간단하게 마니페스트를 참조해서 DB파일을 다운로드하는 클래스를 만들었습니다.    
    
이제 실제로 DB파일을 다운로드하기 위한 소스 파일을 만들어 봅시다.    
대충 dl_test.js로 만들도록 합시다.

```javascript
// 위에서 만든 dl_downloader 로드
// 만약 파일 이름이 다르면 해당 파일명으로 바꿔주세요
const Downloader = require("./db_downloader");

(async () => {
    // 한국어 DB파일 전부 다운로드 받기
    await Downloader.downloadLanguageDB("ko");

    // 특정 DB만 다운로드 받고 싶으면 아래처럼 해주세요
    // await Downloader.downloadDB("ko", "DestinyInventoryItemDefinition");
    // 한국어 데스티니 아이템 DB만 다운로드 받는 코드입니다.
})();
```
완성되었다면 실행해 봅시다.

```
node dl_test.js
```

그러면 ko라는 폴더가 생성되면서 그 안에 한국어 데스티니 DB가 다운로드 될 것입니다. (시간 좀 걸림)    
