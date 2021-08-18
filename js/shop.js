//========================== beginning of cart ===============
// Reference: https://www.youtube.com/watch?v=B20Getj_Zk4
//Used a shopping cart tutorial by Telmo Sampaio

let carts = document.querySelectorAll('.add-cart');

// all the products available on the catalogue

let products = [{
        name: 'Helter Skelter',
        tag: 'helterskeltor',
        price: 80000,
        inCart: 0

    },
    {
        name: 'Wynwood',
        tag: 'wynwood',
        price: 7000,
        inCart: 0

    },
    {
        name: 'Helen Ngoc',
        tag: 'helenngoc',
        price: 14000,
        inCart: 0

    },
    {
        name: 'Fabian Bachli',
        tag: 'fabianbachli',
        price: 34000,
        inCart: 0

    },
    {
        name: 'Jeremy Lishner',
        tag: 'jeremylishner',
        price: 45000,
        inCart: 0

    },
    {
        name: 'Mental Health',
        tag: 'mentalhealth',
        price: 10000,
        inCart: 0

    },
    {
        name: 'Inner Peace',
        tag: 'innerpeace',
        price: 12000,
        inCart: 0

    },
    {
        name: 'The Yanos',
        tag: 'theyanos',
        price: 7000,
        vat: 15,
        inCart: 0

    }
];


//add to cart function with alert of price when button clicked
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
        
        //alert of cart total excluding VAT
        let cartCost = localStorage.getItem('totalCost');
        cartCost = parseInt(cartCost);
        alert('Total is: R' + cartCost + ' (not incl. VAT)')
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}



function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
/* check if something already exists */
    if (cartItems != null) {
        /* If undefined and then i want  whatever on localStorage before and add new product */
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));

}



function totalCost(product) {
    console.log("The product price is", product.price);
    let cartCost = localStorage.getItem('totalCost');

    console.log("My cartCost is", cartCost);
    console.log(typeof cartCost);
    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

// function which displays object elements and displays total cost with added VAT calc
function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    // when you grab object from localStorage we want to convert to JS objects
    cartItems = JSON.parse(cartItems);
    // check if products container is on page so that it only runs on this HTML page
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');

    //calc VAT
    const VAT_RATE = 0.15;
    let totalVAT = cartCost * VAT_RATE;
    // made use of unary plus operator, to force an eventual string to be treated
    // as number, inside parenthesis to make the code more readable
    // ref: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
    let sumTotal = (+totalVAT) + (+cartCost);

    // so we have something in cartItems and it has the container
    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <br>
            <div class="product text-center"> 
                <img class="img-fluid thumbnail  "src="./images/${item.tag}.jpg"> 
                <br>
            
            <span class="lead">${item.name}</span>
            </div>
            <div class="price text-center">
            <span> Price: ${item.price} </span>
            </div>
            <div class="quantity text-center">
            <span> Quantity: ${item.inCart}</span>
            </div>

            <div class="total text-center">
            <span> Total Item Price: R${item.inCart * item.price}</span>
            </div>
            `
        });
        productContainer.innerHTML += `
            <hr>
            <div class="basketTotalContainer" style="text-align: center";>
                <h3 class="lead"> Vat: R${totalVAT} </h3>
                <h4 class="basketTotalTitle lead"> 
                    Total(incl. Vat): R${sumTotal}
                </h4>
            </div>
            <br>
        `
    }
    checkoutTotal(sumTotal);
    return sumTotal;
}


displayCart();

//=======================================End of Cart==================


//refresh button function
function refresh() {
window.location.reload();
}

//displays variable from displayCart function to this function for display of cart before shipping and discount but incl VAT.
function checkoutTotal(sumTotal) {
    document.getElementById('checkoutTotal').innerHTML = "Your cart total incl. VAT: R" + sumTotal;
}

//discount code validator
$("#discountRedeem").click(function newPrice() {
    let promoCode = document.getElementById("discount").value;
    //using the total value from returned value from displayCart() which is w.o Discount.
    let totalWithoutDiscount = displayCart();
    if (promoCode == 'TSOA') {
        let discountedPrice = totalWithoutDiscount * 0.7;
        localStorage.setItem('discountedPrice', discountedPrice)
        
    } else {
        alert("Not a discount code!");
        let discountedPrice = totalWithoutDiscount;
        localStorage.setItem('discountedPrice', discountedPrice)
    }
});

//displays new discounted price below the coupon code
//only if its greater than 1 or not null will it show the price else it will only show no discount.
if (localStorage.getItem("discountedPrice") == null || localStorage.getItem("discountedPrice") < 1){
    document.getElementById("discountedPrice").innerHTML = 'No discount';
} else{
    document.getElementById("discountedPrice").innerHTML = 'Discounted Price: R' + localStorage.getItem("discountedPrice");
}

//delivery options hidden already
$("#deliveryOptions").hide();

// when click delivery then options show
$("#deliveryCheck").click(function(){
    $("#deliveryOptions").show(1000);
});

//function to price when delivery options are selected
$("select").on("change", function(){
    let deliveryPrice = parseFloat(localStorage.getItem("discountedPrice"));
    if($(this).val() == "standard"){
        newPrice = deliveryPrice + 100;
        localStorage.setItem('finalPrice', newPrice);
        alert('R75 Standard Shipping applied!')
    } else if(($(this).val() == "prime")){
        newPrice = deliveryPrice + 250;
        localStorage.setItem('finalPrice', newPrice);
        alert('R250 Premium Shipping applied!');
    } else {
        newPrice = deliveryPrice + 0;
        localStorage.setItem('finalPrice', newPrice);
    }
    window.location.reload();
});

//final price display
if (localStorage.getItem("finalPrice") == null && localStorage.getItem("discountedPrice") == null) {
    document.getElementById('newPrice').innerHTML = "Please choose a delivery option and apply a discount code!";
} else if (localStorage.getItem("finalPrice") == null){
    document.getElementById('newPrice').innerHTML = "Your cost so far: R" + localStorage.getItem("discountedPrice");
} else {
    document.getElementById('newPrice').innerHTML = "Your final cost: R" + localStorage.getItem("finalPrice");
}

// already hidden discount code container
$("#discount-container").hide();

//hide and show discount button functions
$("#hide-button").click(function(){
    $("#discount-container").hide(1000);
  });
$("#show-button").click(function(){
    $("#discount-container").show(1000);
  });

//submit button functionality
  $("#submitButton").click(function(){
    //chained jquery effect
    $("#submitButton").animate({width: "15%"}).animate({borderWidth: 5}).css("color", "lightblue").slideUp(3000).slideDown(2000);
    document.getElementById('submitButton').innerHTML = "Order Confirmed!";
    //reference code generator taken from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    alert('Order Sucessful! Final cost: R'+  + localStorage.getItem("finalPrice") + ' Reference Code:' + Math.random()*9e6).toString(36);

  });
