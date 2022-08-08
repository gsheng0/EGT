import {General} from "./util.js";

export class Question{
    //id: Field Id/name - represents the name of the variable
    //sortOrder: integer
    //question: the string containing the question to be used to prompt the user
    //inputType: string of values of either:
    //text, textarea, number, or array
    constructor(id, sortOrder, question, inputType){
        this.id = id;
        this.sortOrder = sortOrder;
        this.question = question;
        this.inputType = inputType; 
    }

}


export class Template{

    //id: Template id (string)
    //title: Template title (string)
    //desc: Template description (string)
    //questions: List of FieldInformation representing different fields of the template
    //body: A TemplateBody representing the body of the email
    //  contains information on where the fields should go within the email itself and contains the static elements of the email to be generated
    constructor(id, title, desc, questions, body){
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.questions = questions;
        this.body = body;
    }
}

export class TemplateBody{
    //template: list of strings representing the email
    //  first line is the subject
    //fields: list of strings representing the fields that can be filled out for the email

    constructor(template){
        this.template = template;
        this.nameEndingCharacters = ["!", ",", ".", " ", ";", "]", "}"];
        this.fields = this.getFieldsFromTemplate(template);
        
    }

    //line: a string representing one line of the template
    //index: the index to start the search from
    //returns the name of the next field, if it exsts
    //  returns an empty string otherwise
    getNameOfNextField(line, index){
        let dollarSignIndex = line.indexOf("$", index);
        if(dollarSignIndex === -1){
            return "";
        }
        let earliest = 100000000;
        for(let i = 0; i < this.nameEndingCharacters.length; i++){
            let index1 = line.indexOf(this.nameEndingCharacters[i], dollarSignIndex);
            if(index1 === -1){
                continue;
            }
            earliest = Math.min(earliest, index1);
        }
        if(earliest === 100000000){
            return line.substring(dollarSignIndex + 1);
        }
        return line.substring(dollarSignIndex + 1, earliest);
    }

    //template: the list of strings received in the constructor that represents the email
    //returns the list of fields detected in the email template
    getFieldsFromTemplate(template){
        let fields = [];
        for(let i = 0; i < template.length; i++){
            let fieldsFromLine = this.getFieldsFromLine(template[i]);
            for(let x = 0; x < fieldsFromLine.length; x++){
                if(!fields.includes(fieldsFromLine[x])){ //checks to see if the field already exists in the list
                    fields.push(fieldsFromLine[x]);
                }
            }
        }
        console.log("fields: " + fields);
        return fields;
    }
    
    //line: a string
    //returns a list of fields within the string, where a field is of the format {field_name}
    getFieldsFromLine(line){
        let index = 0;
        let fields = [];
        while(true){ 
            let word = this.getNameOfNextField(line, index);
            if(word.valueOf() === "".valueOf()){
                break;
            }
            if(!fields.includes(word)){
                fields.push(word);
            }
            index += word.length + 2;
        }
        return fields;
    }

    //replacements: list of strings, same length as "fields"
    //questions: list of the questions in the template
    //replaces the text fields in the text
    fillInTextFields(bodyText, replacements, questions){
         for(let i = 0; i < Math.min(replacements.length, questions.length); i++){
             let inputType = questions[i].inputType;
             if(General.stringEquals(replacements[i], "")){
                 continue;
             }
             if(General.stringEquals(inputType, "array")){
                 //need to split answer by commas
                 let arr = General.filterSpaces(replacements[i]).split(",");
                 let count = 0;
                 while(bodyText.indexOf("$" + questions[i].id) !== -1){
                    bodyText = bodyText.replace("$" + questions[i].id, arr[count]);
                    count++;
                    if(count >= arr.length){
                        count = 0;
                    }
                 }
             }
             else if(General.stringEquals(inputType, "number")){
                let out = parseInt(General.filterSpaces(replacements[i]));
                if(isNaN(out)){
                    out = "";
                }

                bodyText = bodyText.replaceAll("$" + questions[i].id, out);
             }
             else{
                bodyText = bodyText.replaceAll("$" + questions[i].id, replacements[i]);
             }
         }
         return bodyText;
    }

