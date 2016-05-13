(function() {
  //var btnClose = document.querySelector(".close");
  var logArea = document.querySelector(".log");
  var statusLine = document.querySelector("#status");
  var serialDevices = document.querySelector(".serial_devices");
  var arrayConexionPuertos = [];
  var stringReceived = '';

  var init = function() {
    if (!serial_lib)
      throw "You must include serial.js before";
    initFormPuertoSerial();
    //btnClose.addEventListener("click", closeDevice);
    //window.addEventListener("hashchange", changeTab);
    document.querySelector(".refresh").addEventListener("click", refreshPorts);
    refreshPorts();
  };
  
  
  var openDevice = function(index, path) {
    statusLine.classList.add("on");
    statusLine.textContent = "Connecting";
    serial_lib.openDevice(index, path, onOpen);
  };
  
  var closeDevice = function(index) {
   if (arrayConexionPuertos[index] !== null) {
     arrayConexionPuertos[index].close();
   }
  };
  
  
  var refreshPorts = function() {
    while (serialDevices.options.length > 0)
      serialDevices.options.remove(0);

    serial_lib.getDevices(function(puertos) {
      logSuccess("got " + puertos.length + " ports");
      for (var i = 0; i < puertos.length; ++i) {
        var path = puertos[i].path;
        serialDevices.options.add(new Option(path, path));
        if (i === 1 || /usb/i.test(path) && /tty/i.test(path)) {
          serialDevices.selectionIndex = i;
          logSuccess("auto-selected " + path);
        }
      }
    });
    
  };


  var initFormPuertoSerial = function() {
    crearBotonesPuertoSerial();
  };
  
  var crearBotonesPuertoSerial = function() {
      serial_lib.getDevices(function(puertos) {
          for (var i = 0; i < puertos.length; ++i) {
            // Crear tabla de puertos
            var table = document.getElementById("tblPuertos");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            // Crear boton puerto serial
            var path = puertos[i].path;
            var btn = document.createElement("button");
            var t = document.createTextNode(path);
            btn.appendChild(t);
            btn.setAttribute("class", "button");
            document.body.appendChild(btn);
            document.getElementById("misOperaciones").appendChild(btn);
            // Adicionar el botón a la tabla de puertos
            cell1.appendChild( btn );
            // Crear input tipo checkbox para la conexión del puerto serial
            var inp = document.createElement("INPUT");
            inp.setAttribute("type", "checkbox");
            inp.setAttribute("class", "checkbox");
            inp.setAttribute("name", "chkPuertoSerial" + i);
            inp.setAttribute("id", "chkPuertoSerial" + i);
            document.getElementById("puertos").appendChild(inp);
            // Adicionar el input tipo checkbox a la tabla de puertos
            cell2.appendChild( inp );
            // Crear presentación del input tipo checkbox
            var initialize = new Switchery(inp);
          }
      });
      var parentTblPuertos = document.querySelector("#tblPuertos");
      parentTblPuertos.addEventListener("change", opencloseDevice, false);
  };
  
  
  function opencloseDevice(e) {
    if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id;
        var indexPuertoActual = document.getElementById(clickedItem).parentElement.parentElement.rowIndex;
        var puertoChequeado = document.getElementById(clickedItem).checked;
        if ( puertoChequeado ) {
          var path = document.getElementsByTagName('button')[indexPuertoActual].textContent;
          openDevice(indexPuertoActual, path);
        } else {
          closeDevice(indexPuertoActual);
        }
    }
    e.stopPropagation();
  }

  
  var addListenerToElements = function(eventType, selector, listener) {
      var addListener = function(type, element, index) {
        element.addEventListener(type, function(e) {
          listener.apply(this, [e, index]);
        });
      };
      var elements = document.querySelectorAll(selector);
      for (var i = 0; i < elements.length; ++i) {
        addListener(eventType, elements[i], i);
      }
  };

  
  var log = function(msg) {
    console.log(msg);
    logArea.innerHTML = msg + "<br/>" + logArea.innerHTML;
  };
  
  var logSuccess = function(msg) {
      log("<span style='color: green;'>" + msg + "</span>");
  };

  var logError = function(msg) {
    statusLine.className = "error";
    statusLine.textContent = msg;
    log("<span style='color: red;'>" + msg + "</span>");
  };

  var onOpen = function(newConnection, connectionId, index) {
    if (newConnection === null) {
      logError("Failed to open device.");
      return;
    }
    arrayConexionPuertos[index] = newConnection;
    arrayConexionPuertos[index].onReceive.addListener(onReceive);
    arrayConexionPuertos[index].onError.addListener(onError);
    arrayConexionPuertos[index].onClose.addListener(onClose);
    log("Id. conexion ABIERTO " + connectionId);
    logSuccess("Device opened.");
//    enableOpenButton(false);
    statusLine.textContent = "Connected";
  };

 var onReceive = function(index, connectionId, data) {
  /*  if (data.indexOf("log:") >= 0) {
      return;
    }
    var m = /([^:]+):([-]?\d+)(?:,([-]?\d+))?/.exec(data);
    if (m && m.length > 0) {
      switch (m[1]) {
        case "b1":
          document.querySelector("#b1").className = m[2] === "0" ? "" : "on";
          break;
        case "b2":
          document.querySelector("#b2").className = m[2] === "0" ? "" : "on";
          break;
        case "b3":
          document.querySelector("#b3").className = m[2] === "0" ? "" : "on";
          break;
        case "c":
          document.querySelector("#bc").className = m[2] === "0" ? "" : "on";
          log(data);
          break;
        case "js":
          document.querySelector("#joy .pointer").className = m[2] === "0" ? "pointer" : "pointer on";
          break;
        case "t":
          document.querySelector("#temp").textContent = convertTemperature(m[2]);
          break;
        case "l":
          document.querySelector("#light").textContent = Math.round((1000 * parseInt(m[2]) / 1024)) / 10;
          document.querySelector("#lightv1").textContent = m[2];
          break;
        case "jxy":
          var el = document.querySelector("#joy .pointer");
          el.style.left = ((128 + parseInt(m[2]) * 0.6) / 256.0 * el.parentElement.offsetWidth) + "px";
          el.style.top = ((128 + parseInt(m[3]) * 0.9) / 256.0 * el.parentElement.offsetHeight) + "px";
          el.textContent = m[2] + "," + m[3];
          break;
      }
    }*/
    
    log("Id. conexion RECIBIENDO " + connectionId);
    stringReceived += data;
    log(data);
    sendSerial(index, "Respuesta a : " + data);

  };
  
  var sendSerial = function(index, message) {
    if (arrayConexionPuertos[index] === null) {
      return;
    }
    if (!message) {
      logError("Nothing to send!");
      return;
    }
    if (message.charAt(message.length - 1) !== '\n') {
      message += "\n";
    }
    arrayConexionPuertos[index].send(message);
  };
  
  var onError = function(index, errorInfo) {
    if (errorInfo.error !== 'timeout') {
      logError("Fatal error encounted. Dropping connection.");
      closeDevice(index);
    }
  };
  
  var onClose = function(index) {
    arrayConexionPuertos[index] = null;
    statusLine.textContent = "Hover here to connect";
    statusLine.className = "";
  };


/////////////////////////////////////////////////////////////////////////
/// mi código de prueba
/////////////////////////////////////////////////////////////////////////

  function bienvenida() {
    document.querySelector('#saludo').innerText =
      'Hola, bienvenido a la mejor app para puerto serial! hoy es ' + new Date();
  }
  
  
  /* Permite cargar múltiples funciones de JavaScript en el evento onload */
  function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function() {
        if (oldonload) {
          oldonload();
          func();
        }
      };
    }
  }
  
  
  addLoadEvent(bienvenida);

  
  init();
})();
