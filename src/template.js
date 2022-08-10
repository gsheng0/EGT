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
                 //if the user hasn't answered the field, do nothing
                 continue;
             }
             if(General.stringEquals(inputType, "array")){
                 //need to split answer by commas
                 let arr = replacements[i].split(",");
                 //removing leading spaces
                 for(let i = 0; i < arr.length; i++){
                     arr[i] = General.removeLeadingSpaces(arr[i]);
                 }
                 let count = 0;
                 //cycle through the array for each instance of the variable
                 while(bodyText.indexOf("$" + questions[i].id) !== -1){ 
                    bodyText = bodyText.replace("$" + questions[i].id, arr[count]);
                    count++;
                    if(count >= arr.length){
                        count = 0;
                    }
                 }
             }
             else if(General.stringEquals(inputType, "number")){
                 //makes sure the input is a number
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
            var params;
            

            //if repeat parameters exist
            if(leftBracketIndex !== -1 && rightBracketIndex !== -1 && leftBracketIndex < rightBracketIndex){
                //need to handle repeat parameters, if they exist
                /*
                repeat parameters:
                {[param1, param2, param3]TEXT_TO_BE_REPEATED}
                param1: the number of times the text is to be repeated
                param2: the string that will be placed between every repetition of the string
                
                if param2 doesn't exist, then it will be implied that param3 doesnt exist, and thus will not be used
                params that are supposed to be strings must be inbetween double quotes (")
                */
                params = repeatText.substring(leftBracketIndex + 1, rightBracketIndex).split(",");
                console.log(params);
                
                //replacing the params with the user provided values
                for(let i = 0; i < params.length; i++){
                    let field = this.getNameOfNextField(params[i], 0);
                    if(General.stringEquals(field, "")){//if there is no field to be filled in
                        break;
                    }
                    
                    //finding the right field to fill in the variable
                    let indexOfField = -1;
                    for(let i = 0; i < questions.length; i++){
                        if(General.stringEquals(field, questions[i].id)){
                            indexOfField = i;
                            break;
                        }
                    }
                    if(indexOfField !== -1){
                        params[i] = replacements[indexOfField];
                    }
                }
                //params[0] is repeat count
                //params[1] is the repetition separator

                //first parameter is always a number
                params[0] = parseInt(params[0]);
                if(isNaN(params[0])){
                    params[0] = 1;
                }

                //second parameter is a string (between double quotes)
                let firstQuoteIndex = params[1].indexOf("\"");
                let secondQuoteIndex = params[1].indexOf("\"", firstQuoteIndex)
                if(firstQuoteIndex === -1 || secondQuoteIndex === -1){
                    params[1] = "";
                }
                params[1] = params[1].substring(firstQuoteIndex + 1, secondQuoteIndex);

                //clear out the repeat statement from the repeatText
                //essentially, get the part of the repeatText that actually has to be repeated
                repeatText = repeatText.replaceAll(repeatText.substring(leftBracketIndex, rightBracketIndex + 1), "");               
            }

            //replacer is the variable containing the entire repeated segment of text
            //params[0] is the repeat count
            //params[1] is the seperater string
            let replacer = "";
            for(let i = 0; i < params[0] - 1; i++){
                replacer += repeatText + params[1];
            }
            replacer += repeatText;

            //replace the repeat statement with the repeated text
            bodyText = bodyText.replace(bodyText.substring(leftBraceIndex, rightBraceIndex + 1), replacer);
        }
        return bodyText;
    }

    //replacements: list of strings, same length as "fields"
    //questions: list of the questions in the template
    //multiplies out repeated portions of the email, if necessary
    //takes care of nested repeats
    //and fills in the non repeated variables
    fillInTemplate(replacements, questions){
        let bodyText = "";
        for(let i = 0; i < this.template.length; i++){
            bodyText += this.template[i];
            bodyText += "\n";
        }

        bodyText = this.parseRepeats(bodyText, replacements, questions);
        let prevBodyText = "";
        //while the template's repeats cannot be more unpacked
        //this while loop takes care of nested repeats
        while(!General.stringEquals(bodyText, prevBodyText)){
            prevBodyText = bodyText;
            bodyText = this.parseRepeats(bodyText, replacements, questions);
        }
        
        return this.fillInTextFields(bodyText, replacements, questions);
    }
}