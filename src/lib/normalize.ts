export function normalizeFeature(prefix: string, feature: string): string {
    if (prefix == 'html.')
        return normalizeHtmlFeatures(feature);
    else if (prefix == 'css.')
        return normalizeCssFeatures(feature);
    else if (prefix == 'js.')
        return normalizeJsFeatures(feature);

    return feature ? feature.toLowerCase() : '';
}

function normalizeHtmlFeatures(feature: string): string {
    return feature
        // 1. input.type_color → input.type.color
        .replace(/^html\.elements\.input\.type_([a-z0-9-]+)/, 'html.elements.input.type.$1')

        // 2. alternate_stylesheet → alternate stylesheet
        .replace(/\.rel\.alternate_stylesheet$/, '.rel.alternate stylesheet')

        // 3. a.text_fragments → a.text
        .replace(/^html\.elements\.a\.text_fragments$/, 'html.elements.a.text')

        .toLowerCase();
}

function normalizeCssFeatures(feature: string): string {
    return feature.toLowerCase();
}

function normalizeJsFeatures(feature: string): string {
    return feature.toLowerCase();
}