const accessKey = "46IRbXplRq0-ajSgLFMU3InfQIn5tAbj3Mtps1habeQ";
let imagesArray = [];

window.addEventListener("load", function(){
    let lastItems = JSON.parse(localStorage.getItem("Products"));
    let lastImagesArray = JSON.parse(localStorage.getItem("Images"));
    let lastStoredCart = new shoppingCart;
    lastStoredCart.items = lastItems;
    displayLastCart(lastStoredCart, lastImagesArray);
});

window.addEventListener("beforeunload", function(){
    //Add the products array to local storage
    if(userCart.items.length!==0) //only re-save if there are any new carts
    {
        localStorage.setItem("Products", JSON.stringify(userCart.items));
        localStorage.setItem("Images", JSON.stringify(imagesArray));
    }
});

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
            //Every time a new item is pushed we should also push the image link to imagesArray
            let response = searchImage(item.name);
            response.then(function(result) { //
                imagesArray.push(result);
                displayLastCart(userCart, imagesArray); //we need to wait for the confirmation before displaying here
            });

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
                imagesArray.splice(index, 1); //imagesArray will always match the items array in terms of index
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

        imagesArray = [];
    }
}

var userCart = new shoppingCart();

var table = document.getElementById("arrayTable");

var display = document.getElementById("arrayMessage");
var displayLast = document.getElementById("LastCartList")
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
var recallButton = document.getElementById("recallButton");

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
    displayLastCart(userCart, imagesArray);
});
removeButton.addEventListener('click', function(){
    delItem = new item(nameInput.value, Number(quantityInput.value), Number(priceInput.value));
    userCart.removeItem(delItem);
    displayCart(userCart);
    displayLastCart(userCart, imagesArray);
});
emptyButton.addEventListener('click', function(){
    userCart.emptyCart();
    displayCart(userCart);
    displayLastCart(userCart, imagesArray);
});
recallButton.addEventListener('click', function(){//Recall items from localStorage
    //Re-instate previous cart
    userCart.items = JSON.parse(localStorage.getItem("Products")); //replace old items to current shopping cart
    imagesArray = JSON.parse(localStorage.getItem("Images"));
    displayCart(userCart);
});

function removeEntry(index){//based on indexed position in table => can skip finding index process
    userCart.items.splice(index, 1);
    imagesArray.splice(index,1);
    displayCart(userCart);
    displayLastCart(userCart, imagesArray);
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
    displayLastCart(userCart, imagesArray);
}

let keyword = "";
let page = 1;
let per_page = 1;


async function searchImage(newKeyword){
    keyword = newKeyword;
    const url = `https://api.unsplash.com/search/photos?page=${page}&per_page=${per_page}&query=${keyword}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    let result = data.results[0].urls.small;
    return (result);
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

        //Adding to the display array for shopping cart
        let toAdd = "<tr> <td>" + element.name + "</td> <td>" + element.quantity + "</td> <td>" + element.price + "</td> <td>"
        + "<button name=xButton class=xButton value=" + index + " onClick=removeEntry(value)>X</button> "
        + "<button name=editButton class=editButton value=" + index + " onClick=editEntry(value)>Edit</button> " 
        + "</td> </tr>"
        display.innerHTML += toAdd;

        // setTimeout(function() {
        //     let toAddLast = "<div> <img src=" + imagesArray[index] + " " + "width=100px height=120px>"
        //     + "<h4>" + element.name + "</h4>" + "<p>Quantity: " + element.quantity + "</p> <p>Price: " + element.price + "</p> </div>";
        //     displayLast.innerHTML += toAddLast;
        // }, 500);

    });

    displayPrice.innerHTML = (shoppingCart.totalPrice).toFixed(2);
    displayQuantity.innerHTML = (shoppingCart.totalQuantity).toFixed();

    //Reset input boxes
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
}

function displayLastCart(shoppingCart, images)
{
    displayLast.innerHTML = ""; //reset Last Cart before adding to it

    (shoppingCart.items).forEach(function parse(element, index) {
        let toAddLast = "<div> <img src=" + images[index] + " " + "width=100px height=120px>"
        + "<h4>" + element.name + "</h4>" + "<p>Quantity: " + element.quantity + "</p> <p>Price: " + element.price + "</p> </div>";
        displayLast.innerHTML += toAddLast;
    });
    
    
}

