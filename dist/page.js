"use strict"

function Router() {
    this.currentUrl = '';
}

Router.prototype.refresh = function () {   
    document.getElementById(this.currentUrl)?.classList.remove("show");
    document.getElementById("report").removeAttribute("href");
    this.currentUrl = location.hash.slice(1) || '/';
    document.getElementById(this.currentUrl)?.classList.add("show");
};

Router.prototype.init = function () {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
};
window.Router = new Router();
window.Router.init();

function newFile() {
    document.getElementById("menu").style.display = "block";
    alert('选择菜单项。');
}

document.getElementById("open").onclick = function(){
    document.getElementById("file").click();  
}

document.getElementById("file").onchange = function(){
    let reader = new FileReader();
    reader.readAsText(this.files[0], "UTF-8");
    reader.onload = function(evt){
        let fileString = evt.target.result;
        const jsonObj = JSON.parse(fileString);

        document.getElementById(window.Router.currentUrl).classList.remove("show");
        location.hash = "#" + jsonObj.page;
        window.Router.currentUrl = jsonObj.page;
        let currentPage = document.getElementById(jsonObj.page);
        let currentRow = currentPage.getElementsByClassName("form")[0].firstElementChild;
        for (let i = 0; i < jsonObj.data.length; i++) {
            const row = jsonObj.data[i];
            let inputs = currentRow.getElementsByTagName("input");
            for (let j = 0; j < inputs.length; j++) {
                const val = row[j];
                inputs[j].value = val;
            }
            let selects = currentRow.getElementsByTagName("select");
            for (let m = 0; m < selects.length; m++) {
                const selectedIndex = row[inputs.length + m];
                selects[m].selectedIndex = selectedIndex;
            }
            if (!(currentRow = currentRow.nextElementSibling) && i !=  jsonObj.data.length - 1) {
                currentRow = addRow();
            }
        }
    }
}

function save() {
    let dataObj = new Object();
    dataObj.page = window.Router.currentUrl;
    dataObj.data = new Array();

    let currentPage = document.getElementById(window.Router.currentUrl);
    let currentRow = currentPage.getElementsByClassName("form")[0].firstElementChild;
    
    do {
        let row = new Array();
        let inputs = currentRow.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            const val = inputs[i].value;
            row.push(val);
        }
        let selects = currentRow.getElementsByTagName("select");
        for (let j = 0; j < selects.length; j++) {
            const selectedIndex = selects[j].selectedIndex;
            row.push(selectedIndex);
        }
        dataObj.data.push(row);
    } while (currentRow = currentRow.nextElementSibling);

    let link = document.getElementById("save-link");
    link.href = downLoadLink(JSON.stringify(dataObj));
    link.click();
}

function downLoadLink(text) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" ,endings:'native'});
    return URL.createObjectURL(blob);
}

function addRow() {
    let currentPage = document.getElementById(window.Router.currentUrl);
    let formEle = currentPage.getElementsByClassName("form")[0];
    let lastRowEle = formEle.lastElementChild;
    let nextRowEle = lastRowEle.cloneNode(true);
    formEle.appendChild(nextRowEle);
    return nextRowEle;
}

function delRow(e) {
    let rowEle = e.target.parentNode.parentNode;//row
    if (rowEle.parentNode.childElementCount > 1) {
        rowEle.parentNode.removeChild(rowEle);
    }
}

function yrun() {
    window.YRunner.methods[window.Router.currentUrl]();
}

function YRuner() {
    this.methods = {};
}

YRuner.prototype.method = function (page, callback) {
    this.methods[page] = callback || function () { };
};

window.YRunner = new YRuner();

window.YRunner.method ("/", function () {
    alert("未选择功能。");
});

