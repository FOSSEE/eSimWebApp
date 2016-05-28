var socket = io();

jQuery("#websocket_form").click(function(){
	var msg = jQuery("#msgs").val();
	if(msg!=''){
		socket.emit('chat message', msg);
	}
    jQuery("#msgs").val('');
    return false;
 });

socket.on('chat message', function(msg){
    console.log(msg);
});

