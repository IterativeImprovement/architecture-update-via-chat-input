import React, { useState } from 'react';

/**
 * Parses a command string and returns a structured action object.
 * Supported formats:
 *   addnode,nodename
 *   deletenode,nodename
 *   addedge,sourcenode,destnode
 *   deleteedge,sourcenode,destnode
 */
const parseCommand = (input) => {
    const trimmed = input.trim();
    const spaceParts = trimmed.split(/\s+/);   // preserve original casing for args
    const parts = trimmed.split(',').map((s) => s.trim());

    const hasComma = trimmed.includes(',');

    const oneWordCmd = spaceParts[0].toLowerCase();
    const twoWordCmd = spaceParts.slice(0, 2).join('').toLowerCase();

    const twoWordCmds = ['addnode', 'deletenode', 'delnode', 'addedge', 'deleteedge', 'deledge'];

    let cmd, resolvedArgs;

    if (hasComma) {
        cmd = parts[0].replace(/\s+/g, '').toLowerCase();
        resolvedArgs = parts.slice(1);  // original casing preserved
    } else if (twoWordCmds.includes(twoWordCmd)) {
        cmd = twoWordCmd;
        resolvedArgs = spaceParts.slice(2);  // original casing preserved
    } else {
        cmd = oneWordCmd;
        resolvedArgs = spaceParts.slice(1);  // original casing preserved
    }

    switch (cmd) {
        case 'addnode':
            if (!resolvedArgs[0]) return { error: 'Usage: addnode,nodename' };
            return { action: 'addnode', nodeName: resolvedArgs[0] };

        case 'deletenode':
        case 'delnode':
            if (!resolvedArgs[0]) return { error: 'Usage: deletenode,nodename' };
            return { action: 'deletenode', nodeName: resolvedArgs[0] };

        case 'addedge':
            if (!resolvedArgs[0] || !resolvedArgs[1])
                return { error: 'Usage: addedge,sourcenode,destnode' };
            return { action: 'addedge', source: resolvedArgs[0], target: resolvedArgs[1] };

        case 'deleteedge':
        case 'deledge':
            if (!resolvedArgs[0] || !resolvedArgs[1])
                return { error: 'Usage: deleteedge,sourcenode,destnode' };
            return { action: 'deleteedge', source: resolvedArgs[0], target: resolvedArgs[1] };

        default:
            return {
                error: `Unknown command "${cmd}". Valid commands: addnode, deletenode, addedge, deleteedge`,
            };
    }
};
/**
 * Applies a parsed action to the current nodes/edges state.
 * Returns { nodes, edges, message } or { error }.
 */
const applyAction = (parsed, nodes, edges) => {
    if (parsed.error) return { error: parsed.error };

    switch (parsed.action) {
        case 'addnode': {
            const exists = nodes.some((n) => n.id === parsed.nodeName);
            if (exists) return { error: `Node "${parsed.nodeName}" already exists` };

            const newNode = {
                id: parsed.nodeName,
                type: 'circle',
                data: { label: parsed.nodeName },
                position: { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 },
            };
            return {
                nodes: [...nodes, newNode],
                edges,
                message: `Added node "${parsed.nodeName}"`,
            };
        }

        case 'deletenode': {
            const exists = nodes.some((n) => n.id === parsed.nodeName);
            if (!exists) return { error: `Node "${parsed.nodeName}" not found` };

            return {
                nodes: nodes.filter((n) => n.id !== parsed.nodeName),
                // also remove any edges connected to this node
                edges: edges.filter(
                    (e) => e.source !== parsed.nodeName && e.target !== parsed.nodeName,
                ),
                message: `Deleted node "${parsed.nodeName}"`,
            };
        }

        case 'addedge': {
            const sourceExists = nodes.some((n) => n.id === parsed.source);
            const targetExists = nodes.some((n) => n.id === parsed.target);
            if (!sourceExists) return { error: `Source node "${parsed.source}" not found` };
            if (!targetExists) return { error: `Target node "${parsed.target}" not found` };

            const edgeId = `${parsed.source}->${parsed.target}`;
            const edgeExists = edges.some((e) => e.id === edgeId);
            if (edgeExists)
                return { error: `Edge "${parsed.source} → ${parsed.target}" already exists` };

            const newEdge = {
                id: edgeId,
                type: 'arrow',
                source: parsed.source,
                target: parsed.target,
            };
            return {
                nodes,
                edges: [...edges, newEdge],
                message: `Added edge "${parsed.source} → ${parsed.target}"`,
            };
        }

        case 'deleteedge': {
            const edgeId = `${parsed.source}->${parsed.target}`;
            const edgeExists = edges.some((e) => e.id === edgeId);
            if (!edgeExists)
                return { error: `Edge "${parsed.source} → ${parsed.target}" not found` };

            return {
                nodes,
                edges: edges.filter((e) => e.id !== edgeId),
                message: `Deleted edge "${parsed.source} → ${parsed.target}"`,
            };
        }

        default:
            return { error: 'Unknown action' };
    }
};

/**
 * GraphCommandInput
 *
 * Props:
 *   nodes       - current ReactFlow nodes array
 *   edges       - current ReactFlow edges array
 *   onNodesChange - setter/updater for nodes (e.g. from useNodesState)
 *   onEdgesChange - setter/updater for edges (e.g. from useEdgesState)
 */

export const GraphCommandInput = ({ nodes, edges, setNodes, setEdges, onAction, onLog }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const parsed = parseCommand(input);
        const result = applyAction(parsed, nodes, edges);

        if (result.error) {
            onLog?.({ input, type: 'error', message: result.error, id: Date.now() });
        } else {
            setNodes(result.nodes);
            setEdges(result.edges);
            onLog?.({ input, type: 'success', message: result.message, id: Date.now() });
            onAction?.();
        }

        setInput('');
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    style={styles.input}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. addnode,A  or  addedge,A,B"
                    spellCheck={false}
                />
                <button type="submit" style={styles.button}>
                    Submit
                </button>
            </form>

        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
    },
    form: {
        display: 'flex',
        gap: 4,
    },
    input: {
        flex: 1,
        minWidth: 0,
        padding: '6px 10px',
        fontFamily: 'monospace',
        fontSize: 13,
        border: '1px solid #ccc',
        borderRadius: 6,
        outline: 'none',
    },
    button: {
        padding: '6px 14px',
        background: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 13,
    },
    success: {
        margin: 0,
        fontSize: 12,
        color: '#16a34a',
        fontFamily: 'monospace',
    },
    error: {
        margin: 0,
        fontSize: 12,
        color: '#dc2626',
        fontFamily: 'monospace',
    },

};