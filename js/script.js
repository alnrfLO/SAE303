let dataByDept = {};

window.addEventListener("DOMContentLoaded", init, false);

function init() {
    /*Pour le const loading = document.getElementById("loading-message"); on est sur de l ia*/
    const loading = document.getElementById("loading-message");
    if (loading) loading.style.display = "block";

    d3.csv("data/barometre-representations-sociales-du-changement-climatique.csv", function (error, data) {

        if (error) {
            console.error("Erreur de chargement CSV:", error);
            throw error;
        }

        dataByDept = {};
        data.forEach(d => {
            if (d["Département"]) {
                let dept = d["Département"].trim();
                if (dept === "Corse-du-Sud" || dept === "Haute-Corse") dept = "Corse";

                if (!dataByDept[dept]) dataByDept[dept] = [];
                dataByDept[dept].push(d);
            }
        });

        if (loading) loading.style.display = "none";
        setupInteractivity();
        setupSearch();
    });
}

function selectDepartment(name) {
    if (!name) return;

    document.getElementById("dept-name").textContent = name.toUpperCase();
    const chartContainer = document.getElementById("chart");
    const data = dataByDept[name];

    if (!data) {
        chartContainer.innerHTML = "<p>Aucune donnée pour ce département.</p>";
        return;
    }

    chartContainer.innerHTML = "";
// j ai donner a une ia pour qu il me donne juste les donner que je doit recuperer , pas le code du tout juste quelle type de donner je devais recuperer 
    const configs = [
        { key: "S1. genre", type: "donut" },
        { key: "s17. Type habitat", type: "pie" },
        { key: "S2. âge", type: "bar" },
        { key: "s18. Statut locataire/propriétaire", type: "pie" }
    ];

    configs.forEach(conf => {
        const counts = {};
        data.forEach(d => {
            //pour eviter des ligne en plus betement j ai utiliser ? appeler operateur ternaire pour verifier si la cle exite bien avant de faire le trim
            const val = d[conf.key] ? d[conf.key].trim() : "N/A";
            counts[val] = (counts[val] || 0) + 1;
        });

        const div = document.createElement("div");
        div.className = "chart-box";
        div.innerHTML = `<svg width="350" height="300"></svg>`;
        chartContainer.appendChild(div);

        const svg = div.querySelector("svg");

        if (conf.type === "donut") renderDonut(svg, counts);
        else if (conf.type === "pie") renderPie(svg, counts);
        else if (conf.type === "bar") renderBar(svg, counts);
    });

    highlightSelected(name);
}

function renderPie(svgElement, dataObj) {
    const dataArray = Object.entries(dataObj).map(([label, value]) => ({ label, value }));
    const width = 350, height = 300, radius = 85;

    const svg = d3.select(svgElement);
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2 - 40})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.6);

    const total = d3.sum(dataArray, d => d.value);

    const arcs = g.selectAll("path")
        .data(pie(dataArray))
        .enter();

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#111");

    arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "#fff")
        .text(d => {
            const percent = (d.data.value / total) * 100;
            return percent >= 5
                ? `${d.data.value} (${Math.round(percent)}%)`
                : "";
        });

    addLegend(svg, dataArray, color);
}

/*cette fonction est generer par ia pour generer d autre type de graphique car je ne savais pas lequelle 
faire donc je lui ai dis en js fait moi une fonction pour faire un donut chart avec d3.js*/ 
function renderDonut(svgElement, dataObj) {
    const dataArray = Object.entries(dataObj).map(([label, value]) => ({ label, value }));
    const width = 350, height = 300, radius = 85;

    const svg = d3.select(svgElement);
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2 - 40})`);

    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(50).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(65).outerRadius(65);

    const total = d3.sum(dataArray, d => d.value);

    const arcs = g.selectAll("path")
        .data(pie(dataArray))
        .enter();

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#111");

    arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "#fff")
        .text(d => {
            const percent = (d.data.value / total) * 100;
            return percent >= 5
                ? `${d.data.value} (${Math.round(percent)}%)`
                : "";
        });

    addLegend(svg, dataArray, color);
}

/*cette fonction est ecrite a la mains mais j ai eu besoin d ia pour le raisonement rien na ete ecris pas de l ia 
par contre j ai du lui demander comment faire un bar chart avec d3.js et on ma dis etape par etape ce que je doit faire et j ai preciser de le faire sans donner de code bien sur 
*/
function renderBar(svgElement, dataObj) {
    const dataArray = Object.entries(dataObj).map(([label, value]) => ({ label, value }));
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const width = 350 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select(svgElement)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(dataArray.map(d => d.label))
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d.value)])
        .range([height, 0]);

    svg.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#00d2ff");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("fill", "#ccc");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .style("color", "#ccc");
}

function addLegend(svg, data, colorScale) {
    const legend = svg.append("g")
        .attr("transform", "translate(20, 210)");

    data.forEach((d, i) => {
        const lg = legend.append("g")
            .attr("transform", `translate(0, ${i * 18})`);

        lg.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(i));

        lg.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text(d.label)
            .style("font-size", "9px")
            .style("fill", "#ccc");
    });
}
//recuperer d un ancien projets ou j avais fait de l autocomplete sur une barre de recherche 
function setupSearch() {
    const input = document.getElementById("search");
    const suggestions = document.getElementById("autocomplete");

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase().trim();
        suggestions.innerHTML = "";
        if (value.length < 2) return;

        const names = Object.keys(dataByDept);
        const matches = names.filter(n => n.toLowerCase().includes(value)).slice(0, 10);

        matches.forEach(m => {
            const li = document.createElement("li");
            li.textContent = m;
            li.style.cursor = "pointer";
            li.addEventListener("click", () => {
                input.value = m;
                suggestions.innerHTML = "";
                selectDepartment(m);
            });
            suggestions.appendChild(li);
        });
    });

    document.addEventListener("click", e => {
        if (e.target !== input) suggestions.innerHTML = "";
    });
}

//pour la selection des departement sur la map j ai rajouter une ligne pour la corse car elle est diviser en 2 dans le svg mais je  veut la considerer comme un seul departement
function setupInteractivity() {
    document.querySelectorAll(".map__image path").forEach(path => {
        path.addEventListener("click", function () {
            let name = this.getAttribute("title");
            if (name && name.includes("Corse")) name = "Corse";
            selectDepartment(name);
        });
    });
}

function highlightSelected(selectedName) {
    document.querySelectorAll(".map__image path").forEach(d => {
        d.style.fill = "#111";
        const title = d.getAttribute("title");
        if (
            (selectedName === "Corse" && title && title.includes("Corse")) ||
            title === selectedName
        ) {
            d.style.fill = "#00d2ff";
            d.style.stroke = "#fff";
        }
    });
}
