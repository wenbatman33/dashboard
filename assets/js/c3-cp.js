var thisToday = performanceDate.getDateTime().format("yyyy-mm-dd");
var thisYesterday = performanceDate.AddDays(-1).getDateTime().format("yyyy-mm-dd");
var thisTomorrow = performanceDate.AddDays(2).getDateTime().format("yyyy-mm-dd"); //+2 變為明天


$(function() {
  var TTNStatus_json = Dashboard.url.getcpctiserv ;
  var data_1;
  $.getJSON(TTNStatus_json, function(e) {
      data_1 = e.data;


      var recordDate = ['recorddate'];
      var calling_t = ['通話中'];
      var noservice_t = ['非服務'];
      var ready_t = ['已準備接聽'];
      var care_t = ['客戶關懷'];
      var service_t = ['客戶服務'];
      //vipabc
      var calling_v = ['通話中'];
      var noservice_v = ['非服務'];
      var ready_v = ['已準備接聽'];
      var care_v = ['客戶關懷'];
      var service_v = ['客戶服務'];

      for(var i=0 ; i<data_1.length ; i++){
        recordDate.push(data_1[i]['recorddate']);
        calling_t.push(data_1[i]['tutorabc']['通話中']);
        noservice_t.push(data_1[i]['tutorabc']['非服務']);
        ready_t.push(data_1[i]['tutorabc']['已準備接聽']);
        care_t.push(data_1[i]['tutorabc']['客戶關懷']);
        service_t.push(data_1[i]['tutorabc']['客戶服務']);

        calling_v.push(data_1[i]['vipabc']['通話中']);
        noservice_v.push(data_1[i]['vipabc']['非服務']);
        ready_v.push(data_1[i]['vipabc']['已準備接聽']);
        care_v.push(data_1[i]['vipabc']['客戶關懷']);
        service_v.push(data_1[i]['vipabc']['客戶服務']);
      }

      //-------------------------------------------------
      // 客服工作狀態監控統計 TutorABC #cp-1T
      //-------------------------------------------------
      $("#db3_3_1").html(dbDescription.db3_3_1);
        var chart = c3.generate({
          bindto: '#cp-1T',
          padding: {
            left: 65,
            right: 20,
            bottom: 30,
          },
          data: {
              x: 'recorddate',
              columns: [
                  recordDate,
                  calling_t,
                  noservice_t,
                  ready_t,
                  care_t,
                  service_t,
              ],
              type: 'area',
          },
          color: {
              pattern: dbColors.ColorLine
          },
          grid: {
              y: {
                  show: true
              }
          },
          axis: {
              y: {
                padding: { bottom: 10, },
                min: 0,
                tick: {
                    format: function(value, ratio, id) {
                        return d3.format(",")(value) + " min";
                    }
                },
              },
              x: {
                  type: 'timeseries',
                  tick: {
                      culling: true,
                      format: "%Y-%m-%d"
                  }
              }
          }
        });


        //-------------------------------------------------
        // 客服工作狀態監控統計 vipabc #cp-1V
        //-------------------------------------------------

          var chart = c3.generate({
            bindto: '#cp-1V',
            padding: {
              left: 65,
              right: 20,
              bottom: 30,
            },
            data: {
                x: 'recorddate',
                columns: [
                    recordDate,
                    calling_v,
                    noservice_v,
                    ready_v,
                    care_v,
                    service_v,
                ],
                type: 'area',
            },
            color: {
                pattern: dbColors.ColorLine
            },
            grid: {
                y: {
                    show: true
                }
            },
            axis: {
                y: {
                  padding: { bottom: 10, },
                  min: 0,
                  tick: {
                    format: function(value, ratio, id) {
                        return d3.format(",")(value) + " min";
                    }
                },
                },
                x: {
                    type: 'timeseries',
                    tick: {
                        culling: true,
                        format: "%Y-%m-%d"
                    }
                }
            }
          });

  });
});


//-------------------------------------------------
// 客服佔線監控 TutorABC #cp-2T
//-------------------------------------------------
function countPercent(ar){
    percentSum = 0
    for(var i=1 ; i< ar.length ; i++){
        percentSum += (ar[i][2] / ar[i][1])
    }

    return (percentSum / (ar.length-1) *100 ).toFixed(2)
}


function fullTime(ar){
    fulltime = 0
    for(var i=1 ; i< ar.length ; i++){
        if ( ar[i][2] == ar[i][1] ){
            fulltime += 15 ; //秒
        }
    }

    return fulltime / 60
}


