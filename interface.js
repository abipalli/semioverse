import { v4 as uuid } from "uuid";

class ElementMap extends Map {
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

  // Retrieve the object associated with a given SVG element
  getElementObject(svgElementId) {
    const obj = this.get(svgElementId);
    if (!obj) {
      throw new Error(`No object associated with SVG element ${svgElementId}`);
    }
    return obj;
  }

  // Update the object associated with a given SVG element
  updateElementObject(svgElementId, newObject) {
    if (!this.has(svgElementId)) {
      throw new Error(
        `No object associated with SVG element ${svgElementId} to update`
      );
    }
    this.set(svgElementId, newObject);
  }
}

export default ElementMap;
