var alfabeto, inicial = [], final = [], estados = [], $ = go.GraphObject.make, model = $(go.GraphLinksModel);
var origem = [], caminho = [], chegada = [];

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
      inicial = lines[++i].trim().split(',');
    } else if (lines[i] == 'f') {
      final = lines[++i].trim().split(',');
    } else {
      var est = lines[i].split(' ');
      origem.push(est[0]); caminho.push(est[1]); chegada.push(est[2]);

      if (!alfabeto.includes(est[1])) {
        hideOnError();
      }

      if (!estados.includes(est[0])) {
        if (inicial.includes(new String(est[0]).valueOf().trim())) {
          model.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
          model.addLinkData({ from: 'ini', to: est[0], text: '' });
        }
        if (final.includes(new String(est[0]).valueOf().trim())) {
          var node = { key: est[0], name: est[0], fig: "Ring" };
        } else {
          var node = { key: est[0], name: est[0] };
        }

        model.addNodeData(node);
        estados.push(est[0]);

        if (est[0] != est[2] && !estados.includes(est[2])) {
          if (inicial.includes(new String(est[2]).valueOf().trim())) {
            model.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            model.addLinkData({ from: 'ini', to: est[2], text: '' });
          }

          if (final.includes(new String(est[2]).valueOf().trim())) {
            var node = { key: est[2], name: est[2], fig: "Ring" };
          } else {
            var node = { key: est[2], name: est[2] };
          }
          model.addNodeData(node);
          estados.push(est[2]);
        }
      }
      if (est[2]) {
        if (est[2].indexOf(',') != -1) {
          estatinhos = est[2].trim().split(',');
          for (let i = 0; i < estatinhos.length; i++) {
            link = { from: est[0], to: estatinhos[i], text: est[1] };
            model.addLinkData(link);
          }
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
        new go.Binding("text", "name"))
    );

  myDiagram.linkTemplate =
    $(go.Link,
      {
        adjusting: go.Link.Stretch,
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

function afnTOafd(ori, cam, che) {
  var afd = [];
  var teste;
  var testada;
  var novaORI = [];
  var novaCHEZ = [];
  var novaCHE = [];
  var uni;
  var duni;
  var split;
  novaORI = che;

  for (let i = 0; i < ori.length; i++) {
    //para pegar respostas separadas
    split = novaORI[i].split(',')
    if (split.length > 1) {
      for (let j = 0; j < ori.length; j++) {
        if (split[0] == ori[j] && cam[j] == 0) {
          novaCHEZ.push(che[j]);
          //console.log(novaCHEZ);
        } if (split[0] == ori[j] && cam[j] == 1) {
          novaCHE.push(che[j]);
         // console.log(novaCHE);
        } if (split[1] == ori[j] && cam[j] == 0) {
          novaCHEZ.push(che[j]);
         //  console.log(novaCHEZ);
        } if (split[1] == ori[j] && cam[j] == 1) {
          novaCHE.push(che[j]);
         // console.log(novaCHE)
        }
      }
      //apos pegar as respostas separadas pelos caminhos 0 e 1
      //eu filtro 0(chez) em teste e 1(che)em testada
      //esse filter serve pra tirar null e undefined dos arrays
      teste = novaCHE.filter(Boolean)
      testada = novaCHEZ.filter(Boolean)
      //apos isso eu concateno os testes filtrados em outra variavel
      //dessa forma a variavel uni fica com todos os dados de teste concatenados
      //e a variavel duni fica com os dados de testada
        if(teste.length>1){
          console.log(teste+"teste")
        uni = teste[0]+","+teste[1];
        }else{
          uni = teste;
        }
        if(testada.length>1){
        duni = testada[0] +","+ testada[1];
        }else{
          duni = testada;
        }
        //aqui é para jogar as respostas criando o afd
      for(let k =0; k<i; k++){
        if(cam[k] ==0 && che[k] != teste ){
          novaORI[k] = teste;
          console.log(novaORI)
        }
        if(cam[k]==1 && che[k] != testada){
          novaORI[k] = testada
          console.log(novaORI)
        }
      }
        console.log(novaORI)
      
      //tentando pegar as respostas e juntar em 1 posição so pra mandar
      //teste.push("" + novaCHE[i] + "" + novaCHE[i + 1] + "" + novaCHE[i + 2] + "")
      //che[i + 1] = a.concat('{', novaCHE[i], ',', novaCHE[i + 1], ',', novaCHE[i + 2], '}')
      //console.log(che[i+1])
    }
  }
}
