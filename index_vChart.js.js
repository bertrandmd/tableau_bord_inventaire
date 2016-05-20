//requete XHR
function request(target,callback,arg) {
	var arg = arg || '';
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseText, arg);
			//document.getElementById("loader").style.display = "none";
		}
		else if (xhr.readyState < 4) {
			//document.getElementById("loader").style.display = "inline";
			if (xhr.status == 404){
				//document.getElementById("loader").style.display = "none";
				alert("Not found");
			}
		}
	};
	xhr.open("GET", target, true);
	xhr.send();
}
//functions de callback :
//afficher les datas recupérées
function showData(data) {
	console.log(data);
}
function returnData(data,arg) {
	window[arg] =  JSON.parse(data);
}
function returnDataAPI(data,arg) {
	//console.log(data.data);
	var response = JSON.parse(data)
	window[arg] =  response.data;
}
function filterData(data,arg,com) {
	function estEgal(element){
		return element[arg] == com;
	}
	var rep = data.filter(estEgal)
	console.log(rep[0]);
	return rep[0];
	/*if(rep[0]!==undefined){
		if(param === 'all'){return rep[0]}
		if(Array.isArray(param)){
			var newRep = {};
			for (val in param){
				//console.log(param[val]);
				var champ = param[val]
				newRep[champ] = rep[0][champ];
			}
			return newRep;
		}
		else {return rep[0][param]}
	}*/
}
var dataAdrr = "data/fakedata.json"
var dataAdrr2 = "data/fakedataSecteur2.json"

// mydata
request(dataAdrr, returnData, 'mydata');

// mydata2
request(dataAdrr2, returnData,'mydata2');


//var ip = 'http://127.0.0.1:3000'
var ip = 'http://172.16.18.146:3000'


var adrrX = ip + '/api/communes?pol=PM10'
request(adrrX, returnDataAPI,'mydata4');

var adrrX2 = ip + '/api/communesAnnee?annee=2012'
request(adrrX2, returnDataAPI,'mydata2012');

var adrrX3 = ip + '/api/communesAnnee?annee=2010'
request(adrrX3, returnDataAPI,'mydata2010');

//pour les secteurs :
var createXadrr = function(id,pol,annee,nom){
	var addrX = ip + '/api/communeSecteurs/' + id +'?pol=' + pol + '&annee=' + annee;
	nom?addrX += '&nom=' + nom:0;
	return addrX
}
var createXadrrPct = function(id,pol,annee,nom){
	var addrX = ip + '/api/communeSecteursPct/' + id +'?pol=' + pol + '&annee=' + annee;
	nom?addrX += '&nom=' + nom:0;
	return addrX
}

var createXadrrComAnnPol = function(id,pol,annee,nom){
	var addrX = ip + '/api/communeAnneePol/' + id +'?pol=' + pol + '&annee=' + annee;
	nom?addrX += '&nom=' + nom:0;
	return addrX
}
var createXadrrOrderPol = function(pol){
	var addrX = ip + '/api/ordrePol?pol=' + pol;
	return addrX
}





var ccc= createXadrrOrderPol(["PM10","PM2_5", "N2O", "NH3"])
//request(ccc, returnData,'def');

//parametres courants :
var currentNumCom = '34172'
var currentName = 'Montpellier'

var defautPol = ["PM10","PM2_5", "N2O", "NH3"];

