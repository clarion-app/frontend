
import fs from "fs";
const arg = process.argv[2];

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

if(!packageJson.customFields) {
    packageJson.customFields = {};
}

packageJson.customFields.backendUrl = arg;

fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2), "utf-8");