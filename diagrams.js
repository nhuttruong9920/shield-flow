document.addEventListener("DOMContentLoaded", () => {
  renderAssetLifecycleDiagram();
});

function renderAssetLifecycleDiagram() {
  const el = document.getElementById("assetLifecycleDiagram");
  if (!el) return;

  if (!window.joint) {
    el.innerHTML =
      '<div class="p-4 text-sm text-slate-600 dark:text-slate-300">JointJS could not be loaded.</div>';
    return;
  }

  el.innerHTML = "";

  const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
  const paper = new joint.dia.Paper({
    el,
    model: graph,
    width: 1080,
    height: 300,
    gridSize: 1,
    interactive: false,
    async: true,
    frozen: false,
    background: { color: "transparent" },
    cellViewNamespace: joint.shapes
  });

  const nodes = [
    createNode(30, 72, "Root\ninventory", "/devices/free"),
    createNode(245, 72, "Company\nstock", "swap-single"),
    createNode(460, 72, "Free in\ncompany", "free device + vehicle"),
    createNode(675, 72, "Subscription\nbound", "device + vehicle"),
    createNode(890, 72, "Active\nunit", "activeDate")
  ];

  nodes.forEach((node) => node.addTo(graph));

  connect(nodes[0], nodes[1], "transfer").addTo(graph);
  connect(nodes[1], nodes[2], "available").addTo(graph);
  connect(nodes[2], nodes[3], "assign").addTo(graph);
  connect(nodes[3], nodes[4], "activate").addTo(graph);
  connect(nodes[3], nodes[2], "unassign", true, [
    { x: 760, y: 235 },
    { x: 540, y: 235 }
  ]).addTo(graph);
  connect(nodes[1], nodes[0], "return", true, [
    { x: 320, y: 40 },
    { x: 100, y: 40 }
  ]).addTo(graph);

  paper.unfreeze();
}

function createNode(x, y, title, subtitle) {
  const rect = new joint.shapes.standard.Rectangle();
  rect.position(x, y);
  rect.resize(165, 108);
  rect.attr({
    body: {
      fill: "#ffffff",
      stroke: "#d7dee8",
      strokeWidth: 1.5,
      rx: 8,
      ry: 8,
      filter: {
        name: "dropShadow",
        args: {
          dx: 0,
          dy: 8,
          blur: 12,
          color: "rgba(15, 23, 42, 0.12)"
        }
      }
    },
    label: {
      text: `${title}\n${subtitle}`,
      fill: "#0f172a",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 13,
      lineHeight: 18,
      fontWeight: 600,
      textVerticalAnchor: "middle",
      textAnchor: "middle"
    }
  });
  return rect;
}

function connect(source, target, label, dashed = false, vertices = []) {
  const link = new joint.shapes.standard.Link();
  link.source(source);
  link.target(target);
  if (vertices.length) link.vertices(vertices);
  link.attr({
    line: {
      stroke: dashed ? "#94a3b8" : "#0ea5a4",
      strokeWidth: dashed ? 1.75 : 2.25,
      strokeDasharray: dashed ? "6 4" : "0",
      targetMarker: {
        type: "path",
        d: "M 10 -5 0 0 10 5 z",
        fill: dashed ? "#94a3b8" : "#0ea5a4",
        stroke: "none"
      }
    }
  });
  link.labels([
    {
      position: 0.5,
      attrs: {
        rect: {
          fill: "#f8fafc",
          stroke: "#d7dee8",
          rx: 4,
          ry: 4
        },
        text: {
          text: label,
          fill: "#475569",
          fontSize: 11,
          fontFamily: "Inter, Arial, sans-serif"
        }
      }
    }
  ]);
  return link;
}
