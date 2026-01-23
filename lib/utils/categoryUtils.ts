export interface Category {
    id: string;
    slug: string;
    name: string;
    order: number;
    parentId?: string;
    children?: Category[];
}

export interface FlattenedCategory extends Category {
    level: number;
    prefix: string; // e.g. "-- "
    displayName: string; // e.g. "-- Subcategory"
}

export function buildCategoryTree(categories: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    // First pass: create nodes and map
    categories.forEach(cat => {
        // Ensure we don't mutate original objects if re-used
        map.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: link parents
    categories.forEach(cat => {
        const node = map.get(cat.id)!;
        if (cat.parentId && map.has(cat.parentId)) {
            map.get(cat.parentId)!.children!.push(node);
        } else {
            roots.push(node);
        }
    });

    // Sort by order at each level
    const sortNodes = (nodes: Category[]) => {
        nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                sortNodes(node.children);
            }
        });
    };

    sortNodes(roots);
    return roots;
}

export function flattenCategoryTree(categories: Category[]): FlattenedCategory[] {
    const tree = buildCategoryTree(categories);
    const flattened: FlattenedCategory[] = [];

    const traverse = (nodes: Category[], level: number) => {
        nodes.forEach(node => {
            const prefix = level > 0 ? '\u00A0\u00A0'.repeat(level) + '└─ ' : ''; // using non-breaking spaces for indent
            flattened.push({
                ...node,
                level,
                prefix,
                displayName: prefix + node.name
            });
            if (node.children) {
                traverse(node.children, level + 1);
            }
        });
    };

    traverse(tree, 0);
    return flattened;
}
