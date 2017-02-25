//-------------------------------------------------
// 全區/各大區總計 每日新名單 #chart1
//-------------------------------------------------
$(function() {
    var DataJson_1 = Dashboard.url.getcallresult;
    var data_1;
    $("#db3_2_1").html(dbDescription.db3_2_1);

    $.getJSON(DataJson_1, function(e) {
        data_1 = e.data;
        for (i = 0; i < data_1.length; i++) {
            madeDivs(i);
        }
        $("#callresult-date").html((data_1.length > 0 ? "(" + data_1[0]['recordDate'].substring(0, 10) + ")" : ""));
    });

    function madeDivs(num) {
        var addDiv = $('<div class="col-md-3"><div id="area-day_' + num + '"></div></div>');
        $('#area-day').append(addDiv);
        $('#area-day').css({
            "display": "inline-block",
            "width": "100%"
        });

        var chart = c3.generate({
            bindto: '#area-day_' + num,
            padding: {
                right: 40,
                bottom: 20,
            },
            legend: {
                margining: {
                    top: 100,
                    bottom: 100
                },
                position: 'bottom',
                bottom: {
                    x: 550,
                    y: 150,
                    step: 12
                }
            },
            data: {
                json: data_1[num],
                type: 'donut',
                // onmouseover: function(d, i) {
                //     console.log("onmouseover", d, i, this);
                // },
                // onmouseout: function(d, i) {
                //     console.log("onmouseout", d, i, this);
                // },
                // onclick: function(d, i) {
                //     console.log("onclick", d, i, this);
                // },
                // order: null // set null to disable sort of data. desc is the default.
                names: {
                    'sumBusyCount': '對方忙線數',
                    'sumNoResponseCount': '對方未接聽數',
                    'sumOutOfServiceCount': '對方不在服務區',
                    'sumTurnOffCount': '對方關機數',
                    'sumSuccessCount': '外呼成功數',
                    'sumNoAnswerCount': '對方無回應',
                    'sumTerminationCount': '欠費停機數',
                    'sumInvalidNumberCount': '空號數'
                }
            },
            color: {
                pattern: [
                    '#e60000', '#e6721d', '#22beef', '#0d48d8', '#01B468', '#ffc100', '#B766AD',
                    '#ff7a84', '#ffaa83', '#fffc5c', '#acff8b', '#a5fcff', '#9ab5f2', '#b87bf2',
                    '#e65c6f', '#ff9e4d', '#ecd02b', '#18d739', '#3be5ef', '#2473f2', '#9367d1',
                    '#bd3d2a', '#e47e3c', '#d4c10a', '#62af5d', '#6bcdda', '#6d9cc9', '#8f77b4'
                ]
            },
            legend: {
                    item: {
                            // onclick: function (d) { 
                            //         // console.log("onclick", d); //data1
                            //         show(d); //when I click legend show some data
                            //         chart.hide();
                            //         chart.show(d);
                            // }
                            onclick: function(d, i) {}, //disable clicking to hide/show parts of the chart
                            onmouseover: function(d, i) {
                                chart.focus(d, i);
                            },
                    }
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id) {
                        var format = id === 'data' ? d3.format(',') : d3.format('');
                        return format(value);
                    }
                }
            },
            donut: {

                label: {
                    format: function(value, ratio, id) {
                        return "";
                    }
                    // format: function (value, ratio, id) {
                    //     return d3.format('')(value);
                    // }
                },
                title: data_1[num].areaName, //+ "\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n" + " / 2134件"
                width: 25
            }
        });
        chart.unload({
            ids: ['recordDate', 'areaName']
        });

    }


});


//-------------------------------------------------
// 全區/各大區總計 每周通時通次 #area-week
//-------------------------------------------------

function ctiListData(data, index, getKey) {
    // console.log("data" + index );
    // console.log(data);
    if (getKey == 'areaName') {
        return data[index][getKey];
    }
    if (getKey == 'record') {
        var dataList = data[index]['record'];
        var x = ['x'];
        var sumCallCount = ['sumCallCount'];
        var sumCallDuration = ['sumCallDuration'];
        for (var i = 0; i < dataList.length; i++) {
            var item = dataList[i];
            x.push(item['recordDate']);
            sumCallCount.push(item['sumCallCount']);
            sumCallDuration.push(item['sumCallDuration']);
        }
        return [x, sumCallCount, sumCallDuration];
    }
}


