

$(function(){

    $('#frequentes').hide()
    $('#operacoes').hide()


    $('.todos').click(function(){

        $('#todos').show()
        $('#frequentes').hide()
        $('#operacoes').hide()

    })

    $('.frequentes').click(function(){

        $('#frequentes').show()
        $('#todos').hide()
        $('#operacoes').hide()

    })

    $('.operacoes').click(function(){

        $('#operacoes').show()
        $('#frequentes').hide()
        $('#todos').hide()

    })

    $('#sendLink').click(function(){
        $('#send').trigger()
        
    })




})

