var devices = [];

var init = function() {
  var connectBtn = document.getElementById('connect');
  connectBtn.addEventListener('click', function(event) {
    findDevice().then(d => {
      dev = new MiiyooWebBluetooth(d);
      dev.open();
      devices.push(dev);
    });
  });

  var slider = document.getElementById('speed');
  slider.addEventListener('input', function(event) {
    devices.forEach(dev => {
      dev.write(parseInt(slider.value,10));
    });
  });
};