window.YRunner.method ("pipe-material-sum", function () { 
    let rowEle = event.target.parentNode.parentNode;
    let inputs = rowEle.getElementsByTagName("input");

    let pipe = new Pipe();

    pipe.do_ = Number(inputs[0].value) / 1000;
    pipe.di = pipe.do_ - 2 * (Number(inputs[1].value) / 1000);
    pipe.insulThk = Number(inputs[2].value) / 1000;
    let length = Number(inputs[3].value);

    rowEle.children[4].innerHTML = pipe.weight().toFixed(2);
    rowEle.children[5].innerHTML = (pipe.weight()* length).toFixed(2);
    rowEle.children[6].innerHTML = (pipe.area() * length).toFixed(2);
    rowEle.children[7].innerHTML = (pipe.insulVolume() * length).toFixed(2);
    rowEle.children[8].innerHTML = (pipe.cladArea() * length).toFixed(2);

    let sum = [0, 0, 0, 0];
    let currentRow = rowEle.parentNode.firstElementChild;
    do {
        sum[0] += Number(currentRow.children[5].innerHTML);
        sum[1] += Number(currentRow.children[6].innerHTML);
        sum[2] += Number(currentRow.children[7].innerHTML);
        sum[3] += Number(currentRow.children[8].innerHTML);
    } while (currentRow = currentRow.nextElementSibling);
    
    let currentSum = rowEle.parentNode.nextElementSibling.firstElementChild.children[5];
    for (let i = 0; i < sum.length; i++) {
        currentSum.innerHTML = sum[i].toFixed(2);
        currentSum = currentSum.nextElementSibling;
    }

    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 4 && i > 0 && i < table.rows.length - 1; j++) { 
            const cell = table.rows[i].cells[j];
            cell.innerHTML = cell.children[0].value;  
        }
        table.rows[i].deleteCell(9);
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    //let blob = new Blob([content], {type: "application/ms-word;charset=gb2312"});
    //document.getElementById("report").href = URL.createObjectURL(blob);
    document.getElementById("report").href = downLoadLink(content);
});

window.YRunner.method ("pipe-weight", function () {
    let rowEle = event.target.parentNode.parentNode;
    let inputs = rowEle.getElementsByTagName("input");

    let pipe = new Pipe();

    pipe.do_ = Number(inputs[0].value) / 1000;
    pipe.di = pipe.do_ - 2 * (Number(inputs[1].value) / 1000);

    pipe.insulThk = Number(inputs[2].value) / 1000;
    pipe.insul.density = Number(inputs[3].value);
    pipe.cladThk = Number(inputs[4].value) / 1000;
    pipe.clad.density = Number(inputs[5].value);
    let length = Number(inputs[6].value);

    rowEle.children[7].innerHTML = pipe.weight().toFixed(2);
    rowEle.children[8].innerHTML = (pipe.weight()* length).toFixed(2);
    rowEle.children[9].innerHTML = (pipe.insulWeight() * length).toFixed(2);
    rowEle.children[10].innerHTML = (pipe.cladWeight() * length).toFixed(2);
    rowEle.children[11].innerHTML = (pipe.waterWeight() * length).toFixed(2);
    rowEle.children[12].innerHTML = ((pipe.weight() + pipe.insulWeight() + pipe.cladWeight() + pipe.waterWeight() ) * length).toFixed(2);

    let sum = [0, 0, 0, 0, 0];
    let currentRow = rowEle.parentNode.firstElementChild;
    do {
        sum[0] += Number(currentRow.children[8].innerHTML);
        sum[1] += Number(currentRow.children[9].innerHTML);
        sum[2] += Number(currentRow.children[10].innerHTML);
        sum[3] += Number(currentRow.children[11].innerHTML);
        sum[4] += Number(currentRow.children[12].innerHTML);
    } while (currentRow = currentRow.nextElementSibling);
    
    let currentSum = rowEle.parentNode.nextElementSibling.firstElementChild.children[8];
    for (let i = 0; i < sum.length; i++) {
        currentSum.innerHTML = sum[i].toFixed(2);
        currentSum = currentSum.nextElementSibling;
    }

    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 7 && i > 0 && i < table.rows.length - 1; j++) { 
            const cell = table.rows[i].cells[j];
            cell.innerHTML = cell.children[0].value;  
        }
        table.rows[i].deleteCell(13);
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    document.getElementById("report").href = downLoadLink(content);
});

