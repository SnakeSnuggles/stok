var bar_count = 0
var money = 500
var stocks_owned = {}
var marker_count = {}
var price = {}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(percent,bar_id) {
    var marker = document.getElementById(`marker${bar_id}`);
    var bar = document.getElementById(`bar${bar_id}`);
    const rect = bar.getBoundingClientRect();
    const width = rect.width;
    const widperc = width / 100;
    
    marker.style.left = (percent * widperc) + "px"; 
}

function set_price()
{
    var min = getRandomArbitrary(0,15);
    var max = getRandomArbitrary(16,100);

    return [min,max]

}
function removeSuffix(str, suffix) {
    if (str.endsWith(suffix)) {
      return str.slice(0, -suffix.length);
    }
    return str;
  }

function get_marker_percent(bar_id)
{
    var marker = document.getElementById(`marker${bar_id}`);
    var bar = document.getElementById(`bar${bar_id}`);
    const rect = bar.getBoundingClientRect();
    const width = rect.width;
    const widperc = width / 100;
    
    var percent = removeSuffix(marker.style.left,"px") / widperc

    return percent
}

function create_bar()
{
    
    bar_count+=1
    var body = document.getElementById("body");
    const new_div = document.createElement('div');
    new_div.innerHTML = 
    `
        <div id="bar_area${bar_count}" class="bar_area">
        <img id="marker${bar_count}" class="marker" src="maps-and-flags.png">
        <div class="samel">
            <div style="width: 100%;" class="samel containers">
                <div id="bar${bar_count}" class="bar"></div>
                    <button class="button" id="buy${bar_count}">buy</button>
                    <button class="button" id="sell${bar_count}">sell</button>
                </div>
            </div>
        </div>
    </div>
    `;
    body.prepend(new_div);

    var buybut = document.getElementById(`buy${bar_count}`)
    var sellbut = document.getElementById(`sell${bar_count}`)
    scheduleRandomExecution(bar_count,500,2000);
    stocks_owned[bar_count] = {};
    marker_count[bar_count] = 0; 
    price[bar_count] = set_price()
    var thestring = buybut.id;
    var id = thestring.replace(/\D/g, '');
    buybut.onclick = function()
    {
        buy(Number(id));
    };
    sellbut.onclick = function()
    {
        sell(Number(id));
    };
    
}

function buy(id)
{

    /*
    2 parts 
  
    1. adding the marker in the correct possition (D)
    2. adding the correct price to the list for the stock bar
    */
    var bar = document.getElementById(`bar${id}`);
    var marker = document.getElementById(`marker${id}`);
    var bar_area = document.getElementById(`bar_area${id}`)
    const rect = bar.getBoundingClientRect();
    const width = rect.width;
    const widperc = width/100
    let currentLeft = marker.style.left;

    let currentLeftValue = parseInt(currentLeft, 10);

    let newLeftValue = currentLeftValue + 36;
    marker_count[id] ++;
    var total = marker_count[id]
    var worth = newLeftValue/widperc;
    stocks_owned[id][total] = worth;

    money -= (price[id][1] * (get_marker_percent(id) / 100)) + price[id][0];
    var buy_marker = document.createElement("div");
    buy_marker.id = `buy_marker${id} ${total}`;
    buy_marker.classList.add("buy");
    let bestLeftValue = newLeftValue + "px";
    buy_marker.style.left = bestLeftValue;
    buy_marker.style.top = ((45.5 + 30) * id) + "px";   
    bar_area.prepend(buy_marker);
}

function sell(id) {
    var keys = Object.keys(stocks_owned[id]);
    var to_remove_value = Math.min.apply(null, keys.map(function(key) { return stocks_owned[id][key]; }));
    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    };
    var to_remove_key = getKeyByValue(stocks_owned[id], to_remove_value);
    
    money += (price[id][1] * (get_marker_percent(id) / 100)) + price[id][0];
    delete stocks_owned[id][to_remove_key];
    document.getElementById(`buy_marker${id} ${to_remove_key}`).remove();

  }
  function scheduleRandomExecution(i,minInterval, maxInterval) {
    const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    setTimeout(() => {
        move(getRandomInt(0,99),i);
        scheduleRandomExecution(i,minInterval, maxInterval);
    }, randomInterval);
}

function toggle_menu(div)
{
    var upgrade_div = document.getElementById("Upgrade_cont");
    var leader_div = document.getElementById("Leader_cont");

    if(div === "Upgrade_cont")
    {
        upgrade_div.style.display = "block";
        leader_div.style.display = "none";
    }
    else if(div === "Leader_cont")
    {
        leader_div.style.display = "block";
        upgrade_div.style.display = "none";
    }
}


function main_loop()
{

    const money_f = document.getElementById("money")
    money_f.innerHTML = `$ ${money}`
    setTimeout(main_loop,1);
}

create_bar();
main_loop();

const money_f = document.getElementById("money")
money_f.innerHTML = `$ ${money}`
document.getElementById("new_bar").onclick = function(){
    create_bar();
};