var myPlayer = {};
$(function() {
    var TTNStatus_json = Dashboard.url.getctilist;
    var data_1;
    $("#db3_2_2").html(dbDescription.db3_2_2);

    $.getJSON(TTNStatus_json, function(e) {
        data_1 = e.data;

        //gen html btn
        var areaNameBtnHtml = "";
        for (var i = 0; i < data_1.length; i++) {
            areaNameBtnHtml += '<a id="change-' + i + '" class="btn btn-slategray margin-bottom-20">' + ctiListData(data_1, i, 'areaName') + '</a> '
        }
        $('#areaNameBtn').html(areaNameBtnHtml);


        // console.log( data_1 );
        var chart2 = c3.generate({
            bindto: '#area-week',
            padding: {
                right: 5,
                bottom: 20,
            },
            data: {
                x: 'x',
                columns: ctiListData(data_1, 0, 'record'),
                names: {
                    'sumCallCount': '當日通話次數/人',
                    'sumCallDuration': '當日通話時間(分鐘)/人',
                },
                types: {
                    'sumCallCount': 'area',
                }
            },
            grid: {
                y: {
                    show: true
                }
            },
            axis: {
                y: {
                    label: {
                        text:'單位：人數', 
                        position: 'outer-middle'
                    },
                    tick: {
                        format: function(value, ratio, id) {
                            return d3.format(",.0f")(value);
                        }
                    },
                },
                x: {
                    type: 'category'
                }
            }
        });
        ///////////////
        var defaultMessage = $('#message').html(),
            currentIndex = 0,
            timer, duration = 2000


        function setMessage(message) {
            // document.getElementById('message').innerHTML = '<button id="demoMessage" title="Stop Demo" onclick="myPlayer.stopDemo();">'+message+'</button>';
            document.getElementById('message').innerHTML = '<div>' + message + '</div>';
            // $('#message').tooltip('toggle');
        }

        myPlayer.startDemo = function() {
            console.log("startDemo");
            setMessage('繼續撥放');
            timer = setInterval(function() {
                currentIndex++;
                if (currentIndex == data_1.length) currentIndex = 0;
                chart2.load({
                    bindto: '#area-week',
                    columns: ctiListData(data_1, currentIndex, 'record')
                })
                setMessage(ctiListData(data_1, currentIndex, 'areaName'));
            }, 2000);
        }


        myPlayer.stopDemo = function() {
            console.log("stopDemo");
            clearInterval(timer);
            // document.getElementById('message').innerHTML = defaultMessage;
            // document.getElementByClassName('message').innerHTML = defaultMessage;
        };


        $(document).ready(function() {
            // setMessage('Starting Demo..');
            setMessage(ctiListData(data_1, 0, 'areaName'));
            timer = setInterval(function() {
                currentIndex++;
                if (currentIndex == data_1.length) currentIndex = 0;
                chart2.load({
                    bindto: '#area-week',
                    columns: ctiListData(data_1, currentIndex, 'record')
                })
                setMessage(ctiListData(data_1, currentIndex, 'areaName'));
            }, duration);


            for (var i = 0; i < data_1.length; i++) {
                $("#change-" + i).on('click', function() {
                    // var data = event.data;
                    replaceId = $(this).attr("id");
                    replaceId = replaceId.replace("change-", "");
                    // console.log($( this ).attr("id"));
                    chart2.load({
                        bindto: "#area-week",
                        columns: ctiListData(data_1, replaceId, 'record'),
                    })
                    setMessage(ctiListData(data_1, replaceId, 'areaName'));
                    clearInterval(timer);
                });
            }
        });

    });
});

//-------------------------------------------------
// 各大區 月份成交件數 #chart1
//-------------------------------------------------

$("#db3_2_3").html(dbDescription.db3_2_3);
var thisMonth = performanceDate.getDateTime().format("yyyy-mm-dd");
var lastMonth = performanceDate.AddMonths(-1).getDateTime().format("yyyy-mm-dd");
// console.log("thisMonth:" + thisMonth + "/lastMonth:" + lastMonth);
var thisMonthTxt = "";
var lastMonthTxt = "";

