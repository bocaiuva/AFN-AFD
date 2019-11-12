var alfabeto, inicial, final, estados = [], $ = go.GraphObject.make, model = $(go.GraphLinksModel);
var origem=[];
var caminho=[];
var chegada=[];

function dividir() {
  skeleton();
  var entrada = document.getElementById("afn").value, arrayLi = entrada.split('\n');
  for (var i = 0; i < arrayLi.length; i++) {
    mkDia(arrayLi[i].split(':'))
  }
  afnTOafd(origem, caminho, chegada);
}
function mkDia(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == 'AB') {
       alfabeto = lines[++i];
    } else if (lines[i] == 'i') {
      inicial = lines[++i];
    } else if (lines[i] == 'f') {
      final = lines[++i];
    } else {
      var est = lines[i].split(' ');
      origem.push(est[0]);
      caminho.push(est[1]);
      chegada.push(est[2]);
      if (!alfabeto.includes(est[1])) {
        hideOnError();
      }

      if (!estados.includes(est[0])) {
        var node = { key: est[0], name: est[0] };
        model.addNodeData(node);
        estados.push(est[0]);

        if (est[0] != est[2] && !estados.includes(est[2])) {
          node = { key: est[2], name: est[2] };
          model.addNodeData(node);
          estados.push(est[2]);
        }
      }

      if (est[2]) {
        if (est[2].indexOf(',') != -1) {
          let firstComingOfChrist = est[2].substring(0, est[2].indexOf(','));
          let secondComingOfChrist = est[2].substring(est[2].indexOf(',') + 1, est[2].length);
                  
          var link = { from: est[0], to: firstComingOfChrist, text: est[1] };
          model.addLinkData(link);

          link = { from: est[0], to: secondComingOfChrist, text: est[1] };
          model.addLinkData(link);
        }
      }
      link = { from: est[0], to: est[2], text: est[1] };
      model.addLinkData(link);
    }
  }
}

function skeleton() {
  var myDiagram = $(go.Diagram, "myDiagramDiv");
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "Circle",
        {
          fill: $(go.Brush, "Linear", { 0: "rgb(0, 150, 173)", 1: "rgb(0, 87, 173)" }),
          stroke: null,
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
        }),
      $(go.TextBlock, "Default Text",
        { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
        new go.Binding("text", "name"))
    );

  myDiagram.linkTemplate =
    $(go.Link,
      {
        curve: go.Link.Bezier, adjusting: go.Link.Stretch,
        toShortLength: 3
      },
      new go.Binding("points"),
      new go.Binding("curviness"),
      $(go.Shape,
        { strokeWidth: 1.5 }),
      $(go.Shape,
        { toArrow: "standard", stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,
          {
            fill: $(go.Brush, "Radial",
              { 0: "rgb(255, 255, 255)", 0.3: "rgb(255, 255, 255)", 1: "rgba(255, 255, 255, 0)" }),
            stroke: null
          }),
        $(go.TextBlock, "transition",
          {
            textAlign: "center",
            font: "9pt helvetica, arial, sans-serif",
            margin: 4
          },
          new go.Binding("text"))
      )
    );
  myDiagram.model = model;
  hideOnSkeleton();
}

function hideOnError() {
  document.getElementById("myDiagramDiv").style.display = "none";
  document.getElementById("divBtn").innerHTML = "";
  document.getElementById("divAfn").style.display = "none";
  document.getElementById("erro").innerHTML = "Oop. Formato errado, seu alfabeto é " + alfabeto;
  document.getElementById("erro").style.display = "block";
  document.getElementById("restart").style.display = "block";
}

function hideOnSkeleton() {
  document.getElementById("myDiagramDiv").style.display = "block";
  document.getElementById("restart").style.display = "block";
  document.getElementById("divBtn").innerHTML = "";
  document.getElementById("divAfn").style.display = "none";
}

function afnTOafd(ori, cam, che){
  var afd =[];
  var teste =[];
  var novaORI=[];
  var novaCHEZ=[];
  var novaCHEU=[]; 
  var split;
  novaORI[0] = che;

  for(let i=0;i<ori.length; i++){
    //para pegar respostas separadas
    split = che[i].split(',')
    if(split.length > 1 ){
      for(let j=0; j<ori.length; j++){
        if(split[0] == ori[j] && cam[j] == 0){
          novaCHEZ.push(che[j]); 
          console.log(novaCHEZ);
        }if(split[0] == ori[j] && cam[j]== 1){
          novaCHEU.push(che[j]);
          console.log(novaCHEU);
        }if(split[1] == ori[j] && cam[j] == 0){
          novaCHEZ.push(che[j]); 
          console.log(novaCHEZ);
        }if(split[1] == ori[j] && cam[j]== 1){
          novaCHEU.push(che[j]);
          console.log(novaCHEU);
        }
      }
      //para tirar duplicas das respostas que tem caminho 0
      for(let j=0; j <novaCHEZ.length;j++){
        if(novaCHEZ.length >1){
        split = novaCHEZ[j].split(',');
          for(let k=0; k <novaCHEZ.length; k++){
          if(split[0] == novaCHEZ[k] ){
            for(let m=0; m <novaCHEZ.length; m++){
            novaCHEZ[m] = novaCHEZ[m+1];
            if(novaCHEZ[m] == undefined){
              novaCHEZ[m] = "";
            }
            }
          }
        }
      }else{
         for(let m=0; m <novaCHEZ.length; m++){
            novaCHEZ[m] = novaCHEZ[m+1];
            if(novaCHEZ[m] == undefined){
              novaCHEZ[m] = "";
      }
    }
     //para tirar duplicas das respostas que tem caminho 1
      for(let j=0; j <novaCHEU.length;j++){
        if(novaCHEU.length >1){
        split = novaCHEU[j].split(',');
          for(let k=0; k <novaCHEU.length; k++){
          if(split[0] == novaCHEU[k] ){
            for(let m=0; m <novaCHEU.length; m++){
            novaCHEU[m] = novaCHEU[m+1];
            if(novaCHEU[m] == undefined){
              console.log("ndefinido")
              novaCHEU[m] = "";
            }
            }
          }
        }
      }else{
         for(let m=0; m <novaCHEU.length; m++){
            novaCHEU[m] = novaCHEU[m+1];
            if(novaCHEU[m] == undefined){
              novaCHEU[m] = "";
      }
    }
    console.log(novaCHEZ)
    console.log(novaCHEU)
    //tentando pegar as respostas e juntar em 1 posição so pra mandar
    che[i].concat(novaCHEZ,novaCHEU);
   
    console.log(che)
    }
  }
}
