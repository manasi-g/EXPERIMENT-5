var c = 0;
var experimentstarted = false;
//?v1=1&n1=1&n2=1&inc=1

function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        '^(?:.*[&\\?]' +
          encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$',
        'i'
      ),
      '$1'
    )
  );
}
var V1 = parseFloat(getQueryStringValue('v1'));
var V2 = 0;
var N1 = parseFloat(getQueryStringValue('n1'));
var N2 = parseFloat(getQueryStringValue('n2'));
var pH = 2;
var equiFound = false;
var dps = []; // dataPoints




function getPH() {
  console.log('V1 = ' + V1);
  console.log('V2 = ' + V2);
  console.log('N1 = ' + N1);
  console.log('N2 = ' + N2);
  console.log('diff = ' + (N1 * V1 - N2 * V2));
  //before
  if (N1 * V1 - N2 * V2 > 0) {
    const concH = parseFloat((N1 * V1 - N2 * V2).toFixed(2)) / (V1 + V2);
    const ph = -Math.log10(concH);
    console.log('PH = ' + ph.toFixed(2));
    return parseFloat(ph.toFixed(2));
  }
  //equivalence
  else if (N1 * V1 - N2 * V2 === 0) {
    console.log('PH = 7');
    const x = 7;
    return parseFloat(x.toFixed(2));
  }
  //after
  else {
    if (!equiFound) {
      dps.push({
        x: max_base / 2,
        y: 7,
        markerColor: 'red',
        markerSize: 12
      });
      equiFound = true;
    }
    const concOH = parseFloat((N2 * V2 - N1 * V1).toFixed(2)) / (V1 + V2);
    const ph = Math.log10(concOH);
    console.log('PH = ' + (14 + ph.toFixed(2)));
    console.log(typeof ph.toFixed(2));
    const x = 14 + parseFloat(ph.toFixed(2));
    return parseFloat(x.toFixed(2));
  }
}

//hardcoded a value here. It can be changed
var max_base = ((N1 * V1) / N2) * 2;

function f1() {
  c++;
  if (c == 1) {
    g();
    document.getElementById('fun1').style.display = 'none';
    document.getElementById('knob_ON').style.display = 'none';
    document.getElementById('drop').style.display = 'block';
    experimentstarted = true;
    const loop = setInterval(function () {
      if (V2 >= max_base) clearInterval(loop);
      document.getElementById('ripple_m').style.display = 'block';
      document.getElementById('ripple_o').style.display = 'block';
      document.getElementById('ripple_i').style.display = 'block';
      setTimeout(function () {
        document.getElementById('ripple_o').style.display = 'none';
        document.getElementById('ripple_m').style.display = 'none';
        document.getElementById('ripple_i').style.display = 'none';
      }, 500);
      updatevalueondisplay();
    }, 700);
  } else if (c == 2) {
    document.getElementById('knob_ON').style.display = 'block';
    document.getElementById('fun3').style.display = 'none';
    document.getElementById('drop').style.display = 'none';
    var insid = document.getElementById('ripple_i');
    var mid = document.getElementById('ripple_m');
    var out = document.getElementById('ripple_o');
    insid.remove();
    mid.remove();
    out.remove();
  } else {
    c--;
    alert('You clicked on the Wrong Apparatus, Refresh to avoid Glithes');
  }
}

function f2() {
  document.getElementById('fun2').style.display = 'none';
}

function updatevalueondisplay() {
  V2 += parseInt(getQueryStringValue('inc'));

  //calculate pH here; I have termporarily simply incremented
  pH = getPH();

  //the changed pH is displayed
  if (V2 > (1 * max_base) / 6) {
    document.getElementById('water0').style.display = 'none';
  }
  if (V2 > (2 * max_base) / 6) {
    document.getElementById('water1').style.display = 'none';
  }
  if (V2 > (3 * max_base) / 6) {
    document.getElementById('water2').style.display = 'none';
  }
  if (V2 > (4 * max_base) / 6) {
    document.getElementById('water3').style.display = 'none';
  }
  if (V2 > (5 * max_base) / 6) {
    document.getElementById('water4').style.display = 'none';
  }
  if (V2 <= max_base) {
    document.getElementById('Pisplay1').innerHTML = pH;
    final = pH;
  } else {
    experimentstarted = false;
    pH = final;
    f2();
  }
}

//code for chart

function g() {
  var chart = new CanvasJS.Chart('chartContainer', {
    title: {
      text: 'Conductance vs Volume of Titrant (NaOH) added'
    },
    axisX: {
      title: 'Volume of Strong Base (ml)',
      maximum: max_base,
      minimum: 0
    },
    axisY: {
      title: 'Conductance of solution',
      maximum: 14,
      interval: 1,
      gridThickness: 0,
      minimum: 0
    },
    data: [
      {
        type: 'line',
        lineColor: 'black',
        markerSize: 6,
        dataPoints: dps
      }
    ]
  });
  //var op= 0;
  var xVal = 0;
  var yVal = 0;
  var updateInterval = 700;
  var dataLength = max_base; // number of dataPoints visible at any point

  var updateChart = function (count) {
    count = count || 1;

    for (var j = 0; j < max_base; j++) {
      yVal = pH;
      xVal = V2;

      if (V2 <= max_base) {
        dps.push({
          x: xVal,
          y: yVal
        });
      } else {
        f2();
        const drop = document.getElementById('drop');
        drop.remove();
        break;
      }
    }

    chart.render();
  };
  updateChart(dataLength);
  setInterval(function () {
    updateChart();
  }, updateInterval);
}

function onSubmit() {
  let norm = document.getElementById('normality');
  let stre = document.getElementById('strength');

  if (norm.value !== '0.01') norm.style.border = 'solid 3px red';
  else norm.style.border = 'solid 3px green';
  if (stre.value !== '0.365') stre.style.border = 'solid 3px red';
  else stre.style.border = 'solid 3px green';
}

function onReset() {
  let norm = document.getElementById('normality');
  let stre = document.getElementById('strength');

  norm.value = '';
  stre.value = '';
  norm.style.border = 'none';
  stre.style.border = 'none';
}
