
export class Template{
    //template: list of strings representing the email
    //  first line is the subject
    //fields: list of strings representing the fields that can be filled out for the email
    constructor(template){
        this.template = template;
        this.fields = this.getFieldsFromTemplate(template);
    }

    //line: a string representing one line of the template
    //index: the index to start the search from
    //returns the name of the next field, if it exsts
    //  returns an empty string otherwise
    getNameOfNextField(line, index){
        let leftBracketIndex = line.indexOf("{", index);
        if(leftBracketIndex === -1){
            return "";
        }
        let rightBracketIndex = line.indexOf("}", index);
        if(rightBracketIndex === -1){
            return "";
        }
        return line.substring(leftBracketIndex + 1, rightBracketIndex);
    }

    //template: the list of strings received in the constructor that represents the email
    //returns the list of fields detected in the email template
    getFieldsFromTemplate(template){
        let fields = [];
        for(let i = 0; i < template.length; i++){
            let fieldsFromLine = this.getFieldsFromLine(template[i]);
            console.log("Fields from line: " + fieldsFromLine);
            for(let x = 0; x < fieldsFromLine.length; x++){
                if(!fields.includes(fieldsFromLine[x])){ //checks to see if the field already exists in the list
                    fields.push(fieldsFromLine[x]);
                }
            }
        }

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
            index = line.indexOf("}", index) + 1;
        }
        return fields;
    }

    //replacements: list of strings, same length as "fields"
    //  each element replaces the placeholder of the same index in list "fields"
    //returns list of strings representing the filled in email
    fillInTextFields(replacements){
        let output = [];
        for(let index = 0; index < this.template.length; index++){
            let line = this.template[index];
            for(let i = 0; i < Math.min(replacements.length, this.fields.length); i++){
                line = line.replaceAll("{" + this.fields[i] + "}", replacements[i]);
            }
            output.push(line);
        }
        return output;

        
    }



    
}