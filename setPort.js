
import fs from "fs";
const arg = process.argv[2];

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

packageJson.scripts.dev = "vite --host=0.0.0.0 --port=" + arg;

fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2), "utf-8");