//options
var options = {
	responsive : false,
	scales: {
		yAxes: [{
			display: true,
			ticks: {
			 	suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
				// OR //
				beginAtZero: true   // minimum value will be 0.
			}
		}]
	},
	title : {
		display : true,
		text : ""
	}
};
var options2 = {
	responsive : false,
	animation: {
	      duration: 1000,
	      onComplete: function () {
	        var self = this,
	            chartInstance = this.chart,
	            ctx = chartInstance.ctx;
console.log(ctx);
	        ctx.font = '18px Arial';
	        ctx.textAlign = "center";
	        ctx.fillStyle = "#ffffff";

	        Chart.helpers.each(self.data.datasets.forEach((dataset, datasetIndex) => {
	            var meta = self.getDatasetMeta(datasetIndex),
	                total = 0, //total values to compute fraction
	                labelxy = [],
	                offset = Math.PI / 2, //start sector from top
	                radius,
	                centerx,
	                centery,
	                lastend = 0; //prev arc's end line: starting with 0

	            for (var val of dataset.data) { total += val; }

	            Chart.helpers.each(meta.data.forEach((element, index) => {
	                radius = 0.9 * element._model.outerRadius - element._model.innerRadius;
	                centerx = element._model.x;
	                centery = element._model.y;
	                var thispart = dataset.data[index],
	                    arcsector = Math.PI * (2 * thispart / total);
	                if (element.hasValue() && dataset.data[index] > 0) {
	                  labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
	                }
	                else {
	                  labelxy.push(-1);
	                }
	                lastend += arcsector;
	            }), self)

	            var lradius = radius * 3 / 4;
	            for (var idx in labelxy) {
	              if (labelxy[idx] === -1) continue;
	              var langle = labelxy[idx],
	                  dx = centerx + lradius * Math.cos(langle),
	                  dy = centery + lradius * Math.sin(langle),
	                  val = Math.round(dataset.data[idx] / total * 100);
	              ctx.fillText(val + '%', dx, dy);
								console.log(val);
	            }

	        }), self);
	      }
	    },
	title : {
		display : true,
		text : ""
	}
};
var optColor = ["rgba(75,192,192,0.4)","rgba(75,45,192,0.4)"];

