/* eslint-disable */

/*
There are three pages:

Home Page:
    Choose a config file that contains the data for the different templates
    Displays those templates
    Double click a template to begin filling in and writing the email
        This takes you to the write page

Write Page:
    Fill in variables to write the email
    Live display is on the right
    Can only be accessed through double clicking a template that is displayed on the home page

Create Page:
    Create a template
    Add and write questions to use to fill out an email
    Give the email a 
        subject, 
        description (for user only, doesn't show on the actual email), and 
        body (the email's content)
    
    Select a config file to add the template to
    Or create a new config file

    Download the new modified or created config file
*/

//TODO: change array inputs to not remove spaces in answers


import {Carousel, CarouselSlide, General} from "./util.js";
import {Question, Template, TemplateBody} from "./template.js";

const title = document.getElementById("title");
const contentContainer = document.getElementById("content-container");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");
const rowContainer = document.getElementById("row-container");
var configFileTextContent = null;
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

    configFileInputElement.onchange = function(){
        cleanContentContainer();
        contentContainer.removeChild(rowContainer);
        contentContainer.appendChild(General.textElement("h3", "Home Page"));
        contentContainer.appendChild(configFileInputElement);
        contentContainer.appendChild(rowContainer);

        const reader = new FileReader();
        reader.onload = function(){
            configFileTextContent = reader.result;
            setupTemplateList(JSON.parse(reader.result));
        }
        reader.readAsText(configFileInputElement.files[0]);
    }
}

//sets up the fields for the right side of the create page
//includes the subject field, description field, email body field
//the file input field for adding onto a list of templates, and the write button
function setupRightSideCreatePage(subjectField, descriptionField, bodyField, fileInputElement, writeButton){
    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Subject"));
    rightContainer.appendChild(subjectField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Description"));
    rightContainer.appendChild(descriptionField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h4", "Email Body"));
    rightContainer.appendChild(bodyField);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.textElement("h5", "Select Existing Template List"));
    rightContainer.appendChild(fileInputElement);

    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(writeButton);
    rightContainer.appendChild(General.lineBreak());
    rightContainer.appendChild(General.lineBreak());
}

function setupCreatePage(){
    questionIndex = 1;
    let questionFormContainers = [];
    let subjectField = General.textInputElement("Subject");
    let descriptionField = General.textInputElement("Description");
    let bodyField = General.textAreaElement("Email Body");
    let container = createQuestionSet(questionIndex);
    let fileInputElement = General.fileInputElement();
    let writeButton = General.buttonElement("Write");
    let addQuestionButton = General.buttonElement("Add Another Question");

    //changes the tab key behavior in the text area field to tab, instead of switching between elements
    bodyField.addEventListener("keydown", (e) => {
        if(e.key === 'Tab'){
            e.preventDefault();
            var start = bodyField.selectionStart;
            var end = bodyField.selectionEnd;
        
            bodyField.value = bodyField.value.substring(0, start) +
              "\t" + bodyField.value.substring(end);
        
            bodyField.selectionStart =
              bodyField.selectionEnd = start + 1;
        }
        console.log("In the event listener");
    });

    addQuestionButton.onclick = function(){
        let newContainer = createQuestionSet(questionIndex);
        newContainer.appendChild(General.lineBreak());
        questionIndex++;

        leftContainer.removeChild(addQuestionButton);
        questionFormContainers.push(newContainer);
        leftContainer.appendChild(newContainer)
        leftContainer.appendChild(addQuestionButton);

        addQuestionButton.scrollIntoView();
    };

    writeButton.onclick = function(){
        let questions = [];
        let title = subjectField.value;
        let desc = descriptionField.value;
        let body = bodyField.value;
        let template = new Template(1, title, desc, questions, body);
        for(let i = 0; i < questionFormContainers.length; i++){
            let question = extractQuestionFromQuestionSetContainer(questionFormContainers[i]);
            question.sortOrder = i + 1;
            questions.push(question);
        }

        if(fileInputElement.files.length < 1){
            let obj = {};
            obj.templates = [];
            obj.templates.push(template);
            General.download("config.txt", JSON.stringify(obj));
            return;
        }

        const reader = new FileReader();
        reader.onload = function(){
            let textContent = reader.result;
            let templateList = JSON.parse(textContent).templates;
            let length = templateList.length;
            template.id = length + 1;
            templateList.push(template);
            let obj = {};
            obj.templates = templateList;
            configFileTextContent = JSON.stringify(obj);
            General.download("config.txt", JSON.stringify(obj));
        }
        reader.readAsText(fileInputElement.files[0]);
    }
    questionIndex = 2;
    questionFormContainers.push(container);

    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();

    contentContainer.removeChild(rowContainer);
    contentContainer.appendChild(General.textElement("h3", "Create Page"));
    contentContainer.appendChild(rowContainer);

    setupRightSideCreatePage(subjectField, descriptionField, bodyField, fileInputElement, writeButton);
    leftContainer.appendChild(container);
    leftContainer.appendChild(addQuestionButton);
}

//creates a container containg input fields to represent a question object
function createQuestionSet(index){
    let container = General.containerElement([]);
    let titleContainer = document.createElement("div");
    let titleLabel = General.textElement("h4", "Question " + index);
    let removeButton = General.buttonElement("Remove Question");

    removeButton.onclick = function(){
        leftContainer.removeChild(container);
    }
    
    titleLabel.classList.add("col-8");
    removeButton.classList.add("col-3");
    removeButton.style = "margin-left: 5px";
    
    titleContainer.classList.add("row");
    titleContainer.appendChild(titleLabel);
    titleContainer.appendChild(removeButton);
    container.appendChild(titleContainer);

    container.appendChild(General.textElement("h6", "Variable Name"));
    container.appendChild(General.textInputElement("Variable Name"));
    container.appendChild(General.lineBreak());

    container.appendChild(General.textElement("h6", "Question"));
    container.appendChild(General.textInputElement("Question"));
    container.appendChild(General.lineBreak());

    container.appendChild(General.textElement("h6", "Input Type"));
    container.appendChild(General.questionInputTypeSelectMenu());
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
        }
        else if(General.stringEquals(child.nodeName, "SELECT")){
            inputType = child.value;
        }
    }
    return new Question(id, sortOrder, question, inputType);
}

