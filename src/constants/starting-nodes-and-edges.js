export const initialNodes = [
    {
        id: '1',
        type: 'circle',
        data: { label: '1' },
        position: { x: 0, y: 0 },
    },
    {
        id: '2',
        type: 'circle',
        data: { label: '2' },
        position: { x: 0, y: 100 },
    },

];

export const initialEdges = [
    {
        id: 'e12',
        type: 'arrow',
        source: '1',
        target: '2',
        animated: false
    },
];
