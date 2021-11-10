var base_url = "http://10.2.12.86:8000";
var apparatus = 4
var protocol = 5
let Results=0;
var DeltaX=0;
var Samples=0;
var point_x;
var point_y;
var name = ''
var first=0;
let my_execution_id = 0;
let execution_id = 0;
var point_x;
var point_y;
var output_data = [];
var receive_error_velocity = [];
var receive_error_period = [];

var DeltaX = document.getElementById('DeltaX');
var Samples = document.getElementById('Samples');
let last_result_id =0 

function myStartFunction() {
  Results = setInterval(getData,500)
  console.log("Valor da função");
  console.log(Results);
}


var mytable = [];

function myStopFunction() {
  clearInterval(Results);
  console.log(Results);
}


// Receive data from experiment
function getData(){
  let endpoint_result =  "/api/v1/execution/"+execution_id+"/result/0";
  if (first === 0)
  {
    endpoint_result = "/api/v1/execution/"+execution_id+"/result/0";
  }
  else{
    endpoint_result = "/api/v1/execution/"+execution_id+"/result/"+last_result_id
  }

  axios({
    method: 'get', //you can set what request you want to be
    url: endpoint_result,
  }).then(response => {
    console.log('plotly_results', response.data);
    if (first === 0)
    {
      if (response.data !== "")
      {
        console.log('ola', response.data.value);
        res = Object.keys(response.data.value);
        buildPlot1(res);
        buildPlot2(res);  // grafico de temperatura não 
        buildPlot3(res);
        last_result_id = parseInt(response.data.id)+1
        first = 1;
      }
    }
    console.log(response);
    // check for ending of the experiment
    if (response.data.result_type !== 'undefined' && response.data.result_type === 'f'){
        myStopFunction();
    }
    else{
      if (typeof response.data === 'object'){
        // console.log('plotly_results ->', response.data.value);
        
        receive_error_velocity = 0.1;
        receive_error_period = 0.0005;//response.data.value.e_period;
        
        Plotly.extendTraces('myplot', {x: [[response.data.value.Sample_number]],y: [[response.data.value.Val3]], 'error_y.array': [[ receive_error_velocity ]]}, [0]);
        last_result_id = parseInt(response.data.id)+1
        // console.log("Var:",last_result_id )
        // console.log("respons: ",response.data.id )
        Plotly.extendTraces('myplot1', {x: [[response.data.value.Val1]]}, [0]);
        Plotly.extendTraces('myplot2', {x: [[response.data.value.Sample_number]],y: [[response.data.value.Val1]],
        'error_y.array': [[receive_error_period]]}, [0]);
    
          // tabela 
          mytable.push(response.data.value);
         // create a table
          var html = "<table>";
         
           mytable.forEach(function(data) {
           for (var i in data ){
                 html += "<td>" + data[i]  +  "</td>";
           }
           html += "</tr >";
           });
           html += "</table>";
		// assumes <div id="result"></div>
           document.getElementById("result").innerHTML = html;
      }
     
    }}).catch(error => {
      if (error.response !== undefined) {
      // console.error('Error : ', error.response.data);
      }
    });
}

function start_Pendulum() {
  // get inputs values from the client side
  if ($("#DeltaX").val() !== undefined)
    DeltaX = $("#DeltaX").val();
  if ($("#Samples").val() !== undefined)
    Samples = $("#Samples").val();

    data_send = {"id":my_execution_id,"apparatus": apparatus, "protocol": protocol, "config": {"deltaX": parseInt (DeltaX), "samples":parseInt (Samples)}}
    // '{"experiment_name": "Pendulo", "config_experiment": {"DeltaX":'+ String(DeltaX)+', "Samples":'+String(Samples)+' }}'
    var endpoint="/api/v1/execution";
    // print out
    console.log('JSON : ' +  endpoint);
    console.log('JSON : ' +  data_send);
  
    axios({
      method: 'post', //you can set what request you want to be
      url: endpoint,
      // headers: HEADERS,
      data: data_send,
    }).then(response => {
      console.log('plotly_results', response);
      my_execution_id = execution_id +1;
      execution_id = response.data.id;      
      console.log(execution_id)
    }).catch(console);
  
    myStartFunction();

}


//// nao usado
function tablebind() {  
  $.ajax({  
      type: "GET",  
      contentType: "application/json; charset=utf-8",  
      url: base_url + '/resultpoint',  
      data: "{}",  
      contentType: 'application/json;charset=UTF-8',
      success: function (response) {  
          var obj = $.parseJSON(response.d);  
          if (obj.length > 0) {  

              var data = obj[0].Table1;  
              var table = $("<table />");  
              table[0].border = "1";  

              var row$;  

              var columns = addAllColumnHeaders(data);  
              for (var i = 0; i < data.length; i++) {  
                  row$ = $('<tr/>');  
           
                  for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
                      var cellValue = data[i][columns[colIndex]];  

                      if (cellValue == null) { cellValue = ""; }  

                      row$.append($('<td/>').html(cellValue));  
                  }  
                  $("#jsonTable").append(row$);  
              }  
               
          }  

      },  
      error: function (response) {  
          //                      
      }  
  });  

}  




