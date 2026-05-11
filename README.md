# Architecture Update via Chat Input

**Author:** CSY (Github: IterativeImprovement)  
**Date:** May 2026

This application is a take-home assignment for CyberSG.

---

## Running the Application

This project is built with [Vite](https://vitejs.dev/) and [React](https://react.dev/).

To run the project:
1. Download and unzip the project folder.
2. Navigate to the root directory of the project in terminal.
3. Run `npm install` to install project dependencies.
4. Run `npm run dev` to launch the project locally.
3. Access the application at `http://localhost:5173/` (default port for Vite applications), or at the port given in the terminal.


> Ensure [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are installed before running.
 
>Windows may block local scripts from running. If so, you would need to update your [PowerShell Execution Policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.6) to allow them.

---

## Supported Inputs

All inputs are **case-insensitive**. The parser supports both space and comma delimiters.

| Action | Supported inputs                                                                                                                                                                    |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Adding a named node | `addnode nodeName`<br/>`add node nodeName`<br/>`addnode,nodeName`<br/>`add node,nodeName`                                                                                           |
| Adding an edge from sourceNode to destNode | `addedge sourceNode destNode`<br/>`add edge sourceNode destNode`<br/>`addedge,sourceNode,destNode`<br/>`add edge,sourceNode,destNode`                                               |
| Deleting a named node (and its connected edges) | `deletenode nodeName`<br/>`delete node nodeName`<br/>`delnode nodeName`<br/>`deletenode,nodeName`<br/>`delete node,nodeName`                                                        |
| Deleting an edge from sourceNode to destNode | `deleteedge sourceNode destNode`<br/>`delete edge sourceNode destNode`<br/>`deledge sourceNode destNode`<br/>`deleteedge,sourceNode,destNode`<br/>`delete edge,sourceNode,destNode` |
---

## Key Design Decisions & Assumptions

[React Flow](https://reactflow.dev/) was used alongside [D3.js](https://d3js.org/) for smooth node rendering and animation. D3.js was selected for its compatibility with React Flow and its support for non-rooted graphs.

**Modification of React Flow Components**

1. Handles were hidden to prevent users from modifying node connections without text input.
2. Edges now include arrowheads to indicate direction (source → destination).
3. Nodes were redesigned as circles (replacing React Flow's default rectangles) to simplify collision calculations and arrowhead rendering.

**UI / UX Considerations**

1. The chat history scrollbar is locked to the latest log.
2. CSS Flexbox is used for responsive layout across screen sizes.
3. The view re-fits automatically to accommodate new node arrangements.
4. Adding a node or edge triggers a rearrangement of the graph.
5. Input handling has been expanded for ease of use.

**Assumptions**

1. Node names are short and concise.
2. The application is not accessed from a mobile device, as it is not optimised for small screens.

## Future Improvements

**Adding a Simulation**

The application is well-positioned to support simulation, leveraging existing functions to add or remove nodes and edges. Additional work would be required to cache edges deleted alongside their connecting nodes, enabling safe forward and backward stepping through the simulation.
