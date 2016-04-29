//requete XHR
function request(target,callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseText);
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
	xhr.send(null);
}
//functions de callback :
//afficher les datas recupérées
function showData(data) {
	console.log(data);
}
function returnData(data) {
	mydata = JSON.parse(data);
}
function filterData(data,com) {
	function estEgal(element){
		return element.commune == com;
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

var mydata;
request(dataAdrr, returnData);


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
var optColor = ["rgba(75,192,192,0.4)","rgba(75,45,192,0.4)"];

//Création du graphique
var createBar = function(cible, data, opt) {
	if(!opt){var opt = options}
	options.title.text = data.title
	return new Chart(cible, {
		type: 'bar',
    data: data,
		options : options
	});
}
//parser
var parseData = function(data) {
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
		title : data.commune,
		labels : labels,
		datasets : datasets
	}
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


//init :
var ctx = document.getElementById("myChart").getContext("2d");
var ctx2 = document.getElementById("myChart2").getContext("2d");
var data3 = parseData(dataCom);
var graph1 = createBar(ctx, data3, options)
//var graph2 = createBar(ctx2, data2)

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
		console.log(e.target.feature.properties.Commune);
		var com = e.target.feature.properties.Commune
		var commune = filterData(mydata,com);
		var data = parseData(commune);
		graph1.destroy()
		graph1 = createBar(ctx, data, options)
	}

	function onEachFeature(feature, layer) {
		layer.on({
			//mouseover: highlightFeature,
			//mouseout: resetHighlight,
			click : onClick
		});
	}
