/* eslint-disable */

import {Carousel, CarouselSlide, General} from "./util.js";
import {Question, Template, TemplateBody} from "./template.js";

const title = document.getElementById("title");
const contentContainer = document.getElementById("content-container");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");
const rowContainer = document.getElementById("row-container");
var configFileTextContent = null;
var configFile = null;
var questionIndex = 1;

document.getElementById("home").addEventListener("click", setupHomePage);
document.getElementById("create").addEventListener("click", setupCreatePage);

function setupHomePage(){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    let configFileInputElement = General.fileInputElement("");
    
    contentContainer.removeChild(rowContainer);
    contentContainer.appendChild(General.textElement("h3", "Home Page"));
    contentContainer.appendChild(configFileInputElement);
    contentContainer.appendChild(rowContainer);
    title.textContent = "Home";

    if(configFileTextContent !== null){
        setupTemplateList(JSON.parse(configFileTextContent));
        return;
    }

    configFileInputElement.onchange = function(event){
        const reader = new FileReader();
        reader.onload = function(){
            configFileTextContent = reader.result;
            console.log("file content: " + configFileTextContent);
            setupTemplateList(JSON.parse(reader.result));
        }
        configFile = configFileInputElement.files[0];
        reader.readAsText(configFileInputElement.files[0]);
    }

    
}
/*
if(configFile !== null){
    const reader = new FileReader();
    reader.onload = function(){
        console.log(reader.result);
    }
    reader.readAsText(configFile);
}*/


function setupRightSideCreatePage(titleField, descriptionField, bodyField, fileInputElement, writeButton){
    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Title"));
    rightContainer.appendChild(titleField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Description"));
    rightContainer.appendChild(descriptionField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Email Body"));
    rightContainer.appendChild(bodyField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h5", "Select File to Write To"));
    rightContainer.appendChild(fileInputElement);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(writeButton);
}

function setupCreatePage(){
    let containers = [];
    let titleField = General.textInputElement("Title");
    let descriptionField = General.textInputElement("Description");
    let bodyField = General.textAreaElement("Email Body");
    let container = createQuestionSet(questionIndex);
    let button = General.buttonElement("Button");
    let fileInputElement = General.fileInputElement();
    let writeButton = General.buttonElement("Write to File");
    let addQuestionButton = General.buttonElement("Add Another Question");

    addQuestionButton.onclick = function(event){
        leftContainer.removeChild(addQuestionButton);
        leftContainer.appendChild(General.lineBreak());
        let newContainer = createQuestionSet(questionIndex);
        containers.push(newContainer);
        leftContainer.appendChild(newContainer)
        questionIndex++;
        leftContainer.appendChild(addQuestionButton);
        addQuestionButton.scrollIntoView();
    };

    button.onclick = function(event){
        console.log(containers.length);
        console.log(containers);
        console.log(extractQuestionFromQuestionSetContainer(containers[0]));
    }

    writeButton.onclick = function(event){
        let questions = [];
        for(let i = 0; i < containers.length; i++){
            let question = extractQuestionFromQuestionSetContainer(containers[i]);
            question.sortOrder = i + 1;
            console.log(question);
            questions.push(question);
        }

        let title = titleField.value;
        let desc = descriptionField.value;
        let template = new Template()
    }
    questionIndex = 2;
    containers.push(container);

    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();

    contentContainer.removeChild(rowContainer);
    contentContainer.appendChild(General.textElement("h3", "Create Page"));
    contentContainer.appendChild(button);
    contentContainer.appendChild(rowContainer);

    setupRightSideCreatePage(titleField, descriptionField, bodyField, fileInputElement, writeButton);
    leftContainer.appendChild(container);
    leftContainer.appendChild(addQuestionButton);
}

//creates a container containg input fields to represent a question object
function createQuestionSet(index){
    let container = General.containerElement([]);
    container.appendChild(General.textElement("h4", "Question " + index));

    container.appendChild(General.textElement("h6", "Variable Name"));
    container.appendChild(General.textInputElement("Variable Name"));
    container.appendChild(General.lineBreak());

    container.appendChild(General.textElement("h6", "Question"));
    container.appendChild(General.textInputElement("Question"));
    container.appendChild(General.lineBreak());

    container.appendChild(General.textElement("h6", "Input Type"));
    container.appendChild(General.textInputElement("Input Type"));
    container.appendChild(General.lineBreak());

    return container;
}

//creates a question object using the information given from a container
//container is in the format used by createQuestionSet() function
function extractQuestionFromQuestionSetContainer(container, sortOrder){
    var id, question, inputType;
    for(let i = 0; i < container.childNodes.length; i++){
        let child = container.childNodes[i];
        if(General.stringEquals(child.nodeName, "INPUT")){
            let name = child.placeholder;
            if(General.stringEquals("Variable Name", name)){
                id = child.value;
            }
            else if(General.stringEquals("Question", name)){
                question = child.value;
            }
            else if(General.stringEquals("Input Type", name)){
                inputType = child.value;
            }
            
        }
    }
    return new Question(id, sortOrder, question, inputType);
}

function setupWritePage(template){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    leftContainer.appendChild(General.textElement("h3", "Write Page"));
    title.textContent = "Create";
    
    loadTemplate(template);
}


function setupTemplateList(configFileObject){
    let templateList = configFileObject.templates;
    let slides = [];
    let eventListeners = [];
    for(let i = 0; i < templateList.length; i++){
        let obj = templateList[i];
        eventListeners.push(function(){
            let template = new Template(obj.id, obj.title, obj.desc, obj.questions, new TemplateBody(obj.body.split("\n")))
            setupWritePage(template);
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

    let emailBody = "";
    for(let i = 0; i < emailLines.length; i++){
        emailBody += emailLines[i];
        emailBody += "\n";
        rightContainer.appendChild(General.textElement("p", emailLines[i]));
    }
    //need to create a table in a way that mimics html code
    let tableStartTagIndex;
    let index = 0;
    let tables = [];
    while((tableStartTagIndex = emailBody.indexOf("<table>", index)) !== -1){
        let tableCloseTagIndex = emailBody.indexOf("</table>", tableStartTagIndex);
        if(tableCloseTagIndex === -1){
            break;
        }
        tables.push(General.createTable(emailBody.substring(tableStartTagIndex, emailBody.indexOf(">", tableCloseTagIndex) + 1)));
    }



}

function cleanContentContainer(){
    General.clearElementById("content-container");
    contentContainer.appendChild(rowContainer);
}

setupHomePage();
// let table = "<table>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n<tr>\n<td>4</td>\n<td>5</td>\n<td>6</td>\n</tr>\n</table>";
// rowContainer.appendChild(General.createTable("<table>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n<tr>\n<td>4</td>\n<td>5</td>\n<td>6</td>\n</tr>\n</table>"));
// contentContainer.appendChild(General.createTable("<table><tr><td>Something</td><td>Else</td><td>IS here</td></tr><tr><td>This second row</td><td>is</td><td>Useless</td></tr></table>"));