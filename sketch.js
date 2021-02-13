//Create variables here
var dog, happyDog, sadDog, database, foodS, foodStock, foodObj, feed, addFood, feedTime, lastFed;

function preload()
{
  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png")
}

function setup() {
  database = firebase.database();
	createCanvas(1000, 400);
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.2;
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);
  addFood = createButton("Add food");
  addFood.position(800, 95);
  addFood.mousePressed(addFood);
}

function draw() {  
  background(46, 139, 87);
  foodObj.display();
  feedTime = database.ref('FeedTime');
  feedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill (255);
  textSize(15);
  if(lastFed > 12){
    text("Last Fed : "+ lastFed%12 + " PM", 150,30);
  }
  else if(lastFed == 0){
    text("Last Fed : 12 AM ", 150,30);
  }
  else {
    text("Last Feed : "+ lastFed + " AM", 150,30);
  }
  drawSprites();
  //add styles here

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  if(foodObj.getFoodStock() < 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFood(){
  foodS++;
  database.ref("/").update({
    Food : foodS
  });
}