    //bodyText: The text of the email
    //replacements: list of strings, same length as "fields"
    //questions: list of the questions in the template
    //multiplies out repeated sections of the email
    //if any exist
    //un-nests one level of any nested repeats
    parseRepeats(bodyText, replacements, questions){
        //if there are no repeat sections, break
        if(bodyText.indexOf("{") === -1){
            return this.fillInTextFields(bodyText, replacements, questions);
        }

        let index = 0;
        while(bodyText.indexOf("{", index) !== -1){
            let leftBraceIndex = bodyText.indexOf("{", index);
            let rightBraceIndex = General.findMatchingClosingParen(bodyText, leftBraceIndex + 1, '{');

            index = rightBraceIndex + 1;
            if(rightBraceIndex === -1){//no more repeat segments left
                break;
            }
            //find the segment of text that is to be repeated
            let repeatText = bodyText.substring(leftBraceIndex + 1, rightBraceIndex);

            //finding the repeat number within the repeated text
            //syntax for repeat number, assuming repeatText is in the following format:
            //{repeatText} is: 
            //[$someVar]
            //repeated text syntax should look like
            //{[$someVar] actualRepeatedText}
            let leftBracketIndex = repeatText.indexOf("[");
            let rightBracketIndex = repeatText.indexOf("]");

            //default repeat count is 1
            let repeatCount = 1;

            //if repeat counter exists
            if(leftBracketIndex !== -1 && rightBracketIndex !== -1 && leftBracketIndex < rightBracketIndex){
                let field = this.getNameOfNextField(repeatText.substring(leftBracketIndex, rightBracketIndex), 0);
                if(General.stringEquals("", field)){ //the repeat number is not a variable filled in by the user
                    //setting repeat count to whatever number exists in between the two brackets
                    repeatCount = parseInt(repeatText.substring(leftBracketIndex, rightBracketIndex));
                }
                else{ //if the repeatNumber is a variable that is filled in by the user
                    let indexOfField = -1;
                    //finding the index of the field name
                    for(let i = 0; i < questions.length; i++){
                        if(General.stringEquals(field, questions[i].id)){
                            indexOfField = i;
                            break;
                        }
                    }

                    if(indexOfField !== -1){ //if the field has been found
                        repeatCount = parseInt(replacements[indexOfField]);
                    }
                    
                }
                if(isNaN(repeatCount)){//if whatever is in the brackets is not a valid number, continue
                    continue;
                }
                //clear out the repeat counter segment from the repeatText
                //essentially, get the part of the repeatText that actually has to be repeated
                repeatText = repeatText.replaceAll(repeatText.substring(leftBracketIndex, rightBracketIndex + 1), "");               
            }

            //replacer is the variable containing the entire repeated segment of text
            let replacer = "";
            for(let i = 0; i < repeatCount; i++){
                replacer += repeatText + "\n";
            }
            //each repeat should be separated by \n for now

            //replace the repeat statement with the repeated text
            bodyText = bodyText.replace(bodyText.substring(leftBraceIndex, rightBraceIndex + 1), replacer);
        }
        return bodyText;
    }

    //replacements: list of strings, same length as "fields"
    //questions: list of the questions in the template
    //multiplies out repeated portions of the email, if necessary
    fillInTemplate(replacements, questions){
        let bodyText = "";
        for(let i = 0; i < this.template.length; i++){
            bodyText += this.template[i];
            bodyText += "\n";
        }

        bodyText = this.parseRepeats(bodyText, replacements, questions);
        let prevBodyText = "";
        while(!General.stringEquals(bodyText, prevBodyText)){
            console.log("Iteration: " + bodyText);
            prevBodyText = bodyText;
            bodyText = this.parseRepeats(bodyText, replacements, questions);
        }
        
        return this.fillInTextFields(bodyText, replacements, questions);
    }
}