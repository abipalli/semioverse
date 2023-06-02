import { v4 as uuid } from "uuid";

class ElementMap {
  constructor() {
    this.mapping = new Map();
  }

  // Associate a new SVG element with a specific object
  newElement(svgElement, associatedObject) {
    const id = "#" + uuid();
    svgElement.attr("id", id);
    this.mapping.set(id, associatedObject);
    return id;
  }

  // Retrieve the object associated with a given SVG element
  getElementObject(svgElementId) {
    const obj = this.mapping.get(svgElementId);
    if (!obj) {
      throw new Error(`No object associated with SVG element ${svgElementId}`);
    }
    return obj;
  }

  // Update the object associated with a given SVG element
  updateElementObject(svgElementId, newObject) {
    if (!this.mapping.has(svgElementId)) {
      throw new Error(
        `No object associated with SVG element ${svgElementId} to update`
      );
    }
    this.mapping.set(svgElementId, newObject);
  }
}

export default ElementMap;
