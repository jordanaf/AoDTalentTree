var talents  = document.getElementsByClassName('aod-talent-tree-talent');
var talent_points = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var talent_points_max = [5,5,5,5,5,5,5,5,5,1,5,5,1,1,3,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,3,1,5,1,2,1,1,5,1,1];
var soul_level = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var total_max_points = 0;
var used_points = 0;
var table = document.getElementById('results');

$(document).ready(function() {
    var point_display = document.getElementsByClassName('aod-talent-tree-talent-points');
    talentC();
    for(var i=0;i < talents.length;i++){
        point_display[i] = point_display[i].textContent = talent_points[i].toString() + "/" + talent_points_max[i].toString();
    }
window.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        ev = ev.target.parentNode.parentNode.parentNode;
        const k = ev.getAttribute('data-cell')-1;
        const pointText = ev.nextElementSibling;
        const remaining_points = total_max_points - used_points;
        if(talent_points[k] > 0 && ev.getAttribute('data-enabled') === "true") {
            used_points--;
            talent_points[k] = talent_points[k] - 1;
            const textUpdate = pointText.textContent = talent_points[k].toString() + "/" + talent_points_max[k].toString();
            descUpdate(ev, k);
            talentC();
        }
        if (talent_points[k] == talent_points_max[k] ) {
            const from = ev.getAttribute('data-cell')
            const connector = document.getElementsByClassName('aod-talent-tree-connection');
            var num = 0;
            var p = [0];
            var stop = 0;
            for(i=0; i < connector.length;i++){
                if (from == connector[i].getAttribute('data-to-cell')) {
                    var n = connector[i].getAttribute('data-from-cell');
                }
                else if (from == connector[i].getAttribute('data-from-cell')){
                    p[num] = connector[i].getAttribute('data-to-cell');
                    num++;
                }
            }
            var z = document.getElementsByClassName('aod-talent-tree-talent');
            //console.log(p);
            for(i=0; i < p.length;i++){
                if (talent_points[p[i]-1] > 0) {
                    stop = 1;
                    break;
                }
                else {
                    stop = 0;
                }
            }
            if (stop == 0) {
                used_points--;
                talent_points[k] = talent_points[k] - 1;
                const textUpdate = pointText.textContent = talent_points[k].toString() + "/" + talent_points_max[k].toString();
                descUpdate(ev, k);
                talentC();
                for (i=0; i < p.length;i++){
                    console.log(p[i]);
                    for(d=0; d < connector.length; d++){
                        console.log(connector[d].getAttribute('data-to-cell'));
                        if (p[i] == connector[d].getAttribute('data-to-cell')){
                            connector[d].children[0].style.backgroundImage = "url('resources/img/talents-arrow-line-gray.png')";
                        }
                    }
                }
                for(i=0; i < z.length;i++) {
                    if (z[i].getAttribute('data-cell') == ev.getAttribute('data-cell')) {
                        z[i].setAttribute('data-enabled','true');
                        break;
                    }
                }
            }
        }
    });
    var e = $('.aod-talent-tree-talent').click(function(e) {
        const k = this.getAttribute('data-cell')-1;
        const pointText = this.nextElementSibling;
        const remaining_points = total_max_points - used_points;
        var n = [0];
        e.preventDefault();

        if(talent_points[k] < talent_points_max[k] && remaining_points > 0 && this.getAttribute('data-enabled') === "true") {
            used_points++;
            talent_points[k] = talent_points[k] + 1;
            const textUpdate = pointText.textContent = talent_points[k].toString() + "/" + talent_points_max[k].toString();
            descUpdate(this, k);
        }
        if (talent_points[k] == talent_points_max[k]) {
            const from = this.getAttribute('data-cell')
            const connector = document.getElementsByClassName('aod-talent-tree-connection');
            for(i=0; i < connector.length;i++){
                if (from == connector[i].getAttribute('data-from-cell')) {
                    n[i] = connector[i].getAttribute('data-to-cell');
                }
            }
            const next = document.getElementsByClassName('aod-talent-tree-talent');
            for(i=0; i < next.length;i++){
                for(z=0; z < n.length;z++){
                    if (n[z] == next[i].getAttribute('data-cell')){
                        next[i].setAttribute('data-enabled','true');
                        connector[z].children[0].style.backgroundImage = "url('resources/img/talents-arrow-line-yellow.png')";
                    }
                }
            }
            this.setAttribute('data-enabled','false');
        }
        
    talentC();
    });
    var e = $('#reset').click(function(e) {
        reset();
    });
    var e = $('#max-points').click(function(e) {
        var k = document.getElementsByTagName('input');
        var x = document.getElementById('rebirth');
        for (i=0;i < k.length;i++){
            k[i].checked = true;
        }
        x.selectedIndex = 9;
        for (i=0;i < soul_level.length;i++){
            soul_level[i] = 1;
        }
        soul_level[26] = 9;
        total_max_points = 35;
        talentC();
    });

    var e = $('#save').click(function(e) {
        var code = [0];
        for (i=0;i < soul_level.length;i++){
            code[i] = soul_level[i];
        }
        for (i=0;i < talent_points.length;i++){
            code[i+27] = talent_points[i];
        }
        var output = code.join("");
        document.getElementById('code').value = output;
    });

    var e = $('#load').click(function(e) {
        reset();
        var code = document.getElementById('code').value.split("");
        console.log(code);
        for (i=0;i < soul_level.length;i++){
            soul_level[i] = Number(code[i]);
            total_max_points = Number(total_max_points) + Number(soul_level[i]);
        }
        for (i=0;i < talent_points.length;i++){
            talent_points[i] = Number(code[i+27]);
            used_points = Number(used_points) + Number(talent_points[i]);
            console.log(used_points);
        }
        talentC();

        for (i=0;i < talents.length;i++) {
            pointText = talents[i].nextElementSibling;
            pointText.textContent = talent_points[i].toString() + "/" + talent_points_max[i].toString();
            if (talent_points[i] > 0){
                descUpdate(talents[i],i);
            }
        }
    });
});
/* $("#list").on("change",listQ); */
document.getElementById("rebirth").onchange = listQ;

