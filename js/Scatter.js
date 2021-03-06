let Map = document.getElementById('Scatter');
let heightax = Map.offsetHeight;
let widthax = Map.offsetWidth * 2;

// var widthax = 225;
// var heightax = 205;
// var padding = { top: 10, bottom: 10, left: 10, right: 10 }
var K = 0;
var r = 0

var kssvg = 0;

var orret_g = 0

var ScattermyChart;

var name_x = [];

var k_in_num = 0
// var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

// function zoomed() {
//     kssvg.attr("transform",
//         "translate(" + zoom.translate() + ")" +
//         "scale(" + zoom.scale() + ")"
//     );
// }

// function interpolateZoom(translate, scale) {
//     var self = this;
//     return d3.transition().duration(350).tween("zoom", function () {
//         var iTranslate = d3.interpolate(zoom.translate(), translate),
//             iScale = d3.interpolate(zoom.scale(), scale);
//         return function (t) {
//             zoom
//                 .scale(iScale(t))
//                 .translate(iTranslate(t));
//             zoomed();
//         };
//     });
// }


function PP() {
    kssvg = d3.select("#Scatter").append("svg")
        .attr('id', 'kSsView')
        .attr("width", widthax)
        .attr("height", heightax)
    // .append('g')
    // .call(zoom)
    // .append('g')
    // .attr('class', 'zoomg')
    // .append("g")
    // // .attr("transform", "translate(0,100)")
    // .attr("transform", "translate(0, 0)");
}

var pr = [];

var coort = [];

var tcircle = 0;
var flag = -1;
var heatmapInstance = 0;
var name_kkk = new Object();

PP()

