export class General{
    static getUpdateFunction(variable) {
        return (e) => {
            variable = e;
        }
    }

    //creates the overarching carousel div container
    static carouselContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel");
        container.classList.add("slide");
        container.setAttribute("data-bs-ride", "carousel");
        return container;
    }

    //creates the container for all the different carousel items
    static carouselItemContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel-inner");
        return container;
    }

    //creates the contents inside the carousel item
    //that includes the title, caption title, and the caption
    //alternatives can be used in order to further customize the carousel item
    static carouselItem(title, captionTitle, caption){
        let container = document.createElement("div");
        container.classList.add("carousel-item");
        container.appendChild(General.carouselItemTitle(title));
        container.appendChild(General.carouselItemCaption(captionTitle, caption));
        return container;
    }

    //creates the container for the title of the carousel item
    //this should also be where all the body of the silde is put, if necessary
    static carouselItemTitle(title){
        let container = document.createElement("div");
        container.classList.add("container");
        container.classList.add("border");
        let titleElement = document.createElement("h3");
        titleElement.textContent = title;
        titleElement.classList.add("text-center");
        container.appendChild(titleElement);
        container.style = "height: 500px; width: 800px; padding-top: 20px;";
        return container;
    }

    //creates the container for the caption of the carousel item
    //this is located near the bottom of the slide, right above the indicators
    static carouselItemCaption(captionTitle, caption){
        let container = document.createElement("div");
        container.classList.add("carousel-caption");
        container.classList.add("d-none");
        container.classList.add("d-md-block");
        container.style = "color: black;"
        container.append(General.textElement("h5", captionTitle));
        container.append(General.textElement("p", caption));
        return container;
    }

    //creates the container for the indicator elements
    static carouselIndicatorContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel-indicators");
        return container;
    }

    //creates the carousel indicator buttons
    static carouselIndicatorButton(carouselIndicatorContainerId, itemIndex){
        let button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-bs-target", "#" + carouselIndicatorContainerId);
        button.setAttribute("data-bs-slide-to", "" + itemIndex);
        return button;
    }

    //given a carousel container, adds the buttons on the side that allow the user to go to the previous or next slide
    static addCarouselControlButtons(carouselContainer){
        let previousButton = document.createElement("button");
        let nextButton = document.createElement("button");
        previousButton.classList.add("carousel-control-prev");
        previousButton.type = "button";
        previousButton.setAttribute("data-bs-target", "#" + carouselContainer.id);
        previousButton.setAttribute("data-bs-slide", "prev");

        nextButton.classList.add("carousel-control-next");
        nextButton.type = "button";
        nextButton.setAttribute("data-bs-target", "#" + carouselContainer.id);
        nextButton.setAttribute("data-bs-slide", "next");

        let previousButtonIcon = document.createElement("span");
        let nextButtonIcon = document.createElement("span");

        previousButtonIcon.classList.add("carousel-control-prev-icon");
        previousButtonIcon.setAttribute("aria-hidden", "true");

        nextButtonIcon.classList.add("carousel-control-next-icon");
        nextButtonIcon.setAttribute("aria-hidden", "true");

        previousButton.appendChild(previousButtonIcon);
        nextButton.appendChild(nextButtonIcon);

        carouselContainer.appendChild(previousButton);
        carouselContainer.appendChild(nextButton);
    }

    static lineBreak() { 
        return document.createElement("br");
    }

    static textElement(tag, text){
        let parent = document.createElement(tag);
        let textElement = document.createTextNode(text);
        parent.appendChild(textElement);
        return parent;
    }

    static clearElementById(id){
        var div = document.getElementById(id);
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }

    static clearElement(element){
        this.clearElementById(element.id);
    }

    static containerElement(classList){
        let container = document.createElement("div");
        classList.forEach(className => container.classList.add(className));
        return container;
    }

    static textInputElement(placeHolder){
        let input = document.createElement("input");
        input.classList.add("form-control");
        input.placeholder = placeHolder;
        return input;
    }

    static textAreaInputElement(placeHolder){
        let input = document.createElement("textarea");
        input.classList.add("form-control");
        input.placeHolder = placeHolder;
        input.style = "resize: none";
        return input;
    }

    static fileInputElement(placeHolder){
        let input = document.createElement("input");
        input.type = "file";
        input.placeholder = placeHolder;
        return input;
    }

    static textAreaElement(placeHolder){
        let textArea = document.createElement("textarea");
        textArea.classList.add("form-control");
        textArea.placeholder = placeHolder;
        textArea.rows = 30;
        return textArea;
    }

    static selectMenu(inputName, inputList){
        let selectMenu = document.createElement("select");
        selectMenu.classList.add("form-select");
        selectMenu.name = inputName;
        for(let i = 0; i < inputList.length; i++){
            let option = General.menuOption(inputList[i]);
            if(i === 0){
                option.selected = "selected";
            }
            selectMenu.appendChild(option);
        }
        return selectMenu;
    }

    static menuOption(value){
        let option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        return option;
    }

    static questionInputTypeSelectMenu(){
        return General.selectMenu("InputType", ["text", "textarea", "number", "array"]);
    }

    static formElement(){
        let form = document.createElement("form");
        return form;
    }

    static buttonElement(text){
        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-outline-primary");
        button.classList.add("my-2");
        button.classList.add("my-sm-0")
        button.textContent = text;
        button.style.marginTop="40px";
        return button;
    }

    static listElement(classList){
        let listElement = document.createElement("ul");
        classList.forEach(className => listElement.classList.add(className));
        return listElement;
    }

    static listItemElement(classList){
        let listItemElement = document.createElement("li");
        classList.forEach(className => listItemElement.classList.add(className));
        return this.listElement;
    }

    //returns the a new string modified to have no spaces
    static filterSpaces(string){
        let out = "";
        for(let i = 0; i < string.length; i++){
            if(string[i] === ' '){
                continue;
            }
            out += string[i];
        }
        return out;
    }

    static removeLeadingSpaces(string){
        let index = 0;
        for(let i = 0; i < string.length; i++){
            if(string.charAt(i) !== ' '){
                index = i;
                break;
            }
        }
        return string.substring(index);
    }

    //a: string
    //b: string
    //returns whether a and b are the same string
    static stringEquals(a, b){
        return a.valueOf() === b.valueOf();
    }

    static capitalize(string){
        const notCapitalizedList = ["to", "an", "is", "a", "the", "as", "so", "than", "but", "that", "for", "till", "if", "when", "nor", "yet", "once", "or"];
        string = string.trim();
        //always capitalize first word
        let endIndex = string.indexOf(" ");
        if(endIndex === -1){
            endIndex = string.length;
        }
        let out = string.substring(0, 1).toUpperCase() + string.substring(1, endIndex);
        
        let index = string.indexOf(" ") + 1;
        while(index !== 0){ 
            //while there are still other words left 
            let endIndex = string.indexOf(" ", index);
            if(endIndex === -1){
                //if there is no space left, the remaining string is the word
                endIndex = string.length;
            }

            //identify current word
            let currentWord = string.substring(index, endIndex);
            out += " ";
            if(notCapitalizedList.includes(currentWord)){
                out += currentWord;
            }
            else{//capitalize the current word and add it to the output string
                out += currentWord.substring(0, 1).toUpperCase() + currentWord.substring(1);
            }
            index = string.indexOf(" ", index) + 1;
        }
        return out;
    }

    //returns the next valid looking tag in the form of <[index]>
    //returns an empty string otherwise
    static getNextStartingTag(text, index){
        let startIndex = text.indexOf("<", index);
        let endIndex = text.indexOf(">", startIndex);
        if(startIndex === -1 || endIndex === -1){
            return "";
        }
        let tagContent = text.substring(startIndex + 1, endIndex);
        if(tagContent.indexOf(" ") === -1){
            return text.substring(startIndex, endIndex + 1);
        }
        return "";
    }

    //returns the next valid looking tag in the form of </[index]>
    //returns an empty string otherwise
    static getNextClosingTag(text, index){
        let startIndex = text.indexOf("</", index);
        let endIndex = text.indexOf(">", startIndex);
        if(startIndex === -1 || endIndex === -1){
            return "";
        }
        let tagContent = text.substring(startIndex + 1, endIndex);
        if(tagContent.indexOf(" ") === -1){
            return text.substring(startIndex, endIndex + 1);
        }
        return "";
    }

    //creates and returns an html table from the given text
    //returns null if the table is not valid
    static createTable(text){
        // let parser = new DOMParser();
        // let doc = parser.parseFromString(text, "text/xml");
        // doc.firstChild.classList.add("table");
        // return doc.firstChild;
        //let the code below be a reminder to search for existing functions that can do what you want instead of charging head first into a problem
        let tableStartTagIndex = text.indexOf("<table>");
        let tableEndTagIndex = text.indexOf("</table>");
        if(tableStartTagIndex === -1 || tableEndTagIndex === -1 || tableEndTagIndex < tableStartTagIndex){
            return null;
        }
        text = text.substring(tableStartTagIndex + 7, tableEndTagIndex);
        let table = document.createElement("table");
        let currentStartingTag;
        let index = 0;
        while(!General.stringEquals(General.getNextStartingTag(text, index), "")){
            currentStartingTag = General.getNextStartingTag(text, index);
            let tagName = currentStartingTag.substring(1, currentStartingTag.length - 1);
            tagName = tagName.toLowerCase();
            if(!General.stringEquals("tr", tagName)){
                return null;
            }
            index += currentStartingTag.length;
            let closingTagIndex = text.indexOf("</" + tagName + ">", index);

            if(closingTagIndex === -1){
                return null;
            }
            let tableRow = document.createElement(tagName);
            let rowContent = text.substring(index, closingTagIndex);
            let rowContentIndex = 0;

            while(!General.stringEquals(General.getNextStartingTag(rowContent, rowContentIndex), "")){
                let columnStartingTag = General.getNextStartingTag(rowContent, rowContentIndex);
                let columnTagName = columnStartingTag.substring(1, columnStartingTag.length - 1);

                rowContentIndex = rowContent.indexOf("<" + columnTagName + ">", rowContentIndex) + columnTagName.length + 2;
                let columnClosingTagIndex = rowContent.indexOf("</" + columnTagName + ">", rowContentIndex);
                if(columnClosingTagIndex === -1){
                    break;
                }

                let columnContent = rowContent.substring(rowContentIndex, columnClosingTagIndex);

                let columnElement = document.createElement(columnTagName);
                columnElement.textContent = columnContent;
                tableRow.appendChild(columnElement);
                rowContentIndex = columnClosingTagIndex + columnTagName.length + 3;
            }
            
            index = closingTagIndex + tagName.length + 3;
            table.appendChild(tableRow);
            table.classList.add("table");
            
        }
        return table;

    }

    //text: string
    //index: integer, the index to start searching at
    //paren: char, the opening bracket/brace/parentheses you are trying to find the matching closnig one for
    //returns index of the matching closing character
    //returns -1 if nothing is found
    static findMatchingClosingParen(text, index, paren){
        let closing = '}';
        if(paren === '('){
            closing = ')';
        }
        else if(paren === '['){
            closing = ']';
        }

        let openingCount = 0;
        for(let i = index; i < text.length; i++){
            if(text.charAt(i) === paren){
                openingCount++;
            }
            else if(text.charAt(i) === closing){
                if(openingCount === 0){
                    //if no other opening parens have been found
                    //  this index is the right one
                    return i;
                }
                else{
                    //if there have been others found,
                    //  this index is the closing paren for one of the previous opening parens
                    openingCount--;
                }
            }
        }
        return -1;
    }

    static download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
}