$(function() {
    var Status_json = Dashboard.url.getctiagentperformanceSingleMonth + "?recordDate=" + thisMonth;
    var data_1
        // var MonthTxt = "";

    $.getJSON(Status_json, function(e) {
        data_1 = e.data;

        var data = {};
        var sites = [];

        data_1.forEach(function(e) {
            sites.push(e.regionName);
            data[e.regionName] = e.mtdSoldPiece;
        })

        chart = c3.generate({
            bindto: '#chart1',
            padding: {
                right: 0
            },
            data: {
                json: [data],
                keys: {
                    value: sites,
                },
                type: 'donut',
                onmouseover: function(d, i) {
                    console.log("onmouseover", d, i, this);
                },
                onmouseout: function(d, i) {
                    console.log("onmouseout", d, i, this);
                },
                onclick: function(d, i) {
                    console.log("onclick", d, i, this);
                },
                // order: null // set null to disable sort of data. desc is the default.
            },
            legend: {
                item: {
                    onclick: function(d, i) {}, //disable clicking to hide/show parts of the chart
                    onmouseover: function(d, i) {
                        chart.focus(d, i);
                    },
                }
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id) {
                        var format = id === 'data' ? d3.format(',') : d3.format('');
                        return format(value);
                    }
                }
            },
            donut: {
                title: data_1[1]["performanceMonth"].substring(0, 7) + "月",
                width: 50
            }
        });

    });

});



//-------------------------------------------------
// 大區 月份成交件數環比 #chart2
//-------------------------------------------------


function percentCount(oldNum, newNum) {
    return (newNum - oldNum) * 100 / oldNum;
}


$(function() {
    var SoldPieceA_json = Dashboard.url.getctiagentperformanceSingleMonth + "?recordDate=" + thisMonth;

    $.getJSON(SoldPieceA_json, function(json) {
        data_1 = json.data;
        var SoldPieceA_json2 = Dashboard.url.getctiagentperformanceSingleMonth + "?recordDate=" + lastMonth;
        $.getJSON(SoldPieceA_json2, function(json) {
            data_2 = json.data;

            // console.log(data_1);
            // console.log(data_2);

            var data2list = ['data2']; //上個月成交件數
            var data1list = ['data1']; //這個月成交件數
            var percentList = ['上月環比'];
            var areaNameList = []; //大區名稱
            for (var i = 0; i < data_2.length; i++) {
                var item = data_2[i];
                lastMonthTxt = item["performanceMonth"].substring(0, 7) + "月";
                data2list.push(item["mtdSoldPiece"] * 1);
                areaNameList.push(item["regionName"]);


            }
            for (var i = 0; i < data_1.length; i++) {
                var item = data_1[i];
                thisMonthTxt = item["performanceMonth"].substring(0, 7) + "月";
                var mtdSoldPiece = item["mtdSoldPiece"] * 1;
                data1list.push(mtdSoldPiece);
                var percent = percentCount(data_2[i]["mtdSoldPiece"] * 1, mtdSoldPiece);
                percentList.push(percent);
            }

            // console.log(  data2list );
            // console.log(  data1list );
            // console.log(  percentList );
            // console.log(  areaNameList );

            //gen chart
            var chart = c3.generate({
                // bindto: '#ccc',
                bindto: '#chart2',
                padding: {
                    right: 50
                },
                data: {
                    columns: [
                        data2list,
                        data1list,
                        percentList,
                    ],
                    axes: {
                        data2: 'y',
                        data1: 'y',
                        '上月環比': 'y2',
                    },
                    types: {
                        data2: 'bar',
                        data1: 'bar',
                        '上月環比': 'line',
                    },
                    colors: {
                        data2: '#00A3D8',
                        data1: '#FF534C',
                        '上月環比': '#A2D200'
                    },
                    names: {
                        data2: lastMonthTxt,
                        data1: thisMonthTxt,
                    }
                },
                axis: {
                    x: {
                        type: 'categorized',
                        categories: areaNameList
                    },
                    y2: {
                        show: true,
                        tick: {
                            // count: 5,
                            format: function(value, ratio, id) {
                                return d3.format(",.2f")(value) + "%";
                            }
                            // format: function (d) { return d + "%"; },
                            // values: [-80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120]
                        },
                        padding: {
                            bottom: 0,
                        },
                    }
                },
                grid: {
                    y: {
                        show: true,
                    }
                }
            });

        });

    });

});


//-------------------------------------------------
// 水位報表 Johnny Convert // Kite
//-------------------------------------------------

