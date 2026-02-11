const fs = require('fs');
const path = require('path');

function checkBrackets(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let stack = [];
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        for (let j = 0; j < line.length; j++) {
            let char = line[j];
            if (char === '[' || char === '{') {
                stack.push({ char, line: i + 1, col: j + 1 });
            } else if (char === ']' || char === '}') {
                if (stack.length === 0) {
                    // Extra closing bracket
                    // console.log(`${filePath}:${i+1}:${j+1} - Unexpected ${char}`);
                    continue;
                }
                let last = stack.pop();
                if ((char === ']' && last.char !== '[') || (char === '}' && last.char !== '{')) {
                    console.log(`${filePath}:${i + 1}:${j + 1} - Mismatched ${char} for ${last.char} at line ${last.line}`);
                }
            }
        }
    }
    if (stack.length > 0) {
        stack.forEach(unclosed => {
            console.log(`${filePath}:${unclosed.line}:${unclosed.col} - Unclosed ${unclosed.char}`);
        });
    }
}

const dir = process.argv[2] || '.';
const files = fs.readdirSync(dir, { recursive: true });
files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isFile()) {
            checkBrackets(fullPath);
        }
    }
});
