const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data/xml/products.xml');
let content = fs.readFileSync(filePath, 'utf-8');

// Update pignon-et-pistache to pistache
content = content.replace(/<category>Pignon &amp; Pistache<\/category>/g, '<category>Pistache</category>');
content = content.replace(/<categorySlug>pignon-et-pistache<\/categorySlug>/g, '<categorySlug>pistache</categorySlug>');

// Update chocolat to chocolats
content = content.replace(/<category>Chocolat<\/category>/g, '<category>Chocolats</category>');
content = content.replace(/<categorySlug>chocolat<\/categorySlug>/g, '<categorySlug>chocolats</categorySlug>');

// Update mignardises to gamme-mignardises
content = content.replace(/<category>Mignardises<\/category>/g, '<category>Gamme Mignardises</category>');
content = content.replace(/<categorySlug>mignardises<\/categorySlug>/g, '<categorySlug>gamme-mignardises</categorySlug>');

// Update mlabbes-et-calisson individually based on name
const productRegex = /<product>([\s\S]*?)<\/product>/g;
content = content.replace(productRegex, (match) => {
    if (match.includes('<categorySlug>mlabbes-et-calisson</categorySlug>')) {
        const nameMatch = match.match(/<name>(.*?)<\/name>/);
        const name = nameMatch ? nameMatch[1].toLowerCase() : '';

        if (name.includes('calisson')) {
            return match.replace(/<category>Mlabbes &amp; Calisson<\/category>/g, '<category>Calisson</category>')
                .replace(/<categorySlug>mlabbes-et-calisson<\/categorySlug>/g, '<categorySlug>calisson</categorySlug>');
        } else {
            return match.replace(/<category>Mlabbes &amp; Calisson<\/category>/g, '<category>Mlabbes</category>')
                .replace(/<categorySlug>mlabbes-et-calisson<\/categorySlug>/g, '<categorySlug>mlabbes</categorySlug>');
        }
    }
    return match;
});

// Update Traiteur salés name
content = content.replace(/<category>GAMME SALÉ<\/category>/g, '<category>Traiteur salés</category>');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Products XML updated successfully');
