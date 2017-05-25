/*
 *
 * application core scripts
 *
 *
 *  TO DO:
    - target, b10d, b30d
    - touch friendly, swipe left right etc..
 */


//local storage
function FitLogAppDemo() {

    "use strict";

    // signOut / redirect to signin page
    document.getElementById('signOut').addEventListener('click', () => {
        location.href = "signin.html";
    });

    // INIT STORAGE 
    var userDataBase;
    if (localStorage.fitLogApp === undefined) {
        localStorage.setItem('fitLogApp', JSON.stringify(fakeObj()));
    }
    userDataBase = JSON.parse(localStorage.getItem('fitLogApp'));


    // INIT APP, NULL OBJs
    var initData, initTarget, initUser;
    var a = new AppData(initData, initTarget, initUser);
    var u = new AppUser(initUser);

    // Simulate .on() firebase method, but for LS
    function updateOnLSChange() {
        // add objects to app
        a.data = userDataBase.data;
        a.target = userDataBase.target;
        a.user = userDataBase.profile;

        u.user = userDataBase.profile;

        u.displayUser();
        u.fillUserForm();
        a.displayTableData();
        a.displayTarget();

        a.drawMainChart();
        a.drawChartOne();
        a.drawChartTree();
        a.drawChartTwo();
        a.fillNewDataForm();
        a.fillNewDataFormReadonly();

        //DELETE RECORDS
        var tablBtns = document.getElementById("DataTable").querySelectorAll("button");
        tablBtns.forEach(function (item) {
            item.addEventListener('click', function () {
                if (confirm("Are you sure?")) {
                    // alert("item." + item.value + " | this." + this.value);
                    userDataBase['data'] = a.deleteRecord(this.value);
                    //console.log(userDataBase.data);
                    localStorage.setItem('fitLogApp', JSON.stringify(userDataBase));
                    updateOnLSChange();
                };
            });
        });

    }

    // call function to fill app for first time
    updateOnLSChange();

    //save target
    var saveTarget = document.getElementById("saveTarget");
    saveTarget.addEventListener("click", () => {
        userDataBase['target'] = a.createTarget(); //return obj
        localStorage.setItem('fitLogApp', JSON.stringify(userDataBase));
        updateOnLSChange();
        window.location.hash = "log";
    });

    //save new data
    var createNewRecord = document.getElementById("createNewRecord");
    createNewRecord.addEventListener("click", () => {
        userDataBase['data'] = a.createNewRecord();
        localStorage.setItem('fitLogApp', JSON.stringify(userDataBase));
        updateOnLSChange();
        window.location.hash = "log";
    });

    //save new user data
    var saveUser = document.getElementById("saveUser");
    saveUser.addEventListener("click", () => {
        userDataBase['profile'] = u.editUser();
        localStorage.setItem('fitLogApp', JSON.stringify(userDataBase));
        updateOnLSChange();
        window.location.hash = "profile";
    });

    //update readonly props new record form
    var newDataForm = document.getElementById("newDataForm");
    newDataForm.addEventListener("click", () => {
        a.fillNewDataFormReadonly()
    }, false);

    //update progres table
    // var progTableSelectList = document.getElementById("progressTableSelectList");
    // progTableSelectList.addEventListener("change", () => a.displayTarget(), false);

}