//Création du graphique
var createBar = function(cible, data, opt) {
	if(!opt){var opt = options}
	opt.title.text = data.title
	return new Chart(cible, {
		type: 'bar',
    data: data,
		options : opt
	});
}
//parser
var parseData = function(data,nom) {
	var labels = [];
	var datasets = [];
	var i = 0;
	for (annee in data.emi){
		//labels.push(annee)
		var output = {
			label : annee,
			data : []
		};
		var labelListe = [];
		for (pol in data.emi[annee]){
			labelListe.push(pol)
			output.data.push(data.emi[annee][pol])
		}
		if (labels.length == 0){ labels = labelListe}
		output.backgroundColor = optColor[i];
		datasets.push(output)
		i+=1
	}
	var datafinal = {
		title : nom,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}



//rajout ICARE
/*old sans param
var parseDataAnnee = function(data, nom) {
	var labels = ['PM10','NOX','CO2'];
	var datasets = [];
  var i = 0;
	for (annee in data){
		var output = {
			label : data[annee].annee_ref,
			idcom : data[annee].numcom,
			data : []
		};
		for (pol in labels){
			labels[pol]=='CO2'?output.data.push(data[annee][labels[pol]]/1000):
			output.data.push(data[annee][labels[pol]]);
		}
		output.backgroundColor = optColor[i];
		datasets.push(output)
		i+=1
	}
	var datafinal = {
		title : nom,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}*/

var parseDataAnnee = function(data, nom) {
	//recuperer le data de la réponse xhr => fait plus besoin de rajouter .data
	// => recuperer l'array du dropdown
	var labels = defautPol;
	console.log(labels);
	//for
	//var labels = ['PM10','NOX','CO2'];
	var datasets = [];
  var i = 0;
	for (annee in data){
		var output = {
			label : data[annee].annee_ref,
			idcom : data[annee].numcom,
			data : []
		};
		for (pol in labels){
			labels[pol]=='CO2'?output.data.push(data[annee][labels[pol]]/1000):
			output.data.push(data[annee][labels[pol]]);
		}
		output.backgroundColor = optColor[i];
		datasets.push(output)
		i+=1
	}
	var datafinal = {
		title : nom,
		labels : labels,
		datasets : datasets
	}
	//console.log(datafinal);
	return datafinal
}


//parser2
var parseData2 = function(data,nom) {
	var labels = ["AGRISY","ENERGIE","RETECI","TROUTE","AUTREST","INDUS"];
	var options = {
		backgroundColor : ["rgba(255,99,132,0.2)","rgba(179,181,198,0.2)"],
		borderColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"],
		pointBackgroundColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"],
		pointBorderColor : ["#fff", "#fff"],
		pointHoverBackgroundColor : ["#fff", "#fff"],
		pointHoverBorderColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"]
	}
	var datasets = [];
	var i = 0;
	for (annee in data.emi){
		console.log(annee);
		//return datasets
		//labels.push(annee)
		var output = {
			label : annee,
			data : []
		};
		var nomPol = 'nox';
		console.log(data.emi[annee][nomPol]);
		for (var j =0 ; j < data.emi[annee][nomPol].length ; j++){
			output.data.push(data.emi[annee][nomPol][j])

			output.backgroundColor = options.backgroundColor[i]
			output.borderColor = options.borderColor[i]
			output.pointBackgroundColor = options.pointBackgroundColor[i]
			output.pointBorderColor = options.pointBorderColor[i]
			output.pointHoverBackgroundColor = options.pointHoverBackgroundColor[i]
			output.pointHoverBorderColor = options.pointHoverBorderColor[i]

	}
		datasets.push(output)
		i+=1
	}

	var datafinal = {
		title : nom + ' ' + nomPol,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}

//parseData2X(final,nom)
//parser2 ICARE
var parseData2X = function(data,nom) {
	var labels = ["AGRISY","ENERGIE","RETECI","TROUTE","AUTREST","INDUS"];
	var options = {
		backgroundColor : ["rgba(255,99,132,0.2)","rgba(179,181,198,0.2)"],
		borderColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"],
		pointBackgroundColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"],
		pointBorderColor : ["#fff", "#fff"],
		pointHoverBackgroundColor : ["#fff", "#fff"],
		pointHoverBorderColor : ["rgba(255,99,132,1)","rgba(179,181,198,1)"]
	}
	var datasets = [];
	var i = 0;
	for (annee in data){
		console.log(annee);
		//return datasets
		//labels.push(annee)
		var output = {
			label : data[annee].annee_ref,
			data : []
		};
		var nomPol = data[annee].polluant;
		//console.log(data.emi[annee][nomPol]);

		output.data = [data[annee]['AGRISY_PCT'],data[annee]['NON_FR_PCT'],data[annee]['RETECI_PCT'],data[annee]['TROUTE_PCT'],data[annee]['AUTREST_PCT'],data[annee]['INDUST_PCT']]
		console.log(output.data);
		//var nomPol = 'nox';
		//console.log(data.emi[annee][nomPol]);
		//for (var j =0 ; j < data.emi[annee][nomPol].length ; j++){
			//output.data.push(data.emi[annee][nomPol][j])

			output.backgroundColor = options.backgroundColor[i]
			output.borderColor = options.borderColor[i]
			output.pointBackgroundColor = options.pointBackgroundColor[i]
			output.pointBorderColor = options.pointBorderColor[i]
			output.pointHoverBackgroundColor = options.pointHoverBackgroundColor[i]
			output.pointHoverBorderColor = options.pointHoverBorderColor[i]

	//}
		datasets.push(output)
		i+=1
	}

	var datafinal = {
		title : nom + ' ' + nomPol,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}


//parser3
var parseData3 = function(data,nom) {
	var labels = ["AGRISY","ENERGIE","RETECI","TROUTE","AUTREST","INDUS"];
	var options = {
		backgroundColor: [
			"#FF6384",
			"#36A2EB",
			"#FFCE56",
			"#42eb89",
			"#BCA5D7",
			"#b5dbf7"
		],
		hoverBackgroundColor: [
				"#FF6384",
				"#36A2EB",
				"#FFCE56",
				"#42eb89",
				"#BCA5D7",
				"#b5dbf7"
		]
	}
	var datasets = [];
	var i = 0;
	for (annee in data.emi){
		console.log(annee);
		//return datasets
		//labels.push(annee)
		var output = {
			label : annee,
			data : []
		};
		var nomPol = 'nox';
		console.log(data.emi[annee][nomPol]);
		for (var j =0 ; j < data.emi[annee][nomPol].length ; j++){
			output.data.push(data.emi[annee][nomPol][j])

			output.backgroundColor = options.backgroundColor
			output.pointHoverBackgroundColor = options.pointHoverBackgroundColor
	}
		datasets.push(output)
		i+=1
	}
	datasets.pop()
	var datafinal = {
		title : nom + ' ' + nomPol,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}

//parser3 ICARE
var parseData3XX = function(data,nom) {
	var labels = ["AGRISY","ENERGIE","RETECI","TROUTE","AUTREST","INDUS"];
	var options = {
		backgroundColor: [
			"#FF6384",
			"#36A2EB",
			"#FFCE56",
			"#42eb89",
			"#BCA5D7",
			"#b5dbf7"
		],
		hoverBackgroundColor: [
				"#FF6384",
				"#36A2EB",
				"#FFCE56",
				"#42eb89",
				"#BCA5D7",
				"#b5dbf7"
		]
	}
	var datasets = [];
	//console.log(data);
	var annee = data.annee_ref;

		var output = {
			label : annee,
			data : []
		};
		var nomPol = data.polluant;
		//console.log(data.emi[annee][nomPol]);

		output.data = [data['AGRISY'],data['NON_FR'],data['RETECI'],data['TROUTE'],data['AUTREST'],data['INDUST']]

		output.backgroundColor = options.backgroundColor
		output.pointHoverBackgroundColor = options.pointHoverBackgroundColor

		datasets.push(output)
		//i+=1

	//datasets.pop()
	var datafinal = {
		title : nom + ' ' + nomPol + ' ' + annee,
		labels : labels,
		datasets : datasets
	}
	console.log(datafinal);
	return datafinal
}

var dataCom = {
	com : "Montpellier",
	emi : {
		pol2010 : {
			nox : 50,
			pm10 : 17,
			cov : 58
		},
		pol2012 : {
			nox : 150,
			pm10 : 4,
			cov : 478
		}
	}
}
var dataRadar = {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};

//Création du graphique
var createRadar = function(cible, data, opt) {
	if(!opt){var opt = options}
	opt.title.text = data.title
	return new Chart(cible, {
		type: 'radar',
    data: data,
		options : opt
	});
}
//Création du graphique
var createDonut = function(cible, data, opt) {
	if(!opt){var opt = options}
	opt.title.text = data.title
	return new Chart(cible, {
		type: 'pie',//'doughnut',
    data: data,
		options : opt
	});
}


var dataPie = {
    labels: [
        "Red",
        "Green",
        "Yellow"
    ],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
};



//init :
var ctx = document.getElementById("myChart").getContext("2d");
var ctx2 = document.getElementById("myChart2").getContext("2d");
var ctx3 = document.getElementById("myChart3").getContext("2d");
var data3 = parseData(dataCom);
var graph1 = createBar(ctx, data3, options)
var graph2 = createRadar(ctx2, dataRadar,options2)
var graph3 = createDonut(ctx3, dataPie,options2)

setGraph1(currentNumCom, 'NOX', '2012',currentName);
setGraph2(currentNumCom, 'NOX', '2012',currentName);
setGraph3(currentNumCom, 'NOX', '2012',currentName);
//majIndicateurs(commune2010,commune2012,pop2010,pop2012,surf,"NOX",nom)


/*var myRadarChart = new Chart(ctx2, {
    type: 'radar',
    data: dataRadar,
    options: options
});
// For a pie chart
var myPieChart = new Chart(ctx3,{
    type: 'doughnut',//pie
    data: dataPie,
    options: options
});*/


//map
//style
var myStyle = {
		"weight": 1.5,
		"opacity": 1,
		"fillOpacity": 0.1
		};

//layers : (appel Ajax via plugin L.geoJson.ajax() et plus avec Jquery ($.getJSON())
var communes = L.geoJson.ajax("data/communes_wgs84.geojson",{
	onEachFeature:onEachFeature,
	style:myStyle
});
var comcom = L.geoJson.ajax("data/comcom_wgs84.geojson",{
	nom: "comcom",
	style: myStyle,
	onEachFeature:onEachFeature
});
var dpt =  L.geoJson.ajax("data/departements_wgs84.geojson",{
	nom: "region",
	style: myStyle,
	onEachFeature:onEachFeature
});
var reg =  L.geoJson.ajax("data/region_wgs84.geojson",{
	nom: "region",
	style: myStyle,
	onEachFeature:onEachFeature
});
//layer de points pour jointures spatiales avec turf.js
//possibilité de le générer à la volée, mais prend trop de ressources
//donc à générer en amont (1 points par communes, le point devant être obligatoirement à l'intérieur du polygone de la commune (! : pas centroide))
var communesPoints = L.geoJson.ajax("data/communesPoints_wgs84.geojson",{
});
var overlayMaps = {
		"communes" : communes,
		"Com. de Com.": comcom,
		"Départements": dpt,
		"Région": reg
};




//Base Maps
var osm = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');
//Initialisation de la map
	var map = L.map('map', {
		//center: [43.58238046828168,3.900146484375],
		//zoom: 5
		layers : [osm,communes]
	});
	var center = [43.667871610117494,3.2684326171875]
	map.setView(center, 8);
	var control = L.control.layers(overlayMaps,{}, {
		collapsed:false
		});
	control.addTo(map)

	function highlightFeature(e) {
		var layer = e.target;
		//maj de l'infobox
		if (layer.feature.properties && layer.feature.properties.REGION_Nom){ var nom_entite = layer.feature.properties.REGION_Nom}
		else if (layer.feature.properties && layer.feature.properties.NOM){ var nom_entite = layer.feature.properties.NOM}
		else if (layer.feature.properties && layer.feature.properties.NomUU){ var nom_entite = layer.feature.properties.NomUU}
		else if (layer.feature.properties && layer.feature.properties.Nom){ var nom_entite = layer.feature.properties.Nom}
		else if (layer.feature.properties && layer.feature.properties.comcom_nom){ var nom_entite = layer.feature.properties.comcom_nom}
		else if (layer.feature.properties && layer.feature.properties.Dpt_Nom){ var nom_entite = layer.feature.properties.Dpt_Nom}
		else {var nom_entite = 'erreur'}
		info.update(nom_entite);
		//si l'objet n'est pas sélectionné
		/*if (e.target.feature.properties["selection"] != true ){
			//sauvegarde des anciens parametres :
			//contour
			e.target.feature.properties["stroke"] = e.target.options.color;
			e.target.feature.properties["stroke-width"] = e.target.options.weight;
			e.target.feature.properties["stroke-opacity"] = e.target.options.opacity;
			//fond
			e.target.feature.properties["fill"] = e.target.options.fillColor;
			e.target.feature.properties["fill-opacity"] = e.target.options.fillOpacity;
			e.target.feature.properties["dashArray"] = e.target.options.dashArray;
		}*/
		//Style 'survol'
		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});
	}

	function resetHighlight(e) {
		var layer = e.target;
		//maj de l'infobox (sans paramètres)
		info.update();
		communes.resetStyle(e.target);/*
		//si l'objet est sélectionné
		if (e.target.feature.properties["selection"] == true){
			//Applique le style 'selected'
			layer.setStyle({
				weight: 5,
				color: 'red',
				dashArray: '',
				fillOpacity: 0.2
			});
		}
		//si l'objet n'est pas sélectionné, applique son style d'origine
		else {
			layer.setStyle({
				weight: e.target.feature.properties["stroke-width"],
				color: e.target.feature.properties["stroke"],
				dashArray: e.target.feature.properties["dashArray"],
				fillOpacity: e.target.feature.properties["fill-opacity"]
			});
		}*/
	}
function setGraph1(com,pol,annee,nom){
	//filtre la liste des communes&polluants => comme un tableau
	//var commune2010 = filterData(mydata2010,"numcom",com);
	//var commune2012 = filterData(mydata2012,"numcom",com);
	//var dataCom = [commune2010,commune2012];

	//var data = parseData(commune,nom);
	//var data = parseDataAnnee(dataCom,nom);
	var bbb = createXadrrComAnnPol(com,defautPol,"2010",nom)

	request(bbb, function(data){
		var response = JSON.parse(data)
		valueCom_ =  response.data;
		console.log(valueCom_);

		var ddd = createXadrrComAnnPol(com,defautPol,"2012")
		request(ddd,function(data, valueCom_){
			var response = JSON.parse(data)
			valueCom2 =  response.data;
			var final = [valueCom_,valueCom2]
			var data = parseDataAnnee(final,nom);
			graph1.destroy()
			graph1 = createBar(ctx, data, options)
				},valueCom_)

	});
}

function setGraph2(com,pol,annee,nom){
	var adx = createXadrr(com, pol, annee,nom);
	var valueCom ;
	request(adx, function(data){
		var response = JSON.parse(data)
		valueCom =  response.data;
		console.log(valueCom);
		tableData(valueCom)
		var data3 = parseData3XX(valueCom,nom);
		graph3.destroy()
		graph3 = createDonut(ctx3, data3, options2)
	});
}

function setGraph3(com,pol,annee,nom){
	var adx = createXadrrPct(com, pol, '2012',nom);
	request(adx, function(data){
		var response = JSON.parse(data)
		valueCom_ =  response.data;
		console.log(valueCom_);
		var adx2 = createXadrrPct(com, pol, '2010',nom);
		request(adx2,function(data, valueCom_){
			console.log(valueCom_);
			var response = JSON.parse(data)
			valueCom2 =  response.data;
			var final = [valueCom_,valueCom2]
			console.log(final);
			var data2 = parseData2X(final,nom);
			console.log(data2);
			graph2.destroy()
			graph2 = createRadar(ctx2, data2, options2)
		},valueCom_)
	});
}

function majIndicateurs(commune2010,commune2012,pop2010,pop2012,surf,pol,nom){
	var bbx = document.getElementById("indicateurs");
	var emi2010 = commune2010[pol];
	var emi2012 = commune2012[pol];
	var txt = '<b>' + nom + ' :</b><br> Emissions de ' + pol + '<br>2010 :  ' + emi2010 + ' T/an soit ' + Math.round(emi2010/pop2010*1000)/1000 + ' T/hab/an ou ' + Math.round(emi2010/surf*1000)/1000 + ' T/km2/an<br>' + '2012 :  ' + emi2012 + ' T/an soit ' + Math.round(emi2012/pop2012*1000)/1000 + ' T/hab/an ou ' + Math.round(emi2012/surf*1000)/1000 + ' T/km2/an' ;
	bbx.innerHTML = txt
}
//http://stackoverflow.com/questions/33363373/how-to-display-pie-chart-data-values-of-each-slice-in-chart-js?rq=1
function drawSegmentValues()
{
    for(var i=0; i<myPieChart.segments.length; i++)
    {
        // Default properties for text (size is scaled)
        ctx.fillStyle="white";
        var textSize = canvas.width/10;
        ctx.font= textSize+"px Verdana";

        // Get needed variables
        var value = myPieChart.segments[i].value;
        var startAngle = myPieChart.segments[i].startAngle;
        var endAngle = myPieChart.segments[i].endAngle;
        var middleAngle = startAngle + ((endAngle - startAngle)/2);

        // Compute text location
        var posX = (radius/2) * Math.cos(middleAngle) + midX;
        var posY = (radius/2) * Math.sin(middleAngle) + midY;

        // Text offside to middle of text
        var w_offset = ctx.measureText(value).width/2;
        var h_offset = textSize/4;

        ctx.fillText(value, posX - w_offset, posY + h_offset);
    }
}



	function onClick(e) {
		console.log(e.target.feature.properties);
		//recupere les properties depuis le geoJson
		var com = e.target.feature.properties.Commune
		var nom = e.target.feature.properties.Nom
		var pop2010 = e.target.feature.properties.Pop2010
		var pop2012 = e.target.feature.properties.Pop2012
		var surf = e.target.feature.properties.surf_km



		//fakedata
		//var commune = filterData(mydata,"commune",com);
		//var commune2 = filterData(mydata2,"commune",com);

		//filtre la liste des communes&polluants => comme un tableau
		var commune2010 = filterData(mydata2010,"numcom",com);
		var commune2012 = filterData(mydata2012,"numcom",com);
		//var dataCom = [commune2010,commune2012];

		//var data = parseData(commune,nom);
		//var data = parseDataAnnee(dataCom,nom);

/*
		//Définition du périmètre d'après objets selectionnés
		//===================================================
		//turf.filter => resultat = turf.filter(features, key, value)
		//params : features : collection d'objets à filtrer
		//key = "selection" : attribut à filtrer
		//value = true : valeur de l'attribut "selection" de chaque objet 'cliqué'
			var perim = [];
			//recupère les layers actifs
			var overlayLayers = control.getActiveOverlayLayers()
			//pour chaque layer actif on filtre les objets selectionnés
			for (var overlayId in overlayLayers) {
				var fc = overlayLayers[overlayId].layer.toGeoJSON()
				var filt = turf.filter(fc, "selection", true);
				//on rajoute chaque objet filtré à [perim]
				for (var feat in filt.features) {
					perim.push(filt.features[feat])
				}
				//on retire le layer de la carte
				map.removeLayer(overlayLayers[overlayId].layer);
				//reset la couleur du layer grace à "stroke" (si le layer select n'est pas vide)
				if(filt.features[feat]){
					overlayLayers[overlayId].layer.setStyle({
						color : filt.features[feat].properties.stroke,
						weight: filt.features[feat].properties["stroke-width"],
						opacity: filt.features[feat].properties["stroke-opacity"],
						fillOpacity: filt.features[feat].properties["fill-opacity"]
						});
				}
			}
*/
			//Si le layer est différent de communes :
			if(
				e.target.feature.properties && e.target.feature.properties.comcom_nom ||
				e.target.feature.properties && e.target.feature.properties.Dpt_Nom ||
				e.target.feature.properties && e.target.feature.properties.REGION_Nom){
			//var listeCom = []; //<-- {objet} communes du périmètre
			var listeComLight = []; //<-- code insee des communes du périmètre
			var comPoint = communesPoints.toGeoJSON();
			for (point in comPoint.features){
				if (turf.inside(comPoint.features[point],e.target.feature) == true){
					//listeCom.push(comPoint.features[point]);// <-- recupere toutes les communes sous forme d'objet (plus lourd)
					listeComLight.push(comPoint.features[point].properties.insee_com);// <-- recupere que le code insee de la commune
					}
				}
				console.log(listeComLight);


				//var adrrX3 =createXadrrComAnnPol(listeComLight,'NOX','2012')
				//request(adrrX3, returnDataAPI,'mydata2010');

				com = listeComLight;
				nom = e.target.feature.properties.comcom_nom?e.target.feature.properties.comcom_nom:e.target.feature.properties.Dpt_Nom?e.target.feature.properties.Dpt_Nom
				:e.target.feature.properties.REGION_Nom?e.target.feature.properties.REGION_Nom:0;
			}



					//maj des valeurs courantes => pour la maj via le dropdown (à améliorer)
					currentNumCom = com ;
					currentName = nom ;




		//secteurs :
		setGraph1(com, 'NOX', '2012',nom);


		//secteurs :
		setGraph2(com, 'NOX', '2012',nom);

		//console.log(valueCom);
		setGraph3(com, 'NOX', '2012',nom);

		//var data2 = parseData2(commune2,nom);
		//var data3 = parseData3(commune2,nom);
		//console.log(data2);
		//graph1.destroy()
		//graph1 = createBar(ctx, data, options)
		//graph2.destroy()
		//graph2 = createRadar(ctx2, data2, options2)
		//graph3.destroy()
		//graph3 = createDonut(ctx3, data3, options2)
		majIndicateurs(commune2010,commune2012,pop2010,pop2012,surf,"NOX",nom)
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click : onClick
		});
	}

