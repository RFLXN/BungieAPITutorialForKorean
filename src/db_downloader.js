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