import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceX,
    forceY,
    forceCollide,
} from 'd3-force';
import { useCallback, useMemo, useRef } from 'react';
import { useReactFlow, useNodesInitialized } from '@xyflow/react';
import FitViewHandler from "./FitViewHandler.jsx";

const simulation = forceSimulation()
    .force('charge', forceManyBody().strength(-300))
    .force('x', forceX().x(0).strength(0.05))
    .force('y', forceY().y(0).strength(0.05))
    .force('collide', forceCollide().radius(50).strength(0.8))
    .alpha(1)
    .alphaDecay(0.08)
    .alphaTarget(0)
    .velocityDecay(0.6)
    .stop();

export const GraphRender = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const initialized = useNodesInitialized();

    const runningRef = useRef(false);
    const draggingNodeRef = useRef(null);

    const dragEvents = useMemo(
        () => ({
            start: (_event, node) => (draggingNodeRef.current = node),
            drag: (_event, node) => (draggingNodeRef.current = node),
            stop: () => (draggingNodeRef.current = null),
        }),
        [],
    );

    const start = useCallback(() => {
        if (runningRef.current) return;
        runningRef.current = true;

        const nodes = getNodes().map((node) => ({
            ...node,
            x: node.position.x,
            y: node.position.y,
        }));

        const edges = getEdges().map((edge) => edge);

        simulation.nodes(nodes).force(
            'link',
            forceLink(edges)
                .id((d) => d.id)
                .strength(0.05)
                .distance(100),
        );

        simulation.alpha(1);

        const tick = () => {
            if (!runningRef.current) return;

            getNodes().forEach((node, i) => {
                const dragging = draggingNodeRef.current?.id === node.id;

                if (dragging) {
                    nodes[i].fx = draggingNodeRef.current.position.x;
                    nodes[i].fy = draggingNodeRef.current.position.y;
                } else {
                    delete nodes[i].fx;
                    delete nodes[i].fy;
                }
            });

            simulation.tick();

            setNodes(
                nodes.map((node) => ({
                    ...node,
                    position: { x: node.fx ?? node.x, y: node.fy ?? node.y },
                })),
            );

            if (simulation.alpha() > simulation.alphaMin()) {
                window.requestAnimationFrame(tick);
                console.log(simulation.alpha());
            } else {
                runningRef.current = false;
                fitView({
                    padding: 0.2,
                    duration: 800,
                    maxZoom: 0.8,
                });
            }


        };
        window.requestAnimationFrame(tick);
    }, [getNodes, getEdges, setNodes, fitView]);

    const stop = useCallback(() => {
        runningRef.current = false;
        simulation.stop();
    }, []);

    const restart = useCallback(() => {
        runningRef.current = false;  // force stop the current loop
        setTimeout(() => start(), 0); // start fresh on next tick
    }, [start]);

    return useMemo(() => {
        if (!initialized) return [false, {}, dragEvents, start, stop, restart];

        return [
            true,
            {
                toggle: () => {
                    if (runningRef.current) {
                        stop();
                    } else {
                        start();
                    }
                },
                isRunning: () => runningRef.current,
            },
            dragEvents,
            start,
            stop,
            restart,
        ];
    }, [initialized, dragEvents, start, stop, restart]);
};