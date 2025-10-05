import { readFile } from 'fs/promises';
import postcss from 'postcss';
import { parse } from 'parse5';

export async function analyzeCssContent(cssText: string): Promise<string[]> {
    const features = new Set<string>();

    if (cssText.includes('@nest') || cssText.includes('&')) {
        features.add('css.selectors.nesting');
    }

    const root = await postcss().process(cssText, { from: undefined }).then(r => r.root);

    root.walk(node => {
        if (node.type === 'decl') {
            const prop = node.prop.toLowerCase();
            features.add(`css.properties.${prop}`);

            const words = node.value.toLowerCase().match(/[a-z0-9_-]+/g) || [];
            for (const w of words) {
                features.add(`css.properties.${prop}.${w}`);
            }

            const fnMatch = node.value.match(/([a-z0-9_-]+)\s*\(/gi);
            if (fnMatch) {
                for (const fn of fnMatch) {
                    const fnName = fn.slice(0, fn.indexOf('(')).toLowerCase();
                    features.add(`css.types.${fnName}`);
                }
            }
        }

        if (node.type === 'rule') {
            const selector = node.selector.toLowerCase();

            const pseudoMatches = selector.match(/::?[a-z0-9-]+/g);
            if (pseudoMatches) {
                for (const pm of pseudoMatches) {
                    const cleanName = pm.replace(/^:+/, '');
                    features.add(`css.selectors.${cleanName}`);
                }
            }

            if (selector.includes('nth-child') && selector.includes('of')) {
                features.add('css.selectors.nth-child.of_syntax');
            }

            const attrMatches = selector.match(/\[([a-z0-9-]+)(=[^\]]+)?\]/g);
            if (attrMatches) {
                for (const attr of attrMatches) {
                    const clean = attr.replace(/\[|\]|"/g, '');
                    features.add(`css.selectors.${clean.replace('=', '.')}`);
                }
            }
        }

        if (node.type === 'atrule') {
            const atName = node.name.toLowerCase();
            features.add(`css.at-rules.${atName}`);

            if (node.params) {
                const paramMatches = node.params.match(/([a-z-]+)\s*:\s*([a-z0-9-]+)/g);
                if (paramMatches) {
                    for (const pair of paramMatches) {
                        const [key, val] = pair.split(':').map(s => s.trim());
                        features.add(`css.at-rules.${atName}.${key}`);
                        features.add(`css.at-rules.${atName}.${key}.${val}`);
                    }
                }
            }

            if (node.nodes) {
                for (const child of node.nodes) {
                    if (child.type === 'decl') {
                        const prop = child.prop.toLowerCase();
                        features.add(`css.properties.${prop}`);

                        const words = child.value.toLowerCase().match(/[a-z0-9_-]+/g) || [];
                        for (const w of words) {
                            features.add(`css.properties.${prop}.${w}`);
                        }

                        const fnMatch = child.value.match(/([a-z0-9_-]+)\s*\(/gi);
                        if (fnMatch) {
                            for (const fn of fnMatch) {
                                const fnName = fn.slice(0, fn.indexOf('(')).toLowerCase();
                                features.add(`css.types.${fnName}`);
                            }
                        }
                    }
                }
            }
        }
    });

    return [...features];
}

export async function analyzeCssFile(filePath: string): Promise<string[]> {
    const cssText = await readFile(filePath, 'utf-8');
    return analyzeCssContent(cssText);
}

export async function analyzeEmbeddedCss(htmlText: string): Promise<string[]> {
    const features = new Set<string>();
    const ast = parse(htmlText) as any;

    function walk(node: any) {
        if (!node) return;

        if (node.tagName === 'style' && node.childNodes) {
            for (const child of node.childNodes) {
                if (child.nodeName === '#text') {
                    analyzeCssContent(child.value).then(f => f.forEach(feat => features.add(feat)));
                }
            }
        }

        if (node.attrs) {
            for (const attr of node.attrs) {
                if (attr.name === 'style' && attr.value) {
                    analyzeCssContent(attr.value).then(f => f.forEach(feat => features.add(feat)));
                }
            }
        }

        if (node.childNodes) {
            for (const child of node.childNodes) walk(child);
        }
    }

    walk(ast);

    await new Promise(r => setTimeout(r, 10));

    return [...features];
}
