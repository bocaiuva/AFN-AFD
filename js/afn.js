var alfabeto, inicial = [], final = [], estados = [], $ = go.GraphObject.make, model = $(go.GraphLinksModel),
  notherModel = $(go.GraphLinksModel);
var origem = [], caminho = [], chegada = [];

function dividir() {
  skeleton();
  afnSkeleton();
  var entrada = document.getElementById("afn").value, arrayLi = entrada.split('\n');
  for (var i = 0; i < arrayLi.length; i++) {
    mkDia(arrayLi[i].split(':'))
  }
  var novoEstado = criandoEstados(origem, caminho, chegada);
  gerarAFD(novoEstado, origem, caminho, chegada)
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
            model.addLinkData({ from: est[0], to: estatinhos[i], text: est[1] });
          }
        }
      }
      model.addLinkData({ from: est[0], to: est[2], text: est[1] });
    }
  }
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
  var contSplit = 0;
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
          j = 0;
        }
      }
      contSplit = 0
      for (let j = 0; j < ori.length; j++) {
        if (split[contSplit] == ori[j] && cam[j] == alfabeto[3]) {
          novaCHE.push(che[j]);

          contSplit++;
          j = 0
        }
      }
      contSplit = 0;
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
      if (teste.length > 1) {
        for (let k = 0; k < teste.length; k++) {
          uni = teste.join(",")
        }
      } else {
        uni = teste;
      }
      if (testada.length > 1) {
        for (let k = 0; k < testada.length; k++) {
          duni = testada.join(",")
        }
      } else {
        duni = testada;
      }
      //aqui verificamos se já existe um estado
      //caso não exista ele é colocado no novaORI
      if (repetiu(uni, novaORI)) {
        novaORI[i + 1] = teste + '';
        novaORI.length = i + 2
      }
      if (repetiu(duni, novaORI)) {
        novaORI[i + 1] = testada + '';
        novaORI.length = i + 2
      }
      //zeramos o novache e chez para podermos re usar
      //na proxima instancia do for
      novaCHE.length = 0;
      novaCHEZ.length = 0;
    }
  }
  return novaORI;
}

function repetiu(comparador, variavel) {
  for (let k = 0; k < variavel.length; k++) {
    if (comparador == variavel[k]) {

      return false;
    }
  }
  return true;
}

