import { useInternalNode, MarkerType } from '@xyflow/react';

const getNodeCenter = (node) => ({
    x: node.internals.positionAbsolute.x + (node.measured?.width ?? 80) / 2,
    y: node.internals.positionAbsolute.y + (node.measured?.height ?? 80) / 2,
});

const getCircleIntersection = (cx, cy, radius, tx, ty) => {
    const angle = Math.atan2(ty - cy, tx - cx);
    return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
    };
};

export const ArrowedEdge = ({ id, source, target, style }) => {
    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);

    if (!sourceNode || !targetNode) return null;

    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);
    const radius = (sourceNode.measured?.width ?? 80) / 2;

    const { x: sx, y: sy } = getCircleIntersection(
        sourceCenter.x, sourceCenter.y, radius,
        targetCenter.x, targetCenter.y,
    );
    const { x: tx, y: ty } = getCircleIntersection(
        targetCenter.x, targetCenter.y, radius,
        sourceCenter.x, sourceCenter.y,
    );

    const markerId = `arrow-${id}`;

    return (
        <>
            <defs>
                <marker
                    id={markerId}
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L6,3 z" fill="#555" />
                </marker>
            </defs>
            <path
                d={`M${sx},${sy} L${tx},${ty}`}
                stroke="#555"
                strokeWidth={2}
                fill="none"
                markerEnd={`url(#${markerId})`}
                style={style}
            />
        </>
    );
};