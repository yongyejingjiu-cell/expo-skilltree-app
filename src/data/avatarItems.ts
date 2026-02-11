
export interface AvatarItem {
    id: string;
    type: 'body' | 'hair' | 'clothing' | 'accessory';
    name: string;
    svgPath: string; // Simple path data for now
    color: string;
}

export const AVATAR_ITEMS: Record<string, AvatarItem> = {
    // Body Types
    'type1': { id: 'type1', type: 'body', name: 'Standard', svgPath: 'M20,50 Q50,0 80,50 V100 H20 Z', color: '#f5d0b0' }, // Skin tone
    'type2': { id: 'type2', type: 'body', name: 'Darker', svgPath: 'M20,50 Q50,0 80,50 V100 H20 Z', color: '#8d5524' },

    // Hair
    'hair1': { id: 'hair1', type: 'hair', name: 'Short', svgPath: 'M20,50 C20,20 80,20 80,50', color: '#333' },
    'hair2': { id: 'hair2', type: 'hair', name: 'Long', svgPath: 'M20,50 C20,10 80,10 80,50 V80 H70 V50 H30 V80 H20 Z', color: '#d4af37' },

    // Clothing
    'robe1': { id: 'robe1', type: 'clothing', name: 'Novice Robe', svgPath: 'M20,100 L25,50 Q50,60 75,50 L80,100 Z', color: '#3498db' },
    'robe2': { id: 'robe2', type: 'clothing', name: 'Apprentice Robe', svgPath: 'M20,100 L20,55 Q50,70 80,55 L80,100 Z', color: '#9b59b6' },

    // Accessories
    'staff1': { id: 'staff1', type: 'accessory', name: 'Wooden Staff', svgPath: 'M85,100 L85,20 M80,25 L90,25', color: '#8b4513' },
    'staff2': { id: 'staff2', type: 'accessory', name: 'Gem Staff', svgPath: 'M85,100 L85,20 M85,20 L80,15 M85,20 L90,15', color: '#e74c3c' },
};
