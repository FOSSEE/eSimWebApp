<?php

if (isset ($_POST["netlist"]))
{
	$netlistval = $_POST["netlist"]; // for ajax
	//$netlistval = "CONTENT"; // without ajax
	$myfile = fopen("netlist.txt", "w") or die("Unable to open file!");
	fwrite($myfile, $netlistval); 
	fclose($myfile);
	
/*	
	
	//echo "file written";



    if ( $netlistval == null ) {
	echo "fail";    
  //      $response['status'] = 'error';
    //    $response['message'] = 'This failed';
    } else if ( $netlistval != null ) 
{	echo "success";
   //     $response['status'] = 'success';
     //   $response['message'] = 'This was successful';
        
        
    } 

  // echo json_encode($response);
  
 */
}
else
{



/*-------------------------------------------------------------------------------------------------------------------------------------------------
FILE DOWNLOAD CODE PHP
-------------------------------------------------------------------------------------------------------------------------------------------------*/
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename('netlist.txt'));
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize('netlist.txt'));
    readfile('/var/www/html/eSIM/netlist.txt');
    exit; 


}




//echo "file download start";

?>
