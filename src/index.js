/* eslint-disable */

import {Carousel, General} from "./util.js";
import {FieldInformation, Template, TemplateBody} from "./template.js";

const title = document.getElementById("title");
const contentContainer = document.getElementById("content-container");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");
const rowContainer = document.getElementById("row-container");

document.getElementById("home").addEventListener("click", setupHomePage);
document.getElementById("create").addEventListener("click", setupCreatePage);
document.getElementById("preview").addEventListener("click", setupPreviewPage);


function setupHomePage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    let configFileInputElement = General.fileInputElement("");
    
    contentContainer.removeChild(rowContainer);
    contentContainer.appendChild(General.textElement("h3", "Home Page"));
    contentContainer.appendChild(configFileInputElement);
    contentContainer.appendChild(rowContainer);

    configFileInputElement.onchange = function(event){
        const reader = new FileReader();
        reader.onload = function(){
            setupTemplateList(JSON.parse(reader.result));
        }
        reader.readAsText(configFileInputElement.files[0]);
        configFile = configFileInputElement.files[0];
    }

    title.textContent = "Home";
    
}

function setupCreatePage(template){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    title.textContent = "Create";
    leftContainer.appendChild(General.textElement("h3", "Create Page"));
    loadTemplate(template);
}

function setupPreviewPage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    title.textContent = "Preview";
    leftContainer.appendChild(General.textElement("h3", "Preview Page"));
}

//function called as soon as the user selects a template file to use
//puts a bunch of text boxes and labels into the left container
//a preview in the right container
function loadTemplate1(textContent){
    for(let i = 0; i < 2; i++){
    leftContainer.appendChild(General.lineBreak());}

    let template = new TemplateBody(textContent);
    let textBoxes = [];
    for(let i = 0; i < template.fields.length; i++){
        let textBox = General.textInputElement("");
        textBoxes.push(textBox);
        let textLabel = General.textElement("h4", template.fields[i]);
        leftContainer.appendChild(textLabel);
        leftContainer.appendChild(textBox);
        leftContainer.appendChild(General.lineBreak());
    }

    let subjectLine = template.template[0];
    rightContainer.appendChild(General.textElement("h4", subjectLine));
    for(let i = 1; i < template.template.length; i++){
        let line = textContent[i];
        rightContainer.appendChild(General.textElement("p", line));
    }
}

function setupTemplateList(configFileObject){
    console.log(configFileObject);
    let templateList = configFileObject.templates;

    for(let i = 0; i < templateList.length; i++){
        let template = templateList[i];
        let templateTextElement = General.buttonElement(template.title);
        templateTextElement.addEventListener("click", function(){
            console.log("Clicked");
            setupCreatePage(template);
        }); 
        contentContainer.appendChild(templateTextElement);

        
    }
}


//template: an object of class Template
function loadTemplate(template){
    for(let i = 0; i < 2; i++){
        leftContainer.appendChild(General.lineBreak());
    }

    let questionInputElements = [];
    let questions = template.questions;
    for(let i = 0; i < questions.length; i++){
        let question = questions[i];
        let label = General.textElement("h4", question.question);
        let questionInputElement = General.textInputElement("");
        if(question.inputType.valueOf() == "textarea".valueOf()){
            questionInputElement = General.textAreaInputElement("");
        }
        questionInputElements.push(questionInputElement);
        leftContainer.appendChild(label);
        leftContainer.appendChild(questionInputElement);
        leftContainer.appendChild(General.lineBreak());
    }

}

function cleanContentContainer(){
    General.clearElementById("content-container");
    contentContainer.appendChild(rowContainer);
}

setupHomePage();
