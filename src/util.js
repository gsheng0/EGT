export class General{
    static getUpdateFunction(variable) {
        return (e) => {
            variable = e;
        }
    }

    static carouselContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel");
        container.classList.add("slide");
        container.setAttribute("data-bs-ride", "carousel");
        return container;
    }

    static carouselItemContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel-inner");
        return container;
    }

    static carouselItem(title, captionTitle, caption){
        let container = document.createElement("div");
        container.classList.add("carousel-item");
        let randomText = General.textElement("h5", "Random text");
        randomText.classList.add("d-block");
        randomText.classList.add("w-100");
        container.appendChild(randomText);
        container.appendChild(General.carouselItemTitle(title));
        container.appendChild(General.carouselItemCaption(captionTitle, caption));
        return container;
    }

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

    static carouselIndicatorContainer(){
        let container = document.createElement("div");
        container.classList.add("carousel-indicators");
        return container;
    }

    static carouselIndicatorButton(carouselIndicatorContainerId, itemIndex){
        let button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-bs-target", "#" + carouselIndicatorContainerId);
        button.setAttribute("data-bs-slide-to", "" + itemIndex);
        return button;
    }

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
        input.value = placeHolder;
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

    static formElement(){
        let form = document.createElement("form");
        return form;
    }

    static buttonElement(text){
        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-outline-success");
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
        while(index !== 0){ //while there are still other words left 
            let endIndex = string.indexOf(" ", index);
            if(endIndex === -1){
                endIndex = string.length;
            }
            let currentWord = string.substring(index, endIndex);
            out += " ";
            if(notCapitalizedList.includes(currentWord)){
                out += currentWord;
            }
            else{
                out += currentWord.substring(0, 1).toUpperCase() + currentWord.substring(1);
            }
            index = string.indexOf(" ", index) + 1;
        }
        return out;
    }

    static download(data, filename) {
        let type = "text/plain";
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
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
}