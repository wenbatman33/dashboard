var isDebug = true;
var devVhost = "http://resapi01.tutorabc.com/dashboard";//http://172.16.81.11/dashboard";  //測試環境 http://resapi01.tutorabc.com/dashboard
var prodVhost  = "http://172.16.81.11/dashboard"; //正式環境
if(isDebug){
    var performanceDate = new DateTimeUtility(new Date());
    var Dashboard = {
        url : {
            getcallresult : '../dashboard/assets/data/getcallresult.json' //全區/各大區總計 每日新名單
            ,getctilist : '../dashboard/assets/data/getctilist.json'  // 全區/各大區總計 每周通時通次?startDate=2016-06-19&endDate=2016-06-27&periodType=2
            ,getctiagentperformanceSingleMonth : '../dashboard/assets/data/getctiagentperformanceSingleMonth.json'  //各大區 月份成交件數
            ,getctiwaterflow : '../dashboard/assets/data/getctiwaterflow.json'//水位報表 ?recordDate=2016-06-28
            ,getctiagentperformanceperday : '../dashboard/assets/data/getctiagentperformanceperday.json' //各大區 單日每小時成交件數?recordDate=2016-07-04
            ,fireReport : '../dashboard/assets/data/fireReport.json'  // 小幫手發火監控?startDate=2016-06-28&endDate=2016-06-29
            ,earth : '../dashboard/assets/data/earth.json'  // 小幫手發火監控 ?recordDate=2016-07-04&recordHour=16
            ,gettransbyday : '../dashboard/assets/data/gettransbyday.json'  // 每日成交數?startDate=2016-05-26&endDate=2016-06-02
            ,getnewstate: '../dashboard/assets/data/getnewstate.json'  // 新客戶首課狀態 ?startDate=2016-04-01&endDate=2016-04-16
            ,getnewpoint : '../dashboard/assets/data/getnewpoint.json'  // 首課顧問評鑑?startDate=2016-03-01&endDate=2016-04-01
            ,getnewfire : '../dashboard/assets/data/getnewfire.json'  // 首課發火率?startDate=2016-03-24&endDate=2016-03-31
            ,getrefund : '../dashboard/assets/data/getrefund.json'  // 退費通報數與前三天比較?startDate=2016-04-01&endDate=2016-04-08
            ,getcare : '../dashboard/assets/data/getcare.json'  //新客戶成交後，尚未關懷天數?startDate=2015-12-22&endDate=2015-12-30
            ,getcpctiserv : '../dashboard/assets/data/getcpctiserv.json'  //客服工作狀態監控統計
            ,getcpctibusystatus : '../dashboard/assets/data/getcpctibusystatus.json'  //客服佔線監控
        }
    }
}else{
    var performanceDate = new DateTimeUtility(new Date());
    var Dashboard = {
        url : {
            getcallresult : prodVhost + "/webapi/roster/1/getcallresult"  //全區/各大區總計 每日新名單
            ,getctilist : prodVhost + "/webapi/cas/1/getctilist"  // 全區/各大區總計 每周通時通次
            ,getctiagentperformanceSingleMonth : prodVhost + "/webapi/tsrstatisticsperformance/1/getctiagentperformanceSingleMonth"  //各大區 月份成交件數
            ,getctiwaterflow : prodVhost + "/webapi/roster/1/getctiwaterflow"//水位報表
            ,getctiagentperformanceperday : prodVhost + "/webapi/tsrstatisticsperformance/1/getctiagentperformanceperday" //各大區 單日每小時成交件數

            ,fireReport : prodVhost + "/webapi/helpmessagelog/1/getreport"  // 小幫手發火監控
            ,earth : prodVhost + "/webapi/helpmessagelog/1/getcurrent"  // 小幫手發火監控

            ,gettransbyday : prodVhost + "/webapi/tr/1/gettransbyday?startDate=2016-05-26&endDate=2016-06-02"  // 每日成交數
            ,getnewstate : prodVhost + "/webapi/tr/1/getnewstate"  // 新客戶首課狀態
            // ,getnewstate : prodVhost + "/webapi/tr/1/getnewstate?startDate=2016-03-20&endDate=2016-03-30"  // 新客戶首課狀態
            ,getnewpoint : prodVhost + "/webapi/tr/1/getnewpoint?startDate=2016-03-01&endDate=2016-04-01"  // 首課顧問評鑑
            ,getnewfire : prodVhost + "/webapi/tr/1/getnewfire?startDate=2016-03-24&endDate=2016-03-31"  // 首課發火率
            ,getrefund : prodVhost + "/webapi/tr/1/getrefund?startDate=2016-04-01&endDate=2016-04-08"  // 退費通報數與前三天比較
            ,getcare : prodVhost + "/webapi/tr/1/getcare?startDate=2015-12-22&endDate=2015-12-30"  //新客戶成交後，尚未關懷天數

            ,getcpctiserv : prodVhost + "/webapi/cpcti/1/getcpctiserv"  //客服工作狀態監控統計
            ,getcpctibusystatus : prodVhost + "/webapi/cpcti/1/getcpctibusystatus"  //客服佔線監控
        }
    }
}