function ScatterPaint_gain_loss(coor, p, num, pf, pdata, Decision) {
    // PP()
    // for (var i in coor) {
    //     coor[i]['val'] = parseFloat(num_coor[i][91])
    // }

    // console.log(coor)

    var opt = {}
    opt.epsilon = 10; // epsilon is learning rate (10 = default)
    // opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)

    var T = new tsnejs.tSNE(opt); // create a tSNE instance

    // initialize data. Here we have 3 points and some example pairwise dissimilarities
    // var dists = [
    //     [0, 0, 0, 1],
    //     [0, 0, 0, 2],
    //     [1, 0, 0, 3],
    //     [1, 2, 1, 1],
    //     [2, 2, 3, 4]
    // ];
    // tsne.initDataDist(dists);

    // // for (var k = 0; k < 500; k++) {
    // //     tsne.step(); // every time you call this, solution gets better
    // // }

    // var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

    // console.log("fkdajsfla", Y);

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltipx")
        .style("opacity", 0.0)

    if (tcircle != 0) tcircle.remove()
    if (r != 0) r.remove()

    var distxs = new Array();
    if (Decision == -1 || Decision.length == 0) {
        for (let i = 0; i < 304; ++i) {
            // console.log(i);
            let An = new Array();
            An.push(parseFloat(pdata[i]['ability']))
            for (let j = 2; j <= 10; ++j) {
                An.push(parseFloat(pdata[i][j]) * 1.0);
            }
            distxs.push(An);
        }
    } else {
        for (let i = 0; i < 304; ++i) {
            // console.log(i);
            let An = new Array();
            An.push(parseFloat(pdata[i]['ability']))
            for (let j in Decision) {
                An.push(parseFloat(pdata[i][Decision[j]]) * 1.0);
            }
            distxs.push(An);
        }
    }
    console.log(distxs)
    T.initDataRaw(distxs);
    // T.step()
    for (var k = 0; k < 1000; k++) {
        T.step(); // every time you call this, solution gets better
    }

    var Y = T.getSolution(); // Y is an array of 2-D points that you can plot

    // console.log("fkdajsfla", Y);
    for (let i in pdata) {
        Y[i].push(parseInt(pdata[i]['11']))
        Y[i].push(pdata[i]['code'])
    }

    // DrawHeat(coor)
    var padding = {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10
    };
    let max_x = -999999,
        min_x = 99999,
        max_y = -99999,
        min_y = 999999

    for (var i in Y) {
        console.log(Y[i]);
        max_x = Math.max(max_x, (Y[i][0]))
        max_y = Math.max(max_y, (Y[i][1]))
        min_x = Math.min(min_x, (Y[i][0]))
        min_y = Math.min(min_y, (Y[i][1]))
    }

    var xAxisWidth = widthax;
    var yAxisWidth = heightax;
    var xScale = d3.scale.linear()
        .domain([min_x, max_x])
        .range([10, xAxisWidth - 10]);
    var yScale = d3.scale.linear()
        .domain([min_y, max_y])
        .range([yAxisWidth - 10, 40]);

    console.log(max_x, min_y);

    // var color = ['#00a676', '#f9c80e', '#3abeff', '#df19c1', '#ff206e', '#f08700', '#0091c9']
    var color = ['#2fe9b3', '#2f8fe9', '#c32fe9', '#e92f9c', '#2E8B57', '#e4e92f', '#FFFACD']
    var a = d3.rgb(255, 0, 0); //??????
    // var b = d3.rgb(0, 255, 0); //??????
    var b = '#00FF00'

    var compute = d3.interpolate(a, b);

    // var linear = d3.scale.linear()
    //     .domain([-550, 550])
    //     .range([0, 1]);
    // if (p == -1)
    tcircle = kssvg.append('g').selectAll("circle")
        .data(Y)
        .enter()
        .append("circle")
        .attr("fill", (d, i) => {
            // if (d.l == num)
            // if (coor[i]['val'] <= 0)
            //     return 'red'
            // // return compute(linear(parseFloat(num_coor[i][91])))
            // else
            //     return '#00FF00'
            // else return 'none'
            // return 'white'
            if (d[2] == 0)
                return '#00FF00'
            // return compute(linear(parseFloat(num_coor[i][91])))
            else if (d[2] == 2)
                // return '#00FF00'
                return 'red'
            else
                return 'yellow'
            // return 'black';
        })
        // .attr("fill-opacity", 0.5)
        .attr("id", "circleid")
        .attr("cx", function (d) {
            //console.log(d);
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            // console.log(yScale(d.y))
            return yScale(d[1]);
        })
        .attr("r", 3)
        .attr('stroke', (d, i) => {
            //if (d.l == num)
            // return 
            // if (d.label == 0)
            //     return 'red'
            // // return compute(linear(parseFloat(num_coor[i][91])))
            // else if (d.label == 2)
            //     // return '#00FF00'
            //     return '#00FF00'
            // else
            //     return 'yellow'
            return 'white'
            // //else 'none';
            // if (coor[i]['xval'] <= 0)
            //     return 'red'
            // // return compute(linear(parseFloat(num_coor[i][91])))
            // else
            //     return '#00FF00'
            // return 'blue'
        })
        .attr('stroke-width', 0.5)
        // .attr('fill-opacity', 0.3)
        .on("mouseover", function (d, i) {
            // tooltip.html("Code: " + d.id + "</br>" + "Value: " + d.val)
            //     .style("left", (d3.event.pageX - 15) + "px")
            //     .style("top", (d3.event.pageY + 0) + "px")
            //     .style("opacity", 1.0)
            // console.log(d)
            console.log(d)
            d3.select(this)
                .attr("fill", d => {
                    return 'blue';
                })
                .attr('fill-opacity', 1)
        })
        .on("mouseout", function (d, i) {
            // if (k_in_num)
            d3.select(this)
                .attr("fill", d => {
                    if (d[2] == 0)
                        return '#00FF00'
                    // return compute(linear(parseFloat(num_coor[i][91])))
                    else if (d[2] == 2)
                        // return '#00FF00'
                        return 'red'
                    else
                        return 'yellow'
                });
            // tooltip.style("opacity", 0.1)
        })
        .on('click', (d, i) => {
            name_kkk[d[3]] = 1;

            var coor_p = {}

            for (var i in pf) {
                // console.log(pf[i][0])
                if (name_kkk[pf[i][0].id] == 1) {
                    coor_p[i] = pf[i];
                }
            }

            // console.log(coor_p)
            // console.log(coor)

            var coor_path = PathCalc(coor_p, -1, -1);
            // console.log()

            // console.log(coor_path[1])

            // var n__ = []
            // for (var i in coor_path[1]) {
            //     n__.push(i)
            // }

            // OrRect(n__, color[flag])

            if (LineName != 0) {
                for (let i in Line_Name) {
                    Line_Name[i].remove();
                }
                LineName.remove();
            }
            LinePaint_3(coor_path[0], coor_path[2], color[1])
        })
    // else {
    //     tcircle = kssvg.append('g').selectAll("circle")
    //         .data(coor)
    //         .enter()
    //         .append("circle")
    //         .attr("fill", (d, i) => {
    //             // console.log(d)
    //             if (d.l == num)
    //                 // if (coor[i]['val'] <= 0)
    //                 //     return 'red'
    //                 // // return compute(linear(parseFloat(num_coor[i][91])))
    //                 // else
    //                 //     return '#00FF00'
    //                 // else return 'none'
    //                 return 'white'
    //             else
    //                 return 'none'
    //         })
    //         // .attr("fill-opacity", 0.5)
    //         .attr("id", "circleid")
    //         .attr("cx", function (d) {
    //             //console.log(d);
    //             return xScale(d.x);
    //         })
    //         .attr("cy", function (d) {
    //             return yScale(d.y);
    //         })
    //         .attr("r", 3)
    //         .attr('stroke', (d, i) => {
    //             if (d.l == num)
    //                 // return 
    //                 if (d.val <= 0)
    //                     return 'red'
    //             // return compute(linear(parseFloat(num_coor[i][91])))
    //             else
    //                 // return '#00FF00'
    //                 return 'green'
    //             else 'none';
    //             // if (coor[i]['xval'] <= 0)
    //             //     return 'red'
    //             // // return compute(linear(parseFloat(num_coor[i][91])))
    //             // else
    //             //     return '#00FF00'
    //             // return 'blue'
    //         })
    //         .attr('stroke-width', 0.1)
    //         // .attr('fill-opacity', 0.3)
    //         // .on("mouseover", function (d, i) {
    //         //     // tooltip.html("Code: " + d.id + "</br>" + "Value: " + d.val)
    //         //     //     .style("left", (d3.event.pageX - 15) + "px")
    //         //     //     .style("top", (d3.event.pageY + 0) + "px")
    //         //     //     .style("opacity", 1.0)
    //         //     // console.log(d)
    //         //     d3.select(this)
    //         //         .attr("fill", d => {
    //         //             if (d.val > 0)
    //         //                 return '#00FF00'
    //         //             else
    //         //                 return 'red'
    //         //         })
    //         //         .attr('fill-opacity', 1)

    //         // })
    //         // .on("mousemove", d => {
    //         //     // tooltip.style("left", (d3.event.pageX - 15) + "px")
    //         //     //     .style("top", (d3.event.pageY + 0) + "px")
    //         // })
    //         // .on("mouseout", function (d, i) {
    //         //     d3.select(this)
    //         //         .attr("fill", d => {
    //         //             return 'white';
    //         //         });
    //         //     // tooltip.style("opacity", 0.1)
    //         // })
    //         .on('click', function (d, i) {
    //             d3.select(this)
    //                 .attr('r', 5)
    //                 .attr('fill', d => {
    //                     if (d.val > 0)
    //                         return '#00FF00'
    //                     else
    //                         return 'red'
    //                 })
    //             kname = d.id;
    //             if (d_num == 0) {
    //                 if (judge_cir_line == 0)
    //                     Paintjudge(kname);
    //                 else
    //                     PaintCir(kname);
    //                 PaintSha(number, kname, i);
    //                 IceLine(kname, num)
    //             } else {
    //                 // if (cnt_num < 1) {
    //                 //     cnt_num++;
    //                 //     name_in.push(d)
    //                 //     if (judge_cir_line == 1)
    //                 //         PaintCir(d)
    //                 //     else
    //                 //         Paintjudge(d)
    //                 // } else {
    //                 cnt_num++;
    //                 name_x.push(kname)
    //                 if (judge_cir_line == 1) {
    //                     PaintCir_2(name_x)
    //                 } else {
    //                     Paintjudge_2(name_x)
    //                 }
    //                 // name_in = []
    //                 // cnt_num = 0
    //                 // }
    //                 IceLine_2(name_x, num)
    //                 PaintSha_2(number, name_x, i);
    //             }
    //         });
    var brush = d3.svg.brush()
        .x(xScale)
        .y(yScale)
        .extent([
            [0, 0],
            [0, 0]
        ])
        .on("brush", brushed)

    // console.log(coor)

    var name_brush = {};

    function brushed() {
        var extent = brush.extent();
        var xmin = extent[0][0];
        var xmax = extent[1][0];
        var ymin = extent[0][1];
        var ymax = extent[1][1];

        // console.log(ymin)
        // console.log(ymax)
        // console.log(xmax)
        // console.log(xmin)
        // console.log(coor[0])
        var nnnnn = []
        let identity = []
        for (var i in Y) {
            if (Y[i][0] >= xmin && Y[i][0] <= xmax && Y[i][1] >= ymin && Y[i][1] <= ymax) {
                name_brush[Y[i][3]] = 1;
                nnnnn.push(Y[i][3])
                // identity.push(coor[i]);
            }
        }

        console.log(nnnnn)
        // console.log(name_brush[nnnnn[0]])

        // if (K == 0) {
        var coor_p = {}

        for (var i in pf) {
            // console.log(pf[i][0])
            if (name_brush[pf[i][0].id] == 1) {
                coor_p[i] = pf[i];
            }
        }

        // console.log(coor_p)
        // console.log(coor)

        var coor_path = PathCalc(coor_p, -1, -1);
        // console.log()

        // console.log(coor_path[1])

        // var n__ = []
        // for (var i in coor_path[1]) {
        //     n__.push(i)
        // }

        // OrRect(n__, color[flag])

        if (LineName != 0) {
            for (let i in Line_Name) {
                Line_Name[i].remove();
            }
            LineName.remove();
        }
        LinePaint_2(coor_path[0], coor_path[2], color[1])
        // K = 1;
        // }
        // if (identity.length != 0)
        //     d3.csv('data/box.csv', function (d1) {
        //         d = []
        //         for (let i in d1) {
        //             if (parseInt(d1[i].biao) == num)
        //                 d.push(d1[i])
        //         }
        //         PaintTypeZ(d, name_brush);
        //     })

        // console.log(flag)



    }

    // console.log(flag)
    r = kssvg.append("g")
        .call(brush)
        .selectAll("rect")
        .style("fill-opacity", 0.3)



    // }


    // console.log(tcircle)

    // coor.length = 0;


}