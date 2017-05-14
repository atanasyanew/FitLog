/*
 *
 * application core scripts
 *
 */


//local storage
function FitLogAppDemo() {

    var storage;
    var data;
    var target;
    var user;

    //init storage
    if (localStorage.fitLogApp == undefined) {
        //init empty storage   
        localStorage.setItem('fitLogApp', JSON.stringify(new storageObj()));
        document.location.reload();
    } else {
        storage = JSON.parse(localStorage.fitLogApp); //get localstorage data
        data = storage.data;
        target = storage.target;
        user = storage.profile;
    }

    if (data && target && user) {
        //init app     
        a = new appData(data, target, user);
        a.displayTableData();
        a.drawMainChart();
        a.fillNewDataForm();
        a.fillNewDataFormReadonly();
        a.displayTarget();

        //delete Record
        var tablBtns = document.getElementById("DataTable").querySelectorAll("button");
        //addEventListener for all btns 
        for (var i = 0; i < tablBtns.length; i++) {
            tablBtns[i].addEventListener('click', function () {

                if (confirm("Are you sure?")) {
                    //alert(this.value);
                    //console.log("value for del: " + this.value);
                    storage['data'] = a.deleteRecord(this.value); //return obj
                    //console.log(storage);
                    localStorage.setItem('fitLogApp', JSON.stringify(storage));
                    document.location.reload();
                }

            }, false);
        }

        //update readonly props new record form
        var newDataForm = document.getElementById("newDataForm");
        newDataForm.addEventListener("change", function () {
            a.fillNewDataFormReadonly();
        });
        newDataForm.addEventListener("click", function () {
            a.fillNewDataFormReadonly();
        });

        //update progres table
        var progTableSelectList = document.getElementById("progressTableSelectList");
        progTableSelectList.addEventListener("change", function () {
            a.displayTarget();
        });

        //save new data
        var createNewRecord = document.getElementById("createNewRecord");
        createNewRecord.addEventListener("click", function () {
            storage['data'] = a.createNewRecord(); //return obj
            //console.log(storage.data);
            localStorage.setItem('fitLogApp', JSON.stringify(storage));
            document.location.reload();
        });

        //save target
        var saveTarget = document.getElementById("saveTarget");
        saveTarget.addEventListener("click", function () {
            storage['target'] = a.createTarget(); //return obj
            //console.log(storage);
            localStorage.setItem('fitLogApp', JSON.stringify(storage));
            document.location.reload();
        });



        u = new appUser(user);

        //save new user data
        var saveUser = document.getElementById("saveUser");
        saveUser.addEventListener("click", function () {
            user = u.editUser();
            //console.log(storage);
            localStorage.setItem('fitLogApp', JSON.stringify(storage));
            document.location.reload();
        });


    } else {
        console.log("An error has accure, can't load objects");
        console.log(storage);
    }




}

