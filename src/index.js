import {General} from "./util.js";
import {Template} from "./template.js";

const title = document.getElementById("title");
const contentContainer = document.getElementById("content");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");

document.getElementById("home").addEventListener("click", setupHomePage);
document.getElementById("create").addEventListener("click", setupCreatePage);
document.getElementById("preview").addEventListener("click", setupPreviewPage);


function setupHomePage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    title.textContent = "Home";
    leftContainer.appendChild(General.textElement("h3", "Home Page"));
}

function setupCreatePage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    title.textContent = "Create";
    leftContainer.appendChild(General.textElement("h3", "Create Page"));
    const templateFileInputElement = General.fileInputElement("");
    leftContainer.appendChild(templateFileInputElement);
    templateFileInputElement.onchange = function(event){
        const reader = new FileReader();
        reader.onload = function(){
            loadTemplate(reader.result.split("\n"));
        }
        reader.readAsText(templateFileInputElement.files[0]);
    }
}

function setupPreviewPage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    title.textContent = "Preview";
    leftContainer.appendChild(General.textElement("h3", "Preview Page"));
}

//function called as soon as the user selects a template file to use
//puts a bunch of text boxes and labels into the left container
//a preview in the right container
function loadTemplate(textContent){
    for(let i = 0; i < 2; i++){
    leftContainer.appendChild(General.lineBreak());}

    let template = new Template(textContent);
    let textBoxes = [];
    for(let i = 0; i < template.fields.length; i++){
        let textBox = General.textInputElement("");
        textBoxes.push(textBox);
        let textLabel = General.textElement("h4", template.fields[i]);
        leftContainer.appendChild(textLabel);
        leftContainer.appendChild(textBox);
        leftContainer.appendChild(General.lineBreak());
    }

}

setupHomePage();
