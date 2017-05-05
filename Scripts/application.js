/*
 * application core scripts
 *
 */


/* * init */
var mainObject;
initStorage();
var userInfo = mainObject.UserInfo;
var userTarget = mainObject.UserTarget;
var data = mainObject.Data;
var dataFields = mainObject.DataFields;
var ls = "bp";

/* * MAIN JSON OBJECTS */
//Construct Data Object
function DataObj(dt, weig, wais, hau, ar, che, hip, fpr, fkg, bmass, form, activ, kcal, com) {
    this.MeasurementDate = dt;
    this.WeightKgs = weig;
    this.WaistCm = wais;
    this.HaunchCm = hau;
    this.ArmsCm = ar;
    this.ChestCm = che;
    this.HipsCm = hip;
    this.FatsPercent = fpr;
    this.FatKgs = fkg;
    this.BodyMassKgs = bmass;
    this.BmrFormula = form;
    this.PhysicalActivity = activ;
    this.BmaKcal = kcal;
    this.comment = com;
}
//User object
function userObj(na, bi, ge, he) {
    this.name = na;
    this.birthDay = bi;
    this.gender = ge;
    this.height = he;
}
//main object JSON data
function mainJSON() {
    this.UserInfo = new userObj('My Name is..', '1991-01-01', 'Male', '177'),
        this.UserTarget = new DataObj('', '', '', '', '', '', '', '', '', '', '', '', '', ''), //user target
        this.DataFields = new DataObj(
            'Measurement Date',
            'Weight, kg',
            'Waist, cm',
            'Haunch, cm',
            'Arms, cm',
            'Chest, cm',
            'Hips, cm',
            'Fats %',
            'Fat, kg',
            'Body Mass, kg',
            'Calc Formula',
            'Physical Activity',
            'Kcal',
            'comment'
        ),
        this.Data = [] //array with DataObj objects
    //"UserInfo": '', //object
    //"UserTarget": '', //user target
    //"DataFields": '',
    //"Data": [], //array with DataObj objects
};


