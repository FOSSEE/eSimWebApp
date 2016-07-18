var netlistcreator={

  matrixxform:function(point,matrix){
    var pin=webtronics.circuit.svgRoot.createSVGPoint();
    pin.x=point.x;
    pin.y=point.y;
    pin=pin.matrixTransform(matrix);
    return {x:Math.round(pin.x),y:Math.round(pin.y)};
  },

  /*tests if 2 point are within 3 pixels of each other*/
  ispoint:function(point1,point2){
    return (Math.abs(point2.x-point1.x)<3)&&(Math.abs(point2.y-point1.y)<3); 
  },

  sortnetlist:function(list){
    var G=[];
    var X=[];
    var S=[];
    var A=[];
    var B=[];
    var C=[];
    var D=[];
    var I=[];
    var J=[];
    var K=[];
    var L=[];
    var M=[];
    var N=[];
    var P=[];
    var Q=[];
    var R=[];
    var U=[];
    var V=[];
    var wire=[];
    var other=[]
    for(var i=0;i<list.length;i++){
      if(list[i].type=='gnd'){
        G.push(list[i]);
      }
      else if(list[i].type=='v'){
        V.push(list[i]);
      }
      else if(list[i].type=='wire'){
        wire.push(list[i]);			
      }		
      else if(list[i].type=='b'){
        B.push(list[i]);
      }
      else if(list[i].type=='c'){
        C.push(list[i]);	
      }
      else if(list[i].type=='d'){
        D.push(list[i]);
      }
      else if(list[i].type=='i'){	
        J.push(list[i]);
      }
      else if(list[i].type=='j'){	
        J.push(list[i]);
      }
      else if(list[i].type=='k'){
        K.push(list[i]);
      }
      else if(list[i].type=='l'){
        L.push(list[i]);
      }
      else if(list[i].type=='m'){
        M.push(list[i]);
      }
      else if(list[i].type=='n'){
        N.push(list[i]);
      }
      else if(list[i].type=='plot'){
        P.push(list[i]);
      }
      else if(list[i].type=='q'){
        Q.push(list[i]);
      }
      else if(list[i].type=='r'){
        R.push(list[i]);
      }
      else if(list[i].type=='x'){	
        U.push(list[i]);
      }
      // for analogmodels s
      else if(list[i].category=="analogmodels"){
        X.push(list[i]);
      }



      /* this is the best way I could think to tell if a part i digital */
      else if(list[i].category=="digitalmodels"||list[i].category=="hybridmodels"){	
        A.push(list[i]);
      }
      else {
        list[i].error='unknown device';
        other.push(list[i]);
      }
    }

    var sortfunction=function(a,b){
      var apart=a.id.replace(a.type,"");
      var bpart=b.id.replace(b.type,"");
      if(!apart)apart=0;
      if(!bpart)bpart=0;
      return (apart>bpart);
    };
    V.sort(sortfunction);
    wire.sort(sortfunction);
    B.sort(sortfunction);
    C.sort(sortfunction);
    D.sort(sortfunction);
    I.sort(sortfunction);
    J.sort(sortfunction);
    K.sort(sortfunction);
    L.sort(sortfunction);
    M.sort(sortfunction);
    N.sort(sortfunction);
    P.sort(sortfunction);
    Q.sort(sortfunction);
    R.sort(sortfunction);
    U.sort(sortfunction);
    X.sort(sortfunction);
    A.sort(sortfunction);

    var newlist=[];
    G.each(function(item){newlist.push(item)});		
    G.reverse();
    V.each(function(item){newlist.push(item)});		
    wire.each(function(item){newlist.push(item)});		
    B.each(function(item){newlist.push(item)});		
    C.each(function(item){newlist.push(item)});		
    D.each(function(item){newlist.push(item)});		
    I.each(function(item){newlist.push(item)});		
    J.each(function(item){newlist.push(item)});		
    K.each(function(item){newlist.push(item)});		
    L.each(function(item){newlist.push(item)});		
    M.each(function(item){newlist.push(item)});		
    N.each(function(item){newlist.push(item)});		
    Q.each(function(item){newlist.push(item)});		
    R.each(function(item){newlist.push(item)});
    U.each(function(item){newlist.push(item)});		
    X.each(function(item){newlist.push(item)});
    A.each(function(item){newlist.push(item)});		
    other.each(function(item){newlist.push(item)});		

    /*plots go last*/
    P.each(function(item){newlist.push(item)});		


    return newlist;
  },

  /* draws wires to namewire ports with the same id*/
  connectnamewires:function(list){
    for(var i=0;i<list.length;i++){
      if((list[i].type=="wire") || (list[i].type=="gnd")){
        for(var j=i;j<list.length;j++){
          if( (list[i]!=list[j]) && ((list[i].id==list[j].id) || (list[i].type=="gnd" && list[j].type=="gnd"))   ){
            var line= webtronics.circuit.createline('yellow',1,list[i]['analogpins'][0]['x'],list[i]['analogpins'][0]['y'],list[j]['analogpins'][0]['x'],list[j]['analogpins'][0]['y']);
            line.setAttributeNS(null,'class','webtronics_namewire_connector');
            webtronics.circuit.info.appendChild(line);
	          //console.log(line);            
	          break; 
          }
        }    
      }
    }
  },

/*check for vectors and convert them*/
  tovector:function(pin,nodenumber){
    var v ="";   
    if(pin.parentNode.tagName=="wtx:vector"){
      var vector=Element.descendants(pin.parentNode);
      if(pin==vector[0]){v+="["}
        v+="a"+nodenumber;
      if(pin==vector[vector.length-1]){v+="]";}
    }
    else{
      v+="a"+nodenumber;
    }
    
    return v;
  },

/*
 *    <wtx:pins>
 *		<wtx:analog>
 *		  <wtx:node index="1" x="0" y="10"></wtx:node>
 *		  <wtx:node index="2" x="40" y="10"></wtx:node>
 *		</wtx:analog>
 *    </wtx:pins>
 *    <wtx:id>r</wtx:id>
 *    <wtx:type>r</wtx:type>
 *    <wtx:name>testresistor</wtx:name>
 *    <wtx:category>resistors</wtx:category>
 *    <wtx:value></wtx:value>
 *    <wtx:label></wtx:label>
 *    <wtx:spice></wtx:spice>
 *    <wtx:flip></wtx:flip>
 *    <wtx:model></wtx:model>
 */


  getwtxdata:function(parts){
    list=[];
    for(var i=0;i<parts.length;i++){
      var part={error:"", elem:{}, analogpins:[],digitalpins:[],amplitude:"",phase:"",offsetvoltage:"",voltageamplitude:"",frequency:"",delaytime:"",dampingfactor:"",type:"", name:"", category:"", value:"", spice:"", model:"",measure:"", risedelay:"", falldelay:"",inputload:"", pulval1:"", pulval2:"", pulval3:"", pulval4:"", pulval5:"", pulval6:"", pulval7:"", eval1:"", eval2:"", eval3:"", eval4:"", eval5:"", eval6:"", pwlval1:"", pwlval2:"", pwlval3:"", pwlval4:"", pwlval5:"", pwlval6:"", pwlval7:"", pwlval8:"",
      inoffset:"",gain:"",outoffset:"",ingain:"",outgain:"",denoffset:"",dengain:"",numoffset:"",numgain:"",fraction:"",dendomain:"",denlowerlimit:"",outlowerlimit:"",outupperlimit:"",limitrange:"",upperdelta:"",lowerdelta:"",indomain:"",xarr:"",yarr:"",amodel:"",coff:"",con:"",irev:"",rbreak:"",limitswitch:"",roff:"",ron:"",log:"",vbreak:"",ibreak:"",isat:"",nfor:"",rsource:"",rsink:"",ilimitsource:"",ilimitsink:"",vpwr:"",isource:"",isink:"",routdomain:"",inlow:"",inhigh:"",hyst:"",outic:"",numcoeff:"",dencoeff:"",intic:"",denormfreq:"",
      riseslope:"",fallslope:"",outlow:"",outhigh:"",cntlarr:"",freqarr:"",duty:"",risetime:"",falltime:"",clktrig:"",pwarr:"",ptrig:"",rdelay:"",fdelay:"",rmax:"",rmin:"",rinit:"",vt:"",alpha:"",beta:"", clkdelay:"", setdelay:"", resetdelay:"", ic:"", dataload:"", jkload:"", tload:"", srload:"", clkload:"", setload:"", resetload:"", datadelay:"", enableload:"",srdelay:"", enabledelay:"", outundef:""}
      /*
       *        try{
       *            part.nodes=this.getwtxpins(part[i]);        
    }
    catch{part.error="wtx:pins not found"}
    */
      part.elem=parts[i];

      try{
        var category=webtronics.circuit.getwtxtagname(parts[i],"analog")[0];
        var nodes = webtronics.circuit.getwtxtagname(category,"node");
        for(var j=0;j<nodes.length;j++){
         var point = this.matrixxform( {x:webtronics.circuit.getwtxattribute(nodes[j],"x"),y:webtronics.circuit.getwtxattribute(nodes[j],"y")},webtronics.circuit.parseMatrix(part.elem));
         part.analogpins.push({index:webtronics.circuit.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
        }
        //sort nodes int correct order
        part.analogpins.sort(function(a,b){if (a.name > b.name)return 1;if (a.name < b.name)return -1;return 0;});
      }
      catch(e){console.log("no analog pins found");}
        
      try{
        var category=webtronics.circuit.getwtxtagname(parts[i],"digital")[0];
        var nodes = webtronics.circuit.getwtxtagname(category,"node");
        for(var j=0;j<nodes.length;j++){
          var point = this.matrixxform( {x:webtronics.circuit.getwtxattribute(nodes[j],"x"),y:webtronics.circuit.getwtxattribute(nodes[j],"y")},webtronics.circuit.parseMatrix(part.elem));
          part.digitalpins.push({index:webtronics.circuit.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
        }
        part.digitalpins.sort(function(a,b){if (a.name > b.name)return 1;if (a.name < b.name)return -1;return 0;});
      }
      catch(e){console.log("no digital pins found");}
       
      try{
        part.id=this.readwtx(parts[i],'id');
        if(part.type=="gnd"){
          part.id=part.type;this.writewtx(parts[i],'id',part.id);console.log(this.readwtx(parts[i],'id')+" sfd ");
        }
      }
      catch(e){part.error="wtx:id not found";}    
      
      try{
        part.type=this.readwtx(parts[i],'type');
      }
      catch(e){part.error="wtx:type not found";}
      
      try{
        part.name=this.readwtx(parts[i],'name');
      }
      catch(e){part.error="wtx:name not found";}
      
      try{
        part.category=this.readwtx(parts[i],'category');
      }
      catch(e){part.error="wtx:category not found";}    
      
      try{
        part.value=this.readwtx(parts[i],'value');  
      }
      catch(e){part.error="wtx:value not found";}    
      
      try{
        part.spice=this.readwtx(parts[i],'spice');
      }
      catch(e){part.error="wtx:spice not found";}    
      
      try{        
        part.model=this.readwtx(parts[i],'model');
      }
      catch(e){part.error="wtx:model not found";} 
      
      //for ac voltage source
      try{        
        part.amplitude=this.readwtx(parts[i],'amplitude');
      }
      catch(e){part.error="wtx:amplitude not found";} 
      
      try{
        part.phase=this.readwtx(parts[i],'phase');
      }
      catch(e){part.error="wtx:phase not found";} 

      //for sinusoidal voltage source
      try{        
        part.offsetvoltage=this.readwtx(parts[i],'offsetvoltage');
      }
      catch(e){part.error="wtx:offsetvoltage not found";} 

      try{        
        part.voltageamplitude=this.readwtx(parts[i],'voltageamplitude');
      }
      catch(e){part.error="wtx:voltageamplitude not found";} 
      
      try{        
        part.frequency=this.readwtx(parts[i],'frequency');
      }
      catch(e){part.error="wtx:frequency not found";} 
      
      try{        
        part.delaytime=this.readwtx(parts[i],'delaytime');
      }
      catch(e){part.error="wtx:delaytime not found";} 
      
      try{        
        part.dampingfactor=this.readwtx(parts[i],'dampingfactor');
      }
      catch(e){part.error="wtx:dampingfactor not found";} 

      // FOR pulse volatge source  
      try{        
        part.pulval1=this.readwtx(parts[i],'pulval1');
      }
      catch(e){part.error="wtx:Initial Value not found";} 

      try{        
        part.pulval2=this.readwtx(parts[i],'pulval2');
      }
      catch(e){part.error="wtx:Pulse Value not found";} 
        
      try{        
        part.pulval3=this.readwtx(parts[i],'pulval3');
      }
      catch(e){part.error="wtx:Delay Time not found";} 
        
      try{        
        part.pulval4=this.readwtx(parts[i],'pulval4');
      }
      catch(e){part.error="wtx:Rise Time not found";} 

      try{        
        part.pulval5=this.readwtx(parts[i],'pulval5');
      }
      catch(e){part.error="wtx:Fall Time not found";} 
        
      try{        
        part.pulval6=this.readwtx(parts[i],'pulval6');
      }
      catch(e){part.error="wtx:Pulse Period not found";} 
        
      try{        
        part.pulval7=this.readwtx(parts[i],'pulval7');
      }
      catch(e){part.error="wtx:Pulse Width not found";} 

      //FOR pwl volatge source
      try{        
        part.pwlval1=this.readwtx(parts[i],'pwlval1');
      }
      catch(e){part.error="wtx:Time T1 Value not found";} 

      try{        
        part.pwlval2=this.readwtx(parts[i],'pwlval2');
      }
      catch(e){part.error="wtx:Voltage V1 Value not found";} 
        
      try{        
        part.pwlval3=this.readwtx(parts[i],'pwlval3');
      }
      catch(e){part.error="wtx:Time T2 Value not found";} 
        
      try{        
        part.pwlval4=this.readwtx(parts[i],'pwlval4');
      }
      catch(e){part.error="wtx:Voltage V2 value not found";} 

      try{        
        part.pwlval5=this.readwtx(parts[i],'pwlval5');
      }
      catch(e){part.error="wtx:Time T3 value not found";} 
        
      try{        
        part.pwlval6=this.readwtx(parts[i],'pwlval6');
      }
      catch(e){part.error="wtx:Voltage V3 value not found";} 
        
      try{        
        part.pwlval7=this.readwtx(parts[i],'pwlval7');
      }
      catch(e){part.error="wtx:Time T4 Value not found";} 
        
      try{        
        part.pwlval8=this.readwtx(parts[i],'pwlval8');
      }
      catch(e){part.error="wtx:Voltage V4 Value not found";} 

      //FOR exponential volatge source
      try{        
        part.eval1=this.readwtx(parts[i],'eval1');
      }
      catch(e){part.error="wtx:Initial Value not found";} 

      try{        
        part.eval2=this.readwtx(parts[i],'eval2');
      }
      catch(e){part.error="wtx:Pulse Value not found";} 
    
      try{        
        part.eval3=this.readwtx(parts[i],'eval3');
      }
      catch(e){part.error="wtx:Rise Time Delay value not found";} 
    
      try{        
        part.eval4=this.readwtx(parts[i],'eval4');
      }
      catch(e){part.error="wtx:Rise Time Constant value not found";} 

      try{        
        part.eval5=this.readwtx(parts[i],'eval5');
      }
      catch(e){part.error="wtx:Fall Time Delay value not found";} 
    
      try{        
        part.eval6=this.readwtx(parts[i],'eval6');
      }
      catch(e){part.error="wtx:Fall Time Constan value not found";} 

      //digital and
      try{
        part.risedelay=this.readwtx(parts[i],'risedelay');
      }
      catch(e){part.error="wtx:risedelay not found";}

      try{
        part.falldelay=this.readwtx(parts[i],'falldelay');
      }
      catch(e){part.error="wtx:risedelay not found";}

      try{
      	part.inputload=this.readwtx(parts[i],'inputload');
      }
      catch(e){part.error="wtx:inputload not found";}

      //special tag for parts that do simulation
      try{
        part.measure=this.readwtx(parts[i],'measure');
      }
      catch(e){part.error="wtx:measure not found";}    

      try{ part.inoffset=this.readwtx(parts[i],'inoffset'); }
      catch(e){ part.error="wtx:inoffset not found"; }

      try{ part.gain=this.readwtx(parts[i],'gain'); }
      catch(e){ part.error="wtx:gain not found"; }

      try{ part.outoffset=this.readwtx(parts[i],'outoffset'); }
      catch(e){ part.error="wtx:outoffset not found"; }

      try{ part.ingain=this.readwtx(parts[i],'ingain'); }
      catch(e){ part.error="wtx:ingain not found"; }

      try{ part.outgain=this.readwtx(parts[i],'outgain'); }
      catch(e){ part.error="wtx:outgain not found"; }

      try{ part.denoffset=this.readwtx(parts[i],'denoffset'); }
      catch(e){ part.error="wtx:denoffset not found"; }

      try{ part.dengain=this.readwtx(parts[i],'dengain'); }
      catch(e){ part.error="wtx:dengain not found"; }

      try{ part.numoffset=this.readwtx(parts[i],'numoffset'); }
      catch(e){ part.error="wtx:numoffset not found"; }

      try{ part.numgain=this.readwtx(parts[i],'numgain'); }
      catch(e){ part.error="wtx:numgain not found"; }

      try{ part.fraction=this.readwtx(parts[i],'fraction'); }
      catch(e){ part.error="wtx:fraction not found"; }

      try{ part.dendomain=this.readwtx(parts[i],'dendomain'); }
      catch(e){ part.error="wtx:dendomain not found"; }

      try{ part.denlowerlimit=this.readwtx(parts[i],'denlowerlimit'); }
      catch(e){ part.error="wtx:denlowerlimit not found"; }

      try{ part.outlowerlimit=this.readwtx(parts[i],'outlowerlimit'); }
      catch(e){ part.error="wtx:outlowerlimit not found"; }

      try{ part.outupperlimit=this.readwtx(parts[i],'outupperlimit'); }
      catch(e){ part.error="wtx:outupperlimit not found"; }

      try{ part.limitrange=this.readwtx(parts[i],'limitrange'); }
      catch(e){ part.error="wtx:limitrange not found"; }

      try{ part.upperdelta=this.readwtx(parts[i],'upperdelta'); }
      catch(e){ part.error="wtx:upperdelta not found"; }

      try{ part.lowerdelta=this.readwtx(parts[i],'lowerdelta'); }
      catch(e){ part.error="wtx:lowerdelta not found"; }

      try{ part.indomain=this.readwtx(parts[i],'indomain'); }
      catch(e){ part.error="wtx:indomain not found"; }

      try{ part.xarr=this.readwtx(parts[i],'xarr'); }
      catch(e){ part.error="wtx:xarr not found"; }

      try{ part.yarr=this.readwtx(parts[i],'yarr'); }
      catch(e){ part.error="wtx:yarr not found"; }

      try{ part.amodel=this.readwtx(parts[i],'amodel'); }
      catch(e){ part.error="wtx:amodel not found"; }

      try{ part.coff=this.readwtx(parts[i],'coff'); }
      catch(e){ part.error="wtx:coff not found"; }

      try{ part.con=this.readwtx(parts[i],'con'); }
      catch(e){ part.error="wtx:con not found"; }

      try{ part.roff=this.readwtx(parts[i],'roff'); }
      catch(e){ part.error="wtx:roff not found"; }


      try{ part.irev=this.readwtx(parts[i],'irev'); }
      catch(e){ part.error="wtx:irev not found"; }

      try{ part.rbreak=this.readwtx(parts[i],'rbreak'); }
      catch(e){ part.error="wtx:rbreak not found"; }

      try{ part.limitswitch=this.readwtx(parts[i],'limitswitch'); }
      catch(e){ part.error="wtx:limitswitch not found"; }

      try{ part.ron=this.readwtx(parts[i],'ron'); }
      catch(e){ part.error="wtx:ron not found"; }

      try{ part.log=this.readwtx(parts[i],'log'); }
      catch(e){ part.error="wtx:log not found"; }

      try{ part.vbreak=this.readwtx(parts[i],'vbreak'); }
      catch(e){ part.error="wtx:vbreak not found"; }


      try{ part.ibreak=this.readwtx(parts[i],'ibreak'); }
      catch(e){ part.error="wtx:ibreak not found"; }

      try{ part.isat=this.readwtx(parts[i],'isat'); }
      catch(e){ part.error="wtx:isat not found"; }

      try{ part.nfor=this.readwtx(parts[i],'nfor'); }
      catch(e){ part.error="wtx:nfor not found"; }

      try{ part.rsource=this.readwtx(parts[i],'rsource'); }
      catch(e){ part.error="wtx:rsource not found"; }

      try{ part.rsink=this.readwtx(parts[i],'rsink'); }
      catch(e){ part.error="wtx:rsink not found"; }

      try{ part.ilimitsink=this.readwtx(parts[i],'ilimitsink'); }
      catch(e){ part.error="wtx:ilimitsink not found"; }

      try{ part.ilimitsource=this.readwtx(parts[i],'ilimitsource'); }
      catch(e){ part.error="wtx:ilimitsource not found"; }

      try{ part.vpwr=this.readwtx(parts[i],'vpwr'); }
      catch(e){ part.error="wtx:vpwr not found"; }

      try{ part.isource=this.readwtx(parts[i],'isource'); }
      catch(e){ part.error="wtx:isource not found"; }

      try{ part.isink=this.readwtx(parts[i],'isink'); }
      catch(e){ part.error="wtx:isink not found"; }

      try{ part.routdomain=this.readwtx(parts[i],'routdomain'); }
      catch(e){ part.error="wtx:routdomain not found"; }

      try{ part.inlow=this.readwtx(parts[i],'inlow'); }
      catch(e){ part.error="wtx:inlow not found"; }

      try{ part.inhigh=this.readwtx(parts[i],'inhigh'); }
      catch(e){ part.error="wtx:inhigh not found"; }

      try{ part.hyst=this.readwtx(parts[i],'hyst'); }
      catch(e){ part.error="wtx:hyst not found"; }

      try{ part.outic=this.readwtx(parts[i],'outic'); }
      catch(e){ part.error="wtx:outic not found"; }


      try{ part.numcoeff=this.readwtx(parts[i],'numcoeff'); }
      catch(e){ part.error="wtx:numcoeff not found"; }


      try{ part.dencoeff=this.readwtx(parts[i],'dencoeff'); }
      catch(e){ part.error="wtx:dencoeff not found"; }

      try{ part.lowerdelta=this.readwtx(parts[i],'lowerdelta'); }
      catch(e){ part.error="wtx:lowerdelta not found"; }

      try{ part.intic=this.readwtx(parts[i],'intic'); }
      catch(e){ part.error="wtx:intic not found"; }

      try{ part.denormfreq=this.readwtx(parts[i],'denormfreq'); }
      catch(e){ part.error="wtx:denormfreq not found"; }

      try{ part.riseslope=this.readwtx(parts[i],'riseslope'); }
      catch(e){ part.error="wtx:riseslope not found"; }

      try{ part.fallslope=this.readwtx(parts[i],'fallslope'); }
      catch(e){ part.error="wtx:fallslope not found"; }

      try{ part.outlow=this.readwtx(parts[i],'outlow'); }
      catch(e){ part.error="wtx:outlow not found"; }

      try{ part.outhigh=this.readwtx(parts[i],'outhigh'); }
      catch(e){ part.error="wtx:outhigh not found"; }

      try{ part.cntlarr=this.readwtx(parts[i],'cntlarr'); }
      catch(e){ part.error="wtx:cntlarr not found"; }

      try{ part.freqarr=this.readwtx(parts[i],'freqarr'); }
      catch(e){ part.error="wtx:freqarr not found"; }

      try{ part.duty=this.readwtx(parts[i],'duty'); }
      catch(e){ part.error="wtx:duty not found"; }

      try{ part.risetime=this.readwtx(parts[i],'risetime'); }
      catch(e){ part.error="wtx:risetime not found"; }


      try{ part.falltime=this.readwtx(parts[i],'falltime'); }
      catch(e){ part.error="wtx:falltime not found"; }

      try{ part.clktrig=this.readwtx(parts[i],'clktrig'); }
      catch(e){ part.error="wtx:clktrig not found"; }

      try{ part.pwarr=this.readwtx(parts[i],'pwarr'); }
      catch(e){ part.error="wtx:pwarr not found"; }

      try{ part.ptrig=this.readwtx(parts[i],'ptrig'); }
      catch(e){ part.error="wtx:ptrig not found"; }

      try{ part.rdelay=this.readwtx(parts[i],'rdelay'); }
      catch(e){ part.error="wtx:rdelay not found"; }

      try{ part.fdelay=this.readwtx(parts[i],'fdelay'); }
      catch(e){ part.error="wtx:fdelay not found"; }

      try{ part.rmax=this.readwtx(parts[i],'rmax'); }
      catch(e){ part.error="wtx:rmax not found"; }

      try{ part.rmin=this.readwtx(parts[i],'rmin'); }
      catch(e){ part.error="wtx:rmin not found"; }

      try{ part.rinit=this.readwtx(parts[i],'isource'); }
      catch(e){ part.error="wtx:isource not found"; }

      try{ part.vt=this.readwtx(parts[i],'vt'); }
      catch(e){ part.error="wtx:vt not found"; }

      try{ part.alpha=this.readwtx(parts[i],'alpha'); }
      catch(e){ part.error="wtx:alpha not found"; }

      try{ part.beta=this.readwtx(parts[i],'beta'); }
      catch(e){ part.error="wtx:beta not found"; }

      try{ part.clkdelay=this.readwtx(parts[i],'clkdelay'); }
      catch(e){ part.error="wtx:clkdelay not found"; }

      try{ part.setdelay=this.readwtx(parts[i],'setdelay'); }
      catch(e){ part.error="wtx:setdelay not found"; }

      try{ part.resetdelay=this.readwtx(parts[i],'resetdelay'); }
      catch(e){ part.error="wtx:resetdelay not found"; }

      try{ part.ic=this.readwtx(parts[i],'ic'); }
      catch(e){ part.error="wtx:ic not found"; }

      try{ part.dataload=this.readwtx(parts[i],'dataload'); }
      catch(e){ part.error="wtx:dataload not found"; }

      try{ part.jkload=this.readwtx(parts[i],'jkload'); }
      catch(e){ part.error="wtx:jkload not found"; }

      try{ part.tload=this.readwtx(parts[i],'tload'); }
      catch(e){ part.error="wtx:tload not found"; }

      try{ part.srload=this.readwtx(parts[i],'srload'); }
      catch(e){ part.error="wtx:srload not found"; }

      try{ part.clkload=this.readwtx(parts[i],'clkload'); }
      catch(e){ part.error="wtx:clkload not found"; }

      try{ part.setload=this.readwtx(parts[i],'setload'); }
      catch(e){ part.error="wtx:setload not found"; }

      try{ part.resetload=this.readwtx(parts[i],'resetload'); }
      catch(e){ part.error="wtx:resetload not found"; }

      try{ part.enableload=this.readwtx(parts[i],'enableload'); }
      catch(e){ part.error="wtx:enableload not found"; }

      try{ part.datadelay=this.readwtx(parts[i],'datadelay'); }
      catch(e){ part.error="wtx:datadelay not found"; }

      try{ part.enabledelay=this.readwtx(parts[i],'enabledelay'); }
      catch(e){ part.error="wtx:enabledelay not found"; }

      try{ part.srdelay=this.readwtx(parts[i],'srdelay'); }
      catch(e){ part.error="wtx:srdelay load not found"; }

      try{ part.srdelay=this.readwtx(parts[i],'srdelay'); }
      catch(e){ part.error="wtx:srdelay load not found"; }

      try{ part.outdef=this.readwtx(parts[i],'outdef'); }
      catch(e){ part.error="wtx:outdef load not found"; }

      try{ part.outundef=this.readwtx(parts[i],'outundef');}
      catch(e){ part.error="wtx:outdef load not found";}


      list.push(part);
  }
  return list;
},

/*detect analog and digital mix*/
mixedsignals:function(analogwires,digitalwires){

  for(var j=1;j<analogwires.length;j++){
    var crossed=this.getconnected(digitalwires,analogwires[j]);
    if(crossed>-1){
      return true;  
    }
  }
  return false;
},

/* test if wires are connected anywhere*/
getconnected:function(wirelist,wire){
  for(var i=0;i<wirelist.length;i++){
    for(var j=0;j<wirelist[i].length;j++){
      for(var k=0;k<wire.length;k++){
       if(this.ispoint(wirelist[i][j],wire[k])){
         return i;
       }
     }
   }
 }
 return -1;
},

//returns points connected by lines
//it is recursive and should be called with NULL for wires
followwires:function(wires,pin){
  if(wires==null)wires=[];
  var points=[];
  points.push(pin);	
  var lines =webtronics.circuit.getwithselector('#webtronics_drawing > line, #information > .webtronics_namewire_connector');
  for(var i =0 ;i<lines.length;i++){
    var point1={x:lines[i].getAttribute('x1')-0,y:lines[i].getAttribute('y1')-0};
    var point2={x:lines[i].getAttribute('x2')-0,y:lines[i].getAttribute('y2')-0};
    if(wires.indexOf(lines[i])<0){		
      if(this.ispoint(point1,pin)){
       wires.push(lines[i]);
       var p=this.followwires(wires,point2);
       for(var j=0;j<p.length;j++)points.push(p[j]);				
     }
   else if(this.ispoint(point2,pin)){
     wires.push(lines[i]);
     var p=this.followwires(wires,point1);
     for(var j=0;j<p.length;j++)points.push(p[j]);				
   }
}
}
return points;
},



//sets the node numbers for parts
numberwires:function(parts){
  var analogpoints=[];
  var digitalpoints=[];
  for(var i=0;i<parts.length; i++){
    //analog node numbering loop
    if(parts[i].type=="wire")continue;

    if( parts[i].type=="gnd"){
      if (analogpoints.length==0 ){
       var wire=this.followwires(null,{x:parts[i].analogpins[0]['x'],y:parts[i].analogpins[0]['y']});
       analogpoints.push(wire);
//add this node to thelist of digital wires
digitalpoints.push(wire);
}
parts[i].analogpins[0]["node"]=0;
//      parts[i].digitalpins[0]["node"]=0;
continue;
}
if(parts[i].analogpins!=undefined){
  for(var j=0;j<parts[i].analogpins.length;j++){
   var wire=this.followwires(null,{x:parts[i].analogpins[j]['x'],y:parts[i].analogpins[j]['y']});
   var found=this.getconnected(analogpoints,wire);
   if(found<0){
     analogpoints.push(wire);
     parts[i].analogpins[j]["node"]=analogpoints.length-1;
   }
   else{
     parts[i].analogpins[j]["node"]=found;
   }
 }
}
    //digital node numbering loop
    
    if(parts[i].digitalpins!=undefined){
      for(var j=0;j<parts[i].digitalpins.length;j++){
       var wire=this.followwires(null,{x:parts[i].digitalpins[j]['x'],y:parts[i].digitalpins[j]['y']});
       var found=this.getconnected(digitalpoints,wire);
       if(found<0){
         digitalpoints.push(wire);
         parts[i].digitalpins[j]["node"]=digitalpoints.length-1;
       }
       else{
         parts[i].digitalpins[j]["node"]=found;
       }
     }	
   }
 }
  //returns true if digital and analog are mixed
  return this.mixedsignals(analogpoints,digitalpoints);
} , 



/* creates all netlist data from parts data*/
getnodes:function(parts){
  var sections={netlist:[],coupling:[],firstdir:[],simulation:[],lastdir:[]}; 

  //if(this.numberwires(parts))return {firstdir:[],netlist:[{error:"pin is both analog and digital"}],lastdir:[],plot:[]};
  this.numberwires(parts);
  for(var i=0;i<parts.length; i++){
    //    if(parts[i].type=="wire")continue;
    // check what type of simulation to use
    if(parts[i].type=='gnd' || parts[i].type=='wire')continue;
    if(parts[i].type=="plot"){
      if(sections.simulation.length==0){
        sections.simulation.push(".op");
        sections.simulation.push(".print tran");
      }
      if(sections.simulation[1] !=undefined && sections.simulation[1].match(/\.print\sac/g)==null){
        sections.simulation[1]+=" v("+parts[i].analogpins[0]["node"]+")";
        sections.simulation[1]+=" "+parts[i].measure;
        if(parts[i].model)sections.simulation.push(parts[i].model);
      }
    }
    else{
      if(parts[i].type=="v"){
        if(sections.simulation.length==0 && parts[i].model.length){
          sections.simulation.push(".op");
          sections.simulation.push(".print ac "+parts[i].measure);
          sections.simulation.push(parts[i].model);
        }
      }
      else if(parts[i].type=="l"){
        if(parts[i].model.length){
          sections.coupling.push(parts[i].model);  
        }
      }
      else{
        if(parts[i].model.match(/\.mod/i) && !parts[i].id.match(/^x/))parts[i].id="x"+parts[i].id;
        if(parts[i].model.length)sections.firstdir.push(parts[i].model);
      }

      //create pins array
      var net={error:parts[i].error,pwlval1:parts[i].pwlval1,pwlval2:parts[i].pwlval2,pwlval3:parts[i].pwlval3,pwlval4:parts[i].pwlval4,pwlval5:parts[i].pwlval5,pwlval6:parts[i].pwlval6,pwlval7:parts[i].pwlval7,pwlval8:parts[i].pwlval8,pulval1:parts[i].pulval1,pulval2:parts[i].pulval2,pulval3:parts[i].pulval3,pulval4:parts[i].pulval4,pulval5:parts[i].pulval5,pulval6:parts[i].pulval6,pulval7:parts[i].pulval7,name:parts[i].name,
        partid:parts[i].id,pins:{analog:parts[i].analogpins,digital:parts[i].digitalpins},model:parts[i].value,amplitude:parts[i].amplitude,
      phase:parts[i].phase, risedelay:parts[i].risedelay, inputload:parts[i].inputload, falldelay:parts[i].falldelay, offsetvoltage:parts[i].offsetvoltage,voltageamplitude:parts[i].voltageamplitude,frequency:parts[i].frequency,
      delaytime:parts[i].delaytime,dampingfactor:parts[i].dampingfactor,eval1:parts[i].eval1,eval2:parts[i].eval2,eval3:parts[i].eval3,eval4:parts[i].eval4,eval5:parts[i].eval5,eval6:parts[i].eval6,
      inoffset:parts[i].inoffset,gain:parts[i].gain,outoffset:parts[i].outoffset,ingain:parts[i].ingain,outgain:parts[i].outgain,denoffset:parts[i].denoffset,dengain:parts[i].dengain,numoffset:parts[i].numoffset,numgain:parts[i].numgain,fraction:parts[i].fraction,dendomain:parts[i].dendomain,denlowerlimit:parts[i].denlowerlimit,outlowerlimit:parts[i].outlowerlimit,outupperlimit:parts[i].outupperlimit,limitrange:parts[i].limitrange,upperdelta:parts[i].upperdelta,lowerdelta:parts[i].lowerdelta,
 indomain:parts[i].indomain,xarr:parts[i].xarr,yarr:parts[i].yarr,amodel:parts[i].amodel,coff:parts[i].coff,con:parts[i].con,irev:parts[i].irev,rbreak:parts[i].rbreak,limitswitch:parts[i].limitswitch,roff:parts[i].roff,ron:parts[i].ron,log:parts[i].log,vbreak:parts[i].vbreak,ibreak:parts[i].ibreak,isat:parts[i].isat,nfor:parts[i].nfor,rsource:parts[i].rsource,rsink:parts[i].rsink,ilimitsource:parts[i].ilimitsource,ilimitsink:parts[i].ilimitsink,vpwr:parts[i].vpwr,isource:parts[i].isource,isink:parts[i].isink,routdomain:parts[i].routdomain,inlow:parts[i].inlow,inhigh:parts[i].inhigh,hyst:parts[i].hyst,outic:parts[i].outic,
 numcoeff:parts[i].numcoeff,dencoeff:parts[i].dencoeff,intic:parts[i].intic,denormfreq:parts[i].denormfreq,riseslope:parts[i].riseslope,fallslope:parts[i].fallslope,outlow:parts[i].outlow,outhigh:parts[i].outhigh,cntlarr:parts[i].cntlarr,freqarr:parts[i].freqarr,duty:parts[i].duty,risetime:parts[i].risetime,falltime:parts[i].falltime,clktrig:parts[i].clktrig,pwarr:parts[i].pwarr,ptrig:parts[i].ptrig,rdelay:parts[i].rdelay,fdelay:parts[i].fdelay,rmax:parts[i].rmax,rmin:parts[i].rmin,rinit:parts[i].rinit,vt:parts[i].vt,alpha:parts[i].alpha,beta:parts[i].beta, outundef:parts[i].outundef

      };
      
      if(net!=null)sections.netlist.push(net);
    }
    
  }
  
  return sections;
},

/* organizes data into netlist*/
createnetlist:function(responsefunc){
  var parts=webtronics.circuit.getwithselector('#webtronics_drawing > g');

  if(parts.length<1){
    responsefunc("no parts found \n");
    return;
  }

  var partswtx=this.sortnetlist(this.getwtxdata(parts));

  if(partswtx[0].type.toLowerCase()!='gnd'){
    responsefunc('no ground node');
    return;
  }
  this.connectnamewires(partswtx);
  
  var spice="*ngspice netlist * \n";
  var sections=this.getnodes(partswtx);
  
  //dump models into spice	

  if(sections.netlist.length){
    var command="";
    for(var i=0;i<sections.netlist.length;i++){
      if(sections.netlist[i].error!=""){
        spice+=sections.netlist[i].error+'\n';
        continue;
      }
      
      command=sections.netlist[i].partid;
      var pins=[];
      for(var j=0;j<sections.netlist[i].pins['analog'].length;j++)pins.push(sections.netlist[i].pins['analog'][j]);
      for(var j=0;j<sections.netlist[i].pins['digital'].length;j++)pins.push(sections.netlist[i].pins['digital'][j]);
      pins.sort(function(a,b){return a.index > b.index? 1:a.index < b.index?-1:0;})
      //console.log(pins);
      for(var j=0;j<pins.length;j++){command += " "+pins[j].node;}
      
      var pid=sections.netlist[i].partid;
      if(sections.netlist[i].name=="ac"){
        command+=" "+"AC "+sections.netlist[i].amplitude+" "+sections.netlist[i].phase;
      }
      else if(sections.netlist[i].name=="sinvoltagesource"){
        command+=" "+"SIN ("+sections.netlist[i].offsetvoltage+" "+sections.netlist[i].voltageamplitude+" "+sections.netlist[i].frequency+" "+sections.netlist[i].delaytime+" "+sections.netlist[i].dampingfactor+")";
      }
      else if(sections.netlist[i].name=="battery"){
        command+=" "+"DC "+sections.netlist[i].model;
      }
      else if(sections.netlist[i].name=="current"){
        command+=" "+"dc "+sections.netlist[i].model;
      }
      else if(sections.netlist[i].name=="pulse"){
        command+=" "+"PULSE ("+sections.netlist[i].pulval1+" "+sections.netlist[i].pulval2+" "+sections.netlist[i].pulval3+" "+sections.netlist[i].pulval4+" "+sections.netlist[i].pulval5+" "+sections.netlist[i].pulval6+" "+sections.netlist[i].pulval7+")";
      }
      else if(sections.netlist[i].name=="pwl"){
        command+=" "+"PWL ("+sections.netlist[i].pwlval1+" "+sections.netlist[i].pwlval2+" "+sections.netlist[i].pwlval3+" "+sections.netlist[i].pwlval4+" "+sections.netlist[i].pwlval5+" "+sections.netlist[i].pwlval6+" "+sections.netlist[i].pwlval7+" "+sections.netlist[i].pwlval8+")";
      }
      else if(sections.netlist[i].name=="exponential"){
        command+=" "+"EXP ("+sections.netlist[i].eval1+" "+sections.netlist[i].eval2+" "+sections.netlist[i].eval3+" "+sections.netlist[i].eval4+" "+sections.netlist[i].eval5+" "+sections.netlist[i].eval6+")";
      }
      else if(sections.netlist[i].name=="gains"){
        var inoff=sections.netlist[i].inoffset;var gn=sections.netlist[i].gain;var outoff=sections.netlist[i].outoffset;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" gain(in_offset="+inoff+" gain="+gn+" out_offset="+outoff+")\n";
      }
      else if(sections.netlist[i].name=="summer"){
        var inoff=sections.netlist[i].inoffset;
        var outoff=sections.netlist[i].outoffset;
        var ingn=sections.netlist[i].ingain;
        var outgn=sections.netlist[i].outgain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" summer(in_offset=["+inoff+"] in_gain=["+ingn+"] out_gain=["+outgn+"] out_offset=["+outoff+"])\n";
      }
      else if(sections.netlist[i].name=="multiplier"){
        var inoff=sections.netlist[i].inoffset;
        var outoff=sections.netlist[i].outoffset;
        var ingn=sections.netlist[i].ingain;
        var outgn=sections.netlist[i].outgain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" mult(in_offset=["+inoff+"] in_gain=["+ingn+"] out_gain="+outgn+" out_offset="+outoff+")\n";

      }
      else if(sections.netlist[i].name=="divider"){
        var numoff=sections.netlist[i].numoffset;
        var denoff=sections.netlist[i].denoffset;
        var numgn=sections.netlist[i].numgain;
        var dengn=sections.netlist[i].dengain;
        var frac=sections.netlist[i].fraction;
        var dendomn=sections.netlist[i].dendomain;
        var dll=sections.netlist[i].denlowerlimit;
        var outgn=sections.netlist[i].outgain;
        var outoff=sections.netlist[i].outoffset;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" divide(num_offset="+numoff+" num_gain="+numgn+" den_offset="+denoff+" den_gain="+dengn+" den_lower.limit="+dll+" den_domain="+dendomn+" fraction="+frac+" out_gain="+outgn+" out_offset="+outoff+")\n";
      }
      else if(sections.netlist[i].name=="limiter"){
        var lr=sections.netlist[i].limitrange;
        var frac=sections.netlist[i].fraction;
        var oul=sections.netlist[i].outupperlimit;
        var oll=sections.netlist[i].outlowerlimit;
        var gn=sections.netlist[i].gain;
        var inoff=sections.netlist[i].inoffset;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" limit(in_offset="+inoff+" gain="+gn+" out_lower_limit="+oll+" out_upper_limit="+oul+" limit_range="+lr+" fraction="+frac+")\n";
      }
      else if(sections.netlist[i].name=="controllimiter"){
        var lr=sections.netlist[i].limitrange;
        var frac=sections.netlist[i].fraction;
        var ud=sections.netlist[i].upperdelta;
        var ld=sections.netlist[i].lowerdelta;
        var gn=sections.netlist[i].gain;
        var inoff=sections.netlist[i].inoffset;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" climit(in_offset="+inoff+" gain="+gn+" upper_delta="+ud+" lower_delta="+ld+" limit_range="+lr+" fraction="+frac+")\n";
      }
      else if(sections.netlist[i].name=="pwlcontrolsource"){
        var xar=sections.netlist[i].xarr;
        var frac=sections.netlist[i].fraction;
        var yar=sections.netlist[i].yarr;
        var indn=sections.netlist[i].indomain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" pwl(x_array=["+xar+"] y_array=["+yar+"] input_domain="+indn+" fraction="+frac+")\n";
      }
      else if(sections.netlist[i].name=="multiinputpwlblock"){
        var xar=sections.netlist[i].xarr;
        var modl=sections.netlist[i].amodel;
        var yar=sections.netlist[i].yarr;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" multi_input_pwl(x_array=["+xar+"] y_array=["+yar+"] model="+modl+")\n";
      }
      else if(sections.netlist[i].name=="aswitch"){
        var rf=sections.netlist[i].roff;
        var rn=sections.netlist[i].ron;
        var cf=sections.netlist[i].coff;
        var cn=sections.netlist[i].con;
        var lg=sections.netlist[i].log;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" aswitch(cntl_off="+cf+" cntl_on="+cn+" r_off="+rf+" r_on="+rn+" log="+lg+")\n";
      }
      else if(sections.netlist[i].name=="aswitch"){
        var rf=sections.netlist[i].roff;
        var rn=sections.netlist[i].ron;
        var cf=sections.netlist[i].coff;
        var cn=sections.netlist[i].con;
        var lg=sections.netlist[i].log;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" aswitch(cntl_off="+cf+" cntl_on="+cn+" r_off="+rf+" r_on="+rn+" log="+lg+")\n";
      }
      else if(sections.netlist[i].name=="zener"){
        var ir=sections.netlist[i].irev;
        var vb=sections.netlist[i].vbreak;
        var rb=sections.netlist[i].rbreak;
        var ib=sections.netlist[i].ibreak;
        var nf=sections.netlist[i].nfor;
        var is=sections.netlist[i].isat;
        var ls=sections.netlist[i].limitswitch;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" zener(v_breakdown="+vb+" i_breakdown="+ib+" r_breakdown="+rb+" i_rev="+ir+" i_sat="+is+" n_forward="+nf+" limit_switch="+ls+")\n";
      }
      else if(sections.netlist[i].name=="currentlimiter"){
        var rso=sections.netlist[i].rsource;
        var rsi=sections.netlist[i].rsink;
        var inoff=sections.netlist[i].inoffset;
        var gn=sections.netlist[i].gain;
        var ilso=sections.netlist[i].ilimitsource;
        var ilsi=sections.netlist[i].ilimitsink;
        var vp=sections.netlist[i].vpwr;
        var isi=sections.netlist[i].isink;
        var iso=sections.netlist[i].isource;
        var rd=sections.netlist[i].routdomain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" ilimit(in_offset="+inoff+" gain="+gn+" r_out_source="+rso+" r_out_sink="+rsi+" i_limit_source="+ilso+" i_limit_sink="+ilsi+" v_pwr_range="+vp+" i_source_range="+iso+" i_sink_range="+isi+" r_out_domain="+rd+")\n";
      }
      else if(sections.netlist[i].name=="hysteresis"){
        var il=sections.netlist[i].inlow;
        var ih=sections.netlist[i].inhigh;
        var ol=sections.netlist[i].outlowerlimit;
        var ou=sections.netlist[i].outupperlimit;
        var h=sections.netlist[i].hyst;
        var idmn=sections.netlist[i].indomain;
        var frac=sections.netlist[i].fraction;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" hyst(in_low="+il+" in_high="+ih+" hyst="+h+" out_lower_limit="+ol+" out_upper_limit="+ou+" input_domain="+idmn+" fraction="+frac+")\n";
      }
      else if(sections.netlist[i].name=="differentiator"){
        var oo=sections.netlist[i].outoffset;
        var gn=sections.netlist[i].gain;
        var ol=sections.netlist[i].outlowerlimit;
        var ou=sections.netlist[i].outupperlimit;
        var lr=sections.netlist[i].limitrange;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" d_dt(out_offset="+oo+" gain="+gn+" out_lower_limit="+ol+" out_upper_limit="+ou+" limit_range="+lr+")\n";
      }
      else if(sections.netlist[i].name=="integrator"){
        var oo=sections.netlist[i].outoffset;
        var gn=sections.netlist[i].gain;
        var ol=sections.netlist[i].outlowerlimit;
        var ou=sections.netlist[i].outupperlimit;
        var lr=sections.netlist[i].limitrange;
        var oi=sections.netlist[i].outic;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" int(out_offset="+oo+" gain="+gn+" out_lower_limit="+ol+" out_upper_limit="+ou+" limit_range="+lr+" out_ic="+oi+")\n";
      }
      else if(sections.netlist[i].name=="sdomain"){
        var gn=sections.netlist[i].gain;
        var ic=sections.netlist[i].intic;
        var nc=sections.netlist[i].numcoeff;
        var dc=sections.netlist[i].dencoeff;
        var io=sections.netlist[i].inoffset;
        var df=sections.netlist[i].denormfreq;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" s_xfer(gain="+gn+" in_offset="+io+" denormalized_freq="+df+" int_ic=["+ic+"] num_coeff=["+nc+"] den_coeff=["+dc+"])\n";
      }
      else if(sections.netlist[i].name=="slewrateblock"){
        var gn=sections.netlist[i].riseslope;
        var ic=sections.netlist[i].fallslope;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" slew(rise_slope="+gn+" fall_slope="+ic+")\n";
      }

      else if(sections.netlist[i].name=="sineoscillator"){
        var ol=sections.netlist[i].outlow;
        var oh=sections.netlist[i].outhigh;
        var ca=sections.netlist[i].cntlarr;
        var fa=sections.netlist[i].freqarr;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" sine(cntl_array=["+ca+"] freq_array=["+fa+"] out_low="+ol+" out_high="+oh+")\n";
      }
      else if(sections.netlist[i].name=="triangleoscillator"){
        var ol=sections.netlist[i].outlow;
        var oh=sections.netlist[i].outhigh;
        var ca=sections.netlist[i].cntlarr;
        var fa=sections.netlist[i].freqarr;
        var dt=sections.netlist[i].duty;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" triangle(cntl_array=["+ca+"] freq_array=["+fa+"] out_low="+ol+" out_high="+oh+" duty_cycle="+dt+")\n";
      }
      else if(sections.netlist[i].name=="squareoscillator"){
        var ol=sections.netlist[i].outlow;
        var oh=sections.netlist[i].outhigh;
        var ca=sections.netlist[i].cntlarr;
        var fa=sections.netlist[i].freqarr;
        var dt=sections.netlist[i].duty;
        var rt=sections.netlist[i].risetime;
        var ft=sections.netlist[i].falltime;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" square(cntl_array=["+ca+"] freq_array=["+fa+"] out_low="+ol+" out_high="+oh+" duty_cycle="+dt+" rise_time="+rt+" fall_time="+ft+")\n";
      }
      else if(sections.netlist[i].name=="capacitancemeter"){
        var gn=sections.netlist[i].gain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" cmeter(gain="+gn+")\n";
      }
      else if(sections.netlist[i].name=="inductancemeter"){
        var gn=sections.netlist[i].gain;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" lmeter(gain="+gn+")\n";
      }
      else if(sections.netlist[i].name=="oneshot"){
        var ct=sections.netlist[i].cntlarr;
        var pw=sections.netlist[i].pwarr;
        var ctg=sections.netlist[i].clktrig;
        var pt=sections.netlist[i].ptrig;
        var ol=sections.netlist[i].outlow;
        var oh=sections.netlist[i].outhigh;
        var rd=sections.netlist[i].rdelay;
        var fd=sections.netlist[i].fdelay;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" oneshot(cntl_array=["+ct+"] pw_array=["+pw+"] clk_trig="+ctg+" pos_edge_trig="+pt+" out_low="+ol+" out_high="+oh+" rise_delay="+rd+" fall_delay="+fd+")\n";
      }
      else if(sections.netlist[i].name=="memristor"){
        var ct=sections.netlist[i].rmin;
        var pw=sections.netlist[i].rmax;
        var ctg=sections.netlist[i].rinit;
        var pt=sections.netlist[i].alpha;
        var ol=sections.netlist[i].beta;
        var oh=sections.netlist[i].vt;
        command+=" ref_"+pid+"\n"+".model ref_"+pid+" memristor(rmin="+ct+" rmax="+pw+" rinit="+ctg+" alpha="+pt+" beta="+ol+" vt="+oh+")\n";
      }
      else if(sections.netlist[i].name=="dff"){
        var cd=sections.netlist[i].clkdelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="flop_"+pid+"\n.model flop_"+pid+ "d_dff(clk_delay = "+cd+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="jkff"){
        var cd=sections.netlist[i].clkdelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="flop_"+pid+"\n.model flop_"+pid+ "d_jkff(clk_delay = "+cd+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="tff"){
        var cd=sections.netlist[i].clkdelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="flop_"+pid+"\n.model flop_"+pid+ "d_tff(clk_delay = "+cd+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="srff"){
        var cd=sections.netlist[i].clkdelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="flop_"+pid+"\n.model flop_"+pid+ "d_srff(clk_delay = "+cd+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="dlatch"){
        var dd=sections.netlist[i].datadelay;
        var ed=sections.netlist[i].enabledelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="latch_"+pid+"\n.model latch_"+pid+ "d_dlatch(data_delay = "+dd+" enable_delay "+ed+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="srlatch"){
        var srd=sections.netlist[i].srdelay;
        var ed=sections.netlist[i].enabledelay;
        var sd=sections.netlist[i].setdelay;
        var rd=sections.netlist[i].resetdelay;
        var ic=sections.netlist[i].ic;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+="latch_"+pid+"\n.model latch_"+pid+ "d_dlatch(sr_delay = "+srd+" enable_delay "+ed+" set_delay = "+sd+"+reset_delay = "+rd+" ic = "+ic+" rise_delay = "+rised+"+ fall_delay = "+falld+")";
      }
      else if(sections.netlist[i].name=="not")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_inverter(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="nor")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_nor(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="xnor")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_xnor(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="or")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_or(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="and")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_and(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="nand")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_nand(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }
      else if(sections.netlist[i].name=="xor")
      {
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        var rd=sections.netlist[i].inputload;
        command+=" ref_"+pid+"\n.model ref_"+pid+" d_xor(rise_delay ="+rised+" fall_delay = "+falld+" input_load = "+rd+")\n";
      }

      else if(sections.netlist[i].name=="dac_bridge")
      {
        var ol=sections.netlist[i].outlow;
        var oh=sections.netlist[i].outhigh;
        var ou=sections.netlist[i].outundef;
        var rd=sections.netlist[i].inputload;
        var rt=sections.netlist[i].risetime;
        var ft=sections.netlist[i].falltime;
        command+=" dac_"+pid+"\n.model dac_"+pid+" dac_bridge(out_low ="+ol+" out_high = "+oh+" out_undef = "+ou+" input_load = "+rd+" t_rise = "+rt+"t_fall ="+ft+")\n";
      }

      else if(sections.netlist[i].name=="adc_bridge")
      {
        var il=sections.netlist[i].inlow;
        var ih=sections.netlist[i].inhigh;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+=" adc_"+pid+"\n.model adc_"+pid+" adc_bridge(in_low ="+il+" in_high = "+ih+" rise_delay = "+rised+" fall_delay = "+falld+")\n";
      }


      else if(sections.netlist[i].name=="cdo")
      {

        var ca=sections.netlist[i].cntlarr;
        var fa=sections.netlist[i].freqarr;
        var dt=sections.netlist[i].duty;
        var p=sections.netlist[i].phase;
        var rised=sections.netlist[i].risedelay;
        var falld=sections.netlist[i].falldelay;
        command+=" var_clock"+pid+"\n.model var_clock"+pid+" d_osc(cntl_array = [ "+ca+"] freq_array = [ "+fa+" ] duty_cycle = "+dt+" initphase = "+p+" rise_delay = "+rised+" fall_delay = "+falld+")\n";
      }

      else{
        command+=" "+sections.netlist[i].model;
      }

      if(command!="")spice+=command+'\n';
    }
  }

  if(sections.coupling.length){
    for(var i=0;i<sections.coupling.length;i++){
      spice+=sections.coupling[i]+'\n';
    }
  }

  var modelloader={
    modeltext:"",
    modelcount:0,
    download:function(name){
      var found=false;
      for( var i=0;i<webtronics.partslists.length;i++){

        if(JSON.stringify(webtronics.partslists[i]).indexOf(name)!=-1){
          found=true;
  				if(webtronics.partslists[i].url.indexOf("http://")==-1){//see if path is local
            openfile( webtronics.partslists[i].url+"/spice/"+ name,this.responder);
          }
          else{
            server.requestfile(list.url,this.responder);
          }
          break;
          this.modelcount++;
        }

      }
       
      if(!found)console.log("model not found");
    },
    finish:function(){
      spice+=modelloader.modeltext; 
      if(sections.simulation.length){
        for(var i=0;i<sections.simulation.length;i++){
          if(sections.simulation[i]!="")spice+=sections.simulation[i]+"\n";
        }
      }

      if(sections.lastdir.length){
        sections.lastdir=sections.lastdir.uniq();
        for(var i=0;i<sections.lastdir.length;i++){
          if(sections.lastdir[i]!="")spice+=sections.lastdir[i]+"\n";
        }
      }
            
      responsefunc(spice);

    },

    responder:function(text){
      console.log("reponded");
      modelloader.modeltext=text;
      if(!modelloader.modelcount){
        //spice+=modelloader.modeltext;
        modelloader.finish();
        jQuery("#webtronics_netlist_text_area").val(spice+final_str);	
        //spice=spice.concat(".end \n");	
      }       
    }
  }

  if(sections.firstdir.length){
    sections.firstdir=sections.firstdir.uniq();
    for(var i=0;i<sections.firstdir.length;i++){
      //console.log(sections.firstdir[i]);
      if(sections.firstdir[i].length){
        modelloader.download(sections.firstdir[i],sections,webtronics.partslists);
      }
    }
  }
  else modelloader.finish();

  var connector=webtronics.circuit.getwithselector('#information > .webtronics_namewire_connector')
  for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);


},


writeconnects:function(pins){
  var str=[];
  for(var i=0;i<pins.length;i++){
    str[i] = pins[i].x +','+pins[i].y;
  }
  return str.join(';'); 
},

getconnects:function(elem){
  var pins=[];    
  var nodes = this.getwtxtagname(elem,"node");
  for(var j=0;j<nodes.length;j++){
  //	console.log(nodes[j]);
  //	console.log(this.parseMatrix(elem));
  var point = this.matrixxform( {x:this.getwtxattribute(nodes[j],"x"),y:this.getwtxattribute(nodes[j],"y")},this.parseMatrix(elem));
  pins.push({x:point.x,y:point.y}) ;
  }
  //sort nodes int correct order
  return pins;
},

isconnect:function(pin,radius,x,y){
  return (Math.abs(pin.x-x)<3)&&(Math.abs(pin.y-y)<3); 
},

isconnects:function(parts,radius,x,y){
  for(var i=0; i<parts.length; i++){
    if(parts[i].tagName =='g'){
      var pins=this.getconnects(parts[i]);
      if(pins){
        for(var j=0;j<pins.length;j++){
          if(this.isconnect(pins[j],radius,x,y)){
            return pins[j];
          }
        }
      }
    }
  }
    return null;
},

//get the number by part id and leg
getnodenumber:function(name, leg){
  //get part by id
  var part=webtronics.circuit.getwithselector("#webtronics_drawing wtx:id "+name )[0];
  var nodes=part.getwtxtagname("node");
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].getAttribute("index")==leg){
      var wire = this.followwires(null,{ x:this.getwtxattribute(node,"x"),y:this.getwtxattribute(node,"y")});
      return this.getconnected(analogwires,wire);
    }
  }
  return -1
},
getwtxtagname:function(elem,tagname){
  var tag=elem.getElementsByTagName("wtx:"+tagname);
  if(!tag.length){
    tag=elem.getElementsByTagName(tagname);
  }
  if(!tag.length){
    tag=elem.getElementsByTagNameNS(this.wtxNs,tagname);
  }
  if(!tag.length){
    tag=elem.getElementsByTagNameNS("*",tagname);
  }
  return tag;
},

getwtxattribute:function(elem,attrib){
  var value=elem.getAttribute(attrib);
  if(value==undefined)value=elem.getAttributeNS(this.wtxNs,attrib);
  if(value==undefined)value=elem.getAttributeNS("*",attrib);
  return value;
},

readwtx:function(elem,value){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])return tag[0].textContent;
  else return "";
},

writewtx:function(elem,value,text){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])tag[0].textContent=text;
},



}