export class Carousel{
    //titles: list of strings
    //captionsTitles: list of strings
    //captions: list of strings
    //All lists should be the same length
    constructor(titles, captionTitles, captions){
        this.titles = titles;
        this.captionTitles = captionTitles;
        this.captions = captions;
    }

    makeCarousel(id){
        let carouselLength = Math.min(this.titles.length, Math.min(this.captionTitles.length, this.captions.length));
        if(carouselLength < 1){
            return document.createElement("div");
        }
        let carouselContainer = General.carouselContainer();
        carouselContainer.id = id;
        let indicatorContainer = General.carouselIndicatorContainer();
        
        indicatorContainer.id = "indicator-container";
        let firstIndicator = General.carouselIndicatorButton(id, 0);
        firstIndicator.classList.add("active");
        indicatorContainer.appendChild(firstIndicator);
        for(let i = 1; i < carouselLength; i++){
            indicatorContainer.appendChild(General.carouselIndicatorButton(id, i));
        }
        let carouselItemContainer = General.carouselItemContainer();
        let firstItem = General.carouselItem(this.titles[0], this.captionTitles[0], this.captions[0]);
        firstItem.classList.add("active");
        carouselItemContainer.appendChild(firstItem);
        for(let i = 1; i < carouselLength; i++){
            carouselItemContainer.appendChild(General.carouselItem(this.titles[i], this.captionTitles[i], this.captions[i]));
        }
        carouselContainer.appendChild(indicatorContainer);
        carouselContainer.appendChild(carouselItemContainer);
        General.addCarouselControlButtons(carouselContainer);
        return carouselContainer;
    }