/* * MAIN JSON OBJECTS */
//clean data for obj
function cleanData(val, fix) {

    var cleanVal = parseFloat(Number(val).toFixed(fix));
    if (cleanVal == NaN || cleanVal == 0 || cleanVal < 0) {
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
    this.profile = new userObj('Me', '', '', ''),
        this.target = new dataObj('', '', '', '', '', '', '', '', '', '', '', '', '', '')
    this.data = []
};

/* * MAIN FUNCTIONS */
function appData(dt, tar, ur) {

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

    var birth = this.user.birth;
    var gender = this.user.gender;
    var height = this.user.height;
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
        this.data.unshift(newData);

        //sort objects by date
        //this.data.sort((b, a) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime());
        //return data object
        return this.data;

    }

    //fill up form based on last record
    this.fillNewDataForm = function () {

        var obj = this.data[0];

        if (obj) { //if there is records
            var today = todaysDate();

            formDate.value = today;
            formWeight.value = obj.weightKgs;
            formWaist.value = obj.waistCm;
            formHaunch.value = obj.haunchCm - 0.5;
            formArms.value = obj.armsCm;
            formChest.value = obj.chestCm;
            formHips.value = obj.hipsCm;

            //others are calculate dinamicaly
        }

    }

    //fill new record readonly prop
    this.fillNewDataFormReadonly = function () {
        //set all data to empty string
        formFatsPercent.value = "";
        formFatKgs.value = "";
        formBodyMass.value = "";
        formBMAKcal.value = "";
        formValidationMsg.innerHTML = ""
        //TO DO DA SE DOBAVI V TOP NA FUNC
        //            IF INVALID DATA
        //              gender
        //              height
        //              formHaunch
        //              formWaist
        //             formWeight
        // Please fix some of the fallowing issues to enable calculations.


        //            formFatsPercent.placeholder = "invalid data";

        var weight = cleanData(formWeight.value, 2);
        var haunch = cleanData(formHaunch.value, 2);
        var waist = cleanData(formWaist.value, 2);



        //var bla = formWeight.value;



        //SET ALL VALUES TO ""

        if (formChekbox.checked == true) { //unlock fields

            formFatsPercent.readOnly = false;
            formFatKgs.readOnly = false;
            formBodyMass.readOnly = false;
            formBMAKcal.readOnly = false;
            bgColor = "rgba(0, 0, 0, 0.65)";
            formFatsPercent.style.backgroundColor = bgColor;
            formFatKgs.style.backgroundColor = bgColor;
            formBodyMass.style.backgroundColor = bgColor;
            formBMAKcal.style.backgroundColor = bgColor;

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
            if ((gender == "Male" || gender == "Female") &&
                (birth.length == 10) &&
                weight != "" && haunch != "" && waist != ""
            ) {
                //do calcs
                //console.log("true");
                //update fields

                var fatPr = calcFatsPercent(
                    gender,
                    height,
                    haunch,
                    waist);
                formFatsPercent.value = fatPr;

                var fatKgs = calcFatKgs(fatPr, weight);
                formFatKgs.value = fatKgs;

                var bodyMassKgs = calcBodyMassKgs(fatKgs, weight)
                formBodyMass.value = bodyMassKgs;

                var bmaKcal = calcBMAKcal(
                    gender,
                    birth,
                    formBMRFormula.value,
                    formActivity.value,
                    weight,
                    height,
                    bodyMassKgs);
                formBMAKcal.value = bmaKcal;

            } else {
                //give user feedback
                //console.log("false");
                var feedbackMsg = "<div class=\"form-group text-danger\">";
                feedbackMsg += "<label for=\"example-text-input\" class=\"control-label col-xs-4\"></label>";
                feedbackMsg += "<div class=\"col-xs-8\">";
                feedbackMsg += "<p><b>Please fix some of the following issues to enable calculations.</b></p>"
                feedbackMsg += "<ul class=\"list-group\">";
                feedbackMsg += "<li><b>Gender</b></li>";
                feedbackMsg += "<li><b>Data of Birth</b></li>";
                feedbackMsg += "<li><b>Weight, kg</b></li>";
                feedbackMsg += "<li><b>Waist, cm</b></li>";
                feedbackMsg += "<li><b>Haunch, cm</b></li>";
                feedbackMsg += "</ul></div></div>";
                formValidationMsg.innerHTML = feedbackMsg;
            }


        }

        //debug
        //console.log("formFatsPercent " + formFatsPercent.value);
        //console.log("formFatKgs " + formFatKgs.value);
        //console.log("formBodyMass " + formBodyMass.value);
        //console.log("formBMAKcal " + formBMAKcal.value);
    }

    //generate table with data
    this.displayTableData = function () {
        var table = "";
        for (i = 0; i < this.data.length; i++) {
            table += "<tr class=\"item\">";
            table += "<td>" + (this.data.length - i) + "</td>";
            //for (var prop in data[i]) {
            //    table += "<td>" + data[i][prop] + "</td>";
            //}
            table += "<td nowrap>" + this.data[i]["measurementDate"] + "</td>";
            table += "<td nowrap>" + this.data[i]["weightKgs"] + "</td>";
            table += "<td nowrap>" + this.data[i]["waistCm"] + "</td>";
            table += "<td nowrap>" + this.data[i]["haunchCm"] + "</td>";
            table += "<td nowrap>" + this.data[i]["armsCm"] + "</td>";
            table += "<td nowrap>" + this.data[i]["chestCm"] + "</td>";
            table += "<td nowrap>" + this.data[i]["hipsCm"] + "</td>";
            table += "<td nowrap>" + this.data[i]["fatsPercent"] + "</td>";
            table += "<td nowrap>" + this.data[i]["fatKgs"] + "</td>";
            table += "<td nowrap>" + this.data[i]["bodyMassKgs"] + "</td>";
            table += "<td wrap>" + this.data[i]["bmrFormula"] + "</td>";
            table += "<td nowrap>" + this.data[i]["physicalActivity"] + "</td>";
            table += "<td nowrap>" + this.data[i]["bmaKcal"] + "</td>";
            table += "<td wrap>" + this.data[i]["comment"] + "</td>";

            table += "<td>";
            table += "<button value=\"" + i + "\" class=\"btn btn-danger btn-xs\">";
            table += "<span class=\"glyphicon glyphicon-remove\">";
            table += "</span></button>";
            table += "</td>";
            table += "</tr>";
        }
        dataTable.innerHTML = table;
    }

    //delete record from data array, return array
    this.deleteRecord = function (i) {
        //if (confirm("Are you sure?")) {
        this.data.splice(i, 1);
        return this.data;
        // }
    }

    //display user target
    this.displayTarget = function () {

        var progress = this.data[0];

        var tableRows = [];
        var tableCells = [];

        //construct multidimensioanl array
        for (var prop in this.target) {
            if (this.target[prop] != '') {
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
        var table = "";
        for (var i = 0; i < tableRows.length; i++) {
            //console.log(tableRows[i]);
            table += "<tr>";
            table += "<td nowrap class=\"text-right\"><b>" + tableRows[i][0] + "</b></td>";
            table += "<td nowrap class=\"text-left\">" + tableRows[i][1] + "</td>";
            table += "<td nowrap class=\"text-left\">" + tableRows[i][2] + "</td>";

            switch (compareList.value) {
                case "b10d":
                    table += "<td nowrap class=\"text-left\">" + "10" + "</td>";
                    break;
                case "b30d":
                    table += "<td nowrap class=\"text-left\">" + "30" + "</td>";
                    break;
                case "f1r":
                    table += "<td nowrap class=\"text-left\">" + "f1r" + "</td>";
                    break;
                default:
                    table += "<td nowrap class=\"text-left\">" + "NaN" + "</td>";
            }
            table += "</tr>";
        }
        progressTable.innerHTML = table;
    }

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
        )

        return obj;

        //this.target = obj;
        //return this.target;
    }

    //draw Simplified chart
    this.drawMainChart = function () {

        //chart global config
        Chart.defaults.global.defaultFontColor = '#fff';

        //datasets
        var xFatsPercentData = constructArray(this.data, "fatsPercent");
        var xFatsPercent = {
            type: "line",
            yAxisID: "y-axis-2",
            label: "FatsPercent",
            data: xFatsPercentData,
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
            //borderWidth: 2,
            //pointRadius: 1,
            //pointHoverRadius: 5,
            fill: false
        };
        var xWeightKgsData = constructArray(this.data, "weightKgs");
        var xWeightKgs = {
            type: "bar",
            yAxisID: "y-axis-1",
            label: "kgs",
            data: xWeightKgsData,
            //borderSkipped: "top",
            //borderWidth: 10,
            borderColor: window.chartColors.indigo,
            backgroundColor: window.chartColors.indigo
        };

        var chartDataLabels = constructChartLabels(this.data, 'measurementDate');
        var chartData = {
            labels: chartDataLabels,
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
                        barPercentage: 1,
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

        var ctx = document.getElementById("mainChart").getContext("2d");

        if (this.mainChart != null || this.mainChart != undefined) {
            this.mainChart.destroy();
            // console.log("chart destroyed");
        }

        this.mainChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions
        }); //ctx end  

    }


}

