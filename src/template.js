import {General} from "./util.js";

export class Question{
    //id: Field Id/name
    //sortOrder: integer
    //question: the string containing the question to be used to prompt the user
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
        this.nameEndingCharacters = ["!", ",", ".", " ", ";"];
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
    //  each element replaces the placeholder of the same index in list "fields"
    //returns list of strings representing the filled in email
    fillInTextFields1(replacements){
        let output = [];
        for(let index = 0; index < this.template.length; index++){
            let line = this.template[index];
            for(let i = 0; i < Math.min(replacements.length, this.fields.length); i++){
                if(replacements[i].valueOf() === "".valueOf()){
                    break;
                }
                console.log(this.fields[i]);
                line = line.replaceAll("$" + this.fields[i], replacements[i]);
            }
            output.push(line);
        }
        return output;
    }

    //replacements: list of strings, same length as "fields"
    //questions: list of the questions in the template
    fillInTextFields(replacements, questions){
         let bodyText = "";
         for(let i = 0; i < this.template.length; i++){
             bodyText += this.template[i];
             bodyText += "\n";
         }
         console.log(bodyText);
         
         for(let i = 0; i < Math.min(replacements.length, this.fields.length); i++){
             if(questions[i].inputType.valueOf() === "array".valueOf()){
                 //need to split answer by commas
                 let arr = General.filterSpaces(replacements[i]).split(",");
                 console.log("Arr: " + arr);
                 let count = 0;
                 while(bodyText.indexOf("$" + this.fields[i]) !== -1){
                    console.log("Index of next: " + bodyText.indexOf("$" + this.fields[i]));
                    bodyText = bodyText.replace("$" + this.fields[i], arr[count]);
                    count++;
                    if(count >= arr.length){
                        count = 0;
                    }
                 }
             }
             else{
                bodyText = bodyText.replaceAll("$" + this.fields[i], replacements[i]);
             }
         }
         return bodyText.split("\n");
    }
}