/* * MAIN JSON OBJECTS */
//clean data for obj
function cleanData(val, fix) {

    var cleanVal = parseFloat(Number(val).toFixed(fix));
    if (isNaN(cleanVal) || cleanVal === 0 || cleanVal < 0) {
        cleanVal = "";
    }
    return cleanVal;
}
//Construct Data Object
function dataObj(dt, weig, wais, hau, ar, che, hip, fpr, fkg, bmass, form, activ, kcal, com) {
    this.measurementDate = dt;
    this.weightKgs = cleanData(weig, 2);
    this.waistCm = cleanData(wais, 2);
    this.haunchCm = cleanData(hau, 2);
    this.armsCm = cleanData(ar, 2);
    this.chestCm = cleanData(che, 2);
    this.hipsCm = cleanData(hip, 2);
    this.fatsPercent = cleanData(fpr, 2);
    this.fatKgs = cleanData(fkg, 2);
    this.bodyMassKgs = cleanData(bmass, 2);
    this.bmrFormula = form;
    this.physicalActivity = cleanData(activ, 3);
    this.bmaKcal = cleanData(kcal, 0);
    this.comment = com;
}
//User object
function userObj(na, bi, ge, he) {
    this.name = na;
    this.birth = bi;
    this.gender = ge;
    this.height = parseFloat(Number(he).toFixed(2));
}
//main object JSON data
function storageObj() {
    this.profile = new userObj('Me', '', '', '');
    this.target = new dataObj('', '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.data = [];
}

/* * MAIN FUNCTIONS */
function AppData(dt, tar, ur) {

    /* 
    object	{
            profile: {},
            target: {},
            data: [ {}, {}, {} ]
    }
    */


    //globals
    this.data = dt; //dataObj
    this.target = tar; //dataObj
    this.user = ur; //userObj

    //var mybirth = this.user.birth;
    //var mygender = this.user.gender;
    //var myheight = this.user.height;

    var bgColor; //color for readonly fields

    //dom elements
    var dataTable = document.getElementById("DataTable");
    var form = document.getElementById('newDataForm');
    var formValidationMsg = document.getElementById("newDataValidationMsg");
    var formDate = document.getElementById("newDataMeasurementDate");
    var formWeight = document.getElementById("newDataWeightKgs");
    var formWaist = document.getElementById("newDataWaistCm");
    var formHaunch = document.getElementById("newDataHaunchCm");
    var formArms = document.getElementById("newDataArmsCm");
    var formChest = document.getElementById("newDataChestCm");
    var formHips = document.getElementById("newDataHipsCm");
    var formComment = document.getElementById("newDataComment");

    var formChekbox = document.getElementById('newDataCustomCheck');
    var formFatsPercent = document.getElementById("newDataFatsPercent");
    var formFatKgs = document.getElementById("newDataFatKgs");
    var formBodyMass = document.getElementById("newDataBodyMassKgs");
    var formBMRFormula = document.getElementById("newDataBMRFormula");
    var formBMRFormulaTxt = formBMRFormula.options[formBMRFormula.selectedIndex].text;
    var formActivity = document.getElementById("newDataPhysicalActivity");
    var formActivityTxt = formActivity.options[formActivity.selectedIndex].text;
    var formBMAKcal = document.getElementById("newDataBMAKcal");

    //target dom
    var progressTable = document.getElementById("progressTable");
    var compareList = document.getElementById("progressTableSelectList");
    var targetWeight = document.getElementById("targetDataWeightKgs");
    var targetWaist = document.getElementById("targetDataWaistCm");
    var targetHaunch = document.getElementById("targetDataHaunchCm");
    var targetArms = document.getElementById("targetDataArmsCm");
    var targetChest = document.getElementById("targetDataChestCm");
    var targetHips = document.getElementById("targetDataHipsCm");
    var targetFatsPr = document.getElementById("targetDataFatsPercent");
    var targetFatKgs = document.getElementById("targetDataFatKgs");
    var targetBodyMass = document.getElementById("targetDataBodyMassKgs");
    //used for target table rendering

    this.headerFields = {

        measurementDate: "Measurement Date",
        weightKgs: "Weight, kg",
        waistCm: "Waist, cm",
        haunchCm: "Haunch, cm",
        armsCm: "Arms, cm",
        chestCm: "Chest, cm",
        hipsCm: "Hips, cm",
        fatsPercent: "Fats %",
        fatKgs: "Fat, kg",
        bodyMassKgs: "Body Mass, kg",
        bmrFormula: "Calc Formula",
        physicalActivity: "Physical Activity",
        bmaKcal: "Kcal",
        comment: "Comment"

    };

    //return data array with added new obj
    this.createNewRecord = function () {

        var setObj;

        //construct object
        var newData = new dataObj(
            formDate.value,
            parseFloat(Number(formWeight.value).toFixed(2)),
            parseFloat(Number(formWaist.value).toFixed(2)),
            parseFloat(Number(formHaunch.value).toFixed(2)),
            parseFloat(Number(formArms.value).toFixed(2)),
            parseFloat(Number(formChest.value).toFixed(2)),
            parseFloat(Number(formHips.value).toFixed(2)),
            parseFloat(Number(formFatsPercent.value).toFixed(2)),
            parseFloat(Number(formFatKgs.value).toFixed(2)),
            parseFloat(Number(formBodyMass.value).toFixed(2)),
            formBMRFormulaTxt,
            parseFloat(Number(formActivity.value).toFixed(3)),
            parseInt(Number(formBMAKcal.value).toFixed(0)),
            formComment.value
        );

        //add obj to data array

        if (this.data === undefined) {

            setObj = [];
            setObj.unshift(newData);
            //this.data = [];
            //this.data.unshift(newData);

        } else {

            setObj = this.data;
            setObj.unshift(newData);
            setObj.sort((b, a) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime());
            //this.data.unshift(newData);
            //sort by date
            //this.data.sort((b, a) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime());

        }



        //sort objects by date
        //return data object
        //return this.data;
        return setObj;

    };

    //fill up form based on last record
    this.fillNewDataForm = function () {

        formDate.value = todaysDate();

        if (this.data && this.data[0]) {

            var obj = this.data[0];

            if (obj) { //if there is records
                //cleanData(val, 2) //return number to fix
                formWeight.value = obj.weightKgs;
                formWaist.value = cleanData((obj.waistCm - 0.1), 2);
                formHaunch.value = obj.haunchCm - 0.5;
                formArms.value = obj.armsCm;
                formChest.value = obj.chestCm;
                formHips.value = obj.hipsCm;
                //others are calculate dinamicaly
                //console.log("triggered: fillNewDataForm()");
            }

        }
    };

    //fill new record readonly prop
    this.fillNewDataFormReadonly = function () {
        //set all data to empty string
        formFatsPercent.value = "";
        formFatKgs.value = "";
        formBodyMass.value = "";
        formBMAKcal.value = "";
        formValidationMsg.innerHTML = "";

        var feedbackMsg = "<div class=\"form-group text-danger\">";
        feedbackMsg += "<label for=\"example-text-input\" class=\"control-label col-xs-4\"></label>";
        feedbackMsg += "<div class=\"col-xs-8\">";
        feedbackMsg += "<p><b>Please fix some of the following issues to enable calculations.</b></p>";
        feedbackMsg += "<ul class=\"list-group\">";
        feedbackMsg += "<li><b>Gender</b></li>";
        feedbackMsg += "<li><b>Data of Birth</b></li>";
        feedbackMsg += "<li><b>Weight, kg</b></li>";
        feedbackMsg += "<li><b>Waist, cm</b></li>";
        feedbackMsg += "<li><b>Haunch, cm</b></li>";
        feedbackMsg += "</ul></div></div>";


        if (this.user) {

            var weight = cleanData(formWeight.value, 2);
            var haunch = cleanData(formHaunch.value, 2);
            var waist = cleanData(formWaist.value, 2);
            var height = cleanData(this.user.height, 2);

            //unclock fields for custom data
            if (formChekbox.checked === true) {

                formFatsPercent.readOnly = false;
                formFatKgs.readOnly = false;
                formBodyMass.readOnly = false;
                formBMAKcal.readOnly = false;
                bgColor = "rgba(0, 0, 0, 0.65)";
                formFatsPercent.style.backgroundColor = bgColor;
                formFatKgs.style.backgroundColor = bgColor;
                formBodyMass.style.backgroundColor = bgColor;
                formBMAKcal.style.backgroundColor = bgColor;

                //automatic calcs
            } else {

                formFatsPercent.readOnly = true;
                formFatKgs.readOnly = true;
                formBodyMass.readOnly = true;
                formBMAKcal.readOnly = true;
                bgColor = "rgba(3,3,3,0.25)";
                formFatsPercent.style.backgroundColor = bgColor;
                formFatKgs.style.backgroundColor = bgColor;
                formBodyMass.style.backgroundColor = bgColor;
                formBMAKcal.style.backgroundColor = bgColor;

                //check if all data for calculations
                if ((this.user.gender == "Male" || this.user.gender == "Female") &&
                    (this.user.birth.length == 10) &&
                    weight !== "" && waist !== "" &&
                    haunch !== "" && height !== ""
                ) {
                    //do calcs
                    var fatPr = calcFatsPercent(
                        this.user.gender,
                        height,
                        haunch,
                        waist);
                    formFatsPercent.value = fatPr;

                    var fatKgs = calcFatKgs(fatPr, weight);
                    formFatKgs.value = fatKgs;

                    var bodyMassKgs = calcBodyMassKgs(fatKgs, weight);
                    formBodyMass.value = bodyMassKgs;

                    var bmaKcal = calcBMAKcal(
                        this.user.gender,
                        this.user.birth,
                        formBMRFormula.value,
                        formActivity.value,
                        weight,
                        height,
                        bodyMassKgs);
                    formBMAKcal.value = bmaKcal;

                } else {
                    //give user feedback
                    formValidationMsg.innerHTML = feedbackMsg;
                }
            } //emd automatic calcs
        } else {
            formValidationMsg.innerHTML = feedbackMsg;
        }

        //debug
        //console.log("formFatsPercent " + formFatsPercent.value);
        //console.log("formFatKgs " + formFatKgs.value);
        //console.log("formBodyMass " + formBodyMass.value);
        //console.log("formBMAKcal " + formBMAKcal.value);
    };

    //generate table with data
    this.displayTableData = function () {
        var table = "";

        if (this.data) {

            for (var i = 0; i < this.data.length; i++) {
                table += "<tr class=\"item\">";
                table += "<td>" + (this.data.length - i) + "</td>";
                //for (var prop in data[i]) {
                //    table += "<td>" + data[i][prop] + "</td>";
                //}
                table += "<td nowrap>" + this.data[i].measurementDate + "</td>";
                table += "<td nowrap>" + this.data[i].weightKgs + "</td>";
                table += "<td nowrap>" + this.data[i].waistCm + "</td>";
                table += "<td nowrap>" + this.data[i].haunchCm + "</td>";
                table += "<td nowrap>" + this.data[i].armsCm + "</td>";
                table += "<td nowrap>" + this.data[i].chestCm + "</td>";
                table += "<td nowrap>" + this.data[i].hipsCm + "</td>";
                table += "<td nowrap>" + this.data[i].fatsPercent + "</td>";
                table += "<td nowrap>" + this.data[i].fatKgs + "</td>";
                table += "<td nowrap>" + this.data[i].bodyMassKgs + "</td>";
                table += "<td wrap>" + this.data[i].bmrFormula + "</td>";
                table += "<td nowrap>" + this.data[i].physicalActivity + "</td>";
                table += "<td nowrap>" + this.data[i].bmaKcal + "</td>";
                table += "<td wrap>" + this.data[i].comment + "</td>";

                table += "<td>";
                table += "<button value=\"" + i + "\" class=\"btn btn-danger btn-xs\">";
                table += "<span class=\"glyphicon glyphicon-remove\">";
                table += "</span></button>";
                table += "</td>";
                table += "</tr>";
            }

            dataTable.innerHTML = table;

        } else {

            table += "<tr><td colspan=\"16\"><h3>";
            table += "<a href=\"#createRecord\">Hey, create your first record by pressing <i style=\"color:#fff\" class=\"glyphicon glyphicon-plus\"></i> in the upper right!</a>";
            table += "</h3></td></tr>";
            dataTable.innerHTML = table;
        }
    };

    //delete record from data array, return array
    this.deleteRecord = function (i) {
        //if (confirm("Are you sure?")) {
        this.data.splice(i, 1);
        return this.data;
        // }
    };

    //display user target
    this.displayTarget = function () {

        var table = "";

        if (this.data && this.data[0]) {

            var progress = this.data[0];
            var tableRows = [];
            var tableCells = [];

            //construct multidimensioanl array
            for (var prop in this.target) {
                if (this.target[prop] !== '') {
                    //console.log(this.headerFields[prop] + " - " + progress[prop] + " - " + this.target[prop]);
                    tableCells = [this.headerFields[prop], progress[prop], this.target[prop]];
                    tableRows.push(tableCells);
                }
                //  arr = [
                //          ['field name', 'target', 'last record'],
                //          ['field name', 'target', 'last record'],
                //          ['field name', 'target', 'last record'],
                //        ]
            }

            //loop to display the data
            if (tableRows.length > 0) {
                for (var i = 0; i < tableRows.length; i++) {
                    //console.log(tableRows[i]);
                    table += "<tr>";
                    table += "<td nowrap class=\"text-right\"><b>" + tableRows[i][0] + "</b></td>";
                    table += "<td nowrap class=\"text-left\">" + tableRows[i][1] + "</td>";
                    table += "<td nowrap class=\"text-left\">" + tableRows[i][2] + "</td>";

                    // TO DO COMPARE FROM DROP LIST FOR BEFORE 10, 30 DAYS RESULTS
                    //                    switch (compareList.value) {
                    //                        case "b10d":
                    //                            table += "<td nowrap class=\"text-left\">" + "10" + "</td>";
                    //                            break;
                    //                        case "b30d":
                    //                            table += "<td nowrap class=\"text-left\">" + "30" + "</td>";
                    //                            break;
                    //                        case "f1r":
                    //                            table += "<td nowrap class=\"text-left\">" + "f1r" + "</td>";
                    //                            break;
                    //                        default:
                    //                            table += "<td nowrap class=\"text-left\">" + "NaN" + "</td>";
                    //                    }
                    table += "</tr>";
                    //check if no target
                }

            } else {
                //no target
                //console.log(tableRows);
                table += "<tr><td colspan=\"4\"><ul>";
                table += "<p>No records and/or target found</p>";
                table += "<p><a href=\"#createRecord\" style=\"color:#fff\"><i class=\"glyphicon glyphicon-plus\"></i> Add Data</a></p>";
                table += "<p><a href=\"#createTarget\" style=\"color:#fff\"><i class=\"glyphicon glyphicon-edit\"></i> Write a Target</a></p>";
                table += "</ul></td></tr>";
            }

        } else {
            //no data
            table += "<tr><td colspan=\"4\"><ul>";
            table += "<p>No records and/or target found</p>";
            table += "<p><a href=\"#createRecord\" style=\"color:#fff\"><i class=\"glyphicon glyphicon-plus\"></i> Add Data</a></p>";
            table += "<p><a href=\"#createTarget\" style=\"color:#fff\"><i class=\"glyphicon glyphicon-edit\"></i> Write a Target</a></p>";
            table += "</ul></td></tr>";
        }

        progressTable.innerHTML = table;
    };

    //create target, return obj
    this.createTarget = function () {

        var obj = new dataObj(
            '', //dt, 
            parseFloat(Number(targetWeight.value).toFixed(2)), //weig, 
            parseFloat(Number(targetWaist.value).toFixed(2)), //wais, 
            parseFloat(Number(targetHaunch.value).toFixed(2)), //hau, 
            parseFloat(Number(targetArms.value).toFixed(2)), //ar, 
            parseFloat(Number(targetChest.value).toFixed(2)), //che, 
            parseFloat(Number(targetHips.value).toFixed(2)), //hip, 
            parseFloat(Number(targetFatsPr.value).toFixed(2)), //fpr, 
            parseFloat(Number(targetFatKgs.value).toFixed(2)), //fkg, 
            parseFloat(Number(targetBodyMass.value).toFixed(2)), //bmass, 
            '', //form, 
            '', //activ, 
            '', //kcal, 
            '' //com
        );

        return obj;

        //this.target = obj;
        //return this.target;
    };

    //draw Simplified chart
    var mainChart = null;
    this.drawMainChart = function () {

        //chart global config
        Chart.defaults.global.defaultFontColor = '#fff';
        var ctx = document.getElementById("mainChart").getContext("2d");

        //        console.log(mainChart)
        if (mainChart !== null) {
            mainChart.destroy();
            //              console.log("chart destroyed");
            //              console.log(mainChart);
        };



        if (this.data) {
            //datasets
            var xFatsPercent = {
                type: "line",
                yAxisID: "y-axis-2",
                label: "Fats (%)",
                data: constructArray(this.data, "fatsPercent"),
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                //borderWidth: 2,
                //pointRadius: 1,
                //pointHoverRadius: 5,
                fill: false
            };

            var xWeightKgs = {
                type: "bar",
                yAxisID: "y-axis-1",
                label: "Weight (kg)",
                data: constructArray(this.data, "weightKgs"),
                backgroundColor: window.chartColors.purple
            };

            var chartData = {
                labels: constructChartLabels(this.data, 'measurementDate'),
                datasets: [xFatsPercent, xWeightKgs]
            };

            var chartOptions = {
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    intersect: true,
                    position: "nearest",
                },
                scales: {
                    xAxes: [
                        {
                            barPercentage: 0.9,
                            categoryPercentage: 1,
                            gridLines: {
                                display: false
                            }
                    }
                ],

                    yAxes: [
                    //one obj for each y axes
                        {
                            id: "y-axis-1",
                            type: "linear", //"linear", "logarithmic", "time",...
                            position: "left",
                            gridLines: {
                                display: false
                            },
                    },
                        {
                            id: "y-axis-2",
                            type: "linear",
                            position: "right",
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                //beginAtZero: true
                                min: 3
                            }
                    }
                ] //end yAxes
                } //end scales
            };

            //draw chart
            //console.log(chartOptions);
            //console.log(window.outerWidth);
            //console.log(screen.width);

            if (window.outerWidth < 768 || window.width < 768) {
                //console.log("chart small screen triggered");
                chartOptions.scales.xAxes[0].display = false;
                chartOptions.scales.yAxes[0].display = false;
                chartOptions.scales.yAxes[1].display = false;
                Chart.defaults.global.elements.point.radius = 1;
            };


            mainChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: chartOptions
            });

        } else {

            ctx.font = "16px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText("There is no data to display.", 10, 20);

        }

    };

    //draw cm chart
    var chartOne = null;
    this.drawChartOne = function () {

        //chart global config
        //Chart.defaults.global.defaultFontColor = '#fff';
        var ctxChart = document.getElementById("ChartOne").getContext("2d");

        //        console.log(mainChart)
        if (chartOne !== null) {
            chartOne.destroy();
            //              console.log("chart destroyed");
            //              console.log(mainChart);
        };

        if (this.data) {
            var dataSet1 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Waist (cm)",
                data: constructArray(this.data, "waistCm"),
                fill: false
            };

            var dataSet2 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Haunch (cm)",
                data: constructArray(this.data, "haunchCm"),
                fill: false
            };
            var dataSet3 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Arms (cm)",
                data: constructArray(this.data, "armsCm"),
                fill: false
            };
            var dataSet4 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Chest (cm)",
                data: constructArray(this.data, "chestCm"),
                fill: false
            };
            var dataSet5 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Hips (cm)",
                data: constructArray(this.data, "hipsCm"),
                fill: false
            };

            // red
            // orange
            // yellow
            // green
            // blue
            // purple
            // grey
            // greyy
            // indigo
            
            dataSet1.backgroundColor = window.chartColors.orange; //waist
            dataSet2.backgroundColor = window.chartColors.yellow; //haunch
            dataSet3.backgroundColor = window.chartColors.purple; //arms
            dataSet4.backgroundColor = window.chartColors.red; //chest
            dataSet5.backgroundColor = window.chartColors.indigo; // hips

            dataSet1.borderColor = window.chartColors.orange;
            dataSet2.borderColor = window.chartColors.yellow;
            dataSet3.borderColor = window.chartColors.purple;
            dataSet4.borderColor = window.chartColors.red;
            dataSet5.borderColor = window.chartColors.indigo;

            var chartData = {
                labels: constructChartLabels(this.data, 'measurementDate'),
                //datasets array order is important too
                datasets: [dataSet4, dataSet2, dataSet1, dataSet5, dataSet3]
            };

            var chartOptions = {
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    intersect: true,
                    position: "nearest",
                },
                scales: {
                    xAxes: [
                        {
                            //                            barPercentage: 1,
                            //                            categoryPercentage: 1,
                            gridLines: {
                                display: false
                            }
                    }
                ],
                    //one obj for each y axes
                    yAxes: [

                        {
                            id: "y-axis-1",
                            type: "linear",
                            position: "left",
                            display: true,
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                //beginAtZero: true
                                // min: 3
                            }
                    }
                ] //end yAxes
                } //end scales
            };

            if (window.outerWidth < 768 || window.width < 768) {
                //console.log("chart small screen triggered");
                chartOptions.scales.xAxes[0].display = false;
                chartOptions.scales.yAxes[0].display = false;
            };

            //draw chart
            chartOne = new Chart(ctxChart, {
                type: 'bar',
                data: chartData,
                options: chartOptions
            });

        } else {

            ctxChart.font = "16px Arial";
            ctxChart.fillStyle = "white";
            ctxChart.textAlign = "left";
            ctxChart.fillText("There is no data to display.", 10, 20);

        };
    };

    //draw detailed chart
    var chartTree = null;
    this.drawChartTree = function () {

        //chart global config
        //Chart.defaults.global.defaultFontColor = '#fff';
        var ctxChart = document.getElementById("ChartTree").getContext("2d");

        if (chartTree !== null) {
            chartTree.destroy();
        };

        if (this.data) {

            var dataSet1 = {
                type: "line",
                yAxisID: "y-axis-1",
                label: "Fats (%)",
                data: constructArray(this.data, "fatsPercent"),
                //                borderWidth: 3,
                //                pointRadius: 2,
                //                pointHoverRadius: 5,
                fill: false
            };

            var dataSet2 = {
                type: "line",
                yAxisID: "y-axis-2",
                label: "Physical activity",
                data: constructArray(this.data, "physicalActivity"),
                //                borderWidth: 3,
                //                pointRadius: 2,
                //                pointHoverRadius: 5,
                fill: false
            };

            dataSet1.backgroundColor = window.chartColors.red;
            dataSet2.backgroundColor = window.chartColors.green;

            dataSet1.borderColor = window.chartColors.red;
            dataSet2.borderColor = window.chartColors.green;


            var chartData = {
                labels: constructChartLabels(this.data, 'measurementDate'),
                //datasets array order is important too
                datasets: [dataSet1, dataSet2]
            };

            var chartOptions = {
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    intersect: true,
                    position: "nearest",
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            gridLines: {
                                display: false
                            }
                    }
                ],
                    //one obj for each y axes
                    yAxes: [

                        {
                            id: "y-axis-1",
                            display: true,
                            type: "linear",
                            position: "left",
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                // beginAtZero: true
                                min: 3
                            }
                    },

                        {
                            id: "y-axis-2",
                            display: true,
                            type: "linear",
                            position: "right",
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                // beginAtZero: true
                                min: 1
                            }
                    }
                ] //end yAxes
                } //end scales
            };

            if (window.outerWidth < 768 || window.width < 768) {
                //console.log("chart small screen triggered");
                chartOptions.scales.xAxes[0].display = false;
                chartOptions.scales.yAxes[0].display = false;
                chartOptions.scales.yAxes[1].display = false;

            };

            //draw chart
            chartTree = new Chart(ctxChart, {
                type: 'bar',
                data: chartData,
                options: chartOptions
            });

        } else {

            ctxChart.font = "16px Arial";
            ctxChart.fillStyle = "white";
            ctxChart.textAlign = "left";
            ctxChart.fillText("There is no data to display.", 10, 20);

        }
    };

    //pie chart
    var chartTwo = null;
    this.drawChartTwo = function () {

        //chart global config
        //Chart.defaults.global.defaultFontColor = '#fff';
        var ctxChart = document.getElementById("ChartTwo").getContext("2d");

        if (chartTwo !== null) {
            chartTwo.destroy();
        };


        // debugger;
        if (this.data && this.data[0]) {

            var fatKgs = this.data[0].fatKgs;
            var bodyMassKgs = this.data[0].bodyMassKgs;

            //bodyMassKgs

            var chartData = {
                labels: ["Fats (kg)", "Body Mass (kg)"],
                datasets: [
                    {
                        data: [fatKgs, bodyMassKgs],
                        backgroundColor: [
                window.chartColors.yellow,
                 window.chartColors.red
            ]

        }]
            };

            var chartOptions = {
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    intersect: true,
                    position: "nearest",
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
            };

            //draw chart
            this.chartTwo = new Chart(ctxChart, {
                type: 'pie',
                data: chartData,
                options: chartOptions
            });

        } else {

            ctxChart.font = "16px Arial";
            ctxChart.fillStyle = "white";
            ctxChart.textAlign = "left";
            ctxChart.fillText("There is no data to display.", 10, 20);

        };
    };

}

