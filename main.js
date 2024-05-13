let tg = window.Telegram.WebApp

tg.expand();

// tg.MainButton.show();
tg.MainButton.text = "Заказать"; 


let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];

let generateShopItems = () => {
  return (shop.innerHTML = shopItems
    .map((item) => {
      let search = basket.find((basketItem) => basketItem.id === item.id);
      let count = 0;
      if (search !== undefined) count = search.item;

      return `
      <div class="item shadow" id="${item.id}">
        <img src="${item.img}" alt="${item.name} image" />
        <div class="item__content">
          <h3>${item.name} </h3>
          <div class="item__content--controls">
            <i onclick="decrement(${item.id})" class="fa-solid fa-minus"></i>
            <span class="quantity">${count}</span>
            <i onclick="increment(${item.id})" class="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
      `;
    })
    .join(""));
};

generateShopItems();

const decrement = (id) => {
  let search = basket.find((basketItem) => basketItem.id === id);
  if (search === undefined) return;
  if (search.item === 0) return;
  search.item--;

  update(id);

  basket = basket.filter((basketItem) => basketItem.item !== 0);
  localStorage.setItem("data", JSON.stringify(basket));
};

const increment = (id) => {
  let search = basket.find((basketItem) => basketItem.id === id);

  if (search === undefined) {
    basket.push({ id, item: 1 });
  } else {
    search.item++;
  }

  localStorage.setItem("data", JSON.stringify(basket));

  update(id);
};

const update = (id) => {
  var search = basket.find((basketItem) => basketItem.id === id);

  document.getElementById(id).querySelector(".quantity").innerHTML =
    search.item;
  // itemsSum();

};

// const itemsSum = () => {
//   let cartCounter = document.querySelector(".cartCounter");

//   let count = 0;
//   basket.forEach(({ item }) => (count += item));
  

//   cartCounter.innerHTML = count;
//   console.log(count);

// };

// itemsSum(); // Run this function at least once to update the cart counter on refresh.


// const btn = document.querySelector('.btn__link');

// btn.addEventListener('click', function () {
//   console.log(count)
// })

console.log(basket);



const input = document.querySelector("#phone");
const output = document.querySelector("#output");

const iti = window.intlTelInput(input, {
  initialCountry: "ru",
  separateDialCode: true,
  nationalMode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@22.0.2/build/js/utils.js?1714642302458",
});

const handleChange = () => {
  let text;
  if (input.value) {
    text = iti.isValidNumber()
      ? "Заказ оформится на номер: " + iti.getNumber()      
      : "Номер введен неправильно. Начните с 9хх без +7 и 8.";
  } else {
    text = "Введите номер телефона:";
  }
  if (iti.isValidNumber()) {
    tg.MainButton.show();
    var tel = document.getElementById('phone').value;
    console.log(tel)
  } else {
    tg.MainButton.hide();
  }
  const textNode = document.createTextNode(text);
  output.innerHTML = "";
  output.appendChild(textNode);
};

// listen to "keyup", but also "change" to update when the user selects a country
input.addEventListener('change', handleChange);
input.addEventListener('keyup', handleChange);

// document.getElementById('myButton').onclick = myFunction;

// function myFunction() {
//   console.log(iti.getNumber())
// }

// send_data = iti.getNumber();

let strbasket = JSON.stringify(basket);

Telegram.WebApp.onEvent("mainButtonClicked", function(){
  tg.sendData(strbasket + iti.getNumber());
  // tg.sendData("some string that we need to send"); 
})

