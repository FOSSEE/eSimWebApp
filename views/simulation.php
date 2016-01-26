<?php

if (isset ($_POST["netlist"]))
{
	$netlistval1 = $_POST["netlist"]; // for ajax
	//$netlistval = "CONTENT"; // without ajax
	$myfile = fopen("netlist.txt", "w") or die("Unable to open file!");
	fwrite($myfile, $netlistval1); 
	fclose($myfile);
	
}

else

{ 

	$output=shell_exec('cd /var/www/html/eSIM/; ngspice  /var/www/html/eSIM/netlist.txt 2>&1' );
	$output=shell_exec('cd /var/www/html/eSIM/;python /var/www/html/eSIM/__main__.py /var/www/html/eSIM/dumpv.txt /var/www/html/eSIM/dumpi.txt 2>&1' );
   // $output1=shell_exec('cd /var/www/html/eSIM/;python /var/www/html/eSIM/__main__.py /var/www/html/eSIM/dump1.txt 2>&1' );
    
    $imagepath = '/eSIM/dumpi/';
    $images = glob('/var/www/html/eSIM/dumpi/*.{jpeg,gif,png}', GLOB_BRACE);//glob($imagesDir . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
    foreach ($images as $value) {
               echo " <img src=".$imagepath.basename($value)."><br> ";
               
    }
    
    $imagepath = '/eSIM/dumpv/';
    $images1 = glob('/var/www/html/eSIM/dumpv/*.{jpeg,gif,png}', GLOB_BRACE);
     foreach ($images1 as $value) {
               echo " <img src=".$imagepath.basename($value)."><br> ";
               
    } 
   
//$images1 = glob('/var/www/html/eSIM/dump1*.{jpeg,gif,png}', GLOB_BRACE);
   // var_dump($images.'-----------'. $images1);die;
   //echo json_encode($images);
   echo "<pre>$output</pre>";
 }

//}
?>
