//requete XHR
function request(target,callback,arg) {
	var arg = arg || 'bite';
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


var adrrX = 'http://127.0.0.1:3000/api/communes?pol=PM10'
request(adrrX, returnDataAPI,'mydata4');

var adrrX2 = 'http://127.0.0.1:3000/api/communesAnnee?annee=2012'
request(adrrX2, returnDataAPI,'mydata2012');

var adrrX3 = 'http://127.0.0.1:3000/api/communesAnnee?annee=2010'
request(adrrX3, returnDataAPI,'mydata2010');

//pour les secteurs :
var createXadrr = function(id,pol,annee){
	var addrX = 'http://127.0.0.1:3000/api/communeSecteurs/' + id +'?pol=' + pol + '&annee=' + annee;
	return addrX
}
var createXadrrPct = function(id,pol,annee){
	var addrX = 'http://127.0.0.1:3000/api/communeSecteursPct/' + id +'?pol=' + pol + '&annee=' + annee;
	return addrX
}

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
var parseDataAnnee = function(data, nom) {
	var labels = ['PM10','NOX','CO2'];
	var datasets = [];
  var i = 0;
	for (annee in data){
		var output = {
			label : data[annee].annee_ref,
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

		output.data = [data[annee]['AGRISY_PCT'],data[annee]['NON_FR_PCT'],data[annee]['RETECI_PCT'],data[annee]['TROUTE_PCT'],data[annee]['AUTREST_PCT'],data[annee]['INDUS_PCT']]

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
	var annee = '2012';

		var output = {
			label : annee,
			data : []
		};
		var nomPol = data.polluant;
		//console.log(data.emi[annee][nomPol]);

		output.data = [data['AGRISY'],data['NON_FR'],data['RETECI'],data['TROUTE'],data['AUTREST'],data['INDUS']]

		output.backgroundColor = options.backgroundColor
		output.pointHoverBackgroundColor = options.pointHoverBackgroundColor

		datasets.push(output)
		//i+=1

	//datasets.pop()
	var datafinal = {
		title : nom + ' ' + nomPol,
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
		type: 'doughnut',
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
	function highlightFeature(e) {
		var layer = e.target;
		//maj de l'infobox
		if (layer.feature.properties && layer.feature.properties.NomAU){ var nom_entite = layer.feature.properties.NomAU}
		else if (layer.feature.properties && layer.feature.properties.NOM){ var nom_entite = layer.feature.properties.NOM}
		else if (layer.feature.properties && layer.feature.properties.NomUU){ var nom_entite = layer.feature.properties.NomUU}
		else if (layer.feature.properties && layer.feature.properties.Nom){ var nom_entite = layer.feature.properties.Nom}
		else if (layer.feature.properties && layer.feature.properties.comcom_nom){ var nom_entite = layer.feature.properties.comcom_nom}
		else if (layer.feature.properties && layer.feature.properties.NOM_UTEP){ var nom_entite = layer.feature.properties.NOM_UTEP}
		else {var nom_entite = 'erreur'}
		info.update(nom_entite);
		//si l'objet n'est pas sélectionné
		if (e.target.feature.properties["selection"] != true ){
			//sauvegarde des anciens parametres :
			//contour
			e.target.feature.properties["stroke"] = e.target.options.color;
			e.target.feature.properties["stroke-width"] = e.target.options.weight;
			e.target.feature.properties["stroke-opacity"] = e.target.options.opacity;
			//fond
			e.target.feature.properties["fill"] = e.target.options.fillColor;
			e.target.feature.properties["fill-opacity"] = e.target.options.fillOpacity;
			e.target.feature.properties["dashArray"] = e.target.options.dashArray;
		}
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
		}
	}

	function onClick(e) {
		console.log(e.target.feature.properties);
		var com = e.target.feature.properties.Commune
		var nom = e.target.feature.properties.Nom
		var commune = filterData(mydata,"commune",com);
		var commune2 = filterData(mydata2,"commune",com);

		var commune2010 = filterData(mydata2010,"numcom",com);
		var commune2012 = filterData(mydata2012,"numcom",com);
		var dataCom = [commune2010,commune2012];

		//var data = parseData(commune,nom);
		var data = parseDataAnnee(dataCom,nom);


		//secteurs :
		var adx = createXadrr(com, 'NOX', '2012');
		var valueCom ;
		request(adx, function(data){
			var response = JSON.parse(data)
			valueCom =  response.data;
			console.log(valueCom);
			var data3 = parseData3XX(valueCom,nom);
			graph3.destroy()
			graph3 = createDonut(ctx3, data3, options2)
		});
		//console.log(valueCom);
		var adx = createXadrrPct(com, 'NOX', '2012');
		request(adx, function(data){
			var response = JSON.parse(data)
			valueCom =  response.data;
			console.log(valueCom);
			var adx2 = createXadrrPct(com, 'NOX', '2010');
			request(adx2,function(data, valueCom){
				var response = JSON.parse(data)
				valueCom2 =  response.data;
				var final = [valueCom,valueCom2]
				console.log(final);
				var data2 = parseData2X(final,nom);
				console.log(data2);
				graph2.destroy()
				graph2 = createRadar(ctx2, data2, options2)
			},valueCom)
		});

		//var data2 = parseData2(commune2,nom);
		var data3 = parseData3(commune2,nom);
		//console.log(data2);
		graph1.destroy()
		graph1 = createBar(ctx, data, options)
		//graph2.destroy()
		//graph2 = createRadar(ctx2, data2, options2)
		//graph3.destroy()
		//graph3 = createDonut(ctx3, data3, options2)

	}

	function onEachFeature(feature, layer) {
		layer.on({
			//mouseover: highlightFeature,
			//mouseout: resetHighlight,
			click : onClick
		});
	}