$(function() {
  var TTNStatus_json = Dashboard.url.getcpctibusystatus + "?brandId=1&startDateTime="+thisToday+"&endDateTime="+thisTomorrow;
  var data_1;
  $.getJSON(TTNStatus_json, function(e) {
      data_1 = e.data;
      
      var recordDate = ['recorddate'];
      var maxCP = ['排班客服最大服務人員數'];
      var busyCP = ['客服忙碌人數'];
      var lossLine = ['當日掉線累積數'];
      for(var i=0 ; i<data_1.length ; i++){
        data_1[i];
        recordDate.push(data_1[i][0]);
        maxCP.push(data_1[i][1]);
        busyCP.push(data_1[i][2]);
        lossLine.push(data_1[i][3]);
      }

      $("#db3_3_2").html(dbDescription.db3_3_2);
      $("#cpDateT").html( thisToday );
      $("#cpAllPeopleT").html(countPercent(data_1) + "%");
      $("#cpOccupiedT").html(fullTime(data_1) + " mins");

      var chart = c3.generate({
        bindto: '#cp-2T',
        padding: {
          left: 50,
          right: 45,
          bottom: 15,
        },
        data: {
            x: 'recorddate',
            xFormat: '%Y-%m-%dT%H:%M:%S',
            columns: [
                recordDate,
                maxCP,
                busyCP,
                lossLine,
            ],
            type: 'area',
            axes: {
                '排班客服最大服務人員數': 'y',
                '客服忙碌人數': 'y',
                '當日掉線累積數': 'y2',
            }
        },
        color: {
            pattern: dbColors.ColorBusy
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
              padding: { bottom: 10, },
              min: 0,
            },
            y2: {
              label: {
                  text:'單位：累積數', 
                  position: 'outer-middle'
              },
              show: true,
              padding: { bottom: 10, },
              min: 0,
              max: 80,
            },
            x: {
              type: 'timeseries',
              height: 40,
              tick: {
                  rotate: -60,
                  culling: false,
                  format: "%H:%M",
                  count: 23
                  // values:[thisYesterday+' 00:00:00', thisYesterday+' 23.09:15']
              }
            }
        }
      });

  });
});


//-------------------------------------------------
// 客服佔線監控 vipabc #cp-2V
//-------------------------------------------------
function countPercent(ar){
    percentSum = 0
    for(var i=1 ; i< ar.length ; i++){
        percentSum += (ar[i][2] / ar[i][1])
    }

    return (percentSum / (ar.length-1) *100 ).toFixed(2)
}


function fullTime(ar){
    fulltime = 0
    for(var i=1 ; i< ar.length ; i++){
        if ( ar[i][2] == ar[i][1] ){
            fulltime += 15 ; //秒
        }
    }

    return fulltime / 60
}


$(function() {
  var TTNStatus_json = Dashboard.url.getcpctibusystatus + "?brandId=2&startDateTime="+thisToday+"&endDateTime="+thisTomorrow;
  var data_1;
  $.getJSON(TTNStatus_json, function(e) {
      data_1 = e.data;
      
      var recordDate = ['recorddate'];
      var maxCP = ['排班客服最大服務人員數'];
      var busyCP = ['客服忙碌人數'];
      var lossLine = ['當日掉線累積數'];
      for(var i=0 ; i<data_1.length ; i++){
        data_1[i];
        recordDate.push(data_1[i][0]);
        maxCP.push(data_1[i][1]);
        busyCP.push(data_1[i][2]);
        lossLine.push(data_1[i][3]);
      }

      $("#db3_3_2").html(dbDescription.db3_3_2);
      $("#cpDateV").html( thisToday );
      $("#cpAllPeopleV").html(countPercent(data_1) + "%");
      $("#cpOccupiedV").html(fullTime(data_1) + " mins");

      var chart = c3.generate({
        bindto: '#cp-2V',
        padding: {
          left: 50,
          right: 45,
          bottom: 15,
        },
        data: {
            x: 'recorddate',
            xFormat: '%Y-%m-%dT%H:%M:%S',
            columns: [
                recordDate,
                maxCP,
                busyCP,
                lossLine,
            ],
            type: 'area',
            axes: {
                '排班客服最大服務人員數': 'y',
                '客服忙碌人數': 'y',
                '當日掉線累積數': 'y2',
            }
        },
        color: {
            pattern: dbColors.ColorBusy
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
              padding: { bottom: 10, },
              min: 0,
            },
            y2: {
              label: {
                  text:'單位：累積數', 
                  position: 'outer-middle'
              },
              show: true,
              padding: { bottom: 10, },
              min: 0,
              max: 80,
            },
            x: {
              type: 'timeseries',
              height: 40,
              tick: {
                  rotate: -60,
                  culling: false,
                  format: "%H:%M",
                  count: 23
                  // values:[thisYesterday+' 00:00:00', thisYesterday+' 23.09:15']
              }
            }
        }
      });

  });
});


