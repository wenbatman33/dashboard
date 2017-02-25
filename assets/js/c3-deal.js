var thisToday = performanceDate.getDateTime().format("yyyy-mm-dd");
var this3DayAgo = new DateTimeUtility(new Date()).AddDays(-4).getDateTime().format("yyyy-mm-dd");
var lastMonth = performanceDate.AddMonths(-1).getDateTime().format("yyyy-mm-dd");
//-------------------------------------------------
// 每日成交數 #deal-1
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.gettransbyday;
  var data_1 
  $("#db3_1_1").html(dbDescription.db3_1_1);

  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    var chart = c3.generate({
      bindto: '#deal-1',
      padding: {
        left: 55,
        right: 15,
      },
      data: {
        json: data_1,
        type: 'bar',
        keys: {
          value: ['signUPPeople', 'recordDate']
        },
        x: 'recordDate',
        xFormat: '%Y-%m-%dT%H:%M:%S',
        colors: {
          'signUPPeople': '#6baed6', //#00A3D8
        },
        names: {
          'signUPPeople': '成交數',
        }
      },
      grid: {
        y: {
          show: true,
        }
      },
      legend: {
          show: false
      },
      axis: {
        y: {
          label: {
              text:'單位：數量', 
              position: 'outer-middle'
          },
        },
        x: {
          type: 'timeseries',
          localtime: true,
          tick: {
            format: '%Y-%m-%d' //%Y-%m-%d %H:%M:%S
          }
        }
      }
    });
  });

});

//-------------------------------------------------
// 新客戶首課狀態 #deal-2
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.getnewstate;
  var data_1
  $("#db3_1_2").html(dbDescription.db3_1_2);
  
  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    var chart = c3.generate({
      bindto: '#deal-2',
      padding: {
        left: 55,
        right: 35,
        bottom: 20,
      },

      data: {
        json: data_1,
        type: 'bar',
        keys: {
          value: ['signUPPeople', 'firstSessionPeople', 'recordDate']
        },
        x: 'recordDate',
        xFormat: '%Y-%m-%dT%H:%M:%S',
        colors: {
          'firstSessionPeople': '#ffc100', //#00A3D8
          'signUPPeople': '#6baed6',
        },
        names: {
          'signUPPeople': '成交數',
          'firstSessionPeople': '已首課人數',
        },
      },
      grid: {
        y: {
          show: true,
        }
      },
      axis: {
        y: {
          label: {
              text:'單位：數量', 
              position: 'outer-middle'
          },
        },
        x: {
          type: 'timeseries',
          localtime: true,
          tick: {
            format: '%Y-%m-%d' //%Y-%m-%d %H:%M:%S
          }
        }
      }
    });
  });

});

//-------------------------------------------------
// 首課顧問評鑑 #deal-3
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.getnewpoint;
  var data_1
  $("#db3_1_3").html(dbDescription.db3_1_3);

  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    var chart = c3.generate({
      bindto: '#deal-3',
      padding: {
        left: 45,
        right: 40,
        bottom: 20,
      },
      size: { height: 270 },
      data: {
        json: data_1,
        type: 'line',
        keys: {
          value: ['consultantPoint', 'materialPoint', 'connectionPoint', 'recordDate']
        },
        x: 'recordDate',
        // xFormat: '%Y-%m-%dT%H:%M:%S',
        colors: {
          'consultantPoint': '#6baed6',
          'materialPoint': '#fd8d3c',
          'connectionPoint': '#74c476',
        },
        names: {
          'consultantPoint': '顧問分數',
          'materialPoint': '教材分數',
          'connectionPoint': '連線分數',
        }
      },
      grid: {
        y: {
          show: true,
        }
      },
      tooltip: {
        format: {
          value: function(value, ratio, id) {
            var format = id === 'data1' ? d3.format(',') : d3.format(',.2f');
            return format(value);
          }
        }
      },
      axis: {
        y: {
          label: {
              text:'單位：分數', 
              position: 'outer-middle'
          },
          padding: { bottom: 0,},
          tick: {
            count: 7,
            format: d3.format(".0f")
          },
          min: 0,
          // max: 7,
        },
        x: {
          // type: 'timeseries',
          type: 'category',
          localtime: true,
          tick: {
            culling: false,
            // rotate: 80,
            centered: true,
            // format: d3.time.format('%Y-%m-%d'),
            // format: '%Y-%m-%d' //%Y-%m-%d %H:%M:%S
          }
        }
      }
    });
  });

});

