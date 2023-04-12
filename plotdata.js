var show_data = null;

async function drawTopRating() {
    if (Object.is(show_data, null)) {
        show_data = await d3.json("http://localhost:5000/api/v1.0/shows");
    }
    // get user selection from dropdown
    var typeMenu = d3.select("#selComparisionType");
    var category = typeMenu.property("value");

    var data = [];
    // process data to group them by user selected category (rating and release_year)
    d3.group(show_data, d => d.show_type, d => d[category]) // group raw data by show type (TV/Movie) and user selected category
    .forEach((value, key) => {
        // for each loop through two types of shows (TV/Movie)
        var groupByAndCount = new Map(Array.from(value, ([k, v]) => [k, v.length])); // group and count 
        const sorted = new Map([...groupByAndCount.entries()].sort((a, b) => b[1] - a[1])); // sort 
        const sliced = new Map(Array.from(sorted).slice(0, 7)) // only get the first 8 
        var trace = {
            y: [...sliced.values()],
            x: [...sliced.keys()],
            name: key,
            type: 'bar'
        };
        data.push(trace) // push trace into display data
    })


    var layout = {
        barmode: 'group',
        title: `Number of movie/tv show by ` + category.replace("_", " ")
    };


    Plotly.newPlot('topRating', data, layout);
}

async function drawTopCast() {
    if (Object.is(show_data, null)) {
        show_data = await d3.json("http://localhost:5000/api/v1.0/shows");
    }

    var typeMenu = d3.select("#selComparisionType2");
    var category = typeMenu.property("value");

    var data = [];
    var countRecord = show_data.filter(e => !Object.is(e[category], null)) // clean records with null value
    .flatMap(e => e[category].split(",")) // split line with multiple comma separate values ie: mike, alan, jane
    .map(e => e.trim()) // remove empty spaces
    .reduce((map, e) => map.set(e, (map.get(e) || 0) + 1), new Map());  // do the counting
    const sorted = new Map([...countRecord.entries()].sort((a, b) => b[1] - a[1]));
    const sliced = new Map(Array.from(sorted).slice(0, 10))

    var data = [{
        y: [...sliced.values()],
        x: [...sliced.keys()],
        type: 'bar'
    }];
    var layout = {
        title: `Top 10 ` + category.replace("_", " ")
    };


    Plotly.newPlot('topDirector', data, layout);
}

d3.selectAll("#selComparisionType").on("change", drawTopRating);
d3.selectAll("#selComparisionType2").on("change", drawTopCast);


d3.json("http://localhost:5000/api/v1.0/showtypes").then(function (rs) {
    var data = [{
        values: rs.map(a => a.count),
        labels: rs.map(a => a.show_type),
        textinfo: "label+percent",
        type: 'pie'
    }];

    var layout = {
        height: 400,
        width: 500,
        title: `Number of TV show and Movie in Netflix`
    };

    Plotly.newPlot('showTypes', data, layout);
});

drawTopRating();
drawTopCast();