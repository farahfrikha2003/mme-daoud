const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const SOURCE_DIR = 'C:\\Users\\farah\\.gemini\\antigravity\\brain\\a5afeac6-3608-4fe4-84a1-dbbcf0a740ef';
const TARGET_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const XML_FILE = path.join(process.cwd(), 'data', 'xml', 'products.xml');

const MAPPINGS = [
    { pattern: 'baklawa_amande', target: 'baklawa-default.png', keywords: ['baklawa', 'amande'] },
    { pattern: 'kaak_warka', target: 'kaak-default.png', keywords: ['kaak', 'warka', 'srayer'] },
    { pattern: 'mlabbes', target: 'mlabbes-default.png', keywords: ['mlabbes', 'calisson', 'boule', 'cerise'] },
    { pattern: 'fistukia', target: 'pistache-default.png', keywords: ['pistache', 'fistukia', 'pignon', 'bjawia'] }
];

async function main() {
    // 1. Create directory
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
        console.log('Created directory:', TARGET_DIR);
    }

    // 2. Copy images
    const files = await readdir(SOURCE_DIR);

    for (const map of MAPPINGS) {
        const sourceFile = files.find(f => f.startsWith(map.pattern) && f.endsWith('.png'));
        if (sourceFile) {
            await copyFile(
                path.join(SOURCE_DIR, sourceFile),
                path.join(TARGET_DIR, map.target)
            );
            console.log(`Copied ${sourceFile} to ${map.target}`);
        } else {
            console.warn(`Warning: Source file for ${map.pattern} not found`);
        }
    }

    // 3. Update XML
    let xmlContent = await readFile(XML_FILE, 'utf8');

    // Parse simplified approach: replace <images><image>...</image></images>
    // We'll regex replace based on context

    // We need to parse product blocks to check their name/slug
    // Since regex replacement on full file is risky without context, we'll split by <product>

    const parts = xmlContent.split('<product>');
    const header = parts.shift(); // XML header

    const updatedParts = parts.map(part => {
        // Extract name to decide image
        const nameMatch = part.match(/<name>(.*?)<\/name>/);
        const categoryMatch = part.match(/<categorySlug>(.*?)<\/categorySlug>/);

        if (!nameMatch) return part; // Should not happen if valid XML

        const name = nameMatch[1].toLowerCase();
        const cat = categoryMatch ? categoryMatch[1].toLowerCase() : '';
        const searchStr = name + ' ' + cat;

        let selectedImage = 'baklawa-default.png'; // Fallback

        for (const map of MAPPINGS) {
            if (map.keywords.some(k => searchStr.includes(k))) {
                selectedImage = map.target;
                break;
            }
        }

        const newImagePath = `/images/products/${selectedImage}`;

        // Replace existing images tag or insert if missing
        if (part.includes('<images>')) {
            return part.replace(
                /<images>[\s\S]*?<\/images>/,
                `<images><image>${newImagePath}</image></images>`
            );
        } else {
            // Insert before <isNew> or at end
            return part.replace(
                /<isNew>/,
                `<images><image>${newImagePath}</image></images>\n        <isNew>`
            );
        }
    });

    const newXml = header + updatedParts.join('<product>');
    await writeFile(XML_FILE, newXml, 'utf8');
    console.log('Updated products.xml with new image paths');
}

main().catch(console.error);
