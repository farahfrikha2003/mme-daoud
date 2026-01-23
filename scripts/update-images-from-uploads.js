const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');
const XML_FILE = path.join(process.cwd(), 'data', 'xml', 'products.xml');

async function main() {
    // 1. Get all available images in uploads
    const files = fs.readdirSync(UPLOADS_DIR);
    console.log(`Found ${files.length} images in uploads.`);

    // 2. Read XML
    let xmlContent = fs.readFileSync(XML_FILE, 'utf8');

    // 3. Process products
    const parts = xmlContent.split('<product>');
    const header = parts.shift();

    const updatedParts = parts.map(part => {
        const slugMatch = part.match(/<slug>(.*?)<\/slug>/);
        if (!slugMatch) return part;

        const slug = slugMatch[1];

        // Try to find a matching image
        // 1. Exact slug match (slug.jpg or slug.png)
        // 2. Starts with timestamp-slug.jpg/png
        let matchingImage = files.find(f => f === `${slug}.jpg` || f === `${slug}.png`);

        if (!matchingImage) {
            matchingImage = files.find(f => f.includes(`-${slug}.jpg`) || f.includes(`-${slug}.png`));
        }

        // Special case for some names if slug doesn't match perfectly
        if (!matchingImage) {
            const nameMatch = part.match(/<name>(.*?)<\/name>/);
            if (nameMatch) {
                const name = nameMatch[1].toLowerCase().replace(/\s+/g, '-');
                matchingImage = files.find(f => f.includes(name));
            }
        }

        if (matchingImage) {
            const newPath = `/uploads/products/${matchingImage}`;
            console.log(`Mapping ${slug} to ${newPath}`);
            return part.replace(
                /<images>[\s\S]*?<\/images>/,
                `<images><image>${newPath}</image></images>`
            );
        }

        return part;
    });

    const newXml = header + updatedParts.join('<product>');
    fs.writeFileSync(XML_FILE, newXml, 'utf8');
    console.log('Successfully updated products.xml with actual uploaded images.');
}

main().catch(console.error);
