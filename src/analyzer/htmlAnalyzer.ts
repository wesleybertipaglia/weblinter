import { readFile } from 'fs/promises';
import { parse } from 'parse5';
import { analyzeEmbeddedCss } from '@/analyzer/cssAnalyzer';

export async function analyzeHtmlFile(filePath: string): Promise<string[]> {
    const content = await readFile(filePath, 'utf-8');
    const ast = parse(content) as any;
    const features = new Set<string>();

    function walk(node: any) {
        if (node.tagName) {
            const tagName = node.tagName.toLowerCase();
            features.add(`html.elements.${tagName}`);

            if (node.attrs) {
                for (const attr of node.attrs) {
                    const attrName = attr.name.toLowerCase();
                    const attrValue = attr.value?.toLowerCase();

                    features.add(`html.elements.${tagName}.${attrName}`);

                    if (attrValue) {
                        features.add(`html.elements.${tagName}.${attrName}.${attrValue}`);
                    }

                    if (globalAttributes.includes(attrName)) {
                        features.add(`html.global_attributes.${attrName}`);
                        if (attrValue) {
                            features.add(`html.global_attributes.${attrName}.${attrValue}`);
                        }
                    }
                }
            }
        }

        if (node.childNodes) {
            for (const child of node.childNodes) {
                walk(child);
            }
        }
    }

    walk(ast);

    const cssFeatures = await analyzeEmbeddedCss(content);
    cssFeatures.forEach(f => features.add(f));

    return [...features];
}

const globalAttributes = [
    'contenteditable',
    'inert',
    'autocorrect',
    'popover',
    'hidden',
    'virtualkeyboardpolicy',
    'autocapitalize',
    'is',
    'writingsuggestions'
];