function appUser(userObj) {

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
        document.getElementById("userName").innerHTML = this.user.name;
        document.getElementById("userBirth").innerHTML = this.user.birth;
        document.getElementById("userGender").innerHTML = this.user.gender;
        document.getElementById("userHeight").innerHTML = this.user.height;
    }
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
    }
    //return modifyed user
    this.editUser = function () {
        this.user.name = editName.value;
        this.user.birth = editBirth.value;
        this.user.gender = editGender.value;
        this.user.height = editHeight.value;
        return this.user;
    }
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
}
//calc fat kgs
function calcFatKgs(fatsPercent, weight) {
    //([@[Fats, %]]/100)*[@[Weight, kgs]]
    var fatKgs;
    fatKgs = (fatsPercent / 100) * weight
    //  return fatKgs.toFixed(2);
    return cleanData(fatKgs, 2);
}
//calc body mass kgs
function calcBodyMassKgs(fatKgs, weight) {
    //=[@[Weight, kgs]]-[@[Fat, kgs]]
    var bodyMassKgs;
    bodyMassKgs = (weight - fatKgs);
    // return bodyMassKgs.toFixed(2);
    return cleanData(bodyMassKgs, 2);

}
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

    var pages = document.querySelectorAll(".page"); // get all pages
    var hash = location.hash.substring(1); //get hash
    var showPage = document.getElementById(hash); //get page to show

    //be sure all are not displayed
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }

    if (showPage) {
        showPage.style.display = "block";

    } else {
        document.getElementById("log").style.display = "block";
    }
    return false; // cancel the click
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
        if (arrWithObjs[i][objKey] == '') {
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
        if (arrWithObjs[i][objKey] == '') {
            myArray.unshift(NaN);
        } else {
            myArray.unshift(arrWithObjs[i][objKey]);
        }
    }
    return myArray;
}
//FORM plus and minus buttons
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
    object.profile = new userObj("AY", "1991-01-01", "Male", 171);
    //target
    object.target = new dataObj('', 68, 81, '', '40', '105', '', 12, '', '', '', '', '', '');

    //data array
    var arr = [];
    arr.unshift(new dataObj('2015-07-27', 75.5, 87, 99, 35.0, 104, 51.0, 22.64, 17.1, 58.4, 'H-Ben rev', 1.725, 2955, 'comment1'));
    arr.unshift(new dataObj('2015-08-12', 74.5, 87, 99, 35.5, 107, 50.0, 22.64, 16.9, 57.6, 'H-Ben rev', 1.725, 2932, 'comment2'));
    arr.unshift(new dataObj('2015-08-17', 73.5, 84, 96, 35.0, 106, 52.0, 20.12, 14.8, 58.7, 'H-Ben rev', 1.725, 2910, 'comment3'));
    arr.unshift(new dataObj('2015-09-01', 73.0, 84, 96, 34.0, 102, 51.0, 20.12, 14.7, 58.3, 'H-Ben rev', 1.725, 2899, 'comment4'));
    arr.unshift(new dataObj('2015-09-08', 71.5, 84, 95, 35.0, 104, 52.0, 19.57, 14.0, 57.5, 'H-Ben rev', 1.725, 2866, 'comment5'));
    arr.unshift(new dataObj('2015-09-19', 70.6, 83, 94, 35.0, 104, 52.0, 18.73, 13.2, 57.4, 'H-Ben rev', 1.725, 2846, 'comme6nt'));
    arr.unshift(new dataObj('2015-10-04', 68.0, 81, 94, 34.0, 104, 50.0, 18.15, 12.5, 56.5, 'H-Ben rev', 1.725, 2810, 'commen7t'));
    arr.unshift(new dataObj('2016-01-02', 71.0, 84, 96, 33.0, 100, 52.0, 20.12, 14.3, 56.7, 'H-Ben rev', 1.725, 2845, 'comment8'));
    arr.unshift(new dataObj('2016-01-16', 73.0, 84, 96, 34.0, 103, 52.0, 20.12, 14.7, 58.3, 'H-Ben rev', 1.725, 2890, 'comment'));
    arr.unshift(new dataObj('2016-01-21', 72.0, 84, 96, 34.5, 103, 52.0, 20.12, 14.5, 57.5, 'H-Ben rev', 1.725, 2868, 'comment'));
    arr.unshift(new dataObj('2016-01-29', 72.0, 84, 97, 35.0, 103, 52.0, '', 14.9, 57.1, 'H-Ben rev', 1.725, 2868, 'cormment'));
    arr.unshift(new dataObj('2016-02-06', 72.5, 83, 97, 35.0, 102, 53.0, 20.38, 14.8, 57.7, 'H-Ben rev', 1.725, 2879, 'commdent'));
    arr.unshift(new dataObj('2016-02-13', 73.0, 83, 97, 35.5, 103, 53.0, 20.38, 14.9, 58.1, 'H-Ben rev', 1.725, 2890, 'comdment'));
    arr.unshift(new dataObj('2016-02-22', 73.0, 82, 97, 36.0, 104, 52.0, 20.09, 14.7, 58.3, 'H-Ben rev', 1.725, 2890, 'comment'));
    arr.unshift(new dataObj('2016-02-26', 73.0, 83, 96, 36.0, 105, 53.0, 19.83, 14.5, 58.5, 'H-Ben rev', 1.725, 2890, 'commedsnt'));
    arr.unshift(new dataObj('2016-03-13', 73.5, 82, 96, 35.0, 105, 52.0, 19.54, 14.4, 59.1, 'H-Ben rev', 1.725, 2901, 'comments'));
    arr.unshift(new dataObj('2016-03-19', 73.6, 85, 95, 34.0, 104, 52.0, 19.86, 14.6, 59.0, 'H-Ben rev', 1.725, 2903, 'comments'));
    arr.unshift(new dataObj('2016-04-02', 74.0, 85, 96, 36.0, 105, 52.0, 20.41, 15.1, 58.9, 'H-Ben rev', 1.725, 2912, 'commentr'));
    arr.unshift(new dataObj('2016-04-08', 75.0, 84, 96, 35.0, 105, 52.0, 20.12, 15.1, 59.9, 'H-Ben rev', 1.725, 2934, 'comment5'));
    arr.unshift(new dataObj('2016-04-16', 75.0, 85, 97, 35.5, 105, 51.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.725, 2934, 'comment3'));
    arr.unshift(new dataObj('2016-04-23', 75.0, 85, 97, 36.0, 105, 51.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.600, 2722, 'comment5'));
    arr.unshift(new dataObj('2016-05-06', 75.5, 86, 98, 36.0, 105, 52.0, 21.80, 16.5, 59.0, 'H-Ben rev', 1.600, 2732, 'comment4'));
    arr.unshift(new dataObj('2016-05-13', 74.0, 86, 97, 36.0, 103, 52.0, 21.25, 15.7, 58.3, 'H-Ben rev', 1.600, 2701, 'comment6'));
    arr.unshift(new dataObj('2016-05-22', 75.0, 85, 97, 36.5, 103, 52.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.600, 2722, 'comment5'));
    arr.unshift(new dataObj('2016-06-14', 75.0, 85, 96, 36.0, 105, 52.0, 20.41, 15.3, 59.7, 'H-Ben rev', 1.600, 2722, 'comment3'));
    arr.unshift(new dataObj('2016-06-26', 75.0, 86, 98, 35.0, 104, 53.0, 21.80, 16.4, 58.7, 'H-Benedict', 1.600, 2741, 'comment6'));
    arr.unshift(new dataObj('2016-07-19', 75.0, 88, 97, 35.5, 104, 53.0, 21.83, 16.4, 58.6, 'H-Benedict', 1.600, 2741, 'comment7'));
    arr.unshift(new dataObj('2016-08-04', 75.0, 88, 97, 36.0, 101, 54.0, 21.83, 16.4, 58.6, 'H-Benedict', 1.600, 2741, 'comment9'));
    arr.unshift(new dataObj('2016-10-09', 78.0, 95, 99, 34.0, 104, 53.0, 24.96, 19.5, 58.5, 'H-Benedict', 1.600, 2804, 'comment0'));
    arr.unshift(new dataObj('2017-03-27', 75.5, 87, 99, 35.0, 104, 51.0, 22.64, 17.1, 58.4, 'H-Ben rev', 1.725, 2955, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'));

    //ADD DATA TO THE OBJECT
    object.data = arr;

    return this.object;
}