var dbDescription = {
    db3_2_1: "顯示當日各大區新名單各種外呼結果次數、比例。<br>表示各大區成功外呼次數及其他失敗原因外呼次數，以供各大區外呼成效之比較參考。",
    db3_2_2: "顯示一周內某大區的通話時數、通話次數隨時間的變化，可作為未來通話時間調整之依據。",
    db3_2_3: "統計某月份各區成交件數。<br>(1) 顯示當月各大區各佔成交數比率，   。<br>(2) 與上月成交數做環比分析，顯示成交件數是否比上月成長，分析成長力道。",
    db3_2_4: "顯示各級名單「單日」撥打情形。<br>監控各級名單是否尚有剩餘數量，不足時則需要流入名單。",
    db3_2_5: "顯示各大區月成交件數統計成長圖。",

    db3_4_1: "顯示即時的發火訊息、地圖及相關狀況。",
    db3_4_2: "顯示24小時內的發火訊息及相關狀況之統計。完成處理次數愈接發火訊息次數愈完美。",

    db3_1_1: "顯示每日新客戶成交數筆數資料。",
    db3_1_2: "顯示每日新客戶成交數與已首課人數統計，每日新客戶成交數與首課人數兩數相近為較完美狀態。",
    db3_1_3: "顯示每日顧問分數、教材分數、連線分數比較表，分數愈高愈佳。",
    db3_1_4: "顯示每日的首課人數與發火數比率統計，發火數接近0為完美狀態。",
    db3_1_5: "顯示今日與前三日的退費通報數。",
    db3_1_6: "統計一個月時間內，每個新客戶成交後在什麼時間點內關懷。愈快時間內關懷數愈大為較佳狀態。",

    db3_3_1: "顯示每日中的各客服工作時間(以分鐘為單位)。通話中、客戶關懷、客戶服務、準備接聽、非服務狀態統計圖。",
    db3_3_2: "顯示當日客服佔線監控。監控客服一日內排班人員數及滿載率關系，以及滿載時掉線數情況。<br>(1) 藍線表示目前排班客服最大服務人員數。<br>(2) 紅線表示目前客服忙碌數，當紅線等於藍線數即表示滿載。<br>(3) 表上方記錄 當日人員利用率 (紅色面積/藍色面積)，及滿載時間 (當日所有滿載時間段加總)，可以看出客服是否有效利用或負載過重。<br>(4) 當時間段滿載時，有可能出現掉線情況，黃線表示掉線累積數 (最理想狀況掉線數為0)，圖中可看出當線圖較陡時，該時段有掉線爆增情況，可供之後調整人員調度參考。",

}

var dbColors = {
    Color10:  ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    Color20a: ['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5'],
    Color20b: ['#393b79','#5254a3','#6b6ecf','#9c9ede','#637939','#8ca252','#b5cf6b','#cedb9c','#8C6D34','#bd9e39','#e7ba52','#e7cb94','#843c39','#ad494a','#D66160','#e7969c','#7b4173','#a55194','#ce6dbd','#de9ed6'],
    Color20c: ['#3182bd','#6baed6','#9ecae1','#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354','#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363','#969691','#bdbdbd','#d9d9d9'],
    ColorWater: ['#4c99d2', '#85bee0'],
    ColorLine: ['#31a354','#9c9ede','#e377c2','#6baed6','#ffbb78'],
    ColorBusy: ['#85bee0','#ec6672','#ECCA25'],
}