function gerarAFD(estado, origem, caminho, chegada) {
  var afd = [], todosEstados = [], novaCHE = [], novaCHEZ = [], contSplit = 0, testada, teste, uni, duni, states = [], linkObjArr = [], linkObj;
  afd.push("AB:" + alfabeto);
  afd.push("<br>i: ");
  afd.push("<br>f: ");
  //esse for faz ter todos os estados pois a variavel estado
  //nao vem repetida e precisamos de 2 estados
  for (let i = 0; i < estado.length; i++) {
    todosEstados.push(estado[i].trim());
    todosEstados.push(estado[i].trim());
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
          j = 0;
        }
      }
      contSplit = 0
      for (let j = 0; j < origem.length; j++) {
        if (split[contSplit] == origem[j] && caminho[j] == alfabeto[3]) {
          novaCHE.push(chegada[j]);
          contSplit++;
          j = 0
        }
      }
      contSplit = 0;
      teste = novaCHE.filter(Boolean)
      testada = novaCHEZ.filter(Boolean)
      teste = [...new Set(teste)]
      testada = [...new Set(testada)]
      if (teste.length > 1) {
        for (let k = 0; k < teste.length; k++) {
          uni = teste.join(",")
        }
      } else {
        uni = teste;
      }
      if (testada.length > 1) {
        for (let k = 0; k < testada.length; k++) {
          duni = testada.join(",")
        }
      } else {
        duni = testada;
      }
      novaCHE.length = 0;
      novaCHEZ.length = 0;
      //aqui é oque muda do codigo, ele da um push na afd
      //mas ele acaba gerando algumas duplicas

      afd.push("<br>{ " + todosEstados[i] + " } " + alfabeto[1] + " { " + duni + " }")
      afd.push("<br>{ " + todosEstados[i] + " } " + alfabeto[3] + " { " + uni + " }")

      linkObj = todosEstados[i].toString() + ',' + duni.toString() + ',' + alfabeto[1];
      if (!linkObjArr.includes(linkObj)) {
        notherModel.addLinkData({ from: todosEstados[i].toString(), to: duni.toString(), text: alfabeto[1] });
        linkObjArr.push(linkObj);
      }

      linkObj = todosEstados[i].toString() + ',' + uni.toString() + ',' + alfabeto[3];
      if (!linkObjArr.includes(linkObj)) {
        notherModel.addLinkData({ from: todosEstados[i].toString(), to: uni.toString(), text: alfabeto[3] });
        linkObjArr.push(linkObj);
      }

      if (!states.includes(todosEstados[i])) {
        if (todosEstados[i].includes(final)) {
          notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i], fig: "Ring" });
          afd[2] = afd[2] + '{ ' + todosEstados[i] + ' }';
        } else {
          notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i] });
        }
          if (inicial.includes(todosEstados[i])) {
            afd[1] = afd[1] + '{ ' + todosEstados[i] + ' }';
            notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            notherModel.addLinkData({ from: 'ini', to: todosEstados[i].toString(), text: '' });
        }  
        states.push(todosEstados[i]);
      }

      if (!states.includes(uni[0])) {
        if (uni[0].includes(final)) {
          notherModel.addNodeData({ key: uni.toString(), name: uni, fig: "Ring" });
          afd[2] = afd[2] + '{ ' + uni[i] + ' }';
        } else {
          notherModel.addNodeData({ key: uni.toString(), name: uni });
        }
        if (inicial.includes(uni[0])) {
          afd[1] = afd[1] + '{ ' + uni[0] + ' }';
          notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
          notherModel.addLinkData({ from: 'ini', to: uni[0].toString(), text: '' });
        } 
         
        states.push(uni[0]);
      }

      if (!states.includes(duni[0])) {
        if (todosEstados[i].includes(final)) {
          notherModel.addNodeData({ key: duni.toString(), name: duni, fig: "Ring" });
          afd[2] = afd[2] + '{ ' + duni[i] + ' }';
        } else {
          notherModel.addNodeData({ key: duni.toString(), name: duni });

        } 
        if (inicial.includes(duni[0])) {
          afd[1] = afd[1] + '{ ' + duni[0] + ' }';
          notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
          notherModel.addLinkData({ from: 'ini', to: duni[0].toString(), text: '' });
        } 
          
        states.push(duni[0]);
      }

    } else {
      //isso ta aqui para fazer os primeiros estados
      if (caminho[i] == alfabeto[1]) {
        if (!states.includes(todosEstados[i])) {
          if (todosEstados[i].includes(final)) {
            notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i], fig: "Ring" });
            afd[2] = afd[2] + '{ ' + todosEstados[i] + ' }';
          } else {
            notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i] });
          }
          if (inicial.includes(todosEstados[i])) {
            afd[1] = afd[1] + '{ ' + todosEstados[i] + ' }';
            notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            notherModel.addLinkData({ from: 'ini', to: todosEstados[i].toString(), text: '' });
          } 
            
          states.push(todosEstados[i]);
        }

        if (!states.includes(chegada[i])) {
          if (chegada[i].includes(final)) {
            notherModel.addNodeData({ key: chegada[i].toString(), name: chegada[i], fig: "Ring" });
            afd[2] = afd[2] + '{ ' + chegada[i] + ' }';
          }  else {
            notherModel.addNodeData({ key: chegada[i].toString(), name: chegada[i] });
          }
          if (inicial.includes(chegada[i])) {
            afd[1] = afd[1] + '{ ' + chegada[i] + ' }';
            notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            notherModel.addLinkData({ from: 'ini', to: chegada[i].toString(), text: '' });
          }
            
          states.push(chegada[i]);
        }
        linkObj = todosEstados[i].toString() + ',' + chegada[i].toString() + ',' + caminho[i];
        if (!linkObjArr.includes(linkObj)) {
          notherModel.addLinkData({ from: todosEstados[i].toString(), to: chegada[i].toString(), text: caminho[i] });
          linkObjArr.push(linkObj);

          afd.push("<br>{ " + todosEstados[i] + " } " + caminho[i] + " { " + chegada[i] + " }")
        }
      } else if (caminho[i] == alfabeto[3]) {
        if (!states.includes(todosEstados[i])) {
          if (todosEstados[i].includes(final)) {
            notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i], fig: "Ring" });
            afd[2] = afd[2] + '{ ' + todosEstados[i] + ' }';
          } else {
            notherModel.addNodeData({ key: todosEstados[i].toString(), name: todosEstados[i] });
          }
          if (inicial.includes(todosEstados[i])) {
            afd[1] = afd[1] + '{ ' + todosEstados[i] + ' }';
            notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            notherModel.addLinkData({ from: 'ini', to: todosEstados[i].toString(), text: '' });
          }
          states.push(todosEstados[i]);
        }

        if (!states.includes(chegada[i])) {
          if (todosEstados[i].includes(final)) {
            notherModel.addNodeData({ key: chegada[i].toString(), name: chegada[i], fig: "Ring" });
            afd[2] = afd[2] + '{ ' + todosEstados[i] + ' }';
          } else {
            notherModel.addNodeData({ key: chegada[i].toString(), name: chegada[i] });
          }
          if (inicial.includes(chegada[i])) {
            afd[1] = afd[1] + '{ ' + chegada[i] + ' }';
            notherModel.addNodeData({ key: 'ini', name: '', fig: "BpmnActivityAdHoc" });
            notherModel.addLinkData({ from: 'ini', to: chegada[i].toString(), text: '' });
          }
          states.push(chegada[i]);
        }
        linkObj = todosEstados[i].toString() + ',' + chegada[i].toString() + ',' + caminho[i];
        if (!linkObjArr.includes(linkObj)) {
          notherModel.addLinkData({ from: todosEstados[i].toString(), to: chegada[i].toString(), text: caminho[i] });
          linkObjArr.push(linkObj);
          afd.push("<br>{ " + todosEstados[i] + " } " + caminho[i] + " { " + chegada[i] + " }")
        }
      }
    }
  }
  afd = [...new Set(afd)];
  document.getElementById("arqSaida").innerHTML = afd.join(" ");
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
}