document.getElementById("myChart").onclick = function(evt){
    var activePoints = graph1.getElementAtEvent(evt);
		console.log(activePoints[0]);
    /* this is where we check if event has keys which means is not empty space */
    if(Object.keys(activePoints).length > 0)
    {
        var label = activePoints[0]["label"];
        var value = activePoints[0]["value"];
        var url = "http://example.com/?label=" + label + "&value=" + value
        /* process your url ... */
				//var com =  activePoints[0]._chart.config.data.datasets[0].idcom;
				//mod pour prise en compte d'un array
				var com = currentNumCom;
				var pol = activePoints[0]._model.label;
				var annee = activePoints[0]._model.datasetLabel;
				var nom = activePoints[0]._chart.config.data.title;
				console.log(com, pol, annee, nom);
				setGraph2(com, pol, annee, nom);
				//setGraph2(com, 'NOX', '2012');
				setGraph3(com, pol, annee, nom);

    }
};

	ctx.onclick = function(evt){
    var activePoints = graph1.getElementAtEvent(evt);
		console.log(activePoints);
    // => activePoints is an array of points on the canvas that are at the same position as the click event.
};

//Info box
info = L.control().setPosition('topleft');
info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
};
info.update = function (props) {
		this._div.innerHTML =  (props ?
				'<b>' + props + '</b>'
				: '...');
};
info.addTo(map);