//-------------------------------------------------
// 首課發火率 #deal-4
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.getnewfire;
  var data_1
  $("#db3_1_4").html(dbDescription.db3_1_4);

  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    var chart = c3.generate({
      bindto: '#deal-4',
      padding: {
        left: 52,
        right: 45,
        bottom: 20,
      },
      data: {
        json: data_1,
        type: 'area',
        keys: {
          value: ['firstSessionPeople', 'firstSessionOnFire', 'recordDate']
        },
        x: 'recordDate',
        xFormat: '%Y-%m-%dT%H:%M:%S',
        colors: {
          'firstSessionPeople': '#FFDC2C',
          'firstSessionOnFire': '#EC3D43',
        },
        names: {
          'firstSessionPeople': '首課人數',
          'firstSessionOnFire': '發火數',
        }
      },
      grid: {
        y: {
          show: true,
        }
      },
      axis: {
        y: {
          label: {
              text:'單位：數量', 
              position: 'outer-middle'
          },
          padding: { bottom: 0, },
          min: 0,
        },
        x: {
          // type: 'timeseries',
          type: 'category',
          localtime: true,
          tick: {
            culling: false,
            // rotate: 80,
            centered: true,
            // format: d3.time.format('%Y-%m-%d'),
            // format: '%Y-%m-%d' //%Y-%m-%d %H:%M:%S
          }
        }
      }
    });
  });

});

//-------------------------------------------------
// 退費通報數與前三天比較 #deal-5
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.getrefund + "?startDate="+this3DayAgo+"&endDate="+thisToday;
  var data_1
  $("#db3_1_5").html(dbDescription.db3_1_5);

  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    var chart = c3.generate({
      bindto: '#deal-5',
      padding: {
        left: 52,
        right: 38,
      },
      data: {
        json: data_1,
        type: 'bar',
        keys: {
          value: ['sumPeopleCount', 'noticeTime']
        },
        x: 'noticeTime',
        xFormat: '%Y-%m-%dT%H:%M:%S',
        colors: {
          'sumPeopleCount': '#fdae6b', 
        },
        names: {
          'sumPeopleCount': '退費人數',
        }
      },
      grid: {
        y: {
          show: true,
        }
      },
      legend: {
          show: false
      },
      axis: {
        y: {
          label: {
              text:'單位：人數', 
              position: 'outer-middle'
          },
        },
        x: {
          type: 'timeseries',
          localtime: true,
          tick: {
            format: '%Y-%m-%d' //%Y-%m-%d %H:%M:%S
          }
        }
      }
    });
  });

});

//-------------------------------------------------
// 新客戶成交後，時間內關懷數 #deal-6
//-------------------------------------------------

function minConvertStr(min){
  var day = Math.floor(min/1440) ;
  var hour = (min%1440) / 60;
  
  return (day==0 ?'':(day+ "天")) +  (hour==0 ?'': (hour+ "小時"));
}
function isInt(a){
    return a === ""+~~a
}

$(function() {
  var TTNStatus_json = Dashboard.url.getcare + "?startDate=" + lastMonth + "&endDate=" + thisToday;
  var data_1;

  $.getJSON(TTNStatus_json, function(e) {
      data_1 = e.data;
      
      ///處理json data
      var keysList = Object.keys(data_1);
      var snmPeople = 0;
      columnPeople = ['關懷數'];
      columnPercent = ['累計百分比'];
      daygroup = [];
      //處理天數 算總合
      for(var i=0 ; i<keysList.length ; i++){
        if( isInt(keysList[i]) ){
          if (i==0){
            daygroup.push( minConvertStr(keysList[i])+'以內');
          }else{
            daygroup.push( minConvertStr(keysList[i-1])+'~'+minConvertStr(keysList[i]));
          }   
          // console.log( minConvertStr(keysList[i]) )
          snmPeople += data_1[keysList[i]];
        }else if(keysList[i] == 'overtime'){
          snmPeople += data_1['overtime'];
          daygroup.push(minConvertStr(keysList[i-1])+'以上');
        } 
      }
      for(var i=0 ; i<keysList.length ; i++){
        if( isInt(keysList[i]) ){
          columnPeople.push(data_1[keysList[i]]);
          columnPercent.push( (data_1[keysList[i]]/snmPeople*100).toFixed(2));
        }else if(keysList[i] == 'overtime'){
          columnPeople.push(data_1['overtime']);
          columnPercent.push( (data_1['overtime']/snmPeople*100).toFixed(2) );
        } 
      }
      ///處理json data END

      $("#db3_1_6").html(dbDescription.db3_1_6);
      var chart = c3.generate({
          bindto: '#deal-6',
          padding: {
            left: 60,
            right: 75,
          },
          data: {
              columns: [ 
                  columnPeople, 
                  columnPercent, 
              ],  
              type: 'bar',
              types: {
                  '累計百分比': 'line',
              },
              axes: {
                  '關懷數': 'y',
                  '累計百分比': 'y2',
              },
              colors: {
                  '關懷數': '#6baed6',
                  '累計百分比': '#ec6672',
              }
          },
          grid: {
            y: {
              show: true,
            }
          },
          axis: {
              y: {
                  label: {
                      text:'單位：數量', 
                      position: 'outer-middle'
                  },
              },
              y2: {
                  label: {
                      text:'單位：累計百分比', 
                      position: 'outer-middle'
                  },
                  show: true,
                  tick: {
                      format: function(value, ratio, id) {
                          return d3.format(",")(value) + "%";
                      }
                  },
                  padding: { bottom: 0, },
              },
              x: {
                  type: 'category',
                  categories: daygroup,
                  tick: {
                    culling: false,
                    centered: true,
                  }
              }
          },
          legend: {
              show:  true
          }
      });
  });
});


