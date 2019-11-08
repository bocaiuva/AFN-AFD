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
      inicial = new String(lines[++i]).valueOf();
    } else if (lines[i] == 'f') {
      final = new String(lines[++i]).valueOf();
    } else {
      var est = lines[i].split(' ');
      origem.push(est[0]);
      caminho.push(est[1]);
      chegada.push(est[2]);
      if (!alfabeto.includes(est[1])) {
        hideOnError();
      }

      if (!estados.includes(est[0])) {
        if (new String(est[0]).valueOf().trim() == inicial.trim()) {  
          model.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
          model.addLinkData({ from: 'ini', to: est[0], text: '' });
        }
        if (new String(est[0]).valueOf().trim() == final.trim()) {
          var node = { key: est[0], name: est[0], fig: "Ring" };
        } else {
          var node = { key: est[0], name: est[0] };
        }
        
        model.addNodeData(node);
        estados.push(est[0]);

        if (est[0] != est[2] && !estados.includes(est[2])) {
          if (new String(est[2]).valueOf().trim() == inicial.trim()) {  
            model.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            model.addLinkData({ from: 'ini', to: est[2], text: '' });
          }

          if (new String(est[2]).valueOf().trim() == final.trim()) {
            var node = { key: est[2], name: est[2], fig: "Ring"};
          } else {
            var node = { key: est[2], name: est[2]};
          }
          
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
        }, new go.Binding("figure", "fig")),
        
      $(go.TextBlock, "Default Text",
        { margin: 12, stroke: "black", font: "bold 16px sans-serif" },
        new go.Binding("text", "name")),
        new go.Binding("size", "size")  
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
  var novaCHE=[];
  var split;
  novaORI[0] = che;

  for(let i=0;i<ori.length; i++){
    //para pegar respostas separadas
    split = che[i].split(',')
    if(split.length > 1 ){
      for(let j=0; j<ori.length; j++){
        if(split[0] == ori[j] && cam[j] == 0){
          novaCHE.push(che[j]); 
          console.log(novaCHE);
        }if(split[0] == ori[j] && cam[j]== 1){
          novaCHE.push(che[j]);
          console.log(novaCHE);
        }if(split[1] == ori[j] && cam[j] == 0){
          novaCHE.push(che[j]); 
          console.log(novaCHE);
        }if(split[1] == ori[j] && cam[j]== 1){
          novaCHE.push(che[j]);
          console.log(novaCHE);
        }
      }
      //para tirar duplicas das respostas
      for(let j=0; j <novaCHE.length;j++){
        split = novaCHE[j].split(',');
        if(split.length > 1){
          for(let k=0; k <novaCHE.length; k++){
          if(split[0] == novaCHE[k] ){
            for(let m=0; m <novaCHE.length; m++){
            novaCHE[m] = novaCHE[m+1];
            if(novaCHE[m] == undefined){
              novaCHE[m] = "";
            }
            }
            console.log(novaCHE)
          }
        }
      }
    }
    //tentando pegar as respostas e juntar em 1 posição so pra mandar
    teste.push(""+novaCHE[i]+""+novaCHE[i+1]+""+novaCHE[i+2]+"")
    che[i+1] = teste
    console.log(che)
    }
  }
}
