import { Handle, Position } from '@xyflow/react';

// Destructure 'data' from the props React Flow provides
export function CircleNode({ data }) {
    return (
        <div
            style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#4f46e5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                textAlign: 'center',
                fontSize: '12px',
                padding: '5px',
                // Fix for your X-overflow:
                boxSizing: 'border-box',
                overflow: 'hidden',
                wordBreak: 'break-word'
            }}
        >
            <Handle
                position={Position.Right}
                type="source"
                style={{ visibility: "hidden" }}
            />
            <Handle
                position={Position.Bottom}
                type="target"
                style={{ visibility: "hidden" }}
            />

            {/* Display the dynamic label, or a fallback if it's empty */}
            {data?.label || 'No Label'}
        </div>
    );
}