// Possible improvements:
// Mapping from uuid (svgID) to object-reference

// Mapping of classes to svg-ids

// Creation of update function to reposition by using the navigate method of Oxels

// Using shapes other than circles

import { v4 as uuid } from "uuid";

export class ElementMap extends Map {
  constructor() {
    super();
  }

  // Associate a new SVG element with a specific object
  newElement(svgElement, associatedObject) {
    const id = "#" + uuid();
    svgElement.attr("id", id);
    this.set(id, associatedObject);
    return id;
  }
}

const sampleImage =
  "https://t4.ftcdn.net/jpg/02/39/83/05/360_F_239830562_damRJ9qNH5gJzwenJCtyPWEuGQvDfpH9.jpg";

const sampleData1 = {
  id: 1,
  uuid: "n001",
  type: "type1",
  text: "1",
  image: sampleImage,
  points: 1,
  children: [
    {
      id: 2,
      uuid: "n002",
      type: "type1",
      text: "2",
      points: 2,
      link: {
        id: 1,
        uuid: "l001",
        direction: "outgoing",
        text: "Link 1",
        points: 3,
      },
    },
    {
      id: 3,
      uuid: "n003",
      type: "type1",
      text: "3",
      points: 1,
      link: {
        id: 2,
        uuid: "l002",
        direction: "outgoing",
        text: "Link 2",
        points: 2,
      },
    },
    {
      id: 4,
      uuid: "n004",
      type: "type1",
      text: "4",
      points: 1,
      link: {
        id: 3,
        uuid: "l003",
        direction: "outgoing",
        text: "Link 3",
        points: 1,
      },
      children: [
        {
          id: 5,
          uuid: "n005",
          type: "type2",
          text: "5",
          points: 3,
          link: {
            id: 4,
            uuid: "l004",
            direction: "outgoing",
            text: "Link 4",
            points: 3,
          },
        },
        {
          id: 6,
          uuid: "n006",
          type: "type3",
          text: "6",
          points: 2,
          link: {
            id: 5,
            uuid: "l005",
            direction: "outgoing",
            text: "Link 5",
            points: 2,
          },
        },
        {
          id: 7,
          uuid: "n007",
          type: "type4",
          text: "7",
          points: 1,
          link: {
            id: 6,
            uuid: "l006",
            direction: "outgoing",
            text: "Link 6",
            points: 1,
          },
        },
      ],
    },
  ],
};

const sampleData2 = {
  id: 4,
  uuid: "n004",
  type: "type1",
  text: "4",
  points: 1,
  children: [
    {
      id: 1,
      uuid: "n001",
      type: "type1",
      text: "1",
      image: sampleImage,
      points: 1,
      link: {
        id: 3,
        uuid: "l003",
        direction: "incoming",
        text: "Link 3",
        points: 1,
      },
      children: [
        {
          id: 2,
          uuid: "n002",
          type: "type1",
          text: "2",
          points: 2,
          link: {
            id: 1,
            uuid: "l001",
            direction: "outgoing",
            text: "Link 1",
            points: 3,
          },
        },
        {
          id: 3,
          uuid: "n003",
          type: "type1",
          text: "3",
          points: 1,
          link: {
            id: 2,
            uuid: "l002",
            direction: "outgoing",
            text: "Link 2",
            points: 2,
          },
        },
      ],
    },
    {
      id: 5,
      uuid: "n005",
      type: "type2",
      text: "5",
      points: 3,
      link: {
        id: 4,
        uuid: "l004",
        direction: "outgoing",
        text: "Link 4",
        points: 3,
      },
    },
    {
      id: 6,
      uuid: "n006",
      type: "type3",
      text: "6",
      points: 2,
      link: {
        id: 5,
        uuid: "l005",
        direction: "outgoing",
        text: "Link 5",
        points: 2,
      },
    },
    {
      id: 7,
      uuid: "n007",
      type: "type4",
      text: "7",
      points: 1,
      link: {
        id: 6,
        uuid: "l006",
        direction: "outgoing",
        text: "Link 6",
        points: 1,
      },
    },
  ],
};

const curvedLinks = false;
const canvasSize = 800;
const duration = 1000;
const sizeLinksBy = "points";
const sizeNodesBy = "points";
const minLinkWidth = 1;
const maxLinkWidth = 6;
const minArrowSize = 8;
const maxArrowSize = 20;
const minNodeRadius = 10;
const maxNodeRadius = 22;
const zoom = d3.zoom().on("zoom", (event) => onZoom(event));
const colors = {
  link: {
    outgoing: "#90a8ff", // light blue
    incoming: "#ffaaaa", // light red
    outgoingHighlighted: "#4169f9", // dark blue
    incomingHighlighted: "#f84d4d", // dark red
  },
  node: {
    type1: "#44b1f7", // blue
    type2: "#ff4848", // red
    type3: "#5edd80", // green
    type4: "#a65cda", // purple
    highlight1: "#bcd8f8",
    highlight2: "aqua",
  },
};

