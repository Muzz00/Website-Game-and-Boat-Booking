
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "boat.xml", false);
xmlhttp.send();
var xmlDoc = xmlhttp.responseXML; 


var boats = xmlDoc.getElementsByTagName("BOAT");

// Table for the Boat Buttons
var table="<tr>";
for (i = 0; i <boats.length; i++) { 
    var boat = boats[i];
    var boatCode = boat.getElementsByTagName("CODE")[0].childNodes[0].nodeValue;
    var boatBtnID = "btn-"+boatCode;
    var boatName = boat.getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
    var boatMeaning = boat.getElementsByTagName("MEANING")[0].childNodes[0].nodeValue;
    
    // if you hover over a boat name it will translate it to english 
    table += "<button id='"+boatBtnID+"' class='boats-btn' "
            +"onclick='displayBoat(\""+ boatCode+ "\")' "
            +"onmouseover='displayButtonText(\""+ boatBtnID + "\",\""+ boatMeaning + "\")'"
            +"onmouseout='displayButtonText(\""+ boatBtnID + "\",\""+ boatName + "\")'"
            +"><span>"+boatName+"</span></button>";
}
table += "</tr>";
document.getElementById("boatButtons").innerHTML = table;

// has all info needed for the boats
function displayBoat(boatCode){
    selectedSeats = [];
    selectedPrices = [];
    
    calculateSeatsTotal();
    calculateFoodTotal();
    
    currentBoatCode = boatCode;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "boat.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    var boats = xmlDoc.getElementsByTagName("BOAT");
    var table="";
    
    
//    <div id="layout-instructions">
//                        <label>Available</label>
//                        <img src="images/green-chair.png" alt="Green chair" class="chairs">
//                        <label>Selected</label>
//                        <img src="images/blue-chair.png" alt="Blue chair" class="chairs">
//                        <label>Booked</label>
//                        <img src="images/red-chair.png" alt="Red chair" class="chairs">
//                        <br><br>              
//                        <label id="title-hover-layout">Hover over seat to view information</label>
//                    </div>
//                    
    
    document.getElementById("layout-instructions").style.display = "block";
    
    for (i = 0; i < boats.length; i++) { 
        var boat = boats[i];
        var code = boat.getElementsByTagName("CODE")[0].childNodes[0].nodeValue;
        if (code == boatCode) {
            var boatName = boat.getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
            
            boatName_confirm = boatName;
            document.getElementById("title-hover-layout").innerHTML = "Seat layout for "+boatName;
            
            var rows = boat.getElementsByTagName("ROW");
            
            for (r = 0; r < rows.length; r++ ) {
                var row = rows[r];
                var letter = row.getElementsByTagName("LETTER")[0].childNodes[0].nodeValue;
                var section = row.getElementsByTagName("SECTION")[0].childNodes[0].nodeValue;
                var seats = row.getElementsByTagName("SEAT");
                var numSeats = seats.length;
            
                table += "<tr>";
                
                
                var currentColumn = 1;
                for ( currentSeatIndex = 0; currentSeatIndex < numSeats;  currentSeatIndex++ ){
                    var seat = seats[currentSeatIndex];
                    var seatNumber = parseInt(seat.getElementsByTagName("NUMBER")[0].childNodes[0].nodeValue);
                    
                    while(currentColumn < seatNumber){
                        table += "<td><img src='images/empty-seat-space.png' class='chairs'></td>";
                        currentColumn++;
                    }
                    
                    var date = document.getElementById('datepicker').value;
                    var time = document.getElementById("time").value;
                    var seatID = letter + seatNumber;
                    table += makeseat(seatID, date, section,boatName,time);
                    currentColumn++;
                }
                
                table += "</tr>";        
            }
            
        }
    }
    
    document.getElementById("boat").innerHTML = table;
}

var boatName_confirm = "";

// two arrays to store the already booked seats
var tereBooking = ["B6","C1","C2","C3","D6","D7","D8","E1","E2","G2","G7","G8","G9"];
var nuiBooking = ["D2","D3","D4","D8","E8","F1","F3","F4","F8","G1","G6","G7","G8","G9","H1","J1","J2"];

