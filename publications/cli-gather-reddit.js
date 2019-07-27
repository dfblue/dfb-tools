require('es6-promise').polyfill();
require('isomorphic-fetch');
const clipboardy = require('clipboardy');

console.log('gathering from reddit');

const main = async () => {
    const response = await fetch('https://www.reddit.com/r/sfwdeepfakes/new.json?sort=new&limit=1000')
    if (response.status >= 400) {
        throw new Error("Bad response from server");
    }
    const rawPosts = (await response.json()).data.children.filter(p => String(p.data.title).includes('deepfake'));
    const posts = rawPosts.map((p) => {
        let preview;
        if (p.data.preview && p.data.preview.images[0]) {
            preview = p.data.preview.images[0].source.url;
        }
        return {
            title: p.data.title,
            author: p.data.author,
            // preview,
        }
    });

    const html = `
        <table>
            <tr>
                ${Object.keys(posts[0]).map(k => `<th>${k}</th>`)}
            </tr>
            ${posts.map(p => `<tr>${Object.values(p).map(v => `<td>${v}</td>`)}</tr>`)}
        </table>
    `

    const tsv = `
        ${Object.keys(posts[0]).join('\t')}
        ${posts.map(p => `${Object.values(p).join('\t')}\n`)}
    `

    clipboardy.writeSync(tsv);
    console.log('Results copied to clipboard!');
}

try {
    main();
} catch (err) {
    console.error(err.message);
}