let data = {};
let links = [];
let nodes = [];
let transitioning = true;
let selectedLinkUUID = "";
let linkWidthScale;
let linkArrowScale;
let linkArrowOffsetScale;
let nodeScale;
let updated = false;

function sampleUpdate() {
  // sample update to illustrate transitions (toggles between sample data objects)
  data = updated ? sampleData1 : sampleData2;
  updated = !updated;
  renderContent();
}

function onZoom(event) {
  // scale master group
  d3.select("#master-group").attr("transform", event.transform);
  // scale circle and text attributes
  const scale = event.transform.k;
  d3.selectAll(".node-text").attr("font-size", 10 / scale);
  d3.selectAll(".node-text").each((d) =>
    d3.select(`#node-text-${d.data.uuid}`).text(findNodeText(d, scale))
  );
  d3.selectAll(".link-text").attr("font-size", 10 / scale);
}

function resetPosition() {
  d3.select("#link-map-svg")
    .transition("reset-position")
    .duration(1000)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(canvasSize / 2, canvasSize / 2)
    );
}

function resetOpacity() {
  d3.select("#background-rings")
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  d3.selectAll(".link")
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  d3.selectAll(".node")
    .selectAll(".node-background, .node-circle, .node-text")
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  // reset colors of selected link
  transitionLinkColor(selectedLinkUUID, false);
  selectedLinkUUID = "";
}

function createNodeRadiusScale() {
  const min = d3.min(nodes.map((node) => node.data[sizeNodesBy]));
  const max = d3.max(nodes.map((node) => node.data[sizeNodesBy]));
  nodeScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([minNodeRadius, maxNodeRadius]);
}

function createLinkScales() {
  const min = d3.min(links.map((link) => link[sizeLinksBy]));
  const max = d3.max(links.map((link) => link[sizeLinksBy]));
  linkWidthScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([minLinkWidth, maxLinkWidth]);
  linkArrowScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([minArrowSize, maxArrowSize]);
  linkArrowOffsetScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([minArrowSize / 2.9, maxArrowSize / 2.9]);
}

function findLinkColor(d) {
  return colors.link[d.direction];
}

