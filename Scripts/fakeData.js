/*
 * Mock data
 * generates new objects with fake data
 *
 * object		{4}
 *	     UserInfo		{4}
 *	     UserTarget		{14}
 *	     DataFields		{14}
 *	     Data		[32]
 *
 *
*/

//object
var mainObjectFake = new mainJSON();
//user constructr
mainObjectFake.UserInfo = new userObj("AY", "1991-01-01", "Male", 171);
//user target
mainObjectFake.UserTarget = new DataObj('', 68, 81, '', '40', '105', '', 12, '', '', '', '', '', '');
//data fields
mainObjectFake.DataFields = new DataObj(
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
);
//FAKE DATA FOR TABLE
var fakeData = [];
fakeData.unshift(new DataObj('27.07.2015', 75.5, 87, 99, 35.0, 104, 51.0, 22.64, 17.1, 58.4, 'H-Ben rev', 1.725, 2955, 'comment1'));
fakeData.unshift(new DataObj('12.08.2015', 74.5, 87, 99, 35.5, 107, 50.0, 22.64, 16.9, 57.6, 'H-Ben rev', 1.725, 2932, 'comment2'));
fakeData.unshift(new DataObj('17.08.2015', 73.5, 84, 96, 35.0, 106, 52.0, 20.12, 14.8, 58.7, 'H-Ben rev', 1.725, 2910, 'comment3'));
fakeData.unshift(new DataObj('01.09.2015', 73.0, 84, 96, 34.0, 102, 51.0, 20.12, 14.7, 58.3, 'H-Ben rev', 1.725, 2899, 'comment4'));
fakeData.unshift(new DataObj('08.09.2015', 71.5, 84, 95, 35.0, 104, 52.0, 19.57, 14.0, 57.5, 'H-Ben rev', 1.725, 2866, 'comment5'));
fakeData.unshift(new DataObj('19.09.2015', 70.6, 83, 94, 35.0, 104, 52.0, 18.73, 13.2, 57.4, 'H-Ben rev', 1.725, 2846, 'comme6nt'));
fakeData.unshift(new DataObj('04.10.2015', 68.0, 81, 94, 34.0, 104, 50.0, 18.15, 12.5, 56.5, 'H-Ben rev', 1.725, 2810, 'commen7t'));
fakeData.unshift(new DataObj('02.01.2016', 71.0, 84, 96, 33.0, 100, 52.0, 20.12, 14.3, 56.7, 'H-Ben rev', 1.725, 2845, 'comment8'));
fakeData.unshift(new DataObj('16.01.2016', 73.0, 84, 96, 34.0, 103, 52.0, 20.12, 14.7, 58.3, 'H-Ben rev', 1.725, 2890, 'comment'));
fakeData.unshift(new DataObj('21.01.2016', 72.0, 84, 96, 34.5, 103, 52.0, 20.12, 14.5, 57.5, 'H-Ben rev', 1.725, 2868, 'c5omment'));
fakeData.unshift(new DataObj('29.01.2016', 72.0, 84, 97, 35.0, 103, 52.0, '', 14.9, 57.1, 'H-Ben rev', 1.725, 2868, 'cormment'));
fakeData.unshift(new DataObj('06.02.2016', 72.5, 83, 97, 35.0, 102, 53.0, 20.38, 14.8, 57.7, 'H-Ben rev', 1.725, 2879, 'commdent'));
fakeData.unshift(new DataObj('13.02.2016', 73.0, 83, 97, 35.5, 103, 53.0, 20.38, 14.9, 58.1, 'H-Ben rev', 1.725, 2890, 'comdment'));
fakeData.unshift(new DataObj('22.02.2016', 73.0, 82, 97, 36.0, 104, 52.0, 20.09, 14.7, 58.3, 'H-Ben rev', 1.725, 2890, 'comment'));
fakeData.unshift(new DataObj('26.02.2016', 73.0, 83, 96, 36.0, 105, 53.0, 19.83, 14.5, 58.5, 'H-Ben rev', 1.725, 2890, 'commedsnt'));
fakeData.unshift(new DataObj('13.03.2016', 73.5, 82, 96, 35.0, 105, 52.0, 19.54, 14.4, 59.1, 'H-Ben rev', 1.725, 2901, 'comments'));
fakeData.unshift(new DataObj('19.03.2016', 73.6, 85, 95, 34.0, 104, 52.0, 19.86, 14.6, 59.0, 'H-Ben rev', 1.725, 2903, 'comments'));
fakeData.unshift(new DataObj('02.04.2016', 74.0, 85, 96, 36.0, 105, 52.0, 20.41, 15.1, 58.9, 'H-Ben rev', 1.725, 2912, 'commentr'));
fakeData.unshift(new DataObj('08.04.2016', 75.0, 84, 96, 35.0, 105, 52.0, 20.12, 15.1, 59.9, 'H-Ben rev', 1.725, 2934, 'comment5'));
fakeData.unshift(new DataObj('16.04.2016', 75.0, 85, 97, 35.5, 105, 51.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.725, 2934, 'comment3'));
fakeData.unshift(new DataObj('23.04.2016', 75.0, 85, 97, 36.0, 105, 51.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.600, 2722, 'comment5'));
fakeData.unshift(new DataObj('06.05.2016', 75.5, 86, 98, 36.0, 105, 52.0, 21.80, 16.5, 59.0, 'H-Ben rev', 1.600, 2732, 'comment4'));
fakeData.unshift(new DataObj('13.05.2016', 74.0, 86, 97, 36.0, 103, 52.0, 21.25, 15.7, 58.3, 'H-Ben rev', 1.600, 2701, 'comment6'));
fakeData.unshift(new DataObj('22.05.2016', 75.0, 85, 97, 36.5, 103, 52.0, 20.96, 15.7, 59.3, 'H-Ben rev', 1.600, 2722, 'comment5'));
fakeData.unshift(new DataObj('14.06.2016', 75.0, 85, 96, 36.0, 105, 52.0, 20.41, 15.3, 59.7, 'H-Ben rev', 1.600, 2722, 'comment3'));
fakeData.unshift(new DataObj('26.06.2016', 75.0, 86, 98, 35.0, 104, 53.0, 21.80, 16.4, 58.7, 'H-Benedict', 1.600, 2741, 'comment6'));
fakeData.unshift(new DataObj('19.07.2016', 75.0, 88, 97, 35.5, 104, 53.0, 21.83, 16.4, 58.6, 'H-Benedict', 1.600, 2741, 'comment7'));
fakeData.unshift(new DataObj('04.08.2016', 75.0, 88, 97, 36.0, 101, 54.0, 21.83, 16.4, 58.6, 'H-Benedict', 1.600, 2741, 'comment9'));
fakeData.unshift(new DataObj('09.10.2016', 78.0, 95, 99, 34.0, 104, 53.0, 24.96, 19.5, 58.5, 'H-Benedict', 1.600, 2804, 'comment0'));
fakeData.unshift(new DataObj('27.07.2017', 75.5, 87, 99, 35.0, 104, 51.0, 22.64, 17.1, 58.4, 'H-Ben rev', 1.725, 2955, 'very very ig comment that i want to check how it will be displayed in the fucking table comment1'));

//ADD DATA TO THE OBJECT
mainObjectFake.Data = fakeData;
