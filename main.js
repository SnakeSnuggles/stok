var bar_count = 0
var money = 500
var stocks_owned = {}
var marker_count = {}
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
    body.appendChild(new_div);

    var buybut = document.getElementById(`buy${bar_count}`)
    var sellbut = document.getElementById(`sell${bar_count}`)

    stocks_owned[bar_count] = {}
    marker_count[bar_count] = 0
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


    var buy_marker = document.createElement("div");
    buy_marker.id = `buy_marker${id} ${total}`;
    buy_marker.classList.add("buy");
    let bestLeftValue = newLeftValue + "px";
    buy_marker.style.left = bestLeftValue;
    buy_marker.style.top = ((45.5 + 20) * id) - 5 + "px";   
    bar_area.prepend(buy_marker);
    
}


function sell(id) {
    var keys = Object.keys(stocks_owned[id]);
    var to_remove_value = Math.min.apply(null, keys.map(function(key) { return stocks_owned[id][key]; }));
    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    };
    var to_remove_key = getKeyByValue(stocks_owned[id], to_remove_value);
  
    delete stocks_owned[id][to_remove_key];
    document.getElementById(`buy_marker${id} ${to_remove_key}`).remove();
  }

function main_loop()
{
    for(i=1;i<=bar_count;i++)
    {
        move(getRandomInt(0,99),i)
    }

    setTimeout(main_loop,1000);
}
create_bar();
main_loop();

const money_f = document.getElementById("money")
money_f.innerHTML = `$ ${money}`
document.getElementById("new_bar").onclick = function(){
    create_bar();
};