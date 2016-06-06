jQuery(document).ready(function(){

/*------------------------------------------------------------------------------------------------------------------------------------------------
For Simulation of Netlist and Removal of netlist Window
------------------------------------------------------------------------------------------------------------------------------------------------*/

  jQuery("#webtronics_netlist_simulate").click(function(){
  	socket.emit('netlist', jQuery("#webtronics_netlist_text_area").val());
   // console.log("simulation button clicked");
     jQuery('#webtronics_netlist_text_div').hide(); 
     jQuery('#webtronics_netlist_buttons').hide();
     jQuery('#webtronics_netlist_text').hide();       
     jQuery('#webtronics_disable').hide();


   
    
    
    
			
	jQuery.ajax({
	
	url: "/eSIM/simulation.php",
         type: "POST",
        data: {netlist:jQuery("#webtronics_netlist_text_area").val()},
        dataType: "html",
        
    /*    
    type: "POST",
    url: "/eSIM/simulation.php",
    data: '$image,$image1',
    success:function(phpData){
        alert(phpData);
    }*/
	
	
	
	
	success:function() {
	
	//console.log(data);
	//window.location = "/eSIM/simulation.php";
	window.open('/eSIM/simulation.php','about:blank','scrollbars=auto , scrollbars=1, left=300,top=50,width=800,height=600,toolbar=0,resizable=0');
	//alert ();
	//if( data == 'fail' ) {
	//console.log("nahi hua  bc");
	//} 
    
       // else if (data = 'success') {
        //console.log("ho gaya bc");
    	//} 
}, 
            
            
        });
	
	
 });

/*------------------------------------------------------------------------------------------------------------------------------------------------
VIEW NETLIST WINDOW
------------------------------------------------------------------------------------------------------------------------------------------------*/








// jQuery(".view_netlist").click(function(){

//     jQuery('#webtronics_netlist_text_div').show(); 
//     jQuery('#webtronics_netlist_text').show();       
// });








/*------------------------------------------------------------------------------------------------------------------------------------------------
For Download of netlist
------------------------------------------------------------------------------------------------------------------------------------------------*/

    jQuery("#webtronics_netlist_text_download").click(function(){
    //console.log("button clicked");
			
	jQuery.ajax({
	
	url: "/eSIM/download.php",
 
        type: "POST",
        data: {netlist:jQuery("#webtronics_netlist_text_area").val()},
        dataType: "html",
        
     /*   success: function() {
        console.log("success");
            }
 
 	*/
	success: function() {
	//console.log(data);
	window.location = "/eSIM/download.php"	;
	//if( data == 'fail' ) {
	//console.log("nahi hua  ");
	//} 
    
       // else if (data = 'success') {
        //console.log("ho gaya ");
    	//} 
}, 
            
            
        });
	
	
 });



/*------------------------------------------------------------------------------------------------------------------------------------------------
DC FUNCTIONALITY IS WRITTEN HERE 
---------------------------------------------------------------------------------------------------------------------------------------------------*/
jQuery(function(){
	jQuery("#select").show();
    jQuery("#dc_menu").hide();
    jQuery("#ac_menu").hide();
    jQuery("#transient_menu").hide();
    jQuery("#analysis_selectbox").change(function(){
    
    if (jQuery(this).val() == "4")
    {
    jQuery("#select").show();	
    jQuery("#transient_menu").hide();
    jQuery("#dc_menu").hide();
    jQuery("#ac_menu").hide();
    
    }
    else if (jQuery(this).val() == "1")
    {
    jQuery("#select").hide();	
    jQuery("#dc_menu").show();
    jQuery("#ac_menu").hide();
    jQuery("#transient_menu").hide();
    }
    else if (jQuery(this).val() == "2")
    {
    jQuery("#select").hide();	
    jQuery("#ac_menu").show();
    jQuery("#dc_menu").hide();
    jQuery("#transient_menu").hide();
    }
    else if (jQuery(this).val() == "3")
    {
    jQuery("#select").hide();	
    jQuery("#transient_menu").show();
    jQuery("#dc_menu").hide();
    jQuery("#ac_menu").hide();
    
    }
     
   
    //$("#preview").change(function(){
    //jQuery"#analysis_selectbox".val();
        //$("#div1, #div2").toggle();
    });
});




/*------------------------------------------------------------------------------------------------------------------------------------------------
Ac netlist variable for ac
------------------------------------------------------------------------------------------------------------------------------------------------*/

jQuery("#saveac").click(function(){

	startfreq = jQuery("#startfreqval").val();
	stopfreq = jQuery("#stopfreqval").val();
	noofpoint = jQuery("#noofpointsval").val();
	//console.log(startfreq,stopfreq,noofpoint);
	//console.log(startfreq);
	if (startfreq == "")
	{
	alert("Please enter Start Frequency");
	}
	else if (stopfreq == "")
	{
	alert("Please enter Stop Frequency value");
	}
	else if (noofpoint == "")
	{
	alert("Please Enter No Of Points");
	}
	else{

		jQuery("#webtronics_netlist_analysis").hide();
        jQuery("#webtronics_disable").hide();
	}


});


jQuery("#frequency_selectbox").change(function(){

	freq = jQuery(this).val();
	//console.log(freq);
});

jQuery("#scale_selectbox").change(function(){
	scale = jQuery(this).val();
	
	if (scale == "1")
	{
	 scale_val = "lin";
	}
	else if (scale == "2")
	{
	scale_val = "dec";
	}
	else if (scale == "3")
	{
	scale_val = "octal";
	}
});

jQuery("#start_frequency_selectbox").change(function(){

	ac_start_freq = jQuery(this).val();
	
	 if (ac_start_freq == "1")
	{
	 start_ac_unit = "Hz";
	}
	else if (ac_start_freq == "2")
	{
	 start_ac_unit = "THz";
	}
	if (ac_start_freq == "3")
	{
	 start_ac_unit = "GHz";
	}
	else if (ac_start_freq == "4")
	{
	 start_ac_unit = "Meg";
	}
	else if (ac_start_freq == "5")
	{
	 start_ac_unit = "KHz";
	}

});

jQuery("#stop_frequency_selectbox").change(function(){

	ac_stop_freq = jQuery(this).val();
	
	 if (ac_stop_freq == "1")
	{
	 stop_ac_unit = "Hz";
	}
	else if (ac_stop_freq == "2")
	{
	 stop_ac_unit = "THz";
	}
	if (ac_stop_freq == "3")
	{
	 stop_ac_unit = "GHz";
	}
	else if (ac_stop_freq == "4")
	{
	 stop_ac_unit = "Meg";
	}
	else if (ac_stop_freq == "5")
	{
	 stop_ac_unit = "KHz";
	}
			
});

/*------------------------------------------------------------------------------------------------------------------------------------------------
Dc netlist variable for dc
------------------------------------------------------------------------------------------------------------------------------------------------*/
jQuery("#savedc").click(function(){

	source = jQuery("#sourceval").val();
        start = jQuery("#startval").val();
        increment = jQuery("#Incrementval").val();
        stop = jQuery("#stopval").val();
        //console.log(source,start,increment,stop);
        //console.log(start);
        if (source == "")
        {
        alert("Please enter Source Name");
        }
        else if (start == "")
        {
        alert("Please enter Start Time");
        }
        else if (increment == "")
        {
        alert("Please enter the increment value");
        }
        else if (stop == "")
        {
        alert("Please enter the Stop Time");
        }

	else{

		jQuery("#webtronics_netlist_analysis").hide();
        jQuery("#webtronics_disable").hide();
	}

           
});

	
jQuery("#start_volt_selectbox").change(function(){
	
	dc_start_time = jQuery(this).val();
	
	 if (dc_start_time == "1")
	{
	 start_dc_unit = "00";
	}
	else if (dc_start_time == "2")
	{
	 start_dc_unit = "03";
	}
	if (dc_start_time == "3")
	{
	 start_dc_unit = "06";
	}
	else if (dc_start_time == "4")
	{
	 start_dc_unit = "09";
	}
	else if (dc_start_time == "5")
	{
	 start_dc_unit = "12";
	}
	
	//console.log(start_dc_unit);
});	

jQuery("#inc_volt_selectbox").change(function(){
	
	
	dc_increment_time = jQuery(this).val();
	
	 if (dc_increment_time == "1")
	{
	 increment_dc_unit = "00";
	}
	else if (dc_increment_time == "2")
	{
	 increment_dc_unit = "03";
	}
	if (dc_increment_time == "3")
	{
	 increment_dc_unit = "06";
	}
	else if (dc_increment_time == "4")
	{
	 increment_dc_unit = "09";
	}
	else if (dc_increment_time == "5")
	{
	 increment_dc_unit = "12";
	}
	
	//console.log(increment_dc_unit);
});	

jQuery("#stop_volt_selectbox").change(function(){

	
	dc_stop_time = jQuery(this).val();
	
	 if (dc_stop_time == "1")
	{
	 stop_dc_unit = "00";
	}
	else if (dc_stop_time == "2")
	{
	 stop_dc_unit = "03";
	}
	if (dc_stop_time == "3")
	{
	 stop_dc_unit = "06";
	}
	else if (dc_stop_time == "4")
	{
	 stop_dc_unit = "09";
		}
	else if (dc_stop_time == "5")
	{
	 stop_dc_unit = "12";
	}
	
	//console.log(stop_dc_unit);
});	

       

/*------------------------------------------------------------------------------------------------------------------------------------------------
netlist variable for transient
------------------------------------------------------------------------------------------------------------------------------------------------*/
jQuery("#savetransient").click(function(){
	
	start_trans = jQuery("#start_time").val();
	step_trans  = jQuery("#step_time").val();
	stop_trans  = jQuery("#stop_time").val();
	//console.log(start_trans, step_trans, stop_trans);
	console

	if (start_trans == "")
	{
	alert("Please enter Start Time")
	}
	else if (step_trans == "")
	{
	alert("Please enter Step Time");
	}
	else if (stop_trans == "")
	{
	alert("Please enter the Stop Time");  
	}
	else{

		jQuery("#webtronics_netlist_analysis").hide();
        jQuery("#webtronics_disable").hide();
	}

	
});


jQuery("#start_time_selectbox").change(function(){

	trans_start_time = jQuery(this).val();
	
	 if (trans_start_time == "1")
	{
	 start_trans_unit = "03";
	}
	else if (trans_start_time == "2")
	{
	 start_trans_unit = "06";
	}
	if (trans_start_time == "3")
	{
	 start_trans_unit = "09";
	}
	else if (trans_start_time == "4")
	{
	 start_trans_unit = "12";
	}
	
	//console.log(start_trans_unit);
});	

jQuery("#step_time_selectbox").change(function(){

	trans_step_time = jQuery(this).val();
	
	 if (trans_step_time == "1")
	{
	 step_trans_unit = "03";
	}
	else if (trans_step_time == "2")
	{
	 step_trans_unit = "06";
	}
	if (trans_step_time == "3")
	{
	 step_trans_unit = "09";
	}
	else if (trans_step_time == "4")
	{
	 step_trans_unit = "12";
	}
	
	console.log(step_trans_unit);
});	

jQuery("#stop_time_selectbox").change(function(){

	trans_stop_time = jQuery(this).val();
	
	 if (trans_stop_time == "1")
	{
	 stop_trans_unit = "03";
	}
	else if (trans_stop_time == "2")
	{
	 stop_trans_unit = "06";
	}
	if (trans_stop_time == "3")
	{
	 stop_trans_unit = "09";
	}
	else if (trans_stop_time == "4")
	{
	 stop_trans_unit = "12";
	}
	
	console.log(stop_trans_unit);
});	



});