var point_x;
var point_y;
/////////////////////////////////////////////////////////////////////////////////
//////////// Build graphic                    
/////////////////////////////////////////////////////////////////////////////////

var selectorOptions = {

  buttons: [{

      step: '1',

      stepmode: 'backward',

      count: 1,

      label: '10N'

  },{

      step: 'all',

  }],

};


function buildPlot1(res) {

  console.log(res);
  var trace1 = {
		x: [],
		y: [],
    error_y: {
      type: 'data',
      color: '#85144B',
      array: [],
      thickness: 1.5,
      width:3,
      visible: true
    },
    mode: 'lines+markers',
    line: {
      color: "#1f77b4", 
      width: 1
    },marker: {
      color: "rgb(0, 255, 255)", 
      size: 6, 
      line: {
        color: "black", 
        width: 0.5
      }
    },
    type:"scatter",
		/*line: {
		  color: '#80CAF6',
		  shape: 'linear'
		},*/
		
		name: res[1]
	  };

    var output_data = [trace1];

    var layout = {
      title: 'velocidade linear em função de número de amostras',
      height: 500, // os valores são todos em pixels
      font: {
      family: 'Lato',
      size: 16,
      color: 'black'
      },

      xaxis: {
            title: 'Amostra[N]',
            titlefont:{
                  color: 'black',
                  size: 14
                  },
                 howticklabels: false
                 // rangemode: 'tozero'
                
                 //rangeslider: {}
            },
      yaxis: {
            title: 'velocidade linear[m/s]',
            fixedrange: true,
            titlefont:{
                  color: 'black',
                  size: 14
                  }
                 // rangemode: 'tozero'
            }
     };

     Plotly.newPlot('myplot', output_data, layout);
   
}




///////////////////

function buildPlot2(res) {
  console.log(res);
  var trace2 = {
    // no histograma so é x ou é y.
		x: [],
		//y: [],
    name:'Histograma de Periodo de movimento',
    visible: true,
   // mode: 'lines+markers',
    type: 'histogram',
    nbins:50,
    // xbins: {

    //   end: 1000, 
  
    //   size: 0.06, 
  
    //   start: .5
  
    // },
		line: {
		  color: '#80CAF6',
		  shape: 'linear'
		},
    opacity:0.5,
		
		name: res[2]
	  };

    var output_data = [trace2];

    var layout = {
      title: 'Histograma de Periodo de movimento',
      height: 500, // os valores são todos em pixels
      bargap: 0.05, 
  bargroupgap: 0.2,
     
      font: {
      family: 'Lato',
      size: 16,
      color: 'black'
      },

      xaxis: {
            
            title: 'periodo[s]',
            titlefont:{
                  color: 'black',
                  size: 14
                  }
                //  rangemode: 'tozero'
            },
      yaxis: {
        //range:[0.19,0.21],
            title: '# de Eventos',
            titlefont:{
                  color: 'black',
                  size: 14
                  }
                 // rangemode: 'tozero'
            }
     };

     Plotly.newPlot('myplot1', output_data, layout);
   
}


function buildPlot3(res) {
  console.log(res);
  var trace3 = {
		x: [],
		y: [],
    error_y: {
      type: 'data',
      color: '#85144B',
      array: [],
      thickness: 1.5,
      width:3,
      visible: true
    },
    mode: 'lines+markers',
    line: {
      color: "#1f77b4", 
      width: 1
    },marker: {
      color: "rgb(0, 255, 255)", 
      size: 6, 
      line: {
        color: "black", 
        width: 0.5
      }
    },
    type:"scatter",
		
		name: res[3]
	  };

    var output_data = [trace3];

    var layout = {
      title: 'Periodo em função do número de amostras',
      height: 500, // os valores são todos em pixels
      font: {
      family: 'Lato',
      size: 16,
      color: 'black'
      },

      xaxis: {
            
            title: 'Amostra[N]',
            titlefont:{
                  color: 'black',
                  size: 14
                  }
                //  rangemode: 'tozero'
            },
      yaxis: {
        //range:[0.19,0.21],
            title: 'Periodo[s]',
            titlefont:{
                  color: 'black',
                  size: 14
                  }
                  //rangemode: 'tozero'
            }
     };

     Plotly.newPlot('myplot2', output_data, layout);
   
    }







function set_reset() {
  var resetBtn = document.getElementById('resetBtn');
  var location = window.location.href.split('?')[0];
  
    resetBtn.addEventListener('click', function(event) {
    console.log('Reseting values of R or iteration...');
    window.location.href = location;
    });
    }