//Called when the user double clicks one of the slides in the carousel
//calls other functions to help set up the write page
function setupWritePage(template){
    General.clearElementById("left-container");
    General.clearElementById("right-container");
    cleanContentContainer();
    leftContainer.appendChild(General.textElement("h3", "Write Page"));
    title.textContent = "Write";
    
    loadTemplate(template);
}

//creates the carousel to display the templates in the config file
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
//sets up the write page to allow the user to write the email
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
//called anytime the user updates any of the variable values to the left of the preview
function writePreview(emailBody, title){ 
    General.clearElementById("right-container");
    rightContainer.appendChild(General.textElement("h3", title));
    let sections = [];
    let emailLines = emailBody.split("\n");
    for(let i = 0; i < emailLines.length; i++){
        rightContainer.appendChild(General.textElement("p", emailLines[i]));
    }
    
    //need to create a table in a way that mimics html code
    let index = 0;
    while(emailBody.indexOf("<table>", index) !== -1){
        
    }
    //puts the last section of the email into the list
    sections.push(emailBody.substring(index));

    //the structure of the sections list should be:
    /*
    even indices: normal email text
    odd indices: table content
    */





}

//clears the screen of all content
//except for the top bar
function cleanContentContainer(){
    General.clearElementById("content-container");
    contentContainer.appendChild(rowContainer);
}

setupHomePage();
// let table = "<table>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n<tr>\n<td>4</td>\n<td>5</td>\n<td>6</td>\n</tr>\n</table>";
// rowContainer.appendChild(General.createTable("<table>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n<tr>\n<td>4</td>\n<td>5</td>\n<td>6</td>\n</tr>\n</table>"));
// contentContainer.appendChild(General.createTable("<table><tr><td>Something</td><td>Else</td><td>IS here</td></tr><tr><td>This second row</td><td>is</td><td>Useless</td></tr></table>"));