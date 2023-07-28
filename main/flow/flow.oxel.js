import Oxel from '../oxel.js';


const FlowArtifacts = Object.freeze({
    "ObjectType": {
        "Entities": new Oxel("Entities"),
        "Objectives": new Oxel("Objectives"),
        "Resources": new Oxel("Resources")
    },
});

export const ObjectTypes = Object.freeze([
    new Oxel("Entities"),
    new Oxel("Objectives"),
    new Oxel("Resource"),
]);

export class FlowOxel extends Oxel {
    constructor(value) {
        super("Flow", value);

        // Template Properties
        this.status = ;

        ObjectTypes.forEach(ObjectType => {
            this.thread()
        })
    }
}

const StartFlow = async () => {
    // Technologies
    // Files
    // Objectives
    // Entities
    const Flow = new FlowOxel();

    console.log('keys', Flow.keys());

    return Flow;
}

StartFlow();
