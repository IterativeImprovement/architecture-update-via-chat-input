import React, {useEffect, useRef, useState} from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Panel,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './constants/starting-nodes-and-edges.js';
import { CircleNode } from './utils/CircleNode.jsx';
import { GraphRender } from './components/GraphRender.js';
import '@xyflow/react/dist/style.css';
import {GraphCommandInput} from "./components/GraphCommandInput.jsx";
import FitViewHandler from "./components/FitViewHandler.jsx";
import {ArrowedEdge} from "./utils/ArrowedEdge.jsx";
import {CommandLog} from "./components/CommandLog.jsx";
import {Sidebar} from "./components/Sidebar.jsx";

const nodeTypes = {
    circle: CircleNode,
};

const edgeTypes = {
    arrow: ArrowedEdge,
};



const LayoutFlow = ({ nodes, edges, onNodesChange, onEdgesChange, restartRef }) => {
    const [initialized, { toggle, isRunning }, dragEvents, start, stop, restart] =
        GraphRender();

    useEffect(() => {
        restartRef.current = restart;
    }, [restart, restartRef]);

    return (

        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeDragStart={dragEvents.start}
            onNodeDrag={dragEvents.drag}
            onNodeDragStop={dragEvents.stop}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
        >
            <Background />
            <Controls />
            <Panel>
                <button onClick={toggle}>
                    Update Node Positions
                </button>
            </Panel>
        </ReactFlow>
    );
};

export default function App() {
    const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges , onEdgesChange] = useEdgesState(initialEdges);
    const [log, setLog] = useState([]);
    const restartRef = useRef(null);

    return (
        <div>
            <div style={{
                display: 'flex',      // 1. Activate Flexbox
                width: '100%',        // Full width of the parent
                height: '92vh',       // Matches your current height
                overflow: 'hidden'    // Prevents accidental scrolling
            }}>
                {/* Left Side: React Flow (75%) */}
                <div style={{
                    flex: '0 0 75%',   // 2. Take up exactly 75%
                    height: '100%',
                    position: 'relative'
                }}>
                    <ReactFlowProvider>
                        <LayoutFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            restartRef={restartRef}
                        />
                        <FitViewHandler />
                    </ReactFlowProvider>
                </div>

                {/* Right Side: Chat history panel */}
                <div style={{
                    flex: '0 0 25%',
                    height: '100%',
                    backgroundColor: '#202438',
                    borderLeft: '1px solid #1a1a1a',
                    padding: '24px',
                    boxSizing: 'border-box',
                    overflowY: 'auto', // This is the scrollable container

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    color: '#ffffff'
                }}>
                    <Sidebar
                        log={log}
                    />
                </div>
            </div>
            <div style={{
                height: '8vh'
            }}>
                <GraphCommandInput
                    nodes = {nodes}
                    edges = {edges}
                    setNodes = {setNodes}
                    setEdges = {setEdges}
                    onAction = {() => restartRef.current?.()}
                    onLog={(entry) => setLog((prev) => [...prev, entry])}
                />
            </div>
        </div>
 );
}