var bar_count = 0
var bar_price = 1000;
var money = 500
var stocks_owned = {}
var marker_count = {}
var auto_buy_count = 0;
var auto_sell_count = 0;
var max_auto_buy = 1
var bought_by_auto = []
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
        <img id="marker${bar_count}" class="marker" ondragstart="return false;" src="assets/marker.png">
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
    scheduleRandomExecution(bar_count,500,2000);
    stocks_owned[bar_count] = {};
    marker_count[bar_count] = 0; 
    price[bar_count] = set_price()
    var thestring = buybut.id;
    var id = thestring.replace(/\D/g, '');
    move(50,Number(id))
    buybut.onclick = function()
    {
        buy(Number(id));
    };
    sellbut.onclick = function()
    {
        sell(Number(id));
    };
    
}



const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));
function stock_algor(vol,bar_id)
{
    var output;

    var move_by = getRandomInt(1,vol);

    var S = get_marker_percent(bar_id);
    var chance_up = 100-S;
    var choice = getRandomInt(1,100);

    if(chance_up > choice)
    {
        output = S+move_by;
    }
    else
    {
        output = S-move_by;
    }

    output = clamp(output,1,100);

    return output
}
function scheduleRandomExecution(i,minInterval, maxInterval) {
    const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    setTimeout(() => {
        const vol = getRandomInt(1,10)
        move(stock_algor(vol,i),i);
        scheduleRandomExecution(i,minInterval, maxInterval);
    }, randomInterval);
}

function buy(id)
{
        
    var bar = document.getElementById(`bar${id}`);
    var marker = document.getElementById(`marker${id}`);
    var bar_area = document.getElementById(`bar_area${id}`)
    const rect = bar.getBoundingClientRect();
    const width = rect.width;
    const widperc = width/100;
    const height = document.getElementById(`bar_area${id}`).getBoundingClientRect().height;
    let currentLeft = marker.style.left;

    let currentLeftValue = parseInt(currentLeft, 10);

    let newLeftValue = currentLeftValue + 36;
    marker_count[id] ++;
    var total = marker_count[id]
    var worth = newLeftValue/widperc;
    stocks_owned[id][total] = worth;
    var org_money = money;
    money -= (price[id][1] * (get_marker_percent(id) / 100)) + price[id][0];
    if(money<0)
    {
        money=org_money;
    }
    var buy_marker = document.createElement("div");
    buy_marker.id = `buy_marker${id} ${total}`;
    buy_marker.classList.add("buy");
    let bestLeftValue = newLeftValue + "px";
    buy_marker.style.left = bestLeftValue;
    buy_marker.style.top = ((height + 20) * id) + 10 + "px";
    bar_area.prepend(buy_marker);
}

function sell(id) {
    var keys = Object.keys(stocks_owned[id]);
    var to_remove_value = Math.min.apply(null, keys.map(function(key) { return stocks_owned[id][key]; }));
    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    };
    var to_remove_key = getKeyByValue(stocks_owned[id], to_remove_value);
    var to_remove = document.getElementById(`buy_marker${id} ${to_remove_key}`)

    if(!to_remove) return;
    
    to_remove.remove();
    //TODO Fix selling by getting the difference in percent rather than just the percent, who ever made this is stupid 
    money += (price[id][1] * (get_marker_percent(id) / 100)) + price[id][0];
    delete stocks_owned[id][to_remove_key];

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

document.body.onmousedown = function() { 
    mouseDown = true;
};

document.body.onmouseup = function() {
    mouseDown = false;
    activeImage = null;  // Reset the active image when the mouse is released
};

document.addEventListener("mousemove", function(event) {
    if (mouseDown && activeImage) {
        var deltaX = event.clientX - activeImage.initialMouseX;
        activeImage.img.style.left = (activeImage.initialElementX + deltaX) + "px";
    }
});


function add_auto_buy() {
    auto_buy_count++;

    if (auto_buy_count > bar_count) {
        auto_buy_count--;
        return;
    }

    const bar = document.getElementById(`bar_area${auto_buy_count}`);

    var img = document.createElement("img");
    img.src = "assets/coloured_marker.png";
    img.classList = "marker huerotate";
    img.id = `buy_marker${auto_buy_count}`;
    img.style.position = "absolute"; // Ensure the image is positioned relative to the parent
    img.style.left = "35px"; // Initialize position
    img.ondragstart = function () { return false; };

    bar.prepend(img);

    img.addEventListener("mousedown", function(event) {
        activeImage = {
            img: img,
            initialMouseX: event.clientX,
            initialElementX: parseInt(img.style.left || 0)
        };
        mouseDown = true;
    });
}
function add_auto_sell() {
    auto_sell_count++;

    if (auto_sell_count > bar_count) {
        auto_sell_count--;
        return;
    }

    const bar = document.getElementById(`bar_area${auto_sell_count}`);

    const bar_bar = document.getElementById(`bar${auto_sell_count}`);

    var img = document.createElement("img");
    img.src = "assets/coloured_marker.png";
    img.classList = "marker red_to_green";
    img.id = `sell_marker${auto_sell_count}`;
    img.style.position = "absolute"; // Ensure the image is positioned relative to the parent
    img.style.left = bar_bar.clientWidth + bar_bar.clientLeft + "px"; // Initialize position
    img.ondragstart = function () { return false; };

    bar.prepend(img);

    img.addEventListener("mousedown", function(event) {
        activeImage = {
            img: img,
            initialMouseX: event.clientX,
            initialElementX: parseInt(img.style.left || 0)
        };
        mouseDown = true;
    });
}



function main_loop()
{

    const money_f = document.getElementById("money");
    money_f.innerHTML = `$ ${money}`;

    for(var i = 1; i<=auto_buy_count; ++i)
    {
        var buy_marker = document.getElementById(`buy_marker${i}`);
        var marker_marker = document.getElementById(`marker${i}`);

        var left_buy = removeSuffix(buy_marker.style.left,"px");
        var left_marker = removeSuffix(marker_marker.style.left,"px");
        
        if(bought_by_auto[i-1] == null)
        {
            bought_by_auto[i-1] = 0;
        }

        console.log(left_buy)
        console.log(left_marker)

        if(bought_by_auto[i-1] == max_auto_buy) continue;

        if(left_marker < left_buy)
        {
            buy(i);
            bought_by_auto[i-1]++;
        }
    }
    for(var i = 1; i<=auto_sell_count; ++i)
        {
            var buy_marker = document.getElementById(`sell_marker${i}`);
            var marker_marker = document.getElementById(`marker${i}`);
    
            var left_buy = removeSuffix(buy_marker.style.left,"px");
            var left_marker = removeSuffix(marker_marker.style.left,"px");
            
            if(bought_by_auto[i-1] == null)
            {
                bought_by_auto[i-1] = 0;
            }
    
            if(bought_by_auto[i-1] == 0) continue;
    
            if(left_marker > left_buy)
            {
                sell(i);
                bought_by_auto[i-1]--;
            }
        }
    setTimeout(main_loop,1);

}

create_bar();
main_loop();

const money_f = document.getElementById("money")
money_f.innerHTML = `$ ${money}`
document.getElementById("new_bar").onclick = function(){

    if(money < bar_price) return;
    var element_price = document.getElementById("bar_price");
    create_bar();
    money -= bar_price;
    bar_price = Math.abs(((bar_price * bar_count) * 0.5) + 1000);
    element_price.innerHTML = `$${bar_price}`;

};