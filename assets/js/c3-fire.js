//-------------------------------------------------
// 小幫手發火監控 #chart1
//-------------------------------------------------

$(function() {
  var TTNStatus_json = Dashboard.url.fireReport //"http://172.16.81.11/dashboard/webapi/helpmessagelog/1/getreport?startDate=2016-05-24&endDate=2016-05-25";
  var data_1
  $("#db3_4_1").html(dbDescription.db3_4_1);
  $("#db3_4_2").html(dbDescription.db3_4_2);

  $.getJSON(TTNStatus_json, function(e) {
    data_1 = e.data;
    $('#fire-date').html((data_1.length > 0 ? "(" + data_1[0]['datetime'].substring(0, 10) + ")" : ""));

    var chart = c3.generate({
      bindto: '#fire-chart',
      padding: {
        left: 60,
        right: 15,
        bottom: 35,
      },
      size: {
          height: 400
      },
      data: {
        json: data_1,
        keys: {
          value: ['msgCount', 'doneCount', 'datetime']
        },
        x: 'datetime',
        xFormat: '%Y-%m-%d %H:%M:%S',
        types: {
          'msgCount': 'bar',
          'doneCount': 'bar',
        },
        colors: {
          'msgCount': '#ec6672',
          'doneCount': '#646c81',
        },
        names: {
          'msgCount': '發火訊息次數',
          'doneCount': '完成處理次數'
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
              text:'單位：次數', 
              position: 'outer-middle'
          },
          padding: { bottom: 10, },
          min: 0,
        },
        x: {
          type: 'timeseries',
          height: 60,
          tick: {
            culling: false,
            format: "%m-%d / %H:%M", //"%Y-%m-%d　%H:%M"
            rotate: -60,
          }
        }
      }
    });

  });
});