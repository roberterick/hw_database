THE_URL='http://localhost:3000';
//THE_URL='http://52.35.58.218:3000';
TIMEOUT=2000;

function getUrl(url, callback) {
//    url=encodeURI(url);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    //req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", function () {
        if (req.status < 400) {
            callback(req.responseText);
        } else {
            callback(null, new Error("Request failed: " + req.statusTest));
        }
    });
    req.addEventListener("error", function () {
        callback(null, new Error("Network error"));
    });
    
    var reqTimeout=setTimeout(ajaxTimeout,TIMEOUT);
    function ajaxTimeout(){
        callback(req.responseText);
    }
    
    req.send(null);
}

function makeTable(){
    //console.log("make table");
    getUrl(THE_URL+'/getTable',makeTableCallback);
}

function makeTableCallback(content, error) {
    if (content!==null) {
        var json=JSON.parse(content);
//        makeRow(json);
        document.getElementById("t1").innerHTML=table(json);
    } else {
        console.log("Failed to fetch: " + error);
    }
    
    var forms = document.getElementsByTagName("form");
    for(var i=0;i<forms.length;i++){
        forms[i].addEventListener('submit', function (evt) {evt.preventDefault();});
    }
    
    var deletes = document.getElementsByClassName("delete");
    for(var i=0;i<deletes.length;i++){
        deletes[i].addEventListener('click',deleteMethod);
    }
    
    var edits = document.getElementsByClassName("edit");
    for(var i=0;i<edits.length;i++){
        edits[i].addEventListener('click',editMethod);
    }
};

function table(listjson){
	var vals=[];
        var header=0;
	for(var i=0;i<listjson.length;i++){
            if(i===0){
                header=1;
                vals.push('<thead>');
                vals.push(tableRow(listjson[i],header));
                vals.push('</thead>');
                vals.push('<tbody>');
            } else {
                header=0;
                vals.push(tableRow(listjson[i],header));
            }
	}
        vals.push('</tbody>');
	var table=vals.join("");
	return table;
}

function tableRow(json,header){
	var keys=Object.keys(json);
	var vals=[];
        var id=json[keys[i]];
	
        var rowid=json[keys[0]];
	for(var i=1;i<keys.length;i++){
		vals.push(json[keys[i]]);
	}
        if(header===1){
            vals.push('edit');
            vals.push('delete');
            var row="<th>"+vals.join("</th><th>")+"</th>";
        } else {
            var row="<td>"+vals.join("</td><td>")+"</td>";
            row=row+"<td><form class='form'> <input type='submit' name='edit' value='edit' class='edit' id=e"+rowid+"></form></td>"; 
            row=row+"<td><form class='form'> <input type='submit' name='delete' value='delete' class='delete' id=d"+rowid+"></form></td>";
        }
	return "<tr>"+row+"</tr>";
}

function sendJson(url,json,callback) {
    console.log('sending json');
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", function () {
        if (req.status < 400) {
            callback(req.responseText);
        } else {
            callback(null, new Error("Request failed: " + req.statusTest));
        }
    });
    req.addEventListener("error", function () {
        callback(null, new Error("Network error"));
    });
    
    var reqTimeout=setTimeout(ajaxTimeout,TIMEOUT);
    function ajaxTimeout(){
        callback(req.responseText);
    }
    
    req.send(json);
}

function insertMethod(event) {
//    alert('insertMethod');
    var j={};
    j['name']=document.getElementById("name").value;
    j['reps']=document.getElementById("reps").value;
    j['weight']=document.getElementById("weight").value;
    j['date']=document.getElementById("date").value;
    j['lbs']=document.getElementById("lbs").value;
    sendJson(THE_URL+'/insert',JSON.stringify(j),makeTable);
}

function deleteMethod(event) {
    var rowid=this.id;
    rowid=rowid.substring(1);
    var j={id:rowid};
    sendJson(THE_URL+'/delete',JSON.stringify(j),makeTable);
}

function editMethod(event) {
    alert('editMethod');
//    var theid=this.id;
//    var j={id:1};
//    j['name']=document.getElementById("name").value;
//    j['reps']=document.getElementById("reps").value;
//    j['weight']=document.getElementById("weight").value;
//    j['date']=document.getElementById("date").value;
//    j['lbs']=document.getElementById("lbs").value;
//    sendJson('http://localhost:3000/delete',JSON.stringify(j),makeTable);
}

function initialize() {
    document.getElementById("formAdd").addEventListener('submit', function (evt) {
        evt.preventDefault();});
    document.getElementById("addSubmit").addEventListener('click', insertMethod);
    
    makeTable();                  
}