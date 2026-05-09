import { useEffect } from 'react';
import { useReactFlow, useNodesInitialized } from '@xyflow/react';

export default function FitViewHandler() {
    const { fitView } = useReactFlow();
    const nodesInitialized = useNodesInitialized();

    useEffect(() => {
        if (nodesInitialized) {
            // The nodes are now rendered and measured in the DOM
            fitView({
                padding: 0.2,
                duration: 800,
                maxZoom: 0.8,
            });
        }
    }, [nodesInitialized, fitView]);

    return null; // This component renders no UI, it only handles logic
}