function findRadialPoints(d) {
  const radius = d.y;
  const angle = d.x - Math.PI / 2;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function findLinkPath(d) {
  // curved links
  if (curvedLinks) {
    return d3
      .linkRadial()
      .angle((r) => r.x)
      .radius((r) => r.y)(d);
  }
  // straight links
  const anchors =
    d.direction === "outgoing" ? [d.source, d.target] : [d.target, d.source];
  const points = anchors.map((a) => findRadialPoints(a));
  return `M${points[0]}L${points[1]}`;
}

function transitionLinkColor(uuid, focus) {
  const color = (d) =>
    colors.link[`${d.direction}${focus ? "Highlighted" : ""}`];
  // highlight path
  d3.selectAll(`#link-path-${uuid}`)
    .transition()
    .duration(duration / 2)
    .attr("stroke", (d) => color(d));
  // highlight arrow
  d3.selectAll(`#link-arrow-${uuid}`)
    .transition()
    .duration(duration / 2)
    .attr("fill", (d) => color(d));
}

function linkMouseOver(e, link) {
  transitionLinkColor(link.uuid, true);
}

function linkMouseOut(e, link) {
  if (selectedLinkUUID !== link.uuid) transitionLinkColor(link.uuid, false);
}

function linkClick(e, link) {
  e.stopPropagation();
  transitionLinkColor(selectedLinkUUID, false);
  selectedLinkUUID = link.uuid;
  // highlight link and attached nodes
  d3.select(`#link-${link.uuid}`)
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  d3.select(`#node-${link.source.data.uuid}`)
    .selectAll(".node-background, .node-circle, .node-text")
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  d3.select(`#node-${link.target.data.uuid}`)
    .selectAll(".node-background, .node-circle, .node-text")
    .transition()
    .duration(duration / 2)
    .style("opacity", 1);
  // fade out other content
  d3.select("#background-rings")
    .transition()
    .duration(duration / 2)
    .style("opacity", 0.5);
  d3.selectAll(".link")
    .filter((l) => l.uuid !== link.uuid)
    .transition()
    .duration(duration / 2)
    .style("opacity", 0.3);
  d3.selectAll(".node")
    .filter(
      (n) =>
        n.data.uuid !== link.source.data.uuid &&
        n.data.uuid !== link.target.data.uuid
    )
    .selectAll(".node-background, .node-circle, .node-text")
    .transition()
    .duration(duration / 2)
    .style("opacity", 0.3);
}

function findNodeTransform(d) {
  return `rotate(${(d.x * 180) / Math.PI - 90}),translate(${
    d.y || 0
  }, 0),rotate(${(-d.x * 180) / Math.PI + 90})`;
}

function findNodeRadius(d) {
  return nodeScale(d.data[sizeNodesBy]);
}

function findNodeFill(d, radius) {
  if (d.data.image) {
    // check if image already exists in defs
    const oldImage = d3.select(`#image-${d.data.uuid}`);
    const node = d3.select(`#node-${d.data.uuid}`);
    if (oldImage.node()) {
      // check image size matches node start size
      const matchingSizes =
        node.node() && oldImage.attr("height") / 2 === +node.attr("r");
      // only include duration if node present and matching sizes
      oldImage
        .transition()
        .duration(node.node() && matchingSizes ? duration : 0)
        .attr("height", radius * 2)
        .attr("width", radius * 2);
    } else {
      // create new pattern
      const pattern = d3
        .select("#image-defs")
        .append("pattern")
        .attr("id", `pattern-${d.data.uuid}`)
        .attr("height", 1)
        .attr("width", 1);
      // append new image to pattern
      pattern
        .append("image")
        .attr("id", `image-${d.data.uuid}`)
        .attr("height", radius * 2)
        .attr("width", radius * 2)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("xlink:href", () => d.data.image)
        .on("error", () => {
          // try image proxy
          const newImage = d3.select(`#image-${d.data.uuid}`);
          const proxyURL = "//images.weserv.nl/";
          if (!newImage.attr("xlink:href").includes(proxyURL)) {
            newImage.attr("xlink:href", `${proxyURL}?url=${d.data.image}`);
          } else {
            // fall back on placeholder
            newImage.attr("xlink:href", "broken-image.jpg");
          }
        });
    }
    return `url(#pattern-${d.data.uuid})`;
  }
  return colors.node[d.data.type];
}

function findNodeText(d) {
  return d.data.text;
}

function nodeMouseOver(e, node) {
  const { uuid, id, type } = node.data;
  // highlight selected node
  d3.select(`#node-backdrop-${uuid}`)
    .transition()
    .duration(duration / 4)
    .attr("r", (d) => findNodeRadius(d) + 6);
  d3.select(`#node-background-${uuid}`)
    .transition()
    .duration(duration / 4)
    .attr("fill", colors.node.highlight1)
    .attr("r", (d) => findNodeRadius(d) + 6);
  // highlight other instances of node if present
  d3.selectAll(`.node-backdrop-${type}-${id}`)
    .filter((n) => n.data.uuid !== node.data.uuid)
    .transition()
    .duration(duration / 4)
    .attr("r", (d) => findNodeRadius(d) + 6);
  d3.selectAll(`.node-background-${type}-${id}`)
    .filter((n) => n.data.uuid !== node.data.uuid)
    .transition()
    .duration(duration / 4)
    .attr("fill", colors.node.highlight2)
    .attr("r", (d) => findNodeRadius(d) + 6);
}

function nodeMouseOut(e, node) {
  const { id, modelType } = node.data;
  // fade out all highlighted nodes
  d3.selectAll(`.node-backdrop-${modelType}-${id}`)
    .transition()
    .duration(duration / 4)
    .attr("r", (d) => findNodeRadius(d) + 1.95);
  d3.selectAll(`.node-background-${modelType}-${id}`)
    .transition()
    .duration(duration / 4)
    .attr("fill", "#aaa")
    .attr("r", (d) => findNodeRadius(d) + 2);
}

function nodeClick(e, node) {
  if (!transitioning) {
    transitioning = true;
    const centerNode = node.data.uuid === data.uuid;
    if (centerNode) {
      resetOpacity();
      resetPosition();
    } else {
      // get new data then re-run renderContent function here to traverse the graph!
    }
  }
}

function createLinks() {
  d3.select(`#links`)
    .selectAll(".link")
    .data(links, (d) => d.uuid)
    .join(
      (enter) => {
        // create group
        const group = enter
          .append("g")
          .attr("id", (d) => `link-${d.uuid}`)
          .attr("class", "link")
          .attr("opacity", 0)
          .call((node) => {
            node
              .transition("link-enter")
              .delay(200)
              .duration(duration * 2)
              .attr("opacity", 1);
          });
        // create path
        group
          .append("path")
          .attr("id", (d) => `link-path-${d.uuid}`)
          .attr("class", (d) => `link-path link-path-${d.id}`)
          .attr("fill", "none")
          .attr("stroke", findLinkColor)
          .attr("stroke-width", (d) => linkWidthScale(d[sizeLinksBy]))
          .attr("d", findLinkPath)
          .attr("cursor", "pointer")
          .on("mouseover", linkMouseOver)
          .on("mouseout", linkMouseOut)
          .on("click", linkClick);
        // create arrow
        group
          .append("text")
          .attr("class", "link-arrow")
          .attr("dy", (d) => linkArrowOffsetScale(d[sizeLinksBy]))
          .attr("dx", 2)
          .append("textPath")
          .attr("id", (d) => `link-arrow-${d.uuid}`)
          .text("▶")
          .attr("font-size", (d) => linkArrowScale(d[sizeLinksBy]))
          .attr("text-anchor", "middle")
          .attr("startOffset", "50%")
          .attr("href", (d) => `#link-path-${d.uuid}`)
          .attr("fill", findLinkColor)
          .attr("cursor", "pointer")
          .on("mouseover", linkMouseOver)
          .on("mouseout", linkMouseOut)
          .on("click", linkClick);
        // create text
        group
          .append("text")
          .attr("dy", -5)
          .append("textPath")
          .classed("link-text", true)
          .text((d) => d.target.data.link.text)
          .attr("font-size", 10)
          .attr("text-anchor", "middle")
          .attr("startOffset", "50%")
          .attr("href", (d) => `#link-path-${d.uuid}`);
        return group;
      },
      (update) => {
        // update path
        update
          .select(".link-path")
          .on("mouseover", linkMouseOver)
          .on("mouseout", linkMouseOut)
          .on("click", linkClick)
          .transition("link-path-update")
          .duration(duration)
          .attr("d", findLinkPath)
          .attr("stroke", findLinkColor)
          .attr("stroke-width", (d) => linkWidthScale(d[sizeLinksBy]));
        // update arrow
        update
          .select(".link-arrow")
          .transition("link-arrow-update")
          .duration(duration)
          .attr("dy", (d) => linkArrowOffsetScale(d[sizeLinksBy]));
        update
          .select(".link-arrow")
          .select("textPath")
          .on("mouseover", linkMouseOver)
          .on("mouseout", linkMouseOut)
          .on("click", linkClick)
          .transition("link-arrow-text-path-update")
          .duration(duration)
          .attr("font-size", (d) => linkArrowScale(d[sizeLinksBy]))
          .attr("fill", findLinkColor);
        return update;
      },
      (exit) => {
        exit
          .transition("link-exit")
          .duration(duration / 2)
          .attr("opacity", 0)
          .remove();
        return exit;
      }
    );
}

function createNodes() {
  d3.select(`#nodes`)
    .selectAll(".node")
    .data(nodes, (d) => d.data.uuid)
    .join(
      (enter) => {
        // create group
        const group = enter
          .append("g")
          .attr("id", (d) => `node-${d.data.uuid}`)
          .attr("class", "node")
          .attr("opacity", 0)
          .call((node) => {
            node.transition("node-enter").duration(duration).attr("opacity", 1);
          });
        // create white backdrop (for png images with transparency)
        group
          .append("circle")
          .attr("id", (d) => `node-backdrop-${d.data.uuid}`)
          .attr(
            "class",
            (d) =>
              `node-backdrop node-backdrop-${d.data.modelType}-${d.data.id}`
          )
          .attr("transform", findNodeTransform)
          .attr("r", (d) => findNodeRadius(d) + 1.95)
          .attr("fill", "white");
        // create background
        group
          .append("circle")
          .attr("id", (d) => `node-background-${d.data.uuid}`)
          .attr(
            "class",
            (d) =>
              `node-background node-background-${d.data.modelType}-${d.data.id}`
          )
          .attr("transform", findNodeTransform)
          .attr("r", (d) => findNodeRadius(d) + 2)
          .attr("fill", "#aaa")
          .attr("cursor", "pointer")
          .on("mouseover", nodeMouseOver)
          .on("mouseout", nodeMouseOut)
          .on("click", nodeClick);
        // create circle
        group
          .append("circle")
          .classed("node-circle", true)
          .attr("id", (d) => `node-circle-${d.data.uuid}`)
          .attr("transform", findNodeTransform)
          .attr("r", findNodeRadius)
          .attr("fill", (d) => findNodeFill(d, findNodeRadius(d)))
          .attr("pointer-events", "none");
        // create text
        group
          .append("text")
          .attr("id", (d) => `node-text-${d.data.uuid}`)
          .classed("node-text", true)
          .text((d) => findNodeText(d, 1))
          .attr("font-size", 10)
          .style("text-shadow", "0 0 3px white")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("pointer-events", "none")
          .attr("transform", findNodeTransform);
        return group;
      },
      (update) => {
        // update white backdrop
        update
          .select(".node-backdrop")
          .transition("node-backdrop-update")
          .duration(duration)
          .attr("transform", findNodeTransform)
          .attr("r", (d) => findNodeRadius(d) + 1.95);
        // update background
        update
          .select(".node-background")
          .on("mouseover", nodeMouseOver)
          .on("mouseout", nodeMouseOut)
          .on("click", nodeClick)
          .transition("node-background-update")
          .duration(duration)
          .attr("r", (d) => findNodeRadius(d) + 2)
          .attr("transform", findNodeTransform);
        // update circle
        update
          .select(".node-circle")
          .transition("node-circle-update")
          .duration(duration)
          .attr("r", findNodeRadius)
          .attr("fill", (d) => findNodeFill(d, findNodeRadius(d)))
          .attr("transform", findNodeTransform);
        // update text
        update
          .select(".node-text")
          .transition("node-text-update")
          .duration(duration)
          .attr("transform", findNodeTransform);
        return update;
      },
      (exit) => {
        exit
          .transition("node-exit")
          .duration(duration / 2)
          .attr("opacity", 0)
          .remove();
        return exit;
      }
    );
}

function buildCanvas() {
  // create svg
  const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "link-map-svg")
    .attr("width", canvasSize)
    .attr("height", canvasSize);
  // add image defs
  svg.append("defs").attr("id", "image-defs");
  // set up groups and background rings
  const masterGroup = svg.append("g").attr("id", "master-group");
  const rings = masterGroup.append("g").attr("id", "background-rings");
  const ringScale = (canvasSize - 70) / 6;
  const ringSizes = [ringScale, ringScale * 2, ringScale * 3];
  ringSizes.forEach((size, i) => {
    rings
      .append("circle")
      .attr("r", size)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("opacity", 0.1);
  });
  masterGroup.append("g").attr("id", "links");
  masterGroup.append("g").attr("id", "nodes");
  // create sample update button
  const button = svg.append("g").attr("id", "button-group");
  button
    .append("rect")
    .attr("width", 105)
    .attr("height", 42)
    .attr("fill", "lightBlue")
    .attr("cursor", "pointer")
    .on("click", sampleUpdate);
  button
    .append("text")
    .text("Update")
    .attr("font-size", 20)
    .attr("x", 50)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("pointer-events", "none");
  // set up zoom
  svg.call(zoom).on("dblclick.zoom", null);
  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(canvasSize / 2, canvasSize / 2)
  );
  // reset position on background click
  svg.on("click", () => {
    resetPosition();
    setTimeout(() => {
      transitioning = false;
    }, duration + 100);
  });
}