function AppUser(userObj) {

    /* * USER functions 

  "UserProfile": {
                "name": "AY",
                "birth": "1991-01-01",
                "gender": "Male",
                "height": 171
                 },

    */

    this.user = userObj;

    //dom elements, display user
    this.displayUser = function () {

        document.getElementById("userNavBar").innerHTML = "<i class=\"glyphicon glyphicon-user\"></i> " + this.user.name;

        document.getElementById("userName").innerHTML = this.user.name;
        document.getElementById("userBirth").innerHTML = this.user.birth;
        document.getElementById("userGender").innerHTML = this.user.gender;
        document.getElementById("userHeight").innerHTML = this.user.height;
    };
    //dom edit user form
    var editName = document.getElementById("editUserName");
    var editBirth = document.getElementById("editUserBirth");
    var editGender = document.getElementById("editUserGender");
    var editHeight = document.getElementById("editUserHeight");

    //fill up edit user form based on existing data data
    this.fillUserForm = function () {
        editName.value = this.user.name;
        editBirth.value = this.user.birth;
        editGender.value = this.user.gender;
        editHeight.value = this.user.height;
    };
    //return modifyed user
    this.editUser = function () {
        this.user.name = editName.value;
        this.user.birth = editBirth.value;
        this.user.gender = editGender.value;
        this.user.height = editHeight.value;
        return this.user;
    };
}

