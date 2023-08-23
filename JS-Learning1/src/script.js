class item {
    constructor(name, quantity, price){
        this.name = name; this.price = price; this.quantity = quantity;
    }
}

class shoppingCart {
    items; //array of items
    totalQuantity; //number
    totalPrice; //number

    constructor(){
        this.items = [];
        this.totalQuantity = 0;
        this.totalPrice = 0;
    }

    addItem(item){
        item.name = item.name.trim(); //reduce any empty spaces on the sides
        let index = this.findItem(item);
        if((index<0) && (item.name.trim() != "" && Number(item.quantity) > 0 && Number(item.price > 0))){ //new item
            this.items.push(item);
        }
        else if(index >= 0 && (Number(item.quantity) > 0)){ //valid name but index is found (item already exists)
            this.items[index].quantity += Number(item.quantity);
        }
        else{
            alert("Please enter a valid item!");
        }
    }

    findItem(item){
        let index = -1; //initial "not found" index value
        for (let i = 0; (index < 0 && i < this.items.length);  i++){ //if we finish iterating or item is found then stop
            if(this.items[i].name === item.name){ //checking if item matches via the name (identification)
                index = i; //change index
            }
        }
        return index;
    }

    updateQuantity(item, quantity){ //can update to higher OR lower quantity
        let index = this.findItem(item);
        if (index >= 0) {
            this.items[index].quantity = quantity; //apply change
        }
        else {
            alert("Item was not found in the cart! :(")
        }
    }

    removeItem(item){
        //need to find the item first!
        let index = this.findItem(item);
        if(index >= 0){ //error check
            if(item.quantity == "" || item.quantity >= this.items[index].quantity){ //remove whole
                this.items.splice(index, 1); //using splice method to remove this item and re-append the remaining array
            }
            else{ //Quantity was specified as less than total quantity
                this.items[index].quantity -= Number(item.quantity);
            }
        }
        else{
            alert("Item was not found in the cart! :(")
        }
    }

    emptyCart(){
        this.items = [];
        this.totalQuantity = 0;
        this.totalPrice = 0;
    }
}

var userCart = new shoppingCart();

var table = document.getElementById("arrayTable");

var display = document.getElementById("arrayMessage");
var displayPrice = document.getElementById("totalPriceMessage");
var displayQuantity = document.getElementById("totalQuantityMessage");

//Inputs references
var nameInput = document.getElementById("nameID");
var quantityInput = document.getElementById("quantityID");
var priceInput = document.getElementById("priceID");

//Button references
var addButton = document.getElementById("addButton");
var updateButton = document.getElementById("updateButton");
var removeButton = document.getElementById("removeButton");
var emptyButton = document.getElementById("emptyButton");

//calls displayCart function whenever a button is pressed
addButton.addEventListener('click', function(){
    newItem = new item(nameInput.value, Number(quantityInput.value), Number(priceInput.value));
    userCart.addItem(newItem);
    displayCart(userCart);
}); 
updateButton.addEventListener('click', function(){
    updateItem = new item(nameInput.value, Number(quantityInput.value),Number(priceInput.value));
    userCart.updateQuantity(updateItem, Number(quantityInput.value));
    displayCart(userCart);
});
removeButton.addEventListener('click', function(){
    delItem = new item(nameInput.value, Number(quantityInput.value), Number(priceInput.value));
    userCart.removeItem(delItem);
    displayCart(userCart);
});
emptyButton.addEventListener('click', function(){
    userCart.emptyCart();
    displayCart(userCart);
});

function removeEntry(index){//based on indexed position in table => can skip finding index process
    userCart.items.splice(index, 1);
    displayCart(userCart);
}

function editEntry(index){
    var newName = nameInput.value; var newQuantity = quantityInput.value; var newPrice = priceInput.value;
    newItem = new item(newName, Number(newQuantity), Number(newPrice));
    let existingIndex = userCart.findItem(newItem);
    if(existingIndex < 0 || existingIndex == index){ //the name does not exist currently OR it exits but its the same element
        if(newName.trim() != ""){
            userCart.items[index].name = newName;
        }
        if(Number(newQuantity) > 0){
            userCart.items[index].quantity = newQuantity;
        }    
        if(Number(newPrice) > 0){
            userCart.items[index].price = newPrice;
        }   
    }
    else{
        alert("That product already exists! :(");
    }
             

    displayCart(userCart);
}

function displayCart(shoppingCart){
    //Reset the table

    display.innerHTML = ""; //reset display
    shoppingCart.totalPrice = 0; //reset price
    shoppingCart.totalQuantity = 0; //reset quantity

    (shoppingCart.items).forEach(function parse(element, index) {
        //calculate total price on each button press
        shoppingCart.totalPrice += Number(element.price * element.quantity);
        shoppingCart.totalQuantity += Number(element.quantity);

        // let toAdd = element.name + "   <strong>|</strong>  " + element.quantity + "   <strong>|</strong>   " + element.price;
        // display.innerHTML += toAdd;
        // display.innerHTML += "<br>";

        let toAdd = "<tr> <td>" + element.name + "</td> <td>" + (element.quantity) + "</td> <td>" + element.price + "</td> <td>"
        + "<button name=xButton class=xButton value=" + index + " onClick=removeEntry(value)>X</button> "
        + "<button name=editButton class=editButton value=" + index + " onClick=editEntry(value)>Edit</button> " 
        + "</td> </tr>"
        arrayMessage.innerHTML += toAdd;

        //Add to the table
        // let row = table.insertRow(-1);
        // let c1 = row.insertCell(0); let c2 = row.insertCell(1); let c3 = row.insertCell(2);
        // c1.value = element.name; c2.value = element.quantity; c3.value = element.price;
    });

    displayPrice.innerHTML = (shoppingCart.totalPrice).toFixed(2);
    displayQuantity.innerHTML = (shoppingCart.totalQuantity).toFixed();

    //Add the products array to local storage
    localStorage.setItem("Products", JSON.stringify(shoppingCart.items));

    //Reset input boxes
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
}

