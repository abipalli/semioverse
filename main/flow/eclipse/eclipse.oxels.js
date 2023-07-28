import Oxel from '../../oxel.js';

const EclipseStatus = Object.freeze({
    DEFINE: new Oxel("DEFINE"),
    DESCRIBE: new Oxel("DESRCRIBE"),
    PLAN: new Oxel("PLAN"),
    PAUSE: new Oxel("PAUSE"),
    CREATE: new Oxel("CREATE"),
    REVIEW: new Oxel("REVIEW"),
    CANCEL: new Oxel("CANCEL"),
    INCOMPLETE: new Oxel("INCOMPLETE"),
    COMPLETE: new Oxel("COMPLETE"),
});

EclipseStatus.DEFINE.set("next", EclipseStatus.DESCRIBE);
EclipseStatus.DESCRIBE.set("next", EclipseStatus.PLAN);
EclipseStatus.PLAN.set("next", EclipseStatus.PAUSE);
// EclipseStatus.CANCEL
