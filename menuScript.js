var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "menu.xml", false);
xmlhttp.send();
var xmlDoc = xmlhttp.responseXML; 

// retrived from: https://flaviocopes.com/how-to-format-number-as-currency-javascript
var money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

//getting and displaying the infrmation needed for boat menu from xml
var menu = xmlDoc.getElementsByTagName("ITEM");
var table="<tr><th class='th-menu'>Menu item</th><th class='th-menu'>Price</th><th class='th-menu'>Quantity</th></tr>";

for (i = 0; i <menu.length; i++) { 
    var name = menu[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
    var price = menu[i].getElementsByTagName("PRICE")[0].childNodes[0].nodeValue;
    var image = menu[i].getElementsByTagName("IMG")[0].childNodes[0].nodeValue;
    var items = xmlDoc.getElementsByTagName("ITEM");
    var item = items[i];
    var description = item.getElementsByTagName("DESCRIPTION")[0].childNodes[0].nodeValue;
    var type = item.getElementsByTagName("TYPE")[0].childNodes[0].nodeValue;
    
    
    table += "<tr><td class='menu'>";
    table += "<div class='tooltip'>" + name + "<span class='tooltiptext'>" + "Description: "+ description + "<br>" + "Type: " + type + "<br>" + '<img class="menu-img" src="' + image  + '" />' +"</span></div>";
    table += "</td><td>";
    table += money.format(price);
    table += "</td><td>";
    table +='<input class="q-item all-inputs" type="number" id="quantity-'+i+'"min="0" value="0" onclick="calculateFoodTotal()"  onkeydown="return false"/>';
    table += "</td></tr>";

}

document.getElementById("menu").innerHTML = table;

// calculating the food total cost and displaying to the list on the right hand side
var foodTotalCost = 0;
var foodString = "";
function calculateFoodTotal(){
    var tableText = "";
    foodString = "";
    foodTotalCost = 0;
    for (var i = 0; i <menu.length; i++) { 
        var name = menu[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
        var price = parseFloat(menu[i].getElementsByTagName("PRICE")[0].childNodes[0].nodeValue);
        var quantity = parseFloat(document.getElementById('quantity-' + i).value);
        if(quantity > 0){
            foodTotalCost += price * quantity;
            tableText += "<tr>";
            tableText += "<td class='food-table' id='item-name'>" + name + "</td>";
            tableText += "<td class='food-table'>" + money.format(price) + "</td>";
            tableText += "<td class='food-table'>" + "x" +quantity + "</td>";
            tableText += "<td class='food-table'>" + money.format(price * quantity) + "</td>";
            tableText += "</tr>";
            foodString += "&emsp;&emsp;" + name + " x" + quantity + "&ensp;\n";
        }
        
    }
    
    tableText += "<tr>";
    tableText += "<td class='food-table'><b> Food subtotal:</b> </td>";
    tableText += "<td></td>";
    tableText += "<td></td>";
    tableText += "<td class='food-table' id='food-subtotal'><b>" + money.format(foodTotalCost) + "</b></td>";
    tableText += "</tr>";
    
    document.getElementById("total-cost-food").innerHTML = tableText;
    document.getElementById("final-total").innerHTML = "Final total: " 
                    + money.format(foodTotalCost+seatsTotalCost);
}


 
           