/* * APPLICATION CALCULATIONS */
//calc fats %
function calcFatsPercent(gender, height, haunch, waist) {
    var fatsPercent;
    var validNumber;

    if (gender == "Male") {
        fatsPercent = (Number(haunch) * 0.55 - 2 + Number(waist) * 0.29 - 4 - Number(height) * 0.24 - 10);
        fatsPercent = fatsPercent.toFixed(2);
    } else if (gender == "Female") {
        fatsPercent = (((((haunch * 0.55) - 1) + ((waist * 0.29) - 2))) - (height * 0.24)) - 10;
        fatsPercent = fatsPercent.toFixed(2);
    }

    return cleanData(fatsPercent, 2);
};
//calc fat kgs
function calcFatKgs(fatsPercent, weight) {
    //([@[Fats, %]]/100)*[@[Weight, kgs]]
    var fatKgs;
    fatKgs = (fatsPercent / 100) * weight;
    //  return fatKgs.toFixed(2);
    return cleanData(fatKgs, 2);
};
//calc body mass kgs
function calcBodyMassKgs(fatKgs, weight) {
    //=[@[Weight, kgs]]-[@[Fat, kgs]]
    var bodyMassKgs;
    bodyMassKgs = (weight - fatKgs);
    // return bodyMassKgs.toFixed(2);
    return cleanData(bodyMassKgs, 2);

};
//calc Basal metabolic with physical activity
function calcBMAKcal(gender, birth, formula, activity, weight, height, bodyMass) {

    var age = (todaysDate().substring(0, 4)) - (birth.substring(0, 4));
    var bmr;
    var bmrAgeCorrectionCoef = 0.2 * age;
    var bma;

    /*
  FORMULAS DESCRIPTION
  BMR - Basal metabolic rate;
  BMA - Bassal metabolism with physical activity;

  The Original Harris-Benedict Equation (published in 1918 and 1919)
      Men:   BMR = 66.5 + ( 13.75 × weight in kg ) + ( 5.003 × height in cm ) – ( 6.755 × age in years )
      Women: BMR = 655.1 + ( 9.563 × weight in kg ) + ( 1.850 × height in cm ) – ( 4.676 × age in years )

  The Revised Harris-Benedict Equation (The H-B equations revised by Roza and Shizgal in 1984)
      Men:	  BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
      Women:	BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)

  The Mifflin St Jeor Equation (The Harris–Benedict equations revised by Mifflin and St Jeor in 1990)
      Men:	 BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
      Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161

  The Katch-McArdle Formula (Resting Daily Energy Expenditure)
      BMR = 370 + (21.6 × LBM),  where LBM is the lean body mass in kg.

  It is assumed that the energy demand is reduced by about 2% per decade of life.
  This amount should be deducted from daily minimum calories.
      reducedBMR = BMR * (0.2 × age in years)

  Determine Recommended Intake.
  Calculation of an individual's recommended daily kilocalorie intake to maintain current weight
      physicalActivity: 1.200 - Little to no exercise
      physicalActivity: 1.375 - Light exercise (1–3 days per week)
      physicalActivity: 1.550 - Moderate exercise (3–5 days per week)
      physicalActivity: 1.725 - Heavy exercise (6–7 days per week)
      physicalActivity: 1.900 - very heavy exercise (twice per day, extra heavy workouts)

=================================================================
  FORM STUFF

  <select class="form-control" id="newDataBMRFormula">
    <option value="1">1 - H-B, Mifflin St Jeor Equation rev. in 1990</option>
    <option value="2">2 - Katch-McArdle Formula</option>
    <option value="3">3 - H-B, Roza and Shizgal Equation rev. in 1984<option>
    <option value="4">4 - H-B, (Harris-Benedict) original equation published in 1918<option>
  </select>

  <select class="form-control" id="newDataPhysicalActivity">
    <option value="1.200">1.200 - Little to no exercise </option>
    <option value="1.375">1.375 - Light exercise (1–3 days per week) </option>
    <option value="1.550">1.550 - Moderate exercise (3–5 days per week) </option>
    <option value="1.725">1.725 - Heavy exercise (6–7 days per week) </option>
    <option value="1.900">1.900 - very heavy (twice per day, extra heavy workouts) </option>
  </select>
  */

    switch (Number(formula)) {
        case 1:
            // 1 - H-B, Mifflin St Jeor Equation rev. in 1990
            if (gender == "Female") {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            }
            //console.log("1 - H-B, Mifflin St Jeor Equation rev. in 1990");
            break;
        case 2:
            // 2 - Katch-McArdle Formula
            bmr = 370 + (21.6 * bodyMass);
            bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
            bma = bmr * activity;
            //console.log("2 - Katch-McArdle Formula");
            break;
        case 3:
            // 3 - H-B, Roza and Shizgal Equation rev. in 1984
            if (gender == "Female") {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            } else {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            }
            //console.log("3 - H-B, Roza and Shizgal Equation rev. in 1984");
            break;
        case 4:
            // 4 - H-B, (Harris-Benedict) original equation published in 1918
            if (gender == "Female") {
                bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            } else {
                bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
                bmr -= ((bmr * bmrAgeCorrectionCoef) / 100);
                bma = bmr * activity;
            }
            //console.log("4 - H-B, (Harris-Benedict) original equation published in 1918");
            break;
    }
    //console.log("formula number:" + formula);
    //return bma.toFixed();
    return cleanData(bma, 0);

}

