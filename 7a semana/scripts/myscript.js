$(()=>{
    
    $(document).ready(function(){
        // var xhttp = new XMLHttpRequest();
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         $('#file-list').html(this.responseText);
        //     }
        // };
        // xhttp.open("GET", "/tabledata", true);
        // xhttp.send();
        
        // $.get('/tabledata', (data, status) => {
            //     $('#file-list').html(data)
            // });

        $('#file-list').load("/tabledata");
    });

    $('#reset').click(()=>{
        $('#upsuccess').html('');
    })

    //Form submission
    $('#upload').click( function(event){

        var form = $('#form')[0];
        
        //formData object is only available in HTML5
        var formData = new FormData(form);
        // the default action of the click is to take the browser to another url.
        event.preventDefault(); 
        
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: $('#form').attr('action'),
            data: formData,
            processData: false, //This is important, because we want to send the data unprocessed
            contentType: false,
            cache: false,
            success: function (data) {

                $('#file-list').html(data);
                $('#upsuccess').html('The file was uploaded!')
                $('#form input[name=file]').val('')
                $('#form input[name=description]').val('')
            }
        });

        // This doesn't work because the post function processes data into a query string to fit the
        //  "application/x-www-form-urlencoded" format. 
        // $.post($('#form').attr('atction'), formData, (data)=>{
        //     $('#file-list').html(data);
        // })
    });
      
})
