require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public")); 	

mongoose.connect("mongodb+srv://admin-garvit:"+process.env.PASSWORD+"@cluster0.m6myqcq.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name :String
});

const Item = new mongoose.model("Item",itemSchema); //in double quotes always give singular name
const work1 = new Item({
    name : "Welcome to ToDoList"
});
const work2 = new Item({
    name : "Hit the + button to add new task"
});
const work3 = new Item({
    name : "Check the box if task is completed"
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = new mongoose.model("List",listSchema);
const defaultArray = [work1,work2,work3];



//-----------------------------------------------------------------------------------------------------------
const date = require(__dirname + "/myModule.js");
const day = date.getDate();
/*SMALL EXPLANATION ABOUT HOW WE CONTROLLED ADDING SAME DATA AGAIN AND AGAIN TO OUR DATABASE BY USING IF-ELSE AND NOT BY ANY PREDEFINED METHOD
  BY MONGOOSE*/

  app.get("/",function(req,res){ 
    

    Item.find({},function(err,results){
        if(err){
            console.log("Error occurred displaying the data.");
        }
        else if(results.length===0){
            
            Item.insertMany(defaultArray,function(err){
                if(err){
                    console.log("Error occurred while adding default items!");
                }
                else{
                    console.log("Successfully added default items!");
                }
            });
            res.redirect("/");
        }else{
            res.render('list', {ListTitle: "Today", items: results});
        } 
        
    });

  	
}); 
/*app.get("/work",function(req,res){
    res.render('list',{ListTitle:"Work",items: workItems});
});*/
app.get("/about",function(req,res){
    res.render('about');
});
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    //console.log(checkedItemId);
    const listName = req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndDelete(checkedItemId,function(){

        });
        res.redirect("/");
    }
    else{
        /*List.findOne({name:listName},function(err,results){
            const index = results.items.indexOf(checkedItemId);
            console.log(index);
            // only splice array when item is found
                results.items.splice(index, 1); // 2nd parameter means remove one item only
                res.redirect("/"+listName);
        });*/ //WON'T WORK
        List.findOneAndUpdate({name:listName},{$pull:{items :{_id : checkedItemId}}},function(err){
            if(!err){
                console.log("Successfully updated custom list!");
                res.redirect("/"+listName);
            }
        });
        

    }
    
});
app.post("/",function(req,res){
    const itemName = req.body.item;
    const list= req.body.List;
    const work=new Item({
        name: itemName
    });
    if(list==="Today"){
        work.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:list},function(err,results){
            results.items.push(work);
            results.save();
            res.redirect("/"+list);
        });
        
    }
    
    
    
    /*if(req.body.List=== "Work"){    //Checking where req has taken place
        var item=req.body.item;
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        var item = req.body.item;
        items.push(item);
        res.redirect("/");
    }*/
    
});

app.get("/:customList",function(req,res){
    const listName = _.capitalize(req.params.customList);
    
    List.findOne({name:listName},function(err,found){
        if(!err){
            if(!found){
                console.log("List does not exists");
                //Creating new lists as does not exists
                const list = new List({
                    name : listName,
                    items : defaultArray
                });
                list.save();
                res.redirect("/"+listName);
            }
            else{
                console.log("List exists");
                res.render('list',{ListTitle: listName, items: found.items})
            }
        }
        
    });
    
});






/*let port = process.env.PORT;
if(port===null || port===""){
    port=3000;
}*/
app.listen(3000,function(){
    console.log("Server started at 3000");
});