function displayButtonText(boatCode, newText){
    document.getElementById(boatCode).innerHTML = newText;
}

var today = new Date();
var maxDay = new Date(today);
maxDay.setDate(today.getDate() + 4);

var todayString = getDateFormat(today);
var maxDateString = getDateFormat(maxDay);


document.getElementById('datepicker').setAttribute("value", todayString);
document.getElementById('datepicker').setAttribute("min", todayString);
document.getElementById('datepicker').setAttribute("max", maxDateString);

// retrieved from https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today
// changing date format to more readable and nice format
function getDateFormat(dateObject) {
    var dd = dateObject.getDate();
    var mm = dateObject.getMonth()+1; 
    var yyyy = dateObject.getFullYear();
    if ( dd < 10 ) {
        dd='0'+dd;
    } 
    if( mm < 10 ) { 
        mm='0'+mm;
    }
    return yyyy+'-'+mm+'-'+dd;
}

// retrived from https://stackoverflow.com/questions/1643320/get-month-name-from-date/18648314#18648314
// making date format pretty
function getDatePrettyFormat(dateObject) {
    var dd = dateObject.getDate();
    var month = dateObject.toLocaleString('default', { month: 'long' });
    var yyyy = dateObject.getFullYear();
    return dd + " " + month + " " + yyyy;
   
}

// retrived from: https://flaviocopes.com/how-to-format-number-as-currency-javascript
// getting a nice format for the money like $90.50
var money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

// getting price for the selected seat
function getPrice(searchingName){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "boat.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    
    var sectionList = xmlDoc.getElementsByTagName("SECTIONLIST")[0];
    var sections = sectionList.getElementsByTagName("SECTION");

    for(var i = 0; i < sections.length; i++){
        var section = sections[i];
        var sectionName = section.getElementsByTagName("SECTION_NAME")[0].childNodes[0].nodeValue;
        
        if(sectionName == searchingName){
            var price = parseFloat(section.getElementsByTagName("SECTION_COST")[0].childNodes[0].nodeValue); 
            return price;
        }
    }
    return -1;
    
}

// checking if the seat is booked
function isBooked(seatId, date, boat, time){
    
    if(tereBooking.includes(seatId) && boat == "Tere"){
        return true;
    }
    if(nuiBooking.includes(seatId) && boat == "Nui"){
        return true;
    }
    var key = date + "***" + time + "***" + boat + "***" + seatId;
    
    if(sessionStorage.getItem(key) == "booked"){
        
        return true;
    }
    return false;
    
}


function makeseat(seatId, date, sectionName,boat,time){
    
    var html = "<td class='making-seat'>";
    var price = getPrice(sectionName);
    html += '<div class="click-to-top">';
    
    if(isBooked(seatId,date,boat,time)){
        html += "<img src='images/red-chair.png' class='chairs'>";
        html += "<span>Seat unavailable</span></div>";
        html += "</td>";
    }
    else{
        html += "<img src='images/green-chair.png' class='chairs' onclick='clickSeat(\""+ seatId + "\",\""+ date + "\","+ price + ")' id=\"" +seatId+ "\" >";
        
        html += "<span>";
        
        html += "<p id=\"" +seatId+ "-tooltip-header\">Seat " + seatId +" is available!<\p>";
        html += "Section: "+sectionName + "<br>"
                + "Price: "+money.format(price);
        
        html += "</span></div>";
        
        html += "</td>";
    } 
    return html;
    
}

// calculating the total price of the selected seats
var selectedSeats = [];
var selectedPrices = [];

var seatsTotalCost = 0;

