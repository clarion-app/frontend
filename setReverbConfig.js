
import fs from "fs";
const reverbHost = process.argv[2];
const reverbPort = process.argv[3];
const reverbProtocol = process.argv[4];
const reverbAppKey = process.argv[5];

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

if(!packageJson.customFields) {
    packageJson.customFields = {};
}

packageJson.customFields.reverb = {
    host: reverbHost,
    port: reverbPort,
    protocol: reverbProtocol,
    appKey: reverbAppKey
};

fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2), "utf-8");