/* * UTILITIES */
//Insert Fake data to LS
function injectFakeData(obj) {
    localStorage.setItem('fitLogApp', JSON.stringify(obj));
    document.location.reload();
}
//get today "yyyy-mm-dd"
function todaysDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    //"2017-04-28"
    return today;
}
//hash nav bar
function hashNav() {
    //array with all animations
    var animationsArr = ['rotatingPlane',
                        'wave',
                        'wanderingCubes',
                        'chasingDots',
                        'threeBounce',
                        'circle',
                        'cubeGrid',
                        'fadingCircle'];
    //random animation
    var animation = animationsArr[(Math.random() * animationsArr.length) | 0];

    //globals
    var pages = document.querySelectorAll(".page"); // get all pages
    var hash = location.hash.substring(1); //get hash
    var showPage = document.getElementById(hash); //get page to show
    var time = 600;

    //modal loading options
    var loadingOptions = {
        // position: 'auto',
        // text: '',
        color: '#fff',
        opacity: '0.6',
        backgroundColor: 'rgb(0,0,0)',
        animation: animation
    };

    //start ui animation
    $('body').loadingModal(loadingOptions);
    $('body').loadingModal('show');

    //be sure all the pages are hide
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }

    //set timeout when to show pages
    setTimeout(function () {
        if (showPage) {
            showPage.style.display = "block";
        } else {
            document.getElementById("log").style.display = "block";
        }
        $('body').loadingModal('hide');
    }, time);

    //    $('body').loadingModal('destroy');
    return false; // cancel the click

    //old nav
    //    var pages = document.querySelectorAll(".page"); // get all pages
    //    var hash = location.hash.substring(1); //get hash
    //    var showPage = document.getElementById(hash); //get page to show
    //
    //    //be sure all are not displayed
    //    for (var i = 0; i < pages.length; i++) {
    //        pages[i].style.display = "none";
    //    }
    //    if (showPage) {
    //        showPage.style.display = "block";
    //
    //    } else {
    //        document.getElementById("log").style.display = "block";
    //    }
    //    return false; // cancel the click
}
//remove hash nav 
function removeHashNav() {
    var pages = document.querySelectorAll(".page"); // get all pages
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "block";
    }
}
//chart colors
window.chartColors = {
    //colors 2017
    AuroraRed: '#B93A32',
    Grenadine: '#DC4C46',
    GrenadineL: '#e26d69',
    TawnyPort: '#672E3B',
    TawnyPortL: '#8d3f51',
    BalletSlipper: '#F3D6E4',
    Butterum: '#C48F65',
    NavyPeony: '#223A5E',
    NeutralGray: '#898E8C',
    ShadedSpruce: '#005960',
    GoldenLime: '#9C9A40',
    Marina: '#4F84C4',
    AutumnMaple: '#D2691E',
    Niagara: "#578CA9",
    PrimroseYellow: "#F6D155",
    LapisBlue: "#004B8D",
    Flame: "#F2552C",
    IslandParadise: "#95DEE3",
    PaleDogwood: "#EDCDC2",
    PinkYarrow: "#5A7247",
    Hazelnut: "#CFB095",
    DustyCedar: "#AD5D5D",
    //from chart js
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)',
    greyy: 'rgb(220, 220, 220)',
    indigo: 'rgb(63, 81, 181)'
};
//chart data. Construct array from obj props, for chart data
function constructArray(arrWithObjs, objKey) {
    myArray = [];
    for (i = 0; i < arrWithObjs.length; i++) {
        if (arrWithObjs[i][objKey] === '') {
            myArray.unshift(NaN);
        } else {
            num = Number(arrWithObjs[i][objKey]);
            myArray.unshift(num);
        }
    }
    return myArray;
}