function calculateSeatsTotal() {
    var tableText = "";
    seatsTotalCost = 0;
    for (var i = 0; i <selectedSeats.length; i++) { 
        var seatID = selectedSeats[i];
        var price = selectedPrices[i];
        
        seatsTotalCost += price;
        
        tableText += "<tr>";
        tableText += "<td class='seat-table'>" + seatID + "</td>";
        tableText += "<td>&nbsp;&nbsp;&nbsp;</td>";
        tableText += "<td>&nbsp;&nbsp;&nbsp;</td>";
        tableText += "<td class='seat-table'>" + money.format(price) + "</td>";
        tableText += "</tr>";
    }
    
    tableText += "<tr>";
    tableText += "<td class='seat-table'><b> Seats subtotal:</b> </td>";
    tableText += "<td>&nbsp;&nbsp;&nbsp;</td>";
    tableText += "<td>&nbsp;&nbsp;&nbsp;</td>";
    tableText += "<td class='seat-table' id='seats-cost'><b>" + money.format(seatsTotalCost) + "</b></td>";
    tableText += "</tr>";
    
    document.getElementById("total-cost-seats").innerHTML = tableText;
    document.getElementById("final-total").innerHTML = "Final total: " 
                                + money.format(seatsTotalCost + foodTotalCost);
}

// a function when clicking on the seat
function clickSeat(seatId, date, seatPrice){
    
    // if already selected, remove it
    if (selectedSeats.includes(seatId)) {
         
        // deleting array retrieved from https://love2dev.com/blog/javascript-remove-from-array/
        for (var i = 0; i < selectedSeats.length; i++) {
            var seat = selectedSeats[i];
            if (seat === seatId) {
                selectedSeats.splice(i, 1);
                selectedPrices.splice(i, 1);
                
                document.getElementById(seat).src = "images/green-chair.png";
                
                tooltip = "Seat " + seatId +" is available!";
                document.getElementById(seat+"-tooltip-header").innerHTML = tooltip;
            }
        }
    } else {
        // not already select, so try to select it
        
        var numPeople = parseInt(document.getElementById("number-of-people").value);
        var numSelected = selectedSeats.length;

        if (numSelected < numPeople) {
            selectedSeats.push(seatId);
            selectedPrices.push(seatPrice);
            
            numSelected += 1;  

            var str = "";
            for(var i =0 ; i < selectedSeats.length; i++){
                var seat = selectedSeats[i];

                str += seat + "   ";
                document.getElementById(seat).src = "images/blue-chair-highlight.png";
                
                tooltip = "Seat " + seat +" (currently selected)";
                document.getElementById(seat+"-tooltip-header").innerHTML = tooltip;
                
            }
        } else {
            createAlert("Oops", "If you would like more seats, please increase the number of people.")
        }
    }
    
    calculateSeatsTotal();
}


// retrieved from https://www.youtube.com/watch?v=FWDlZUqtd2Y
function updateweather() {
    weatherURL = 'http://api.openweathermap.org/data/2.5/onecall?lat=-45.030231&lon=168.662704&exclude=hourly&units=metric&appid=23848703b945ab830ef1ec01235def89';
    $.ajax({
        dataType: "json",
        url: weatherURL,
        success: success
    });

}

// used when getting data from weather API
function success(data){
    var dateToCheck = document.getElementById("datepicker").value;
    $.each(data,function(key, value){
        if(key == "daily"){
            $.each(value, function(index, dailyValue){
                var date = new Date(parseInt(dailyValue.dt) * 1000);
                var dateFormat = getDateFormat(date);
                
                if(dateFormat == dateToCheck){
                    var daytemp = parseInt(dailyValue.temp.day);
                    var rain = dailyValue.rain;
                    var iconURL = "http://openweathermap.org/img/wn/"+dailyValue.weather[0].icon+"@2x.png";
                    
                    //updateWeatherDisplay(date, 210, null, iconSunny);
                    updateWeatherDisplay(date, daytemp, rain, iconURL);
                }

            });
        }
    });
}

// overriding the weather if it is too cold or too hot so the functionality will work
var iconRaining = "http://openweathermap.org/img/wn/09d@2x.png";
var iconSunny = "http://openweathermap.org/img/wn/01d@2x.png";             