    //returns a container containg a carousel, made with the given carousel slides
    //id: string
    //slides: list of carouselSlides
    //
    static makeCarouselFromCarouselSlides(id, slides, itemEventListeners){
        let carouselLength = slides.length;
        if(carouselLength < 1){
            let out = document.createElement("div");
            out.id = id;
            return out;
        }

        let carouselContainer = General.carouselContainer();
        carouselContainer.id = id;
        let indicatorContainer = General.carouselIndicatorContainer();
        indicatorContainer.id = "indicator-container";

        let firstIndicator = General.carouselIndicatorButton(id, 0);
        firstIndicator.classList.add("active");
        indicatorContainer.appendChild(firstIndicator);
        for(let i = 1; i < carouselLength; i++){
            indicatorContainer.appendChild(General.carouselIndicatorButton(id, i));
        }

        let carouselItemContainer = General.carouselItemContainer();
        
        for(let i = 0; i < slides.length; i++){
            let itemContainer = document.createElement("div");
            itemContainer.addEventListener("dblclick", itemEventListeners[i]);
            itemContainer.classList.add("carousel-item");
            let titleContainer = General.carouselItemTitle(slides[i].title);
            titleContainer.appendChild(General.lineBreak());
            for(let x = 0; x < slides[i].body.length; x++){
                let text = General.textElement("p", slides[i].body[x]);
                text.style = "margin-left: 50px";
                titleContainer.appendChild(text);
            }
            itemContainer.appendChild(titleContainer);
            itemContainer.appendChild(General.carouselItemCaption(slides[i].caption, ""));
            carouselItemContainer.appendChild(itemContainer);
            if(i === 0){
                itemContainer.classList.add("active");
            }
        }
        carouselContainer.appendChild(indicatorContainer);
        carouselContainer.appendChild(carouselItemContainer);
        General.addCarouselControlButtons(carouselContainer);
        return carouselContainer;


    }
}

export class CarouselSlide{

    //title: string
    //body: list of strings
    //caption: string
    constructor(title, body, caption){
        this.title = title;
        this.body = body;
        this.caption = caption;
    }
}