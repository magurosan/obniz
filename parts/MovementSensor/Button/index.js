class Button {
  constructor() {
    this.keys = ["signal","gnd"];
    this.required = ["signal"];
  };

  wired(obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    // start input
    this.io_signal.pull("5v");

    var self = this;
    this.io_signal.input(function(value) {
      self.isPressed = (value === false);
      if (self.onchange) {
        self.onchange(value === false);
      }
    });
  };

  async isPressedWait() {
    var ret = await this.io_signal.inputWait();
    return ret === false;
  };
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("Button", Button);
