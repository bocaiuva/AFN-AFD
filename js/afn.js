var alfabeto, inicial = [], final = [], estados = [], $ = go.GraphObject.make, model = $(go.GraphLinksModel);
var origem = [], caminho = [], chegada = [];

function dividir() {
  skeleton();
  var entrada = document.getElementById("afn").value, arrayLi = entrada.split('\n');
  for (var i = 0; i < arrayLi.length; i++) {
    mkDia(arrayLi[i].split(':'))
  }
  var novoEstado = criandoEstados(origem, caminho, chegada);
  console.log(novoEstado)
  gerarAFD(novoEstado,origem,caminho,chegada)
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

function criandoEstados(ori, cam, che) {
  var teste;
  var testada;
  var novaORI = [];
  var novaCHEZ = [];
  var novaCHE = [];
  var uni;
  var duni;
  var split;
  var contSplit=0;
  novaORI = che.slice();

  for (let i = 0; i < novaORI.length; i++) {
    //para pegar respostas separadas
    split = novaORI[i].split(',').filter(Boolean)
    //aqui ele pega o split caso exista uma separação
    //e entao arquiva as respostas com o caminho 0
    //depois com o caminho 1
    if (split.length > 1) {
      
      for (let j = 0; j < ori.length; j++) {
        if (split[contSplit] == ori[j] && cam[j] == alfabeto[1]) {
          novaCHEZ.push(che[j]);
          
          contSplit++;
          j=0;
        }
      }
      contSplit=0
        for(let j = 0; j<ori.length; j++){
         if (split[contSplit] == ori[j] && cam[j] == alfabeto[3]) {
          novaCHE.push(che[j]);
         
          contSplit++;
          j=0
        }
      }
      contSplit=0;
      //apos pegar as respostas separadas pelos caminhos 0 e 1
      //eu filtro 0(chez) em teste e 1(che)em testada
      //esse filter serve pra tirar null e undefined dos arrays
      teste = novaCHE.filter(Boolean)
      testada = novaCHEZ.filter(Boolean)
      //dou um set aqui para evitar de acontecer
      //duplicas que podem causar loop infinito
      teste = [...new Set(teste)]
      testada = [...new Set(testada)]
      //apos isso eu concateno os testes filtrados em outra variavel
      //dessa forma a variavel uni fica com todos os dados de teste concatenados
      //e a variavel duni fica com os dados de testada
        if(teste.length>1){
          for(let k = 0; k < teste.length;k++){
        uni = teste.join(",")
          }
        }else{
          uni = teste;
        }
        if(testada.length>1){
          for(let k = 0; k < testada.length;k++){
        duni = testada.join(",")
          }
        }else{
          duni = testada;
        }
        //aqui verificamos se já existe um estado
        //caso não exista ele é colocado no novaORI
        if(repetiu(uni,novaORI)){
          novaORI[i+1] = teste+'';
          novaORI.length = i+2 
        }
        if(repetiu(duni,novaORI)){
          novaORI[i+1] = testada+'';
          novaORI.length = i+2
        }
        //zeramos o novache e chez para podermos re usar
        //na proxima instancia do for
     novaCHE.length = 0;
     novaCHEZ.length = 0 ;
    }
  }
  return novaORI;
}

function repetiu(comparador, variavel){
  for(let k=0; k < variavel.length; k++){
    if(comparador == variavel[k]){
     
      return false;
    }
  }
  return true;
}

function gerarAFD(estado,origem,caminho,chegada){
  var afd = []
  var todosEstados = [];
  var novaCHE = [] ;
  var novaCHEZ = [] ;
  var contSplit=0;
  var testada;
  var teste;
  var uni;
  var duni;
  //esse for faz ter todos os estados pois a variavel estado
  //nao vem repetida e precisamos de 2 estados
  for(let i = 0; i<estado.length;i++){
    todosEstados.push(estado[i])
    todosEstados.push(estado[i])
  }
  //esse codigo é o mesmo do outro para gerar estados
  //o que muda é o final, portanto eu devo fazer uma
  //function desse codigo
   for (let i = 0; i < todosEstados.length; i++) {
      split = todosEstados[i].split(',').filter(Boolean)
    if (split.length > 1) {
      for (let j = 0; j < origem.length; j++) {
        if (split[contSplit] == origem[j] && caminho[j] == alfabeto[1]) {
          novaCHEZ.push(chegada[j]);
          contSplit++;
          j=0;
        }
      }
      contSplit=0
        for(let j = 0; j<origem.length; j++){
         if (split[contSplit] == origem[j] && caminho[j] == alfabeto[3]) {
          novaCHE.push(chegada[j]);
          contSplit++;
          j=0
        }
      }
      contSplit=0;
      teste = novaCHE.filter(Boolean)
      testada = novaCHEZ.filter(Boolean)
      teste = [...new Set(teste)]
      testada = [...new Set(testada)]
        if(teste.length>1){
          for(let k = 0; k < teste.length;k++){
        uni = teste.join(",")
          }
        }else{
          uni = teste;
        }
        if(testada.length>1){
          for(let k = 0; k < testada.length;k++){
        duni = testada.join(",")
          }
        }else{
          duni = testada;
        }
        novaCHE.length = 0;
        novaCHEZ.length = 0 ;
    //aqui é oque muda do codigo, ele da um push na afd
    //mas ele acaba gerando algumas duplicas
  afd.push("{"+todosEstados[i]+"}"+alfabeto[1]+"{"+duni+"}")
  afd.push("{"+todosEstados[i]+"}"+alfabeto[3]+"{"+uni+"}")
     
  }else{
  //isso ta aqui para fazer os primeiros estados
  if(caminho[i] == alfabeto[1]){
  afd.push("{"+todosEstados[i]+"}"+caminho[i]+"{"+chegada[i]+"}")

    }else if(caminho[i] == alfabeto[3]){
      afd.push("{"+todosEstados[i]+"}"+caminho[i]+"{"+chegada[i]+"}")

      }
    }
  }
  //esse set serve para tirar todas as duplicas da afd
      afd = [...new Set(afd)]

console.log(afd)
}
