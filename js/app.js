'use strict';
//----------Global Variables---------------------------------------------------------------------------------------------------------------
// Total Products in existence
var totalProducts = [];
// File name of Products
var productFileName = ['bag.jpg','banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var previousProducts = [undefined, undefined, undefined];
//----------Product Constructor That will give an object their name as well as what type of file they are-------------------------------
//I think it will also need to log how many times the product has been looked at so that it doesnt repeat and also keep track of votes for results in the end.
function Product(name, path) {
  this.name = name.split('.')[0];
  this.path = path;
  this.votes = 0;
  this.views = 0;
  totalProducts.push(this);
}
//----------Run the Product Constructor------------------------------------------------------------------
function runProduct() {
  for (var i = 0; i < productFileName.length; i++) {
    new Product(productFileName[i], 'img/' + productFileName[i]);
  }
}
runProduct();

console.log ('Constructor', runProduct);
//----------Voting Machine---------------------------------------------------------------------------------------------------------------------------------
// Logs clicks and populates left, center, and right products onto screen-
var productVotes = {
  totalVotes: 0,
  leftWindow: null,
  middleWindow: null,
  rightWindow: null,
  //Links to HTML Land
  leftWindowEl: document.getElementById('leftWindow'),
  middleWindowEl: document.getElementById('centerWindow'),
  rightWindowEl: document.getElementById('rightWindow'),
  allWindowsEl: document.getElementById('allWindows'),
  votingResultsEl: document.getElementById('votingResults'),
  resultsButton: document.getElementById('showVotingResults'),
  resetButton: document.getElementById('reset'),
  //Calls up random products to display
  getRandomProduct: function() {

    return Math.floor(Math.random() * productFileName.length);
  },
  displayProducts: function() {
    productVotes.leftWindow = totalProducts[productVotes.getRandomProduct()];
    productVotes.middleWindow = totalProducts[productVotes.getRandomProduct()];
    productVotes.rightWindow = totalProducts[productVotes.getRandomProduct()];
    //Needs to make sure that all three objects displayed are unique items and not from previous round
    //unique items
    if (productVotes.leftWindow === productVotes.middleWindow || productVotes.leftWindow === productVotes.rightWindow || productVotes.middleWindow === productVotes.rightWindow) {
      productVotes.displayProducts();
    }
    //unique compared to previous round
    if (previousProducts.includes(productVotes.leftWindow.name) || previousProducts.includes(productVotes.middleWindow.name) || previousProducts.includes(productVotes.rightWindow.name)) {
      productVotes.displayProducts();
    }
    //Everytime somthing is viewed keep track
    productVotes.leftWindow.views += 1;
    productVotes.middleWindow.views += 1;
    productVotes.rightWindow.views += 1;
    //Tells HTML Land what is should be showing
    // Left
    productVotes.leftWindowEl.src = productVotes.leftWindow.path;
    productVotes.leftWindowEl.id = productVotes.leftWindow.name;
    previousProducts[0] = productVotes.leftWindow.name;
    // Center
    productVotes.middleWindowEl.src = productVotes.middleWindow.path;
    productVotes.middleWindowEl.id = productVotes.middleWindow.name;
    previousProducts[1] = productVotes.middleWindow.name;
    // Right
    productVotes.rightWindowEl.src = productVotes.rightWindow.path;
    productVotes.rightWindowEl.id = productVotes.rightWindow.name;
    previousProducts[2] = productVotes.rightWindow.name;
  },
  //Everytime something is clicked keep track
  //Also needs to keep track of overall clicks so that voting ends at 25 clicks
  voteClicks: function(elId) {
    for (var i in totalProducts) {
      if (totalProducts[i].name === elId) {
        totalProducts[i].votes += 1;
        this.totalVotes += 1;
      }
    }
  },
  //Create a table at the end of the voting that shows products and total number of votes they have.
  displayResults: function() {
    var ulEl = document.createElement('ul');
    for (var i in totalProducts) {
      var liElOne = document.createElement('li');
      var str = totalProducts[i].name + ' has ' + totalProducts[i].votes + ' votes.';
      str = str.charAt(0).toUpperCase() + str.slice(1);
      liElOne.textContent = (str);
      ulEl.appendChild(liElOne);
    }
    var liElTwo = document.createElement('li');
    liElTwo.textContent = 'Total User Clicks: ' + productVotes.totalVotes;
    ulEl.appendChild(liElTwo);
    this.votingResultsEl.appendChild(ulEl);
  },
  //Create something that will allow user to click on images.... turn image into button mayhaps???
  showButton: function() {
    this.resultsButton.hidden = false;
    this.resultsButton.addEventListener('click', function() {
      productVotes.resetButton.hidden = false;
      productVotes.resultsButton.hidden = true;
      productVotes.displayResults();

      productVotes.resetButton.addEventListener('click', function() {
        productVotes.resetButton.hidden = true;
        location.reload();
      });
    });
  },
  //What happens if button is clicked.
  //Vote is recorded
  //25 Votes have occured.
  //Dumb Dumb didnt click on a picture
  onClick: function() {
    if (event.target.id === productVotes.leftWindow.name || event.target.id === productVotes.middleWindow.name || event.target.id === productVotes.rightWindow.name) {
      productVotes.voteClicks(event.target.id);
      productVotes.totalVotes += 1;

      if (productVotes.totalVotes % 25 === 0) {
        productVotes.allWindowsEl.removeEventListener('click', productVotes.onClick);
        productVotes.showButton();
      }
      productVotes.displayProducts();
    } else {
      alert('Please Select Image');
    }
  },
};

//----------Calling Functions----------------------------------------------------------------------------------------------------------------
productVotes.allWindowsEl.addEventListener('click', productVotes.onClick);
productVotes.displayProducts();