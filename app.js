
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;

eventListeners();


function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
 
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });

    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);
}

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

function loadJSON(){
    fetch('http://localhost:3000/Hotel-Room-Type/')
    .then(response => response.json())
    .then(data =>{
        let html = '';
        data.forEach(product => {
            html += `
                <div class = "product-item">
                    <div class = "product-img">
                        <img class="img" src = "${product.imgSrc}" alt = "product image">
                        
                    </div>

                    <div class = "product-content">
                        <h3 class = "product-name">${product.name}</h3>
                       
                        <p class = "product-price">$${product.price}</p>
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fas fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
    .catch(error => {
      
      
    })
}

function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
           
        </button>
        
    `;
    cartList.appendChild(cartItem);

}

function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
  
}

// load carts product
function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; 
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;

    }
    products.forEach(product => addToCartList(product));

    updateCartInfo();
}


function findCartInfo(){
    let products = getProductFromStorage();

    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); 
        return acc += price;
    }, 0); 

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); 
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); 
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}

var prodect_detial=getProductFromStorage()
function submitForm(e) {
    e.preventDefault();
    let prodect_detial = getProductFromStorage();
   console.log(prodect_detial)

   let total = prodect_detial.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(1)); 
    return acc += price;
    }, 0); 
    var Room_Type= prodect_detial.map((item, index) =>
        item.name
      );

   Name=e.target.elements.Fname.value;
    Email_Id=e.target.elements.phone.value;
   Phone_No=e.target.elements.email.value;
   var formData={
    Name:Name,
    Email_Id:Email_Id,
    Phone_No:Phone_No,
    Room_Type:Room_Type,
    Total_Amount:total
   }
    console.log(Name, Email_Id, Phone_No)
 
   
    alert("success")

fetch('http://localhost:3000/Customer_Detials/', {
  method: 'POST',
  headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*'
                },
                body:JSON.stringify(formData),

}).then(response => {
            console.log("response" ,response)
            if(response.state==200){
                alert("success")
            }
        })
        .catch(function(err){console.log(err)});


return false;
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }