



str1="";
str2="";
str3="";
str4="";
final_str="";
globalVariable=0; 


var webtronics={
  circuit:null,
  copy:null,
  rightclickmenu:null,
  title:null,
  description:null,
  file_id:null,
  scopestatus:null,
  scopedata:null,

  tabs:[],
  mode:'',

  Vlist:/\s*expression|\s*url|.*script/,
  Alist:/^(x|y|x1|y1|x2|y2|dx|dy|cx|cy|r|width|height|style|transform|d|id|xml:space|class|fill|stroke|text-anchor|visibility|fill-opacity|stroke-linejoin|stroke-linecap|stroke-opacity|stroke-width|xmlns|xmlns:wtx|connects|partvalue|flippable|spice|index|font-size|font-weight|font-style|font-family)$/,
  Elist:/^(path|circle|rect|line|text|g|tspan|svg|wtx:limitswitch|wtx:irev|wtx:rbreak|wtx:inoffset|wtx:gain|wtx:outoffset|wtx:outundef|wtx:ingain|wtx:outgain|wtx:denoffset|wtx:dengain|wtx:numoffset|wtx:numgain|wtx:fraction|wtx:dendomain|wtx:denlowerlimit|wtx:outlowerlimit|wtx:outupperlimit|wtx:limitrange|wtx:upperdelta|wtx:lowerdelta|wtx:indomain|wtx:xarr|wtx:yarr|wtx:amodel|wtx:coff|wtx:con|wtx:roff|wtx:ron|wtx:log|wtx:vbreak|wtx:ibreak|wtx:isat|wtx:nfor|wtx:rsource|wtx:rsink|wtx:ilimitsource|wtx:ilimitsink|wtx:vpwr|wtx:isource|wtx:isink|wtx:routdomain|wtx:inlow|wtx:inhigh|wtx:hyst|wtx:outic|wtx:numcoeff|wtx:dencoeff|wtx:intic|wtx:denormfreq|wtx:riseslope|wtx:fallslope|wtx:outlow|wtx:outhigh|wtx:cntlarr|wtx:freqarr|wtx:duty|wtx:risetime|wtx:falltime|wtx:clktrig|wtx:pwarr|wtx:ptrig|wtx:rdelay|wtx:fdelay|wtx:rmax|wtx:rmin|wtx:rinit|wtx:vt|wtx:alpha|wtx:beta|wtx:eval1|wtx:eval2|wtx:eval3|wtx:eval4|wtx:eval5|wtx:eval6|wtx:pwlval|wtx:pulval1|wtx:pulval2|wtx:pulval3|wtx:pulval4|wtx:pulval5|wtx:pulval6|wtx:pulval7|wtx:amplitude|wtx:phase|wtx:offsetvoltage|wtx:voltageamplitude|wtx:frequency|wtx:delaytime|wtx:dampingfactor|wtx:part|wtx:pins|wtx:analog|wtx:digital|wtx:node|wtx:id|wtx:type|wtx:name|wtx:category|wtx:value|wtx:label|wtx:spice|wtx:risedelay|wtx:inputload|wtx:falldelay|wtx:flip|wtx:model|wtx:measure|metadata|)$/,
  /* .lib files contain spice .model devices .mod devices contain .subckt devices and the id must begin with x*/
  //	serverurls:["http://logical.github.io/webtronix/webtronix_server"],
 	//Added esimStatic fin url for production
  serverurls:["esimStatic/webtronix_server"],
  partslists:[],
  models:{},
  docfromtext:function(txt){
    var xmlDoc;
    if (window.DOMParser){
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(txt,"text/xml");
    }
    else{ // Internet Explorer
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async="false";
      xmlDoc.loadXML(txt);
    } 
    return xmlDoc;
  },
  
  
  setsize:function(){
    var buffer=30;
    var realheight=window.innerHeight-$('webtronics_toolbar').offsetHeight-$('webtronics_footer').offsetHeight;
    var realwidth=window.innerWidth-$('webtronics_side_bar').offsetWidth;
    $('webtronics_center').style.width = window.offsetWidth+'px';
    $('webtronics_center').style.height = realheight-buffer+'px';
    $('webtronics_diagram_area').style.width = realwidth-buffer+'px';
    $('webtronics_diagram_area').style.height = realheight-buffer+'px';
    frames=$$('#webtronics_diagram_area>iframe')
    if(frames[0])frames[0].width = realwidth-buffer+'px';
    $('webtronics_side_bar').style.height=realheight-buffer+'px';
  },
  
  setMode:function(mode, status){

    //$('webtronics_status_bar').innerHTML = 'Mode: '+status;
    $('webtronics_add_text').style.display='none';
    if(mode=='select'){
      if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='block';
    }
    else if(mode=='line'){
      if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='none';
      if(this.circuit.selected){
       this.circuit.unselect();
      }
    }
    else if(mode=='text'){
      if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='none';
    }
    $('webtronics_context_menu').style.display='none';
    this.circuit.mode=mode;
  },

  showdefault:function(){
    webtronics.openProperties();
    this.enablepage();
    $('webtronics_properties_div').style.display = "none";
    var elemnt=document.getElementById("webtronics_properties_ok");
    elemnt.click();
    webtronics.circuit.createvalue(webtronics.circuit.selected[0]);
  },   

  getvalues:function(elem){
    $("webtronics_part_model").options.length=0;
    $("webtronics_part_dir_model").options.length=0;
    $("webtronics_part_model").appendChild(new Element("option",{"value":""}).update("none"));
    $("webtronics_part_dir_model").appendChild(new Element("option",{"value":""}).update("none"));
    var part=netlistcreator.readwtx(elem,"name");
    var cat=netlistcreator.readwtx(elem,"category");
    if(cat && (part != "model")){
      for(var i=0;i<webtronics.partslists.length;i++){
        if(webtronics.partslists[i].parts[cat][part].values!=undefined){
          for(var model in webtronics.partslists[i].parts[cat][part].values){
            console.log("model");
            $("webtronics_part_model").insert(new Element("option",{"value":model}).update(model));
          }
        
          if(JSON.stringify(list).indexOf(part)!=-1){
            $("webtronics_part_help").innerHTML=webtronics.partslists[i].parts[cat][part].help;
          }
        }
      }
    }
  },

  center:function(e){
    e.style.left = ($('webtronics_main_window').offsetWidth/2)-(e.offsetWidth/2)+'px';
    e.style.top = ($('webtronics_main_window').offsetHeight/2)-(e.offsetHeight/2)+'px';
  },

  disablepage:function(){
    $("webtronics_disable").style.display="block";
  },
  enablepage:function(){
    $("webtronics_disable").style.display="none";
  },

  returnchip:function(){
    if($('webtronics_chip_display').getElementsByTagName('g').length){
      this.circuit.getgroup($('webtronics_chip_display').getElementsByTagName('g')[0]);
      netlistcreator.writewtx(this.circuit.selected[0],"id",this.circuit.getnextid(this.circuit.selected[0],0));
      this.circuit.createvalue(this.circuit.selected[0]);
    }
    $('webtronics_chips_box').style.display='none';
    this.setMode('select','Selection');
  },

  openProperties:function(){
    document.forms['webtronics_properties_form'].reset();
    var c=netlistcreator.readwtx(this.circuit.selected[0],"name");
    var type=netlistcreator.readwtx(this.circuit.selected[0],"type");
    var category=netlistcreator.readwtx(this.circuit.selected[0],"category");
    jQuery(".analog").hide();
    jQuery(".digital").hide();
    $("models").style.display='block'
    $("webtronics_outundef").style.display='none'

    $("webtronics_risedelay").style.display='none';
	  $("webtronics_falldelay").style.display='none';
	  $("webtronics_inputload").style.display='none';
    //console.log("Value of C: "+c);
    if(!c){
      netlistcreator.writewtx(this.circuit.selected[0],"name","ic");
    }
    if(c=="ac"){
      this.getvalues(this.circuit.selected[0]);
      $("webtronics_amplitude").style.display='block'
      $("webtronics_phase").style.display='block'

      var amplitude=netlistcreator.readwtx(this.circuit.selected[0],"amplitude");
      var phase=netlistcreator.readwtx(this.circuit.selected[0],"phase");

      if(amplitude!=""){
        $('webtronics_amplitude_value').value=amplitude;
          //jQuery("#webtronics_amplitude_value").val()=amplitude;      
        }

        if(phase!=""){$('webtronics_phase_value').value=phase;}

        $("webtronics_eval1").style.display='none'
        $("webtronics_eval2").style.display='none'
        $("webtronics_eval3").style.display='none'
        $("webtronics_eval4").style.display='none'
        $("webtronics_eval5").style.display='none'
        $("webtronics_eval6").style.display='none'

        $("webtronics_pwlval").style.display='none'
        
        $("webtronics_offsetvoltage").style.display='none'
        $("webtronics_frequency").style.display='none'
        $("webtronics_voltageamplitude").style.display='none'
        $("webtronics_delaytime").style.display='none'
        $("webtronics_dampingfactor").style.display='none'
        $("directive").style.display='none'


        $("webtronics_pulval1").style.display='none'
        $("webtronics_pulval2").style.display='none'
        $("webtronics_pulval3").style.display='none'
        $("webtronics_pulval4").style.display='none'
        $("webtronics_pulval5").style.display='none'
        $("webtronics_pulval6").style.display='none'
        $("webtronics_pulval7").style.display='none'


        $("valuemodel").style.display='none'

        $("webtronics_print_dir_field").style.display='block'
        $("webtronics_print_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'measure');
      }

      else if(c=="sinvoltagesource"){
        $("webtronics_amplitude").style.display='none'
        $("webtronics_phase").style.display='none'
        $("webtronics_eval1").style.display='none'
        $("webtronics_eval2").style.display='none'
        $("webtronics_eval3").style.display='none'
        $("webtronics_eval4").style.display='none'
        $("webtronics_eval5").style.display='none'
        $("webtronics_eval6").style.display='none'

        $("webtronics_offsetvoltage").style.display='block'
        $("webtronics_frequency").style.display='block'
        $("webtronics_voltageamplitude").style.display='block'
        $("webtronics_delaytime").style.display='block'
        $("webtronics_dampingfactor").style.display='block'    
        $("directive").style.display='none'


        $("webtronics_pwlval").style.display='none'
        
        $("webtronics_pulval1").style.display='none'
        $("webtronics_pulval2").style.display='none'
        $("webtronics_pulval3").style.display='none'
        $("webtronics_pulval4").style.display='none'
        $("webtronics_pulval5").style.display='none'
        $("webtronics_pulval6").style.display='none'
        $("webtronics_pulval7").style.display='none'

        var offsetvoltage=netlistcreator.readwtx(this.circuit.selected[0],"offsetvoltage");
        var voltageamplitude=netlistcreator.readwtx(this.circuit.selected[0],"voltageamplitude");
        var frequency=netlistcreator.readwtx(this.circuit.selected[0],"frequency");
        var delaytime=netlistcreator.readwtx(this.circuit.selected[0],"delaytime");
        var dampingfactor=netlistcreator.readwtx(this.circuit.selected[0],"dampingfactor");

        if(offsetvoltage!=""){$('webtronics_offsetvoltage_value').value=offsetvoltage;}
        if(voltageamplitude!=""){$('webtronics_voltageamplitude_value').value=voltageamplitude;}
        if(frequency!=""){$('webtronics_frequency_value').value=frequency;}
        if(delaytime!=""){$('webtronics_delaytime_value').value=delaytime;}
        if(dampingfactor!=""){$('webtronics_dampingfactor_value').value=dampingfactor;}

        $("valuemodel").style.display='none'
      }

      else if(c=="pulse"){
        $("webtronics_amplitude").style.display='none'
        $("webtronics_phase").style.display='none'

        $("webtronics_offsetvoltage").style.display='none'
        $("webtronics_frequency").style.display='none'
        $("webtronics_voltageamplitude").style.display='none'
        $("webtronics_delaytime").style.display='none'
        $("webtronics_dampingfactor").style.display='none'

        $("webtronics_eval1").style.display='none'
        $("webtronics_eval2").style.display='none'
        $("webtronics_eval3").style.display='none'
        $("webtronics_eval4").style.display='none'
        $("webtronics_eval5").style.display='none'
        $("webtronics_eval6").style.display='none'

        $("webtronics_pwlval").style.display='none'
        
        $("webtronics_pulval1").style.display='block'
        $("webtronics_pulval2").style.display='block'
        $("webtronics_pulval3").style.display='block'
        $("webtronics_pulval4").style.display='block'
        $("webtronics_pulval5").style.display='block'
        $("webtronics_pulval6").style.display='block'
        $("webtronics_pulval7").style.display='block'

        $("directive").style.display='none'
        var pulval1=netlistcreator.readwtx(this.circuit.selected[0],"pulval1");
        var pulval2=netlistcreator.readwtx(this.circuit.selected[0],"pulval2");
        var pulval3=netlistcreator.readwtx(this.circuit.selected[0],"pulval3");
        var pulval4=netlistcreator.readwtx(this.circuit.selected[0],"pulval4");
        var pulval5=netlistcreator.readwtx(this.circuit.selected[0],"pulval5");
        var pulval6=netlistcreator.readwtx(this.circuit.selected[0],"pulval6");
        var pulval7=netlistcreator.readwtx(this.circuit.selected[0],"pulval7");         
        if(pulval1!=""){$('webtronics_pulval1_value').value=pulval1;}
        if(pulval2!=""){$('webtronics_pulval2_value').value=pulval2;}
        if(pulval3!=""){$('webtronics_pulval3_value').value=pulval3;}
        if(pulval4!=""){$('webtronics_pulval4_value').value=pulval4;}
        if(pulval5!=""){$('webtronics_pulval5_value').value=pulval5;}
        if(pulval6!=""){$('webtronics_pulval6_value').value=pulval6;}
        if(pulval7!=""){$('webtronics_pulval7_value').value=pulval7;}

        $("valuemodel").style.display='none'
      }

      else if(c=="exponential"){
        $("webtronics_amplitude").style.display='none'
        $("webtronics_phase").style.display='none'

        $("webtronics_offsetvoltage").style.display='none'
        $("webtronics_frequency").style.display='none'
        $("webtronics_voltageamplitude").style.display='none'
        $("webtronics_delaytime").style.display='none'
        $("webtronics_dampingfactor").style.display='none'


        $("webtronics_pulval1").style.display='none'
        $("webtronics_pulval2").style.display='none'
        $("webtronics_pulval3").style.display='none'
        $("webtronics_pulval4").style.display='none'
        $("webtronics_pulval5").style.display='none'
        $("webtronics_pulval6").style.display='none'
        $("webtronics_pulval7").style.display='none'


        $("webtronics_pwlval").style.display='none'
        
        $("webtronics_eval1").style.display='block'
        $("webtronics_eval2").style.display='block'
        $("webtronics_eval3").style.display='block'
        $("webtronics_eval4").style.display='block'
        $("webtronics_eval5").style.display='block'
        $("webtronics_eval6").style.display='block'
       

        $("directive").style.display='none'
        var eval1=netlistcreator.readwtx(this.circuit.selected[0],"eval1");
        var eval2=netlistcreator.readwtx(this.circuit.selected[0],"eval2");
        var eval4=netlistcreator.readwtx(this.circuit.selected[0],"eval4");
        var eval3=netlistcreator.readwtx(this.circuit.selected[0],"eval3");
        var eval5=netlistcreator.readwtx(this.circuit.selected[0],"eval5");
        var eval6=netlistcreator.readwtx(this.circuit.selected[0],"eval6");
       
        if(eval1!=""){$('webtronics_eval1_value').value=eval1;}
        if(eval2!=""){$('webtronics_eval2_value').value=eval2;}
        if(eval3!=""){$('webtronics_eval3_value').value=eval3;}
        if(eval4!=""){$('webtronics_eval4_value').value=eval4;}
        if(eval5!=""){$('webtronics_eval5_value').value=eval5;}
        if(eval6!=""){$('webtronics_eval6_value').value=eval6;}
       
        $("valuemodel").style.display='none'
      }

      else if(c=="pwl"){
        $("webtronics_amplitude").style.display='none'
        $("webtronics_phase").style.display='none'

        $("webtronics_offsetvoltage").style.display='none'
        $("webtronics_frequency").style.display='none'
        $("webtronics_voltageamplitude").style.display='none'
        $("webtronics_delaytime").style.display='none'
        $("webtronics_dampingfactor").style.display='none'

        $("webtronics_eval1").style.display='none'
        $("webtronics_eval2").style.display='none'
        $("webtronics_eval3").style.display='none'
        $("webtronics_eval4").style.display='none'
        $("webtronics_eval5").style.display='none'
        $("webtronics_eval6").style.display='none'

        $("webtronics_pulval1").style.display='none'
        $("webtronics_pulval2").style.display='none'
        $("webtronics_pulval3").style.display='none'
        $("webtronics_pulval4").style.display='none'
        $("webtronics_pulval5").style.display='none'
        $("webtronics_pulval6").style.display='none'
        $("webtronics_pulval7").style.display='none'

        $("webtronics_pwlval").style.display='block'
        
        $("directive").style.display='none'
        var pwlval=netlistcreator.readwtx(this.circuit.selected[0],"pwlval");
        if(pwlval!=""){$('webtronics_pwlval_value').value=pwlval;}
        $("valuemodel").style.display='none'
      }

      else if(c=="scope"){
        this.getvalues(this.circuit.selected[0]);
        $("webtronics_print_dir_field").style.display='block'
        $("webtronics_print_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'measure');
        $("directive").style.display='none'

        $("webtronics_offsetvoltage").style.display='none'
        $("webtronics_frequency").style.display='none'
        $("webtronics_voltageamplitude").style.display='none'
        $("webtronics_delaytime").style.display='none'
        $("webtronics_dampingfactor").style.display='none'

        $("webtronics_eval1").style.display='none'
        $("webtronics_eval2").style.display='none'
        $("webtronics_eval3").style.display='none'
        $("webtronics_eval4").style.display='none'
        $("webtronics_eval5").style.display='none'
        $("webtronics_eval6").style.display='none'
  
        $("webtronics_pwlval").style.display='none'
        
        $("webtronics_pulval1").style.display='none'
        $("webtronics_pulval2").style.display='none'
        $("webtronics_pulval3").style.display='none'
        $("webtronics_pulval4").style.display='none'
        $("webtronics_pulval5").style.display='none'
        $("webtronics_pulval6").style.display='none'
        $("webtronics_pulval7").style.display='none'

        $("webtronics_amplitude").style.display='none'
        $("webtronics_phase").style.display='none'
      }

      else if(category=="digitalmodels"){
        $("models").style.display='none'
        if(c=="dff"){
          $("webtronics_clkdelay").style.display='block'
          $("webtronics_setdelay").style.display='block'
          $("webtronics_resetdelay").style.display='block'
          $("webtronics_ic").style.display='block'
          $("webtronics_dataload").style.display='block'
          $("webtronics_clkload").style.display='block'
          $("webtronics_setload").style.display='block'
          $("webtronics_resetload").style.display='block'
          $("webtronics_risedelay").style.display='block'
          $("webtronics_falldelay").style.display='block'

          var clkdelay = netlistcreator.readwtx(this.circuit.selected[0],"clkdelay");
          if(clkdelay!=""){$(webtronics_clkdelay_value).value=clkdelay;}
          var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
          if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
          var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
          if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
          var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
          if(ic!=""){$(webtronics_ic_value).value=ic;}
          var dataload = netlistcreator.readwtx(this.circuit.selected[0],"dataload");
          if(dataload!=""){$(webtronics_dataload_value).value=dataload;}
          var clkload = netlistcreator.readwtx(this.circuit.selected[0],"clkload");
          if(clkload!=""){$(webtronics_clkload_value).value=clkload;}
          var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
          if(setload!=""){$(webtronics_setload_value).value=setload;}
          var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
          if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
          var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
          if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
          var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
          if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
        }

        if(c=="jkff"){
          $("webtronics_clkdelay").style.display='block'
          $("webtronics_setdelay").style.display='block'
          $("webtronics_resetdelay").style.display='block'
          $("webtronics_ic").style.display='block'
          $("webtronics_jkload").style.display='block'
          $("webtronics_clkload").style.display='block'
          $("webtronics_setload").style.display='block'
          $("webtronics_resetload").style.display='block'
          $("webtronics_risedelay").style.display='block'
          $("webtronics_falldelay").style.display='block'

          var clkdelay = netlistcreator.readwtx(this.circuit.selected[0],"clkdelay");
          if(clkdelay!=""){$(webtronics_clkdelay_value).value=clkdelay;}
          var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
          if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
          var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
          if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
          var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
          if(ic!=""){$(webtronics_ic_value).value=ic;}
          var jkload = netlistcreator.readwtx(this.circuit.selected[0],"jkload");
          if(jkload!=""){$(webtronics_jkload_value).value=jkload;}
          var clkload = netlistcreator.readwtx(this.circuit.selected[0],"clkload");
          if(clkload!=""){$(webtronics_clkload_value).value=clkload;}
          var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
          if(setload!=""){$(webtronics_setload_value).value=setload;}
          var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
          if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
          var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
          if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
          var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
          if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
        }

        if(c=="tff"){
          $("webtronics_clkdelay").style.display='block'
          $("webtronics_setdelay").style.display='block'
          $("webtronics_resetdelay").style.display='block'
          $("webtronics_ic").style.display='block'
          $("webtronics_tload").style.display='block'
          $("webtronics_clkload").style.display='block'
          $("webtronics_setload").style.display='block'
          $("webtronics_resetload").style.display='block'
          $("webtronics_risedelay").style.display='block'
          $("webtronics_falldelay").style.display='block'

          var clkdelay = netlistcreator.readwtx(this.circuit.selected[0],"clkdelay");
          if(clkdelay!=""){$(webtronics_clkdelay_value).value=clkdelay;}
          var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
          if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
          var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
          if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
          var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
          if(ic!=""){$(webtronics_ic_value).value=ic;}
          var tload = netlistcreator.readwtx(this.circuit.selected[0],"tload");
          if(tload!=""){$(webtronics_tload_value).value=tload;}
          var clkload = netlistcreator.readwtx(this.circuit.selected[0],"clkload");
          if(clkload!=""){$(webtronics_clkload_value).value=clkload;}
          var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
          if(setload!=""){$(webtronics_setload_value).value=setload;}
          var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
          if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
          var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
          if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
          var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
          if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
        }

        if(c=="srff"){
          $("webtronics_clkdelay").style.display='block'
          $("webtronics_setdelay").style.display='block'
          $("webtronics_resetdelay").style.display='block'
          $("webtronics_ic").style.display='block'
          $("webtronics_srload").style.display='block'
          $("webtronics_clkload").style.display='block'
          $("webtronics_setload").style.display='block'
          $("webtronics_resetload").style.display='block'
          $("webtronics_risedelay").style.display='block'
          $("webtronics_falldelay").style.display='block'

          var clkdelay = netlistcreator.readwtx(this.circuit.selected[0],"clkdelay");
          if(clkdelay!=""){$(webtronics_clkdelay_value).value=clkdelay;}
          var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
          if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
          var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
          if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
          var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
          if(ic!=""){$(webtronics_ic_value).value=ic;}
          var srload = netlistcreator.readwtx(this.circuit.selected[0],"srload");
          if(srload!=""){$(webtronics_srload_value).value=srload;}
          var clkload = netlistcreator.readwtx(this.circuit.selected[0],"clkload");
          if(clkload!=""){$(webtronics_clkload_value).value=clkload;}
          var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
          if(setload!=""){$(webtronics_setload_value).value=setload;}
          var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
          if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
          var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
          if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
          var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
          if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
      }

      if(c=="dlatch"){
        $("webtronics_datadelay").style.display='block'
        $("webtronics_setdelay").style.display='block'
        $("webtronics_resetdelay").style.display='block'
        $("webtronics_ic").style.display='block'
        $("webtronics_enabledelay").style.display='block'
        $("webtronics_dataload").style.display='block'
        $("webtronics_enableload").style.display='block'
        $("webtronics_setload").style.display='block'
        $("webtronics_resetload").style.display='block'
        $("webtronics_risedelay").style.display='block'
        $("webtronics_falldelay").style.display='block'

        var datadelay = netlistcreator.readwtx(this.circuit.selected[0],"datadelay");
        if(datadelay!=""){$(webtronics_datadelay_value).value=datadelay;}
        var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
        if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
        var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
        if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
        var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
        if(ic!=""){$(webtronics_ic_value).value=ic;}
        var enabledelay = netlistcreator.readwtx(this.circuit.selected[0],"enabledelay");
        if(enabledelay!=""){$(webtronics_enabledelay_value).value=enabledelay;}
        var dataload = netlistcreator.readwtx(this.circuit.selected[0],"dataload");
        if(dataload!=""){$(webtronics_dataload_value).value=dataload;}
        var enableload = netlistcreator.readwtx(this.circuit.selected[0],"enableload");
        if(enableload!=""){$(webtronics_enableload_value).value=enableload;}
        var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
        if(setload!=""){$(webtronics_setload_value).value=setload;}
        var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
        if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
        var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
        if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
        var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
        if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
      }

      if(c=="srlatch"){
        $("webtronics_srdelay").style.display='block'
        $("webtronics_setdelay").style.display='block'
        $("webtronics_resetdelay").style.display='block'
        $("webtronics_ic").style.display='block'
        $("webtronics_enabledelay").style.display='block'
        $("webtronics_srload").style.display='block'
        $("webtronics_enableload").style.display='block'
        $("webtronics_setload").style.display='block'
        $("webtronics_resetload").style.display='block'
        $("webtronics_risedelay").style.display='block'
        $("webtronics_falldelay").style.display='block'

        var srdelay = netlistcreator.readwtx(this.circuit.selected[0],"srdelay");
        if(srdelay!=""){$(webtronics_srdelay_value).value=srdelay;}
        var setdelay = netlistcreator.readwtx(this.circuit.selected[0],"setdelay");
        if(setdelay!=""){$(webtronics_setdelay_value).value=setdelay;}
        var resetdelay = netlistcreator.readwtx(this.circuit.selected[0],"resetdelay");
        if(resetdelay!=""){$(webtronics_resetdelay_value).value=resetdelay;}
        var ic = netlistcreator.readwtx(this.circuit.selected[0],"ic");
        if(ic!=""){$(webtronics_ic_value).value=ic;}
        var enabledelay = netlistcreator.readwtx(this.circuit.selected[0],"enabledelay");
        if(enabledelay!=""){$(webtronics_enabledelay_value).value=enabledelay;}
        var srload = netlistcreator.readwtx(this.circuit.selected[0],"srload");
        if(srload!=""){$(webtronics_srload_value).value=srload;}
        var enableload = netlistcreator.readwtx(this.circuit.selected[0],"enableload");
        if(enableload!=""){$(webtronics_enableload_value).value=enableload;}
        var setload = netlistcreator.readwtx(this.circuit.selected[0],"setload");
        if(setload!=""){$(webtronics_setload_value).value=setload;}
        var resetload = netlistcreator.readwtx(this.circuit.selected[0],"resetload");
        if(resetload!=""){$(webtronics_resetload_value).value=resetload;}
        var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
        if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
        var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
        if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
      }


      if(c=='and'|| c=='not'|| c=='nand'|| c=='or'||c=='nor'||c=='xor'||c=='xnor'){
        $("webtronics_risedelay").style.display='block';
        $("webtronics_falldelay").style.display='block';
        $("webtronics_inputload").style.display='block';
        var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
        if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
        var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
        if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
        var inputload = netlistcreator.readwtx(this.circuit.selected[0],"inputload");
        if(inputload!=""){$(webtronics_inputload_value).value=inputload;}
        
      }
    }

    else if(category=="analogmodels"){
      $("models").style.display='none'
      if(c=="gains"){
        $("webtronics_inoffset").style.display='table-row'
        $("webtronics_gain").style.display='table-row'
        $("webtronics_outoffset").style.display='table-row'  

        var inoffset=netlistcreator.readwtx(this.circuit.selected[0],"inoffset");  
        var gain = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        var outoffset= netlistcreator.readwtx(this.circuit.selected[0],"outoffset");
        if(gain!=""){$(webtronics_gain_value).value=gain;}
        if(inoffset!=""){$(webtronics_inoffset_value).value=inoffset;}
        if(outoffset!=""){$(webtronics_outoffset_value).value=outoffset;}
      }
      if(c=="summer"){
        $("webtronics_inoffset").style.display='table-row'
        $("webtronics_ingain").style.display='table-row'
        $("webtronics_outgain").style.display='table-row'
        $("webtronics_outoffset").style.display='table-row'  

        var inoffset=netlistcreator.readwtx(this.circuit.selected[0],"inoffset");  
        var ingain = netlistcreator.readwtx(this.circuit.selected[0],"ingain");
        var outgain = netlistcreator.readwtx(this.circuit.selected[0],"outgain");
        var outoffset= netlistcreator.readwtx(this.circuit.selected[0],"outoffset");
        if(ingain!=""){$(webtronics_gain_value).value=ingain;}
        if(outgain!=""){$(webtronics_gain_value).value=outgain;}
        if(inoffset!=""){$(webtronics_inoffset_value).value=inoffset;}
        if(outoffset!=""){$(webtronics_outoffset_value).value=outoffset;}
      }
      if(c=="multiplier"){
        $("webtronics_inoffset").style.display='table-row'
        $("webtronics_ingain").style.display='table-row'
        $("webtronics_outgain").style.display='table-row'
        $("webtronics_outoffset").style.display='table-row'  

        var inoffset=netlistcreator.readwtx(this.circuit.selected[0],"inoffset");  
        var ingain = netlistcreator.readwtx(this.circuit.selected[0],"ingain");
        var outgain = netlistcreator.readwtx(this.circuit.selected[0],"outgain");
        var outoffset= netlistcreator.readwtx(this.circuit.selected[0],"outoffset");
        if(ingain!=""){$(webtronics_ingain_value).value=ingain;}
        if(outgain!=""){$(webtronics_outgain_value).value=outgain;}
        if(inoffset!=""){$(webtronics_inoffset_value).value=inoffset;}
        if(outoffset!=""){$(webtronics_outoffset_value).value=outoffset;}
      }
      if(c=="divider"){
        $("webtronics_numoffset").style.display='table-row'
        $("webtronics_numgain").style.display='table-row'
        $("webtronics_outgain").style.display='table-row'
        $("webtronics_outoffset").style.display='table-row'  
        $("webtronics_denoffset").style.display='table-row'
        $("webtronics_dengain").style.display='table-row'
        $("webtronics_fraction").style.display='table-row'
        $("webtronics_dendomain").style.display='table-row'  
        $("webtronics_denlowerlimit").style.display='table-row'  
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"numoffset");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"numgain");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"outgain");
        var prop4= netlistcreator.readwtx(this.circuit.selected[0],"outoffset");
        var prop5= netlistcreator.readwtx(this.circuit.selected[0],"denoffset");
        var prop6= netlistcreator.readwtx(this.circuit.selected[0],"dengain");
        var prop7= netlistcreator.readwtx(this.circuit.selected[0],"fraction");
        var prop8= netlistcreator.readwtx(this.circuit.selected[0],"dendomain");
        var prop9= netlistcreator.readwtx(this.circuit.selected[0],"denlowerlimit");
        if(prop1!=""){$(webtronics_numoffset_value).value=prop1;}
        if(prop2!=""){$(webtronics_numgain_value).value=prop2;}
        if(prop5!=""){$(webtronics_denoffset_value).value=prop5;}
        if(prop6!=""){$(webtronics_dengain_value).value=prop6;}
        if(prop4!=""){$(webtronics_outoffset_value).value=prop4;}
        if(prop3!=""){$(webtronics_outgain_value).value=prop3;}
        if(prop7!=""){$(webtronics_fraction_value).value=prop7;}
        if(prop8!=""){$(webtronics_dendomain_value).value=prop8;}
        if(prop9!=""){$(webtronics_denlowerlimit_value).value=prop9;}
      }
      if(c=="limiter"){
        $("webtronics_limitrange").style.display='table-row'
        $("webtronics_fraction").style.display='table-row'
        $("webtronics_outupperlimit").style.display='table-row'
        $("webtronics_outlowerlimit").style.display='table-row'  
        $("webtronics_gain").style.display='table-row'
        $("webtronics_inoffset").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"limitrange");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"fraction");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"outupperlimit");
        var prop4= netlistcreator.readwtx(this.circuit.selected[0],"outlowerlimit");
        var prop5= netlistcreator.readwtx(this.circuit.selected[0],"gain");
        var prop6= netlistcreator.readwtx(this.circuit.selected[0],"inoffset");
        if(prop1!=""){$(webtronics_limitrange_value).value=prop1;}
        if(prop2!=""){$(webtronics_fraction_value).value=prop2;}
        if(prop3!=""){$(webtronics_outupperlimit_value).value=prop3;}
        if(prop4!=""){$(webtronics_outlowerlimit_value).value=prop4;}
        if(prop5!=""){$(webtronics_gain_value).value=prop5;}
        if(prop6!=""){$(webtronics_inoffset_value).value=prop6;}
      }         
      if(c=="controllimiter"){
        $("webtronics_limitrange").style.display='table-row'
        $("webtronics_fraction").style.display='table-row'
        $("webtronics_upperdelta").style.display='table-row'
        $("webtronics_lowerdelta").style.display='table-row'  
        $("webtronics_gain").style.display='table-row'
        $("webtronics_inoffset").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"limitrange");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"fraction");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"upperdelta");
        var prop4= netlistcreator.readwtx(this.circuit.selected[0],"lowerdelta");
        var prop5= netlistcreator.readwtx(this.circuit.selected[0],"gain");
        var prop6= netlistcreator.readwtx(this.circuit.selected[0],"inoffset");
        if(prop1!=""){$(webtronics_limitrange_value).value=prop1;}
        if(prop2!=""){$(webtronics_fraction_value).value=prop2;}
        if(prop3!=""){$(webtronics_upperdelta_value).value=prop3;}
        if(prop4!=""){$(webtronics_lowerdelta_value).value=prop4;}
        if(prop5!=""){$(webtronics_gain_value).value=prop5;}
        if(prop6!=""){$(webtronics_inoffset_value).value=prop6;}
      }         
      if(c=="pwlcontrolsource"){
        $("webtronics_xarr").style.display='table-row'
        $("webtronics_fraction").style.display='table-row'
        $("webtronics_yarr").style.display='table-row'
        $("webtronics_indomain").style.display='table-row'  
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"xarr");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"fraction");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"yarr");
        var prop4= netlistcreator.readwtx(this.circuit.selected[0],"indomain");
        if(prop1!=""){$(webtronics_xarr_value).value=prop1;}
        if(prop2!=""){$(webtronics_fraction_value).value=prop2;}
        if(prop3!=""){$(webtronics_yarr_value).value=prop3;}
        if(prop4!=""){$(webtronics_indomain_value).value=prop4;}
      }         
      if(c=="multiinputpwlblock"){
        $("webtronics_xarr").style.display='table-row'
        $("webtronics_amodel").style.display='table-row'
        $("webtronics_yarr").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"xarr");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"amodel");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"yarr");
        if(prop1!=""){$(webtronics_xarr_value).value=prop1;}
        if(prop2!=""){$(webtronics_amodel_value).value=prop2;}
        if(prop3!=""){$(webtronics_yarr_value).value=prop3;}
      }      
      if(c=="aswitch"){
        $("webtronics_con").style.display='table-row'
        $("webtronics_coff").style.display='table-row'
        $("webtronics_roff").style.display='table-row'
        $("webtronics_ron").style.display='table-row'
        $("webtronics_log").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"con");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"coff");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"ron");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"roff");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"log");
        if(prop1!=""){$(webtronics_con_value).value=prop1;}
        if(prop2!=""){$(webtronics_coff_value).value=prop2;}
        if(prop3!=""){$(webtronics_ron_value).value=prop3;}
        if(prop4!=""){$(webtronics_roff_value).value=prop4;}
        if(prop5!=""){$(webtronics_log_value).value=prop5;}
      }      
      if(c=="zener"){
        $("webtronics_irev").style.display='table-row'
        $("webtronics_isat").style.display='table-row'
        $("webtronics_vbreak").style.display='table-row'
        $("webtronics_ibreak").style.display='table-row'
        $("webtronics_rbreak").style.display='table-row'
        $("webtronics_limitswitch").style.display='table-row'
        $("webtronics_nfor").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"irev");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"isat");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"vbreak");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"ibreak");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"rbreak");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"limitswitch");
        var prop7 = netlistcreator.readwtx(this.circuit.selected[0],"nfor");
        if(prop1!=""){$(webtronics_irev_value).value=prop1;}
        if(prop2!=""){$(webtronics_isat_value).value=prop2;}
        if(prop3!=""){$(webtronics_vbreak_value).value=prop3;}
        if(prop4!=""){$(webtronics_ibreak_value).value=prop4;}
        if(prop5!=""){$(webtronics_rbreak_value).value=prop5;}
        if(prop6!=""){$(webtronics_limitswitch_value).value=prop6;}
        if(prop7!=""){$(webtronics_nfor_value).value=prop7;}
      }      
      if(c=="currentlimiter"){
        $("webtronics_rsource").style.display='table-row'
        $("webtronics_rsink").style.display='table-row'
        $("webtronics_inoffset").style.display='table-row'
        $("webtronics_gain").style.display='table-row'
        $("webtronics_ilimitsource").style.display='table-row'
        $("webtronics_ilimitsink").style.display='table-row'
        $("webtronics_vpwr").style.display='table-row'
        $("webtronics_isource").style.display='table-row'
        $("webtronics_isink").style.display='table-row'
        $("webtronics_routdomain").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"rsource");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"rsink");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"inoffset");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"ilimitsource");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"ilimitsink");
        var prop7 = netlistcreator.readwtx(this.circuit.selected[0],"vpwr");
        var prop8 = netlistcreator.readwtx(this.circuit.selected[0],"isource");
        var prop9 = netlistcreator.readwtx(this.circuit.selected[0],"isink");
        var prop10 = netlistcreator.readwtx(this.circuit.selected[0],"routdomain");
        if(prop1!=""){$(webtronics_rsource_value).value=prop1;}
        if(prop2!=""){$(webtronics_rsink_value).value=prop2;}
        if(prop3!=""){$(webtronics_inoffset_value).value=prop3;}
        if(prop4!=""){$(webtronics_gain_value).value=prop4;}
        if(prop5!=""){$(webtronics_ilimitsource_value).value=prop5;}
        if(prop6!=""){$(webtronics_ilimitsink_value).value=prop6;}
        if(prop7!=""){$(webtronics_vpwr_value).value=prop7;}
        if(prop8!=""){$(webtronics_isource_value).value=prop8;}
        if(prop9!=""){$(webtronics_isink_value).value=prop9;}
        if(prop10!=""){$(webtronics_routdomain_value).value=prop10;}
      }      
      if(c=="hysteresis"){
        $("webtronics_inlow").style.display='table-row'
        $("webtronics_inhigh").style.display='table-row'
        $("webtronics_outlowerlimit").style.display='table-row'
        $("webtronics_outupperlimit").style.display='table-row'
        $("webtronics_fraction").style.display='table-row'
        $("webtronics_indomain").style.display='table-row'
        $("webtronics_hyst").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"inlow");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"inhigh");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"outlowerlimit");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"outupperlimit");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"fraction");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"indomain");
        var prop7 = netlistcreator.readwtx(this.circuit.selected[0],"hyst");
        if(prop1!=""){$(webtronics_inlow_value).value=prop1;}
        if(prop2!=""){$(webtronics_inhigh_value).value=prop2;}
        if(prop3!=""){$(webtronics_outlowerlimit_value).value=prop3;}
        if(prop4!=""){$(webtronics_outupperlimit_value).value=prop4;}
        if(prop5!=""){$(webtronics_fraction_value).value=prop5;}
        if(prop6!=""){$(webtronics_indomain_value).value=prop6;}
        if(prop7!=""){$(webtronics_hyst_value).value=prop7;}
      }      
      if(c=="differentiator"){
        $("webtronics_outoffset").style.display='table-row'
        $("webtronics_gain").style.display='table-row'
        $("webtronics_outlowerlimit").style.display='table-row'
        $("webtronics_outupperlimit").style.display='table-row'
        $("webtronics_limitrange").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"outoffset");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"outlowerlimit");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"outupperlimit");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"limitrange");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        if(prop1!=""){$(webtronics_outoffset_value).value=prop1;}
        if(prop2!=""){$(webtronics_outlowerlimit_value).value=prop2;}
        if(prop3!=""){$(webtronics_outupperlimit_value).value=prop3;}
        if(prop4!=""){$(webtronics_limitrange_value).value=prop4;}
        if(prop5!=""){$(webtronics_gain_value).value=prop5;}
      }      
      if(c=="integrator"){
        $("webtronics_outoffset").style.display='table-row'
        $("webtronics_gain").style.display='table-row'
        $("webtronics_outlowerlimit").style.display='table-row'
        $("webtronics_outupperlimit").style.display='table-row'
        $("webtronics_limitrange").style.display='table-row'
        $("webtronics_outic").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"outoffset");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"outlowerlimit");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"outupperlimit");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"limitrange");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"outic");
        if(prop1!=""){$(webtronics_outoffset_value).value=prop1;}
        if(prop2!=""){$(webtronics_outlowerlimit_value).value=prop2;}
        if(prop3!=""){$(webtronics_outupperlimit_value).value=prop3;}
        if(prop4!=""){$(webtronics_limitrange_value).value=prop4;}
        if(prop5!=""){$(webtronics_gain_value).value=prop5;}
        if(prop6!=""){$(webtronics_outic_value).value=prop6;}
      }        
      if(c=="sdomain"){
        $("webtronics_gain").style.display='table-row'
        $("webtronics_intic").style.display='table-row'
        $("webtronics_dencoeff").style.display='table-row'
        $("webtronics_numcoeff").style.display='table-row'
        $("webtronics_inoffset").style.display='table-row'
        $("webtronics_denormfreq").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"gain");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"intic");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"dencoeff");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"numcoeff");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"inoffset");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"denormfreq");
        if(prop1!=""){$(webtronics_gain_value).value=prop1;}
        if(prop2!=""){$(webtronics_intic_value).value=prop2;}
        if(prop3!=""){$(webtronics_dencoeff_value).value=prop3;}
        if(prop4!=""){$(webtronics_numcoeff_value).value=prop4;}
        if(prop5!=""){$(webtronics_inoffset_value).value=prop5;}
        if(prop6!=""){$(webtronics_denormfreq_value).value=prop6;}
      }    
      if(c=="slewrateblock"){
        $("webtronics_riseslope").style.display='table-row'
        $("webtronics_fallslope").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"riseslope");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"fallslope");
        if(prop1!=""){$(webtronics_riseslope_value).value=prop1;}
        if(prop2!=""){$(webtronics_fallslope_value).value=prop2;}
      }    
      if(c=="sineoscillator"){
        $("webtronics_outlow").style.display='table-row'
        $("webtronics_outhigh").style.display='table-row'
        $("webtronics_cntlarr").style.display='table-row'
        $("webtronics_freqarr").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"outlow");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"outhigh");
        var prop3=netlistcreator.readwtx(this.circuit.selected[0],"cntlarr");  
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"freqarr");
        if(prop1!=""){$(webtronics_outlow_value).value=prop1;}
        if(prop2!=""){$(webtronics_outhigh_value).value=prop2;}
        if(prop3!=""){$(webtronics_cntlarr_value).value=prop3;}
        if(prop4!=""){$(webtronics_freqarr_value).value=prop4;}
      }    
      if(c=="triangleoscillator"){
        $("webtronics_outlow").style.display='table-row'
        $("webtronics_outhigh").style.display='table-row'
        $("webtronics_cntlarr").style.display='table-row'
        $("webtronics_freqarr").style.display='table-row'
        $("webtronics_duty").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"outlow");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"outhigh");
        var prop3=netlistcreator.readwtx(this.circuit.selected[0],"cntlarr");  
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"freqarr");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"duty");
        if(prop1!=""){$(webtronics_outlow_value).value=prop1;}
        if(prop2!=""){$(webtronics_outhigh_value).value=prop2;}
        if(prop3!=""){$(webtronics_cntlarr_value).value=prop3;}
        if(prop4!=""){$(webtronics_freqarr_value).value=prop4;}
        if(prop5!=""){$(webtronics_duty_value).value=prop5;}
      }    
      if(c=="squareoscillator"){
        $("webtronics_outlow").style.display='table-row'
        $("webtronics_outhigh").style.display='table-row'
        $("webtronics_cntlarr").style.display='table-row'
        $("webtronics_freqarr").style.display='table-row'
        $("webtronics_duty").style.display='table-row'
        $("webtronics_falltime").style.display='table-row'
        $("webtronics_risetime").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"outlow");  
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"outhigh");
        var prop3=netlistcreator.readwtx(this.circuit.selected[0],"cntlarr");  
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"freqarr");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"duty");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"risetime");
        var prop7 = netlistcreator.readwtx(this.circuit.selected[0],"falltime");
        if(prop1!=""){$(webtronics_outlow_value).value=prop1;}
        if(prop2!=""){$(webtronics_outhigh_value).value=prop2;}
        if(prop3!=""){$(webtronics_cntlarr_value).value=prop3;}
        if(prop4!=""){$(webtronics_freqarr_value).value=prop4;}
        if(prop5!=""){$(webtronics_duty_value).value=prop5;}
        if(prop6!=""){$(webtronics_risetime_value).value=prop6;}
        if(prop7!=""){$(webtronics_falltime_value).value=prop7;}
      }    
      if(c=="capacitancemeter"){
        $("webtronics_gain").style.display='table-row'
        var prop1 = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        if(prop1!=""){$(webtronics_gain_value).value=prop1;}
      }
      if(c=="inductancemeter"){
        $("webtronics_gain").style.display='table-row'
        var prop1 = netlistcreator.readwtx(this.circuit.selected[0],"gain");
        if(prop1!=""){$(webtronics_gain_value).value=prop1;}
      }
      if(c=="oneshot"){
        $("webtronics_cntlarr").style.display='table-row'
        $("webtronics_pwarr").style.display='table-row'
        $("webtronics_clktrig").style.display='table-row'
        $("webtronics_ptrig").style.display='table-row'
        $("webtronics_outlow").style.display='table-row'
        $("webtronics_outhigh").style.display='table-row'
        $("webtronics_rdelay").style.display='table-row'
        $("webtronics_fdelay").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"cntlarr"); 
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"pwarr");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"clktrig");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"ptrig");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"outlow");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"outhigh");
        var prop7 = netlistcreator.readwtx(this.circuit.selected[0],"rdelay");
        var prop8 = netlistcreator.readwtx(this.circuit.selected[0],"fdelay");
        if(prop1!=""){$(webtronics_cntlarr_value).value=prop1;}
        if(prop2!=""){$(webtronics_pwarr_value).value=prop2;}
        if(prop3!=""){$(webtronics_clktrig_value).value=prop3;}
        if(prop4!=""){$(webtronics_ptrig_value).value=prop4;}
        if(prop5!=""){$(webtronics_outlow_value).value=prop5;}
        if(prop6!=""){$(webtronics_outhigh_value).value=prop6;}
        if(prop7!=""){$(webtronics_rdelay_value).value=prop7;}
        if(prop8!=""){$(webtronics_fdelay_value).value=prop8;}
       
      }

      if(c=="memristor"){
        $("webtronics_rmin").style.display='table-row'
        $("webtronics_rmax").style.display='table-row'
        $("webtronics_rinit").style.display='table-row'
        $("webtronics_vt").style.display='table-row'
        $("webtronics_alpha").style.display='table-row'
        $("webtronics_beta").style.display='table-row'
        var prop1=netlistcreator.readwtx(this.circuit.selected[0],"rmin"); 
        var prop2 = netlistcreator.readwtx(this.circuit.selected[0],"rmax");
        var prop3 = netlistcreator.readwtx(this.circuit.selected[0],"rinit");
        var prop4 = netlistcreator.readwtx(this.circuit.selected[0],"vt");
        var prop5 = netlistcreator.readwtx(this.circuit.selected[0],"alpha");
        var prop6 = netlistcreator.readwtx(this.circuit.selected[0],"beta");
        if(prop1!=""){$(webtronics_rmin_value).value=prop1;}
        if(prop2!=""){$(webtronics_rmax_value).value=prop2;}
        if(prop3!=""){$(webtronics_rinit_value).value=prop3;}
        if(prop4!=""){$(webtronics_vt_value).value=prop4;}
        if(prop5!=""){$(webtronics_alpha_value).value=prop5;}
        if(prop6!=""){$(webtronics_beta_value).value=prop6;}
      }   
    }
    else {
      this.getvalues(this.circuit.selected[0]);
      $("directive").style.display='none'

      $("webtronics_offsetvoltage").style.display='none'
      $("webtronics_frequency").style.display='none'
      $("webtronics_voltageamplitude").style.display='none'
      $("webtronics_delaytime").style.display='none'
      $("webtronics_dampingfactor").style.display='none'
      $("valuemodel").style.display='block'

      $("webtronics_amplitude").style.display='none'
      $("webtronics_phase").style.display='none'


      $("webtronics_eval1").style.display='none'
      $("webtronics_eval2").style.display='none'
      $("webtronics_eval3").style.display='none'
      $("webtronics_eval4").style.display='none'
      $("webtronics_eval5").style.display='none'
      $("webtronics_eval6").style.display='none'


      $("webtronics_pwlval").style.display='none'
      
      $("webtronics_pulval1").style.display='none'
      $("webtronics_pulval2").style.display='none'
      $("webtronics_pulval3").style.display='none'
      $("webtronics_pulval4").style.display='none'
      $("webtronics_pulval5").style.display='none'
      $("webtronics_pulval6").style.display='none'
      $("webtronics_pulval7").style.display='none'
      
      var value=netlistcreator.readwtx(this.circuit.selected[0],"value");
      if(value!=""){$('webtronics_part_value').value=value;}

      if(c=="dac_bridge"){
        $("webtronics_outlow").style.display='table-row'
        $("webtronics_outhigh").style.display='table-row'
        $("webtronics_outundef").style.display='table-row'
        $("webtronics_inputload").style.display='block';
        $("webtronics_falltime").style.display='table-row'
        $("webtronics_risetime").style.display='table-row'
        $("valuemodel").style.display='none'
        var outlow = netlistcreator.readwtx(this.circuit.selected[0],"outlow");
        if(outlow!=""){$(webtronics_outlow_value).value=outlow;}
        var outhigh = netlistcreator.readwtx(this.circuit.selected[0],"outhigh");
        if(outhigh!=""){$(webtronics_outhigh_value).value=outhigh;}
        var outundef = netlistcreator.readwtx(this.circuit.selected[0],"outundef");
        if(outundef!=""){$(webtronics_outundef_value).value=outundef;}
        var inputload = netlistcreator.readwtx(this.circuit.selected[0],"inputload");
        if(inputload!=""){$(webtronics_inputload_value).value=inputload;}
        var risetime = netlistcreator.readwtx(this.circuit.selected[0],"risetime");
        if(risetime!=""){$(webtronics_risetime_value).value=risetime;}
        var falltime = netlistcreator.readwtx(this.circuit.selected[0],"falltime");
        if(falltime!=""){$(webtronics_falltime_value).value=falltime;}
        
      }

      if(c=="adc_bridge"){
        $("webtronics_outundef").style.display='none'
        $("webtronics_inlow").style.display='table-row'
        $("webtronics_inhigh").style.display='table-row'
        $("webtronics_risedelay").style.display='block';
        $("webtronics_falldelay").style.display='block';
        $("valuemodel").style.display='none'
        var inlow = netlistcreator.readwtx(this.circuit.selected[0],"inlow");
        if(inlow!=""){$(webtronics_inlow_value).value=inlow;}
        var inhigh = netlistcreator.readwtx(this.circuit.selected[0],"inhigh");
        if(inhigh!=""){$(webtronics_inhigh_value).value=inhigh;}
        var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
        if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
        var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
        if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
      }

      if(c=="cdo"){
        $("webtronics_cntlarr").style.display='table-row'
        $("webtronics_freqarr").style.display='table-row'
        $("webtronics_duty").style.display='table-row'
        $("webtronics_phase").style.display='table-row'
        $("webtronics_risedelay").style.display='block';
        $("webtronics_falldelay").style.display='block';
        $("valuemodel").style.display='none';
        $("webtronics_outundef").style.display='none'

        var cntlarr = netlistcreator.readwtx(this.circuit.selected[0],"cntlarr");
        if(cntlarr!=""){$(webtronics_cntlarr_value).value=cntlarr;}
        var freqarr = netlistcreator.readwtx(this.circuit.selected[0],"freqarr");
        if(freqarr!=""){$(webtronics_freqarr_value).value=freqarr;}
        var duty = netlistcreator.readwtx(this.circuit.selected[0],"duty");
        if(duty!=""){$(webtronics_duty_value).value=duty;}
        var phase = netlistcreator.readwtx(this.circuit.selected[0],"phase");
        if(phase!=""){$(webtronics_phase_value).value=phase;}
        var risedelay = netlistcreator.readwtx(this.circuit.selected[0],"risedelay");
        if(risedelay!=""){$(webtronics_risedelay_value).value=risedelay;}
        var falldelay = netlistcreator.readwtx(this.circuit.selected[0],"falldelay");
        if(falldelay!=""){$(webtronics_falldelay_value).value=falldelay;}
      }   
    }

    if(category=="mosfets"||category=="transistors"){
      $("directive").style.display='block';
    }
    if(c=="diode")$("directive").style.display='block'
    var id=netlistcreator.readwtx(this.circuit.selected[0],"id");
    if(type=="x")$("directive").style.display='block';
    if(id!=""){$('webtronics_part_id').value=id;}
    $("webtronics_part_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'model');
    
    if(!netlistcreator.readwtx(webtronics.circuit.selected[0],"value")){
      $('webtronics_part_id').value=this.circuit.getnextid(this.circuit.selected[0],0);
    }

    this.disablepage();
    $('webtronics_properties_div').style.display = "block";

  },

  sanitize:function(xmldoc){
    var elems=xmldoc.getElementsByTagName('*');
    for(var i=0;i<elems.length;i++){
      if(!elems[i].tagName.match(this.Elist))return elems[i].tagName;
      var attr=elems[i].attributes;
      for(var j=0;j<attr.length;j++){
        if(!attr[j].name.match(this.Alist))return attr[j].name;
        if(attr[j].value.match(this.Vlist))return attr[j].value;
      } 
    }
  },

  createfilemenu:function(x,y,id,parent,list){
    var menu=document.createElement('div');
    menu.id=id;
    menu.className='webtronics_menu';
    menu.style.left=x+'px';
    menu.style.top=y+'px';
    for(var i=0;i<list.length;i++){
      var item=new Element('a',{Title:list[i].label,id:'webtronics_context_option',class:'enabled'})
      .observe('click',list[i].cb.bind(this))
      .observe('contextmenu', Event.stop)
      .update(list[i].label);
      menu.insert(item);
      menu.insert(new Element('br'));
    }
    menu.observe('click',Event.stop)
    .observe('contextmenu',Event.stop);
    menu.style.display='none';
    return menu;			

  },

  file_open:function(){
    var file=new Element('input',{'type':'file'});
    var div=new Element('div',{'class':'modal'}).insert(file);
    Event.observe(file,'change',function(){
      if(window.FileReader){
        var textReader = new FileReader();
        textReader.onloadend=function(){
          if(!textReader.result){
            console.log("error opening file");
            return;
          };

          var xmlDoc=this.docfromtext(textReader.result);
          if(!xmlDoc){alert("error parsing svg");}
          else{
            var result=this.sanitize(xmlDoc)
            if(result){console.log(result+ ' found');alert('unclean file');return;}
            var node=xmlDoc.getElementsByTagName('svg')[0];
            if(!node){alert("svg node not found")}
            else this.circuit.getfile(node);
          }
        
        }.bind(this);
        textReader.readAsText(file.files[0]);
        $('webtronics_main_window').removeChild(div);
      }
    }.bind(this));
    $('webtronics_main_window').insert(div);
    div.style.display='block';
    file.focus();
    file.click();
    $('webtronics_file_menu').style.display='none';
    div.style.display='none';

  },

  download:function(filename, data) {
    var pom = document.createElement('a');
    pom.setAttribute('href', data);
    pom.setAttribute('download', filename);
    document.body.appendChild(pom);
    pom.click();
    pom.parentNode.removeChild(pom);
  },

  saveuri:function(){
    var string="<?xml version='1.0' ?>\n";
    string+="<!--Created by webtronics 0.1-->\n";
    var doc=this.circuit.getDoc(true,false);
    string += (new XMLSerializer()).serializeToString(doc);
    this.download("webtronix.svg","data:application/octet-stream;charset=utf-8;base64," + encode64(string));

    $('webtronics_file_menu').style.display='none';

  },

  file_new:function(){
    $('webtronics_file_menu').style.display='none';
    //this.setMode('webtronics_select','select','Selection');
    input_box=confirm("Click OK to Clear the Drawing.");
    if (input_box==true){
      $('webtronics_diagram_area').removeChild($("webtronics_display_frame"));
      var frame=new Element('iframe',{id:'webtronics_display_frame',src:'/esimStatic/canvas/canvas.html'});
      $('webtronics_diagram_area').insert(frame);
      Event.observe(frame,'load',function(){
        var filename='Schematic.svg';
        this.attachframe(filename,frame);
      }.bind(this));
      
      $("webtronics_showhelp").checked=false;
      $$(".webtronics_help").forEach(function(e){
        e.style.display="none";
      });
        
      $("webtronics_invert").checked=false;
      $("webtronics_graph").checked=false;
      $("webtronics_connections").checked=false;

    }
  },
  
  attachframe:function(filename,frame){
    this.circuit=frame.contentWindow.circuit;
    this.setMode('select', 'Selection');    
    //            this.circuit.mode=this.mode;
    
    /*attach the menu*/
    Event.observe(this.circuit.container,'contextmenu',function(e){
      $('webtronics_context_menu').style.top=Event.pointerY(e)+'px';                        
      $('webtronics_context_menu').style.left=Event.pointerX(e)+'px';                        
      if(this.circuit.mode =="select")$('webtronics_context_menu').style.display='block';                        
      if(this.circuit.selected.length===1&& this.circuit.selected[0].tagName==='g'){
        $$('div#webtronics_context_menu [title=Properties]')[0].className='enabled';
      }
      else {
        $$('div#webtronics_context_menu [title=Properties]')[0].className='disabled';
      }
     Event.stop(e);
    }.bind(this));
    
    Event.observe(this.circuit.container,'click',function(e){
      if(Event.isLeftClick(e)){                
        if($('webtronics_context_menu')){
          $('webtronics_context_menu').style.display='none';
        }
      }
    }.bind(this));
    
    Event.observe(this.circuit.container,'keydown',function(e){
      if(e.keyCode == 46) {
        // alert('Delete Key Pressed');
        webtronics.circuit.clearinfo();
        webtronics.circuit.addhistory();
        webtronics.circuit.deleteSelection();
      }

    }.bind(this));

  },
  
  formatnetlist:function(spice1,spice2){
    var html=new Element('textarea');
    html.id="webtronics_netlist_text_area";
    html.cols=40;
    html.rows=15;
    html.value=spice1;
    return html;            
  },

  spicenetlist:"",
  gnucapjs:function(netlist){
    webtronics.spicenetlist=netlist;
    /*add a new frame */
    $('webtronics_scope_display_div').innerHTML='';
    $("webtronics_scope_output_graph").checked=true;
    $("webtronics_scope_status").innerHTML="DOWNLOADING GNUCAP";

    var frame=new Element('iframe',{id:'webtronics_scope_display_frame',src:'gnucapjs/gnucap.html',width:"100%",height:"100%"});
    $('webtronics_scope_display_div').insert(frame);
    $("webtronics_scope_display").style.display="block"
  },

  /*
   *         postspice:function(spice){
   *            var text;
   *			new Ajax.Request("spice.php",{
   *			method:'post',
   *			contentType:"text/plain",
   *			asynchronous:true,
   *			postBody:spice,
   *			onSuccess:function(transport){
   *                if($("webtronics_scope_display_image"))$("webtronics_scope_display_image").parentNode.removeChild($("webtronics_scope_display_image"));
   *                var content;
   *                if(transport.responseText.match("data:image/png;base64,")){                
   *                    var content=new Element("img",{"src":transport.responseText,"width":400,"height":400,"id":"webtronics_scope_display_image"});
}
else{
  var content=new Element("textarea",{"width":400,"height":400,"id":"webtronics_scope_display_image"}).update(transport.responseText);
}            
if(content){
  $("webtronics_scope_display").style.display="block";
  $("webtronics_scope_display_div").insert(content);
}
},			
onFailure: function(){ 
console.log('Could not retrieve file...'); 
},
onException: function(req,exception) {
console.log(exception);
} 
});

},
*/
  savepng:function(){
  /*   
    if(navigator.appName == 'Microsoft Internet Explorer'){
      $('webtronics_image_div').innerHTML="<img id='webtronics_image_save' >";
    }
    */
    if(this.circuit.drawing.getAttribute('class')==="inv"){
      var doc=this.circuit.getDoc(true,true);
    }
    else{
      var doc=this.circuit.getDoc(true,false);
    }
    var svgsize=this.circuit.svgSize();
    var canvas=new Element('canvas',{'id':'webtronics_canvas','width':svgsize.width-svgsize.x+20+'px','height':svgsize.height-svgsize.y+20+'px',style:"display:none"});
    document.body.insert(canvas);
    var ctx=$("webtronics_canvas").getContext("2d");

    ctx.drawSvg(doc, 0, 0, svgsize.width-svgsize.x+20,svgsize.height-svgsize.y+20);    
    var url= canvas.toDataURL("application/octet-stream");
    this.download("webtronix.png",url);
    canvas.parentNode.removeChild(canvas);		
  },
  
  addpart:function(url,cat,partname) {
    var listfile=function(partsvg){
      var part=new Element("div",{"id":"webtronics_"+partname,"class":"webtronics_menu_part",'style':"display:none",'title':partname})
      .update(partsvg);
      $("webtronics_"+cat).insert(part);
      Event.observe(part,'mousedown',function(e){
        var group=$$( "#"+ part.id+" g" )[0];
        webtronics.circuit.getgroup(group);
        webtronics.setMode('select','Selection');
        webtronics.showdefault();
      });
      
      Event.observe(part,'mouseup',function(e){
       webtronics.circuit.deleteSelection();				
      });
    }

    if(url.indexOf("http://")==-1){
      openfile(url+'/'+cat+'/'+partname+'.svg',listfile);
    }
    else{
      new request(url,cat+"/"+partname+'.svg',listfile);
    }

  },


  //this takes an objectand returns a menu element
  makemenu:function(url, partlist,menu){
    for (var cat in partlist.parts){
      if(!$("webtronics_"+cat)){
        var category=new Element("div",{"id":"webtronics_"+cat})
          .insert(new Element("p").update(cat)
            .observe('click',function(e){

              var menuitems=$$('#'+menu.id+'>div>div');

              for(var i=0;i<menuitems.length;i++){
                if(menuitems[i].parentNode==Event.element(e).parentNode){
                  if(menuitems[i].style.display=='none'){
                    menuitems[i].style.display='block';
                  }
                  else{
                    menuitems[i].style.display='none';
                  }
                }
                else{
                  menuitems[i].style.display='none';
                }
              }
          }));
      
        menu.insertBefore(category,menu.firstChild);

        for(var partname in partlist.parts[cat]){
          if(!$("webtronics_"+partname)){
            webtronics.addpart(url , cat,partname);
          }
							//if(partlist.parts[cat][partname].indexOf()<0){}
        }                

      }

    }
  },
      
  populatemenu:function(){
    /*asynchronous part loading */
    $("webtronics_parts_list").innerHTML="";
    webtronics.serverurls.each(function(url){
      if(url=="webtronix_server"){
        // url = "esimStatic/"+url
        console.log("IF----->"+url)
        openfile(url+"/parts.json",function(text){
          webtronics.partslists.push(text.evalJSON(true));
          webtronics.partslists[webtronics.partslists.length-1].url=url;
          webtronics.makemenu(url,webtronics.partslists[webtronics.partslists.length-1] , $("webtronics_parts_list"));
        });
      }
      else{
        console.log("ELSE----->"+url)
        // url = "esimStatic/"+url
        new request(url,"parts.json",function(text){
          webtronics.partslists.push(text.evalJSON(true));
          webtronics.partslists[webtronics.partslists.length-1].url=url;
          webtronics.makemenu(url,webtronics.partslists[webtronics.partslists.length-1] , $("webtronics_parts_list"));
        });
      }
    }.bind(this));
  },

  opensources:function(){
    var sources=$$(".webtronics_add_source_input");
    for( var i=0;i<sources.length;i++){
      if(webtronics.serverurls[i])sources[i].value=webtronics.serverurls[i];
      else sources[i].value="";
    }
    $("webtronics_add source").style.display="block";
    this.center($("webtronics_add source"));
    this.disablepage();
  },

  /*all events are loaded here*/
  init:function(){
    Event.observe(window, 'load', function(){
      if (!window.console) {
        window.console = {};
        window.console.log = function(){};
      }

      webtronics.setsize();
      //	    $('webtronics_scope_display_iframe').src="";
      var menu;
      $("webtronics_showhelp").checked=false;
      $("webtronics_invert").checked=false;
      $("webtronics_graph").checked=false;
      $("webtronics_connections").checked=false;
      
      menu=this.createfilemenu($('webtronics_file').offsetLeft,
        $('webtronics_file').offsetTop+$('webtronics_file').offsetHeight,
        'webtronics_file_menu',
        $('webtronics_main_window'),
        [{label:'sources',cb:webtronics.opensources},
        {label:'import',cb:webtronics.file_open},
        {label:'save',cb:webtronics.saveuri},
        {label:'kicad',cb:wtx2kicad},
        {label:'save-png',cb:webtronics.savepng},
        {label:'new',cb:webtronics.file_new}]);
      
      menu.observe('mouseout',function(e){
        if((e.relatedTarget!=null)&&!((e.relatedTarget == menu) || e.relatedTarget.descendantOf(menu))){
          //                if(!(e.relatedTarget == menu) ){
          menu.style.display='none';
        }
      });    
      
      $("webtronics_main_window").insertBefore(menu,$("webtronics_disable"));
      
      
      /*replace context menu*/
      var myLinks = [
        {label:'copy',cb:function(){
          webtronics.copy=webtronics.circuit.copy();
          $('webtronics_context_menu').style.display='none';
        }},
        {label:'paste',cb:function(){
          webtronics.circuit.paste(webtronics.copy);
          $('webtronics_context_menu').style.display='none';
        }},

        {label:'delete',cb:function(){
          webtronics.circuit.deleteSelection();
          $('webtronics_context_menu').style.display='none';
        }},

        {label:'Properties',cb:function(){
          webtronics.openProperties()
          webtronics.center($('webtronics_properties_div'));
          document.forms['webtronics_properties_form'].focus();
          $('webtronics_context_menu').style.display='none';
        }}];
        
      var contextmenu=this.createfilemenu(0,
        0,
        'webtronics_context_menu',
        $('webtronics_diagram_area'),
        myLinks);

      $("webtronics_diagram_area").insert(contextmenu);
      /*add a new frame */
      var frame=new Element('iframe',{id:'webtronics_display_frame',src:'/esimStatic/canvas/canvas.html'});
      $('webtronics_diagram_area').insert(frame);

      Event.observe(frame,'load',function(){
        var filename='Schematic.svg';
        this.attachframe(filename,frame);
      }.bind(this));

      Event.observe(window, 'resize', function() {
        webtronics.setsize();
        webtronics.circuit.addtools();	
      });

      $('webtronics_toolbar').onselectstart = function() {return false;} 

      $('webtronics_diagram_area').onselectstart = function() {return false;} 
      $('webtronics_side_bar').onselectstart = function() {return false;} 


      //populate default menu

      webtronics.populatemenu();



      /*chipmaker*/
      $("webtronics_hor_pins").insert(Element("option",{"value":0}).update(0));
      for(var i=1;i<50;i++){
        if(i>3){
          $("webtronics_hor_pins").insert(Element("option",{"value":i}).update(i*2));
        }
        $("webtronics_vert_pins").insert(Element("option",{"value":i}).update(i*2));

      }

      /*menu events*/		

      Event.observe($('webtronics_file'), 'click', function() {
        if($('webtronics_file_menu').style.display=='block'){
          $('webtronics_file_menu').style.display='none';
        }            
        else {
          $('webtronics_file_menu').style.display='block';
        }                
      });
      Event.observe($('webtronics_chips_open'), 'click', function() {
        webtronics.circuit.clearinfo();
        webtronics.setMode('select','Selection');
        chipmaker.openmaker();
        $('webtronics_chips_box').style.display = "block";
        webtronics.center($('webtronics_chips_box'));
        webtronics.disablepage();
      });


      Event.observe($('webtronics_netlist_simulate'), 'click', function() {
        $('webtronics_plot_box').style.display = "block";
        $('plot_details').style.display = "block";
        $('abscissa_value').value = "";
        $('ordinate_value').value = "";
       // $('webtronics_graph_display').style.display = "none";
        webtronics.center($('webtronics_plot_box'));
        webtronics.disablepage();
      });



      if($("webtronics_select"))Event.observe($('webtronics_select'), 'click', function() {
        webtronics.circuit.clearinfo();
        webtronics.setMode('select', 'Selection');
      });
  
      if($("webtronics_wire"))Event.observe($('webtronics_wire'), 'click', function() {
        webtronics.circuit.clearinfo();
        webtronics.setMode('line','Wire');
      });
    
      Event.observe($('webtronics_text'), 'click', function() {
        webtronics.circuit.clearinfo();
        if($('webtronics_text').className=='pressed_button'){
          $('webtronics_text').className = 'normal_button';
          webtronics.setMode('select', 'Selection');
        }
        else {
          $('webtronics_text').className = 'pressed_button';
          webtronics.setMode('text', 'Text');
        }

      });
      if($('webtronics_undo')){
        Event.observe($('webtronics_undo'),'click',function(){
          webtronics.circuit.undo();

        });
      }
      if($('webtronics_redo')){
        Event.observe($('webtronics_redo'),'click',function(){
          webtronics.circuit.redo();
        });
      }

      Event.observe($('webtronics_delete'), 'click', function() {
        webtronics.circuit.clearinfo();
        webtronics.circuit.addhistory();
        webtronics.circuit.deleteSelection();
      });

      Event.observe($(document), 'keydown', function(e) {
      if(e.keyCode == 46) {  
        webtronics.circuit.clearinfo();
        webtronics.circuit.addhistory();
        webtronics.circuit.deleteSelection();
          }
      });

/*
		  if($('webtronics_save')){
 		    Event.observe($('webtronics_save'), 'click', function() {
		      webtronics.circuit.clearinfo();
		      webtronics.showMarkup();
		    });
		  }
      */

      flag1=0;

      saved_analysis_type=3;

      jQuery("#analysis_selectbox").change(function(){

        analysis_type = jQuery(this).val();
        saved_analysis_type=analysis_type;
      });
      analysis_type=saved_analysis_type;




      if($('webtronics_netlist')){
        Event.observe($('webtronics_netlist'), 'click', function() {
          if(flag1!=0){
            netlistcreator.createnetlist(function(netlist){
            var content=$$("#webtronics_netlist_text_div > *") 
            for(var i=0;i<content.length;i++){
              $("webtronics_netlist_text_div").removeChild(content[i]);
            }
            $("webtronics_netlist_text_div").insert(webtronics.formatnetlist(netlist,null));
            $("webtronics_netlist_text").style.display='block';
            globalVariable=1;
            webtronics.center($('webtronics_netlist_text_div'));
            webtronics.disablepage();});

            jQuery('#webtronics_netlist_buttons').show();
            jQuery('#webtronics_netlist_text').show();
            jQuery('#webtronics_netlist_text_div').show();

            change_val = "0";
            Flag = "";
            //console.log("out")

            if (change_val == "0"){
              Flag = jQuery("#webtronics_netlist_text_area").val();
    
              jQuery("#webtronics_netlist_text_area").val("");
              /*------------------------------------------------------------------------------------------------------------------------------------- 
               Here are the conditions concatenated to give final netlist values for dc all cases  
               ---------------------------------------------------------------------------------------------------------------------------------------------*/ 
              if (analysis_type == "1") 
              { 

               	str1='\n'+ ".dc" + " " + source + " " + start + "e" + "-" + start_dc_unit + " " +  stop + "e" + "-" + stop_dc_unit + " " + increment + "e" + "-" + increment_dc_unit + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+ ".end \n";
                jQuery("#webtronics_netlist_text_area").val(Flag + str1 );
                	final_str=str1;
                change_val = "1";
                //console.log(jQuery("#analysis_selectbox").val());
              }


              /*------------------------------------------------------------------------------------------------------------------------------------------------
              Here are the all AC Cases for generating final netlist values
              ------------------------------------------------------------------------------------------------------------------------------------------------*/
              else if (analysis_type == "2")
              {	
                 str2='\n'+ ".ac" + " " + scale_val + " " + noofpoint + " " + startfreq + start_ac_unit + " " + stopfreq + stop_ac_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+  ".end \n" ;

                jQuery("#webtronics_netlist_text_area").val(Flag +str2 );
                final_str=str2;
                change_val = "1";
                    //console.log(jQuery("#webtronics_netlist_text_area").val());
                  console.log("from 00");
              } 
              /*------------------------------------------------------------------------------------------------------------------------------------------------
              Here are the all Transiet Cases for generating final netlist values
              ------------------------------------------------------------------------------------------------------------------------------------------------*/
                //else if (analysis_type == "3" && time == "1")
              else if (analysis_type== "3")
              {
              	str3='\n' + ".tran" + " " + step_trans + "e" + "-" + step_trans_unit + " " + stop_trans + "e"+ "-" + stop_trans_unit + " " + start_trans + "e" + "-" + start_trans_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n" +".end \n";
                jQuery("#webtronics_netlist_text_area").val(Flag + str3 ); 
                final_str=str3;
                change_val = "1";


              }

              else if (analysis_type == "4") 
              { 

                str4='\n'+ ".dc" + " " + source1 + " " + start1 + "e" + "-" + start_dc_unit1 + " " +  stop1 + "e" + "-" + stop_dc_unit1 + " " + increment1 + "e" + "-" + increment_dc_unit1 + " " + source2 + " " + start2 + "e" + "-" + start_dc_unit2 + " " +  stop2 + "e" + "-" + stop_dc_unit2 + " " + increment2 + "e" + "-" + increment_dc_unit2 + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+ ".end \n";
                jQuery("#webtronics_netlist_text_area").val(Flag + str4 );
                final_str=str4;
                change_val = "1";
                //console.log(jQuery("#analysis_selectbox").val());
              }


            }

          else if (change_val == "1"){
            jQuery("#webtronics_netlist_text_area").val("");

            /*------------------------------------------------------------------------------------------------------------------------------------- 
             Here are the conditions concatenated to give final netlist values for dc all cases  
             ---------------------------------------------------------------------------------------------------------------------------------------------*/ 
            if (analysis_type == "1") 
            { 

              jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".dc" + " " + source + " " + start + "e" + "-" + start_dc_unit + " " +  stop + "e" + "-" + stop_dc_unit + " " + increment + "e" + "-" + increment_dc_unit + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+ ".end \n" );

              change_val = "1";
              //console.log(jQuery("#analysis_selectbox").val());
            }


            /*------------------------------------------------------------------------------------------------------------------------------------------------
            Here are the all AC Cases for generating final netlist values
            ------------------------------------------------------------------------------------------------------------------------------------------------*/
            else if (analysis_type == "2")
            {
              jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".ac" + " " + scale_val + " " + noofpoint + " " + startfreq + start_ac_unit + " " + stopfreq + stop_ac_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+  ".end \n" );

              change_val = "1";

            } 
            /*------------------------------------------------------------------------------------------------------------------------------------------------
            Here are the all Transiet Cases for generating final netlist values
            ------------------------------------------------------------------------------------------------------------------------------------------------*/
              //else if (analysis_type == "3" && time == "1")
            else if (analysis_type== "3")
            {
              jQuery("#webtronics_netlist_text_area").val(Flag + '\n' + ".tran" + " " + step_trans + "e" + "-" + step_trans_unit + " " + stop_trans + "e"+ "-" + stop_trans_unit + " " + start_trans + "e" + "-" + start_trans_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n" +".end \n" ); 

              change_val = "1";


            }

            else if (analysis_type == "4") 
            { 

              jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".dc" + " " + source1 + " " + start1 + "e" + "-" + start_dc_unit1 + " " +  stop1 + "e" + "-" + stop_dc_unit1 + " " + increment1 + "e" + "-" + increment_dc_unit1 + " " + source2 + " " + start2 + "e" + "-" + start_dc_unit2 + " " +  stop2 + "e" + "-" + stop_dc_unit2 + " " + increment2 + "e" + "-" + increment_dc_unit2 + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+ ".end \n" );

              change_val = "1";
              //console.log(jQuery("#analysis_selectbox").val());
            }

            console.log(jQuery("#webtronics_netlist_text_area").val());
            console.log("deepblueSea");
          } 
        }
        else {
          alert("Analysis information is not available !");
        }

      });
    }

    jQuery("#webtronics_analysis").click(function(){
      flag1=1;
      jQuery('#webtronics_netlist_analysis').show();

      jQuery('#webtronics_disable').show();



    });

    jQuery(".button_cancel").click(function(){
      flag1=0;
      jQuery("#webtronics_netlist_analysis").hide();
      jQuery("#webtronics_disable").hide();

    });

    if($('webtronics_run')){
      Event.observe($('webtronics_run'), 'click', function() {
  		  //                    webtronics.postspice(webtronics.circuit.createnetlist());
  		  netlistcreator.createnetlist(webtronics.gnucapjs);
  		});

    }

    if($('webtronics_invert')){
      Event.observe($('webtronics_invert'),'click',function(){
      webtronics.circuit.invert($('webtronics_invert').checked);
      });
    }		

    if($('webtronics_graph')){
      Event.observe($('webtronics_graph'),'click',function(){
        if($('webtronics_graph').checked){
          webtronics.circuit.graph=true;
          webtronics.circuit.showbackground();									
        }
        else{
          webtronics.circuit.graph=false;
          webtronics.circuit.showbackground();									
        }
      });
    }
    
    if($('webtronics_connections')){
      $('webtronics_connections').checked=false;
      Event.observe($('webtronics_connections'),'click',function(){
        webtronics.circuit.showconnections($('webtronics_connections').checked);

      });
    }
    
    if($("webtronics_showhelp")){
      Event.observe($("webtronics_showhelp"),"click",function(){
        if($("webtronics_showhelp").checked){
          $$(".webtronics_help").forEach(function(e){
            e.style.display="block";
          });
        }
        else{
          $$(".webtronics_help").forEach(function(e){
            e.style.display="none";
          });
        }
      });
    }

    /*properties events*/		

    if($('webtronics_properties_ok'))Event.observe($('webtronics_properties_ok'), 'click', function() {
      $("webtronics_print_dir_field").style.display="none";
      $('webtronics_properties_div').style.display='none';
      webtronics.enablepage();
      var model=webtronics.circuit.selected[0];
      console.log("Model :"+model);
      netlistcreator.writewtx(model,"id",$('webtronics_part_id').value);
      netlistcreator.writewtx(model,"value",$('webtronics_part_value').value);
      netlistcreator.writewtx(model,"model",$('webtronics_part_dir_value').value);
      netlistcreator.writewtx(model,"measure",$('webtronics_print_dir_value').value);
  
      var modelname=netlistcreator.readwtx(model,"name");
      if(modelname=="gains"){
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
      }
      else if(modelname=="summer"){
        netlistcreator.writewtx(model,"ingain",$('webtronics_ingain_value').value);
        netlistcreator.writewtx(model,"outgain",$('webtronics_outgain_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
      }
      else if(modelname=="multiplier"){
        netlistcreator.writewtx(model,"ingain",$('webtronics_ingain_value').value);
        netlistcreator.writewtx(model,"outgain",$('webtronics_outgain_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
      }
      else if(modelname=="divider"){
        netlistcreator.writewtx(model,"numgain",$('webtronics_numgain_value').value);
        netlistcreator.writewtx(model,"outgain",$('webtronics_outgain_value').value);
        netlistcreator.writewtx(model,"numoffset",$('webtronics_numoffset_value').value);
        netlistcreator.writewtx(model,"dengain",$('webtronics_dengain_value').value);
        netlistcreator.writewtx(model,"denoffset",$('webtronics_denoffset_value').value);
        netlistcreator.writewtx(model,"fraction",$('webtronics_fraction_value').value);
        netlistcreator.writewtx(model,"dendomain",$('webtronics_dendomain_value').value);
        netlistcreator.writewtx(model,"denlowerlimit",$('webtronics_denlowerlimit_value').value);
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
      }
      else if(modelname=="limiter"){
        netlistcreator.writewtx(model,"limitrange",$('webtronics_limitrange_value').value);
        netlistcreator.writewtx(model,"fraction",$('webtronics_fraction_value').value);
        netlistcreator.writewtx(model,"outupperlimit",$('webtronics_outupperlimit_value').value);
        netlistcreator.writewtx(model,"outlowerlimit",$('webtronics_outlowerlimit_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
      }
      else if(modelname=="controllimiter"){
        netlistcreator.writewtx(model,"limitrange",$('webtronics_limitrange_value').value);
        netlistcreator.writewtx(model,"fraction",$('webtronics_fraction_value').value);
        netlistcreator.writewtx(model,"upperdelta",$('webtronics_upperdelta_value').value);
        netlistcreator.writewtx(model,"lowerdelta",$('webtronics_lowerdelta_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
      }
      else if(modelname=="pwlcontrolsource"){
        netlistcreator.writewtx(model,"xarr",$('webtronics_xarr_value').value);
        netlistcreator.writewtx(model,"fraction",$('webtronics_fraction_value').value);
        netlistcreator.writewtx(model,"yarr",$('webtronics_yarr_value').value);
        netlistcreator.writewtx(model,"indomain",$('webtronics_indomain_value').value);
        }
      else if(modelname=="multiinputpwlblock"){
        netlistcreator.writewtx(model,"xarr",$('webtronics_xarr_value').value);
        netlistcreator.writewtx(model,"amodel",$('webtronics_amodel_value').value);
        netlistcreator.writewtx(model,"yarr",$('webtronics_yarr_value').value);
        }
      else if(modelname=="aswitch"){
        netlistcreator.writewtx(model,"coff",$('webtronics_coff_value').value);
        netlistcreator.writewtx(model,"con",$('webtronics_con_value').value);
        netlistcreator.writewtx(model,"roff",$('webtronics_roff_value').value);
        netlistcreator.writewtx(model,"ron",$('webtronics_ron_value').value);
        netlistcreator.writewtx(model,"log",$('webtronics_log_value').value);
       }
      else if(modelname=="zener"){
        netlistcreator.writewtx(model,"irev",$('webtronics_irev_value').value);
        netlistcreator.writewtx(model,"isat",$('webtronics_isat_value').value);
        netlistcreator.writewtx(model,"limitswitch",$('webtronics_limitswitch_value').value);
        netlistcreator.writewtx(model,"nfor",$('webtronics_nfor_value').value);
        netlistcreator.writewtx(model,"vbreak",$('webtronics_vbreak_value').value);
        netlistcreator.writewtx(model,"ibreak",$('webtronics_ibreak_value').value);
        netlistcreator.writewtx(model,"rbreak",$('webtronics_rbreak_value').value);
       }
      else if(modelname=="currentlimiter"){
        netlistcreator.writewtx(model,"rsource",$('webtronics_rsource_value').value);
        netlistcreator.writewtx(model,"rsink",$('webtronics_rsink_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
        netlistcreator.writewtx(model,"ilimitsource",$('webtronics_ilimitsource_value').value);
        netlistcreator.writewtx(model,"ilimitsink",$('webtronics_ilimitsink_value').value);
        netlistcreator.writewtx(model,"vpwr",$('webtronics_ibreak_value').value);
        netlistcreator.writewtx(model,"isource",$('webtronics_isource_value').value);
        netlistcreator.writewtx(model,"isink",$('webtronics_isink_value').value);
        netlistcreator.writewtx(model,"routdomain",$('webtronics_routdomain_value').value);
       }
      else if(modelname=="hysteresis"){
        netlistcreator.writewtx(model,"inlow",$('webtronics_inlow_value').value);
        netlistcreator.writewtx(model,"inhigh",$('webtronics_inhigh_value').value);
        netlistcreator.writewtx(model,"outlowerlimit",$('webtronics_outlowerlimit_value').value);
        netlistcreator.writewtx(model,"outupperlimit",$('webtronics_outupperlimit_value').value);
        netlistcreator.writewtx(model,"hyst",$('webtronics_hyst_value').value);
        netlistcreator.writewtx(model,"indomain",$('webtronics_indomain_value').value);
        netlistcreator.writewtx(model,"fraction",$('webtronics_fraction_value').value);
       }   
      else if(modelname=="differentiator"){
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
        netlistcreator.writewtx(model,"outlowerlimit",$('webtronics_outlowerlimit_value').value);
        netlistcreator.writewtx(model,"outupperlimit",$('webtronics_outupperlimit_value').value);
        netlistcreator.writewtx(model,"limitrange",$('webtronics_limitrange_value').value);
       }

      else if(modelname=="integrator"){
        netlistcreator.writewtx(model,"outoffset",$('webtronics_outoffset_value').value);
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
        netlistcreator.writewtx(model,"outlowerlimit",$('webtronics_outlowerlimit_value').value);
        netlistcreator.writewtx(model,"outupperlimit",$('webtronics_outupperlimit_value').value);
        netlistcreator.writewtx(model,"limitrange",$('webtronics_limitrange_value').value);
         netlistcreator.writewtx(model,"outic",$('webtronics_outic_value').value);
       }
      else if(modelname=="sdomain"){
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
        netlistcreator.writewtx(model,"intic",$('webtronics_intic_value').value);
        netlistcreator.writewtx(model,"numcoeff",$('webtronics_numcoeff_value').value);
        netlistcreator.writewtx(model,"dencoeff",$('webtronics_dencoeff_value').value);
        netlistcreator.writewtx(model,"inoffset",$('webtronics_inoffset_value').value);
        netlistcreator.writewtx(model,"denormfreq",$('webtronics_denormfreq_value').value);
      }
      else if(modelname=="slewrateblock"){
        netlistcreator.writewtx(model,"riseslope",$('webtronics_riseslope_value').value);
        netlistcreator.writewtx(model,"fallslope",$('webtronics_fallslope_value').value);
        }
      else if(modelname=="sineoscillator"){
        netlistcreator.writewtx(model,"outlow",$('webtronics_outlow_value').value);
        netlistcreator.writewtx(model,"outhigh",$('webtronics_outhigh_value').value);
        netlistcreator.writewtx(model,"freqarr",$('webtronics_freqarr_value').value);
        netlistcreator.writewtx(model,"cntlarr",$('webtronics_cntlarr_value').value);
        }
      else if(modelname=="triangleoscillator"){
        netlistcreator.writewtx(model,"outlow",$('webtronics_outlow_value').value);
        netlistcreator.writewtx(model,"outhigh",$('webtronics_outhigh_value').value);
        netlistcreator.writewtx(model,"freqarr",$('webtronics_freqarr_value').value);
        netlistcreator.writewtx(model,"cntlarr",$('webtronics_cntlarr_value').value);
        netlistcreator.writewtx(model,"duty",$('webtronics_duty_value').value);
        }
      else if(modelname=="squareoscillator"){
        netlistcreator.writewtx(model,"outlow",$('webtronics_outlow_value').value);
        netlistcreator.writewtx(model,"outhigh",$('webtronics_outhigh_value').value);
        netlistcreator.writewtx(model,"freqarr",$('webtronics_freqarr_value').value);
        netlistcreator.writewtx(model,"cntlarr",$('webtronics_cntlarr_value').value);
        netlistcreator.writewtx(model,"duty",$('webtronics_duty_value').value);
        netlistcreator.writewtx(model,"risetime",$('webtronics_risetime_value').value);
        netlistcreator.writewtx(model,"falltime",$('webtronics_falltime_value').value);
        }
    else if(modelname=="oneshot"){
        netlistcreator.writewtx(model,"cntlarr",$('webtronics_cntlarr_value').value);
        netlistcreator.writewtx(model,"pwarr",$('webtronics_pwarr_value').value);
        netlistcreator.writewtx(model,"clktrig",$('webtronics_clktrig_value').value);
        netlistcreator.writewtx(model,"ptrig",$('webtronics_ptrig_value').value);
        netlistcreator.writewtx(model,"outlow",$('webtronics_outlow_value').value);
         netlistcreator.writewtx(model,"outhigh",$('webtronics_outhigh_value').value);
          netlistcreator.writewtx(model,"rdelay",$('webtronics_rdelay_value').value);
         netlistcreator.writewtx(model,"fdelay",$('webtronics_fdelay_value').value);
       }
       

     else if(modelname=="memristor"){
        netlistcreator.writewtx(model,"rmin",$('webtronics_rmin_value').value);
        netlistcreator.writewtx(model,"rmax",$('webtronics_rmax_value').value);
        netlistcreator.writewtx(model,"rinit",$('webtronics_rinit_value').value);
        netlistcreator.writewtx(model,"vt",$('webtronics_vt_value').value);
        netlistcreator.writewtx(model,"alpha",$('webtronics_alpha_value').value);
         netlistcreator.writewtx(model,"beta",$('webtronics_beta_value').value);
       }

      else if(modelname=="ac"){
        netlistcreator.writewtx(model,"phase",$('webtronics_phase_value').value);
        netlistcreator.writewtx(model,"amplitude",$('webtronics_amplitude_value').value);

      }
      else if(modelname=="capacitancemeter"||modelname=="inductancemeter"){
        netlistcreator.writewtx(model,"gain",$('webtronics_gain_value').value);
         }

      else if(modelname=="sinvoltagesource"){
        netlistcreator.writewtx(model,"offsetvoltage",$('webtronics_offsetvoltage_value').value);
        netlistcreator.writewtx(model,"voltageamplitude",$('webtronics_voltageamplitude_value').value);
        netlistcreator.writewtx(model,"frequency",$('webtronics_frequency_value').value);
        netlistcreator.writewtx(model,"delaytime",$('webtronics_delaytime_value').value);
        netlistcreator.writewtx(model,"dampingfactor",$('webtronics_dampingfactor_value').value);

      }
      else if(modelname=="pulse"){
        netlistcreator.writewtx(model,"pulval1",$('webtronics_pulval1_value').value);
        netlistcreator.writewtx(model,"pulval2",$('webtronics_pulval2_value').value);
        netlistcreator.writewtx(model,"pulval3",$('webtronics_pulval3_value').value);
        netlistcreator.writewtx(model,"pulval4",$('webtronics_pulval4_value').value);
        netlistcreator.writewtx(model,"pulval5",$('webtronics_pulval5_value').value);
        netlistcreator.writewtx(model,"pulval6",$('webtronics_pulval6_value').value);
        netlistcreator.writewtx(model,"pulval7",$('webtronics_pulval7_value').value);                   
      }
      else if(modelname=="pwl"){
        netlistcreator.writewtx(model,"pwlval",$('webtronics_pwlval_value').value);
                      
      }
      else if(modelname=="exponential"){
        netlistcreator.writewtx(model,"eval1",$('webtronics_eval1_value').value);
        netlistcreator.writewtx(model,"eval2",$('webtronics_eval2_value').value);
        netlistcreator.writewtx(model,"eval3",$('webtronics_eval3_value').value);
        netlistcreator.writewtx(model,"eval4",$('webtronics_eval4_value').value);
        netlistcreator.writewtx(model,"eval5",$('webtronics_eval5_value').value);
        netlistcreator.writewtx(model,"eval6",$('webtronics_eval6_value').value);
      }

      else if(modelname=="and"|| modelname=='not'|| modelname=='nand'|| modelname=='or'||modelname=='nor'||modelname=='xor'||modelname=='xnor'){
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
        netlistcreator.writewtx(model,"inputload",$('webtronics_inputload_value').value);
        
      }
      else if(modelname=="dff"){
        netlistcreator.writewtx(model,"clkdelay",$('webtronics_clkdelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"dataload",$('webtronics_dataload_value').value);
        netlistcreator.writewtx(model,"clkload",$('webtronics_clkload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
        
      }
      else if(modelname=="jkff"){
        netlistcreator.writewtx(model,"clkdelay",$('webtronics_clkdelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"jkload",$('webtronics_jkload_value').value);
        netlistcreator.writewtx(model,"clkload",$('webtronics_clkload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
      }
      else if(modelname=="tff"){
        netlistcreator.writewtx(model,"clkdelay",$('webtronics_clkdelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"tload",$('webtronics_tload_value').value);
        netlistcreator.writewtx(model,"clkload",$('webtronics_clkload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
      }
      else if(modelname=="srff"){
        netlistcreator.writewtx(model,"clkdelay",$('webtronics_clkdelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"srload",$('webtronics_srload_value').value);
        netlistcreator.writewtx(model,"clkload",$('webtronics_clkload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
      }
      else if(modelname=="dlatch"){
        netlistcreator.writewtx(model,"datadelay",$('webtronics_datadelay_value').value);
        netlistcreator.writewtx(model,"enabledelay",$('webtronics_enabledelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"dataload",$('webtronics_dataload_value').value);
        netlistcreator.writewtx(model,"enableload",$('webtronics_enableload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
      }
      else if(modelname=="srlatch"){
        netlistcreator.writewtx(model,"datadelay",$('webtronics_datadelay_value').value);
        netlistcreator.writewtx(model,"enabledelay",$('webtronics_enabledelay_value').value);
        netlistcreator.writewtx(model,"setdelay",$('webtronics_setdelay_value').value);
        netlistcreator.writewtx(model,"resetdelay",$('webtronics_resetdelay_value').value);
        netlistcreator.writewtx(model,"ic",$('webtronics_ic_value').value);
        netlistcreator.writewtx(model,"srload",$('webtronics_srload_value').value);
        netlistcreator.writewtx(model,"enableload",$('webtronics_enableload_value').value);
        netlistcreator.writewtx(model,"setload",$('webtronics_seload_value').value);
        netlistcreator.writewtx(model,"resetload",$('webtronics_resetload_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);
      }

      else if(modelname=="cdo"){
        netlistcreator.writewtx(model,"cntlarr",$('webtronics_cntlarr_value').value);
        netlistcreator.writewtx(model,"freqarr",$('webtronics_freqarr_value').value);
        netlistcreator.writewtx(model,"duty",$('webtronics_duty_value').value);
        netlistcreator.writewtx(model,"phase",$('webtronics_phase_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);

      }
      
      else if(modelname=="adc_bridge"){
        netlistcreator.writewtx(model,"inlow",$('webtronics_inlow_value').value);
        netlistcreator.writewtx(model,"inhigh",$('webtronics_inhigh_value').value);
        netlistcreator.writewtx(model,"risedelay",$('webtronics_risedelay_value').value);
        netlistcreator.writewtx(model,"falldelay",$('webtronics_falldelay_value').value);    

      }

      else if(modelname=="dac_bridge")
      {
        netlistcreator.writewtx(model,"outlow",$('webtronics_outlow_value').value);
        netlistcreator.writewtx(model,"outhigh",$('webtronics_outhigh_value').value);
        netlistcreator.writewtx(model,"outundef",$('webtronics_outundef_value').value);
        netlistcreator.writewtx(model,"inputload",$('webtronics_inputload_value').value);
        netlistcreator.writewtx(model,"risetime",$('webtronics_risetime_value').value);
        netlistcreator.writewtx(model,"falltime",$('webtronics_falltime_value').value);
      }
      
      webtronics.circuit.createvalue(webtronics.circuit.selected[0]);
    });

    if($('webtronics_properties_cancel'))Event.observe($('webtronics_properties_cancel'), 'click', function() {
      $("webtronics_print_dir_field").style.display="none";
      $('webtronics_properties_div').style.display='none';
      webtronics.enablepage();
    });

    if($('webtronics_part_model'))Event.observe($('webtronics_part_model'),'change',function(){
      var part=netlistcreator.readwtx(webtronics.circuit.selected[0],"name");
      var cat=netlistcreator.readwtx(webtronics.circuit.selected[0],"category");
      if($('webtronics_part_model').value){
        $("webtronics_part_dir_model").options.length=0;
        $("webtronics_part_dir_model").appendChild(new Element("option",{"value":""}).update("none"));
        for( var i=0;i<webtronics.partslists.length;i++){
          for(var j=0;j<webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value].length;j++){
            $("webtronics_part_dir_model").insert(new Element("option",{"value":webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value][j]}).update(webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value][j]));
          }
        }
      }
      $('webtronics_part_value').value=$("webtronics_part_model").options[$("webtronics_part_model").selectedIndex].value;

      });

    if($('webtronics_part_dir_model'))Event.observe($('webtronics_part_dir_model'),'change',function(){
      $('webtronics_part_dir_value').value=$("webtronics_part_dir_model").options[$("webtronics_part_dir_model").selectedIndex].value;

    });
		  //**OPEN LOCAL SPICE MODELS EXPERIMENT
		  //            if($("webtronics_part_file"))Event.observe($("webtronics_part_file"),'change',function(){
		  // 	      console.log($("webtronics_part_file").files[0]);
		  // 		    if(window.FileReader){
		  // 			  
		  // 				    var textReader = new FileReader();
		  // 				    textReader.onloadend=function(){
		  // 					    if(!textReader.result){
		  // 						    console.log("error opening file");
		  // 						    return;
		  // 					    };
		  // 
		  // 				    }.bind(this);
		  // 				    textReader.readAsText();
		  //     		    }
		  // 		    }.bind(this));
		  
		  /*save as png modal*/
		if($("webtronics_image_ok")){
      Event.observe($('webtronics_image_ok'), 'click', function() {
          webtronics.enablepage();
          $('webtronics_image').style.display='none';
          webtronics.setMode('select','Selection');
      });
    }

    /*chip box events*/
    Event.observe($('webtronics_vert_pins'), 'change', function() {
      $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
      var div=new Element("div",{id:"webtronics_chip_display"})
      .insert(chipmaker.drawchip($('webtronics_hor_pins').value,$('webtronics_vert_pins').value));
      $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
    });
    Event.observe($('webtronics_hor_pins'), 'change', function() {
      $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
      var div=new Element("div",{id:"webtronics_chip_display"})
      .update(chipmaker.drawchip($('webtronics_hor_pins').value,$('webtronics_vert_pins').value));
      $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
    });

    Event.observe($('webtronics_chip_spice_select'), 'change', function() {
      $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
      var div=new Element("div",{id:"webtronics_chip_display"})
      $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
      $("webtronics_chip_spice").value=$('webtronics_chip_spice_select').value;
      if($('webtronics_chip_spice_select').value!="none"){
        openfile("symbols/predefined/"+$('webtronics_chip_spice_select').value+".svg",function(svg){
          div.update(svg);
          var model=$("webtronics_chip_display").getElementsByTagName("g")[0];
          netlistcreator.writewtx(model,"value",$('webtronics_chip_spice_select').value);
          netlistcreator.writewtx(model,"model",webtronics.models[$('webtronics_chip_spice_select').value]);
        });
      }
    });


    Event.observe($('webtronics_chip_ok'), 'click', function() {
      webtronics.enablepage()
      webtronics.returnchip();
		    //chipmaker.clear();
		});
      
    Event.observe($('webtronics_chip_cancel'), 'click', function() {
      webtronics.enablepage();
      $('webtronics_chips_box').style.display='none';
      webtronics.setMode('select','Selection');
    });


	  Event.observe($('webtronics_plot_cancel'), 'click', function() {
      webtronics.enablepage();
      $('webtronics_plot_box').style.display='none';
    });


    /*text add events*/
    if($("webtronics_text_ok")){
      Event.observe($('webtronics_text_ok'), 'click', function() {
        webtronics.circuit.addtext($('webtronics_comment').value);
        $('webtronics_add_text').style.display='none';
        webtronics.setMode('select','Selection');
      });
    }
    if($("webtronics_text_cancel")){
      Event.observe($('webtronics_text_cancel'), 'click', function() {
        webtronics.setMode('select','Selection');
        $('webtronics_add_text').style.display='none';
      });
    }
    
    /*netlist text events*/
    if($("webtronics_netlist_text_ok")){
      Event.observe($('webtronics_netlist_text_ok'), 'click', function() {
        webtronics.setMode('select','Selection');
        $('webtronics_netlist_text').style.display='none';
        webtronics.enablepage();
      });
    }


    if($("webtronics_netlist_text_run")){
      Event.observe($('webtronics_netlist_text_run'), 'click', function() {
        webtronics.gnucapjs($("webtronics_netlist_text_area").value);
		    //$('webtronics_netlist_text').style.visibility='none';
		    //webtronics.enablepage();
		  });
    }  
    
    /*scope events*/
    if($("webtronics_scope_display")){
      this.scopestatus=$("webtronics_scope_status");
      this.scopedata=$("webtronics_scope_data");

      $("webtronics_scope_output_graph").checked=true;
      Event.observe($("webtronics_scope_output_graph"),'click',function(){$("webtronics_scope_display_frame").contentWindow.displaygraph()});
      Event.observe($("webtronics_scope_output_log"),'click', function(){$("webtronics_scope_display_frame").contentWindow.displaylog()});

      Event.observe($('webtronics_scope_display_ok'), 'click', function() {
        webtronics.setMode('select','Selection');
        $('webtronics_scope_display').style.display='none';
        $('webtronics_scope_display_div').innerHTML="";
	      //                    webtronics.enablepage();
	    });
      Event.observe($('webtronics_scope_display_stop'), 'click', function() {
        webtronics.setMode('select','Selection');
        $("webtronics_scope_display_frame").contentWindow.stopsimulation()				
//		      $('webtronics_scope_display').style.display='none';
//		      $('webtronics_scope_display_div').innerHTML="";
	      //                    webtronics.enablepage();
	    });



      Event.observe($("webtronics_scope_display"),'mousedown',function(e){
        var startx=e.layerX;
        var starty=e.layerY;
        Event.observe($("webtronics_scope_display"),'mousemove',function(e){
         $("webtronics_scope_display").style.top =e.clientY-starty + 'px';
         $("webtronics_scope_display").style.left =e.clientX-startx + 'px';
        });
        e.preventDefault();
      });
      
      Event.observe($("webtronics_scope_display"),'mouseup',function(){
        Event.stopObserving($("webtronics_scope_display"),'mousemove');
      });            

    }



    /*text open events*/
    Event.observe($('webtronics_open_text_ok'), 'click', function() {
      $('webtronics_open_text').style.display='none';
    });
    Event.observe($('webtronics_open_text_cancel'), 'click', function() {
      webtronics.setMode('select','Selection');

      $('webtronics_open_text').style.display='none';
    });
	  //sources events
	  Event.observe($('webtronics_add source_ok'), 'click', function() {
      var sources=$$(".webtronics_add_source_input");
      var addresses=[]
      for( var i=0;i<sources.length;i++){
       if(sources[i].value.match(/.*/)!=-1)addresses.push(sources[i].value);
     }	
     webtronics.serverurls=addresses;
     webtronics.populatemenu();
     $('webtronics_add source').style.display='none';
     webtronics.enablepage();
    });
	  
	  Event.observe($("webtronics_add_source_cancel"), 'click', function() {
      webtronics.setMode('select','Selection');

      $('webtronics_add source').style.display='none';
      webtronics.enablepage();
    });
	  
    }.bind(this));

    }
  }

webtronics.init();
