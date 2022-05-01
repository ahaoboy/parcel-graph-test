import { assert, expect, test, describe, it } from "vitest";
import { Graph } from "@parcel/graph";
describe("", () => {
  // Edit an assertion and save to see HMR in action
  it("isOrphanedNode should return true or false if the node is orphaned or not", () => {
    let graph = new Graph();
    let rootNode = graph.addNode("root");
    graph.setRootNodeId(rootNode);

    let nodeA = graph.addNode("a");
    let nodeB = graph.addNode("b");
    let nodeC = graph.addNode("c");
    graph.addEdge(rootNode, nodeB);
    graph.addEdge(nodeB, nodeC, 1);

    assert(graph.isOrphanedNode(nodeA));
    assert(!graph.isOrphanedNode(nodeB));
    assert(!graph.isOrphanedNode(nodeC));
  });

  it("removing a node recursively deletes orphaned nodes if there is no path to the root", () => {
    // before:
    //       a
    //      / \
    //     b   c
    //    / \    \
    // |-d   e    f
    // |/
    // g
    //

    // after:
    //      a
    //       \
    //        c
    //         \
    //          f

    let graph = new Graph();
    let nodeA = graph.addNode("a");
    let nodeB = graph.addNode("b");
    let nodeC = graph.addNode("c");
    let nodeD = graph.addNode("d");
    let nodeE = graph.addNode("e");
    let nodeF = graph.addNode("f");
    let nodeG = graph.addNode("g");
    graph.setRootNodeId(nodeA);

    graph.addEdge(nodeA, nodeB);
    graph.addEdge(nodeA, nodeC);
    graph.addEdge(nodeB, nodeD);
    graph.addEdge(nodeG, nodeD);
    graph.addEdge(nodeB, nodeE);
    graph.addEdge(nodeC, nodeF);
    graph.addEdge(nodeD, nodeG);

    graph.removeNode(nodeB);

    assert.deepEqual([...graph.nodes.keys()], [nodeA, nodeC, nodeF]);
    assert.deepEqual(Array.from(graph.getAllEdges()), [
      { from: nodeA, to: nodeC, type: 1 },
      { from: nodeC, to: nodeF, type: 1 },
    ]);
  });

  it("traverses along edge types if a filter is given", () => {
    let graph = new Graph();
    let nodeA = graph.addNode("a");
    let nodeB = graph.addNode("b");
    let nodeC = graph.addNode("c");
    let nodeD = graph.addNode("d");

    graph.addEdge(nodeA, nodeB, 2);
    graph.addEdge(nodeA, nodeD);
    graph.addEdge(nodeB, nodeC);
    graph.addEdge(nodeB, nodeD, 2);

    graph.setRootNodeId(nodeA);

    let visited = [];
    graph.traverse(
      (nodeId) => {
        visited.push(nodeId);
      },
      null, // use root as startNode
      2
    );

    assert.deepEqual(visited, [nodeA, nodeB, nodeD]);
  });
});