window.YRunner.method ("pipe-drop-pressure", function () {
    let rowEle = event.target.parentNode.parentNode;
    let selects = rowEle.getElementsByTagName("select");
    let inputs = rowEle.getElementsByTagName("input");
    let pipe = new Pipe();
    pipe.roughness = Number(selects[0].value);
    pipe.di = Number(inputs[0].value) / 1000;
    let length = Number(inputs[1].value);
    pipe.fluid.flowRate_mass = Number(inputs[2].value) / 3600;
    pipe.fluid.setD(Number(inputs[3].value));
    pipe.fluid.setViscosity(Number(inputs[4].value));

    const localResistace = {
        elbow45: 0.35,
        elbow90: 0.75,
        elbow90_x: 1.30, //90°斜接弯头
        elbow180: 1.5,
        globeValve: 6.00,
        angleValve: 3.00,
        gateValve: 0.17,
        plugValve: 0.05,
        butterflyValve: 0.24,
        checkValve0: 2.00,
        checkValve1: 10.00,
        footValve: 15.00,
    };

    let i = 5, k = 0;
    for (const key in localResistace) {
        //console.log(localResistace[key]);
        k += Number(inputs[i].value) * localResistace[key];
        ++i;
        //console.log(k);
    }

    rowEle.children[18].innerHTML = pipe.velocity().toFixed(2);
    rowEle.children[19].innerHTML = (pipe.dropPressure_line(length) / 1000).toFixed(2);
    rowEle.children[20].innerHTML = (pipe.dropPressure_local(k) / 1000).toFixed(2);
    rowEle.children[21].innerHTML = ((pipe.dropPressure_line(length) + pipe.dropPressure_local(k)) / 1000).toFixed(2);
    
    let sum = [0, 0, 0];
    let currentRow = rowEle.parentNode.firstElementChild;//获取第一行数据
    do {
        sum[0] += Number(currentRow.children[19].innerHTML);
        sum[1] += Number(currentRow.children[20].innerHTML);
        sum[2] += Number(currentRow.children[21].innerHTML);
    } while (currentRow = currentRow.nextElementSibling);
    
    let currentSum = rowEle.parentNode.nextElementSibling/* <tfoot> */.firstElementChild.children[19];
    for (let i = 0; i < sum.length; i++) {
        currentSum.innerHTML = sum[i].toFixed(2);
        currentSum = currentSum.nextElementSibling;
    }

    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    //输入框替换为文本，删除最后一列
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 18 && i > 1 && i < table.rows.length - 1; j++) { 
            const cell = table.rows[i].cells[j];
            if (j == 0) {
                cell.innerHTML = cell.children[0].options[cell.children[0].selectedIndex].text;
            }
            else {
                cell.innerHTML = cell.children[0].value;
            }
        }

        switch (i) {
            case 0:
                table.rows[i].deleteCell(7);
                break;
            case 1:
                break;
            default:
                table.rows[i].deleteCell(22);
                break;
        }      
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    document.getElementById("report").href = downLoadLink(content);
});

window.YRunner.method ("pipe-diameter-velocity", function () {
    let rowEle = event.target.parentNode.parentNode;
    let inputs = rowEle.getElementsByTagName("input");
    let pipe = new Pipe();
    pipe.fluid.flowRate_volume = Number(inputs[0].value) / 3600;
    let velocity = Number(inputs[1].value);

    rowEle.children[2].innerHTML = (pipe.diameter_velocity(velocity) * 1000).toFixed(2);
    
    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    //输入框替换为文本，删除最后一列
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 2 && i > 0; j++) { 
            const cell = table.rows[i].cells[j];
            cell.innerHTML = cell.children[0].value;
        }

        table.rows[i].deleteCell(3);    
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    document.getElementById("report").href = downLoadLink(content);
});

