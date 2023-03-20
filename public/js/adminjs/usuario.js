 

$(document).ready(function () {

    
    
    $.ajax({
        url: '/admin/grafico',
        type: 'GET',
        success: function (dados) { 
                const xss = new Array()
                const domains = new Array()
                const sql = new Array()
                const scanner = new Array()
                
                dados.forEach(evt=>{if(evt.id ==1)  xss.push(evt)})
                dados.forEach(evt=>{if(evt.id ==2) domains.push(evt)})
                dados.forEach(evt=>{if(evt.id ==3) sql.push(evt)})
                dados.forEach(evt=>{if(evt.id ==4) scanner.push(evt)})
                 
 
            
            var canvas = document.getElementById("mychart")
            var ctx = canvas.getContext('2d'); 
            const chart = new Chart(
                ctx, {
                type: "bar",
                data: {
                    labels: [ xss[0].nome,domains[0].nome,sql[0].nome, scanner[0].nome],
                    datasets: [
                        {
                            label: 'tipos de testes vs quantidade de uso',
                            backgroundColor: [ 'blue', 'green', 'yellow', 'purple'],
                            borderColor: 'rgb(255,99,132)',
                            data: [xss[0].quant, domains[0].quant,sql[0].quant, scanner[0].quant]
                        }
                    ]
                },
                options: {}

            }
            )
           
      
           

        }
    })

})


 
