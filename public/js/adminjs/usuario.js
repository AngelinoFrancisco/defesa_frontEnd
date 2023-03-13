 /* 
 
 

const socket = new WebSocket("ws://localhost:5000")
socket.addEventListener("open", function(event){

    console.log("connected to the server")

})


socket.addEventListener("message", function(event){
    console.log("message from server", event)
})
*/


var canvas = document.getElementById("mychart")
var ctx = canvas.getContext('2d');

var chart =  new  Chart(
    ctx,{
        type:"bar",
        data: { 
            labels: [  "PortScan", "Directories", "XSS", "Domains", "DDOS"],
            datasets: [
                {
                    label:'tipos de testes vs quantidade de uso',
                    backgroundColor:['rgb(255,99,132)','blue','green','yellow','purple'], 
                    borderColor:'rgb(255,99,132)',
                    data: [5, 25, 40, 60,80]
                }
            ]
            },
            options:{}

    }
)

 

updateChart = ()=>{




chart.update()

}