/* * UTILITIES */
//init storage
function initStorage() {
    //if there is no set localStorage
    if (localStorage.bp == undefined) {
        //for now fake data
        //empty init object
        localStorage.setItem('bp', JSON.stringify(new mainJSON()));
        document.location.reload();
    } else {
        mainObject = JSON.parse(localStorage.bp); //get localstorage data
    }

}
//save changes
function saveData() {
    localStorage.setItem(ls, JSON.stringify(mainObject));
    document.location.reload();
}
//clear local storage
function clearLocalStorage() {
    localStorage.removeItem(ls);
}
//Insert Fake data to LS
function injectFakeData() {
    localStorage.setItem(ls, JSON.stringify(mainObjectFake));
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
//FORM plus and minus buttons
$('.btn-number').click(function(e){
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {

            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
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

/* * USER functions */
//display current user information
function userDisplay() {
    document.getElementById("userName").innerHTML = userInfo.name;
    document.getElementById("userBirth").innerHTML = userInfo.birthDay;
    document.getElementById("userGender").innerHTML = userInfo.gender;
    document.getElementById("userHeight").innerHTML = userInfo.height;
    return true;
}
//fill up edit user form based on last data
function userFormFill() {
    document.getElementById("editUserName").value = userInfo.name;
    document.getElementById("editUserBirth").value = userInfo.birthDay;
    document.getElementById("editUserGender").value = userInfo.gender;
    document.getElementById("editUserHeight").value = userInfo.height;
    return true;
}
//get form data and call save function
function userEdit() {
    userInfo.name = document.getElementById("editUserName").value;
    userInfo.birthDay = document.getElementById("editUserBirth").value;
    userInfo.gender = document.getElementById("editUserGender").value;
    userInfo.height = document.getElementById("editUserHeight").value;
    saveData();
    return true;
}


/* * MAIN TABLE */
//generate main table
function displayTableData() {
    var table = "";
    for (i = 0; i < data.length; i++) {
        table += "<tr class=\"item\">";
        table += "<td>" + (data.length - i) + "</td>";

        //for (var prop in data[i]) {
        //    table += "<td>" + data[i][prop] + "</td>";
        //}

        table += "<td nowrap>" + data[i]["MeasurementDate"] + "</td>";
        table += "<td nowrap>" + data[i]["WeightKgs"] + "</td>";
        table += "<td nowrap>" + data[i]["WaistCm"] + "</td>";
        table += "<td nowrap>" + data[i]["HaunchCm"] + "</td>";
        table += "<td nowrap>" + data[i]["ArmsCm"] + "</td>";
        table += "<td nowrap>" + data[i]["ChestCm"] + "</td>";
        table += "<td nowrap>" + data[i]["HipsCm"] + "</td>";
        table += "<td nowrap>" + data[i]["FatsPercent"] + "</td>";
        table += "<td nowrap>" + data[i]["FatKgs"] + "</td>";
        table += "<td nowrap>" + data[i]["BodyMassKgs"] + "</td>";
        table += "<td wrap>" + data[i]["BmrFormula"] + "</td>";
        table += "<td nowrap>" + data[i]["PhysicalActivity"] + "</td>";
        table += "<td nowrap>" + data[i]["BmaKcal"] + "</td>";
        table += "<td wrap>" + data[i]["comment"] + "</td>";


        table += "<td>";
        table += "<button onclick=\"deleteTableData(" + i + ")\" class=\"btn btn-danger btn-xs\">";
        table += "<span class=\"glyphicon glyphicon-remove\">";
        table += "</span></button>";
        table += "</td>";
        table += "</tr>";
    }
    document.getElementById("DataTable").innerHTML = table;
}
//Delete data object from the array based on index
function deleteTableData(i) {
    if (confirm("Are you sure?")) {
        data.splice(i, 1);
        saveData();
    }
}
//add data object to db
function createDataRecord() {
    //get input date
    var dt = document.getElementById("newDataMeasurementDate").value;
    var weig = document.getElementById("newDataWeightKgs").value;
    var wais = document.getElementById("newDataWaistCm").value;
    var hau = document.getElementById("newDataHaunchCm").value;
    var ar = document.getElementById("newDataArmsCm").value;
    var che = document.getElementById("newDataChestCm").value;
    var hip = document.getElementById("newDataHipsCm").value;
    var fpr = document.getElementById("newDataFatsPercent").value;
    var fkg = document.getElementById("newDataFatKgs").value;
    var bmass = document.getElementById("newDataBodyMassKgs").value;
    //var form = document.getElementById("newDataBMRFormula").value;
    var formPre = document.getElementById("newDataBMRFormula");
    var form = formPre.options[formPre.selectedIndex].text;
    var activ = document.getElementById("newDataPhysicalActivity").value;
    //var activPre = document.getElementById("newDataPhysicalActivity");
    //var activ = activPre.options[activPre.selectedIndex].text;
    var kcal = document.getElementById("newDataBMAKcal").value;
    var com = document.getElementById("newDatacomment").value;

    //construct object
    newData = new DataObj(dt, weig, wais, hau, ar, che, hip, fpr, fkg, bmass, form, activ, kcal, com);
    //add to json obj
    data.unshift(newData);
    saveData();
}
//fill form data for the new record
function fillNewRecordForm() {
    //GET LAST RECORD AND FILL UP FORM DATA
    var obj = data[0];
    var today = todaysDate();

    if (obj) {

        document.getElementById("newDataMeasurementDate").value = today;
        document.getElementById("newDataWeightKgs").value = obj.WeightKgs;
        document.getElementById("newDataWaistCm").value = obj.WaistCm;
        document.getElementById("newDataHaunchCm").value = obj.HaunchCm - 0.5;
        document.getElementById("newDataArmsCm").value = obj.ArmsCm;
        document.getElementById("newDataChestCm").value = obj.ChestCm;
        document.getElementById("newDataHipsCm").value = obj.HipsCm;
        //below ones are calculate dinamicaly
        //document.getElementById("newDataFatsPercent").value = obj.FatsPercent;
        //document.getElementById("newDataFatKgs").value = obj.FatKgs;
        //document.getElementById("newDataBodyMassKgs").value = obj.BodyMassKgs;
        //document.getElementById("newDataBMRFormula").value = obj.BmrFormula;
        //document.getElementById("newDataPhysicalActivity").value = obj.PhysicalActivity;
        //document.getElementById("newDataBMAKcal").value = obj.BmdaKcal;
        //document.getElementById("newDatacomment").value = obj.comment;
    }
    //console.log(obj);
}
//Fill new data readonly fields
function fillNewRecordFormReadonlyProp() {

    //CONSTANTS from JSON obj
    var gender = userInfo.gender;
    var height = userInfo.height;
    var birth = userInfo.birthDay;
    var height = userInfo.height;
    //GET FORM INPUTS
    var haunch = document.getElementById('newDataHaunchCm').value;
    var waist = document.getElementById('newDataWaistCm').value;
    var weight = document.getElementById('newDataWeightKgs').value;
    var activity = document.getElementById('newDataPhysicalActivity').value;

    var chekboxCustomData = document.getElementById('newDataCustomCheck').checked;
    var a = document.getElementById('newDataFatsPercent');
    var b = document.getElementById("newDataFatKgs");
    var c = document.getElementById('newDataBodyMassKgs');
    var d = document.getElementById('newDataBMAKcal');
    var bgColor;
    //console.log(chekboxCustomData);
    if (chekboxCustomData == true) {

        a.readOnly = false;
        b.readOnly = false;
        c.readOnly = false;
        d.readOnly = false;

        bgColor = "rgba(0, 0, 0, 0.65)";
        a.style.backgroundColor = bgColor;
        b.style.backgroundColor = bgColor;
        c.style.backgroundColor = bgColor;
        d.style.backgroundColor = bgColor;

    } else {
        a.readOnly = true;
        b.readOnly = true;
        c.readOnly = true;
        d.readOnly = true;

        bgColor = "rgba(3,3,3,0.25)";
        a.style.backgroundColor = bgColor;
        b.style.backgroundColor = bgColor;
        c.style.backgroundColor = bgColor;
        d.style.backgroundColor = bgColor;


        //update fields
        var fatsPercent = calcFatsPercent(gender, height, haunch, waist);
        a.value = fatsPercent;

        var fatKgs = calcFatKgs(fatsPercent, weight);
        b.value = fatKgs;

        var bodyMassKgs = calcBodyMassKgs(fatKgs, weight)
        c.value = bodyMassKgs;

        var formula = document.getElementById('newDataBMRFormula').value;
        var bmaKcal = calcBMAKcal(gender, birth, formula, activity, weight, height, bodyMassKgs);
        d.value = bmaKcal;
    }
}

/* * Targets */
//display user progress and user target
function targetDisplay() {

    var target = userTarget;
    var progress = data[0];
    var fields = dataFields;

    var tableRows = [];
    var tableCells = [];

    //construct multidimensioanl array
    for (var prop in target) {
        if (target[prop] != '') {
            //console.log(fields[prop] + " - " + progress[prop] + " - " + target[prop]);
            tableCells = [fields[prop], progress[prop], target[prop]];
            tableRows.push(tableCells);
        }
    }

    /*
  arr = [
          ['field name', 'target', 'last record'],
          ['field name', 'target', 'last record'],
          ['field name', 'target', 'last record'],
        ]
  */
    var selectFromList = document.getElementById("progressTableSelectList").value;
    //b10d
    //b30d
    //f1r
    //loop to display the data
    var table = "";
    for (var i = 0; i < tableRows.length; i++) {
        //console.log(tableRows[i]);
        table += "<tr>";
        table += "<td nowrap class=\"text-right\"><b>" + tableRows[i][0] + "</b></td>";
        table += "<td nowrap class=\"text-left\">" + tableRows[i][1] + "</td>";
        table += "<td nowrap class=\"text-left\">" + tableRows[i][2] + "</td>";


        switch (selectFromList) {
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
        //if (selectFromList == ""){
        //table += "<td nowrap class=\"text-left\">" + "10" + "</td>";
        //}
        //else if (){}
        //else if (){}

        table += "</tr>";
    }
    document.getElementById("progressTable").innerHTML = table;
    //console.log(selectFromList);
}
//create user target
function targetCreate() {
    //prefix all to empty
    userTarget.MeasurementDate = '';
    userTarget.WeightKgs = '';
    userTarget.WaistCm = '';
    userTarget.HaunchCm = '';
    userTarget.ArmsCm = '';
    userTarget.ChestCm = '';
    userTarget.HipsCm = '';
    userTarget.FatsPercent = '';
    userTarget.FatKgs = '';
    userTarget.BodyMassKgs = '';
    userTarget.BmrFormula = '';
    userTarget.PhysicalActivity = '';
    userTarget.BmdaKcal = '';
    userTarget.comment = '';

    userTarget.WeightKgs = document.getElementById("targetDataWeightKgs").value;
    userTarget.WaistCm = document.getElementById("targetDataWaistCm").value;
    userTarget.HaunchCm = document.getElementById("targetDataHaunchCm").value;
    userTarget.ArmsCm = document.getElementById("targetDataArmsCm").value;
    userTarget.ChestCm = document.getElementById("targetDataChestCm").value;
    userTarget.HipsCm = document.getElementById("targetDataHipsCm").value;
    userTarget.FatsPercent = document.getElementById("targetDataFatsPercent").value;
    userTarget.FatKgs = document.getElementById("targetDataFatKgs").value;
    userTarget.BodyMassKgs = document.getElementById("targetDataBodyMassKgs").value;

    saveData();
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

    validNumber = Number(fatsPercent);

    if (!isNaN(validNumber) && validNumber > 3) {
        return validNumber;
    } else {
        return "NaN";
    }
}
//calc fat kgs
function calcFatKgs(fatsPercent, weight) {
    //([@[Fats, %]]/100)*[@[Weight, kgs]]
    var fatKgs;
    fatKgs = (fatsPercent / 100) * weight
    return fatKgs.toFixed(2);
}
//calc body mass kgs
function calcBodyMassKgs(fatKgs, weight) {
    //=[@[Weight, kgs]]-[@[Fat, kgs]]
    var bodyMassKgs;
    bodyMassKgs = (weight - fatKgs);
    return bodyMassKgs.toFixed(2);
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
    return bma.toFixed();
}


/* * CHARTS and chart utilities */
//chart data. Construct array from obj props, for chart data
function constructArray(arrWithObjs, objKey) {
    myArray = [];
    for (i = 0; i < arrWithObjs.length; i++) {
        if (arrWithObjs[i][objKey] == '') {
            myArray.unshift('NaN');
        } else {
            myArray.unshift(arrWithObjs[i][objKey]);
        }
    }
    return myArray;
}
//main chart
function drawMainChart() {
    //chart data
    Chart.defaults.global.defaultFontColor = '#fff';
    var chartData = {
        labels: constructArray(data, 'MeasurementDate'),
        datasets: [
            {
                type: 'line',
                yAxisID: "y-axis-2",
                label: 'FatsPercent',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                pointRadius: 1,
                pointHoverRadius: 5,
                //borderDash: [5, 5],
                data: constructArray(data, 'FatsPercent')
            },
            {
                type: 'bar',
                yAxisID: "y-axis-1",
                label: 'kgs',
                backgroundColor: window.chartColors.indigo,
                data: constructArray(data, 'WeightKgs'),
                borderColor: window.chartColors.indigo,
                //borderWidth: 2
            },
        ]
    };
    //draw chart
    var ctx = document.getElementById("mainChart").getContext("2d");
    window.myMixedChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        responsive: true,
        scaleFontColor: "#ff0000",
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Chart.js Combo Bar Line Chart'
            },
            legend: {
                display: true,
                labels: {
                    //fontColor: 'rgb(255, 99, 132)',
                    usePointStyle: false,
                    //fontColor:"white", 
                    //fontSize: 18
                }
            },
            scales: {
                xAxes: [
                    {
                        barPercentage: 1.0,
                        categoryPercentage: 1.0,
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                        gridLines: {
                            display: false
                        },
                    },
                    {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "right",
                        id: "y-axis-2",
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    },
                ],
            },
            tooltips: {
                mode: 'index',
                intersect: true
            }
        }
    }); //ctx end
} //function end
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