function renderContent() {
  resetOpacity();
  // build tree data
  const hierarchy = d3.hierarchy(data, (d) => d.children);
  const circleSize = canvasSize - 70;
  let radius;
  if (hierarchy.height === 1) radius = circleSize / 6;
  if (hierarchy.height === 2) radius = circleSize / 3;
  if (hierarchy.height === 3) radius = circleSize / 2;
  const totalNodes = hierarchy.copy().count().value;
  const nodeSpacing = 0.4;
  const tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .nodeSize([nodeSpacing, radius / hierarchy.height])
    .separation((a, b) => {
      // if less than 20 nodes rotate branches evenely around center node
      if (totalNodes < 20 && a.depth === 1) {
        const degrees = (2 * Math.PI) / nodeSpacing;
        return degrees / hierarchy.children.length;
      }
      return (a.parent === b.parent ? 1 : 2) / a.depth;
    });
  const treeData = tree(hierarchy);
  const newLinks = treeData.links();
  const newNodes = treeData.descendants();
  newLinks.forEach((link) => {
    link.id = link.target.data.link.id;
    link.uuid = link.target.data.link.uuid;
    link.direction = link.target.data.link.direction;
    link[sizeLinksBy] = link.target.data.link[sizeLinksBy];
  });
  links = newLinks;
  nodes = newNodes;
  // set up scales
  createLinkScales();
  createNodeRadiusScale();
  // render new content
  createLinks();
  createNodes();
  // mark transition complete after duration
  setTimeout(() => {
    transitioning = false;
  }, duration + 100);
}

buildCanvas();
data = sampleData1;
renderContent();
