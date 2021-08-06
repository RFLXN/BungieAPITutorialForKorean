const Downloader = require("./db_downloader");

(async () => {
    // 한국어 DB파일 전부 다운로드 받기
    await Downloader.downloadLanguageDB("ko");

    // 특정 DB만 다운로드 받고 싶으면 아래처럼 해주세요
    // await Downloader.downloadDB("ko", "DestinyInventoryItemDefinition");
    // 한국어 데스티니 아이템 DB만 다운로드 받는 코드입니다.
})();