function afnSkeleton() {
  var diagram = $(go.Diagram, "afdDiv");
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "Circle",
        {
          fill: $(go.Brush, "Linear", { 0: "rgb(240, 98, 150)", 1: "rgb(232, 60, 123)" }),
          stroke: null,
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
        }, new go.Binding("figure", "fig")),

      $(go.TextBlock, "Default Text",
        { margin: 12, stroke: "black", font: "bold 16px sans-serif" },
        new go.Binding("text", "name"))
    );

  diagram.linkTemplate =
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

  diagram.model = notherModel;
  hideOnSkeleton();
}

function hideOnError() {
  document.getElementById("myDiagramDiv").style.display = "none";
  document.getElementById("headAFN").style.display = "none";
  document.getElementById("headAFD").style.display = "none";
  document.getElementById("headOut").style.display = "none";
  document.getElementById("arqSaida").style.display = "none";
  document.getElementById("afdDiv").style.display = "none";
  document.getElementById("divBtn").innerHTML = "";
  document.getElementById("divAfn").style.display = "none";
  document.getElementById("erro").innerHTML = "Oop. Formato errado, seu alfabeto é " + alfabeto;
  document.getElementById("erro").style.display = "block";
  document.getElementById("restart").style.display = "block";
}

function hideOnSkeleton() {
  document.getElementById("headAFN").style.display = "block";
  document.getElementById("headAFD").style.display = "block";
  document.getElementById("headOut").style.display = "block";
  document.getElementById("myDiagramDiv").style.display = "block";
  document.getElementById("afdDiv").style.display = "block";
  document.getElementById("arqSaida").style.display = "block";
  document.getElementById("restart").style.display = "block";
  document.getElementById("divBtn").innerHTML = "";
  document.getElementById("divAfn").style.display = "none";
}