function constructChartLabels(arrWithObjs, objKey) {
    myArray = [];
    for (i = 0; i < arrWithObjs.length; i++) {
        if (arrWithObjs[i][objKey] === "") {
            myArray.unshift(NaN);
        } else {
            myArray.unshift(arrWithObjs[i][objKey]);
        }
    }
    return myArray;
}

//FORM plus and minus buttons
function formАuxiliaryBtns() {
    // btns example
    // <button type="button" class="btn btn-danger btn-number"  data-type="minus" data-field="quant[3]">
    // <input type="number" name="quant[3]" class="form-control input-number" value="170" min="140" max="250" id="editUserHeight">                                      
    // <button type="button" class="btn btn-success btn-number" data-type="plus" data-field="quant[3]">

    $('.btn-number').click(function (e) {
        e.preventDefault();

        fieldName = $(this).attr('data-field');
        type = $(this).attr('data-type');

        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if (type == 'minus') {

                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if (type == 'plus') {

                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }

            }
        } else {
            input.val(0);
        }
    });

    // OTHER FORMS STUFF
    /*
    $('.input-number').focusin(function(){
       $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function() {

        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());

        name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }


    });
    $(".input-number").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                 // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                 // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    */
}

function fakeObj() {

    /*
     * Mock data
     * generates new objects with fake data
     *
     * object {3}
     *	     profile	{4}
     *	     target		{14}
     *	     data		[30]
     *
     */

    //object
    this.object = new storageObj();
    //user 
    object.profile = new userObj("Demo User", "1991-01-01", "Male", 172);
    //target
    object.target = new dataObj('', 72, '', '', 40, 105, '', 12, '', '', '', '', '', '');

    //data array
    var arr = [];
    arr.unshift(new dataObj('2015-05-06', 78, 91, 101, 34, 101, 51, 24.9, 19.422, 58.578, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.55, 3010.126104, ''));
    arr.unshift(new dataObj('2015-05-30', 77, 89, 100, 33, 105, 51, 23.77, 18.3029, 58.6971, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.55, 2987.940672, 'Circuit workout'));
    arr.unshift(new dataObj('2015-06-04', 77, 92, 101, 34, 103, 55, 25.19, 19.3963, 57.6037, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.55, 2854.53, ''));
    arr.unshift(new dataObj('2015-06-13', 76, 89, 101, 33, 105, 53, 24.32, 18.4832, 57.5168, '2 - Katch-McArdle Formula ', 1.725, 2232.3708, ''));
    arr.unshift(new dataObj('2015-06-27', 75.3, 89, 100, 34, 104, 53, 23.77, 17.89881, 57.40119, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2950.2254376, 'change workout'));
    arr.unshift(new dataObj('2015-07-10', 74.9, 85, 100, 35, 106, 51.5, 22.61, 16.93489, 57.96511, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2941.3512648, ''));
    arr.unshift(new dataObj('2015-07-27', 75.5, 87, 99, 35, 104, 51, 22.64, 17.0932, 58.4068, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2954.662524, ''));
    arr.unshift(new dataObj('2015-08-12', 74.5, 87, 99, 35.5, 107, 50, 22.64, 16.8668, 57.6332, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2932.477092, ''));
    arr.unshift(new dataObj('2015-08-17', 73.5, 84, 96, 35, 106, 52, 20.12, 14.7882, 58.7118, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2910.29166, 'change workout'));
    arr.unshift(new dataObj('2015-09-01', 73, 84, 96, 34, 102, 51, 20.12, 14.6876, 58.3124, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2899.198944, ''));
    arr.unshift(new dataObj('2015-09-08', 71.5, 84, 95, 35, 104, 52, 19.57, 13.99255, 57.50745, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2865.920796, ''));
    arr.unshift(new dataObj('2015-09-19', 70.6, 83, 94, 35, 104, 52, 18.73, 13.22338, 57.37662, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2845.9539072, ''));
    arr.unshift(new dataObj('2015-10-04', 69, 81, 94, 34, 104, 50, 18.15, 12.5235, 56.4765, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2810.457216, ''));
    arr.unshift(new dataObj('2016-01-02', 71, 84, 96, 33, 100, 52, 20.12, 14.2852, 56.7148, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2845.426968, 'Change diet'));
    arr.unshift(new dataObj('2016-01-16', 73, 84, 96, 34, 103, 52, 20.12, 14.6876, 58.3124, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.55, 2889.797832, ''));
    arr.unshift(new dataObj('2016-01-21', 72, 84, 96, 34.5, 103, 52, 20.12, 14.4864, 57.5136, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.55, 2867.6124, ''));
    arr.unshift(new dataObj('2016-01-29', 72, 84, 97, 35, 103, 52, 20.67, 14.8824, 57.1176, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2867.6124, ''));
    arr.unshift(new dataObj('2016-02-06', 72.5, 83, 97, 35, 102, 53, 20.38, 14.7755, 57.7245, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2878.705116, ''));
    arr.unshift(new dataObj('2016-02-13', 73, 83, 97, 35.5, 103, 53, 20.38, 14.8774, 58.1226, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2889.797832, ''));
    arr.unshift(new dataObj('2016-02-22', 73, 82, 97, 36, 104, 52, 20.09, 14.6657, 58.3343, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2889.797832, ''));
    arr.unshift(new dataObj('2016-02-26', 73, 83, 96, 36, 105, 53, 19.83, 14.4759, 58.5241, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2889.797832, ''));
    arr.unshift(new dataObj('2016-03-13', 73.5, 82, 96, 35, 105, 52, 19.54, 14.3619, 59.1381, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2900.890548, 'Change workout'));
    arr.unshift(new dataObj('2016-03-19', 73.6, 85, 95, 34, 104, 52, 19.86, 14.61696, 58.98304, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2903.1090912, ''));
    arr.unshift(new dataObj('2016-04-02', 74, 85, 96, 36, 105, 52, 20.41, 15.1034, 58.8966, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2911.983264, ''));
    arr.unshift(new dataObj('2016-04-08', 75, 84, 96, 35, 105, 52, 20.12, 15.09, 59.91, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.725, 2934.168696, 'new diet'));
    arr.unshift(new dataObj('2016-07-19', 75.0, 88, 97, 35.5, 104, 53.0, 21.83, 16.4, 58.6, '1 - H-B, Mifflin St Jeor Equation rev. in 1990', 1.600, 2741, 'Circuit workout'));

    //ADD DATA TO THE OBJECT
    object.data = arr;

    return this.object;
}