window.YRunner.method ("pipe-diameter-pressure-drop", function () {
    let rowEle = event.target.parentNode.parentNode;
    let inputs = rowEle.getElementsByTagName("input");
    let pipe = new Pipe();
    pipe.fluid.flowRate_volume = Number(inputs[0].value) / 3600;
    pipe.fluid.setD(Number(inputs[1].value));
    pipe.fluid.setViscosity(Number(inputs[2].value));
    let length = Number(inputs[3].value);
    let pressureDrop = Number(inputs[4].value) * 1000;

    rowEle.children[5].innerHTML = (pipe.diameter_pressureDrop(length, pressureDrop) * 1000).toFixed(2);
    
    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    //输入框替换为文本，删除最后一列
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 5 && i > 0; j++) { 
            const cell = table.rows[i].cells[j];
            cell.innerHTML = cell.children[0].value;
        }

        table.rows[i].deleteCell(6);    
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    document.getElementById("report").href = downLoadLink(content);
});

window.YRunner.method ("property", function () {
    let rowEle = event.target.parentNode.parentNode;
    let selects = rowEle.getElementsByTagName("select");
    let fluidName = selects[0].value;
    
    let inputs = rowEle.getElementsByTagName("input");
    if (rowEle.children[11].innerHTML == "lock") {
        var currentValue = event.target.value;
        for (let k = 0; k < inputs.length; k++) {
            inputs[k].value = '';
            event.target.value = currentValue;
        }
        rowEle.children[11].innerHTML = '';
    }

    const keys = ["T", "P", "D", "H", "S", "U", "Q"]
    let keyId = [], vals = [];
    for (let i = 0; i < inputs.length; i++) {
        let val = parseFloat(inputs[i].value);
        if (!isNaN(val)) {
            keyId.push(i);
            if (keys[i] == "T") {
                val = val + 273.15;
            }
            else if (keys[i] == "P") {
                val = val * 1e6;
            }
            else if (["H", "S", "U"].indexOf(keys[i]) != -1) {
                val = val * 1e3;
            }
            vals.push(parseFloat(val));
        }
    }
    if (keyId.length < 2) {
        return;
    }
    let fluid = new Fluid(keys[keyId[0]], vals[0], keys[keyId[1]], vals[1], fluidName);

    for (let m = 0; m < inputs.length; m++) {
        if (keyId.indexOf(m) == -1) {
            switch (m) {
                case 0:
                    inputs[0].value = (fluid.getT() - 273.15).toFixed(2);
                    break;
                case 1:
                    inputs[1].value = (fluid.getP() / 1e6).toFixed(2);
                    break;
                case 2:
                    inputs[2].value = fluid.getDensity().toFixed(2);
                    break;
                case 3:
                    inputs[3].value =  (fluid.getEnthalpy() / 1e3).toFixed(2);
                    break;
                case 4:
                    inputs[4].value =  (fluid.getEntropy() / 1e3).toFixed(2);
                    break;
                case 5:
                    inputs[5].value =  (fluid.getInternalEnergy() / 1e3).toFixed(2);
                    break;
                case 6:
                    inputs[6].value = fluid.getQ().toFixed(2);
                    break;
                default:
                    break;
            }
        } 
    }

    rowEle.children[8].innerHTML = fluid.getViscosity().toFixed(8);
    rowEle.children[9].innerHTML = fluid.getZ().toFixed(2);
    rowEle.children[11].innerHTML = "lock";
    
    
    let table = rowEle.parentNode.parentNode.cloneNode(true);
    table.border = "1";
    //输入框替换为文本，删除最后一列
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < 8 && i > 0; j++) { 
            const cell = table.rows[i].cells[j];
            if (j == 0) {
                cell.innerHTML = cell.children[0].options[cell.children[0].selectedIndex].text;
            }
            else {
                cell.innerHTML = cell.children[0].value;
            }
            
        }
        table.rows[i].deleteCell(10);    
    }
    let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>` + table.outerHTML
        + "</body></html>";
    document.getElementById("report").href = downLoadLink(content);
});