$(function() {
    var Gauge_json = Dashboard.url.getctiwaterflow + "?recordDate=" + thisMonth;
    var waterflowData
    $("#db3_2_4").html(dbDescription.db3_2_4);

    $.getJSON(Gauge_json, function(e) {
        waterflowData = e.data;

        function getCtiWaterflow(brand, kind, data) {
            return data[brand][kind];
        }

        //-------------------------------------------------
        // vipabc 水位報表 A級名單 有撥未通數 #vipabc_gauge_A1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabc', 'a', waterflowData);
        var waterVipabcDate = waterflowData["vipabc"]["recordDate"];
        var waterVipabcjrDate = waterflowData["vipabcjr"]["recordDate"];


        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_A1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            }
        });

        //-------------------------------------------------
        // vipabc 水位報表 A級名單 未撥數 #vipabc_gauge_A2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_A2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 B級名單 有撥未通數 #vipabc_gauge_B1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabc', 'b', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_B1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 B級名單 未撥數 #vipabc_gauge_B2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_B2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 C級名單 有撥未通數 #vipabc_gauge_C1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabc', 'c', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_C1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 C級名單 未撥數 #vipabc_gauge_C2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_C2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 D級名單 有撥未通數 #vipabc_gauge_D1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabc', 'd', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_D1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            }
        });


        //-------------------------------------------------
        // vipabc 水位報表 D級名單 未撥數 #vipabc_gauge_D2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabc_gauge_D2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });

        // *********************

        //-------------------------------------------------
        // vipabcjr 水位報表 A級名單 有撥未通數 #vipabcjr_gauge_A1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabcjr', 'a', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_A1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 A級名單 未撥數 #vipabcjr_gauge_A2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_A2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 B級名單 有撥未通數 #vipabcjr_gauge_B1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabcjr', 'b', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_B1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 B級名單 未撥數 #vipabcjr_gauge_B2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_B2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 C級名單 有撥未通數 #vipabcjr_gauge_C1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabcjr', 'c', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_C1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 C級名單 未撥數 #vipabcjr_gauge_C2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_C2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });

        //-------------------------------------------------
        // vipabcjr 水位報表 D級名單 有撥未通數 #vipabcjr_gauge_D1
        //-------------------------------------------------

        waterTmp = getCtiWaterflow('vipabcjr', 'd', waterflowData);
        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_D1',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['有撥未通數', waterTmp['contactCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            }
        });


        //-------------------------------------------------
        // vipabcjr 水位報表 D級名單 未撥數 #vipabcjr_gauge_D2
        //-------------------------------------------------

        var chart1 = c3.generate({
            bindto: '#vipabcjr_gauge_D2',
            padding: {
                bottom: 10
            },
            size: {
                height: 145
            },
            data: {
                columns: [
                    ['未撥數', waterTmp['dialCount']]
                ],
                type: 'gauge',
            },
            gauge: {
                units: waterVipabcjrDate,
                min: 0,
                max: waterTmp['count']
            },
            color: {
                pattern: ['#60B044'], // the three color levels for the percentage values.

            }
        });

    });
});
//--- 水位報表 end ----------------------------------------------


//-------------------------------------------------
// 各大區 每日成交件數 #area-hour
//-------------------------------------------------

$(function() {
    var TTNStatus_json = Dashboard.url.getctiagentperformanceperday + '?recordDate=' + thisMonth ;
    var data_1
    $("#db3_2_5").html(dbDescription.db3_2_5);

    $.getJSON(TTNStatus_json, function(e) {
        data_1 = e.data;
        // $("#performace-hour-date").html((Object.keys(data_1).length > 0 ? data_1['recordDate'][0].substring(0, 10) : ""));

        var chart = c3.generate({
            bindto: '#area-hour',
            padding: {
                left: 63,
                right: 15,
                bottom: 30,
            },
            size: {
                height: 380
            },
            data: {
                x: 'recordDate',
                xFormat: '%Y-%m-%dT%H:%M:%S',
                json: data_1,
                type: 'line',
            },
            color: {
                pattern: [
                    '#13BDD1', '#ffa28e', '#6262c0', '#4dd771', '#e64f49', '#549df4', '#ffc100', '#acb292', '#5f90c5', '#ccb1f5',
                    '#e89e4d', '#a2d200', '#ff9896', '#3CA2E0', '#F0AD4E', '#7AB67B', '#D9534F', '#3faae3', '#FF60AF', '#01B468',
                    '#0072E3', '#B766AD', '#4ccacd', '#a2d200', '#0d48d8'
                ]
            },
            grid: {
                y: {
                    show: true,
                }
            },
            axis: {
                y: {
                    label: {
                        text:'單位：件數', 
                        position: 'outer-middle'
                    },
                    min: 0,
                    padding: { bottom: 15, },
                },
                x: {
                    type: 'timeseries',
                    height: 50,
                    tick: {
                        culling: false,
                        rotate: -60,
                        format: "%Y-%m-%d"
                        // format : "%Y " + "\n\r\n\r\n\r\n\r\n\r\n" + " %m-%d " + "\n\r\n\r\n\r\n\r\n" + " %H:%M"
                    }
                }
            }
        });
    });

});