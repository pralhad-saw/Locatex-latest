/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

const fs = require("fs");
const path = require("path");

const header = `/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

`;


const targetExtensions = [".js", ".ejs", ".css", ".html"];

function addHeaderToFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    if (!content.startsWith("/*")) {
        fs.writeFileSync(filePath, header + content);
        console.log("Header added:", filePath);
    } else {
        console.log("Skipped (Already has header):", filePath);
    }
}

function scanDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== "node_modules" && file !== ".git") {
                scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(fullPath);
            if (targetExtensions.includes(ext)) {
                addHeaderToFile(fullPath);
            }
        }
    });
}

scanDirectory(__dirname);
