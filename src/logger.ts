import * as fs from 'fs';

export const logger = (log: string) => {
    // generate filename from date
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const filename = `${year}-${month}-${day}.log`;

    // path is root + /log
    const path = `./log/${filename}`;

    // check if file exists
    if (!fs.existsSync(path)) {
        // create file
        fs.writeFileSync(path, '');
    }

    // prepend timestamp to log entry
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} ${log}\n`;

    // write to file
    fs.appendFileSync(path, entry);
};