function overrideWeather() {
    var override = document.getElementById("override-weather").checked;
    if (override == true) {
        document.getElementById("weather-controls").style.display = "block";
        
        var date = new Date(document.getElementById("datepicker").value);
        var coldOn = document.getElementById("make-it-cold").checked;
        var rainOn = document.getElementById("make-it-rain").checked;
        
        var daytemp = 21;
        var rain = null;
        var icon = iconSunny;
        
        if (rainOn == true) {
            rain = "notnull";
            icon = iconRaining;
        }
        
        if (coldOn == true) {
            daytemp = 8;
        }
        
        updateWeatherDisplay(date, daytemp, rain, icon);
        
    } else {
        document.getElementById("weather-controls").style.display = "none";
        updateweather();
    }
}

//displaying the weather condition regarding the requerments >14 and rainy 
function updateWeatherDisplay(date, daytemp, rain, icon) {
    var result = "";
    var dateFormatPretty = getDatePrettyFormat(date); 
    
    result += "<center><table><tr>";
    result += "<td><img class='weatherImg' src='" + icon + "'></td>";
    result += "<td><p class='tempNumber'>"+ Math.round(daytemp) + "&#8451;</p></td>";
    result += "</tr></table>";
    result += "<p>" + dateFormatPretty + "</p>";

    result += "</center>";
    if(daytemp < 14){
        result += "<label style='color:#a83874; font-size: 16px;'>Pick another day because:"
        result += "<ul><li>Temperature is below 14&#8451;</li>"
        if (rain != null) {
            result += "<li>And it is raining</li>";
        }
        result += "</ul></label>"
        
        
        document.getElementById("booking-details").style.display = "none";
        document.getElementById("confirmation-box").style.display = "none";
        document.getElementById("message-when-cold").style.display = "block";

    } else if( rain != null) {
        result += "<label style='color:#a83874; font-size: 16px;'>Pick another day because:"
        result += "<ul><li>It is raining</li>"
        result += "</ul></label>"
        
        document.getElementById("booking-details").style.display = "none";
        document.getElementById("confirmation-box").style.display = "none";
        document.getElementById("message-when-cold").style.display = "block";
        
    } else {
        result += "<center>";
        result += "<label style='color:green; font-size: 19px;'>Great day!</label>"
        result += "</center>";
        
        document.getElementById("booking-details").style.display = "block";
        document.getElementById("confirmation-box").style.display = "block";
        document.getElementById("message-when-cold").style.display = "none";
    }
    result += "<br><br>"
    
    $("#weather").html(result);
}

var currentBoatCode;

//confirm button
function confirm(){
    var numPeople = document.getElementById("number-of-people").value;
    
    if (selectedSeats.length < numPeople) {
        createAlert("Select seats","You have only selected " + selectedSeats.length
                    +" seats for the " + numPeople + " passenger(s). Please select the other seats.");
        return;
    }
    
    var datepretty = new Date(document.getElementById("datepicker").value);
    var date = document.getElementById("datepicker").value;
    var time = document.getElementById("time").value;    
    if(foodString == ""){
        foodString = "  No food selected!";
    }
    
    createAlert("Booking Confirmation", "<b>Your booking is confirmed!</b><br><br><strong>Selected date:</strong> " + getDatePrettyFormat(datepretty) + "<br><strong>Selected time:</strong> " + time + "<br><strong>Number of people:</strong> " + numPeople + "<br><strong>Boat name:</strong> " + boatName_confirm + "<br><strong>Selected seats:</strong> " + selectedSeats  + " <br><strong>Selected menu items:</strong> <br>" + foodString + "<br><strong>Total cost:</strong> " + money.format(seatsTotalCost + foodTotalCost));
    
    for(var i = 0; i < selectedSeats.length; i++){
        var seat = selectedSeats[i];
        var key = date + "***" + time + "***" + boatName_confirm + "***" + seat;
        sessionStorage.setItem(key, "booked");
    }
    
    displayBoat(currentBoatCode);
    
}


// function to make alert box neat and pretty
//retrived from : https://speckyboy.com/css-js-notification-alert-code/
function createAlert(title, txt) {
    d = document;

    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";
    
    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(title));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode("OK"));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert(); return false; }

    alertObj.style.display = "block";
    
}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}

