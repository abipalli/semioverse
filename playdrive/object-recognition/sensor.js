import Simulation from "./simulation.jss";

class Sensor {
  constructor(sensor, ...simulations) {
    this.sensor = sensor();
    this.simulations = [...simulations];
  }
}

// object-recognition
// creating an expression of the mapping between the sensor data -> the svg-id and using this as a lookup
// for the real object
// sending to all simulations of the sensor

// container recognition
// association by proximity