//Setup de dataTable.js
//============================================
//bug a l'init, change testdata = filtered.features
//communesPoints.toGeoJSON();
function tableData(data){
	data = [{ numcom: "34154", polluant: "NOX", annee_ref: "2012", AGRISY_PCT: 1.00780327679647, AUTREST_PCT: 6.39063965837049, INDUST_PCT: 0.668289752980191, NON_FR_PCT: 5.64012820944574, RETECI_PCT: null, TROUTE_PCT: 86.293138799149 }]
var testdata = data
console.log(data);
table = $('#table_id').dataTable({
		"aaData": testdata,
		"aoColumns": [
				{ "mDataProp": "polluant" },
				{ "mDataProp": "numcom" },
				{ "mDataProp": "annee_ref" },
				{ "mDataProp": "INDUST_PCT" },
				{ "mDataProp": "RETECI_PCT" },
				{ "mDataProp": "TROUTE_PCT" }
		]
});
}
//Dropdown menu
var arr =  ['PM10','NOX','CO2','PM2_5', 'N2O', 'NH3'];
var valueCheck = defautPol
var arrChoice = defautPol;
$.each(arr, function(index, value) {
		//var options = valueCheck.indexOf(value)>-1?{ type: 'checkbox', value: value, checked: true}:{ type: 'checkbox', value: value};
		if(valueCheck.indexOf(value)>-1){
			var options = { type: 'checkbox', value: value, checked: true};
			var	title = value + ",";
			var html = '<span title="' + title + '">' + title + '</span>';
    	$('.multiSel').append(html);
		} else {
			var options = { type: 'checkbox', value: value};
		}

		var $x = $('<li/>');
		var $y = $('<input />', options );
		$x.append($y,value);
		//$x.text(value)
		$('#polluantCbx').append($x);//.text(value);
    //$('#polluantCbx').append($('<li><input>').text(value).attr('value', value));
});
/*
	Dropdown with Multiple checkbox select with jQuery - May 27, 2013
	(c) 2013 @ElmahdiMahmoud
	license: http://www.opensource.org/licenses/mit-license.php
*/

$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).val() + ",";

  if ($(this).is(':checked')) {
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
		arrChoice.push($(this).val())

    $(".hida").hide();
  } else {
    $('span[title="' + title + '"]').remove();
		var index = arrChoice.indexOf($(this).val());
		arrChoice.splice(index, 1);
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);

  }

	console.log(arrChoice);
	defautPol = arrChoice
	console.log(currentName);
	setGraph1(currentNumCom, 'NOX', '2012',currentName);
});
