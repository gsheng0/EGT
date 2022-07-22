/* eslint-disable */

import {Carousel, CarouselSlide, General} from "./util.js";
import {Question, Template, TemplateBody} from "./template.js";

const title = document.getElementById("title");
const contentContainer = document.getElementById("content-container");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");
const rowContainer = document.getElementById("row-container");

document.getElementById("home").addEventListener("click", setupHomePage);

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

function setupTemplateList(configFileObject){
    let templateList = configFileObject.templates;
    let slides = [];
    let eventListeners = [];
    for(let i = 0; i < templateList.length; i++){
        let obj = templateList[i];
        eventListeners.push(function(){
            let template = new Template(obj.id, obj.title, obj.desc, obj.questions, new TemplateBody(obj.body.split("\n")))
            setupCreatePage(template);
        }); 
        let questions = [];
        for(let i = 0; i < obj.questions.length; i++){
            questions.push(obj.questions[i].question);
        }
        let slide = new CarouselSlide(obj.title, questions, obj.desc);
        slides.push(slide);
    }

    contentContainer.appendChild(Carousel.makeCarouselFromCarouselSlides("carousel-container", slides, eventListeners));
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
        let questionInputElement = General.textInputElement(question.id);
        if(question.inputType.valueOf() == "textarea".valueOf()){
            questionInputElement = General.textAreaInputElement(question.id);
        }
        
        questionInputElements.push(questionInputElement);
        leftContainer.appendChild(label);
        leftContainer.appendChild(questionInputElement);
        leftContainer.appendChild(General.lineBreak());
    }

    for(let i = 0; i < questionInputElements.length; i++){
        let element = questionInputElements[i];
        element.onchange = function(event){
            let replacements = [];
            for(let x = 0; x < questionInputElements.length; x++){
                replacements.push(questionInputElements[x].value);
            }
            writePreview(template.body.fillInTemplate(replacements, template.questions), template.title);
        };
    }
    writePreview(template.body.fillInTemplate([], template.questions), template.title);
}

//title: string; title of the email
//emailLines: list of strings
//first line should be the subject line
//clears the right container and adds the writes the given email into the right container
function writePreview(emailLines, title){
    General.clearElementById("right-container");
    rightContainer.appendChild(General.textElement("h3", title));
    for(let i = 0; i < emailLines.length; i++){
        rightContainer.appendChild(General.textElement("p", emailLines[i]));
    }
    let emailBody = "";
    for(let i = 0; i < emailLines.length; i++){
        emailBody += emailLines[i];
    }

    let copyButton = General.buttonElement("Copy Email");
    copyButton.addEventListener("click", function(){
        let textInput = General.textInputElement(emailBody);
        textInput.select();
        textInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textInput.value);
        alert("Copied Text: " + textInput.value);
    });
    rightContainer.appendChild(copyButton);

}

function cleanContentContainer(){
    General.clearElementById("content-container");
    contentContainer.appendChild(rowContainer);
}

setupHomePage();
