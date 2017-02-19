'use strict';

const MIIYOO_SERVICE = '49535343-fe7d-4ae5-8fa9-9fafd205e455';

const MIIYOO_RX_CHAR = '49535343-1e4d-4bd9-ba61-23c647249616';
const MIIYOO_TX_CHAR = '49535343-8841-43f4-a8d4-ecbe34729bb3';

function findDevice() {
  return navigator.bluetooth.requestDevice({
    filters: [{
      name: "ONYX"
    }, {
      name: "PEARL"
    }],
    optionalServices: [MIIYOO_SERVICE]
  });
}

class MiiyooWebBluetooth {
  constructor(device) {
    if (device === undefined) {
      throw new Error('MiiyooWebBluetooth requires a bluetooth device!');
    }
    this._device = device;
    this._service = undefined;
    this._tx = undefined;
    this._rx = undefined;
    this._msg_queue = [];
  }

  open() {
    return this._device.gatt.connect()
      .then(server => { return server.getPrimaryService(MIIYOO_SERVICE); }).catch(er => { console.log(er); })
      .then(service => { this._service = service;
                         return this._service.getCharacteristic(MIIYOO_TX_CHAR);
                       }).catch(er => { console.log(er); })
      .then(char => { console.log("hi"); this._tx = char;
                      return this._service.getCharacteristic(MIIYOO_RX_CHAR);
                    }).catch(er => { console.console.log(er); })
      .then(char => { this._rx = char;
                      console.log("connected!");
                      return this._rx.startNotifications().then(_ => {
                        this._rx.addEventListener('characteristicvaluechanged', e => console.log(new TextDecoder('ASCII').decode(e.target.value)));
                       });
                    });
  }

  close() {
    if (this._device !== undefined) {
      return this._device.gatt.disconnect();
    }
    return Promise.reject();
  }

  write(cmd) {
    if (this._tx === undefined) {
      return Promise().reject('No tx to write to!');
    }
    return this._tx.writeValue(new TextEncoder('ASCII').encode(cmd.toString() + ",\n"));
  }
};