function talentC(){
    total_max_points = soul_level.reduce((accumulator, current) => accumulator + current);
    var max_points = document.getElementById('points-max').textContent = "Total Maximum Points: "+total_max_points.toString();
    var remaining_points = document.getElementById('points-left').textContent = "Total Remaining Points: "+(total_max_points-used_points).toString();
}

function listQ(){
    soul_level[26] = Number($(this).val());
    talentC();
}

function reset(){

        var k = document.getElementsByTagName('input');
        var x = document.getElementById('rebirth');
        var pointText = 0;
        const connector = document.getElementsByClassName('aod-talent-tree-connection');
        for (i=0;i < k.length;i++){
            k[i].checked = false;
        }
        x.selectedIndex = 0;
        for (i=0;i < talents.length;i++) {
            if (i < 4){
                talents[i].setAttribute('data-enabled','true');
            }
            else{
                talents[i].setAttribute('data-enabled','false');
            }
            pointText = talents[i].nextElementSibling;
            talent_points[i] = 0;
            console.log(talent_points[i]);
            pointText.textContent = talent_points[i].toString() + "/" + talent_points_max[i].toString();            
        }
        used_points = 0;
        total_max_points = 0;
        for (i=0;i < soul_level.length;i++) {
            soul_level[i] = 0;
        }
        for (i=0;i < connector.length;i++){
            connector[i].children[0].style.backgroundImage = "url('resources/img/talents-arrow-line-gray.png')";
        }
        for(count=1;count < table.rows.length;count++){
            table.rows[count].children[0].textContent = "";
            table.rows[count].children[1].textContent = "";
        }
        talentC();
}

$('.aod-talent-tree-talent').hover(function () {
    var talentHover = this.getAttribute('data-cell')-1;
    var name = this.id.toString().replace(/-/g, ' ');;
    var desc = data[name][talent_points[talentHover]].description;
    var overlay = document.getElementById('talent-description');
    var title = name.charAt(0).toUpperCase() + name.slice(1);
    const words = title.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    document.getElementById('talent-title').textContent = words.join(" ");

    var tooltip = document.getElementById('talent-descr').textContent = desc;

    $(overlay).stop().fadeIn();
});

function descUpdate(e, k){
    var name = e.id.toString().replace(/-/g, ' ');;
    var desc = data[name][talent_points[k]].description;
    var overlay = document.getElementById('talent-description');
    var title = name.charAt(0).toUpperCase() + name.slice(1);
    const words = title.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    title = document.getElementById('talent-title');
    title.textContent = words.join(" ");
    title = words.join(" ");
    tableData(title, name, k);

    var tooltip = document.getElementById('talent-descr').textContent = desc;    
}

function tableData(e, k, x) {
    for(count=1;count < table.rows.length;count++){
        if(table.rows[count].children[0].innerHTML == "" ){
            table.rows[count].children[0].textContent = e;
            table.rows[count].children[1].textContent = data[k][talent_points[x]].description;
            break;
        }
        else if (table.rows[count].children[0].innerHTML === e) {
            if (talent_points[x] == 0)
            {
                table.rows[count].children[0].textContent = "";
                table.rows[count].children[1].textContent = ""; 
            }
            else {
                table.rows[count].children[0].textContent = e;
                table.rows[count].children[1].textContent = data[k][talent_points[x]].description;
            }
            break;
        }
    }
}

$('input').click(function(){
    var soul_value;
    var soul_point = this.getAttribute('data-point')-1;
    if($(this).context.checked == false){
        soul_value = 0;   
    }
    else {
        soul_value = 1;
    }
    soul_level[soul_point] = soul_value
    talentC();
});